// WebGL Background Effect using Three.js
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.animationId = null;
    
    this.init();
  }

  init() {
    // 检查是否支持WebGL
    if (!this.isWebGLAvailable()) {
      console.log('WebGL not supported');
      return;
    }

    // 创建容器
    this.createContainer();
    
    // 初始化Three.js
    this.initThreeJS();
    
    // 创建粒子
    this.createParticles();
    
    // 开始动画
    this.animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize());
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  createContainer() {
    // 创建背景容器
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.zIndex = '-1';
    this.container.style.opacity = '0.3';
    this.container.style.pointerEvents = 'none';
    
    document.body.appendChild(this.container);
  }

  initThreeJS() {
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 1;
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    
    this.container.appendChild(this.renderer.domElement);
  }

  createParticles() {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // 生成随机位置和颜色
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4; // z
      
      // 灰色系颜色
      const gray = 0.6 + Math.random() * 0.4; // 0.6-1.0 的灰色
      colors[i * 3] = gray;     // r
      colors[i * 3 + 1] = gray; // g
      colors[i * 3 + 2] = gray; // b
    }
    
    // 创建几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 0.01,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    // 创建粒子系统
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // 旋转粒子
    if (this.particles) {
      this.particles.rotation.x += 0.001;
      this.particles.rotation.y += 0.0015;
    }
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// 当页面加载完成后初始化WebGL背景
document.addEventListener('DOMContentLoaded', function() {
  // 检查Three.js是否可用
  if (typeof THREE !== 'undefined') {
    new WebGLBackground();
  } else {
    console.log('Three.js not loaded');
  }
}); 