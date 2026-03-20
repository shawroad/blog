# CYBER·BLOG

一个科技感暗黑风格的个人博客，纯静态实现，无需构建工具。

## ✨ 功能特性

- 🌑 科技感暗黑主题（霓虹光效 + 赛博朋克配色）
- 📝 首页 + 文章列表 + 文章详情（动态加载 Markdown）
- 🚀 项目展示 Portfolio
- 👤 个人简介 About
- 📬 联系页面 Contact
- 📱 全响应式，移动端友好
- ⚡ 纯 HTML/CSS/JS，零依赖，零构建

## ✍️ 如何发布新文章

**只需两步，无需改代码：**

### 第一步：在 `posts/` 目录新建 Markdown 文件

文件命名规范：`YYYY-MM-DD-文章标题.md`，例如：

```
posts/2026-04-01-my-new-post.md
```

**文件内容格式（必须包含 Front Matter）：**

```markdown
---
title: 文章标题
date: 2026-04-01
tag: React
emoji: ⚛️
cover: cover-1
excerpt: 这里写文章摘要，显示在卡片上（1-2句话）。
---

## 正文从这里开始

支持标准 Markdown 语法：**加粗**、`代码`、代码块、列表、引用等。
```

**封面参数说明：**
- `cover`：`cover-1` ～ `cover-6`（6种渐变配色）
- `tag`：文章标签（用于筛选），自由填写
- `emoji`：显示在封面上的 emoji

### 第二步：推送到 GitHub

```bash
git add posts/
git commit -m "📝 新文章：文章标题"
git push
```

GitHub Actions 会自动：
1. 扫描 `posts/` 目录，重新生成 `posts/index.json`
2. 将最新版本部署到 GitHub Pages

**等待约 1-2 分钟，文章即可在网站上看到。**
