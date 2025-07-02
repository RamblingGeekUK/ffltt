const videoGrid = document.getElementById("videoGrid");
videoGrid.style.display = "none";

fetch("/api/latest-videos")
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(videos => {
    const grid = document.getElementById("videoGrid");
    grid.innerHTML = "";
    if (videos.length === 0) {
      grid.innerHTML = '<div class="text-center text-info w-100 py-5">No videos found.</div>';
    } else {
      videos.forEach(video => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 col-12 d-flex";
        if (video.ad) {
          // Render AD card
          col.innerHTML = `
            <div class="card h-100 shadow-lg border-0 border-warning" style="border-width: 2px !important;">
              <img src="${video.thumbnail}" class="card-img-top" alt="${video.channel}" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem; object-fit: cover; height: 220px; background: #23272a;">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title fw-semibold text-warning">${video.channel} <span style="font-size:0.8em;" class="badge bg-warning text-dark ms-2">NOT AN AD</span></h5>
                <a href="${video.website}" target="_blank" class="btn btn-warning w-100 mt-auto">Visit Website</a>
              </div>
            </div>
          `;
        } else {
          // Render normal video card
          col.innerHTML = `
            <div class="card h-100 shadow-lg border-0">
              <img src="${video.thumbnail}" class="card-img-top" alt="${video.title}" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem; object-fit: cover; height: 220px; background: #23272a;">
              <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex align-items-center mb-2 mt-2">
                  <span style="color: #b0b3b8; font-size: 1.05em;">${video.channel}</span>
                </div>
                <div class="social-icons mb-2">
                  ${video.socials && video.socials.youtube && video.socials.youtube.visible ? `<a href="${video.socials.youtube.url}" target="_blank" title="YouTube" class="ms-1"><svg width="20" height="20" fill="#ff0000" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>` : ''}
                  ${video.socials && video.socials.twitter && video.socials.twitter.visible ? `<a href="${video.socials.twitter.url}" target="_blank" title="Twitter" class="ms-1"><svg width="20" height="20" fill="#1da1f2" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>` : ''}
                  ${video.socials && video.socials.bluesky && video.socials.bluesky.visible ? `<a href="${video.socials.bluesky.url}" target="_blank" title="Bluesky" class="ms-1"><svg width="20" height="20" fill="#0077ff" viewBox="0 0 24 24"><path d="M12 2c1.657 0 3 1.343 3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3zm0 18c-1.657 0-3-1.343-3-3 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3zm9-9c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3zm-18 0c0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3s-3 1.343-3 3z"/></svg></a>` : ''}
                  ${video.socials && video.socials.instagram && video.socials.instagram.visible ? `<a href="${video.socials.instagram.url}" target="_blank" title="Instagram" class="ms-1"><svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" stroke="#fff" stroke-width="1.5" fill="none"/><rect x="8.5" y="8.5" width="7" height="7" rx="2" stroke="#fff" stroke-width="1.5" fill="none"/><circle cx="16.2" cy="7.8" r="1.1" fill="#fff"/></svg></a>` : ''}
                </div>
                <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" class="btn btn-primary w-100 mt-auto">Watch</a>
              </div>
            </div>
          `;
        }
        grid.appendChild(col);
      });
    }
    videoGrid.style.display = "";
  })
  .catch(err => {
    videoGrid.style.display = "";
    console.error("Failed to load videos", err);
  });
