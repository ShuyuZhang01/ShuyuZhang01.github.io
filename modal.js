// modal.js（确保位于仓库根目录）
window.addEventListener("DOMContentLoaded", () => {

  /* 1. 图片文件名列表 */
  const photoFiles = [
    "dancer.png","dancer (2).png","dancer (3).png","dancer (4).png",
    "dancer (5).png","dancer (6).png","dancer (7).png","dancer (8).png",
    "dancer (9).png","dancer (10).png","dancer (11).png","dancer (12).png",
    "dancer (13).jpg","dancer (14).jpg","dancer (15).jpg"
  ];

  /* 2. 动态生成 <img> */
  const box = document.querySelector(".photos");
  photoFiles.forEach(name => {
    const img = document.createElement("img");
    img.src = `assets/photo/${name}`;   // ← 路径相对于 works.html
    img.alt = name;
    box.appendChild(img);
  });

  /* 3. 开关逻辑 */
  const overlay = document.getElementById("overlay");
  document.getElementById("openModal").onclick = () => overlay.classList.remove("hidden");
  document.getElementById("closeModal").onclick = () => overlay.classList.add("hidden");
});
