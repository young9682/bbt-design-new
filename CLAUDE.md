# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器 → http://localhost:5174（端口固定 5174）
npm run types:check  # tsc --noEmit，唯一的质量门禁（无 lint、无测试框架）
npm run build        # tsc -b && vite build → dist/
npm run preview      # 本地预览生产构建
```

修改任何 `.tsx` 后必须跑 `npm run types:check` 确认通过。

## 架构

静态 SPA（设计参考系统 + 布局样板房），无后端、无状态管理、无测试。两类页面共享 `src/Theme.tsx` 中的设计令牌。

### 设计令牌（单一事实来源）

`src/Theme.tsx` 导出 `COLORS / FONT / WEIGHT / BORDER / SHADOW / SPACE / DURATION / EASING / Z_INDEX / TOKENS`。**所有样式必须引用这些令牌**，禁止裸写颜色/边框/阴影值。核心规则：

- 零圆角（除装饰性圆/椭圆外不使用 borderRadius）
- 硬阴影（固定偏移、无模糊，如 `4px 4px 0px rgba(0,0,0,0.2)`）
- 间距为 4px 倍数
- 不对称构图，避免等权重均分布局
- 中文界面文案；标识符、注释可中可英

### 路由

`src/App.tsx` 使用 **HashRouter**（静态托管需要，勿改成 BrowserRouter）。路由全部平铺在根级：`/colors`、`/typography`、…、`/showroom`。

### 两类页面

1. **规范参考页** `src/*Ref.tsx`（10 个）：色彩/文字/按钮/卡片/输入/动效/状态/布局/错误/诊断。每页顶部嵌入 `RefNavBar`（翻页时钟风格导航，接收 `title` 与 `pageIndex`）。
2. **布局样板房** `src/showroom/`：52 个布局样板（多数可交互），为 Agent 编码提供复制即用的布局样板。
   - `Showroom.tsx` — 页面外壳：左侧 `ShowroomNav`（IntersectionObserver 滚动高亮 + 移动端 Drawer）+ 右侧滚动容器
   - `ShowroomSection.tsx` — 分类区块（01-07 七大分类，Grid 内 1-2 列卡片）
   - `DemoFrame.tsx` — 演示容器，props：`number/title/height/wide/note`；`wide` 场景横跨两列（画廊/大屏类用）
   - `scenes/Scene*.tsx` — 每个场景一个文件，自包含（state/ref/事件全在内部），默认导出

### 场景组件约定

- 场景渲染在 `DemoFrame h="400px"` 内，多数场景以该约束宽度做响应式（Chakra `base/md/lg` props）；纯静态样板场景不强求
- 复杂交互（拖拽分隔条、虚拟滚动、右键菜单等）用原生事件手写实现，**不引入新依赖**
- 动效用 framer-motion，缓动引用 `EASING` 令牌
- 新场景三步走：在 `scenes/` 建组件 → `Showroom.tsx` 加 import 与 `<DemoFrame>` → `ShowroomNav` 的 CATEGORIES 如需新分类同步更新

## 已知坑

- Chakra `Text` 不直接接受 `fontVariantNumeric`，需写成 `sx={{ fontVariantNumeric: "tabular-nums" }}`
- framer-motion 与 Chakra 的 `transition` prop 冲突：动效组件用 motion 的 `transition`，CSS 过渡写进 `sx`
- tsconfig 关闭了 `noUnusedLocals`，未使用的 import 不会报错，但提交前应清理
- 构建产物 >500KB 的 chunk 警告是已知的，无需处理
