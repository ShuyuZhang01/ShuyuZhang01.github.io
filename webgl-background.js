// WebGL Background Effect using Three.js
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.stars = null;
    this.waves = null;
    this.animationId = null;
    this.time = 0;
    
    console.log('WebGLBackground: 初始化开始');
    this.init();
  }

  init() {
    // 检查是否为主页
    if (this.isHomePage()) {
      console.log('WebGLBackground: 主页检测到，跳过WebGL背景初始化');
      return;
    }
    
    console.log('WebGLBackground: 开始初始化检查');
    
    // 检查是否支持WebGL
    if (!this.isWebGLAvailable()) {
      console.log('WebGLBackground: WebGL not supported, 使用CSS备选方案');
      this.createCSSFallback();
      return;
    }

    // 检查Three.js是否可用
    if (typeof THREE === 'undefined') {
      console.log('WebGLBackground: Three.js not loaded, 使用CSS备选方案');
      this.createCSSFallback();
      return;
    }

    console.log('WebGLBackground: Three.js版本', THREE.REVISION);
    console.log('WebGLBackground: 浏览器信息', navigator.userAgent);

    try {
      // 初始化Three.js
      this.initThreeJS();
      
      // 创建多种粒子效果
      this.createParticles();
      this.createStars();
      this.createWaves();
      
      // 开始动画
      this.animate();
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => this.onWindowResize());
      
      console.log('WebGLBackground: 初始化成功');
    } catch (error) {
      console.error('WebGLBackground: 初始化失败', error);
      console.error('WebGLBackground: 错误堆栈', error.stack);
      console.log('WebGLBackground: 使用CSS备选方案');
      this.createCSSFallback();
    }
  }

  isHomePage() {
    // 检查是否为主页（index.html）
    const currentPath = window.location.pathname;
    const isIndex = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    console.log('WebGLBackground: 当前页面路径:', currentPath, '是否为主页:', isIndex);
    return isIndex;
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.log('WebGLBackground: WebGL context not available');
        return false;
      }
      console.log('WebGLBackground: WebGL supported');
      console.log('WebGLBackground: WebGL vendor', gl.getParameter(gl.VENDOR));
      console.log('WebGLBackground: WebGL renderer', gl.getParameter(gl.RENDERER));
      console.log('WebGLBackground: WebGL version', gl.getParameter(gl.VERSION));
      return true;
    } catch (e) {
      console.log('WebGLBackground: WebGL check failed', e);
      return false;
    }
  }

  createCSSFallback() {
    console.log('WebGLBackground: 创建CSS备选方案');
    
    // 创建CSS粒子背景
    const cssContainer = document.createElement('div');
    cssContainer.id = 'css-particles-background';
    cssContainer.style.position = 'fixed';
    cssContainer.style.top = '0';
    cssContainer.style.left = '0';
    cssContainer.style.width = '100%';
    cssContainer.style.height = '100%';
    cssContainer.style.zIndex = '-1';
    cssContainer.style.opacity = '0.15';
    cssContainer.style.pointerEvents = 'none';
    cssContainer.style.overflow = 'hidden';
    
    // 创建多种类型的CSS粒子
    for (let i = 0; i < 80; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      
      // 随机选择粒子类型
      const particleType = Math.random();
      if (particleType < 0.4) {
        // 小粒子
        particle.style.width = '1px';
        particle.style.height = '1px';
        particle.style.backgroundColor = '#9ca3af';
        particle.style.animation = `float ${4 + Math.random() * 6}s infinite linear`;
      } else if (particleType < 0.7) {
        // 中等粒子
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = '#6b7280';
        particle.style.animation = `float ${3 + Math.random() * 4}s infinite linear`;
      } else {
        // 大粒子
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = '#4b5563';
        particle.style.animation = `float ${5 + Math.random() * 3}s infinite linear`;
      }
      
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 3 + 's';
      
      cssContainer.appendChild(particle);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0px) translateX(0px) rotate(0deg);
          opacity: 0.3;
        }
        25% {
          transform: translateY(-30px) translateX(15px) rotate(90deg);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-60px) translateX(-15px) rotate(180deg);
          opacity: 0.3;
        }
        75% {
          transform: translateY(-30px) translateX(-30px) rotate(270deg);
          opacity: 0.6;
        }
        100% {
          transform: translateY(0px) translateX(0px) rotate(360deg);
          opacity: 0.3;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cssContainer);
    
    console.log('WebGLBackground: CSS备选方案创建成功');
  }

  initThreeJS() {
    console.log('WebGLBackground: 开始初始化Three.js');
    
    // 创建场景
    this.scene = new THREE.Scene();
    console.log('WebGLBackground: 场景创建成功');
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 1;
    console.log('WebGLBackground: 相机创建成功');
    
    // 创建渲染器
    console.log('WebGLBackground: 开始创建渲染器');
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    });
    console.log('WebGLBackground: 渲染器创建成功');
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 设置canvas样式
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex = '-1';
    this.renderer.domElement.style.pointerEvents = 'none';
    
    console.log('WebGLBackground: Canvas样式设置完成');
    console.log('WebGLBackground: Canvas元素', this.renderer.domElement);
    
    // 直接添加到body
    document.body.appendChild(this.renderer.domElement);
    console.log('WebGLBackground: Canvas已添加到body');
    console.log('WebGLBackground: Three.js初始化成功', this.renderer.domElement);
  }

  createParticles() {
    console.log('WebGLBackground: 开始创建主粒子系统');
    
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // 生成随机位置、颜色和大小
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z
      
      // 灰色系颜色，不同亮度
      const gray = 0.4 + Math.random() * 0.6; // 0.4-1.0 的灰色
      colors[i * 3] = gray;     // r
      colors[i * 3 + 1] = gray; // g
      colors[i * 3 + 2] = gray; // b
      
      // 随机大小
      sizes[i] = 0.02 + Math.random() * 0.08;
    }
    
    console.log('WebGLBackground: 粒子数据生成完成');
    
    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    console.log('WebGLBackground: 几何体创建完成');
    
    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      map: this.createParticleTexture()
    });
    console.log('WebGLBackground: 材质创建完成');
    
    // 创建粒子系统
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    console.log('WebGLBackground: 主粒子系统创建成功，粒子数量:', particleCount);
  }

  createStars() {
    console.log('WebGLBackground: 开始创建星星系统');
    
    const starCount = 50;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    // 生成星星位置和颜色
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
      
      // 星星颜色 - 白色到淡蓝色
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness;     // r
      colors[i * 3 + 1] = brightness; // g
      colors[i * 3 + 2] = brightness + 0.1; // b (稍微偏蓝)
    }
    
    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    // 创建星星系统
    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
    console.log('WebGLBackground: 星星系统创建成功，星星数量:', starCount);
  }

  createWaves() {
    console.log('WebGLBackground: 开始创建波浪效果');
    
    // 创建波浪几何体
    const geometry = new THREE.PlaneGeometry(4, 4, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    
    this.waves = new THREE.Mesh(geometry, material);
    this.waves.position.z = -2;
    this.scene.add(this.waves);
    console.log('WebGLBackground: 波浪效果创建成功');
  }

  createParticleTexture() {
    // 创建粒子纹理
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // 创建径向渐变
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  animate() {
    console.log('WebGLBackground: 开始动画循环');
    
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.01;
    
    // 主粒子动画
    if (this.particles) {
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.0008;
      
      // 粒子位置动画
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(this.time + i * 0.1) * 0.001;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // 星星动画
    if (this.stars) {
      this.stars.rotation.z += 0.0003;
      
      // 星星闪烁效果
      const colors = this.stars.geometry.attributes.color.array;
      for (let i = 0; i < colors.length; i += 3) {
        const brightness = 0.7 + Math.sin(this.time * 2 + i) * 0.3;
        colors[i] = brightness;
        colors[i + 1] = brightness;
        colors[i + 2] = brightness + 0.1;
      }
      this.stars.geometry.attributes.color.needsUpdate = true;
    }
    
    // 波浪动画
    if (this.waves) {
      this.waves.rotation.z += 0.001;
      this.waves.material.opacity = 0.05 + Math.sin(this.time) * 0.05;
    }
    
    // 渲染场景
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onWindowResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    // 移除CSS备选方案
    const cssContainer = document.getElementById('css-particles-background');
    if (cssContainer) {
      cssContainer.remove();
    }
  }
}

// 等待Three.js加载完成
function initWebGLBackground() {
  console.log('initWebGLBackground: 检查Three.js...');
  
  if (typeof THREE !== 'undefined') {
    console.log('initWebGLBackground: Three.js已加载，开始初始化WebGL背景');
    new WebGLBackground();
  } else {
    console.log('initWebGLBackground: Three.js未加载，等待...');
    // 等待一段时间后重试
    setTimeout(initWebGLBackground, 100);
  }
}

// 当页面加载完成后初始化WebGL背景
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: 页面加载完成，开始初始化WebGL背景');
  initWebGLBackground();
});

// 备用初始化方法
window.addEventListener('load', function() {
  console.log('window.load: 页面完全加载，检查WebGL背景');
  if (typeof THREE !== 'undefined' && !document.querySelector('canvas') && !document.getElementById('css-particles-background')) {
    console.log('window.load: 重新初始化WebGL背景');
    new WebGLBackground();
  }
});

// 立即检查
console.log('WebGL脚本加载完成，THREE对象状态:', typeof THREE);
console.log('WebGL脚本加载完成，页面URL:', window.location.href); 