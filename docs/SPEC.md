# AI Marketing Executor — Launch Marketing for Builders

## 概述
技术创始人的营销执行器。不给建议，直接生成可复制使用的营销内容。

## 核心功能
1. **产品分析**：输入产品描述/链接，AI 分析核心卖点
2. **内容生成**：生成多平台营销内容
   - Twitter/X 帖子（5+ 条，不同角度）
   - LinkedIn 帖子（专业版）
   - Reddit 帖子模板（含最佳 subreddit 推荐）
   - Product Hunt 文案（tagline + description）
   - Email outreach 模板（3 种角度）
   - 冷启动策略 checklist
3. **一键复制**：每段内容都有复制按钮
4. **多语言支持**：生成英文/中文内容

## 技术方案
- 前端：React + Vite (TypeScript)
- 后端：Python FastAPI
- AI：通过 llm-proxy.densematrix.ai
- 部署：Docker → langsheng

## 端口分配
- Frontend: 30192
- Backend: 30193

## 目标用户
技术创始人、独立开发者、产品经理

## 差异化
- 不是"教你如何营销"，而是"直接给你可用的内容"
- 针对技术人群优化，理解技术产品的表达方式
- 一站式生成所有平台内容
