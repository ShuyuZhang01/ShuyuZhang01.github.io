// WebGL Background Effect using Three.js - Inspired by le-voyage-azarien.art
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometries = [];
    this.rings = [];
    this.animationId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    
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
      this.createRings();
      this.createGeometries();
      this.createLights();
      
      // 添加鼠标交互
      this.addMouseInteraction();
      
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
    cssContainer.style.opacity = '0.12';
    cssContainer.style.pointerEvents = 'none';
    cssContainer.style.overflow = 'hidden';
    cssContainer.style.background = 'linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%)';
    
    // 创建光圈
    for (let i = 0; i < 5; i++) {
      const ring = document.createElement('div');
      ring.style.position = 'absolute';
      ring.style.width = (150 + i * 80) + 'px';
      ring.style.height = (150 + i * 80) + 'px';
      ring.style.border = '1px solid #9ca3af';
      ring.style.borderRadius = '50%';
      ring.style.left = '50%';
      ring.style.top = '50%';
      ring.style.transform = 'translate(-50%, -50%)';
      ring.style.opacity = '0.1';
      ring.style.animation = `ringFloat ${15 + i * 4}s infinite ease-in-out`;
      ring.style.animationDelay = i * 3 + 's';
      cssContainer.appendChild(ring);
    }
    
    // 创建流动几何体
    for (let i = 0; i < 8; i++) {
      const geometry = document.createElement('div');
      geometry.style.position = 'absolute';
      geometry.style.border = '1px solid #9ca3af';
      geometry.style.opacity = '0.15';
      geometry.style.animation = `flow3D ${12 + Math.random() * 8}s infinite ease-in-out`;
      geometry.style.animationDelay = Math.random() * 6 + 's';
      
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
      
      geometry.style.left = Math.random() * 85 + 7.5 + '%';
      geometry.style.top = Math.random() * 85 + 7.5 + '%';
      
      cssContainer.appendChild(geometry);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ringFloat {
        0% {
          transform: translate(-50%, -50%) rotate(0deg) scale(1);
          opacity: 0.1;
        }
        25% {
          transform: translate(-50%, -50%) rotate(90deg) scale(1.1);
          opacity: 0.2;
        }
        50% {
          transform: translate(-50%, -50%) rotate(180deg) scale(1);
          opacity: 0.1;
        }
        75% {
          transform: translate(-50%, -50%) rotate(270deg) scale(0.9);
          opacity: 0.2;
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg) scale(1);
          opacity: 0.1;
        }
      }
      
      @keyframes flow3D {
        0% {
          transform: translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1);
          opacity: 0.15;
        }
        20% {
          transform: translateZ(20px) rotateX(72deg) rotateY(36deg) scale(1.1);
          opacity: 0.25;
        }
        40% {
          transform: translateZ(40px) rotateX(144deg) rotateY(72deg) scale(1);
          opacity: 0.15;
        }
        60% {
          transform: translateZ(20px) rotateX(216deg) rotateY(108deg) scale(0.9);
          opacity: 0.25;
        }
        80% {
          transform: translateZ(10px) rotateX(288deg) rotateY(144deg) scale(1.05);
          opacity: 0.2;
        }
        100% {
          transform: translateZ(0px) rotateX(360deg) rotateY(180deg) scale(1);
          opacity: 0.15;
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
    this.scene.fog = new THREE.Fog(0x000000, 3, 20);
    console.log('WebGLBackground: 场景创建成功');
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      50, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 8);
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

  createRings() {
    console.log('WebGLBackground: 开始创建光圈');
    
    // 创建多个光圈
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(1.2 + i * 0.6, 1.5 + i * 0.6, 48);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.08 - i * 0.015,
        wireframe: true,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -3 - i * 0.5;
      ring.userData = { 
        index: i,
        originalZ: -3 - i * 0.5
      };
      this.rings.push(ring);
      this.scene.add(ring);
    }
    console.log('WebGLBackground: 光圈创建成功，数量:', this.rings.length);
  }

  createGeometries() {
    console.log('WebGLBackground: 开始创建几何体');
    
    // 创建多种几何体
    const geometries = [
      { type: 'box', size: 0.5, position: [3, 2, 0], rotation: [0, 0, 0] },
      { type: 'sphere', size: 0.4, position: [-3, -2, 0], rotation: [0, 0, 0] },
      { type: 'cylinder', size: 0.35, position: [2, -3, 0], rotation: [0, 0, 0] },
      { type: 'torus', size: 0.25, position: [-2, 3, 0], rotation: [0, 0, 0] },
      { type: 'octahedron', size: 0.5, position: [0, 0, 0], rotation: [0, 0, 0] },
      { type: 'tetrahedron', size: 0.35, position: [4, 0, 0], rotation: [0, 0, 0] },
      { type: 'icosahedron', size: 0.3, position: [-4, 1, 0], rotation: [0, 0, 0] },
      { type: 'dodecahedron', size: 0.4, position: [0, 4, 0], rotation: [0, 0, 0] }
    ];
    
    geometries.forEach((geo, index) => {
      let geometry, material;
      
      switch(geo.type) {
        case 'box':
          geometry = new THREE.BoxGeometry(geo.size, geo.size, geo.size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(geo.size, 20, 20);
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(geo.size, geo.size, geo.size * 2, 20);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(geo.size, geo.size * 0.3, 12, 24);
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
      
      // 创建材质
      material = new THREE.MeshBasicMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...geo.position);
      mesh.userData = { 
        index: index,
        originalPosition: [...geo.position],
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: Math.random() * 0.006 + 0.003,
        scaleSpeed: Math.random() * 0.002 + 0.001
      };
      
      this.geometries.push(mesh);
      this.scene.add(mesh);
    });
    
    console.log('WebGLBackground: 几何体创建成功，数量:', this.geometries.length);
  }

  createLights() {
    console.log('WebGLBackground: 开始创建灯光');
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // 点光源
    const pointLight = new THREE.PointLight(0x9ca3af, 0.7, 20);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);
    
    console.log('WebGLBackground: 灯光创建成功');
  }

  addMouseInteraction() {
    // 鼠标移动事件
    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    console.log('WebGLBackground: 开始动画循环');
    
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.006;
    
    // 光圈动画 - 更流畅的浮动效果
    this.rings.forEach((ring, index) => {
      ring.rotation.z += 0.002 + index * 0.0003;
      ring.rotation.x += 0.0008 + index * 0.0001;
      ring.rotation.y += 0.0006 + index * 0.0001;
      
      // 浮动动画
      const floatOffset = Math.sin(this.time * 0.5 + index) * 0.3;
      ring.position.z = ring.userData.originalZ + floatOffset;
      
      // 透明度动画
      ring.material.opacity = (0.08 - index * 0.015) + Math.sin(this.time + index) * 0.02;
    });
    
    // 几何体动画 - 更自然的流动效果
    this.geometries.forEach((mesh, index) => {
      // 旋转动画
      mesh.rotation.x += mesh.userData.rotationSpeed.x;
      mesh.rotation.y += mesh.userData.rotationSpeed.y;
      mesh.rotation.z += mesh.userData.rotationSpeed.z;
      
      // 浮动动画 - 更复杂的路径
      const floatX = Math.sin(this.time + index * 0.5) * 0.8;
      const floatY = Math.cos(this.time * 0.7 + index * 0.3) * 0.6;
      const floatZ = Math.sin(this.time * 0.3 + index * 0.2) * 0.4;
      
      mesh.position.x = mesh.userData.originalPosition[0] + floatX + this.mouseX * 0.2;
      mesh.position.y = mesh.userData.originalPosition[1] + floatY + this.mouseY * 0.2;
      mesh.position.z = mesh.userData.originalPosition[2] + floatZ;
      
      // 缩放动画
      const scale = 1 + Math.sin(this.time * 2 + index) * 0.1;
      mesh.scale.set(scale, scale, scale);
      
      // 透明度动画
      mesh.material.opacity = 0.15 + Math.sin(this.time * 1.2 + index) * 0.06;
    });
    
    // 相机动画 - 更微妙的移动
    this.camera.position.x = Math.sin(this.time * 0.3) * 0.2;
    this.camera.position.y = Math.cos(this.time * 0.2) * 0.15;
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