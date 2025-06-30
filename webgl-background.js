// WebGL Background Effect using Three.js
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.grid = null;
    this.rings = null;
    this.cube = null;
    this.sphere = null;
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
      
      // 创建3D效果
      this.createGrid();
      this.createRings();
      this.createCube();
      this.createSphere();
      
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
    
    // 创建网格线
    for (let i = 0; i < 20; i++) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.width = '100%';
      line.style.height = '1px';
      line.style.backgroundColor = '#9ca3af';
      line.style.top = (i * 5) + '%';
      line.style.opacity = '0.3';
      line.style.animation = `gridMove ${8 + Math.random() * 4}s infinite linear`;
      line.style.animationDelay = Math.random() * 2 + 's';
      cssContainer.appendChild(line);
    }
    
    // 创建垂直网格线
    for (let i = 0; i < 20; i++) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.width = '1px';
      line.style.height = '100%';
      line.style.backgroundColor = '#9ca3af';
      line.style.left = (i * 5) + '%';
      line.style.opacity = '0.3';
      line.style.animation = `gridMove ${8 + Math.random() * 4}s infinite linear`;
      line.style.animationDelay = Math.random() * 2 + 's';
      cssContainer.appendChild(line);
    }
    
    // 创建光圈
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement('div');
      ring.style.position = 'absolute';
      ring.style.width = (100 + i * 50) + 'px';
      ring.style.height = (100 + i * 50) + 'px';
      ring.style.border = '1px solid #9ca3af';
      ring.style.borderRadius = '50%';
      ring.style.left = '50%';
      ring.style.top = '50%';
      ring.style.transform = 'translate(-50%, -50%)';
      ring.style.opacity = '0.2';
      ring.style.animation = `ringRotate ${10 + i * 2}s infinite linear`;
      ring.style.animationDelay = i * 2 + 's';
      cssContainer.appendChild(ring);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gridMove {
        0% {
          transform: translateY(0px);
          opacity: 0.3;
        }
        50% {
          opacity: 0.1;
        }
        100% {
          transform: translateY(-20px);
          opacity: 0.3;
        }
      }
      
      @keyframes ringRotate {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 0.2;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
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
    console.log('WebGLBackground: 场景创建成功');
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 3;
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

  createGrid() {
    console.log('WebGLBackground: 开始创建网格');
    
    // 创建网格几何体
    const gridGeometry = new THREE.GridHelper(8, 20, 0x9ca3af, 0x6b7280);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    
    this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
    this.grid.position.z = -2;
    this.scene.add(this.grid);
    console.log('WebGLBackground: 网格创建成功');
  }

  createRings() {
    console.log('WebGLBackground: 开始创建光圈');
    
    // 创建多个光圈
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(0.5 + i * 0.3, 0.6 + i * 0.3, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.2 - i * 0.03,
        wireframe: true,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -1 - i * 0.2;
      ring.userData = { index: i };
      this.scene.add(ring);
      
      if (i === 0) this.rings = ring;
    }
    console.log('WebGLBackground: 光圈创建成功');
  }

  createCube() {
    console.log('WebGLBackground: 开始创建立方体');
    
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.set(1, 1, 0);
    this.scene.add(this.cube);
    console.log('WebGLBackground: 立方体创建成功');
  }

  createSphere() {
    console.log('WebGLBackground: 开始创建球体');
    
    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.set(-1, -1, 0);
    this.scene.add(this.sphere);
    console.log('WebGLBackground: 球体创建成功');
  }

  animate() {
    console.log('WebGLBackground: 开始动画循环');
    
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.01;
    
    // 网格动画
    if (this.grid) {
      this.grid.rotation.x += 0.001;
      this.grid.rotation.y += 0.001;
      this.grid.material.opacity = 0.2 + Math.sin(this.time) * 0.1;
    }
    
    // 光圈动画
    if (this.rings) {
      this.rings.rotation.z += 0.005;
      this.rings.rotation.x += 0.002;
      
      // 遍历所有光圈
      this.scene.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'RingGeometry') {
          child.rotation.z += 0.003 + child.userData.index * 0.001;
          child.rotation.y += 0.001;
          child.material.opacity = (0.2 - child.userData.index * 0.03) + Math.sin(this.time + child.userData.index) * 0.05;
        }
      });
    }
    
    // 立方体动画
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.cube.rotation.z += 0.005;
      this.cube.position.x = 1 + Math.sin(this.time) * 0.5;
      this.cube.position.y = 1 + Math.cos(this.time) * 0.5;
    }
    
    // 球体动画
    if (this.sphere) {
      this.sphere.rotation.x += 0.008;
      this.sphere.rotation.y += 0.008;
      this.sphere.position.x = -1 + Math.sin(this.time * 0.8) * 0.3;
      this.sphere.position.y = -1 + Math.cos(this.time * 0.8) * 0.3;
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