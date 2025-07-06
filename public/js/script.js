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
    // Only show FullyForked channels (and ads)
    let filtered = videos.filter(c => c.FullyForked === true || c.ad);
    // Shuffle the filtered array
    filtered = filtered.sort(() => Math.random() - 0.5);
    const grid = document.getElementById("videoGrid");
    grid.innerHTML = "";
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="text-center text-info w-100 py-5">No creators found.</div>';
    } else {
      filtered.forEach(channel => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 col-12 d-flex";
        if (channel.ad) {
          // Render AD card
          col.innerHTML = `
            <div class="card h-100 shadow-lg border-0 border-warning" style="border-width: 2px !important;">
              <img src="${channel.thumbnail || channel.image || ''}" class="card-img-top" alt="${channel.name || channel.channel}" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem; object-fit: cover; height: 220px; background: #23272a;">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title fw-semibold text-warning">${channel.name || channel.channel} <span style="font-size:0.8em;" class="badge bg-warning text-dark ms-2">NOT AN AD</span></h5>
                <a href="${channel.website}" target="_blank" class="btn btn-warning w-100 mt-auto">Visit Website</a>
              </div>
            </div>
          `;
        } else {
          // Render normal channel card with latest video thumbnail
          col.innerHTML = `
            <div class="card h-100 shadow-lg border-0">
              <a href="https://youtube.com/watch?v=${channel.videoId}" target="_blank">
                <img src="${channel.thumbnail || ''}" class="card-img-top" alt="${channel.name}" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem; object-fit: cover; height: 220px; background: #23272a;">
              </a>
              <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex align-items-center mb-2 mt-2">
                  <span style="color: #b0b3b8; font-size: 1.05em;">${channel.name || channel.channel}</span>
                </div>
                <div class="mb-2">
                  <span style="font-size:0.95em; color:#aaa;">${channel.title ? channel.title : ''}</span>
                </div>
                <div class="social-icons mb-2">
                  ${channel.socials && channel.socials.youtube && channel.socials.youtube.visible ? `<a href="${channel.socials.youtube.url}" target="_blank" title="YouTube" class="ms-1"><svg width="20" height="20" fill="#ff0000" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.twitter && channel.socials.twitter.visible ? `<a href="${channel.socials.twitter.url}" target="_blank" title="Twitter" class="ms-1"><svg width="20" height="20" fill="#1da1f2" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.bluesky && channel.socials.bluesky.visible ? `<a href="${channel.socials.bluesky.url}" target="_blank" title="Bluesky" class="ms-1"><svg width="20" height="20" fill="#0077ff" viewBox="0 0 24 24"><path d="M12 2c1.657 0 3 1.343 3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3zm0 18c-1.657 0-3-1.343-3-3 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3zm9-9c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3zm-18 0c0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3s-3 1.343-3 3z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.instagram && channel.socials.instagram.visible ? `<a href="${channel.socials.instagram.url}" target="_blank" title="Instagram" class="ms-1"><svg width="20" height="20" fill="#E4405F" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.website && channel.socials.website.visible ? `<a href="${channel.socials.website.url}" target="_blank" title="Website" class="ms-1"><svg width="20" height="20" fill="#8f94fb" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.twitch && channel.socials.twitch.visible ? `<a href="${channel.socials.twitch.url}" target="_blank" title="Twitch" class="ms-1"><svg width="20" height="20" fill="#9146FF" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.soundcloud && channel.socials.soundcloud.visible ? `<a href="${channel.socials.soundcloud.url}" target="_blank" title="SoundCloud" class="ms-1"><svg width="20" height="20" fill="#FF5500" viewBox="0 0 24 24"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.255-2.154c-.009-.054-.049-.1-.099-.1zm1.909-.414c-.058 0-.107.049-.107.107l-.191 2.082.191 2.027c0 .058.049.107.107.107.057 0 .106-.049.106-.107l.217-2.027-.217-2.082c0-.058-.049-.107-.106-.107zm1.893-.107c-.063 0-.114.051-.114.114l-.179 2.189.179 2.103c0 .063.051.114.114.114.062 0 .113-.051.113-.114l.204-2.103-.204-2.189c0-.063-.051-.114-.113-.114zm1.872-.007c-.068 0-.123.055-.123.123l-.166 2.196.166 2.103c0 .068.055.123.123.123.067 0 .122-.055.122-.123l.189-2.103-.189-2.196c0-.068-.055-.123-.122-.123zm1.854.054c-.072 0-.131.059-.131.131l-.154 2.142.154 2.076c0 .072.059.131.131.131.071 0 .13-.059.13-.131l.176-2.076-.176-2.142c0-.072-.059-.131-.13-.131zm1.833.014c-.077 0-.139.062-.139.139l-.142 2.128.142 2.051c0 .077.062.139.139.139.076 0 .138-.062.138-.139l.161-2.051-.161-2.128c0-.077-.062-.139-.138-.139zm1.814.028c-.081 0-.147.066-.147.147l-.132 2.1.132 2.021c0 .081.066.147.147.147.08 0 .146-.066.146-.147l.15-2.021-.15-2.1c0-.081-.066-.147-.146-.147zm1.814.009c-.085 0-.154.069-.154.154l-.119 2.091.119 2.01c0 .085.069.154.154.154.084 0 .153-.069.153-.154l.135-2.01-.135-2.091c0-.085-.069-.154-.153-.154zm4.002 1.706c-.139 0-.265.058-.356.151-.09.094-.146.221-.146.357v4.28c0 .278.226.504.504.504h8.024c.278 0 .504-.226.504-.504v-4.28c0-.278-.226-.504-.504-.504z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials['ko-fi'] && channel.socials['ko-fi'].visible ? `<a href="${channel.socials['ko-fi'].url}" target="_blank" title="Ko-fi" class="ms-1"><svg width="20" height="20" fill="#FF5E5B" viewBox="0 0 24 24"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.316c.049 4.049 3.314 4.564 3.314 4.564s8.505.023 11.979-.003c3.475-.026 8.44-1.056 8.44-8.07 0-7.013.37-11.418-.863-4.012zm-6.069 7.75c0 .329-.264.594-.594.594H9.281c-.33 0-.594-.265-.594-.594V9.281c0-.33.264-.594.594-.594h7.937c.33 0 .594.264.594.594v7.417z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.etsy && channel.socials.etsy.visible ? `<a href="${channel.socials.etsy.url}" target="_blank" title="Etsy" class="ms-1"><svg width="20" height="20" fill="#F56400" viewBox="0 0 24 24"><path d="M9.16 12.5v-.843c0-.28-.225-.505-.504-.505s-.504.225-.504.505v.843c0 .28.225.504.504.504s.504-.224.504-.504zM7.65 15.96c-.654 0-1.186-.533-1.186-1.187v-5.546c0-.654.532-1.187 1.186-1.187.655 0 1.187.533 1.187 1.187v5.546c0 .654-.532 1.187-1.187 1.187zm8.77-.283c0 .252-.204.456-.455.456-.252 0-.456-.204-.456-.456V8.546c0-.252.204-.456.456-.456.251 0 .455.204.455.456v7.131z"/></svg></a>` : ''}
                  ${channel.socials && channel.socials.fediverse && channel.socials.fediverse.visible ? `<a href="${channel.socials.fediverse.url}" target="_blank" title="Fediverse" class="ms-1"><svg width="20" height="20" fill="#663399" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 7.178l-2.3 8.625c-.171.641-.621.793-1.258.491l-3.475-2.57-1.677 1.612c-.185.186-.341.341-.701.341l.25-3.562 6.462-5.839c.281-.25-.061-.389-.436-.139L8.913 11.178l-3.349-1.051c-.729-.228-.743-.729.151-1.078l13.082-5.048c.607-.228 1.139.139.942 1.077z"/></svg></a>` : ''}
                </div>
                <a href="https://youtube.com/watch?v=${channel.videoId}" target="_blank" class="btn btn-primary w-100 mt-auto">Watch Latest Video</a>
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
    console.error("Failed to load creators", err);
  });
