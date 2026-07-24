# UFS Console

[![CI](https://github.com/yesingle10/ufs-console/actions/workflows/ci.yml/badge.svg)](https://github.com/yesingle10/ufs-console/actions/workflows/ci.yml)
[![CodeQL](https://github.com/yesingle10/ufs-console/actions/workflows/codeql.yml/badge.svg)](https://github.com/yesingle10/ufs-console/actions/workflows/codeql.yml)
[![Release](https://img.shields.io/github/v/release/yesingle10/ufs-console?color=blue)](https://github.com/yesingle10/ufs-console/releases)

UFS 统一文件服务管理控制台 — Vue 3 + Vite + Tailwind CSS + Chart.js

## 技术栈

- **Vue 3** Composition API (`<script setup>`)
- **Vue Router 4** hash 路由
- **Tailwind CSS 3** 暗色主题
- **Chart.js 4** 监控图表

## 项目结构

```
src/
├── main.js              # 入口
├── App.vue              # 根组件（登录/主布局切换）
├── style.css            # Tailwind + 过渡动画
├── api/                 # API 封装层
│   ├── index.js         #   请求客户端
│   ├── auth.js          #   登录鉴权
│   ├── buckets.js       #   存储桶
│   ├── objects.js       #   对象上传
│   ├── policies.js      #   存储策略
│   └── monitor.js       #   监控 + 审计
├── router/
│   └── index.js         # 路由配置
├── composables/
│   ├── useAuth.js       # 鉴权状态（token / localStorage）
│   └── useToast.js      # 消息提示
├── components/
│   ├── AppSidebar.vue   # 侧边导航
│   ├── AppToast.vue     # Toast 通知
│   ├── StatCards.vue    # 统计卡片
│   ├── MonitorCharts.vue# 监控图表
│   ├── BucketModal.vue  # 创建存储桶弹窗
│   └── PolicyModal.vue  # 创建策略弹窗
├── views/
│   ├── LoginView.vue    # 登录页
│   ├── MainLayout.vue   # 主布局（侧边栏 + 路由出口）
│   ├── DashboardView.vue# 监控大盘
│   ├── BucketsView.vue  # 存储桶列表
│   ├── ObjectsView.vue  # 对象预签名上传
│   ├── PoliciesView.vue # 存储策略
│   └── AuditView.vue    # 审计日志
└── utils/
    └── format.js        # 格式化工具（字节/时间/徽章样式）
```

## 启动

```bash
npm install
npm run dev      # http://localhost:5173
```

开发服务器自动代理 `/v1/*` 到 `http://localhost:8080`（ufs-core）

## 构建

```bash
npm run build    # 输出到 dist/
```
