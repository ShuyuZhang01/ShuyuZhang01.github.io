// modal.js
document.addEventListener("DOMContentLoaded", () => {
  /* 1. 图片文件名列表 */
  const photoFiles = [
    "dancer.png", "dancer (2).png", "dancer (3).png", "dancer (4).png",
    "dancer (5).png", "dancer (6).png", "dancer (7).png", "dancer (8).png",
    "dancer (9).png", "dancer (10).png", "dancer (11).png", "dancer (12).png",
    "dancer13.jpg", "dancer14.jpg", "dancer15.jpg"
  ];

  /* 2. 动态生成 <img> - 更安全的版本 */
  const loadPhotos = () => {
    const box = document.querySelector(".photos");
    if (!box) return; // 确保元素存在
    
    // 清空现有内容（避免重复加载）
    box.innerHTML = '';
    
    photoFiles.forEach(name => {
      const img = new Image();
      img.src = `assets/photo/${name}`;
      img.alt = name;
      img.loading = "lazy"; // 懒加载
      img.classList.add("gallery-img"); // 添加类名方便样式控制
      box.appendChild(img);
    });
  };

  /* 3. 改进的开关逻辑 */
  const setupModal = () => {
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeModal");
    
    if (!overlay || !closeBtn) return; // 确保元素存在

    // 打开modal时加载照片
    const openModal = () => {
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // 禁止背景滚动
      loadPhotos();
    };

    // 关闭modal
    const closeModal = () => {
      overlay.classList.add("hidden");
      document.body.style.overflow = ""; // 恢复背景滚动
    };

    // 事件监听（更安全的写法）
    const openBtn = document.getElementById("openModal");
    if (openBtn) {
      openBtn.addEventListener("click", openModal);
    }
    
    closeBtn.addEventListener("click", closeModal);
    
    // 点击modal外部关闭
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    
    // ESC键关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeModal();
      }
    });
  };

  // 初始化
  setupModal();
});