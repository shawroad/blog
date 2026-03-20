# CYBER·BLOG

一个科技感暗黑风格的个人博客，纯静态实现，无需构建工具。

## ✨ 功能特性

- 🌑 科技感暗黑主题（霓虹光效 + 赛博朋克配色）
- 📝 首页 + 文章列表 + 文章详情
- 🚀 项目展示 Portfolio
- 👤 个人简介 About
- 📬 联系页面 Contact
- 📱 全响应式，移动端友好
- ⚡ 纯 HTML/CSS/JS，零依赖，零构建

## 🚀 快速开始

直接在浏览器中打开 `index.html` 即可预览。

## 🌐 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. 在 GitHub 创建仓库（例如 `username.github.io` 或任意名称）

2. 将代码推送到 main 分支：
   ```bash
   git init
   git add .
   git commit -m "🚀 Initial commit: CYBER BLOG"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. 在 GitHub 仓库设置中开启 Pages：
   - 进入 `Settings` → `Pages`
   - `Source` 选择 `GitHub Actions`
   - 保存后等待 1-2 分钟

4. 访问 `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 方法二：手动部署

在 GitHub 仓库 `Settings` → `Pages` → `Source` 选择 `Deploy from a branch`，选择 `main` 分支 + `/ (root)` 目录。

## 🎨 自定义

### 修改个人信息

编辑 `app.js`：

- **技术栈**：修改 `SKILLS` 数组
- **文章内容**：修改 `POSTS` 数组（支持 HTML 富文本）
- **项目展示**：修改 `PROJECTS` 数组
- **打字效果文字**：在 `initHome()` 中修改 `typeText` 的第二个参数

### 修改个人简介

编辑 `index.html` 中 `page-about` 部分的文字内容。

### 修改主题色

编辑 `style.css` 顶部的 CSS 变量：

```css
:root {
  --neon-cyan:   #00f5ff;  /* 主色调 */
  --neon-purple: #bf00ff;  /* 副色调 */
  --neon-pink:   #ff006e;  /* 强调色 */
  --neon-green:  #00ff88;  /* 成功/在线状态 */
}
```

## 📁 文件结构

```
/
├── index.html           # 主页面（包含所有页面的 HTML 结构）
├── style.css            # 全局样式（暗黑科技风主题）
├── app.js               # 应用逻辑（数据、路由、渲染）
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions 自动部署
└── README.md
```

## 📄 License

MIT — 随意使用，改了记得留个 Star ⭐
