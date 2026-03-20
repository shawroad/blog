/* ============================================================
   CYBER BLOG — Main Application Script
   动态版本：文章从 posts/index.json + Markdown 文件读取
   ============================================================ */

// ─────────────────────────────────────────────
// 静态数据（项目、技能，不变）
// ─────────────────────────────────────────────

const SKILLS = [
  { name: 'JavaScript', color: '#ffee00', icon: '⚡' },
  { name: 'TypeScript', color: '#00f5ff', icon: '🔷' },
  { name: 'React',      color: '#00f5ff', icon: '⚛️' },
  { name: 'Vue 3',      color: '#00ff88', icon: '💚' },
  { name: 'Node.js',    color: '#00ff88', icon: '🟢' },
  { name: 'Python',     color: '#bf00ff', icon: '🐍' },
  { name: 'Rust',       color: '#ff6e00', icon: '🦀' },
  { name: 'Go',         color: '#00f5ff', icon: '🐹' },
  { name: 'Docker',     color: '#00f5ff', icon: '🐳' },
  { name: 'Kubernetes', color: '#bf00ff', icon: '☸️' },
  { name: 'AWS',        color: '#ffee00', icon: '☁️' },
  { name: 'PostgreSQL', color: '#00f5ff', icon: '🐘' },
  { name: 'Redis',      color: '#ff006e', icon: '⚡' },
  { name: 'GraphQL',    color: '#ff006e', icon: '◈' },
  { name: 'Next.js',    color: '#ffffff', icon: '▲' },
  { name: 'Three.js',   color: '#00ff88', icon: '🎮' },
];

const PROJECTS = [
  {
    icon: '🔮', name: 'NeoTerm',
    desc: '基于 Rust 构建的高性能终端模拟器，支持 GPU 加速渲染和自定义 Shader 主题。',
    tech: ['Rust', 'OpenGL', 'WGPU'], stars: '2.4k', lang: '🦀 Rust',
    github: '#', demo: '#',
  },
  {
    icon: '🧠', name: 'PromptLab',
    desc: 'Prompt 工程工作台，支持版本管理、A/B 测试、多模型对比和评估集管理。',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis'], stars: '1.1k', lang: '⚛️ TypeScript',
    github: '#', demo: '#',
  },
  {
    icon: '📦', name: 'ShipKit',
    desc: 'Next.js SaaS 快速启动模板，内置认证、支付、邮件、多租户，30 分钟上线。',
    tech: ['Next.js', 'Prisma', 'Stripe', 'Resend'], stars: '876', lang: '▲ Next.js',
    github: '#', demo: '#',
  },
  {
    icon: '🌐', name: 'EdgeFlow',
    desc: '基于 Cloudflare Workers 的 API 网关，支持速率限制、缓存策略和 A/B 路由。',
    tech: ['TypeScript', 'Cloudflare', 'Hono'], stars: '654', lang: '⚡ TypeScript',
    github: '#', demo: '#',
  },
  {
    icon: '🎮', name: 'PixelBoard',
    desc: '实时协作像素画布，支持 1000+ 人同时编辑，基于 CRDT 实现无冲突协同。',
    tech: ['React', 'WebSocket', 'CRDT', 'Canvas'], stars: '512', lang: '⚛️ React',
    github: '#', demo: '#',
  },
  {
    icon: '📊', name: 'LogPulse',
    desc: '轻量级日志分析平台，10 行配置接入，实时解析结构化日志，自动告警。',
    tech: ['Go', 'ClickHouse', 'Vue 3'], stars: '438', lang: '🐹 Go',
    github: '#', demo: '#',
  },
];

// tag → CSS class 映射
const TAG_CLASS_MAP = {
  'Rust':       'tag-pink',
  'React':      'tag-cyan',
  'Vue':        'tag-green',
  'TypeScript': 'tag-cyan',
  'JavaScript': 'tag-yellow',
  'DevOps':     'tag-green',
  'AI/ML':      'tag-yellow',
  '效率':        'tag-purple',
  'Go':         'tag-cyan',
  'Python':     'tag-purple',
};
function tagClass(tag) {
  return TAG_CLASS_MAP[tag] || 'tag-cyan';
}

// ─────────────────────────────────────────────
// 文章数据（动态加载）
// ─────────────────────────────────────────────

let POSTS = [];          // 文章列表（元数据）
let postsLoaded = false; // 是否已加载

/**
 * 加载 posts/index.json，获取文章元数据列表
 * 本地开发时需要 HTTP 服务（python -m http.server 即可）
 */
async function loadPostsIndex() {
  if (postsLoaded) return;
  try {
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    POSTS = await res.json();
    postsLoaded = true;
  } catch (e) {
    console.warn('⚠️ 无法加载 posts/index.json，使用本地演示数据。', e);
    // 本地直接打开 HTML 时 fetch 会失败，显示提示
    POSTS = [];
    postsLoaded = true;
  }
}

/**
 * 加载单篇文章的 Markdown 内容
 */
async function loadPostContent(filename) {
  const res = await fetch(`posts/${filename}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ─────────────────────────────────────────────
// 极简 Markdown → HTML 渲染器
// ─────────────────────────────────────────────

function renderMarkdown(md) {
  // 去掉 front matter
  let text = md.replace(/^---[\s\S]*?---\r?\n?/, '').trim();

  // 转义 HTML 特殊字符（在代码块外）
  // 先保护代码块
  const codeBlocks = [];
  text = text.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(`<pre data-lang="${lang || 'code'}"><code>${escaped}</code></pre>`);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // 行内代码
  const inlineCodes = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    const escaped = c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    inlineCodes.push(`<code>${escaped}</code>`);
    return `\x00INLINE${inlineCodes.length - 1}\x00`;
  });

  // 标题
  text = text.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>');
  text = text.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>');
  text = text.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>');
  text = text.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');

  // 引用块
  text = text.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // 合并相邻 blockquote
  text = text.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // 无序列表
  text = text.replace(/((?:^[-*+]\s+.+\n?)+)/gm, match => {
    const items = match.trim().split('\n').map(l =>
      `<li>${l.replace(/^[-*+]\s+/, '')}</li>`
    ).join('');
    return `<ul>${items}</ul>`;
  });

  // 有序列表
  text = text.replace(/((?:^\d+\.\s+.+\n?)+)/gm, match => {
    const items = match.trim().split('\n').map(l =>
      `<li>${l.replace(/^\d+\.\s+/, '')}</li>`
    ).join('');
    return `<ol>${items}</ol>`;
  });

  // 粗体 / 斜体
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 链接 & 图片
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 水平线
  text = text.replace(/^---+$/gm, '<hr />');

  // 段落（空行分隔，非标签行）
  text = text.split(/\n{2,}/).map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|img)/.test(block)) return block;
    if (/\x00CODE/.test(block)) return block;
    return `<p>${block.replace(/\n/g, ' ')}</p>`;
  }).join('\n');

  // 还原占位符
  text = text.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeBlocks[i]);
  text = text.replace(/\x00INLINE(\d+)\x00/g, (_, i) => inlineCodes[i]);

  return text;
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

let currentPage   = 'home';
let activeTag     = 'all';

async function showPage(name, extra) {
  // 确保文章数据已加载
  await loadPostsIndex();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${name}`);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo(0, 0);
  currentPage = name;

  // 导航高亮
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });

  // 关闭移动端菜单
  document.getElementById('navLinks').classList.remove('open');

  if (name === 'home')      initHome();
  if (name === 'blog')      initBlog();
  if (name === 'article')   initArticle(extra);
  if (name === 'portfolio') initPortfolio();
  if (name === 'about')     initAbout();

  setTimeout(triggerReveal, 50);
}

// ─────────────────────────────────────────────
// INIT FUNCTIONS
// ─────────────────────────────────────────────

function initHome() {
  typeText('heroName', ['Creative Dev', 'Full-Stack Engineer', 'OSS Builder', 'Problem Solver'], 100);

  const grid = document.getElementById('homePostsGrid');
  if (POSTS.length === 0) {
    grid.innerHTML = emptyPostsHint();
  } else {
    grid.innerHTML = POSTS.slice(0, 3).map(renderPostCard).join('');
  }

  const sg = document.getElementById('skillsGrid');
  sg.innerHTML = SKILLS.map(skillTag).join('');
}

function initBlog() {
  activeTag = 'all';

  const tags = ['all', ...new Set(POSTS.map(p => p.tag))];
  const tf   = document.getElementById('tagFilter');
  tf.innerHTML = tags.map(t => `
    <div class="skill-tag" style="cursor:pointer" data-tag="${t}" onclick="filterTag('${t}')">
      ${t === 'all' ? '🌐 全部' : t}
    </div>
  `).join('');
  updateTagStyles();
  renderBlogPosts();
}

function filterTag(tag) {
  activeTag = tag;
  updateTagStyles();
  renderBlogPosts();
}

function updateTagStyles() {
  document.querySelectorAll('#tagFilter .skill-tag').forEach(el => {
    const isActive = el.dataset.tag === activeTag;
    el.style.borderColor = isActive ? 'var(--border-glow)' : '';
    el.style.color        = isActive ? 'var(--neon-cyan)' : '';
    el.style.background   = isActive ? 'rgba(0,245,255,0.06)' : '';
  });
}

function renderBlogPosts() {
  const posts = activeTag === 'all' ? POSTS : POSTS.filter(p => p.tag === activeTag);
  const grid  = document.getElementById('blogPostsGrid');
  grid.innerHTML = posts.length ? posts.map(renderPostCard).join('') : emptyPostsHint();
}

function renderPostCard(post) {
  const tc = post.tagClass || tagClass(post.tag);
  return `
    <div class="card post-card reveal" onclick="showPage('article','${post.filename}')">
      <div class="post-card-cover">
        <div class="post-card-cover-inner ${post.cover || 'cover-1'}">${post.emoji || '📝'}</div>
      </div>
      <div class="post-meta">
        <span class="post-tag ${tc}">${post.tag}</span>
        <span class="post-date">${post.date}</span>
      </div>
      <div class="post-title">${post.title}</div>
      <div class="post-excerpt">${post.excerpt}</div>
      <div class="post-card-footer">
        <span class="read-time">⏱ ${post.readTime} read</span>
        <span class="read-more">阅读全文 →</span>
      </div>
    </div>
  `;
}

async function initArticle(filename) {
  const post = POSTS.find(p => p.filename === filename);
  const container = document.getElementById('articleContainer');

  // 加载中状态
  container.innerHTML = `
    <button class="article-back" onclick="showPage('blog')">← 返回文章列表</button>
    <div style="text-align:center;padding:80px 0;color:var(--text-muted);font-family:var(--font-mono)">
      <div style="font-size:2rem;margin-bottom:16px;animation:pulse 1.5s infinite">⚡</div>
      加载文章中…
    </div>
  `;

  try {
    const rawMd  = await loadPostContent(filename);
    const html   = renderMarkdown(rawMd);
    const tc     = post ? (post.tagClass || tagClass(post.tag)) : 'tag-cyan';
    const views  = Math.floor(Math.random() * 3000 + 500);

    container.innerHTML = `
      <button class="article-back" onclick="showPage('blog')">← 返回文章列表</button>
      <article>
        <header class="article-header">
          <div class="article-meta-top">
            ${post ? `<span class="post-tag ${tc}">${post.tag}</span>` : ''}
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted)">${post?.date || ''}</span>
          </div>
          <h1 class="article-title">${post?.title || filename}</h1>
          ${post?.excerpt ? `<p class="article-subtitle">${post.excerpt}</p>` : ''}
          <div class="article-meta-bottom">
            <div class="meta-author">
              <div class="author-avatar">CD</div>
              <div class="author-name">Creative Dev</div>
            </div>
            <span class="meta-sep">·</span>
            <span class="meta-info">⏱ ${post?.readTime || '?'} read</span>
            <span class="meta-sep">·</span>
            <span class="meta-info">👁 ${views} views</span>
          </div>
        </header>
        <div class="article-body">${html}</div>

        <!-- 相关文章 -->
        <div style="margin-top:60px;padding-top:40px;border-top:1px solid var(--border-dim)">
          <div class="section-label" style="margin-bottom:20px">MORE POSTS</div>
          <div class="posts-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
            ${POSTS.filter(p => p.filename !== filename).slice(0, 2).map(renderPostCard).join('')}
          </div>
        </div>
      </article>
    `;
  } catch (e) {
    container.innerHTML = `
      <button class="article-back" onclick="showPage('blog')">← 返回文章列表</button>
      <div style="text-align:center;padding:80px 0;color:var(--neon-pink);font-family:var(--font-mono)">
        ⚠️ 文章加载失败：${e.message}
      </div>
    `;
  }

  setTimeout(triggerReveal, 50);
}

function initPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = PROJECTS.map(p => `
    <div class="card project-card reveal">
      <div class="project-header">
        <div class="project-icon">${p.icon}</div>
        <div class="project-links">
          <a class="project-link" href="${p.github}" title="GitHub" target="_blank">⚡</a>
          <a class="project-link" href="${p.demo}" title="Demo" target="_blank">🚀</a>
        </div>
      </div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted)">⭐ ${p.stars}</span>
        <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary)">${p.lang}</span>
      </div>
      <div class="project-tech">
        ${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function initAbout() {
  const sg = document.getElementById('aboutSkillsGrid');
  if (sg) sg.innerHTML = SKILLS.map(skillTag).join('');
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function skillTag(s) {
  return `
    <div class="skill-tag">
      <span class="skill-dot" style="background:${s.color};box-shadow:0 0 6px ${s.color}"></span>
      ${s.icon} ${s.name}
    </div>
  `;
}

function emptyPostsHint() {
  return `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-family:var(--font-mono)">
      <div style="font-size:2.5rem;margin-bottom:16px">📭</div>
      <div style="margin-bottom:8px">暂无文章</div>
      <div style="font-size:0.78rem;color:var(--text-muted)">
        本地预览需启动 HTTP 服务（<code style="color:var(--neon-cyan)">python3 -m http.server 8899</code>）<br/>
        或部署到 GitHub Pages 后即可正常显示文章
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────

const typedStates = {};
function typeText(id, words, speed = 80) {
  const el = document.getElementById(id);
  if (!el) return;
  if (typedStates[id]) clearInterval(typedStates[id]);

  let wi = 0, ci = 0, deleting = false;

  typedStates[id] = setInterval(() => {
    const word = words[wi];
    if (deleting) ci--; else ci++;
    el.innerHTML = word.slice(0, ci) + '<span class="typed-cursor"></span>';

    if (!deleting && ci === word.length) {
      setTimeout(() => { deleting = true; }, 1800);
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
  }, deleting ? speed / 2 : speed);
}

function triggerReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function submitForm(e) {
  e.preventDefault();
  showToast('✅ 消息已发送！我会尽快回复你。');
  e.target.reset();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// 导航栏滚动隐藏
let lastY = 0;
window.addEventListener('scroll', () => {
  const y  = window.scrollY;
  const nb = document.getElementById('navbar');
  nb.style.transform = (y > lastY && y > 100) ? 'translateY(-100%)' : '';
  lastY = y;
}, { passive: true });

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
});
