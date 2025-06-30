// 多语言配置
const translations = {
  zh: {
    // 导航栏
    nav: {
      about: "关于",
      works: "作品",
      practice: "练习",
      cv: "简历",
      contact: "联系"
    },
    
    // 主页
    home: {
      subtitle: "一个探索现实与虚拟交互的猫妈妈。",
      spotlight: "正在加载特效..."
    },
    
    // 关于页面
    about: {
      title: "关于",
      content: "这里是关于页面的内容..."
    },
    
    // 作品页面
    works: {
      title: "作品",
      // 作品项目描述
      projects: {
        "yu": {
          title: "嘻哈舞者Yu",
          desc: "装置表演与游戏 · 2024"
        },
        "dream": {
          title: "救赎",
          desc: "动态影像 · 2023"
        },
        "mocap": {
          title: "在此处和彼处舞蹈",
          desc: "动作捕捉与Unity VR · 2025"
        },
        "flower": {
          title: "昼夜钢琴曲",
          desc: "JavaScript · 2024"
        },
        "water": {
          title: "能给我一些水吗...",
          desc: "Arduino装置 · 2024"
        },
        "ai": {
          title: "CXC不眠城",
          desc: "360度摄影 · 2021"
        }
      }
    },
    
    // 练习页面
    practice: {
      title: "自我练习",
      projects: {
        "mind-uploading": {
          title: "意识上传",
          desc: "UE4 · 动态影像 · VR · 装置艺术"
        },
        "unity-game": {
          title: "Unity小游戏",
          desc: "Unity可视化脚本和基础C#"
        },
        "js-pattern": {
          title: "JavaScript模式研究",
          desc: "JavaScript · 简单模式"
        },
        "unity-interactive": {
          title: "Unity互动练习",
          desc: "Unity + TouchDesigner + MediaPipe · 摄像头驱动粒子特效"
        },
        "js-clock": {
          title: "JavaScript花朵时钟",
          desc: "JavaScript · 数组 · Perlin噪声"
        },
        "discoball": {
          title: "迪斯科球 — 舞蹈动作可视化",
          desc: "Arduino · 拉伸传感器可穿戴互动项目"
        },
        "chicken-soup": {
          title: "鸡汤来了",
          desc: "JavaScript · 梗图 · 类和构造函数和回调和控制结构"
        },
        "togaither": {
          title: "一起AI",
          desc: "Stable diffusion · OBS · 表演"
        },
        "obs-exploration": {
          title: "OBS直播探索",
          desc: "OBS · 直播"
        },
        "help-me": {
          title: "帮助我",
          desc: "Figma · Keynote"
        },
        "flappy-bird": {
          title: "我的Flappy Bird项目",
          desc: "JavaScript · MediaPipe"
        },
        "hiphop-workshop": {
          title: "嘻哈舞蹈工作坊",
          desc: "教学 · 舞蹈 · 工作坊"
        }
      }
    },
    
    // CV页面
    cv: {
      title: "简历"
    },
    
    // 联系页面
    contact: {
      title: "联系"
    },
    
    // 通用
    common: {
      loading: "加载中...",
      close: "关闭",
      view: "查看",
      back: "返回"
    }
  },
  
  en: {
    // 导航栏
    nav: {
      about: "About",
      works: "Works", 
      practice: "Self Practice",
      cv: "CV",
      contact: "Contact"
    },
    
    // 主页
    home: {
      subtitle: "A cat mom who is exploring the interaction between the real and virtual.",
      spotlight: "Loading effects..."
    },
    
    // 关于页面
    about: {
      title: "About",
      content: "About page content..."
    },
    
    // 作品页面
    works: {
      title: "Works",
      projects: {
        "yu": {
          title: "Hiphop Dancer Yu",
          desc: "Installation Performance & Game · 2024"
        },
        "dream": {
          title: "Redemption",
          desc: "Moving Image · 2023"
        },
        "mocap": {
          title: "Dancing in Here and There",
          desc: "Motion Capture & Unity VR · 2025"
        },
        "flower": {
          title: "Piano Piece of Day and Night",
          desc: "JavaScript · 2024"
        },
        "water": {
          title: "Can You Please Give Me Some Water...",
          desc: "Arduino Installation · 2024"
        },
        "ai": {
          title: "CXC Sleepless City",
          desc: "360-degree Photography · 2021"
        }
      }
    },
    
    // 练习页面
    practice: {
      title: "Self Practice",
      projects: {
        "mind-uploading": {
          title: "Mind uploading",
          desc: "UE4 · Moving image · VR · Installation"
        },
        "unity-game": {
          title: "Unity Mini-Game",
          desc: "Unity Visual Script & C# basics"
        },
        "js-pattern": {
          title: "JavaScript Pattern Study",
          desc: "JavaScript · simple pattern"
        },
        "unity-interactive": {
          title: "Unity Interactive Practice",
          desc: "Unity + TouchDesigner + MediaPipe · Camera-driven particle FX"
        },
        "js-clock": {
          title: "JavaScript Flower clock",
          desc: "JavaScript · Arrays · Perlin Noise"
        },
        "discoball": {
          title: "Discoball — Dance Move Visualization",
          desc: "Arduino · Stretch-sensor wearable interactive project"
        },
        "chicken-soup": {
          title: "Here comes chicken soup",
          desc: "JavaScript · meme · class & constructor & callback & control structrures"
        },
        "togaither": {
          title: "TogAIther",
          desc: "Stable diffusion · OBS · Performance"
        },
        "obs-exploration": {
          title: "OBS live exploration",
          desc: "OBS · live streaming"
        },
        "help-me": {
          title: "Help me",
          desc: "Figma · Keynote"
        },
        "flappy-bird": {
          title: "My Flappy Bird project",
          desc: "JavaScript · MediaPipe"
        },
        "hiphop-workshop": {
          title: "Hiphop dance workshop",
          desc: "Teaching · dance · workshop"
        }
      }
    },
    
    // CV页面
    cv: {
      title: "CV"
    },
    
    // 联系页面
    contact: {
      title: "Contact"
    },
    
    // 通用
    common: {
      loading: "Loading...",
      close: "Close",
      view: "View",
      back: "Back"
    }
  }
};

// 语言管理类
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.init();
  }
  
  init() {
    this.updateLanguage();
    this.createLanguageToggle();
  }
  
  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updateLanguage();
  }
  
  getText(key) {
    const keys = key.split('.');
    let text = translations[this.currentLang];
    
    for (const k of keys) {
      if (text && text[k]) {
        text = text[k];
      } else {
        return key; // 如果找不到翻译，返回原key
      }
    }
    
    return text;
  }
  
  updateLanguage() {
    // 更新导航栏
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.includes('about.html')) {
        link.textContent = this.getText('nav.about');
      } else if (href.includes('works.html')) {
        link.textContent = this.getText('nav.works');
      } else if (href.includes('practice.html')) {
        link.textContent = this.getText('nav.practice');
      } else if (href.includes('cv.html')) {
        link.textContent = this.getText('nav.cv');
      } else if (href.includes('contact.html')) {
        link.textContent = this.getText('nav.contact');
      }
    });
    
    // 更新页面标题
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      const currentPage = window.location.pathname;
      if (currentPage.includes('about.html')) {
        pageTitle.textContent = this.getText('about.title');
      } else if (currentPage.includes('works.html')) {
        pageTitle.textContent = this.getText('works.title');
      } else if (currentPage.includes('practice.html')) {
        pageTitle.textContent = this.getText('practice.title');
      } else if (currentPage.includes('cv.html')) {
        pageTitle.textContent = this.getText('cv.title');
      } else if (currentPage.includes('contact.html')) {
        pageTitle.textContent = this.getText('contact.title');
      }
    }
    
    // 更新主页内容
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      heroSub.textContent = this.getText('home.subtitle');
    }
    
    // 更新作品页面项目
    this.updateWorksProjects();
    
    // 更新练习页面项目
    this.updatePracticeProjects();
  }
  
  updateWorksProjects() {
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
      const projectId = card.dataset.project;
      if (projectId && translations[this.currentLang].works.projects[projectId]) {
        const project = translations[this.currentLang].works.projects[projectId];
        const title = card.querySelector('.work-title');
        const desc = card.querySelector('.work-desc');
        const overlay = card.querySelector('.overlay');
        
        if (title) title.textContent = project.title;
        if (desc) desc.textContent = project.desc;
        
        // 更新overlay内容
        if (overlay) {
          const overlayText = overlay.childNodes[0];
          if (overlayText && overlayText.nodeType === Node.TEXT_NODE) {
            overlayText.textContent = project.title;
          }
        }
      }
    });
  }
  
  updatePracticeProjects() {
    const workCards = document.querySelectorAll('.practice-page .work-card');
    workCards.forEach(card => {
      const projectId = this.getProjectId(card);
      if (projectId && translations[this.currentLang].practice.projects[projectId]) {
        const project = translations[this.currentLang].practice.projects[projectId];
        const title = card.querySelector('.work-title');
        const desc = card.querySelector('.work-desc');
        
        if (title) title.textContent = project.title;
        if (desc) desc.textContent = project.desc;
      }
    });
  }
  
  getProjectId(card) {
    // 根据卡片内容推断项目ID
    const title = card.querySelector('.work-title')?.textContent.toLowerCase();
    if (title?.includes('mind')) return 'mind-uploading';
    if (title?.includes('unity') && title?.includes('mini')) return 'unity-game';
    if (title?.includes('javascript') && title?.includes('pattern')) return 'js-pattern';
    if (title?.includes('unity') && title?.includes('interactive')) return 'unity-interactive';
    if (title?.includes('javascript') && title?.includes('flower')) return 'js-clock';
    if (title?.includes('discoball')) return 'discoball';
    if (title?.includes('chicken soup')) return 'chicken-soup';
    if (title?.includes('togaither')) return 'togaither';
    if (title?.includes('obs')) return 'obs-exploration';
    if (title?.includes('help me')) return 'help-me';
    if (title?.includes('flappy bird')) return 'flappy-bird';
    if (title?.includes('hiphop')) return 'hiphop-workshop';
    return null;
  }
  
  createLanguageToggle() {
    // 创建语言切换按钮
    const nav = document.querySelector('.nav-inner');
    if (!nav) return;
    
    const langToggle = document.createElement('div');
    langToggle.className = 'lang-toggle';
    langToggle.innerHTML = `
      <button class="lang-btn" id="langBtn">
        <span class="lang-text">${this.currentLang === 'zh' ? 'EN' : '中'}</span>
      </button>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .lang-toggle {
        margin-left: 2rem;
        display: flex;
        align-items: center;
      }
      
      .lang-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        white-space: nowrap;
      }
      
      .lang-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }
      
      .lang-text {
        font-weight: 500;
      }
      
      @media (max-width: 768px) {
        .lang-toggle {
          margin-left: 1rem;
        }
        
        .lang-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }
      }
      
      @media (max-width: 600px) {
        .nav-inner {
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .lang-toggle {
          margin-left: 0;
          order: 3;
          width: 100%;
          justify-content: center;
          margin-top: 0.5rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    nav.appendChild(langToggle);
    
    // 添加点击事件
    const langBtn = document.getElementById('langBtn');
    langBtn.addEventListener('click', () => {
      const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
      this.setLanguage(newLang);
      langBtn.querySelector('.lang-text').textContent = newLang === 'zh' ? 'EN' : '中';
    });
  }
}

// 初始化语言管理器
window.languageManager = new LanguageManager(); 