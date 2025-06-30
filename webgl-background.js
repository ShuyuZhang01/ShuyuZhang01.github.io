// WebGL Background Effect using Three.js - Inspired by sgrappa.com
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometries = [];
    this.particles = [];
    this.animationId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.isHovering = false;
    this.hoverTarget = null;
    
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
      
      // 创建3D效果
      this.createGeometries();
      this.createParticles();
      this.createLights();
      
      // 添加交互
      this.addInteractions();
      
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
    
    // 创建CSS 3D效果背景
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
    cssContainer.style.background = 'linear-gradient(45deg, #000 0%, #1a1a1a 100%)';
    
    // 创建动态几何体 - 分布在整个页面
    for (let i = 0; i < 20; i++) {
      const geometry = document.createElement('div');
      geometry.style.position = 'absolute';
      geometry.style.border = '1px solid #9ca3af';
      geometry.style.opacity = '0.2';
      geometry.style.animation = `float3D ${8 + Math.random() * 6}s infinite ease-in-out`;
      geometry.style.animationDelay = Math.random() * 4 + 's';
      
      if (i % 4 === 0) {
        // 正方形
        geometry.style.width = '40px';
        geometry.style.height = '40px';
        geometry.style.transform = 'rotate(45deg)';
      } else if (i % 4 === 1) {
        // 圆形
        geometry.style.width = '50px';
        geometry.style.height = '50px';
        geometry.style.borderRadius = '50%';
      } else if (i % 4 === 2) {
        // 矩形
        geometry.style.width = '60px';
        geometry.style.height = '25px';
      } else {
        // 菱形
        geometry.style.width = '35px';
        geometry.style.height = '35px';
        geometry.style.transform = 'rotate(45deg)';
      }
      
      // 分布在整个页面
      geometry.style.left = Math.random() * 90 + 5 + '%';
      geometry.style.top = Math.random() * 90 + 5 + '%';
      
      cssContainer.appendChild(geometry);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float3D {
        0% {
          transform: translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1);
          opacity: 0.2;
        }
        25% {
          transform: translateZ(20px) rotateX(90deg) rotateY(45deg) scale(1.1);
          opacity: 0.4;
        }
        50% {
          transform: translateZ(40px) rotateX(180deg) rotateY(90deg) scale(1);
          opacity: 0.2;
        }
        75% {
          transform: translateZ(20px) rotateX(270deg) rotateY(135deg) scale(0.9);
          opacity: 0.4;
        }
        100% {
          transform: translateZ(0px) rotateX(360deg) rotateY(180deg) scale(1);
          opacity: 0.2;
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
    this.scene.fog = new THREE.Fog(0x000000, 1, 10);
    console.log('WebGLBackground: 场景创建成功');
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 5);
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
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

  createGeometries() {
    console.log('WebGLBackground: 开始创建几何体');
    
    // 创建多种几何体 - 分布在整个页面
    const geometries = [
      // 中心区域
      { type: 'box', size: 0.8, position: [2, 1, 0], rotation: [0, 0, 0] },
      { type: 'sphere', size: 0.6, position: [-2, -1, 0], rotation: [0, 0, 0] },
      { type: 'cylinder', size: 0.5, position: [1, -2, 0], rotation: [0, 0, 0] },
      { type: 'torus', size: 0.4, position: [-1, 2, 0], rotation: [0, 0, 0] },
      { type: 'octahedron', size: 0.7, position: [0, 0, 0], rotation: [0, 0, 0] },
      
      // 左上区域
      { type: 'tetrahedron', size: 0.4, position: [-4, 3, 0], rotation: [0, 0, 0] },
      { type: 'icosahedron', size: 0.3, position: [-5, 2, 0], rotation: [0, 0, 0] },
      { type: 'dodecahedron', size: 0.5, position: [-3, 4, 0], rotation: [0, 0, 0] },
      
      // 右上区域
      { type: 'box', size: 0.6, position: [4, 3, 0], rotation: [0, 0, 0] },
      { type: 'sphere', size: 0.4, position: [5, 2, 0], rotation: [0, 0, 0] },
      { type: 'cylinder', size: 0.35, position: [3, 4, 0], rotation: [0, 0, 0] },
      
      // 左下区域
      { type: 'torus', size: 0.3, position: [-4, -3, 0], rotation: [0, 0, 0] },
      { type: 'octahedron', size: 0.5, position: [-5, -2, 0], rotation: [0, 0, 0] },
      { type: 'tetrahedron', size: 0.4, position: [-3, -4, 0], rotation: [0, 0, 0] },
      
      // 右下区域
      { type: 'icosahedron', size: 0.3, position: [4, -3, 0], rotation: [0, 0, 0] },
      { type: 'dodecahedron', size: 0.4, position: [5, -2, 0], rotation: [0, 0, 0] },
      { type: 'box', size: 0.5, position: [3, -4, 0], rotation: [0, 0, 0] },
      
      // 边缘区域
      { type: 'sphere', size: 0.3, position: [-6, 0, 0], rotation: [0, 0, 0] },
      { type: 'cylinder', size: 0.25, position: [6, 0, 0], rotation: [0, 0, 0] },
      { type: 'torus', size: 0.2, position: [0, -5, 0], rotation: [0, 0, 0] },
      { type: 'octahedron', size: 0.4, position: [0, 5, 0], rotation: [0, 0, 0] }
    ];
    
    geometries.forEach((geo, index) => {
      let geometry, material;
      
      switch(geo.type) {
        case 'box':
          geometry = new THREE.BoxGeometry(geo.size, geo.size, geo.size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(geo.size, 16, 16);
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(geo.size, geo.size, geo.size * 2, 16);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(geo.size, geo.size * 0.3, 8, 16);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(geo.size);
          break;
        case 'tetrahedron':
          geometry = new THREE.TetrahedronGeometry(geo.size);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(geo.size);
          break;
        case 'dodecahedron':
          geometry = new THREE.DodecahedronGeometry(geo.size);
          break;
      }
      
      // 创建材质 - 使用渐变效果
      material = new THREE.MeshBasicMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...geo.position);
      mesh.userData = { 
        index: index,
        originalPosition: [...geo.position],
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        flowSpeed: Math.random() * 0.008 + 0.003,
        scaleSpeed: Math.random() * 0.002 + 0.001,
        hoverScale: 1,
        isHovered: false
      };
      
      this.geometries.push(mesh);
      this.scene.add(mesh);
    });
    
    console.log('WebGLBackground: 几何体创建成功，数量:', this.geometries.length);
  }

  createParticles() {
    console.log('WebGLBackground: 开始创建粒子系统');
    
    // 创建粒子几何体
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // 分布在整个页面
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // 颜色渐变
      const color = new THREE.Color();
      color.setHSL(0.6, 0.5, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.particles.push(particleSystem);
    this.scene.add(particleSystem);
    
    console.log('WebGLBackground: 粒子系统创建成功');
  }

  createLights() {
    console.log('WebGLBackground: 开始创建灯光');
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // 点光源
    const pointLight = new THREE.PointLight(0x9ca3af, 0.5, 10);
    pointLight.position.set(0, 0, 5);
    this.scene.add(pointLight);
    
    console.log('WebGLBackground: 灯光创建成功');
  }

  addInteractions() {
    // 鼠标移动事件
    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // 滚动事件
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
    
    // 页面元素悬停事件
    this.addPageElementInteractions();
  }

  addPageElementInteractions() {
    // 为页面元素添加悬停效果
    const interactiveElements = document.querySelectorAll('a, button, .card, .project-item, .skill-tag, .timeline-item');
    
    interactiveElements.forEach((element, index) => {
      element.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.hoverTarget = element;
        
        // 找到最近的几何体并放大
        const rect = element.getBoundingClientRect();
        const centerX = (rect.left + rect.right) / 2 / window.innerWidth * 2 - 1;
        const centerY = -(rect.top + rect.bottom) / 2 / window.innerHeight * 2 + 1;
        
        this.geometries.forEach((mesh, meshIndex) => {
          const distance = Math.sqrt(
            Math.pow(mesh.position.x - centerX * 3, 2) + 
            Math.pow(mesh.position.y - centerY * 3, 2)
          );
          
          if (distance < 2) {
            mesh.userData.isHovered = true;
            mesh.userData.hoverScale = 1.5;
          }
        });
      });
      
      element.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.hoverTarget = null;
        
        // 恢复几何体大小
        this.geometries.forEach((mesh) => {
          mesh.userData.isHovered = false;
          mesh.userData.hoverScale = 1;
        });
      });
    });
  }

  animate() {
    console.log('WebGLBackground: 开始动画循环');
    
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.008;
    
    // 几何体动画 - 慢慢流动
    this.geometries.forEach((mesh, index) => {
      // 旋转动画
      mesh.rotation.x += mesh.userData.rotationSpeed.x;
      mesh.rotation.y += mesh.userData.rotationSpeed.y;
      mesh.rotation.z += mesh.userData.rotationSpeed.z;
      
      // 流动动画 - 更复杂的路径
      const flowX = Math.sin(this.time * mesh.userData.flowSpeed + index * 0.5) * 1.2;
      const flowY = Math.cos(this.time * mesh.userData.flowSpeed * 0.7 + index * 0.3) * 0.8;
      const flowZ = Math.sin(this.time * mesh.userData.flowSpeed * 0.3 + index * 0.2) * 0.5;
      
      // 基础位置 + 流动 + 鼠标交互 + 滚动效果
      mesh.position.x = mesh.userData.originalPosition[0] + flowX + this.mouseX * 0.3;
      mesh.position.y = mesh.userData.originalPosition[1] + flowY + this.mouseY * 0.3 + this.scrollY * 0.001;
      mesh.position.z = mesh.userData.originalPosition[2] + flowZ;
      
      // 悬停缩放效果
      if (mesh.userData.isHovered) {
        mesh.scale.lerp(new THREE.Vector3(mesh.userData.hoverScale, mesh.userData.hoverScale, mesh.userData.hoverScale), 0.1);
      } else {
        mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      
      // 透明度动画
      mesh.material.opacity = 0.2 + Math.sin(this.time * 1.5 + index) * 0.1;
    });
    
    // 粒子动画
    this.particles.forEach((particleSystem) => {
      const positions = particleSystem.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // 粒子流动
        positions[i] += Math.sin(this.time + i) * 0.001;
        positions[i + 1] += Math.cos(this.time + i) * 0.001;
        positions[i + 2] += Math.sin(this.time * 0.5 + i) * 0.001;
        
        // 边界检查
        if (positions[i] > 10) positions[i] = -10;
        if (positions[i] < -10) positions[i] = 10;
        if (positions[i + 1] > 10) positions[i + 1] = -10;
        if (positions[i + 1] < -10) positions[i + 1] = 10;
        if (positions[i + 2] > 5) positions[i + 2] = -5;
        if (positions[i + 2] < -5) positions[i + 2] = 5;
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
    });
    
    // 相机动画 - 响应滚动和鼠标
    this.camera.position.x = Math.sin(this.time * 0.3) * 0.3 + this.mouseX * 0.2;
    this.camera.position.y = Math.cos(this.time * 0.2) * 0.2 + this.mouseY * 0.1 + this.scrollY * 0.0005;
    this.camera.lookAt(0, 0, 0);
    
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