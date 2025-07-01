
require("dotenv").config();
const express = require("express");
const nodemailer = require('nodemailer');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.static("public"));

app.post('/api/contact', express.json(), async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Missing fields' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL_USER,
      subject: 'Contact Form Submission',
      text: message
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get("/api/latest-videos", async (req, res) => {
  const CACHE_FILE = "latestVideos.json";
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms
  try {
    let useCache = false;
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < CACHE_TTL) {
        useCache = true;
      }
    }

    if (useCache) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE));
      return res.json(cached);
    }

    const channels = JSON.parse(fs.readFileSync("channels.json"));
    const results = [];

    for (const channel of channels) {
      if (channel.ad) {
        // AD entry: push as a special video object
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
          title: video.snippet.title,
          videoId: video.id.videoId,
          thumbnail: video.snippet.thumbnails.high.url
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
