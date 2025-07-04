require("dotenv").config();
const express = require("express");
const nodemailer = require('nodemailer');
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const YT_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.static("public"));


// Branching Out videos endpoint
app.get("/api/branching-out-videos", async (req, res) => {
  const CACHE_FILE = "branchingOutVideos.json";
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  try {
    let useCache = false;
    let cacheExists = fs.existsSync(CACHE_FILE);
    if (cacheExists) {
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

    const channels = JSON.parse(fs.readFileSync("branchingOutChannels.json"));
    const results = [];
    for (const channel of channels) {
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
      console.log('Fetching (Branching Out):', apiUrl);
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
          thumbnail: video.snippet.thumbnails.high.url,
          socials: channel.socials || {}
        });
      }
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(results, null, 2));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Branching Out videos" });
  }
});

// --- Submit Creator Endpoint ---
app.post('/api/submit-creator', express.json(), async (req, res) => {
  const { name, youtube, twitter, instagram, bluesky, turnstileToken } = req.body;
  if (!name || !youtube) return res.status(400).json({ error: 'Missing required fields' });
  if (!turnstileToken) return res.status(400).json({ error: 'Missing CAPTCHA' });
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: turnstileToken
      })
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(400).json({ error: 'CAPTCHA failed' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'CAPTCHA verification error' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });

  // Compose email body
  let text = `New Creator Submission\n`;
  text += `Name: ${name}\n`;
  text += `YouTube: ${youtube}\n`;
  if (twitter) text += `Twitter/X: ${twitter}\n`;
  if (instagram) text += `Instagram: ${instagram}\n`;
  if (bluesky) text += `BlueSky: ${bluesky}\n`;

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_EMAIL_USER,
      to: process.env.CONTACT_EMAIL_USER,
      subject: 'New Creator Submission',
      text
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Cache info endpoint for frontend footer
app.get('/api/cache-info', (req, res) => {
  const CACHE_FILE = 'latestVideos.json';
  const CACHE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
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

app.use(express.static("public"));

app.post('/api/contact', express.json(), async (req, res) => {
  const { name, email, message, turnstileToken } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
  // Cloudflare Turnstile verification
  if (!turnstileToken) return res.status(400).json({ error: 'Missing CAPTCHA' });
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: turnstileToken
      })
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(400).json({ error: 'CAPTCHA failed' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'CAPTCHA verification error' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });

  // Compose email body
  let text = `Contact Form Submission\n`;
  text += `Name: ${name}\n`;
  text += `Email: ${email}\n`;
  text += `Message: ${message}\n`;

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_EMAIL_USER,
      to: process.env.CONTACT_EMAIL_USER,
      subject: 'Contact Form Submission',
      text
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get("/api/latest-videos", async (req, res) => {
  const CACHE_FILE = "latestVideos.json";
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms (once a week)
  try {
    let useCache = false;
    let cacheExists = fs.existsSync(CACHE_FILE);
    if (cacheExists) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < CACHE_TTL) {
        useCache = true;
      }
    }

    // Fallback: use static cache if present and no cache file exists
    if (!cacheExists && fs.existsSync('static-latestVideos.json')) {
      const fallback = JSON.parse(fs.readFileSync('static-latestVideos.json'));
      const shuffled = fallback.slice().sort(() => Math.random() - 0.5);
      return res.json(shuffled);
    }

    if (useCache) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE));
      // Shuffle cached results before sending
      const shuffled = cached.slice().sort(() => Math.random() - 0.5);
      return res.json(shuffled);
    }

    const channels = JSON.parse(fs.readFileSync("channels.json"));
    const results = [];

    // Shuffle channels array for random order
    const shuffledChannels = channels.slice().sort(() => Math.random() - 0.5);
    for (const channel of shuffledChannels) {
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
          title: video.snippet.title,
          videoId: video.id.videoId,
          thumbnail: video.snippet.thumbnails.high.url,
          socials: channel.socials || {}
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
