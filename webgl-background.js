// WebGL Background Effect - 方案二：动态光绘
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.animationId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    // --- 光绘效果参数 ---
    this.particleCount = 15000;
    this.particleSize = 1.0;
    this.cameraDistance = 50;
    this.noise = new SimplexNoise();
    
    // 力学参数
    this.noiseScale = 0.02;
    this.noiseSpeed = 0.0002;
    this.maxSpeed = 0.1;
    this.turnSpeed = 0.05;
    this.mouseInfluence = 2;

    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);

    this.init();
  }

  init() {
    if (this.isHomePage() || !this.isWebGLAvailable() || typeof THREE === 'undefined') {
        this.createCSSFallback();
        return;
    }
    try {
      this.initThreeJS();
      this.initParticles();
      this.createParticleSystem();
      this.addMouseInteraction();
      this.animate();
      window.addEventListener('resize', () => this.onWindowResize());
    } catch (error) {
      console.error('WebGLBackground: 初始化失败', error);
      this.createCSSFallback();
    }
  }
  
  isHomePage() { return window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'); }
  isWebGLAvailable() { try { const canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch (e) { return false; } }

  initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = this.cameraDistance;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = document.createElement('div');
    container.id = 'webgl-background';
    container.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; background-color:#020208;';
    container.appendChild(this.renderer.domElement);
    document.body.insertAdjacentElement('afterbegin', container);
  }

  initParticles() {
    const w = this.cameraDistance * this.camera.aspect;
    const h = this.cameraDistance;
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        this.particlePositions[i3] = (Math.random() - 0.5) * w * 2.5;
        this.particlePositions[i3 + 1] = (Math.random() - 0.5) * h * 2.5;
        this.particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;

        this.particleVelocities[i3] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
        this.particleVelocities[i3 + 2] = 0;
    }
  }

  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    const material = new THREE.PointsMaterial({
        size: this.particleSize,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  updatePhysics() {
    const positions = this.particleSystem.geometry.attributes.position.array;
    const colors = this.particleSystem.geometry.attributes.color.array;
    const velocities = this.particleVelocities;
    const t = this.time * this.noiseSpeed;
    const w = this.cameraDistance * this.camera.aspect;
    const h = this.cameraDistance;

    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];

        // 1. 获取流场角度
        const angle = this.noise.noise3D(x * this.noiseScale, y * this.noiseScale, t) * Math.PI * 2;
        const targetVelX = Math.cos(angle) * this.maxSpeed;
        const targetVelY = Math.sin(angle) * this.maxSpeed;

        // 2. 粒子转向流场方向
        velocities[i3] += (targetVelX - velocities[i3]) * this.turnSpeed;
        velocities[i3 + 1] += (targetVelY - velocities[i3 + 1]) * this.turnSpeed;

        // 3. 鼠标交互
        const dx = x - this.mouseX;
        const dy = y - this.mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < this.mouseInfluence) {
            const force = (this.mouseInfluence - dist) / this.mouseInfluence;
            velocities[i3] += dy * force * 0.1; // 旋转力
            velocities[i3 + 1] -= dx * force * 0.1;
        }

        // 4. 更新位置
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];

        // 5. 边界处理（循环）
        if (x > w) positions[i3] = -w; else if (x < -w) positions[i3] = w;
        if (y > h) positions[i3 + 1] = -h; else if (y < -h) positions[i3 + 1] = h;

        // 6. 更新颜色
        const hue = (angle / (Math.PI * 2) + this.time * 0.00005) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
  }
  
  addMouseInteraction() {
    window.addEventListener('mousemove', (e) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.mouseX = (e.clientX - w / 2) * (this.cameraDistance * this.camera.aspect / (w / 2));
        this.mouseY = -(e.clientY - h / 2) * (this.cameraDistance / (h / 2));
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time = performance.now();
    this.updatePhysics();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  createCSSFallback() { /* ... 保持原样或删除 ... */ }
}

new WebGLBackground(); 