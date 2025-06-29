/* cursorParticles.js – add sparkle to your cursor ✨ */
(() => {
  console.log('粒子特效脚本已加载'); // 调试信息
  
  const colors = ['#7dd3fc', '#38bdf8', '#bae6fd', '#0ea5e9']; // 随机配色
  let lastX = -100, lastY = -100;

  document.addEventListener('mousemove', e => {
    // 若移动距离太小就忽略，减少 DOM 创建
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.hypot(dx, dy) < 4) return;
    lastX = e.clientX; lastY = e.clientY;

    // 同一帧里生成 2~3 个粒子
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('span');
      p.className = 'particle';

      // 尺寸 & 颜色 - 使用随机颜色
      const size = 4 + Math.random() * 4;
      p.style.width = p.style.height = `${size}px`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];

      // 起点
      p.style.left = `${e.clientX}px`;
      p.style.top  = `${e.clientY}px`;

      // 注入随机方向位移
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 40 + Math.random() * 80;  // 像素
      p.style.setProperty('--dx', `${Math.cos(angle) * speed}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * speed}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800); // 与动画时长保持一致
    }
  });
  
  console.log('鼠标事件监听器已添加'); // 调试信息
})();
