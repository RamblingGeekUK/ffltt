require("dotenv").config();
const express = require("express");
const nodemailer = require('nodemailer');
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const YT_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.static("public"));
app.use('/data', express.static('data'));

// Cache info endpoint for frontend footer
app.get('/api/cache-info', (req, res) => {
  const CACHE_FILE = 'data/latestVideos.json';
  const CACHE_TTL = 48 * 60 * 60; // 48 hours in seconds
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return res.json({ lastUpdated: null, ttl: CACHE_TTL });
    }
    const stats = fs.statSync(CACHE_FILE);
    return res.json({
      lastUpdated: stats.mtime,
      ttl: CACHE_TTL
    });
  } catch (e) {
    return res.status(500).json({ lastUpdated: null, ttl: CACHE_TTL });
  }
});

app.get("/api/latest-videos", async (req, res) => {
  const CACHE_FILE = "data/latestVideos.json";
  const CACHE_TTL = 48 * 60 * 60; // 48 hours in seconds
  try {
    let useCache = false;
    let cacheExists = fs.existsSync(CACHE_FILE);
    if (cacheExists) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < CACHE_TTL * 1000) {
        useCache = true;
      }
    }

    // Fallback: use static cache if present and no cache file exists
    if (!cacheExists && fs.existsSync('data/static-latestVideos.json')) {
      const fallback = JSON.parse(fs.readFileSync('data/static-latestVideos.json'));
      const shuffled = fallback.slice().sort(() => Math.random() - 0.5);
      return res.json(shuffled);
    }

    if (useCache) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE));
      // Shuffle cached results before sending
      const shuffled = cached.slice().sort(() => Math.random() - 0.5);
      return res.json(shuffled);
    }

    const channels = JSON.parse(fs.readFileSync("data/channels.json"));
    const results = [];
    const seenChannels = new Set();

    // Shuffle channels array for random order
    const shuffledChannels = channels.slice().sort(() => Math.random() - 0.5);
    for (const channel of shuffledChannels) {
      // Use channelId if available, else fallback to name for deduplication
      const uniqueKey = channel.channelId || channel.name;
      if (seenChannels.has(uniqueKey)) continue;
      seenChannels.add(uniqueKey);

      if (channel.ad) {
        results.push({
          channel: channel.name,
          ad: true,
          title: null,
          videoId: null,
          thumbnail: channel.image,
          website: channel.website
        });
        continue;
      }
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channel.channelId}&order=date&part=snippet&type=video&maxResults=1`;
      console.log('Fetching:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.error) {
        console.error('YouTube API error:', data.error);
      }

      const video = data.items?.[0];
      if (video) {
        results.push({
          channel: channel.name,
          FullyForked: channel.FullyForked === true,
          title: video.snippet.title,
          videoId: video.id.videoId,
          thumbnail: video.snippet.thumbnails.high.url,
          socials: channel.socials || {},
          website: channel.socials && channel.socials.website && channel.socials.website.url ? channel.socials.website.url : undefined
        });
      }
    }

    fs.writeFileSync(CACHE_FILE, JSON.stringify(results, null, 2));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));