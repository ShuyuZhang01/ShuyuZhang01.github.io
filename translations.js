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
      title: "简历",
      name: "张书语",
      title_desc: "互动与空间体验设计师 | 数字艺术家",
      location: "英国伦敦",
      phone: "+44 (0)7468 438 097",
      email: "zayaismyname@163.com",
      website: "https://shuyuzhang01.github.io/",
      education: "教育背景",
      core_skills: "核心技能与影响",
      professional_experience: "专业经验",
      selected_projects: "精选项目",
      technical_toolkit: "技术工具包",
      languages_interests: "语言与兴趣",
      referees: "推荐人",
      download_pdf: "下载PDF",
      education_items: {
        ma: "计算艺术硕士（在读） — 伦敦大学金史密斯学院，英国 | 2024年9月 – 2026年9月",
        ba: "艺术、技术与娱乐学士（一等荣誉） — 西交利物浦大学，中国 | 2019年9月 – 2024年6月"
      },
      skills_items: {
        interactive: "互动与空间体验设计 — Unity (C#, VFX Graph, VR), Unreal, OptiTrack。领导2025年现场VR舞蹈表演的动作捕捉和VFX。",
        coding: "创意编程与生成艺术 — JavaScript, TouchDesigner, Processing。创作《昼夜钢琴曲》(2024)，一个时间驱动的花朵生命周期动画。",
        physical: "物理计算 — Arduino C/C++, 焊接。构建《能给我一些水吗？》(2024) 检测土壤湿度的互动植物装置。",
        game: "游戏模组 — Lua, 绑定, Spriter, 叙事。创作《饥荒联机版》模组\"嘻哈舞者Yu\"。"
      },
      experience_items: {
        assistant1: "设计助理 — 苏州瑞深教育科技集团有限公司 | 2024年1月 – 9月。将研究洞察转化为提案，指导学生，提供双语翻译。",
        assistant2: "设计助理 — 江苏景天成文化旅游开发有限公司 | 2023年6月 – 7月。将访客反馈整合到新的导览路线中，用于试点启动。"
      },
      projects_items: {
        vr_dance: "2025 — 现场VR舞蹈表演 — 动作捕捉技术负责人 / VFX设计师",
        piano_piece: "2024 — 《昼夜钢琴曲》 — 独立创作者",
        water_installation: "2024 — 《能给我一些水吗？》 — 硬件集成师",
        hiphop_dancer: "2024 — 《嘻哈舞者Yu》 — 游戏模组与装置",
        caged_bird: "2023 — 《笼中鸟》短片 — 艺术总监 / 制作助理"
      },
      technical_toolkit_text: "Unity (高级) · TouchDesigner (中级) · JavaScript · Lua · Arduino C/C++ · Python · OptiTrack<br>Procreate · Photoshop · Figma · Maya | Git · Notion · Miro",
      languages_text: "英语 (雅思6.5) | 中文 (母语)<br>街舞 (popping/hip-hop) · 艺术博物馆 · 音乐",
      referees_items: {
        jessica: "Jessica Wolpert — 高级讲师，伦敦大学金史密斯学院<br>邮箱: J.Wolpert@gold.ac.uk | 电话: +44 7813 035 494",
        kim: "Kim Lau — 副教授，西交利物浦大学<br>邮箱: kim.lau02@xjtlu.edu.cn | 电话: +86 188 6269 1160"
      }
    },
    
    // 联系页面
    contact: {
      title: "联系",
      subtitle: "让我们一起创造一些有趣的东西",
      name_label: "姓名",
      email_label: "邮箱",
      message_label: "消息",
      send_button: "发送消息",
      alt_contact: "或者直接发邮件给我：",
      name_placeholder: "你的姓名",
      email_placeholder: "你的邮箱地址",
      message_placeholder: "告诉我你的想法..."
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
      title: "CV",
      name: "SHUYU ZHANG",
      title_desc: "Interactive & Spatial Experience Designer | Digital Artist",
      location: "London, UK",
      phone: "+44 (0)7468 438 097",
      email: "zayaismyname@163.com",
      website: "https://shuyuzhang01.github.io/",
      education: "EDUCATION",
      core_skills: "CORE SKILLS & IMPACT",
      professional_experience: "PROFESSIONAL EXPERIENCE",
      selected_projects: "SELECTED PROJECTS",
      technical_toolkit: "TECHNICAL TOOLKIT",
      languages_interests: "LANGUAGES & INTERESTS",
      referees: "REFEREES",
      download_pdf: "DOWNLOAD PDF",
      education_items: {
        ma: "MA Computational Arts (in progress) — Goldsmiths, University of London, UK | Sep 2024 – Sep 2026",
        ba: "BA Arts, Technology & Entertainment (First Class Honours) — Xi'an Jiaotong-Liverpool University, China | Sep 2019 – Jun 2024"
      },
      skills_items: {
        interactive: "Interactive & Spatial Experience Design — Unity (C#, VFX Graph, VR), Unreal, OptiTrack. Led motion-capture and VFX for 2025 live VR-dance performance.",
        coding: "Creative Coding & Generative Art — JavaScript, TouchDesigner, Processing. Created Piano Piece of Day and Night (2024), a time-driven flower lifecycle animation.",
        physical: "Physical Computing — Arduino C/C++, welding. Built Can I Have Some Water? (2024) interactive plant installation detecting soil moisture.",
        game: "Game Modding — Lua, rigging, Spriter, narrative. Authored Don't Starve Together mod \"The Hiphop Dancer Yu\"."
      },
      experience_items: {
        assistant1: "Design Assistant — Suzhou Ruishen Education Tech Group Co. Ltd. | Jan – Sep 2024. Converted research insights into proposals, mentored students, provided bilingual translation.",
        assistant2: "Design Assistant — Jiangsu Jingtiancheng Cultural Tourism Dev. Co. Ltd. | Jun – Jul 2023. Integrated visitor feedback into new tour-map routes adopted for pilot launch."
      },
      projects_items: {
        vr_dance: "2025 — Live VR Dance Performance — Motion Capture Tech Lead / VFX Designer",
        piano_piece: "2024 — Piano Piece of Day and Night — Independent Creator",
        water_installation: "2024 — Can I Have Some Water? — Hardware Integrator",
        hiphop_dancer: "2024 — Hiphop Dancer Yu — Game Modding & Installation",
        caged_bird: "2023 — Caged Bird Short Film — Art Director / Production Assistant"
      },
      technical_toolkit_text: "Unity (Advanced) · TouchDesigner (Intermediate) · JavaScript · Lua · Arduino C/C++ · Python · OptiTrack<br>Procreate · Photoshop · Figma · Maya | Git · Notion · Miro",
      languages_text: "English (IELTS 6.5) | Chinese (Native)<br>Popping/Hip-Hop Dance · Art Museums · Music",
      referees_items: {
        jessica: "Jessica Wolpert — Senior Lecturer, Goldsmiths, University of London<br>Email: J.Wolpert@gold.ac.uk | Phone: +44 7813 035 494",
        kim: "Kim Lau — Associate Professor, Xi'an Jiaotong-Liverpool University<br>Email: kim.lau02@xjtlu.edu.cn | Phone: +86 188 6269 1160"
      }
    },
    
    // 联系页面
    contact: {
      title: "Contact",
      subtitle: "Let's create something interesting together",
      name_label: "Name",
      email_label: "Email",
      message_label: "Message",
      send_button: "Send Message",
      alt_contact: "Or email me directly at:",
      name_placeholder: "Your name",
      email_placeholder: "Your email address",
      message_placeholder: "Tell me your thoughts..."
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
    // 确保DOM加载完成后再初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateLanguage();
        this.createLanguageToggle();
      });
    } else {
      this.updateLanguage();
      this.createLanguageToggle();
    }
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
    
    // 更新CV页面内容
    this.updateCVContent();
    
    // 更新联系页面内容
    this.updateContactContent();
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
  
  updateCVContent() {
    const cvPage = document.querySelector('.cv-page');
    if (!cvPage) return;
    
    // 更新CV页面内容
    const nameElement = cvPage.querySelector('h1');
    if (nameElement) {
      nameElement.textContent = this.getText('cv.name');
    }
    
    const titleDesc = cvPage.querySelector('p em');
    if (titleDesc) {
      titleDesc.textContent = this.getText('cv.title_desc');
    }
    
    const sectionTitles = cvPage.querySelectorAll('.cv-section-title');
    sectionTitles.forEach(title => {
      const text = title.textContent.toLowerCase();
      if (text.includes('education')) {
        title.textContent = this.getText('cv.education');
      } else if (text.includes('core skills') || text.includes('核心技能')) {
        title.textContent = this.getText('cv.core_skills');
      } else if (text.includes('professional experience') || text.includes('专业经验')) {
        title.textContent = this.getText('cv.professional_experience');
      } else if (text.includes('selected projects') || text.includes('精选项目')) {
        title.textContent = this.getText('cv.selected_projects');
      }
    });
  }
  
  updateContactContent() {
    const contactPage = document.querySelector('.contact-page');
    if (!contactPage) return;
    
    // 更新联系页面内容
    const labels = contactPage.querySelectorAll('label');
    labels.forEach(label => {
      const text = label.textContent.toLowerCase();
      if (text.includes('name') || text.includes('姓名')) {
        label.textContent = this.getText('contact.name_label');
      } else if (text.includes('email') || text.includes('邮箱')) {
        label.textContent = this.getText('contact.email_label');
      } else if (text.includes('message') || text.includes('消息')) {
        label.textContent = this.getText('contact.message_label');
      }
    });
    
    const sendButton = contactPage.querySelector('.contact-btn');
    if (sendButton) {
      sendButton.textContent = this.getText('contact.send_button');
    }
    
    const placeholders = contactPage.querySelectorAll('input[placeholder], textarea[placeholder]');
    placeholders.forEach(input => {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder.includes('name') || placeholder.includes('姓名')) {
        input.placeholder = this.getText('contact.name_placeholder');
      } else if (placeholder.includes('email') || placeholder.includes('邮箱')) {
        input.placeholder = this.getText('contact.email_placeholder');
      } else if (placeholder.includes('message') || placeholder.includes('消息')) {
        input.placeholder = this.getText('contact.message_placeholder');
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
    // 检查是否已经存在语言切换按钮
    if (document.querySelector('.lang-toggle')) {
      return;
    }
    
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
    if (!document.querySelector('#lang-toggle-styles')) {
      const style = document.createElement('style');
      style.id = 'lang-toggle-styles';
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
    }
    
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