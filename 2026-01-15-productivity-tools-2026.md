---
title: 我的效率工具箱 2026：那些真正改变工作方式的工具
date: 2026-01-15
tag: 效率
emoji: 🛠️
cover: cover-6
excerpt: 终端、编辑器、笔记、自动化……精选 20 个让我每天少浪费 1 小时的工具，附配置。
---

## 原则：工具服务于流程，而不是相反

我每年都会系统性地审视一遍自己的工具链：哪些工具在真正节省时间？哪些只是「看起来很强大」但从来不用？这篇文章是 2026 年版本的整理结果。

## 终端：oh-my-zsh + 精选插件

```bash
plugins=(
  git                   # git 别名（gst, gaa, gcmsg...）
  zsh-autosuggestions   # 灰色自动补全，神器
  zsh-syntax-highlighting # 实时高亮，命令拼错立刻发现
  fzf                   # 模糊搜索历史、文件、进程
  z                     # 智能跳转目录（比 cd 好用 10 倍）
)
```

## 编辑器：VS Code 最重要的插件

- **GitHub Copilot** — AI 补全，接受率 40%+
- **GitLens** — 每行代码的 git blame，代码考古神器
- **Error Lens** — 错误显示在行尾，不用把鼠标移过去
- **Pretty TypeScript Errors** — 把 TS 错误翻译成人话
- **REST Client** — .http 文件直接发请求，不用 Postman

## 笔记：Obsidian 双链笔记系统

从 Notion 迁移到 Obsidian 之后，我的笔记第一次开始「生长」——双向链接让不同主题的笔记自然产生关联，形成知识网络而不是孤立文档。

我的 Vault 结构：`00-收件箱` → `10-项目` → `20-领域知识` → `30-资源` → `40-归档`，每周做一次周回顾，把收件箱清空。

## 自动化：一次配置，永久省时

- `Raycast`：macOS 效率启动器，替代 Spotlight
- `Hammerspoon`：用 Lua 脚本驱动 macOS 自动化
- `GitHub Actions`：自动化一切可以自动化的 CI/CD 流程
