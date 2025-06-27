modalOverlay// modal.js
document.addEventListener("DOMContentLoaded", () => {
  /* 1. 图片文件名列表 */
  const photoFiles = [
    "dancer.png", "dancer (2).png", "dancer (3).png", "dancer (4).png",
    "dancer (5).png", "dancer (6).png", "dancer (7).png", "dancer (8).png",
    "dancer (9).png", "dancer (10).png", "dancer (11).png", "dancer (12).png",
    "dancer13.jpg", "dancer14.jpg", "dancer15.jpg"
  ];

  const loadPhotos = () => {
    const box = document.querySelector(".photos");
    if (!box) return;
    box.innerHTML = '';
    
    photoFiles.forEach(name => {
      const img = new Image();
      img.src = `assets/photo/${name}`;
      img.alt = name;
      img.loading = "lazy";
      img.classList.add("gallery-img");
      box.appendChild(img);
    });
  };

  const setupModal = () => {
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeModal");
    const videoIframe = document.querySelector(".videoWrap iframe"); // 获取视频iframe
    
    if (!overlay || !closeBtn) return;

    // 停止视频播放的函数
    const stopVideo = () => {
      if (videoIframe) {
        // 替换src来停止视频（YouTube适用）
        videoIframe.src = videoIframe.src.replace('autoplay=1', 'autoplay=0');
        // 或者使用API（如果有的话）
        // videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    };

    const openModal = () => {
      overlay.classList.remove("hidden");
      
      document.body.style.overflow = "hidden";
      loadPhotos();
    };

    const closeModal = () => {
      overlay.classList.add("hidden");
      document.body.style.overflow = "";
      stopVideo(); // 关闭时停止视频
    };

    const openBtn = document.getElementById("openModal");
    if (openBtn) {
      openBtn.addEventListener("click", openModal);
    }
    
    closeBtn.addEventListener("click", closeModal);
    
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeModal();
      }
    });
  };

  setupModal();
});