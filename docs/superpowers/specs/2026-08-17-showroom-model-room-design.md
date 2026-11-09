# 设计参考系统：样板房（Showroom）设计文档

## 背景与目标

为 设计参考系统新增“样板房”页面，集中展示常见且难描述的复杂页面布局场景。目标是为 Agent 编码提供可直接参考、复制的高质量布局样例，提前解决组件不居中、布局乱飘、响应式失控、交互不流畅等常见问题。

核心要求：
- 严格保持现有 设计系统 几何构成 + 工业仪表风视觉风格。
- 布局本身必须精致、正确、无低级错误，避免“AI 量产感”。
- 不展示源码，视觉即文档；源码按清晰文件结构组织，便于 Agent 查找。

## 范围

新增独立页面 `/showroom`，并在首页 `DesignRefHome` 增加入口。

第一期覆盖约 25–30 个场景，分为：

### 导航与结构
1. 可收起侧边栏 + 宽屏主内容区
2. 分屏可拖拽分隔布局（左右 / 上下）
3. 粘性页头 + 可滚动内容区
4. 粘性页脚 / 始终底部页脚
5. 全高布局（header + main + footer 占满视口）

### 滚动与视差
6. 鼠标驱动横向/纵向滚动
7. 滚动触发动画 / 视差章节页
8. 长内容页 + 右侧悬浮目录锚点导航
9. 水平滚动容器（卡片/图片廊）
10. Scroll-snap 吸附滚动页

### 表单与流程
11. 多步骤表单 + 粘性步骤条
12. 复杂表单分组布局（标签对齐、错误提示）
13. 向导式 / Onboarding 流程页

### 数据与仪表
14. 数据仪表板（KPI 卡片区 + 图表区 + 侧边栏）
15. 响应式表格 + 横向滚动处理
16. 卡片网格（不等高 / Masonry 瀑布流）
17. Kanban 看板布局

### 内容展示
18. 详情页 + 悬浮操作按钮（FAB）
19. 文章/文档页 + 面包屑 + 页眉行动区
20. Hero 大图/视频首屏 + 内容区
21. 图文混排 / 杂志式排版

### 状态与浮层
22. 空状态 / 错误状态 / 404 页
23. 加载骨架屏布局
24. Modal / Drawer / Toast 层级与定位
25. 命令面板 / 搜索浮层覆盖布局

### 交互密集型
26. 标签页 + 状态保持布局
27. 通知/消息/动态流布局
28. 聊天/私信对话布局
29. 日历/时间轴布局

## 架构

### 路由
- `/showroom` → `Showroom.tsx` 主容器。
- 不使用 `/showroom/:scene` 嵌套路由，保持单页滚动浏览。
- 首页 `DesignRefHome` 新增“样板房”入口卡片，链接到 `/showroom`。

### 文件结构
```
src/
├── App.tsx                     # 新增 /showroom 路由
├── DesignRefHome.tsx           # 首页新增入口
└── showroom/
    ├── Showroom.tsx            # 页面外壳：目录 + 滚动容器
    ├── ShowroomNav.tsx         # 左侧固定分类目录
    ├── ShowroomSection.tsx     # 分类区块包装器
    ├── DemoFrame.tsx           # 统一演示容器
    ├── DemoLabel.tsx           # 统一场景标签
    └── scenes/
        ├── SceneSidebar.tsx
        ├── SceneMouseScroll.tsx
        ├── SceneSplitPane.tsx
        ├── SceneStepForm.tsx
        ├── SceneDashboard.tsx
        ├── SceneDetailToc.tsx
        └── ...（其余场景）
```

### 技术栈
- 继续使用 Chakra UI v2 + Framer Motion。
- 不引入新依赖；拖拽、可收起侧边栏等用原生事件 + Chakra 状态实现。
- 目录高亮使用 Intersection Observer。

## 组件设计

### Showroom.tsx
- `100vh` Flex 布局：左侧固定宽目录 + 右侧可滚动内容区。
- 内容区 `overflowY="auto"`，目录 `position="sticky"`。
- 右侧顶部放置页面标题和返回索引链接，风格与 `设计系统NavBar` 一致但不重复渲染全局导航。

### ShowroomNav.tsx
- 固定宽度 `240px`，移动端变为 Drawer。
- 分类标题 + 场景链接列表，当前项用红色竖条高亮。
- 点击锚点平滑滚动到对应分类。

### ShowroomSection.tsx
- 统一处理分类标题、编号、描述。
- 每个分类内部用 Grid/Flex 陈列 2–4 个场景演示区。
- 统一边框、阴影、背景色，减少样板组件重复 CSS。

### DemoFrame / DemoLabel
- `DemoFrame`: 带标题、编号、边框的演示容器，统一尺寸和装饰。
- `DemoLabel`: 场景标题小标签，统一字体与颜色。

### 场景组件约定
- 自包含：state、ref、事件处理都在组件内部。
- 使用 `Theme.tsx` 的 `COLORS / FONT / WEIGHT / BORDER / SHADOW`。
- 默认导出，命名 `SceneXxx`。
- 演示容器通常 `h="360px"` 或 `h="480px"`，避免影响整页滚动。
- 组件顶部写 2–3 行注释说明用途与关键点。

## 数据流与状态管理

- 无全局状态，各场景使用 `useState / useRef / useEffect`。
- 目录高亮通过 `IntersectionObserver` 监听分类 `id`。
- 锚点滚动使用原生 `scrollIntoView({ behavior: "smooth" })`。
- 复杂动效通过 `prefers-reduced-motion` 降级。

## 错误处理与边界情况

- 每个演示容器明确设置 `overflow` 策略，防止内容撑破。
- 响应式至少覆盖 `base / md / lg`。
- 移动端侧边栏自动折叠为 Drawer。
- 分屏拖拽限制在 `20%–80%` 之间。
- 空状态 / 错误状态作为独立样板展示。

## 测试与验收

- 每个场景组件写完后在 `npm run dev` 中目视检查。
- `npm run types:check` 无 TypeScript 错误。
- `npm run build` 生产构建通过。
- 重点检查项：
  - 组件是否真正居中，无意外偏移。
  - 是否出现意外滚动条。
  - Sticky 元素是否被父级 `overflow` 截断。
  - 拖拽、鼠标滚动是否流畅。
  - 移动端是否可用、不崩布局。

## 实现优先级

1. 搭建 `Showroom.tsx / ShowroomNav.tsx / ShowroomSection.tsx / DemoFrame.tsx` 骨架。
2. 在 `App.tsx` 增加 `/showroom` 路由，在 `DesignRefHome` 增加入口。
3. 先实现 5 个核心场景：可收起侧边栏、鼠标驱动滚动、分屏拖拽、多步骤表单、数据仪表板。
4. 按类别分批补齐剩余场景。
5. 全场景联调、类型检查、生产构建验证。
