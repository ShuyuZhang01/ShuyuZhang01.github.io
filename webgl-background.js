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
    
    // =================================================================
    // 1. 参数大升级 (Parameters Overhaul)
    // =================================================================
    this.particleCount = 5000; // << 增加粒子数量，营造宏大感
    this.damping = 0.96;               // 阻尼 (Viscosity)
    this.flowSpeed = 0.1;              // 宏观流速 (Global Flow Speed)
    this.repulsionStrength = 0.15;     // 局部排斥力 (Local Repulsion)
    this.repulsionRadius = 2.5;        // 局部排斥半径 (Local Repulsion Radius)
    this.pathStrength = 0.008;         // 河道引导力强度 (Path Guiding Force)
    this.pathAmplitude = 10.0;         // 河道弯曲幅度 (Path Amplitude)
    this.pathFrequency = 0.03;         // 河道弯曲频率 (Path Frequency)
    this.waveStrength = 2.5;           // 波浪起伏强度 (Wave Height/Strength)
    this.waveFrequency = 0.05;         // 波浪大小/频率 (Wave Size/Frequency)
    this.waveSpeed = 0.3;              // 波浪移动速度 (Wave Speed)
    this.turbulenceStrength = 0.01;    // 内部湍流强度 (Fuzziness)
    this.turbulenceFrequency = 0.1;    // 湍流细节频率
    this.turbulenceSpeed = 0.1;        // 湍流演变速度
    // =================================================================
    // 2. 空间网格系统 (Spatial Grid System)
    // =================================================================
    this.grid = new Map();
    this.gridSize = 5; // << 网格大小，这是非常关键的调优参数
    // =================================================================
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    this.flowDirection = 1;
    this.directionChangeTime = 0;
    this.directionChangeInterval = 15000; // 15秒
    
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
    const sceneWidth = 100; // 扩大场景宽度
    const sceneDepth = 40;  // 增加场景深度
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        // 在一个广阔的3D空间内随机生成
        const x = (Math.random() - 0.5) * sceneWidth * 2;
        const z = (Math.random() - 0.5) * sceneDepth;
        // 计算河床的中心 Y 坐标
        const pathY = this.pathAmplitude * Math.sin(x * this.pathFrequency);
        // 在河床上下方散布粒子，形成有厚度的水流
        const y = pathY + (Math.random() - 0.5) * 15; // 在 Y 方向散开，形成厚度
        this.particlePositions[i3] = x;
        this.particlePositions[i3 + 1] = y;
        this.particlePositions[i3 + 2] = z;
        // 随机初始速度，增加初始动态
        this.particleVelocities[i3] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        // 根据 Z 轴深度赋予不同的初始颜色/亮度，增加立体感
        const brightness = 0.4 + (z / sceneDepth + 0.5) * 0.5;
        this.particleColors[i3] = brightness;
        this.particleColors[i3 + 1] = brightness;
        this.particleColors[i3 + 2] = brightness;
    }
  }

  createFluidParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending, // 叠加混合，产生发光效果
        sizeAttenuation: true,
        depthWrite: false, // 关闭深度写入，让粒子相互穿透，更像星云
        map: this.createCircularParticleTexture()
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
    // =================================================================
    // 1. 构建空间网格 (Build Spatial Grid)
    // =================================================================
    this.grid.clear();
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const x = this.particlePositions[i3];
        const y = this.particlePositions[i3 + 1];
        const z = this.particlePositions[i3 + 2];
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        const gridZ = Math.floor(z / this.gridSize);
        const key = `${gridX},${gridY},${gridZ}`;
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(i);
    }
    // =================================================================
    // 2. 计算所有力 (Calculate Forces)
    // =================================================================
    const boundaryWidth = 100;
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const pos = { x: this.particlePositions[i3], y: this.particlePositions[i3 + 1], z: this.particlePositions[i3 + 2] };
        const vel = { x: this.particleVelocities[i3], y: this.particleVelocities[i3 + 1], z: this.particleVelocities[i3 + 2] };
        let force = { x: 0, y: 0, z: 0 };
        // --- a. 宏观流动力 (Global Flow Force) ---
        force.x += this.flowSpeed * this.flowDirection;
        // --- b. 河道引导力 (Path Guiding Force) ---
        const pathY = this.pathAmplitude * Math.sin(pos.x * this.pathFrequency + this.time * 0.1);
        force.y += (pathY - pos.y) * this.pathStrength;
        // --- c. 表面波浪力 (Surface Wave Force) ---
        const waveY = this.noise.noise3D(pos.x * this.waveFrequency, pos.z * this.waveFrequency, this.time * this.waveSpeed) * this.waveStrength;
        force.y += waveY;
        // --- d. 内部湍流力 (Internal Turbulence Force) ---
        const turbTime = this.time * this.turbulenceSpeed;
        force.x += this.noise.noise3D(pos.y * this.turbulenceFrequency, pos.z * this.turbulenceFrequency, turbTime) * this.turbulenceStrength;
        force.y += this.noise.noise3D(pos.x * this.turbulenceFrequency, pos.z * this.turbulenceFrequency, turbTime) * this.turbulenceStrength;
        force.z += this.noise.noise3D(pos.x * this.turbulenceFrequency, pos.y * this.turbulenceFrequency, turbTime) * this.turbulenceStrength;
        // --- e. 局部排斥力 (Local Repulsion from Neighbors) ---
        const gridX = Math.floor(pos.x / this.gridSize);
        const gridY = Math.floor(pos.y / this.gridSize);
        const gridZ = Math.floor(pos.z / this.gridSize);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    const key = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
                    if (this.grid.has(key)) {
                        for (const neighborIndex of this.grid.get(key)) {
                            if (i === neighborIndex) continue;
                            const j3 = neighborIndex * 3;
                            const neighborPos = { x: this.particlePositions[j3], y: this.particlePositions[j3 + 1], z: this.particlePositions[j3 + 2] };
                            const diffX = pos.x - neighborPos.x;
                            const diffY = pos.y - neighborPos.y;
                            const diffZ = pos.z - neighborPos.z;
                            const distSq = diffX * diffX + diffY * diffY + diffZ * diffZ;
                            if (distSq > 0 && distSq < this.repulsionRadius * this.repulsionRadius) {
                                const dist = Math.sqrt(distSq);
                                const f = (1 - dist / this.repulsionRadius) * this.repulsionStrength / dist;
                                force.x += diffX * f;
                                force.y += diffY * f;
                                force.z += diffZ * f;
                            }
                        }
                    }
                }
            }
        }
        // --- 更新速度 ---
        this.particleVelocities[i3] += force.x;
        this.particleVelocities[i3 + 1] += force.y;
        this.particleVelocities[i3 + 2] += force.z;
        // --- 应用阻尼 ---
        this.particleVelocities[i3] *= this.damping;
        this.particleVelocities[i3 + 1] *= this.damping;
        this.particleVelocities[i3 + 2] *= this.damping;
        // --- 更新位置 ---
        this.particlePositions[i3] += this.particleVelocities[i3];
        this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1];
        this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2];
        // --- 边界循环 ---
        if (this.particlePositions[i3] > boundaryWidth && this.flowDirection === 1) {
            this.particlePositions[i3] = -boundaryWidth;
        } else if (this.particlePositions[i3] < -boundaryWidth && this.flowDirection === -1) {
            this.particlePositions[i3] = boundaryWidth;
        }
        // --- 根据速度和高度更新颜色 ---
        const speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
        const heightFactor = Math.max(0, Math.min(1, (pos.y / 20) + 0.5)); // 越高越亮
        const speedFactor = Math.min(1, speed * 2.0); // 越快越亮
        const brightness = 0.3 + heightFactor * 0.4 + speedFactor * 0.3;
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