# Agent 指令集

![App Preview](https://imgix.cosmicjs.com/c3e3e080-83d5-11f1-beb0-eff42c6d3940-autopilot-photo-1526304640581-d334cdbbf45e-1784508956282.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A beautiful, dark-themed API portal for an OpenAI-compatible reverse-proxy API. **Agent 指令集** presents your available AI models, API endpoints, authentication instructions, and step-by-step CherryStudio setup guides — all powered by content managed in [Cosmic](https://www.cosmicjs.com).

## Features

- 🌑 **Dark, modern theme** — background `hsl(222, 47%, 11%)` matching the API portal design
- 🤖 **AI Models catalog** — OpenAI (blue) and Anthropic (orange) provider tags
- 🔌 **API endpoint reference** — Base URL, `/v1/models`, `/v1/chat/completions` with copy buttons
- 🟢 **Live health status indicator** — polls the health check path and shows a green/red dot
- 📘 **CherryStudio setup guides** — step-by-step visual instructions from your CMS
- 📋 **One-click copy** — copy Base URL, endpoints, and API key info to clipboard
- 📱 **Fully responsive** — looks great on desktop, tablet, and mobile

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6a5d71c30374bd1636f00661&clone_repository=6a5d72ce0374bd1636f006ba)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for: AI Agent 指令集
> 目标：在 Cosmic 中建立 OpenAI 兼容反代 API 并发布。
> 【环境准备】
> 在 Cosmic Integrations 中添加 OpenAI 和 Anthropic AI 集成,
> 设置 Secret：PROXY_API_KEY（任意字符串，作为 Bearer Token）、SESSION_SECRET,
> 【API Server 修改】
> 文件：artifacts/api-server/src/routes/proxy.ts
> 创建 GET /v1/models，返回模型列表（gpt-5.2, gpt-5-mini, gpt-5-nano, o4-mini, o3, claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5）,
> 创建 POST /v1/chat/completions：
> 验证 Authorization: Bearer ${PROXY_API_KEY}，失败返回 401,
> 按 model 前缀分发：gpt/o 开头→OpenAI client，claude 开头→Anthropic client,
> Anthropic 需转换格式：提取 system 消息，messages 只保留 user/assistant,
> 支持 stream=true：设置 Content-Type: text/event-stream，X-Accel-Buffering: no，res.flushHeaders(),
> OpenAI 流：直接透传 chunk，每块 res.flush(),
> Anthropic 流：将 content_block_delta 转为 OpenAI chunk 格式，每块 res.flush(),
> 每 5 秒发送 keepalive (": keepalive\n\n")，req.on("close") 时 clearInterval，用 try/finally 防 500,
> 非流：等待完整响应后返回 OpenAI 格式 JSON,
> Express body limit 设为 50mb,
> 文件：artifacts/api-server/src/app.ts
> app.use("/v1", proxyRouter)  // 挂载到根路径 /v1,
> 文件：artifacts/api-server/.replit-artifact/artifact.toml
> paths 数组加入 "/v1",
> 【前端门户】用 createArtifact({ artifactType: "react-vite", slug: "api-portal", previewPath: "/", title: "API Portal" }) 创建 artifact,
> App.tsx 功能：fetch 检测在线状态，展示 Base URL、/v1/models、/v1/chat/completions、API Key 说明，复制按钮，CherryStudio 4 步设置指引，模型列表（OpenAI 蓝色标签 / Anthropic 橙色标签），深色主题（background: hsl(222,47%,11%)）,
> 【发布】启动两个 workflow：api-server 和 api-portal，presentArtifact，suggestDeploy，发布后域名即为 CherryStudio 的 Base URL"

### Code Generation Prompt

> Build a Next.js application for a website called "Agent 指令集". The content is managed in Cosmic CMS with the following object types: ai-models, portal-settings, setup-guides. Create a beautiful, modern, responsive design with a homepage and pages for each content type.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cosmic SDK](https://www.cosmicjs.com/docs)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- A [Cosmic](https://www.cosmicjs.com) account with the `ai-models`, `portal-settings`, and `setup-guides` object types

### Installation

```bash
bun install
bun run dev
```

Set environment variables (see `.env.example`):

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

## Cosmic SDK Examples

```typescript
import { cosmic } from '@/lib/cosmic'

// Fetch all active AI models
const { objects: models } = await cosmic.objects
  .find({ type: 'ai-models' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Fetch portal settings
const { object: settings } = await cosmic.objects
  .findOne({ type: 'portal-settings' })
  .depth(1)

// Fetch setup guides
const { objects: guides } = await cosmic.objects
  .find({ type: 'setup-guides' })
  .depth(1)
```

## Cosmic CMS Integration

This application reads three object types from your Cosmic bucket:

- **ai-models** — Model ID, display name, provider (OpenAI/Anthropic), description, context window, active flag
- **portal-settings** — Portal title, tagline, base URL note, API key instructions, theme, health check path, endpoints
- **setup-guides** — CherryStudio step-by-step guides with step number, title, content, and icon

Learn more in the [Cosmic docs](https://www.cosmicjs.com/docs).

## Deployment Options

Deploy easily to:

1. **Vercel** — Import the repo, add environment variables, deploy
2. **Netlify** — Connect the repo, set env vars, deploy

Set `COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, and `COSMIC_WRITE_KEY` in your hosting platform's dashboard.
<!-- README_END -->