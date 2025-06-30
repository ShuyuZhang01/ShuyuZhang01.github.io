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
    this.lastFrameTime = 0; // 新增：用于计算帧时间差
    this.mouseX = 0;
    this.mouseY = 0;
    
    // =================================================================
    // 【核心参数调整】: 为了实现平缓的左右流动
    // =================================================================
    this.particleCount = 8000;         // 粒子数量再增加，营造更浓密的星河
    this.particleSize = 1.8;           // 粒子可以稍小，显得更精致
    this.cameraDistance = 45;          // 相机稍远，视野更广
    this.maxVelocity = 0.8;            // 降低最大速度，让流动更平缓
    this.damping = 0.98;               // 轻微减小阻尼，让粒子能流动得更远
    
    // --- 核心修改：改变力的平衡 ---
    this.flowSpeed = 0.08;             // **显著提高**宏观流速，这是左右运动的主力
    this.repulsionStrength = 0.05;     // 减弱排斥力
    this.repulsionRadius = 2.0;        // 
    this.pathStrength = 0.005;         // **大幅减弱**路径引导力，避免剧烈上下运动
    this.pathAmplitude = 4.0;          // **大幅减小**路径弯曲幅度，让"河道"更平直
    this.pathFrequency = 0.02;         // 降低弯曲频率
    this.waveStrength = 0;             // **禁用**Y轴的噪声波浪，这是之前上下浮动的主要原因
    this.waveFrequency = 0.08;         // 
    this.waveSpeed = 0.1;              // 减慢波浪速度
    this.grid = new Map();
    this.gridSize = 5;                 // 增大网格尺寸以适应更缓和的互动
    this.sceneDepth = 50;              // 场景深度，方便在多个函数中使用
    this.boundaryDepth = 40;           // Z轴边界限制，防止粒子被雾效吞掉
    // =================================================================
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    this.particleAlphas = new Float32Array(this.particleCount); // 新增：用于存储每个粒子的透明度
    this.flowDirection = 1;
    this.directionChangeTime = 0;
    this.directionChangeInterval = 20000; // 20秒
    
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
    this.scene.fog = new THREE.Fog(0x0a0a0a, this.cameraDistance * 0.5, this.cameraDistance * 2.5);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = this.cameraDistance;
    
    // 【视觉调整】: 将相机Y轴下移，让水流出现在中下部
    this.camera.position.y = -8;
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0a0a, 0);
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
    container.style.background = 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)';
    container.appendChild(this.renderer.domElement);
    document.body.appendChild(container);
  }

  initParticleSystem() {
    const sceneWidth = 120; // 场景范围再扩大
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * sceneWidth * 2;
        const z = (Math.random() - 0.5) * this.sceneDepth;
        
        // 【核心修改】: 重新定义粒子生成区域，使其更像一条平直的"河"
        // 1. pathAmplitude 已经大幅减小，所以 sin 波起伏很小。
        // 2. 垂直随机范围也减小 (从 *10 变为 *8)，让粒子更集中。
        // 3. 整体区域下移 5 个单位。
        const pathY = this.pathAmplitude * Math.sin(x * this.pathFrequency);
        const y = pathY - 5 + (Math.random() - 0.5) * 8; 
        
        this.particlePositions[i3] = x;
        this.particlePositions[i3 + 1] = y;
        this.particlePositions[i3 + 2] = z;
        
        // 初始化速度，可以给一点随机的初始X轴速度，增加自然感
        this.particleVelocities[i3] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        
        // --- 核心修改：基于深度的视觉初始化 ---
        // Z值范围从 -sceneDepth/2 到 +sceneDepth/2
        // depthFactor 范围从 0 (最远) 到 1 (最近)
        const depthFactor = (z / this.sceneDepth) + 0.5;
        // 越远的粒子越暗，但整体亮度调高
        const brightness = 0.4 + depthFactor * 0.6; // 亮度范围：0.4 (最远) 到 1.0 (最近)
        this.particleColors[i3] = brightness;
        this.particleColors[i3 + 1] = brightness;
        this.particleColors[i3 + 2] = brightness;
        // 越远的粒子越透明 (近实远虚)
        this.particleAlphas[i] = 0.1 + depthFactor * 0.6;
    }
  }

  createFluidParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(this.particleAlphas, 1));
    // GLSL 着色器代码
    const vertexShader = `
      attribute float alpha;
      varying float vAlpha;
      varying vec3 vColor;
      uniform float size;
      void main() {
        vAlpha = alpha;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z); // 近大远小
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = `
      uniform sampler2D pointTexture;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        // 1. 从纹理中获取形状和透明度
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        
        // 2. 将顶点颜色 vColor 作为基础色，
        //    然后用纹理的alpha通道和我们自定义的vAlpha来控制最终的透明度
        gl_FragColor = vec4(vColor, 1.0);
        gl_FragColor.a *= vAlpha * texColor.a;
      }
    `;
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: this.createCircularParticleTexture() },
            size: { value: this.particleSize }
        },
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
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

  updateFluidDynamics(dt) {
    if (this.time - this.directionChangeTime > this.directionChangeInterval) {
      this.flowDirection *= -1;
      this.directionChangeTime = this.time;
    }
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
    const boundaryWidth = 100;
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const pos = { x: this.particlePositions[i3], y: this.particlePositions[i3 + 1], z: this.particlePositions[i3 + 2] };
        const vel = { x: this.particleVelocities[i3], y: this.particleVelocities[i3 + 1], z: this.particleVelocities[i3 + 2] };
        let force = { x: 0, y: 0, z: 0 };
        
        // =================================================================
        // 【核心修改】: 彻底改变力的计算方式
        // =================================================================

        // 1. **主导力**: 强大的、持续的水平推力
        force.x += this.flowSpeed * this.flowDirection * dt;

        // 2. **微弱的垂直引导**: 让粒子大致保持在一个平缓的Y轴区域内，但不起主导作用
        const pathY = this.pathAmplitude * Math.sin(pos.x * this.pathFrequency);
        force.y += (pathY - pos.y) * this.pathStrength; // 注意：去掉了 *0.3，因为pathStrength本身已经很小了

        // 3. **禁用Y轴波浪**: 这是关键！注释掉下面这行代码，消除了主要的上下浮动来源。
        // const waveY = this.noise.noise3D(pos.x * this.waveFrequency, pos.z * this.waveFrequency, this.time * this.waveSpeed) * this.waveStrength * 0.5;
        // force.y += waveY;
        
        // 4. (可选) 添加微弱的X/Z轴湍流，增加细节
        const turbulenceX = this.noise.noise3D(pos.y * 0.1, pos.z * 0.1, this.time * 0.1) * 0.01;
        const turbulenceZ = this.noise.noise3D(pos.x * 0.1, pos.y * 0.1, this.time * 0.1) * 0.01;
        force.x += turbulenceX;
        force.z += turbulenceZ;

        // =================================================================
        
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
        // 更新速度（Verlet ➜ Euler 足够）
        this.particleVelocities[i3] += force.x;
        this.particleVelocities[i3 + 1] += force.y;
        this.particleVelocities[i3 + 2] += force.z;
        // 速度上限，防"飙车"
        const vLen = Math.hypot(
            this.particleVelocities[i3],
            this.particleVelocities[i3 + 1],
            this.particleVelocities[i3 + 2]
        );
        if (vLen > this.maxVelocity) {
            const s = this.maxVelocity / vLen;
            this.particleVelocities[i3] *= s;
            this.particleVelocities[i3 + 1] *= s;
            this.particleVelocities[i3 + 2] *= s;
        }
        this.particleVelocities[i3] *= this.damping;
        this.particleVelocities[i3 + 1] *= this.damping;
        this.particleVelocities[i3 + 2] *= this.damping;
        // 根据 dt 位移
        this.particlePositions[i3] += this.particleVelocities[i3] * dt;
        this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1] * dt;
        this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2] * dt;
        
        // X轴边界循环
        if (this.particlePositions[i3] > boundaryWidth && this.flowDirection === 1) {
            this.particlePositions[i3] = -boundaryWidth;
        } else if (this.particlePositions[i3] < -boundaryWidth && this.flowDirection === -1) {
            this.particlePositions[i3] = boundaryWidth;
        }
        
        // Z轴边界限制，防止粒子被雾效吞掉
        if (this.particlePositions[i3 + 2] > this.boundaryDepth) {
            this.particlePositions[i3 + 2] = -this.boundaryDepth;
        } else if (this.particlePositions[i3 + 2] < -this.boundaryDepth) {
            this.particlePositions[i3 + 2] = this.boundaryDepth;
        }
        
        // 颜色随速度微调，限制亮度范围避免闪烁
        const baseBrightness = this.particleColors[i3];     // 初始常量
        const finalBrightness = Math.min(1.0,               // 限制 0-1
            baseBrightness * (1.0 + vLen * 2.0));
        this.particleSystem.geometry.attributes.color.setX(i, finalBrightness);
        this.particleSystem.geometry.attributes.color.setY(i, finalBrightness);
        this.particleSystem.geometry.attributes.color.setZ(i, finalBrightness);
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
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
    const now = performance.now();
    const dt = (now - this.lastFrameTime) * 0.001;  // 秒
    this.lastFrameTime = now;
    this.time += dt;                  // 用 dt 而不是固定 +0.01
    this.updateFluidDynamics(dt);     // 把 dt 传进去
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