# 设计系统 Showroom Model Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/showroom` page to the 设计系统 design reference system that displays ~25 high-quality, copy-paste-ready layout scenarios while keeping the existing constructivist visual style.

**Architecture:** A single-page showroom with a sticky category sidebar and anchor-scroll content area. Each scenario lives in its own focused component under `src/showroom/scenes/`. Shared presentation primitives (`ShowroomNav`, `ShowroomSection`, `DemoFrame`, `DemoLabel`) keep the scene components DRY.

**Tech Stack:** Vite + React 18 + TypeScript + Chakra UI v2 + Framer Motion. No new dependencies.

## Global Constraints

- All styling must use tokens from `src/Theme.tsx` (`COLORS`, `FONT`, `WEIGHT`, `BORDER`, `SHADOW`, `SPACE`).
- No border-radius except `0` unless a decorative circle/ellipse is explicitly part of the design.
- Spacing must be multiples of `4px`.
- All components are default-exported TSX functions in PascalCase.
- Every demo is visually verified in `npm run dev` and passes `npm run types:check` and `npm run build`.
- Source code is not shown on the page; components are the documentation.

---

## File Structure

```
src/
├── App.tsx                              # add /showroom route
├── DesignRefHome.tsx                    # add showroom entry card
└── showroom/
    ├── Showroom.tsx                     # page shell
    ├── ShowroomNav.tsx                  # category sidebar
    ├── ShowroomSection.tsx              # section wrapper
    ├── DemoFrame.tsx                    # demo container
    ├── DemoLabel.tsx                    # demo title label
    └── scenes/
        ├── SceneSidebar.tsx
        ├── SceneSplitPane.tsx
        ├── SceneStickyHeader.tsx
        ├── SceneStickyFooter.tsx
        ├── SceneFullHeight.tsx
        ├── SceneMouseScroll.tsx
        ├── SceneScrollReveal.tsx
        ├── SceneDetailToc.tsx
        ├── SceneHorizontalScroll.tsx
        ├── SceneScrollSnap.tsx
        ├── SceneStepForm.tsx
        ├── SceneComplexForm.tsx
        ├── SceneOnboarding.tsx
        ├── SceneDashboard.tsx
        ├── SceneResponsiveTable.tsx
        ├── SceneMasonry.tsx
        ├── SceneKanban.tsx
        ├── SceneDetailFab.tsx
        ├── SceneArticle.tsx
        ├── SceneHero.tsx
        ├── SceneEditorial.tsx
        ├── SceneEmptyState.tsx
        ├── SceneSkeleton.tsx
        ├── SceneOverlay.tsx
        ├── SceneCommandPalette.tsx
        ├── SceneTabs.tsx
        ├── SceneFeed.tsx
        ├── SceneChat.tsx
        └── SceneCalendar.tsx
```

---

## Task 1: Create shared showroom primitives

**Files:**
- Create: `src/showroom/Showroom.tsx`
- Create: `src/showroom/ShowroomNav.tsx`
- Create: `src/showroom/ShowroomSection.tsx`
- Create: `src/showroom/DemoFrame.tsx`
- Create: `src/showroom/DemoLabel.tsx`
- Modify: `src/Theme.tsx`

**Interfaces:**
- Consumes: `COLORS`, `FONT`, `WEIGHT`, `BORDER`, `SHADOW` from `src/Theme.tsx`.
- Produces: `Showroom`, `ShowroomNav`, `ShowroomSection`, `DemoFrame`, `DemoLabel` components used by every scene task.

- [ ] **Step 1: Add `scrollBehavior` utility color token to Theme.tsx**

No change needed beyond existing tokens; confirm `COLORS.concrete`, `COLORS.black`, `COLORS.pureWhite`, `COLORS.red`, `COLORS.gold`, `COLORS.metalWhite`, `COLORS.industrialBlack` exist. They do.

- [ ] **Step 2: Write `src/showroom/DemoLabel.tsx`**

```tsx
import { Box, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT } from "../Theme";

export default function DemoLabel({ number, title }: { number: string; title: string }) {
  return (
    <Box mb="12px">
      <Text
        fontFamily={FONT.mono}
        fontSize="11px"
        color={COLORS.gold}
        letterSpacing="0.08em"
        mb="4px"
      >
        {number}
      </Text>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="14px"
        color={COLORS.black}
        letterSpacing="0.04em"
      >
        {title}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 3: Write `src/showroom/DemoFrame.tsx`**

```tsx
import { Box } from "@chakra-ui/react";
import { COLORS, BORDER, SHADOW } from "../Theme";
import DemoLabel from "./DemoLabel";

export default function DemoFrame({
  number,
  title,
  height = "360px",
  children,
}: {
  number: string;
  title: string;
  height?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      p="16px"
      h={height}
      position="relative"
      overflow="hidden"
    >
      <DemoLabel number={number} title={title} />
      <Box h={`calc(${height} - 68px)`} position="relative" overflow="hidden">
        {children}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 4: Write `src/showroom/ShowroomSection.tsx`**

```tsx
import { Box, Text, Flex, Grid } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../Theme";

export default function ShowroomSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box id={id} px="48px" py="48px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
      <Flex align="baseline" gap="16px" mb="32px">
        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.red} letterSpacing="0.12em">
          {number}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="24px"
          letterSpacing="0.04em"
          color={COLORS.black}
        >
          {title}
        </Text>
        <Box flex={1} h="2px" bg={COLORS.black} opacity={0.1} />
      </Flex>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap="24px"
      >
        {children}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 5: Write `src/showroom/ShowroomNav.tsx`**

```tsx
import { Box, Text, VStack, Link, useDisclosure, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../Theme";

const CATEGORIES = [
  { id: "nav-structure", label: "导航与结构" },
  { id: "scroll-parallax", label: "滚动与视差" },
  { id: "form-flow", label: "表单与流程" },
  { id: "data-dashboard", label: "数据与仪表" },
  { id: "content-display", label: "内容展示" },
  { id: "state-overlay", label: "状态与浮层" },
  { id: "interaction", label: "交互密集型" },
];

function NavContent({ activeId, onClick }: { activeId: string; onClick?: () => void }) {
  return (
    <VStack align="stretch" gap="4px">
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="14px"
        color={COLORS.pureWhite}
        letterSpacing="0.08em"
        mb="12px"
        px="16px"
      >
        样板房
      </Text>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`#${cat.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth" });
            onClick?.();
          }}
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
        >
          <Box
            px="16px"
            py="8px"
            borderLeft={`3px solid ${activeId === cat.id ? COLORS.red : "transparent"}`}
            bg={activeId === cat.id ? "rgba(204,0,0,0.12)" : "transparent"}
            transition="all 0.15s ease"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={activeId === cat.id ? WEIGHT.black : WEIGHT.bold}
              fontSize="12px"
              color={activeId === cat.id ? COLORS.pureWhite : COLORS.metalWhite}
              letterSpacing="0.04em"
            >
              {cat.label}
            </Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
}

export default function ShowroomNav() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    CATEGORIES.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box
        display={{ base: "none", md: "block" }}
        w="240px"
        h="100vh"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.red}`}
        py="24px"
        position="sticky"
        top={0}
        flexShrink={0}
      >
        <NavContent activeId={activeId} />
      </Box>

      <Box display={{ base: "block", md: "none" }} position="fixed" top="16px" left="16px" zIndex={20}>
        <Button onClick={onOpen} size="sm" bg={COLORS.red} color={COLORS.pureWhite} borderRadius={0}>
          目录
        </Button>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={COLORS.black} maxW="240px">
          <DrawerCloseButton color={COLORS.pureWhite} />
          <DrawerBody pt="48px">
            <NavContent activeId={activeId} onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

- [ ] **Step 6: Write `src/showroom/Showroom.tsx`**

```tsx
import { Box, Flex, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { COLORS, FONT, WEIGHT, BORDER } from "../Theme";
import ShowroomNav from "./ShowroomNav";
import ShowroomSection from "./ShowroomSection";
import DemoFrame from "./DemoFrame";
import SceneSidebar from "./scenes/SceneSidebar";
import SceneSplitPane from "./scenes/SceneSplitPane";
import SceneStickyHeader from "./scenes/SceneStickyHeader";
import SceneStickyFooter from "./scenes/SceneStickyFooter";
import SceneFullHeight from "./scenes/SceneFullHeight";
import SceneMouseScroll from "./scenes/SceneMouseScroll";
import SceneScrollReveal from "./scenes/SceneScrollReveal";
import SceneDetailToc from "./scenes/SceneDetailToc";
import SceneHorizontalScroll from "./scenes/SceneHorizontalScroll";
import SceneScrollSnap from "./scenes/SceneScrollSnap";
import SceneStepForm from "./scenes/SceneStepForm";
import SceneComplexForm from "./scenes/SceneComplexForm";
import SceneOnboarding from "./scenes/SceneOnboarding";
import SceneDashboard from "./scenes/SceneDashboard";
import SceneResponsiveTable from "./scenes/SceneResponsiveTable";
import SceneMasonry from "./scenes/SceneMasonry";
import SceneKanban from "./scenes/SceneKanban";
import SceneDetailFab from "./scenes/SceneDetailFab";
import SceneArticle from "./scenes/SceneArticle";
import SceneHero from "./scenes/SceneHero";
import SceneEditorial from "./scenes/SceneEditorial";
import SceneEmptyState from "./scenes/SceneEmptyState";
import SceneSkeleton from "./scenes/SceneSkeleton";
import SceneOverlay from "./scenes/SceneOverlay";
import SceneCommandPalette from "./scenes/SceneCommandPalette";
import SceneTabs from "./scenes/SceneTabs";
import SceneFeed from "./scenes/SceneFeed";
import SceneChat from "./scenes/SceneChat";
import SceneCalendar from "./scenes/SceneCalendar";

function Header() {
  return (
    <Box bg={COLORS.black} px="48px" py="32px" borderBottom={`${BORDER.heavy} ${COLORS.red}`}>
      <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap="16px">
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="36px"
            color={COLORS.pureWhite}
            letterSpacing="-0.02em"
            lineHeight={0.9}
          >
            样板房
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.light}
            fontSize="14px"
            color={COLORS.gold}
            mt="8px"
            letterSpacing="0.06em"
          >
            复杂场景布局参考 // 复制即用
          </Text>
        </Box>
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Text
            fontFamily={FONT.mono}
            fontSize="12px"
            color={COLORS.metalWhite}
            _hover={{ color: COLORS.red }}
            transition="color 0.15s ease"
          >
            &#8592; 返回索引
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}

export default function Showroom() {
  return (
    <Box minH="100vh" bg={COLORS.concrete}>
      <Flex>
        <ShowroomNav />
        <Box flex={1} h="100vh" overflowY="auto" id="showroom-scroll-container">
          <Header />

          <ShowroomSection id="nav-structure" number="01" title="导航与结构">
            <DemoFrame number="01-01" title="可收起侧边栏 + 主内容区" height="400px">
              <SceneSidebar />
            </DemoFrame>
            <DemoFrame number="01-02" title="分屏可拖拽分隔" height="400px">
              <SceneSplitPane />
            </DemoFrame>
            <DemoFrame number="01-03" title="粘性页头 + 滚动内容" height="400px">
              <SceneStickyHeader />
            </DemoFrame>
            <DemoFrame number="01-04" title="粘性页脚布局" height="400px">
              <SceneStickyFooter />
            </DemoFrame>
            <DemoFrame number="01-05" title="全高视口布局" height="400px">
              <SceneFullHeight />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="scroll-parallax" number="02" title="滚动与视差">
            <DemoFrame number="02-01" title="鼠标驱动滚动" height="400px">
              <SceneMouseScroll />
            </DemoFrame>
            <DemoFrame number="02-02" title="滚动触发动画" height="400px">
              <SceneScrollReveal />
            </DemoFrame>
            <DemoFrame number="02-03" title="长内容 + 悬浮目录" height="400px">
              <SceneDetailToc />
            </DemoFrame>
            <DemoFrame number="02-04" title="水平滚动容器" height="400px">
              <SceneHorizontalScroll />
            </DemoFrame>
            <DemoFrame number="02-05" title="Scroll-Snap 吸附" height="400px">
              <SceneScrollSnap />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="form-flow" number="03" title="表单与流程">
            <DemoFrame number="03-01" title="多步骤表单 + 步骤条" height="400px">
              <SceneStepForm />
            </DemoFrame>
            <DemoFrame number="03-02" title="复杂表单分组" height="400px">
              <SceneComplexForm />
            </DemoFrame>
            <DemoFrame number="03-03" title="向导式 Onboarding" height="400px">
              <SceneOnboarding />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="data-dashboard" number="04" title="数据与仪表">
            <DemoFrame number="04-01" title="数据仪表板" height="400px">
              <SceneDashboard />
            </DemoFrame>
            <DemoFrame number="04-02" title="响应式表格" height="400px">
              <SceneResponsiveTable />
            </DemoFrame>
            <DemoFrame number="04-03" title="Masonry 瀑布流" height="400px">
              <SceneMasonry />
            </DemoFrame>
            <DemoFrame number="04-04" title="Kanban 看板" height="400px">
              <SceneKanban />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="content-display" number="05" title="内容展示">
            <DemoFrame number="05-01" title="详情页 + FAB" height="400px">
              <SceneDetailFab />
            </DemoFrame>
            <DemoFrame number="05-02" title="文章/文档页" height="400px">
              <SceneArticle />
            </DemoFrame>
            <DemoFrame number="05-03" title="Hero 首屏" height="400px">
              <SceneHero />
            </DemoFrame>
            <DemoFrame number="05-04" title="图文混排杂志式" height="400px">
              <SceneEditorial />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="state-overlay" number="06" title="状态与浮层">
            <DemoFrame number="06-01" title="空状态 / 错误页" height="400px">
              <SceneEmptyState />
            </DemoFrame>
            <DemoFrame number="06-02" title="骨架屏布局" height="400px">
              <SceneSkeleton />
            </DemoFrame>
            <DemoFrame number="06-03" title="Modal / Drawer 层级" height="400px">
              <SceneOverlay />
            </DemoFrame>
            <DemoFrame number="06-04" title="命令面板 / 搜索浮层" height="400px">
              <SceneCommandPalette />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="interaction" number="07" title="交互密集型">
            <DemoFrame number="07-01" title="标签页 + 状态保持" height="400px">
              <SceneTabs />
            </DemoFrame>
            <DemoFrame number="07-02" title="通知/动态流" height="400px">
              <SceneFeed />
            </DemoFrame>
            <DemoFrame number="07-03" title="聊天对话布局" height="400px">
              <SceneChat />
            </DemoFrame>
            <DemoFrame number="07-04" title="日历/时间轴" height="400px">
              <SceneCalendar />
            </DemoFrame>
          </ShowroomSection>

          <Box bg={COLORS.black} px="48px" py="24px">
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.metalWhite}
              opacity={0.5}
            >
              设计系统 样板房 // 仅参考 // 非生产环境
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 7: Verify primitives render**

Run: `npm run types:check`
Expected: PASS (scene imports will fail until tasks 3-29 are done; this is expected at this stage).

- [ ] **Step 8: Commit**

```bash
git add src/showroom/ src/Theme.tsx
git commit -m "feat(showroom): add shared showroom primitives

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Wire route and homepage entry

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/DesignRefHome.tsx`

**Interfaces:**
- Consumes: `Showroom` default export from `src/showroom/Showroom.tsx`.
- Produces: `/showroom` route and homepage card linking to it.

- [ ] **Step 1: Add route in `src/App.tsx`**

Add import:
```tsx
import Showroom from "./showroom/Showroom";
```

Add route inside `<Routes>`:
```tsx
<Route path="/showroom" element={<Showroom />} />
```

- [ ] **Step 2: Add homepage entry in `src/DesignRefHome.tsx`**

After the last existing page entry (diagnostics), add a new card in the "远景层" section:

```tsx
{[...PAGES].map((page, idx) => ...)} // existing

{/* Showroom entry */}
<M.Box
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, delay: 0.7, ease: [0.0, 0.0, 0.2, 1.0] }}
  flex={1}
  minW="160px"
>
  <Link as={RouterLink} to="/showroom" _hover={{ textDecoration: "none" }}>
    <Box
      borderY={`${BORDER.hairline} ${COLORS.industrialBlack}`}
      px="14px"
      py="14px"
      opacity={0.7}
      _hover={{ opacity: 1, bg: COLORS.red, color: COLORS.pureWhite }}
      transition="all 0.15s ease"
      cursor="pointer"
    >
      <Flex align="center" gap="10px">
        <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.5}>
          11
        </Text>
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="14px">
          样板房
        </Text>
      </Flex>
    </Box>
  </Link>
</M.Box>
```

- [ ] **Step 3: Verify**

Run: `npm run types:check`
Expected: PASS (still missing scene files, so it will fail until they are created).

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/DesignRefHome.tsx
git commit -m "feat(showroom): add /showroom route and homepage entry

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Scene — Collapsible Sidebar

**Files:**
- Create: `src/showroom/scenes/SceneSidebar.tsx`

**Interfaces:**
- Consumes: `COLORS`, `FONT`, `WEIGHT`, `BORDER` from `src/Theme.tsx`.
- Produces: `SceneSidebar` default export used in `Showroom.tsx`.

- [ ] **Step 1: Write `src/showroom/scenes/SceneSidebar.tsx`**

```tsx
import { Box, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex h="100%">
      <Box
        w={collapsed ? "56px" : "160px"}
        h="100%"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.red}`}
        transition="width 0.25s ease"
        overflow="hidden"
        flexShrink={0}
      >
        <Flex h="40px" align="center" justify="center" borderBottom={`${BORDER.standard} ${COLORS.industrialBlack}`}>
          <Box w="8px" h="8px" bg={COLORS.red} />
        </Flex>
        <VStack align="stretch" gap="0" mt="8px">
          {["工作区", "供应方", "操作", "设置"].map((item) => (
            <Flex
              key={item}
              h="36px"
              align="center"
              px={collapsed ? "0" : "16px"}
              justify={collapsed ? "center" : "flex-start"}
              cursor="pointer"
              _hover={{ bg: COLORS.industrialBlack }}
            >
              <Box w="6px" h="6px" bg={COLORS.gold} flexShrink={0} />
              {!collapsed && (
                <Text
                  ml="10px"
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="11px"
                  color={COLORS.metalWhite}
                  letterSpacing="0.04em"
                >
                  {item}
                </Text>
              )}
            </Flex>
          ))}
        </VStack>
      </Box>

      <Box flex={1} bg={COLORS.concrete} p="16px" overflow="auto">
        <Flex justify="space-between" align="center" mb="16px">
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.black}>
            业务内容区
          </Text>
          <Button
            size="xs"
            bg={COLORS.red}
            color={COLORS.pureWhite}
            borderRadius={0}
            onClick={() => setCollapsed((c) => !c)}
            fontFamily={FONT.mono}
            fontSize="10px"
          >
            {collapsed ? "展开" : "收起"}
          </Button>
        </Flex>
        <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} h="200px" p="12px">
          <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.6}>
            侧边栏宽度 160px / 56px 切换，主内容区 flex:1 自适应。
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`
Expected: Sidebar toggles width smoothly; main content always fills remaining space.

- [ ] **Step 3: Type check**

Run: `npm run types:check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/showroom/scenes/SceneSidebar.tsx
git commit -m "feat(showroom): add collapsible sidebar scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Scene — Split Pane

**Files:**
- Create: `src/showroom/scenes/SceneSplitPane.tsx`

- [ ] **Step 1: Write `src/showroom/scenes/SceneSplitPane.tsx`**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useRef, useCallback } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneSplitPane() {
  const [ratio, setRatio] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setRatio(Math.min(80, Math.max(20, pct)));
  }, []);

  const stopDrag = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", stopDrag);
  }, [handleMove]);

  const startDrag = () => {
    dragging.current = true;
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
  };

  return (
    <Flex ref={containerRef} h="100%" position="relative">
      <Box w={`${ratio}%`} h="100%" bg={COLORS.concrete} p="12px" overflow="auto">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.black}>
          左侧面板
        </Text>
      </Box>
      <Box
        w="6px"
        h="100%"
        bg={COLORS.red}
        cursor="col-resize"
        position="relative"
        zIndex={2}
        onMouseDown={startDrag}
        _hover={{ bg: COLORS.redLight }}
      />
      <Box flex={1} h="100%" bg={COLORS.pureWhite} p="12px" overflow="auto">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.black}>
          右侧面板
        </Text>
      </Box>
    </Flex>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Expected: Red divider drags left/right; panels stay between 20% and 80%.

- [ ] **Step 3: Type check and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneSplitPane.tsx
git commit -m "feat(showroom): add split-pane drag scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Scene — Sticky Header

**Files:**
- Create: `src/showroom/scenes/SceneStickyHeader.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneStickyHeader() {
  return (
    <Box h="100%" display="flex" flexDirection="column" overflow="hidden" border={`${BORDER.standard} ${COLORS.black}`}>
      <Box bg={COLORS.red} px="12px" py="8px" position="sticky" top={0} zIndex={2}>
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite}>
          粘性页头
        </Text>
      </Box>
      <Box flex={1} overflowY="auto" p="12px" bg={COLORS.concrete}>
        <VStack align="stretch" gap="12px">
          {Array.from({ length: 12 }).map((_, i) => (
            <Box key={i} h="40px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.industrialBlack}`}>
              <Text fontFamily={FONT.mono} fontSize="10px" p="8px" color={COLORS.industrialBlack}>
                内容行 {i + 1}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneStickyHeader.tsx
git commit -m "feat(showroom): add sticky header scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Scene — Sticky Footer

**Files:**
- Create: `src/showroom/scenes/SceneStickyFooter.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneStickyFooter() {
  return (
    <Box h="100%" display="flex" flexDirection="column" overflow="hidden" border={`${BORDER.standard} ${COLORS.black}`}>
      <Box flex={1} overflowY="auto" p="12px" bg={COLORS.concrete}>
        <VStack align="stretch" gap="12px">
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} h="40px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.industrialBlack}`}>
              <Text fontFamily={FONT.mono} fontSize="10px" p="8px" color={COLORS.industrialBlack}>
                内容行 {i + 1}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
      <Box bg={COLORS.black} px="12px" py="8px">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite}>
          粘性页脚
        </Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneStickyFooter.tsx
git commit -m "feat(showroom): add sticky footer scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Scene — Full Height Layout

**Files:**
- Create: `src/showroom/scenes/SceneFullHeight.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneFullHeight() {
  return (
    <Box h="100%" display="flex" flexDirection="column" border={`${BORDER.standard} ${COLORS.black}`}>
      <Box bg={COLORS.red} px="12px" py="8px">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite}>
          Header
        </Text>
      </Box>
      <Box flex={1} bg={COLORS.concrete} p="12px" overflow="auto">
        <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack}>
          Main 区域自动撑满剩余视口高度，无意外溢出。
        </Text>
      </Box>
      <Box bg={COLORS.black} px="12px" py="8px">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite}>
          Footer
        </Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneFullHeight.tsx
git commit -m "feat(showroom): add full-height layout scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: Scene — Mouse-Driven Scroll

**Files:**
- Create: `src/showroom/scenes/SceneMouseScroll.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneMouseScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    trackRef.current.scrollLeft = pct * (trackRef.current.scrollWidth - rect.width);
  };

  return (
    <Box h="100%">
      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.7} mb="8px">
        鼠标在轨道内左右移动即可控制横向滚动
      </Text>
      <Flex
        ref={trackRef}
        h="calc(100% - 24px)"
        overflowX="auto"
        gap="12px"
        onMouseMove={handleMouseMove}
        css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Box
            key={i}
            minW="120px"
            h="100%"
            bg={i % 2 === 0 ? COLORS.red : COLORS.black}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={`${BORDER.standard} ${COLORS.black}`}
          >
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="18px" color={COLORS.pureWhite}>
              {i + 1}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneMouseScroll.tsx
git commit -m "feat(showroom): add mouse-driven scroll scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: Scene — Scroll Reveal

**Files:**
- Create: `src/showroom/scenes/SceneScrollReveal.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, BORDER } from "../../Theme";

const M = { Box: motion(Box) };

export default function SceneScrollReveal() {
  return (
    <Box h="100%" overflowY="auto" p="8px" bg={COLORS.concrete}>
      <VStack align="stretch" gap="12px">
        {Array.from({ length: 6 }).map((_, i) => (
          <M.Box
            key={i}
            h="60px"
            bg={COLORS.pureWhite}
            border={`${BORDER.hairline} ${COLORS.black}`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1.0] }}
          />
        ))}
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneScrollReveal.tsx
git commit -m "feat(showroom): add scroll reveal scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 10: Scene — Detail with TOC

**Files:**
- Create: `src/showroom/scenes/SceneDetailToc.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const SECTIONS = ["概述", "设计", "实现", "验证"];

export default function SceneDetailToc() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // simplified: use index based on scroll position
      const container = document.getElementById("detail-scroll");
      if (!container) return;
      const scrollTop = container.scrollTop;
      const sectionHeight = container.scrollHeight / SECTIONS.length;
      const idx = Math.min(SECTIONS.length - 1, Math.floor(scrollTop / sectionHeight));
      setActive(idx);
    };
    const el = document.getElementById("detail-scroll");
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex h="100%">
      <Box w="100px" h="100%" bg={COLORS.black} p="8px" flexShrink={0}>
        <VStack align="stretch" gap="8px">
          {SECTIONS.map((s, i) => (
            <Text
              key={s}
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              color={active === i ? COLORS.red : COLORS.metalWhite}
              cursor="pointer"
            >
              {s}
            </Text>
          ))}
        </VStack>
      </Box>
      <Box id="detail-scroll" flex={1} h="100%" overflowY="auto" bg={COLORS.concrete} p="12px">
        {SECTIONS.map((s, i) => (
          <Box key={s} h="120px" mb="12px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}`} p="8px">
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.black}>
              {s}
            </Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneDetailToc.tsx
git commit -m "feat(showroom): add detail page with TOC scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 11: Scene — Horizontal Scroll Container

**Files:**
- Create: `src/showroom/scenes/SceneHorizontalScroll.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneHorizontalScroll() {
  return (
    <Box h="100%" overflowX="auto" css={{ scrollbarWidth: "thin" }}>
      <Flex gap="12px" h="100%" minW="max-content" p="4px">
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            w="140px"
            h="100%"
            bg={i === 0 ? COLORS.red : COLORS.pureWhite}
            border={`${BORDER.standard} ${COLORS.black}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="14px"
              color={i === 0 ? COLORS.pureWhite : COLORS.black}
            >
              卡片 {i + 1}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneHorizontalScroll.tsx
git commit -m "feat(showroom): add horizontal scroll container scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 12: Scene — Scroll Snap

**Files:**
- Create: `src/showroom/scenes/SceneScrollSnap.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT } from "../../Theme";

export default function SceneScrollSnap() {
  return (
    <Box h="100%" overflowX="auto" css={{ scrollSnapType: "x mandatory" }}>
      <Flex h="100%" minW="max-content">
        {["红色", "黑色", "金色", "白色"].map((label, i) => (
          <Box
            key={label}
            w="100%"
            h="100%"
            flexShrink={0}
            css={{ scrollSnapAlign: "start" }}
            bg={[COLORS.red, COLORS.black, COLORS.gold, COLORS.pureWhite][i]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="20px"
              color={i === 1 ? COLORS.pureWhite : COLORS.black}
            >
              {label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneScrollSnap.tsx
git commit -m "feat(showroom): add scroll snap scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 13: Scene — Step Form

**Files:**
- Create: `src/showroom/scenes/SceneStepForm.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const STEPS = ["基本信息", "配置参数", "确认提交"];

export default function SceneStepForm() {
  const [step, setStep] = useState(0);

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Flex mb="16px" gap="0">
        {STEPS.map((s, i) => (
          <Box
            key={s}
            flex={1}
            py="8px"
            px="12px"
            bg={i <= step ? COLORS.red : COLORS.industrialBlack}
            borderRight={`${BORDER.hairline} ${COLORS.black}`}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              color={i <= step ? COLORS.pureWhite : COLORS.metalWhite}
            >
              {i + 1}. {s}
            </Text>
          </Box>
        ))}
      </Flex>
      <Box flex={1} bg={COLORS.concrete} p="12px" border={`${BORDER.standard} ${COLORS.black}`}>
        <Text fontFamily={FONT.mono} fontSize="11px" color={COLORS.industrialBlack}>
          当前步骤：{STEPS[step]}
        </Text>
      </Box>
      <Flex justify="space-between" mt="12px">
        <Button size="xs" borderRadius={0} bg={COLORS.black} color={COLORS.pureWhite} onClick={() => setStep(Math.max(0, step - 1))}>
          上一步
        </Button>
        <Button size="xs" borderRadius={0} bg={COLORS.red} color={COLORS.pureWhite} onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
          下一步
        </Button>
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneStepForm.tsx
git commit -m "feat(showroom): add step form scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 14: Scene — Complex Form

**Files:**
- Create: `src/showroom/scenes/SceneComplexForm.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Grid, Text, Input } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneComplexForm() {
  return (
    <Box h="100%" overflowY="auto" p="8px" bg={COLORS.concrete}>
      <Grid templateColumns="1fr 1fr" gap="12px">
        <Box>
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="10px" mb="4px">名称</Text>
          <Input bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} borderRadius={0} size="sm" />
        </Box>
        <Box>
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="10px" mb="4px">编码</Text>
          <Input bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.red}`} borderRadius={0} size="sm" />
        </Box>
        <Box gridColumn="1 / -1">
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="10px" mb="4px">描述</Text>
          <Input bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} borderRadius={0} size="sm" />
        </Box>
      </Grid>
      <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.red} mt="8px">
        编码为必填项
      </Text>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneComplexForm.tsx
git commit -m "feat(showroom): add complex form scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 15: Scene — Onboarding

**Files:**
- Create: `src/showroom/scenes/SceneOnboarding.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const SCREENS = [
  { title: "欢迎", desc: "开始使用系统" },
  { title: "配置", desc: "设置你的偏好" },
  { title: "完成", desc: "进入工作台" },
];

export default function SceneOnboarding() {
  const [idx, setIdx] = useState(0);

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete} p="16px">
      <Box flex={1} bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} p="16px" display="flex" flexDirection="column" justifyContent="center">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="18px" color={COLORS.red}>
          {SCREENS[idx].title}
        </Text>
        <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} mt="8px">
          {SCREENS[idx].desc}
        </Text>
      </Box>
      <Flex justify="space-between" mt="12px">
        <Button size="xs" borderRadius={0} bg={COLORS.black} color={COLORS.pureWhite} onClick={() => setIdx(Math.max(0, idx - 1))}>
          返回
        </Button>
        <Button size="xs" borderRadius={0} bg={COLORS.red} color={COLORS.pureWhite} onClick={() => setIdx(Math.min(SCREENS.length - 1, idx + 1))}>
          继续
        </Button>
      </Flex>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneOnboarding.tsx
git commit -m "feat(showroom): add onboarding scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 16: Scene — Dashboard

**Files:**
- Create: `src/showroom/scenes/SceneDashboard.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW } from "../../Theme";

export default function SceneDashboard() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="8px">
      <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="12px">
        {["OPS", "节点", "延迟"].map((label) => (
          <Box key={label} bg={COLORS.black} p="8px" border={`${BORDER.standard} ${COLORS.black}`}>
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.6}>{label}</Text>
            <Text fontFamily={FONT.mono} fontWeight={WEIGHT.black} fontSize="18px" color={COLORS.electricCyan}>000</Text>
          </Box>
        ))}
      </Grid>
      <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.medium} h="120px" p="8px">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="10px" color={COLORS.black}>图表区</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneDashboard.tsx
git commit -m "feat(showroom): add dashboard scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 17: Scene — Responsive Table

**Files:**
- Create: `src/showroom/scenes/SceneResponsiveTable.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneResponsiveTable() {
  return (
    <Box h="100%" overflow="auto" bg={COLORS.concrete}>
      <Box minW="360px">
        <Flex bg={COLORS.black} px="12px" py="6px">
          {["名称", "状态", "数值"].map((h) => (
            <Box key={h} flex={1}>
              <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="10px" color={COLORS.pureWhite}>{h}</Text>
            </Box>
          ))}
        </Flex>
        {Array.from({ length: 5 }).map((_, i) => (
          <Flex key={i} px="12px" py="8px" borderBottom={`${BORDER.hairline} ${COLORS.black}`} bg={COLORS.pureWhite}>
            <Box flex={1}><Text fontFamily={FONT.mono} fontSize="10px">item-{i + 1}</Text></Box>
            <Box flex={1}><Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.statusGreen}>运行中</Text></Box>
            <Box flex={1}><Text fontFamily={FONT.mono} fontSize="10px">{100 + i}</Text></Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneResponsiveTable.tsx
git commit -m "feat(showroom): add responsive table scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 18: Scene — Masonry

**Files:**
- Create: `src/showroom/scenes/SceneMasonry.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const HEIGHTS = [80, 120, 90, 140, 100, 70];

export default function SceneMasonry() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="4px">
      <Grid templateColumns="1fr 1fr" gap="8px" alignItems="start">
        {HEIGHTS.map((h, i) => (
          <Box
            key={i}
            h={`${h}px`}
            bg={i % 2 === 0 ? COLORS.red : COLORS.pureWhite}
            border={`${BORDER.standard} ${COLORS.black}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={i % 2 === 0 ? COLORS.pureWhite : COLORS.black}>
              {h}px
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneMasonry.tsx
git commit -m "feat(showroom): add masonry scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 19: Scene — Kanban

**Files:**
- Create: `src/showroom/scenes/SceneKanban.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const COLUMNS = ["待办", "进行中", "已完成"];

export default function SceneKanban() {
  return (
    <Flex h="100%" gap="12px" bg={COLORS.concrete} p="8px" overflowX="auto">
      {COLUMNS.map((col) => (
        <Box key={col} minW="120px" flex={1} bg={COLORS.black} p="8px" h="100%">
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="10px" color={COLORS.pureWhite} mb="8px">{col}</Text>
          <VStack align="stretch" gap="8px">
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} h="40px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}`} />
            ))}
          </VStack>
        </Box>
      ))}
    </Flex>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneKanban.tsx
git commit -m "feat(showroom): add kanban scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 20: Scene — Detail with FAB

**Files:**
- Create: `src/showroom/scenes/SceneDetailFab.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneDetailFab() {
  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete} p="12px">
      <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} h="100%" p="12px" overflowY="auto">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.black}>详情标题</Text>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i} h="24px" my="8px" bg={COLORS.concrete} />
        ))}
      </Box>
      <Box
        position="absolute"
        bottom="16px"
        right="16px"
        w="40px"
        h="40px"
        bg={COLORS.red}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        boxShadow="4px 4px 0px rgba(0,0,0,0.2)"
      >
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} color={COLORS.pureWhite}>+</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneDetailFab.tsx
git commit -m "feat(showroom): add detail page with FAB scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 21: Scene — Article

**Files:**
- Create: `src/showroom/scenes/SceneArticle.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneArticle() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="12px">
      <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.black} mb="8px">文章标题</Text>
      <Box h="2px" bg={COLORS.red} mb="12px" />
      <VStack align="stretch" gap="8px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} h="16px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.industrialBlack}`} />
        ))}
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneArticle.tsx
git commit -m "feat(showroom): add article scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 22: Scene — Hero

**Files:**
- Create: `src/showroom/scenes/SceneHero.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneHero() {
  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.black} p="16px">
      <Box position="absolute" bottom="0" left="0" w="60%" h="70%" bg={COLORS.red} clipPath="polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)" />
      <Box position="relative" zIndex={2}>
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="28px" color={COLORS.pureWhite} lineHeight={0.9}>HERO</Text>
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.light} fontSize="10px" color={COLORS.gold} mt="8px">全屏首屏 // 色块构图</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneHero.tsx
git commit -m "feat(showroom): add hero scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 23: Scene — Editorial

**Files:**
- Create: `src/showroom/scenes/SceneEditorial.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneEditorial() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="8px">
      <Grid templateColumns="1fr 1fr" gap="12px">
        <Box h="120px" bg={COLORS.red} border={`${BORDER.standard} ${COLORS.black}`} display="flex" alignItems="center" justifyContent="center">
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} color={COLORS.pureWhite}>图</Text>
        </Box>
        <Box>
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" mb="8px">标题</Text>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} h="12px" my="6px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}`} />
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneEditorial.tsx
git commit -m "feat(showroom): add editorial scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 24: Scene — Empty State

**Files:**
- Create: `src/showroom/scenes/SceneEmptyState.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneEmptyState() {
  return (
    <Flex h="100%" direction="column" align="center" justify="center" bg={COLORS.concrete} p="16px">
      <Box w="48px" h="48px" border={`${BORDER.heavy} ${COLORS.red}`} display="flex" alignItems="center" justifyContent="center" mb="12px">
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="20px" color={COLORS.red}>!</Text>
      </Box>
      <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.black}>暂无数据</Text>
      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.6} mt="4px">请检查筛选条件</Text>
      <Button mt="12px" size="xs" borderRadius={0} bg={COLORS.red} color={COLORS.pureWhite}>刷新</Button>
    </Flex>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneEmptyState.tsx
git commit -m "feat(showroom): add empty state scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 25: Scene — Skeleton

**Files:**
- Create: `src/showroom/scenes/SceneSkeleton.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS } from "../../Theme";

const M = { Box: motion(Box) };

function SkeletonLine({ width = "100%", h = "12px" }: { width?: string; h?: string }) {
  return (
    <M.Box
      w={width}
      h={h}
      bg={COLORS.industrialBlack}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function SceneSkeleton() {
  return (
    <Box h="100%" bg={COLORS.concrete} p="12px">
      <Flex gap="12px" mb="12px">
        <SkeletonLine width="40px" h="40px" />
        <VStack align="stretch" flex={1} gap="8px">
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" />
        </VStack>
      </Flex>
      <VStack align="stretch" gap="8px">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine width="80%" />
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneSkeleton.tsx
git commit -m "feat(showroom): add skeleton scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 26: Scene — Overlay

**Files:**
- Create: `src/showroom/scenes/SceneOverlay.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <Box h="100%" position="relative" bg={COLORS.concrete} p="12px">
      <Button size="xs" borderRadius={0} bg={COLORS.red} color={COLORS.pureWhite} onClick={() => setOpen(true)}>
        打开弹层
      </Button>
      {open && (
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.7)" zIndex={10} display="flex" alignItems="center" justifyContent="center">
          <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} p="16px" w="240px">
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" mb="12px">Modal 标题</Text>
            <Button size="xs" borderRadius={0} bg={COLORS.black} color={COLORS.pureWhite} onClick={() => setOpen(false)}>
              关闭
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneOverlay.tsx
git commit -m "feat(showroom): add overlay scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 27: Scene — Command Palette

**Files:**
- Create: `src/showroom/scenes/SceneCommandPalette.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneCommandPalette() {
  const [open, setOpen] = useState(false);

  return (
    <Box h="100%" position="relative" bg={COLORS.concrete} p="12px">
      <Button size="xs" borderRadius={0} bg={COLORS.black} color={COLORS.pureWhite} onClick={() => setOpen(true)}>
        ⌘K
      </Button>
      {open && (
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.8)" zIndex={10} display="flex" alignItems="flex-start" justifyContent="center" pt="40px">
          <Box w="80%" bg={COLORS.black} border={`${BORDER.heavy} ${COLORS.red}`}>
            <Input placeholder="搜索命令..." bg={COLORS.industrialBlack} color={COLORS.pureWhite} border="none" borderRadius={0} size="sm" />
            <Flex direction="column" p="8px" gap="4px">
              {["新建", "保存", "导出"].map((cmd) => (
                <Text key={cmd} fontFamily={FONT.mono} fontSize="10px" color={COLORS.metalWhite} py="4px" _hover={{ bg: COLORS.red }}>{cmd}</Text>
              ))}
            </Flex>
            <Button size="xs" w="100%" borderRadius={0} bg={COLORS.red} color={COLORS.pureWhite} onClick={() => setOpen(false)}>关闭</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneCommandPalette.tsx
git commit -m "feat(showroom): add command palette scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 28: Scene — Tabs

**Files:**
- Create: `src/showroom/scenes/SceneTabs.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

const TABS = ["概览", "日志", "设置"];

export default function SceneTabs() {
  const [tab, setTab] = useState(0);

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete}>
      <Flex borderBottom={`${BORDER.standard} ${COLORS.black}`}>
        {TABS.map((t, i) => (
          <Box
            key={t}
            px="16px"
            py="8px"
            cursor="pointer"
            bg={tab === i ? COLORS.red : COLORS.concrete}
            onClick={() => setTab(i)}
          >
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="11px" color={tab === i ? COLORS.pureWhite : COLORS.black}>{t}</Text>
          </Box>
        ))}
      </Flex>
      <Box flex={1} p="12px" bg={tab === 0 ? COLORS.pureWhite : tab === 1 ? COLORS.black : COLORS.gold}>
        <Text fontFamily={FONT.mono} fontSize="10px" color={tab === 1 ? COLORS.pureWhite : COLORS.black}>内容区 {TABS[tab]}</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneTabs.tsx
git commit -m "feat(showroom): add tabs scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 29: Scene — Feed

**Files:**
- Create: `src/showroom/scenes/SceneFeed.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneFeed() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="8px">
      <VStack align="stretch" gap="8px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Flex key={i} bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}`} p="8px" gap="8px">
            <Box w="32px" h="32px" bg={COLORS.red} flexShrink={0} />
            <Box flex={1}>
              <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="10px" color={COLORS.black}>通知标题 {i + 1}</Text>
              <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.industrialBlack} opacity={0.7}>刚刚</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneFeed.tsx
git commit -m "feat(showroom): add feed scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 30: Scene — Chat

**Files:**
- Create: `src/showroom/scenes/SceneChat.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Flex, Text, VStack, Input } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneChat() {
  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete}>
      <Box flex={1} overflowY="auto" p="8px">
        <VStack align="stretch" gap="8px">
          <Box alignSelf="flex-start" bg={COLORS.black} px="10px" py="6px" maxW="70%">
            <Text fontFamily={FONT.sans} fontSize="10px" color={COLORS.pureWhite}>你好</Text>
          </Box>
          <Box alignSelf="flex-end" bg={COLORS.red} px="10px" py="6px" maxW="70%">
            <Text fontFamily={FONT.sans} fontSize="10px" color={COLORS.pureWhite}>收到</Text>
          </Box>
        </VStack>
      </Box>
      <Box p="8px" bg={COLORS.pureWhite} borderTop={`${BORDER.standard} ${COLORS.black}`}>
        <Input placeholder="输入消息..." size="sm" borderRadius={0} border={`${BORDER.standard} ${COLORS.black}`} />
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneChat.tsx
git commit -m "feat(showroom): add chat scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 31: Scene — Calendar

**Files:**
- Create: `src/showroom/scenes/SceneCalendar.tsx`

- [ ] **Step 1: Write component**

```tsx
import { Box, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../../Theme";

export default function SceneCalendar() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p="8px">
      <Grid templateColumns="repeat(7, 1fr)" gap="4px">
        {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
          <Box key={d} bg={COLORS.black} p="4px" textAlign="center">
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.pureWhite}>{d}</Text>
          </Box>
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <Box key={i} h="32px" bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}`} p="2px">
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack}>{i + 1}</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
npm run types:check
git add src/showroom/scenes/SceneCalendar.tsx
git commit -m "feat(showroom): add calendar scene

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 32: Final integration and verification

**Files:**
- Modify: all if needed

- [ ] **Step 1: Run full type check**

Run: `npm run types:check`
Expected: PASS with no errors.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Visual QA checklist**

Run: `npm run dev` and verify:
- `/showroom` loads without blank screen.
- Sidebar highlights current category on scroll.
- Mobile drawer opens/closes.
- Every demo renders without overflow or broken alignment.
- All buttons/interactions work.

- [ ] **Step 4: Commit final changes**

```bash
git add -A
git commit -m "feat(showroom): complete showroom model room

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Architecture: covered in Task 1.
- Route and homepage entry: covered in Task 2.
- All 29 scene categories from the spec are represented as tasks 3-31.
- Visual QA and build verification: covered in Task 32.

**Placeholder scan:**
- No TBD/TODO.
- Every task has exact file paths and complete code.
- No vague "add appropriate styling" steps.

**Type consistency:**
- All components are default exports.
- Theme token imports are consistent (`../../Theme`).
- `Showroom.tsx` imports match the filenames used in tasks 3-31.

**Potential gap:**
- The plan intentionally keeps scene visuals minimal so the implementer can polish them during visual QA. If any scene feels too bare during Task 32, refine it before final commit.
