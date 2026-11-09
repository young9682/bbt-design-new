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
import SceneTopNavMenu from "./scenes/SceneTopNavMenu";
import SceneBreadcrumbs from "./scenes/SceneBreadcrumbs";
import ScenePagination from "./scenes/ScenePagination";
import SceneMobileTabBar from "./scenes/SceneMobileTabBar";
import SceneInfiniteScroll from "./scenes/SceneInfiniteScroll";
import SceneCarousel from "./scenes/SceneCarousel";
import SceneVirtualList from "./scenes/SceneVirtualList";
import SceneAuthSplit from "./scenes/SceneAuthSplit";
import SceneFilterResults from "./scenes/SceneFilterResults";
import SceneTagInput from "./scenes/SceneTagInput";
import SceneSortableTable from "./scenes/SceneSortableTable";
import SceneTreeView from "./scenes/SceneTreeView";
import SceneFileManager from "./scenes/SceneFileManager";
import SceneMonitorWall from "./scenes/SceneMonitorWall";
import SceneLightbox from "./scenes/SceneLightbox";
import ScenePricing from "./scenes/ScenePricing";
import SceneCompareSlider from "./scenes/SceneCompareSlider";
import SceneNotificationPanel from "./scenes/SceneNotificationPanel";
import SceneContextMenu from "./scenes/SceneContextMenu";
import SceneTooltip from "./scenes/SceneTooltip";
import SceneComments from "./scenes/SceneComments";
import SceneAvatarStack from "./scenes/SceneAvatarStack";
import SceneTimeline from "./scenes/SceneTimeline";

function Header() {
  return (
    <Box
      bg={COLORS.black}
      px={{ base: "20px", md: "32px", lg: "48px" }}
      py={{ base: "24px", md: "32px" }}
      borderBottom={`${BORDER.heavy} ${COLORS.red}`}
    >
      <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap="16px">
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "28px", md: "36px" }}
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
            <DemoFrame number="01-06" title="顶部导航 + 下拉菜单" height="400px" note="MEGA MENU">
              <SceneTopNavMenu />
            </DemoFrame>
            <DemoFrame number="01-07" title="面包屑 + 多级导航" height="400px" note="BREADCRUMB">
              <SceneBreadcrumbs />
            </DemoFrame>
            <DemoFrame number="01-08" title="分页器" height="400px" note="PAGINATION">
              <ScenePagination />
            </DemoFrame>
            <DemoFrame number="01-09" title="移动端底部标签栏" height="400px" note="BOTTOM TABS">
              <SceneMobileTabBar />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="scroll-parallax" number="02" title="滚动与视差">
            <DemoFrame number="02-01" title="鼠标驱动滚动" height="400px" wide note="MOUSE X → SCROLL_X">
              <SceneMouseScroll />
            </DemoFrame>
            <DemoFrame number="02-02" title="滚动触发动画" height="400px">
              <SceneScrollReveal />
            </DemoFrame>
            <DemoFrame number="02-03" title="长内容 + 悬浮目录" height="400px">
              <SceneDetailToc />
            </DemoFrame>
            <DemoFrame number="02-04" title="水平滚动容器" height="400px" wide note="OVERFLOW-X">
              <SceneHorizontalScroll />
            </DemoFrame>
            <DemoFrame number="02-05" title="Scroll-Snap 吸附" height="400px" wide note="SNAP: X MANDATORY">
              <SceneScrollSnap />
            </DemoFrame>
            <DemoFrame number="02-06" title="无限滚动列表" height="400px" note="SENTINEL IO">
              <SceneInfiniteScroll />
            </DemoFrame>
            <DemoFrame number="02-07" title="轮播走马灯" height="400px" wide note="CAROUSEL">
              <SceneCarousel />
            </DemoFrame>
            <DemoFrame number="02-08" title="虚拟滚动长列表" height="400px" note="VIRTUALIZED">
              <SceneVirtualList />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="form-flow" number="03" title="表单与流程">
            <DemoFrame number="03-01" title="多步骤表单 + 步骤条" height="400px" wide note="WIZARD">
              <SceneStepForm />
            </DemoFrame>
            <DemoFrame number="03-02" title="复杂表单分组" height="400px">
              <SceneComplexForm />
            </DemoFrame>
            <DemoFrame number="03-03" title="向导式 Onboarding" height="400px" wide note="GUIDED FLOW">
              <SceneOnboarding />
            </DemoFrame>
            <DemoFrame number="03-04" title="登录/注册分屏" height="400px" wide note="AUTH SPLIT">
              <SceneAuthSplit />
            </DemoFrame>
            <DemoFrame number="03-05" title="筛选侧栏 + 结果网格" height="400px" note="FACET + GRID">
              <SceneFilterResults />
            </DemoFrame>
            <DemoFrame number="03-06" title="标签输入 + 搜索表单" height="400px" note="TAG INPUT">
              <SceneTagInput />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="data-dashboard" number="04" title="数据与仪表">
            <DemoFrame number="04-01" title="数据仪表板" height="400px" wide note="KPI + CHART + LIST">
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
            <DemoFrame number="04-05" title="可排序表格" height="400px" note="SORTABLE COLS">
              <SceneSortableTable />
            </DemoFrame>
            <DemoFrame number="04-06" title="树形视图" height="400px" note="TREE">
              <SceneTreeView />
            </DemoFrame>
            <DemoFrame number="04-07" title="文件管理器" height="400px" note="FINDER">
              <SceneFileManager />
            </DemoFrame>
            <DemoFrame number="04-08" title="实时监控大屏" height="400px" wide note="TV WALL">
              <SceneMonitorWall />
            </DemoFrame>
          </ShowroomSection>

          <ShowroomSection id="content-display" number="05" title="内容展示">
            <DemoFrame number="05-01" title="详情页 + FAB" height="400px">
              <SceneDetailFab />
            </DemoFrame>
            <DemoFrame number="05-02" title="文章/文档页" height="400px">
              <SceneArticle />
            </DemoFrame>
            <DemoFrame number="05-03" title="Hero 首屏" height="400px" wide note="FULL-BLEED">
              <SceneHero />
            </DemoFrame>
            <DemoFrame number="05-04" title="图文混排杂志式" height="400px">
              <SceneEditorial />
            </DemoFrame>
            <DemoFrame number="05-05" title="图片灯箱画廊" height="400px" note="LIGHTBOX">
              <SceneLightbox />
            </DemoFrame>
            <DemoFrame number="05-06" title="定价页" height="400px" wide note="PRICING TIERS">
              <ScenePricing />
            </DemoFrame>
            <DemoFrame number="05-07" title="对比滑块" height="400px" note="BEFORE/AFTER">
              <SceneCompareSlider />
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
            <DemoFrame number="06-05" title="通知中心下拉" height="400px" note="NOTIFICATION">
              <SceneNotificationPanel />
            </DemoFrame>
            <DemoFrame number="06-06" title="右键上下文菜单" height="400px" note="CONTEXT MENU">
              <SceneContextMenu />
            </DemoFrame>
            <DemoFrame number="06-07" title="工具提示浮层定位" height="400px" note="TOOLTIP/POPOVER">
              <SceneTooltip />
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
            <DemoFrame number="07-04" title="日历/时间轴" height="400px" wide note="GRID: 7 COL">
              <SceneCalendar />
            </DemoFrame>
            <DemoFrame number="07-05" title="评论线程" height="400px" note="THREADS">
              <SceneComments />
            </DemoFrame>
            <DemoFrame number="07-06" title="头像堆叠 + 成员管理" height="400px" note="AVATAR STACK">
              <SceneAvatarStack />
            </DemoFrame>
            <DemoFrame number="07-07" title="垂直时间轴" height="400px" note="TIMELINE">
              <SceneTimeline />
            </DemoFrame>
          </ShowroomSection>

          <Box bg={COLORS.black} px="48px" py="24px">
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.metalWhite}
              opacity={0.5}
            >
              BBT 样板房 // 仅参考 // 非生产环境
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
