// WebGL Background Effect - 方案一：深空星云 (修正版)
class WebGLBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.animationId = null;
    this.time = 0;
    this.lastFrameTime = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseTargetX = 0;
    this.mouseTargetY = 0;

    // --- 星云效果参数 ---
    this.particleCount = 10000;
    this.particleSize = 1.5;
    this.cameraDistance = 40;
    this.damping = 0.96;
    this.noise = new SimplexNoise();

    // 力学参数
    this.noiseTimeScale = 0.0001;
    this.noisePosScale = 0.05;
    this.noiseForce = 0.01;
    this.mouseRepulsion = 0.5;
    this.mouseRadius = 4;
    // 【核心修正 ①】: 禁用向心力，防止粒子塌缩
    this.centerPull = 0; // 将此值设为 0
    this.boxSize = this.cameraDistance * 1.5;

    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleVelocities = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);
    this.particleRandoms = new Float32Array(this.particleCount * 3);

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
    container.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; background-color:#05020D;';
    container.appendChild(this.renderer.domElement);
    document.body.insertAdjacentElement('afterbegin', container);
  }

  initParticles() {
    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        this.particlePositions[i3] = (Math.random() - 0.5) * this.boxSize;
        this.particlePositions[i3 + 1] = (Math.random() - 0.5) * this.boxSize;
        this.particlePositions[i3 + 2] = (Math.random() - 0.5) * this.boxSize;

        this.particleVelocities[i3] = 0;
        this.particleVelocities[i3 + 1] = 0;
        this.particleVelocities[i3 + 2] = 0;

        this.particleRandoms[i3] = Math.random() * 10;
        this.particleRandoms[i3 + 1] = Math.random() * 0.5 + 0.5;
        this.particleRandoms[i3 + 2] = Math.random() * 0.5 + 0.5;
    }
  }

  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(this.particleRandoms, 3));

    const vertexShader = `
      attribute vec3 aRandom;
      varying float vSpeed;
      uniform float time;
      uniform float size;
      void main() {
        vec3 pos = position;
        vSpeed = length(position); // 用离中心的距离来近似速度感
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * aRandom.y * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vSpeed;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        float speedFactor = smoothstep(0.0, 50.0, vSpeed);
        vec3 color1 = vec3(0.1, 0.2, 0.7); // Deep Blue
        vec3 color2 = vec3(0.8, 0.2, 0.9); // Magenta
        vec3 color3 = vec3(0.2, 0.8, 0.8); // Cyan
        
        vec3 finalColor = mix(color1, color2, speedFactor);
        finalColor = mix(finalColor, color3, dist * 0.8);
        
        float alpha = (1.0 - dist * 2.0) * (1.0 - speedFactor * 0.5);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: this.particleSize },
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  updatePhysics(dt) {
    const t = this.time * this.noiseTimeScale;
    const positions = this.particleSystem.geometry.attributes.position.array;
    const velocities = this.particleVelocities;
    const boxHalfSize = this.boxSize / 2;

    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        // 1. 噪声力
        let p = positions[i3] * this.noisePosScale;
        let q = positions[i3+1] * this.noisePosScale;
        let r = positions[i3+2] * this.noisePosScale;
        velocities[i3]   += this.noise.noise4D(p, q, r, t) * this.noiseForce;
        velocities[i3+1] += this.noise.noise4D(q, r, p, t) * this.noiseForce;
        velocities[i3+2] += this.noise.noise4D(r, p, q, t) * this.noiseForce;

        // 2. 向心力 (已被禁用)
        velocities[i3] -= positions[i3] * this.centerPull;
        velocities[i3+1] -= positions[i3+1] * this.centerPull;
        velocities[i3+2] -= positions[i3+2] * this.centerPull;

        // 3. 鼠标排斥力
        const dx = positions[i3] - (this.mouseX * (window.innerWidth/window.innerHeight) * 20);
        const dy = positions[i3+1] - (this.mouseY * 20);
        const distSq = dx * dx + dy * dy;
        if (distSq < this.mouseRadius * this.mouseRadius) {
            const dist = Math.sqrt(distSq);
            const force = (this.mouseRadius - dist) / dist * this.mouseRepulsion;
            velocities[i3] += dx * force;
            velocities[i3+1] += dy * force;
        }

        // 更新位置和阻尼
        positions[i3] += velocities[i3];
        positions[i3+1] += velocities[i3+1];
        positions[i3+2] += velocities[i3+2];

        velocities[i3] *= this.damping;
        velocities[i3+1] *= this.damping;
        velocities[i3+2] *= this.damping;

        // 【核心修正 ②】: 使用"循环边界"替代"反弹边界"
        if (positions[i3] > boxHalfSize) positions[i3] = -boxHalfSize;
        else if (positions[i3] < -boxHalfSize) positions[i3] = boxHalfSize;

        if (positions[i3+1] > boxHalfSize) positions[i3+1] = -boxHalfSize;
        else if (positions[i3+1] < -boxHalfSize) positions[i3+1] = boxHalfSize;

        if (positions[i3+2] > boxHalfSize) positions[i3+2] = -boxHalfSize;
        else if (positions[i3+2] < -boxHalfSize) positions[i3+2] = boxHalfSize;
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }
  
  addMouseInteraction() {
    window.addEventListener('mousemove', (e) => {
      this.mouseTargetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseTargetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    const now = performance.now();
    const dt = (now - (this.lastFrameTime || now));
    this.lastFrameTime = now;
    this.time += dt;

    this.mouseX += (this.mouseTargetX - this.mouseX) * 0.05;
    this.mouseY += (this.mouseTargetY - this.mouseY) * 0.05;

    this.particleSystem.material.uniforms.time.value = this.time;
    this.updatePhysics(dt * 0.01);
    
    this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouseY * 2 - this.camera.position.y) * 0.03;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.boxSize = this.cameraDistance * 1.5;
  }
  
  createCSSFallback() { /* ... 保持原样或删除 ... */ }
}

// 初始化
new WebGLBackground(); 