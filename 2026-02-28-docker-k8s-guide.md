---
title: Docker + K8s 从零到生产环境：一篇过于详细的指南
date: 2026-02-28
tag: DevOps
emoji: 🐳
cover: cover-3
excerpt: 手把手搭建容器化部署流水线，包括 Dockerfile 优化、K8s 资源配置、滚动更新和健康检查。
---

## 为什么要容器化

「在我电脑上是好的」这句话，是程序员圈子里一个令人心酸的梗。容器化的核心价值就是消灭这种环境差异，让应用的运行环境成为可版本化、可复制的代码。

## 写一个生产级别的 Dockerfile

```dockerfile
# 多阶段构建：构建产物和运行环境分离

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

USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
```

这个多阶段构建把最终镜像体积从 **1.2GB** 压缩到了 **180MB**。

## K8s Deployment 配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
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
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 关键配置解读

- **resources.requests/limits**：不设置资源限制，一个失控的 Pod 会把整个节点打死
- **livenessProbe**：检测应用是否需要重启（死锁、内存泄漏等）
- **readinessProbe**：检测应用是否准备好接流量，新 Pod 没 ready 之前不会被加进 Service
- **maxUnavailable: 0**：零停机发布的关键配置
