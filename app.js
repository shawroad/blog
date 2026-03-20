/* ============================================================
   CYBER BLOG — Main Application Script
   ============================================================ */

// ─────────────────────────────────────────────
// DATA
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

const POSTS = [
  {
    id: 1,
    title: '用 Rust 重写我的 CLI 工具：性能提升 10x 的实战记录',
    excerpt: '从 Python 迁移到 Rust 的完整心路历程，涵盖所有权系统的理解、异步并发的实践，以及令人吃惊的性能数字。',
    cover: 'cover-1', emoji: '🦀',
    tag: 'Rust', tagClass: 'tag-pink',
    date: '2026-03-18', readTime: '12 min',
    content: `
<h2>为什么要重写？</h2>
<p>一切的起点是一个令人沮丧的基准测试结果：我的 Python CLI 工具在处理 10 万行日志时需要 <strong>8.2 秒</strong>，而同事用 Go 写的版本只需要 <strong>0.9 秒</strong>。这个差距让我坐不住了。</p>
<blockquote>「工具是思维的延伸。慢工具不只是慢，它会改变你解决问题的方式——让你下意识地避开需要工具参与的场景。」</blockquote>
<h2>选择 Rust 而不是 Go</h2>
<p>我最终选择了 Rust，原因有三：</p>
<ul>
  <li>零成本抽象——不为用不到的功能付出运行时代价</li>
  <li>内存安全——所有权系统在编译期消灭了一大类 bug</li>
  <li>个人挑战——Rust 的学习曲线出了名的陡，我想看看自己能不能爬上去</li>
</ul>
<h2>所有权系统：最难但最值的东西</h2>
<p>Rust 的所有权系统是最独特的地方，也是最容易让新手碰壁的地方。核心规则很简单：</p>
<pre data-lang="rust"><code>fn main() {
    // s1 拥有这个 String
    let s1 = String::from("hello");
    
    // 所有权转移给 s2，s1 失效
    let s2 = s1;
    
    // 这行会编译错误！
    // println!("{}", s1); // ERROR: use of moved value
    
    // 借用：只读引用，不转移所有权
    let len = calculate_length(&s2);
    println!("'{}' 的长度是 {}", s2, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s 离开作用域，但它只是引用，不释放数据</code></pre>
<h3>实战中的并发处理</h3>
<p>用 <code>rayon</code> crate 实现数据并行处理，把原本的串行遍历改成并行迭代器，代码量几乎没变，但速度直接翻了 4 倍：</p>
<pre data-lang="rust"><code>use rayon::prelude::*;

fn process_logs(logs: Vec&lt;LogEntry&gt;) -&gt; Vec&lt;ParsedLog&gt; {
    logs.par_iter()           // 并行迭代器，魔法就在这一行
        .filter(|log| log.level == "ERROR")
        .map(|log| parse_entry(log))
        .collect()
}</code></pre>
<h2>最终结果</h2>
<p>重写后的 Rust 版本在同样的 10 万行日志测试中：</p>
<div class="callout">
  ⚡ 执行时间：<strong>0.78 秒</strong>（原 Python 版本：8.2 秒）<br/>
  📦 二进制体积：<strong>2.1 MB</strong>（单文件，无依赖）<br/>
  💾 内存占用：<strong>降低 60%</strong>
</div>
<h2>结语</h2>
<p>学 Rust 的过程就像跟一个极度严格的编译器搏斗，它会拒绝你写出的每一段不安全代码，逼你真正理解内存管理。但一旦代码通过编译，它几乎总是能正确运行。这种「先苦后甜」的感觉，很上头。</p>
    `
  },
  {
    id: 2,
    title: '构建高性能 React 应用：从 Re-render 地狱逃出来',
    excerpt: '深入分析 React 渲染机制，用 memo、useMemo、useCallback 和 Profiler 系统性解决性能瓶颈。',
    cover: 'cover-2', emoji: '⚛️',
    tag: 'React', tagClass: 'tag-cyan',
    date: '2026-03-10', readTime: '9 min',
    content: `
<h2>你以为你的 React 很快，其实并不是</h2>
<p>我曾经接手过一个「跑起来有点卡」的中台应用。打开 React DevTools Profiler 一看，惊了——每次点击一个按钮，整棵组件树都在重新渲染。一个简单的状态更新，触发了 <strong>200+</strong> 次不必要的 render。</p>
<h2>问题根源：状态放错了地方</h2>
<p>最常见的性能陷阱不是某个 API 调用慢，而是<strong>状态提升过度</strong>。把所有 state 都放在顶层，任何一个状态变化，都会从顶层开始触发整棵树的 reconciliation。</p>
<h3>解决方案一：状态下移</h3>
<pre data-lang="jsx"><code>// ❌ 问题写法：搜索状态放在父组件
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    &lt;&gt;
      &lt;HeavyChart /&gt;           {/* 每次输入都会重渲染！ */}
      &lt;SearchInput value={query} onChange={setQuery} /&gt;
      &lt;SearchResults query={query} /&gt;
    &lt;/&gt;
  );
}

// ✅ 好的写法：把搜索状态封装起来
function Dashboard() {
  return (
    &lt;&gt;
      &lt;HeavyChart /&gt;           {/* 完全不受搜索影响 */}
      &lt;SearchSection /&gt;        {/* 内部管理自己的状态 */}
    &lt;/&gt;
  );
}</code></pre>
<h3>解决方案二：正确使用 memo</h3>
<pre data-lang="jsx"><code>// memo 只在 props 引用不变时跳过渲染
const HeavyChart = React.memo(({ data, config }) => {
  // 昂贵的渲染逻辑
  return &lt;canvas .../&gt;;
});

function Parent({ rawData }) {
  // ✅ useMemo 确保 config 对象引用稳定
  const config = useMemo(() => ({
    color: '#00f5ff',
    animation: true,
  }), []); // 只创建一次
  
  const processedData = useMemo(
    () => expensiveProcess(rawData),
    [rawData]  // rawData 变化时才重新计算
  );
  
  return &lt;HeavyChart data={processedData} config={config} /&gt;;
}</code></pre>
<h2>用 Profiler 量化优化结果</h2>
<p>优化要有数据支撑，不能靠感觉。React DevTools 的 Profiler 面板可以精确记录每次提交的渲染时间和组件树。</p>
<blockquote>我们这个案例的最终结果：页面核心交互的渲染时间从 <strong>340ms</strong> 降到了 <strong>28ms</strong>，用户能明显感受到「丝滑」了。</blockquote>
<h2>一个实用检查清单</h2>
<ul>
  <li>大型列表用 <code>react-window</code> 虚拟化</li>
  <li>频繁变化的 state 做状态下移或隔离</li>
  <li>传给子组件的回调函数用 <code>useCallback</code> 包裹</li>
  <li>昂贵计算用 <code>useMemo</code>，但不要滥用——简单计算加 memo 反而更慢</li>
  <li>用 <code>React.lazy</code> + <code>Suspense</code> 做路由级代码分割</li>
</ul>
    `
  },
  {
    id: 3,
    title: 'Docker + K8s 从零到生产环境：一篇过于详细的指南',
    excerpt: '手把手搭建容器化部署流水线，包括 Dockerfile 优化、K8s 资源配置、滚动更新和健康检查。',
    cover: 'cover-3', emoji: '🐳',
    tag: 'DevOps', tagClass: 'tag-green',
    date: '2026-02-28', readTime: '15 min',
    content: `
<h2>为什么要容器化</h2>
<p>「在我电脑上是好的」这句话，是程序员圈子里一个令人心酸的梗。容器化的核心价值就是消灭这种环境差异，让应用的运行环境成为可版本化、可复制的代码。</p>
<h2>写一个生产级别的 Dockerfile</h2>
<pre data-lang="dockerfile"><code># 多阶段构建：构建产物和运行环境分离
# Stage 1: 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: 代码构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: 最终运行镜像（最小化）
FROM node:20-alpine AS runner
WORKDIR /app

# 安全：不用 root 运行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]</code></pre>
<p>这个多阶段构建把最终镜像体积从 <strong>1.2GB</strong> 压缩到了 <strong>180MB</strong>。</p>
<h2>K8s Deployment 配置</h2>
<pre data-lang="yaml"><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # 滚动更新时最多多 1 个 Pod
      maxUnavailable: 0   # 保证始终有足够实例
  template:
    spec:
      containers:
      - name: app
        image: my-app:v1.2.3
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:   # 存活探针
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:  # 就绪探针
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5</code></pre>
<h2>关键配置解读</h2>
<ul>
  <li><strong>resources.requests/limits</strong>：不设置资源限制，一个失控的 Pod 会把整个节点打死</li>
  <li><strong>livenessProbe</strong>：检测应用是否需要重启（死锁、内存泄漏等）</li>
  <li><strong>readinessProbe</strong>：检测应用是否准备好接流量，新 Pod 没 ready 之前不会被加进 Service</li>
  <li><strong>maxUnavailable: 0</strong>：零停机发布的关键配置</li>
</ul>
    `
  },
  {
    id: 4,
    title: '用 LLM 构建真正有用的 AI 助手：工程实践总结',
    excerpt: '绕开 LLM 幻觉、长上下文、工具调用等工程难点，分享生产环境中积累的实战经验。',
    cover: 'cover-4', emoji: '🤖',
    tag: 'AI/ML', tagClass: 'tag-yellow',
    date: '2026-02-15', readTime: '11 min',
    content: `
<h2>LLM 应用开发的真实难点</h2>
<p>把 GPT API 套一层壳做个聊天机器人，这不叫 AI 应用开发。真正的挑战在于：如何让模型的能力可靠、可测量地服务于具体业务场景。</p>
<h2>难点一：幻觉问题</h2>
<p>LLM 会一本正经地胡说八道。解决方案是 <strong>RAG（检索增强生成）</strong>：不让模型凭空回答，而是先检索相关文档，再让模型基于文档作答。</p>
<pre data-lang="python"><code>from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA

# 1. 构建知识库向量索引
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings()
)

# 2. 创建 RAG Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o"),
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": 5}  # 检索最相关的 5 个片段
    ),
    chain_type="stuff",
    return_source_documents=True  # 返回引用来源，可验证
)</code></pre>
<h2>难点二：工具调用的可靠性</h2>
<p>Function Calling 是让 LLM 真正能「做事」的关键，但工具定义写得不好，模型就会调用错误或传错参数。</p>
<div class="callout">
  💡 <strong>最佳实践</strong>：工具描述要极度精确，包括参数的取值范围、格式要求和副作用说明。把工具描述当作给另一个不会问问题的工程师写的接口文档。
</div>
<h2>难点三：评估体系</h2>
<p>AI 应用不能靠「感觉还不错」来做质量保证。你需要建立系统性的评估流程：</p>
<ul>
  <li>构建黄金测试集（含预期答案的问题集合）</li>
  <li>用 LLM-as-Judge 做自动评分</li>
  <li>追踪 Latency、Token 消耗、拒绝率等关键指标</li>
  <li>每次 Prompt 修改前后对比评分，避免「修好了这个，坏了那个」</li>
</ul>
    `
  },
  {
    id: 5,
    title: 'TypeScript 高级类型体操：让类型系统为你工作',
    excerpt: '条件类型、映射类型、模板字符串类型……TypeScript 的类型系统远比你想象的强大。',
    cover: 'cover-5', emoji: '🔷',
    tag: 'TypeScript', tagClass: 'tag-cyan',
    date: '2026-01-30', readTime: '8 min',
    content: `
<h2>TypeScript 类型系统的本质</h2>
<p>TypeScript 的类型系统是图灵完备的——是的，你可以用纯类型运算做任意计算。这既是强大的保证，也是「类型体操」这个词存在的原因。</p>
<h2>条件类型：类型级的 if-else</h2>
<pre data-lang="typescript"><code>// 提取 Promise 的 resolve 类型
type Awaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T;

type A = Awaited&lt;Promise&lt;string&gt;&gt;;  // string
type B = Awaited&lt;number&gt;;            // number

// 实用工具：递归 Awaited
type DeepAwaited&lt;T&gt; = T extends Promise&lt;infer U&gt;
  ? DeepAwaited&lt;U&gt;
  : T;

type C = DeepAwaited&lt;Promise&lt;Promise&lt;string&gt;&gt;&gt;;  // string</code></pre>
<h2>映射类型：批量变换属性</h2>
<pre data-lang="typescript"><code>// 把所有属性变成可选且只读
type ImmutablePartial&lt;T&gt; = {
  readonly [K in keyof T]?: T[K]
};

// 只保留指定类型的属性
type PickByValue&lt;T, V&gt; = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
};

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

// 只剩 { name: string; email: string }
type StringProps = PickByValue&lt;User, string&gt;;</code></pre>
<h2>模板字符串类型</h2>
<pre data-lang="typescript"><code>type EventName&lt;T extends string&gt; = \`on\${Capitalize&lt;T&gt;}\`;
type ClickEvent = EventName&lt;'click'&gt;;  // 'onClick'

// 实战：自动生成 getter 方法类型
type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () =&gt; T[K]
};

type UserGetters = Getters&lt;User&gt;;
// { getId: () => number; getName: () => string; ... }</code></pre>
<h2>何时用类型体操，何时不用</h2>
<blockquote>类型体操的目的是消灭运行时错误，而不是炫技。如果一个复杂类型让你的同事需要花 30 分钟才能看懂，这个类型就没有完成它的使命。</blockquote>
    `
  },
  {
    id: 6,
    title: '我的效率工具箱 2026：那些真正改变工作方式的工具',
    excerpt: '终端、编辑器、笔记、自动化……精选 20 个让我每天少浪费 1 小时的工具，附配置。',
    cover: 'cover-6', emoji: '🛠️',
    tag: '效率', tagClass: 'tag-purple',
    date: '2026-01-15', readTime: '7 min',
    content: `
<h2>原则：工具服务于流程，而不是相反</h2>
<p>我每年都会系统性地审视一遍自己的工具链：哪些工具在真正节省时间？哪些只是「看起来很强大」但从来不用？这篇文章是 2026 年版本的整理结果。</p>
<h2>终端：oh-my-zsh + 精选插件</h2>
<pre data-lang="bash"><code># 最重要的几个插件
plugins=(
  git                  # git 别名（gst, gaa, gcmsg...）
  zsh-autosuggestions  # 灰色自动补全，神器
  zsh-syntax-highlighting # 实时高亮，命令拼错立刻发现
  fzf                  # 模糊搜索历史、文件、进程
  z                    # 智能跳转目录（比 cd 好用 10 倍）
)</code></pre>
<h2>编辑器：VS Code 最重要的 10 个插件</h2>
<ul>
  <li><strong>GitHub Copilot</strong> — AI 补全，接受率 40%+</li>
  <li><strong>GitLens</strong> — 每行代码的 git blame，代码考古神器</li>
  <li><strong>Error Lens</strong> — 错误显示在行尾，不用把鼠标移过去</li>
  <li><strong>Pretty TypeScript Errors</strong> — 把 TS 错误翻译成人话</li>
  <li><strong>REST Client</strong> — .http 文件直接发请求，不用 Postman</li>
</ul>
<h2>笔记：Obsidian 双链笔记系统</h2>
<p>从 Notion 迁移到 Obsidian 之后，我的笔记第一次开始「生长」——双向链接让不同主题的笔记自然产生关联，形成知识网络而不是孤立文档。</p>
<div class="callout">
  📁 我的 Obsidian Vault 结构：<br/>
  <code>00-收件箱</code> → <code>10-项目</code> → <code>20-领域知识</code> → <code>30-资源</code> → <code>40-归档</code><br/>
  每周做一次周回顾，把收件箱清空。
</div>
<h2>自动化：一次配置，永久省时</h2>
<ul>
  <li><code>Raycast</code>：macOS 效率启动器，替代 Spotlight</li>
  <li><code>Hammerspoon</code>：用 Lua 脚本驱动 macOS 自动化</li>
  <li><code>GitHub Actions</code>：自动化一切可以自动化的 CI/CD 流程</li>
</ul>
    `
  },
];

const PROJECTS = [
  {
    icon: '🔮',
    name: 'NeoTerm',
    desc: '一款基于 Rust 构建的高性能终端模拟器，支持 GPU 加速渲染和自定义 Shader 主题。',
    tech: ['Rust', 'OpenGL', 'WGPU'],
    stars: '2.4k', lang: '🦀 Rust',
    github: '#', demo: '#',
  },
  {
    icon: '🧠',
    name: 'PromptLab',
    desc: 'Prompt 工程工作台，支持版本管理、A/B 测试、多模型对比和评估集管理。',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis'],
    stars: '1.1k', lang: '⚛️ TypeScript',
    github: '#', demo: '#',
  },
  {
    icon: '📦',
    name: 'ShipKit',
    desc: 'Next.js SaaS 快速启动模板，内置认证、支付、邮件、多租户、用量统计，30 分钟上线。',
    tech: ['Next.js', 'Prisma', 'Stripe', 'Resend'],
    stars: '876', lang: '▲ Next.js',
    github: '#', demo: '#',
  },
  {
    icon: '🌐',
    name: 'EdgeFlow',
    desc: '基于 Cloudflare Workers 的 API 网关，支持速率限制、缓存策略和 A/B 路由。',
    tech: ['TypeScript', 'Cloudflare', 'Hono'],
    stars: '654', lang: '⚡ TypeScript',
    github: '#', demo: '#',
  },
  {
    icon: '🎮',
    name: 'PixelBoard',
    desc: '实时协作像素画布，支持 1000+ 人同时编辑，基于 CRDT 实现无冲突协同。',
    tech: ['React', 'WebSocket', 'CRDT', 'Canvas'],
    stars: '512', lang: '⚛️ React',
    github: '#', demo: '#',
  },
  {
    icon: '📊',
    name: 'LogPulse',
    desc: '轻量级日志分析平台，10 行配置接入，实时解析结构化日志，自动告警。',
    tech: ['Go', 'ClickHouse', 'Vue 3'],
    stars: '438', lang: '🐹 Go',
    github: '#', demo: '#',
  },
];

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

let currentPage = 'home';
let activeTag = 'all';

function showPage(name, extra) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${name}`);
  if (!target) return;
  target.classList.add('active');
  target.scrollTop = 0;
  window.scrollTo(0, 0);
  currentPage = name;

  // Nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Run page-specific init
  if (name === 'home') initHome();
  if (name === 'blog') initBlog();
  if (name === 'article') initArticle(extra);
  if (name === 'portfolio') initPortfolio();
  if (name === 'about') initAbout();

  // Trigger reveals
  setTimeout(triggerReveal, 50);
}

// ─────────────────────────────────────────────
// INIT FUNCTIONS
// ─────────────────────────────────────────────

function initHome() {
  // Typed effect on hero name
  typeText('heroName', ['Creative Dev', 'Full-Stack Engineer', 'OSS Builder', 'Problem Solver'], 100);

  // Render latest 3 posts
  const grid = document.getElementById('homePostsGrid');
  grid.innerHTML = POSTS.slice(0, 3).map(renderPostCard).join('');

  // Render skills
  const sg = document.getElementById('skillsGrid');
  sg.innerHTML = SKILLS.map(s => `
    <div class="skill-tag">
      <span class="skill-dot" style="background:${s.color};box-shadow:0 0 6px ${s.color}"></span>
      ${s.icon} ${s.name}
    </div>
  `).join('');
}

function initBlog() {
  activeTag = 'all';

  // Build tag list
  const tags = ['all', ...new Set(POSTS.map(p => p.tag))];
  const tf = document.getElementById('tagFilter');
  tf.innerHTML = tags.map(t => `
    <div class="skill-tag" style="cursor:pointer;${t===activeTag ? 'border-color:var(--border-glow);color:var(--neon-cyan);background:rgba(0,245,255,0.06)' : ''}"
         onclick="filterTag('${t}')">
      ${t === 'all' ? '🌐 全部' : t}
    </div>
  `).join('');

  renderBlogPosts();
}

function filterTag(tag) {
  activeTag = tag;
  // Update tag styles
  document.querySelectorAll('#tagFilter .skill-tag').forEach((el, i) => {
    const tags = ['all', ...new Set(POSTS.map(p => p.tag))];
    const isActive = tags[i] === tag;
    el.style.borderColor = isActive ? 'var(--border-glow)' : '';
    el.style.color = isActive ? 'var(--neon-cyan)' : '';
    el.style.background = isActive ? 'rgba(0,245,255,0.06)' : '';
  });
  renderBlogPosts();
}

function renderBlogPosts() {
  const posts = activeTag === 'all' ? POSTS : POSTS.filter(p => p.tag === activeTag);
  const grid = document.getElementById('blogPostsGrid');
  grid.innerHTML = posts.map(renderPostCard).join('');
}

function renderPostCard(post) {
  return `
    <div class="card post-card reveal" onclick="showPage('article', ${post.id})">
      <div class="post-card-cover">
        <div class="post-card-cover-inner ${post.cover}">${post.emoji}</div>
      </div>
      <div class="post-meta">
        <span class="post-tag ${post.tagClass}">${post.tag}</span>
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

function initArticle(postId) {
  const post = POSTS.find(p => p.id === postId);
  if (!post) { showPage('blog'); return; }

  const container = document.getElementById('articleContainer');
  container.innerHTML = `
    <button class="article-back" onclick="showPage('blog')">← 返回文章列表</button>
    <article>
      <header class="article-header">
        <div class="article-meta-top">
          <span class="post-tag ${post.tagClass}">${post.tag}</span>
          <span class="post-date" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted)">${post.date}</span>
        </div>
        <h1 class="article-title">${post.title}</h1>
        <p class="article-subtitle">${post.excerpt}</p>
        <div class="article-meta-bottom">
          <div class="meta-author">
            <div class="author-avatar">CD</div>
            <div class="author-name">Creative Dev</div>
          </div>
          <span class="meta-sep">·</span>
          <span class="meta-info">⏱ ${post.readTime} read</span>
          <span class="meta-sep">·</span>
          <span class="meta-info">👁 ${Math.floor(Math.random()*3000+500)} views</span>
        </div>
      </header>
      <div class="article-body">${post.content}</div>

      <!-- Related posts -->
      <div style="margin-top:60px;padding-top:40px;border-top:1px solid var(--border-dim)">
        <div class="section-label" style="margin-bottom:20px">MORE POSTS</div>
        <div class="posts-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
          ${POSTS.filter(p=>p.id!==postId).slice(0,2).map(renderPostCard).join('')}
        </div>
      </div>
    </article>
  `;
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
  if (sg) {
    sg.innerHTML = SKILLS.map(s => `
      <div class="skill-tag">
        <span class="skill-dot" style="background:${s.color};box-shadow:0 0 6px ${s.color}"></span>
        ${s.icon} ${s.name}
      </div>
    `).join('');
  }
}

// ─────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────

// Typed text effect
const typedStates = {};
function typeText(id, words, speed = 80) {
  const el = document.getElementById(id);
  if (!el) return;

  let wi = 0, ci = 0, deleting = false;
  if (typedStates[id]) clearInterval(typedStates[id]);

  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
    } else {
      ci++;
    }

    // Add cursor
    el.innerHTML = word.slice(0, ci) + '<span class="typed-cursor"></span>';

    if (!deleting && ci === word.length) {
      setTimeout(() => { deleting = true; }, 1800);
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
  }

  typedStates[id] = setInterval(tick, deleting ? speed / 2 : speed);
}

// Scroll reveal
function triggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
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

// Smooth navbar hide on scroll
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const nb = document.getElementById('navbar');
  if (y > lastY && y > 100) {
    nb.style.transform = 'translateY(-100%)';
  } else {
    nb.style.transform = '';
  }
  lastY = y;
}, { passive: true });

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
});
