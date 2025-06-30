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
    this.particleCount = 600;
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleForces = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    
    // --- 核心修改：恢复并调整粒子间相互作用力 ---
    this.attractionRadius = 8;     // 相互吸引的最大范围
    this.repulsionRadius = 1.5;    // 相互排斥的半径（防止挤在一起）
    this.attractionStrength = 0.01; // 吸引力强度（决定水流的"粘稠度"）
    this.repulsionStrength = 0.1;  // 排斥力强度（非常重要，防止塌缩成线）
    // ---------------------------------------------
    
    this.damping = 0.97; // 阻尼，模拟水的粘滞性
    this.flowSpeed = 0.2; // 整体流速

    // 水流方向控制
    this.flowDirection = 1;
    this.directionChangeTime = 0;
    this.directionChangeInterval = 12000; // 12秒

    // 水流形态和噪声参数
    this.noise = new SimplexNoise();
    this.flowPathAmplitude = 7.0;  // 河道的弯曲幅度
    this.flowPathFrequency = 0.04; // 河道的弯曲频率
    this.turbulenceStrength = 0.12;// 湍流强度（提高，增加浪花感）
    
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
    
    // 创建弯曲的水流路径
    for (let streamIndex = 0; streamIndex < 2; streamIndex++) {
      const stream = document.createElement('div');
      stream.style.position = 'absolute';
      stream.style.width = '100%';
      stream.style.height = '2px';
      stream.style.left = '0';
      stream.style.top = `${60 + streamIndex * 8}%`;
      stream.style.transform = 'translateY(-50%)';
      stream.style.animation = `waterFlowCurved ${25 + streamIndex * 5}s infinite ease-in-out`;
      stream.style.animationDelay = `${streamIndex * 3}s`;
      
      // 在水流中创建粒子
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '1.2px';
        particle.style.height = '1.2px';
        particle.style.backgroundColor = 'rgba(179, 179, 179, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (Math.random() - 0.5) * 6 + 'px';
        particle.style.opacity = '0.7';
        particle.style.animation = `particleFlowCurved ${18 + Math.random() * 12}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 20 + 's';
        stream.appendChild(particle);
      }
      
      cssContainer.appendChild(stream);
    }
    
    // 添加CSS动画 - 模拟弯曲的水流
    const style = document.createElement('style');
    style.textContent = `
      @keyframes waterFlowCurved {
        0%, 100% {
          transform: translateY(-50%) translateX(0) rotate(0deg);
          opacity: 0.6;
        }
        25% {
          transform: translateY(-50%) translateX(15px) rotate(2deg);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-50%) translateX(0) rotate(0deg);
          opacity: 0.6;
        }
        75% {
          transform: translateY(-50%) translateX(-15px) rotate(-2deg);
          opacity: 0.8;
        }
      }
      
      @keyframes particleFlowCurved {
        0%, 100% {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 0.6;
        }
        25% {
          transform: translateX(8px) translateY(2px) scale(1.1);
          opacity: 0.8;
        }
        50% {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 0.6;
        }
        75% {
          transform: translateX(-8px) translateY(-2px) scale(1.1);
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
    // 定义场景的宽度
    const sceneWidth = 80;

    // 初始化粒子位置 - 沿着一条弯曲的路径分布
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 在场景宽度内随机分布x坐标
      const x = (Math.random() - 0.5) * sceneWidth * 2; // -80 到 80
      
      // 计算河道的中心Y坐标
      const pathY = this.flowPathAmplitude * Math.sin(x * this.flowPathFrequency);
      
      // 让粒子在河道中心Y坐标附近轻微散开
      const y = pathY + (Math.random() - 0.5) * 5; // 在y方向散开
      const z = (Math.random() - 0.5) * 6; // 在z方向散开
      
      this.particlePositions[i3] = x;
      this.particlePositions[i3 + 1] = y;
      this.particlePositions[i3 + 2] = z;
      
      // 初始速度可以保持不变或设为0
      this.particleVelocities[i3] = 0;
      this.particleVelocities[i3 + 1] = 0;
      this.particleVelocities[i3 + 2] = 0;
      
      // 灰色
      this.particleColors[i3] = 0.7;
      this.particleColors[i3 + 1] = 0.7;
      this.particleColors[i3 + 2] = 0.7;
    }
  }

  createFluidParticleSystem() {
    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
    const material = new THREE.PointsMaterial({
      size: 1.2, // 更小的粒子，增加水雾感
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // 降低透明度，更像雾气
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false, // 让水带看起来更松散、更像雾气
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
    // 定时改变方向
    if (this.time - this.directionChangeTime > this.directionChangeInterval) {
      this.flowDirection *= -1;
      this.directionChangeTime = this.time;
    }

    // 1. 重置所有粒子受力
    // -----------------------------------
    for (let i = 0; i < this.particleForces.length; i++) {
      this.particleForces[i] = 0;
    }

    // 2. 计算粒子间的相互作用力 (核心修正！恢复体积感的关键)
    // -----------------------------------
    for (let i = 0; i < this.particleCount; i++) {
      for (let j = i + 1; j < this.particleCount; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        
        const dx = this.particlePositions[j3] - this.particlePositions[i3];
        const dy = this.particlePositions[j3 + 1] - this.particlePositions[i3 + 1];
        const dz = this.particlePositions[j3 + 2] - this.particlePositions[i3 + 2];
        const distanceSq = dx * dx + dy * dy + dz * dz;

        if (distanceSq > 0 && distanceSq < this.attractionRadius * this.attractionRadius) {
          const distance = Math.sqrt(distanceSq);
          let force;

          if (distance < this.repulsionRadius) {
            // 在排斥半径内，施加一个强烈的推力
            force = -this.repulsionStrength * (1 - distance / this.repulsionRadius);
          } else {
            // 在吸引半径内，施加一个拉力
            force = this.attractionStrength * (1 - distance / this.attractionRadius);
          }

          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          const fz = (dz / distance) * force;

          this.particleForces[i3] += fx;
          this.particleForces[i3 + 1] += fy;
          this.particleForces[i3 + 2] += fz;

          this.particleForces[j3] -= fx;
          this.particleForces[j3 + 1] -= fy;
          this.particleForces[j3 + 2] -= fz;
        }
      }
    }

    // 3. 计算每个粒子的宏观力 (河道引导 + 湍流 + 整体流向)
    // -----------------------------------
    const boundaryWidth = 80;
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const pos = { x: this.particlePositions[i3], y: this.particlePositions[i3 + 1], z: this.particlePositions[i3 + 2] };

      // 河道引导力 (只在Y轴起作用，不再强制拉Z轴)
      const targetY = this.flowPathAmplitude * Math.sin(pos.x * this.flowPathFrequency + this.time * 0.5);
      this.particleForces[i3 + 1] += (targetY - pos.y) * 0.006; // 减小吸附系数，让粒子别粘得那么死

      // 湍流力 - 添加动态强弱变化
      const noiseFactor = 0.02;
      const noiseTime = this.time * 0.2;
      const dynamicTurbulence = this.turbulenceStrength * (1 + Math.sin(this.time * 0.3) * 0.3); // 动态湍流强度
      this.particleForces[i3]     += this.noise.noise3D(pos.x * noiseFactor, pos.y * noiseFactor, noiseTime) * dynamicTurbulence;
      this.particleForces[i3 + 1] += this.noise.noise3D(pos.y * noiseFactor, pos.z * noiseFactor, noiseTime) * dynamicTurbulence;
      this.particleForces[i3 + 2] += this.noise.noise3D(pos.z * noiseFactor, pos.x * noiseFactor, noiseTime) * dynamicTurbulence;

      // 整体流向力
      this.particleForces[i3] += this.flowSpeed * this.flowDirection;

      // 4. 更新速度和位置
      // -----------------------------------
      this.particleVelocities[i3] += this.particleForces[i3];
      this.particleVelocities[i3 + 1] += this.particleForces[i3 + 1];
      this.particleVelocities[i3 + 2] += this.particleForces[i3 + 2];

      this.particlePositions[i3] += this.particleVelocities[i3];
      this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1];
      this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2];
      
      this.particleVelocities[i3] *= this.damping;
      this.particleVelocities[i3 + 1] *= this.damping;
      this.particleVelocities[i3 + 2] *= this.damping;
      
      // 边界循环
      if (this.particlePositions[i3] > boundaryWidth && this.flowDirection === 1) {
        this.particlePositions[i3] = -boundaryWidth;
      } else if (this.particlePositions[i3] < -boundaryWidth && this.flowDirection === -1) {
        this.particlePositions[i3] = boundaryWidth;
      }
      
      // 根据速度改变亮度
      const speed = Math.sqrt(this.particleVelocities[i3]**2 + this.particleVelocities[i3+1]**2);
      const brightness = Math.min(0.5 + speed * 2.0, 1.0);
      this.particleColors[i3] = this.particleColors[i3+1] = this.particleColors[i3+2] = brightness;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
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