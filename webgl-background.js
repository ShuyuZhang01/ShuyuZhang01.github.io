// WebGL Background Effect - 流体粒子系统
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.particleSystem = null;
    this.geometries = [];
    this.animationId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    
    // 流体粒子参数
    this.particleCount = 800;
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleForces = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    
    // 流体参数
    this.attractionRadius = 8;
    this.repulsionRadius = 3;
    this.attractionStrength = 0.015;
    this.repulsionStrength = 0.08;
    this.damping = 0.99;
    this.boundaryForce = 0.05;
    this.flowForce = 0.02;
    
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

    try {
      // 初始化Three.js
      this.initThreeJS();
      
      // 初始化粒子位置和速度
      this.initParticleSystem();
      
      // 创建新的背景效果
      this.createFluidParticleSystem();
      this.createFlowingGeometries();
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
      console.log('WebGLBackground: 使用CSS备选方案');
      this.createCSSFallback();
    }
  }

  isHomePage() {
    const currentPath = window.location.pathname;
    const isIndex = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    console.log('WebGLBackground: 当前页面路径:', currentPath, '是否为主页:', isIndex);
    return isIndex;
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  createCSSFallback() {
    console.log('WebGLBackground: 创建CSS备选方案');
    
    const cssContainer = document.createElement('div');
    cssContainer.id = 'css-particles-background';
    cssContainer.style.position = 'fixed';
    cssContainer.style.top = '0';
    cssContainer.style.left = '0';
    cssContainer.style.width = '100%';
    cssContainer.style.height = '100%';
    cssContainer.style.zIndex = '-1';
    cssContainer.style.opacity = '0.3';
    cssContainer.style.pointerEvents = 'none';
    cssContainer.style.overflow = 'hidden';
    cssContainer.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)';
    
    // 创建5条水流
    for (let i = 0; i < 5; i++) {
      const stream = document.createElement('div');
      stream.style.position = 'absolute';
      stream.style.width = '100%';
      stream.style.height = '2px';
      stream.style.left = '0';
      stream.style.top = (20 + i * 15) + '%';
      stream.style.animation = `waterFlow ${8 + Math.random() * 4}s infinite linear`;
      stream.style.animationDelay = Math.random() * 5 + 's';
      
      // 在每条水流中创建多个小粒子
      for (let j = 0; j < 20; j++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(74, 144, 226, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (Math.random() - 0.5) * 10 + 'px';
        particle.style.opacity = '0.6';
        particle.style.animation = `particleFlow ${6 + Math.random() * 3}s infinite linear`;
        particle.style.animationDelay = Math.random() * 6 + 's';
        stream.appendChild(particle);
      }
      
      cssContainer.appendChild(stream);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes waterFlow {
        0% {
          transform: translateX(100vw);
          opacity: 0.6;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.8;
        }
        100% {
          transform: translateX(-100px);
          opacity: 0.6;
        }
      }
      
      @keyframes particleFlow {
        0% {
          transform: translateX(0) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translateX(-20px) scale(1.2);
          opacity: 0.9;
        }
        100% {
          transform: translateX(-40px) scale(1);
          opacity: 0.6;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cssContainer);
  }

  initThreeJS() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0a0a, 0.3);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 添加到页面
    const container = document.createElement('div');
    container.id = 'webgl-background';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.appendChild(this.renderer.domElement);
    document.body.appendChild(container);
  }

  initParticleSystem() {
    // 初始化粒子位置 - 形成从右到左的水流形状
    const streamCount = 5; // 5条水流
    const particlesPerStream = Math.floor(this.particleCount / streamCount);
    
    for (let i = 0; i < this.particleCount; i++) {
      const streamIndex = Math.floor(i / particlesPerStream);
      const particleInStream = i % particlesPerStream;
      
      // 每条水流的位置
      const streamY = (streamIndex - 2) * 15; // 垂直分布5条水流
      
      // 在每条水流中，粒子从右到左分布
      const progress = particleInStream / particlesPerStream;
      const x = 60 - progress * 120; // 从右(60)到左(-60)
      const y = streamY + (Math.random() - 0.5) * 8; // 在流道内随机分布
      const z = (Math.random() - 0.5) * 20; // 深度随机
      
      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;
      
      // 初始化速度 - 向左流动
      this.particleVelocities[i * 3] = -0.5 - Math.random() * 0.5; // 向左的速度
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // 轻微的垂直运动
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // 轻微的深度运动
      
      // 初始化颜色 - 蓝色调，根据位置变化
      const color = new THREE.Color();
      const hue = 0.6 + (Math.random() - 0.5) * 0.1; // 蓝色范围
      const saturation = 0.7 + Math.random() * 0.3;
      const lightness = 0.4 + Math.random() * 0.4;
      color.setHSL(hue, saturation, lightness);
      this.particleColors[i * 3] = color.r;
      this.particleColors[i * 3 + 1] = color.g;
      this.particleColors[i * 3 + 2] = color.b;
    }
  }

  createFluidParticleSystem() {
    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 1.5, // 更小的粒子
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  updateFluidDynamics() {
    // 重置力
    for (let i = 0; i < this.particleCount * 3; i++) {
      this.particleForces[i] = 0;
    }
    
    // 计算粒子间的相互作用力
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const posI = {
        x: this.particlePositions[i3],
        y: this.particlePositions[i3 + 1],
        z: this.particlePositions[i3 + 2]
      };
      
      for (let j = i + 1; j < this.particleCount; j++) {
        const j3 = j * 3;
        const posJ = {
          x: this.particlePositions[j3],
          y: this.particlePositions[j3 + 1],
          z: this.particlePositions[j3 + 2]
        };
        
        const dx = posJ.x - posI.x;
        const dy = posJ.y - posI.y;
        const dz = posJ.z - posI.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance > 0 && distance < this.attractionRadius) {
          const force = distance < this.repulsionRadius ? 
            -this.repulsionStrength * (1 - distance / this.repulsionRadius) :
            this.attractionStrength * (distance - this.repulsionRadius) / (this.attractionRadius - this.repulsionRadius);
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          const fz = (dz / distance) * force;
          
          // 应用力到两个粒子
          this.particleForces[i3] -= fx;
          this.particleForces[i3 + 1] -= fy;
          this.particleForces[i3 + 2] -= fz;
          
          this.particleForces[j3] += fx;
          this.particleForces[j3 + 1] += fy;
          this.particleForces[j3 + 2] += fz;
        }
      }
      
      // 添加从左到右的流动力
      this.particleForces[i3] += this.flowForce;
      
      // 边界力 - 让粒子保持在可视范围内，并循环流动
      const boundary = 70;
      if (posI.x < -boundary) {
        // 粒子到达左边界时，重置到右边界
        this.particlePositions[i3] = boundary;
        this.particleVelocities[i3] = -0.5 - Math.random() * 0.5; // 保持向左的速度
        this.particlePositions[i3 + 1] = (Math.random() - 0.5) * 60; // 随机Y位置
        this.particlePositions[i3 + 2] = (Math.random() - 0.5) * 20; // 随机Z位置
      }
      
      // Y轴边界
      if (Math.abs(posI.y) > 40) {
        this.particleForces[i3 + 1] -= Math.sign(posI.y) * this.boundaryForce;
      }
      
      // Z轴边界
      if (Math.abs(posI.z) > 30) {
        this.particleForces[i3 + 2] -= Math.sign(posI.z) * this.boundaryForce;
      }
    }
    
    // 更新速度和位置
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 更新速度
      this.particleVelocities[i3] += this.particleForces[i3];
      this.particleVelocities[i3 + 1] += this.particleForces[i3 + 1];
      this.particleVelocities[i3 + 2] += this.particleForces[i3 + 2];
      
      // 应用阻尼
      this.particleVelocities[i3] *= this.damping;
      this.particleVelocities[i3 + 1] *= this.damping;
      this.particleVelocities[i3 + 2] *= this.damping;
      
      // 更新位置
      this.particlePositions[i3] += this.particleVelocities[i3];
      this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1];
      this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2];
    }
    
    // 更新几何体
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  createFlowingGeometries() {
    // 创建流动的几何形状
    const geometries = [
      new THREE.TorusGeometry(10, 3, 16, 100),
      new THREE.OctahedronGeometry(8),
      new THREE.TetrahedronGeometry(6),
      new THREE.IcosahedronGeometry(5)
    ];
    
    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x4a90e2,
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.geometries.push({
        mesh: mesh,
        speed: 0.001 + Math.random() * 0.002,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      });
      
      this.scene.add(mesh);
    });
  }

  createLights() {
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // 添加点光源
    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 100);
    pointLight.position.set(0, 0, 50);
    this.scene.add(pointLight);
  }

  addMouseInteraction() {
    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.time += 0.01;
    
    // 更新流体动力学
    this.updateFluidDynamics();
    
    // 更新几何形状
    this.geometries.forEach((geo) => {
      geo.mesh.rotation.x += geo.rotationSpeed.x;
      geo.mesh.rotation.y += geo.rotationSpeed.y;
      geo.mesh.rotation.z += geo.rotationSpeed.z;
      
      // 添加轻微的浮动效果
      geo.mesh.position.y += Math.sin(this.time * geo.speed) * 0.1;
    });
    
    // 相机轻微跟随鼠标
    this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.01;
    this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.01;
    
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
    
    if (this.renderer) {
      this.renderer.dispose();
      const container = document.getElementById('webgl-background');
      if (container) {
        container.remove();
      }
    }
  }
}

// 初始化函数
function initWebGLBackground() {
  return new WebGLBackground();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWebGLBackground);
} else {
  initWebGLBackground();
} 