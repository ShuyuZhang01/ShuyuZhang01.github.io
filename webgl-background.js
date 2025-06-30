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
    this.particleCount = 600; // 增加粒子数量
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleForces = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    
    // 水流参数 - 调整让粒子更靠近
    this.attractionRadius = 6; // 减小吸引半径
    this.repulsionRadius = 2; // 减小排斥半径
    this.attractionStrength = 0.015; // 增加吸引力
    this.repulsionStrength = 0.08; // 增加排斥力
    this.damping = 0.98; // 稍微减少阻尼
    this.boundaryForce = 0.15; // 增加边界力
    this.flowSpeed = 0.25; // 稍微增加流速
    
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
    
    // 创建多股在屏幕下半部分自然流动的水流，覆盖整个宽度
    for (let streamIndex = 0; streamIndex < 3; streamIndex++) {
      const stream = document.createElement('div');
      stream.style.position = 'absolute';
      stream.style.width = '100%';
      stream.style.height = '2px'; // 更细的水流
      stream.style.left = '0';
      stream.style.top = `${65 + streamIndex * 3}%`; // 在屏幕下半部分，稍微错开
      stream.style.transform = 'translateY(-50%)';
      stream.style.animation = `waterFlowSmooth ${20 + streamIndex * 3}s infinite ease-in-out`;
      stream.style.animationDelay = `${streamIndex * 2}s`;
      
      // 在水流中创建更多更小的圆形粒子
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '1.2px'; // 更小的粒子
        particle.style.height = '1.2px';
        particle.style.backgroundColor = 'rgba(179, 179, 179, 0.8)';
        particle.style.borderRadius = '50%'; // 确保是圆形
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (Math.random() - 0.5) * 4 + 'px'; // 更窄的范围
        particle.style.opacity = '0.7';
        particle.style.animation = `particleFlowSmooth ${15 + Math.random() * 10}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 15 + 's';
        stream.appendChild(particle);
      }
      
      cssContainer.appendChild(stream);
    }
    
    // 添加CSS动画 - 使用更自然的sin流动
    const style = document.createElement('style');
    style.textContent = `
      @keyframes waterFlowSmooth {
        0%, 100% {
          transform: translateY(-50%) translateX(0);
          opacity: 0.6;
        }
        16.67% {
          transform: translateY(-50%) translateX(20px);
          opacity: 0.8;
        }
        33.33% {
          transform: translateY(-50%) translateX(0);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-50%) translateX(-20px);
          opacity: 0.8;
        }
        66.67% {
          transform: translateY(-50%) translateX(0);
          opacity: 0.6;
        }
        83.33% {
          transform: translateY(-50%) translateX(20px);
          opacity: 0.8;
        }
      }
      
      @keyframes particleFlowSmooth {
        0%, 100% {
          transform: translateX(0) scale(1);
          opacity: 0.6;
        }
        25% {
          transform: translateX(8px) scale(1.1);
          opacity: 0.8;
        }
        50% {
          transform: translateX(0) scale(1);
          opacity: 0.6;
        }
        75% {
          transform: translateX(-8px) scale(1.1);
          opacity: 0.8;
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
    // 初始化粒子位置 - 在整个屏幕下半部分均匀分布
    for (let i = 0; i < this.particleCount; i++) {
      // 在整个屏幕宽度上均匀分布
      const x = (Math.random() - 0.5) * 120; // x: -60~60 (覆盖整个屏幕宽度)
      const y = (Math.random() - 0.5) * 15 - 10; // y: -17.5~-2.5 (下半部分)
      const z = (Math.random() - 0.5) * 8; // z: -4~4 (更薄)
      
      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;
      
      // 初始速度 - 根据位置设置不同方向，形成自然的流动
      const direction = Math.random() > 0.5 ? 1 : -1;
      this.particleVelocities[i * 3] = this.flowSpeed * direction;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // 灰色
      this.particleColors[i * 3] = 0.7;
      this.particleColors[i * 3 + 1] = 0.7;
      this.particleColors[i * 3 + 2] = 0.7;
    }
  }

  createFluidParticleSystem() {
    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.8, // 更小的粒子
      vertexColors: true,
      transparent: true,
      opacity: 0.7, // 稍微增加透明度
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: this.createCircularParticleTexture() // 使用圆形纹理
    });
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  createCircularParticleTexture() {
    // 创建圆形粒子纹理
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // 创建径向渐变
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(179, 179, 179, 1)');
    gradient.addColorStop(0.7, 'rgba(179, 179, 179, 0.8)');
    gradient.addColorStop(1, 'rgba(179, 179, 179, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  updateFluidDynamics() {
    // 0.3 可以调节摆动速度，sin 结果范围 -1 ~ 1
    const globalFlow = Math.sin(this.time * 0.3);
    
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
          
          this.particleForces[i3] -= fx;
          this.particleForces[i3 + 1] -= fy;
          this.particleForces[i3 + 2] -= fz;
          
          this.particleForces[j3] += fx;
          this.particleForces[j3 + 1] += fy;
          this.particleForces[j3 + 2] += fz;
        }
      }
      
      // 添加流动方向力 - 使用全局sin流动
      this.particleForces[i3] += this.flowSpeed * globalFlow;
      
      // 边界处理 - 软边界，让粒子在边界处减速并改变方向
      if (posI.x > 55) {
        this.particleForces[i3] -= this.boundaryForce * (posI.x - 55);
        this.particleVelocities[i3] *= 0.8; // 在边界处减速
      } else if (posI.x < -55) {
        this.particleForces[i3] += this.boundaryForce * (-55 - posI.x);
        this.particleVelocities[i3] *= 0.8; // 在边界处减速
      }
      
      // Y轴边界 - 限制在下半部分
      if (posI.y > -2.5) {
        this.particleForces[i3 + 1] -= this.boundaryForce * (posI.y + 2.5);
      } else if (posI.y < -17.5) {
        this.particleForces[i3 + 1] += this.boundaryForce * (-17.5 - posI.y);
      }
      
      // Z轴边界
      if (Math.abs(posI.z) > 8) {
        this.particleForces[i3 + 2] -= Math.sign(posI.z) * this.boundaryForce;
      }
    }
    
    // 更新速度和位置
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      this.particleVelocities[i3] += this.particleForces[i3];
      this.particleVelocities[i3 + 1] += this.particleForces[i3 + 1];
      this.particleVelocities[i3 + 2] += this.particleForces[i3 + 2];
      
      this.particleVelocities[i3] *= this.damping;
      this.particleVelocities[i3 + 1] *= this.damping;
      this.particleVelocities[i3 + 2] *= this.damping;
      
      this.particlePositions[i3] += this.particleVelocities[i3];
      this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1];
      this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2];
      
      // 限制在可视范围内，但允许更宽的分布
      this.particlePositions[i3] = Math.max(-70, Math.min(70, this.particlePositions[i3]));
      this.particlePositions[i3 + 1] = Math.max(-25, Math.min(-5, this.particlePositions[i3 + 1]));
      this.particlePositions[i3 + 2] = Math.max(-12, Math.min(12, this.particlePositions[i3 + 2]));
    }
    
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