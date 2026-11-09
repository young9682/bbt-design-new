import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const MBox = motion(Box);

type TabId = "home" | "tasks" | "messages" | "profile";
type IconShape = "square" | "diamond" | "circle" | "triangle";

const TABS: { id: TabId; label: string; icon: IconShape; badge?: string }[] = [
  { id: "home", label: "首页", icon: "square" },
  { id: "tasks", label: "任务", icon: "diamond" },
  { id: "messages", label: "消息", icon: "circle", badge: "3" },
  { id: "profile", label: "我的", icon: "triangle" },
];

const scrollbarSx = {
  "&::-webkit-scrollbar": { width: "4px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: COLORS.black },
  scrollbarWidth: "thin",
  scrollbarColor: `${COLORS.black} transparent`,
} as const;

/** 几何图标 — 几何构成符号系统 */
function TabIcon({ shape, color }: { shape: IconShape; color: string }) {
  switch (shape) {
    case "square":
      return <Box w="12px" h="12px" bg={color} />;
    case "diamond":
      return <Box w="11px" h="11px" bg={color} transform="rotate(45deg)" />;
    case "circle":
      return <Box w="12px" h="12px" bg={color} borderRadius="50%" />;
    case "triangle":
      return (
        <Box
          w={0}
          h={0}
          borderLeft="7px solid transparent"
          borderRight="7px solid transparent"
          borderBottom={`12px solid ${color}`}
        />
      );
  }
}

/** 页面小标题 — 红色方块 + 等宽编码 */
function PageHeader({ code, title }: { code: string; title: string }) {
  return (
    <Flex align="center" justify="space-between" px="10px" py="8px">
      <Flex align="center" gap="6px">
        <Box w="6px" h="6px" bg={COLORS.red} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="12px"
          letterSpacing="0.08em"
          color={COLORS.black}
        >
          {title}
        </Text>
      </Flex>
      <Text
        fontFamily={FONT.mono}
        fontSize="8px"
        color={COLORS.industrialBlack}
        opacity={0.5}
        letterSpacing="0.1em"
      >
        {code}
      </Text>
    </Flex>
  );
}

/** 首页 — KPI 仪表块 */
function PageHome() {
  const kpis = [
    { label: "节点在线", value: "347", unit: "台", color: COLORS.statusGreen },
    { label: "GPU 负载", value: "87.3", unit: "%", color: COLORS.velocityOrange },
    { label: "任务队列", value: "12", unit: "项", color: COLORS.gold },
    { label: "活动告警", value: "02", unit: "条", color: COLORS.red },
  ];
  const bars = [35, 60, 42, 78, 55, 92, 66];

  return (
    <Box>
      <PageHeader code="PG.01 / HOME" title="首页" />
      <Box px="10px" pb="12px">
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="8px">
          {kpis.map((kpi) => (
            <Box
              key={kpi.label}
              bg={COLORS.pureWhite}
              border={`${BORDER.standard} ${COLORS.black}`}
              p="8px"
              position="relative"
            >
              <Box position="absolute" top="5px" right="5px" w="4px" h="4px" bg={kpi.color} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.06em"
                color={COLORS.industrialBlack}
              >
                {kpi.label}
              </Text>
              <Flex align="baseline" gap="3px" mt="3px">
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="18px"
                  color={kpi.color}
                  lineHeight={1}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {kpi.value}
                </Text>
                <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.6}>
                  {kpi.unit}
                </Text>
              </Flex>
            </Box>
          ))}
        </Box>

        {/* 吞吐趋势 — 黑红柱状构成 */}
        <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} p="8px" mt="8px">
          <Flex justify="space-between" align="baseline" mb="6px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.08em"
              color={COLORS.black}
            >
              吞吐趋势
            </Text>
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.5}>
              7D
            </Text>
          </Flex>
          <Flex gap="3px" align="flex-end" h="34px">
            {bars.map((h, i) => (
              <Box
                key={i}
                flex={1}
                h={`${h}%`}
                bg={i === 5 ? COLORS.red : COLORS.black}
                opacity={i === 5 ? 1 : 0.85}
              />
            ))}
          </Flex>
        </Box>

        {/* 系统状态条 */}
        <Flex bg={COLORS.black} mt="8px" px="8px" py="7px" justify="space-between" align="center">
          <Flex align="center" gap="6px">
            <Box w="5px" h="5px" bg={COLORS.statusGreen} />
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              color={COLORS.metalWhite}
              letterSpacing="0.1em"
            >
              系统运行正常
            </Text>
          </Flex>
          <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} letterSpacing="0.1em">
            LAT 8MS
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

/** 任务 — 状态列表行 */
function PageTasks() {
  const tasks = [
    { title: "模型推理服务", meta: "GPU×2 · 04:12", status: "running" as const, progress: 68 },
    { title: "数据清洗流水线", meta: "CPU×8 · 00:45", status: "done" as const, progress: 100 },
    { title: "夜间构建任务", meta: "CPU×4 · 排队", status: "queued" as const, progress: 0 },
    { title: "索引重建作业", meta: "IO×2 · 重试", status: "failed" as const, progress: 32 },
  ];

  const statusStyle = {
    running: { color: COLORS.red, label: "运行" },
    done: { color: COLORS.statusGreen, label: "完成" },
    queued: { color: COLORS.gold, label: "排队" },
    failed: { color: COLORS.red, label: "失败" },
  } as const;

  return (
    <Box>
      <PageHeader code="PG.02 / TASKS" title="任务" />
      <Box px="10px" pb="12px" display="grid" gap="8px">
        {tasks.map((task) => {
          const s = statusStyle[task.status];
          return (
            <Box
              key={task.title}
              bg={COLORS.pureWhite}
              border={`${BORDER.standard} ${COLORS.black}`}
              p="8px"
            >
              <Flex align="center" justify="space-between" gap="8px">
                <Flex align="center" gap="7px" minW={0}>
                  <Box
                    w="8px"
                    h="8px"
                    flexShrink={0}
                    bg={
                      task.status === "failed"
                        ? `repeating-linear-gradient(45deg, ${COLORS.red} 0px, ${COLORS.red} 2px, transparent 2px, transparent 4px)`
                        : s.color
                    }
                    border={task.status === "failed" ? `1px solid ${COLORS.red}` : undefined}
                  />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="11px"
                    letterSpacing="0.02em"
                    color={COLORS.black}
                    isTruncated
                  >
                    {task.title}
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  color={s.color}
                  letterSpacing="0.1em"
                  flexShrink={0}
                >
                  {s.label}
                </Text>
              </Flex>
              <Flex align="center" justify="space-between" mt="6px" gap="8px">
                <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.65}>
                  {task.meta}
                </Text>
                <Flex align="center" gap="6px" flexShrink={0}>
                  <Box w="44px" h="3px" bg={COLORS.metalWhite}>
                    <Box w={`${task.progress}%`} h="100%" bg={s.color} />
                  </Box>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    color={COLORS.black}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {task.progress}%
                  </Text>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/** 消息 — 未读 feed 卡片 */
function PageMessages() {
  const messages = [
    { from: "部署中心", time: "09:32", text: "前端构建 v2.4.1 已发布至生产环境", tag: "DEPLOY" },
    { from: "调度中心", time: "08:47", text: "GPU 配额已调整为 8 卡 / 节点", tag: "QUOTA" },
    { from: "监控告警", time: "昨日", text: "NODE-042 温度超过阈值 78°C", tag: "ALERT" },
  ];

  return (
    <Box>
      <PageHeader code="PG.03 / MSG" title="消息" />
      <Box px="10px" pb="12px" display="grid" gap="8px">
        {messages.map((msg) => (
          <Box
            key={msg.tag}
            bg={COLORS.pureWhite}
            border={`${BORDER.standard} ${COLORS.black}`}
            borderLeft={`3px solid ${COLORS.red}`}
            p="8px"
          >
            <Flex align="center" justify="space-between" gap="6px">
              <Flex align="center" gap="6px" minW={0}>
                <Box w="5px" h="5px" bg={COLORS.red} flexShrink={0} />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="11px"
                  letterSpacing="0.04em"
                  color={COLORS.black}
                >
                  {msg.from}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="7px"
                  color={COLORS.metalWhite}
                  bg={COLORS.black}
                  px="3px"
                  py="1px"
                  letterSpacing="0.1em"
                  flexShrink={0}
                >
                  {msg.tag}
                </Text>
              </Flex>
              <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.6} flexShrink={0}>
                {msg.time}
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.sans}
              fontSize="10px"
              color={COLORS.industrialBlack}
              lineHeight={1.6}
              mt="5px"
            >
              {msg.text}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** 我的 — 档案页 */
function PageProfile() {
  const stats = [
    { label: "任务", value: "128" },
    { label: "消息", value: "46" },
    { label: "积分", value: "9020" },
  ];
  const menus = [
    { label: "账号安全", code: "SEC" },
    { label: "通知设置", code: "NOT" },
    { label: "关于系统", code: "VER" },
  ];

  return (
    <Box>
      <PageHeader code="PG.04 / PROFILE" title="我的" />
      <Box px="10px" pb="12px" display="grid" gap="8px">
        {/* 档案块 */}
        <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} p="10px">
          <Flex align="center" gap="10px">
            <Flex
              w="40px"
              h="40px"
              bg={COLORS.red}
              border={`${BORDER.standard} ${COLORS.black}`}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="18px"
                color={COLORS.pureWhite}
              >
                张
              </Text>
            </Flex>
            <Box minW={0}>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="14px"
                letterSpacing="0.04em"
                color={COLORS.black}
              >
                张建设
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.industrialBlack}
                opacity={0.7}
                letterSpacing="0.08em"
                mt="3px"
              >
                ID OP-7F23 · 管理员
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* 数据行 */}
        <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} display="grid" gridTemplateColumns="1fr 1fr 1fr">
          {stats.map((stat, i) => (
            <Flex
              key={stat.label}
              direction="column"
              align="center"
              gap="3px"
              py="8px"
              borderLeft={i > 0 ? `1px solid ${COLORS.metalWhite}` : undefined}
            >
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="14px"
                color={i === 2 ? COLORS.red : COLORS.black}
                lineHeight={1}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {stat.value}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.1em"
                color={COLORS.industrialBlack}
              >
                {stat.label}
              </Text>
            </Flex>
          ))}
        </Box>

        {/* 设置行 */}
        <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`}>
          {menus.map((menu, i) => (
            <Flex
              key={menu.code}
              align="center"
              justify="space-between"
              px="10px"
              py="9px"
              borderBottom={i < menus.length - 1 ? `1px solid ${COLORS.metalWhite}` : undefined}
            >
              <Flex align="center" gap="8px">
                <Text fontFamily={FONT.mono} fontSize="7px" color={COLORS.red} letterSpacing="0.1em">
                  {menu.code}
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="11px"
                  letterSpacing="0.04em"
                  color={COLORS.black}
                >
                  {menu.label}
                </Text>
              </Flex>
              <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.black} opacity={0.5}>
                &#9656;
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/** 底部标签栏 — 黑底 + 几何图标 + 红色激活指示 */
function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <Flex h="52px" bg={COLORS.black} flexShrink={0}>
      {TABS.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <MBox
            key={tab.id}
            flex={1}
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="4px"
            cursor="pointer"
            userSelect="none"
            bg={isActive ? COLORS.industrialBlack : "transparent"}
            borderLeft={i > 0 ? `1px solid ${COLORS.metalWhite}14` : undefined}
            onClick={() => onChange(tab.id)}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: DURATION.instant }}
          >
            {isActive && (
              <MBox
                layoutId="mobile-tabbar-indicator"
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="3px"
                bg={COLORS.red}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
              />
            )}
            <Box position="relative" opacity={isActive ? 1 : 0.6}>
              <TabIcon shape={tab.icon} color={isActive ? COLORS.red : COLORS.metalWhite} />
              {tab.badge && (
                <Flex
                  position="absolute"
                  top="-5px"
                  right="-8px"
                  minW="13px"
                  h="13px"
                  px="2px"
                  bg={COLORS.red}
                  border={`1px solid ${COLORS.metalWhite}`}
                  align="center"
                  justify="center"
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    fontWeight={WEIGHT.black}
                    color={COLORS.pureWhite}
                    lineHeight={1}
                  >
                    {tab.badge}
                  </Text>
                </Flex>
              )}
            </Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={isActive ? WEIGHT.black : WEIGHT.regular}
              fontSize="9px"
              letterSpacing="0.08em"
              color={isActive ? COLORS.red: `${COLORS.metalWhite}8c`}
            >
              {tab.label}
            </Text>
          </MBox>
        );
      })}
    </Flex>
  );
}

export default function SceneMobileTabBar() {
  const [active, setActive] = useState<TabId>("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 切换标签后内容回顶
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return (
    <Box
      h="100%"
      bg={COLORS.concrete}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `radial-gradient(${COLORS.black}12 1px, transparent 1px)`,
        backgroundSize: "10px 10px",
      }}
    >
      {/* 图纸标注 */}
      <Text
        position="absolute"
        top="0"
        left="0"
        fontFamily={FONT.mono}
        fontSize="8px"
        color={COLORS.industrialBlack}
        opacity={0.45}
        letterSpacing="0.12em"
      >
        FIG.01-09
      </Text>
      <Text
        position="absolute"
        bottom="0"
        right="0"
        fontFamily={FONT.mono}
        fontSize="8px"
        color={COLORS.industrialBlack}
        opacity={0.45}
        letterSpacing="0.12em"
      >
        375×812 / TAB-BAR
      </Text>

      {/* 手机框架 — 零圆角 + 硬阴影 */}
      <Flex
        w="260px"
        maxW="90%"
        h="100%"
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.large}
        flexDirection="column"
        overflow="hidden"
        position="relative"
      >
        {/* 红色签名线 */}
        <Box h="3px" bg={COLORS.red} flexShrink={0} />

        {/* 状态条 — 等宽时间 + 信号 */}
        <Flex h="22px" bg={COLORS.black} align="center" justify="space-between" px="10px" flexShrink={0}>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="10px"
            color={COLORS.metalWhite}
            letterSpacing="0.06em"
          >
            09:41
          </Text>
          <Flex align="center" gap="6px">
            <Text
              fontFamily={FONT.mono}
              fontSize="7px"
              color={COLORS.metalWhite}
              opacity={0.6}
              letterSpacing="0.1em"
            >
              LTE
            </Text>
            <Flex align="flex-end" gap="2px">
              {[4, 6, 8, 10].map((h) => (
                <Box
                  key={h}
                  w="2px"
                  h={`${h}px`}
                  bg={h === 10 ? `${COLORS.metalWhite}4d` : COLORS.metalWhite}
                />
              ))}
            </Flex>
            <Box w="14px" h="8px" border={`1px solid ${COLORS.metalWhite}`} p="1px">
              <Box w="70%" h="100%" bg={COLORS.metalWhite} />
            </Box>
          </Flex>
        </Flex>

        {/* 内容区 — 可滚动 */}
        <Box ref={scrollRef} flex={1} overflowY="auto" bg={COLORS.concrete} sx={scrollbarSx}>
          <AnimatePresence mode="wait">
            <MBox
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: EASING.launch }}
            >
              {active === "home" && <PageHome />}
              {active === "tasks" && <PageTasks />}
              {active === "messages" && <PageMessages />}
              {active === "profile" && <PageProfile />}
            </MBox>
          </AnimatePresence>
        </Box>

        {/* 底部标签栏 */}
        <TabBar active={active} onChange={setActive} />
      </Flex>
    </Box>
  );
}
