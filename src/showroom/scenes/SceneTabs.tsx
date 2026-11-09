import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const MBox = motion(Box);

const TABS = [
  { id: "overview", label: "概览", code: "OVERVIEW" },
  { id: "logs", label: "日志", code: "LOGS" },
  { id: "settings", label: "设置", code: "CONFIG" },
] as const;

const KPIS = [
  { label: "节点在线", value: "347", unit: "台", delta: "+12", deltaColor: COLORS.statusGreen, accent: COLORS.red },
  { label: "吞吐量", value: "94.2", unit: "GB/分", delta: "+3.1%", deltaColor: COLORS.statusGreen, accent: COLORS.gold },
  { label: "平均延迟", value: "8", unit: "MS", delta: "-2MS", deltaColor: COLORS.electricCyan, accent: COLORS.electricCyan },
  { label: "健康度", value: "99.97", unit: "%", delta: "SLA", deltaColor: COLORS.statusGreen, accent: COLORS.signalGreen },
];

const BARS = [
  { label: "CPU", value: 78, color: COLORS.red },
  { label: "内存", value: 64, color: COLORS.gold },
  { label: "存储", value: 87, color: COLORS.velocityOrange },
];

type LogLevel = "INFO" | "DEBUG" | "WARN" | "ERROR";

const LOG_COLOR: Record<LogLevel, string> = {
  INFO: COLORS.statusGreen,
  DEBUG: COLORS.electricCyan,
  WARN: COLORS.statusAmber,
  ERROR: COLORS.statusRed,
};

const LOGS: { time: string; level: LogLevel; message: string }[] = [
  { time: "14:32:07", level: "INFO", message: "调度器心跳正常 · 347 节点在线" },
  { time: "14:32:11", level: "DEBUG", message: "队列 gpu-pool 重平衡完成 (3.2s)" },
  { time: "14:32:18", level: "WARN", message: "node-114 磁盘使用率 87%，接近阈值" },
  { time: "14:32:24", level: "INFO", message: "任务 j-8812 副本扩展至 4" },
  { time: "14:32:31", level: "ERROR", message: "GPU-07 ECC 校验错误 · 已隔离" },
  { time: "14:32:40", level: "INFO", message: "告警通道 webhook 已恢复" },
  { time: "14:33:02", level: "DEBUG", message: "缓存命中率 96.2% · 命中 1.2M" },
  { time: "14:33:15", level: "INFO", message: "SLURM 作业 4021 进入运行队列" },
  { time: "14:33:27", level: "WARN", message: "InfiniBand 链路抖动 12ms" },
  { time: "14:33:38", level: "INFO", message: "集群健康检查通过 · 全部就绪" },
];

/** 面板标题 — 红色方块 + 黑体标题 + 金色编号 */
function PanelHeader({ title, tag }: { title: string; tag: string }) {
  return (
    <Flex align="center" gap="8px" flexShrink={0}>
      <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="12px"
        letterSpacing="0.08em"
        color={COLORS.black}
      >
        {title}
      </Text>
      <Box flex={1} h="2px" bg={COLORS.black} opacity={0.08} />
      <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} letterSpacing="0.08em" flexShrink={0}>
        {tag}
      </Text>
    </Flex>
  );
}

/** 表单字段标签 */
function FieldLabel({ label, code }: { label: string; code: string }) {
  return (
    <Box w="88px" flexShrink={0} pb="2px">
      <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="11px" color={COLORS.black} letterSpacing="0.04em">
        {label}
      </Text>
      <Text fontFamily={FONT.mono} fontSize="7px" color={COLORS.industrialBlack} opacity={0.6} letterSpacing="0.08em">
        {code}
      </Text>
    </Box>
  );
}

/** 概览面板 — KPI 迷你卡 + 容量条 + 状态保持计数器 */
function OverviewPanel({
  counter,
  onIncrement,
  onDecrement,
}: {
  counter: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <Box flex={1} overflowY="auto" p="12px" position="relative">
      {/* 几何装饰 — 金色旋转方块 + 金色对角线 */}
      <Box
        position="absolute"
        top="14px"
        right="18px"
        w="30px"
        h="30px"
        border={`${BORDER.standard} ${COLORS.gold}`}
        transform="rotate(45deg)"
        opacity={0.3}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="34px"
        right="14px"
        w="72px"
        h="2px"
        bg={COLORS.gold}
        transform="rotate(-28deg)"
        transformOrigin="right center"
        opacity={0.45}
        pointerEvents="none"
      />

      <PanelHeader title="集群概览" tag="TAB 01/03" />

      {/* KPI 迷你卡 */}
      <Grid templateColumns="repeat(auto-fit, minmax(92px, 1fr))" gap="8px" mt="10px">
        {KPIS.map((k, i) => (
          <MBox
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, delay: 0.05 * i, ease: EASING.launch }}
          >
            <Box
              position="relative"
              bg={COLORS.pureWhite}
              border={`${BORDER.standard} ${COLORS.black}`}
              boxShadow={SHADOW.small}
              p="8px"
              overflow="hidden"
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.medium }}
            >
              <Box position="absolute" top={0} left={0} w="14px" h="14px" bg={k.accent} />
              <Text
                ml="18px"
                fontFamily={FONT.mono}
                fontSize="7.5px"
                letterSpacing="0.1em"
                color={COLORS.industrialBlack}
                opacity={0.7}
              >
                {k.label}
              </Text>
              <Flex ml="18px" align="baseline" gap="3px" mt="1px">
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="15px"
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {k.value}
                </Text>
                <Text fontFamily={FONT.mono} fontSize="7.5px" color={k.accent}>
                  {k.unit}
                </Text>
              </Flex>
              <Text ml="18px" fontFamily={FONT.mono} fontSize="7.5px" color={k.deltaColor} mt="1px">
                {k.delta}
              </Text>
            </Box>
          </MBox>
        ))}
      </Grid>

      {/* 资源容量条 */}
      <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} boxShadow={SHADOW.small} p="10px" mt="10px">
        <Flex justify="space-between" align="baseline" mb="8px">
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="10px" letterSpacing="0.08em" color={COLORS.black}>
            资源容量
          </Text>
          <Text fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.gold} letterSpacing="0.08em">
            CAPACITY
          </Text>
        </Flex>
        <VStack align="stretch" gap="6px">
          {BARS.map((b) => (
            <Flex key={b.label} align="center" gap="8px">
              <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} w="32px" flexShrink={0}>
                {b.label}
              </Text>
              <Box flex={1} h="8px" bg={COLORS.black} position="relative" overflow="hidden">
                <Box position="absolute" top={0} bottom={0} left={0} w={`${b.value}%`} bg={b.color} />
              </Box>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                fontWeight={WEIGHT.bold}
                color={COLORS.black}
                w="28px"
                textAlign="right"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {b.value}%
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* 状态保持计数器 + 说明 */}
      <Grid templateColumns={{ base: "1fr", sm: "1.15fr 1fr" }} gap="8px" mt="10px">
        <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.small} p="10px">
          <Flex justify="space-between" align="baseline" mb="8px">
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="10px" letterSpacing="0.08em" color={COLORS.black}>
              状态计数器
            </Text>
            <Text fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.red} letterSpacing="0.08em">
              COUNTER
            </Text>
          </Flex>
          <Flex align="center" gap="8px">
            <Box
              w="26px"
              h="26px"
              bg={COLORS.black}
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              flexShrink={0}
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ bg: COLORS.industrialBlack }}
              onClick={onDecrement}
            >
              <Text fontFamily={FONT.mono} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.pureWhite} lineHeight={1}>
                &minus;
              </Text>
            </Box>
            <Box flex={1} h="26px" border={`${BORDER.standard} ${COLORS.black}`} bg={COLORS.concrete} display="flex" alignItems="center" justifyContent="center">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="14px"
                color={counter > 0 ? COLORS.red : COLORS.black}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(counter).padStart(3, "0")}
              </Text>
            </Box>
            <Box
              w="26px"
              h="26px"
              bg={COLORS.red}
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              flexShrink={0}
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ bg: COLORS.redLight }}
              onClick={onIncrement}
            >
              <Text fontFamily={FONT.mono} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.pureWhite} lineHeight={1}>
                +
              </Text>
            </Box>
          </Flex>
          <Text fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.industrialBlack} opacity={0.65} mt="6px">
            切换标签后数值保持不变
          </Text>
        </Box>

        <Box bg={COLORS.black} p="10px" position="relative" overflow="hidden">
          <Box position="absolute" top={0} left={0} bottom={0} w="3px" bg={COLORS.gold} />
          <Text fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.gold} letterSpacing="0.12em" mb="4px">
            NOTE
          </Text>
          <Text fontFamily={FONT.mono} fontSize="8.5px" color={COLORS.metalWhite} lineHeight={1.7}>
            三个面板常驻挂载，切换仅做显隐位移——计数器、开关、输入与日志滚动位置全部保持。
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

/** 日志面板 — 黑底等宽日志行，状态色分级，滚动位置保持 */
function LogsPanel() {
  return (
    <Box flex={1} display="flex" flexDirection="column" p="12px" overflow="hidden">
      {/* 扫描线 */}
      <Box
        h="2px"
        flexShrink={0}
        mb="10px"
        backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 8px, transparent 8px, transparent 16px)`}
        opacity={0.6}
      />
      <Flex align="center" gap="8px" flexShrink={0} mb="8px">
        <MBox
          w="8px"
          h="8px"
          bg={COLORS.signalGreen}
          flexShrink={0}
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" letterSpacing="0.08em" color={COLORS.pureWhite}>
          系统日志
        </Text>
        <Box flex={1} h="2px" bg={`${COLORS.pureWhite}1a`} />
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} letterSpacing="0.08em">
          TAIL -F · 10 行
        </Text>
      </Flex>

      <VStack flex={1} overflowY="auto" align="stretch" gap={0} pr="4px">
        {LOGS.map((l, i) => (
          <MBox
            key={`${l.time}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.fast, delay: 0.04 * i, ease: EASING.launch }}
            display="flex"
            gap="8px"
            alignItems="baseline"
            py="2px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="9.5px"
              color={COLORS.metalWhite}
              opacity={0.35}
              w="52px"
              flexShrink={0}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {l.time}
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9.5px" fontWeight={WEIGHT.black} color={LOG_COLOR[l.level]} w="42px" flexShrink={0}>
              {l.level}
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9.5px" color={COLORS.metalWhite} flex={1}>
              {l.message}
            </Text>
          </MBox>
        ))}
      </VStack>

      <Flex mt="8px" pt="6px" borderTop={`1px solid ${COLORS.pureWhite}1f`} align="center" gap="8px" flexShrink={0}>
        <Box w="4px" h="4px" bg={COLORS.red} />
        <Text fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.electricCyan} letterSpacing="0.08em">
          滚动位置同样保持 // SCROLL PERSISTENT
        </Text>
      </Flex>
    </Box>
  );
}

/** 设置面板 — 表单行（输入 / 选择 / 开关），状态全部保持 */
function SettingsPanel({
  clusterName,
  onClusterNameChange,
  env,
  onEnvChange,
  alerts,
  onAlertsChange,
  telemetry,
  onTelemetryChange,
  saved,
  onSave,
}: {
  clusterName: string;
  onClusterNameChange: (v: string) => void;
  env: string;
  onEnvChange: (v: string) => void;
  alerts: boolean;
  onAlertsChange: () => void;
  telemetry: boolean;
  onTelemetryChange: () => void;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <Box flex={1} overflowY="auto" p="12px" position="relative">
      {/* 几何装饰 — 金色旋转方块 */}
      <Box
        position="absolute"
        top="14px"
        right="18px"
        w="10px"
        h="10px"
        bg={COLORS.gold}
        transform="rotate(45deg)"
        opacity={0.6}
        pointerEvents="none"
      />

      <PanelHeader title="集群设置" tag="TAB 03/03" />

      <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.medium} mt="10px" position="relative" overflow="hidden">
        {/* 红色对角线装饰 */}
        <Box
          position="absolute"
          top={0}
          right="28px"
          w="2px"
          h="52px"
          bg={COLORS.red}
          transform="rotate(-18deg)"
          transformOrigin="top"
          opacity={0.25}
          pointerEvents="none"
        />

        <Box p="12px">
          <VStack align="stretch" gap="12px">
            {/* 集群名称输入 */}
            <Flex gap="10px" flexWrap="wrap" align="flex-end">
              <FieldLabel label="集群名称" code="CLUSTER.NAME" />
              <Box flex="1" minW="150px" bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} px="10px" py="6px">
                <Box
                  as="input"
                  value={clusterName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onClusterNameChange(e.target.value)}
                  w="100%"
                  border="none"
                  outline="none"
                  bg="transparent"
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.black}
                  letterSpacing="0.02em"
                  placeholder="输入集群名称"
                  _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
                />
              </Box>
            </Flex>

            {/* 运行环境选择 */}
            <Flex gap="10px" flexWrap="wrap" align="flex-end">
              <FieldLabel label="运行环境" code="ENVIRONMENT" />
              <Box position="relative" flex="1" minW="150px">
                <Box
                  as="select"
                  value={env}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onEnvChange(e.target.value)}
                  w="100%"
                  bg={COLORS.pureWhite}
                  border={`${BORDER.standard} ${COLORS.black}`}
                  px="10px"
                  py="6px"
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.black}
                  appearance="none"
                  cursor="pointer"
                  outline="none"
                >
                  <option value="dev">开发环境 (DEV)</option>
                  <option value="staging">预发环境 (STAGING)</option>
                  <option value="prod">生产环境 (PROD)</option>
                </Box>
                <Text
                  position="absolute"
                  right="10px"
                  top="50%"
                  transform="translateY(-50%)"
                  fontFamily={FONT.mono}
                  fontSize="10px"
                  color={COLORS.red}
                  pointerEvents="none"
                >
                  &#9660;
                </Text>
              </Box>
            </Flex>

            {/* 开关行 */}
            <Box borderTop={`${BORDER.hairline} ${COLORS.industrialBlack}`} pt="10px">
              <ToggleRow label="告警通知" sub="ALERT.NOTIFY" active={alerts} onChange={onAlertsChange} />
            </Box>
            <Box borderTop={`${BORDER.hairline} ${COLORS.industrialBlack}`} pt="10px">
              <ToggleRow label="性能遥测" sub="TELEMETRY" active={telemetry} onChange={onTelemetryChange} />
            </Box>
          </VStack>
        </Box>

        {/* 保存栏 */}
        <Flex
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap="8px"
          bg={COLORS.concrete}
          borderTop={`${BORDER.standard} ${COLORS.black}`}
          px="12px"
          py="8px"
        >
          <Box minH="14px" minW="120px">
            <AnimatePresence>
              {saved && (
                <MBox
                  key="saved"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.fast, ease: EASING.launch }}
                >
                  <Text fontFamily={FONT.mono} fontSize="8.5px" color={COLORS.signalGreen} letterSpacing="0.06em">
                    &#10003; 配置已写入 · 状态保持
                  </Text>
                </MBox>
              )}
            </AnimatePresence>
          </Box>
          <Box
            bg={COLORS.red}
            border={`${BORDER.standard} ${COLORS.redDark}`}
            px="14px"
            py="6px"
            cursor="pointer"
            boxShadow={SHADOW.small}
            transition={`all ${DURATION.fast}s ease`}
            _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.medium }}
            onClick={onSave}
          >
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="10px" color={COLORS.pureWhite} letterSpacing="0.08em" textTransform="uppercase">
              保存设置
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

/** 开关行 — 红色滑块开关 */
function ToggleRow({
  label,
  sub,
  active,
  onChange,
}: {
  label: string;
  sub: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <Flex align="center" justify="space-between" gap="12px" cursor="pointer" onClick={onChange} userSelect="none">
      <Box>
        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="11px" color={COLORS.black} letterSpacing="0.04em">
          {label}
        </Text>
        <Text fontFamily={FONT.mono} fontSize="7px" color={COLORS.industrialBlack} opacity={0.6} letterSpacing="0.08em">
          {sub}
        </Text>
      </Box>
      <Box
        w="40px"
        h="20px"
        bg={active ? COLORS.red : COLORS.metalWhite}
        border={`${BORDER.standard} ${COLORS.black}`}
        position="relative"
        flexShrink={0}
        transition={`background ${DURATION.fast}s ease`}
      >
        <Box
          position="absolute"
          top="2px"
          left={active ? "22px" : "2px"}
          w="12px"
          h="12px"
          bg={COLORS.pureWhite}
          border={`${BORDER.hairline} ${COLORS.black}`}
          transition={`left ${DURATION.fast}s ease`}
        />
      </Box>
    </Flex>
  );
}

export default function SceneTabs() {
  const [tab, setTab] = useState(0);

  // 状态保持——所有面板常驻挂载，切换仅做显隐，以下状态在切换后全部保留
  const [counter, setCounter] = useState(0);
  const [clusterName, setClusterName] = useState("bbt-prod-01");
  const [env, setEnv] = useState("prod");
  const [alerts, setAlerts] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete} overflow="hidden">
      {/* 仪器色条 */}
      <Flex h="3px" flexShrink={0}>
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>

      {/* 标签栏 — 重黑底边，激活态红底白字 + 红色指示缺口 */}
      <Flex
        role="tablist"
        borderBottom={`${BORDER.heavy} ${COLORS.black}`}
        flexWrap="wrap"
        alignItems="stretch"
        bg={COLORS.concrete}
        flexShrink={0}
      >
        {TABS.map((t, i) => {
          const active = i === tab;
          return (
            <Box
              key={t.id}
              role="tab"
              aria-selected={active}
              flex="1 1 auto"
              minW="72px"
              position="relative"
              px="12px"
              py="10px"
              cursor="pointer"
              userSelect="none"
              bg={active ? COLORS.red : COLORS.pureWhite}
              borderRight={i < TABS.length - 1 ? `${BORDER.standard} ${COLORS.black}` : "none"}
              transition={`background ${DURATION.fast}s ease`}
              _hover={active ? undefined : { bg: COLORS.metalWhite }}
              onClick={() => setTab(i)}
            >
              <Flex align="center" justify="center" gap="7px">
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="9px"
                  color={active ? COLORS.gold : COLORS.red}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="11px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={active ? COLORS.pureWhite : COLORS.black}
                >
                  {t.label}
                </Text>
                <Text
                  display={{ base: "none", sm: "inline" }}
                  fontFamily={FONT.mono}
                  fontSize="7.5px"
                  letterSpacing="0.08em"
                  color={active ? `${COLORS.pureWhite}8c` : COLORS.industrialBlack}
                  opacity={active ? 1 : 0.55}
                >
                  {t.code}
                </Text>
              </Flex>
              {/* 红色指示缺口 — 旋转方块刺入面板区 */}
              {active && (
                <Box
                  position="absolute"
                  bottom="-8px"
                  left="50%"
                  w="12px"
                  h="12px"
                  bg={COLORS.red}
                  transform="translateX(-50%) rotate(45deg)"
                  zIndex={2}
                  pointerEvents="none"
                />
              )}
            </Box>
          );
        })}
      </Flex>

      {/* 面板区 — 常驻挂载，切换做 fade/slide 位移 */}
      <Box flex={1} position="relative" overflow="hidden">
        {TABS.map((t, i) => {
          const active = i === tab;
          return (
            <MBox
              key={t.id}
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                x: active ? 0 : i < tab ? -32 : 32,
              }}
              transition={{ duration: DURATION.normal, ease: EASING.launch }}
              pointerEvents={active ? "auto" : "none"}
              display="flex"
              flexDirection="column"
              overflow="hidden"
              bg={t.id === "logs" ? COLORS.black : COLORS.concrete}
            >
              {t.id === "overview" && (
                <OverviewPanel
                  counter={counter}
                  onIncrement={() => setCounter((c) => c + 1)}
                  onDecrement={() => setCounter((c) => Math.max(0, c - 1))}
                />
              )}
              {t.id === "logs" && <LogsPanel />}
              {t.id === "settings" && (
                <SettingsPanel
                  clusterName={clusterName}
                  onClusterNameChange={setClusterName}
                  env={env}
                  onEnvChange={setEnv}
                  alerts={alerts}
                  onAlertsChange={() => setAlerts((a) => !a)}
                  telemetry={telemetry}
                  onTelemetryChange={() => setTelemetry((v) => !v)}
                  saved={saved}
                  onSave={save}
                />
              )}
            </MBox>
          );
        })}
      </Box>

      {/* 状态读出条 — 实时显示各面板保持的状态 */}
      <Flex bg={COLORS.black} align="center" gap="10px" px="10px" py="6px" flexShrink={0} flexWrap="wrap">
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} letterSpacing="0.12em" flexShrink={0}>
          状态保持
        </Text>
        <Box w="2px" h="10px" bg={COLORS.red} flexShrink={0} />
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.55} flexShrink={0}>
          计数器
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="8.5px"
          fontWeight={WEIGHT.black}
          color={COLORS.pureWhite}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(counter).padStart(3, "0")}
        </Text>
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.55} flexShrink={0}>
          告警
        </Text>
        <Text fontFamily={FONT.mono} fontSize="8.5px" fontWeight={WEIGHT.black} color={alerts ? COLORS.signalGreen : COLORS.metalWhite} opacity={alerts ? 1 : 0.35}>
          {alerts ? "开" : "关"}
        </Text>
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.55} flexShrink={0}>
          遥测
        </Text>
        <Text fontFamily={FONT.mono} fontSize="8.5px" fontWeight={WEIGHT.black} color={telemetry ? COLORS.signalGreen : COLORS.metalWhite} opacity={telemetry ? 1 : 0.35}>
          {telemetry ? "开" : "关"}
        </Text>
        <Text ml="auto" fontFamily={FONT.mono} fontSize="7.5px" color={COLORS.signalGreen} letterSpacing="0.1em" flexShrink={0}>
          KEEP-ALIVE // 面板常驻
        </Text>
      </Flex>
    </Box>
  );
}
