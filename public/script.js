fetch("/api/latest-videos")
  .then(res => res.json())
  .then(videos => {
    const grid = document.getElementById("videoGrid");
    videos.forEach(video => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card h-100 shadow-lg border-0">
          <img src="${video.thumbnail}" class="card-img-top" alt="${video.title}" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem; object-fit: cover; height: 220px; background: #23272a;">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title fw-semibold" style="color: #f8fafb;">${video.title}</h5>
            <p class="card-text mb-2"><small style="color: #b0b3b8;">${video.channel}</small></p>
            <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank" class="btn btn-primary w-100 mt-auto">Watch</a>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  })
  .catch(err => {
    console.error("Failed to load videos", err);
  });
