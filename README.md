# 微光集 · Light Notes

个人博客，Astro 静态站点。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321/myweb/
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建结果
```

## 写一篇新文章

在 `src/content/posts/` 下新建 `xxx.md`，文件名即 URL：`/posts/xxx/`。

```markdown
---
title: "文章标题"
excerpt: "列表页摘要"
pubDate: 2026-11-01
tag: 随笔
minutes: 5
layout: normal      # normal | featured(占两列) | wide(整行)
badge: Featured     # 可选，封面左上角徽标
image: "/covers/foo.jpg"  # 可选，用真实图片当封面（放 public/covers/ 下）；写了就忽略下面的渐变
cover:
  c1: "#f8d5bd"
  c2: "#e8a882"
  c3: "#f3e3d4"
---

正文从这里开始，支持标准 Markdown。
```

不写 `image` 时，封面是 `cover.c1~c3` 三个颜色生成的几何渐变；写了 `image` 就用图片，首页卡片和文章页顶部都会显示。

保存后首页卡片、筛选标签、统计数字、RSS 全部自动更新，不需要改任何 HTML。

## 目录结构

```
src/
├─ content/posts/     文章 Markdown
├─ content.config.ts  文章字段定义（frontmatter 校验）
├─ layouts/           基础布局
├─ components/        文章卡片
├─ pages/             首页、文章页、RSS
├─ scripts/           交互脚本（main.js 公共 / home.js 首页）
└─ styles/            global.css（设计系统）/ post.css（正文排版）
```

## 部署

推送到 `main` 后 GitHub Actions 自动构建并发布到 GitHub Pages
（仓库 Settings → Pages → Source 需选择 **GitHub Actions**）。

站点地址：https://usersky2024.github.io/myweb/
