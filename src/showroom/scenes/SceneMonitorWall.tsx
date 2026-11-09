import { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box), Text: motion(Text), Flex: motion(Flex) };

/* =========================================
 * Solari 分裂翻板数字（紧凑版，适配监控墙）
 * ========================================= */

function FlipDigit({ digit }: { digit: string }) {
  return (
    <Box
      w={{ base: "13px", md: "16px" }}
      h={{ base: "19px", md: "24px" }}
      bg={COLORS.industrialBlack}
      border={`1px solid ${COLORS.pureWhite}12`}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {/* 翻板铰链分割线 */}
      <Box position="absolute" top="50%" left="0" right="0" h="1px" bg={COLORS.black} zIndex={2} />
      {/* 上半阴影 */}
      <Box position="absolute" top="0" left="0" right="0" h="50%" bg={`${COLORS.black}4d`} />
      {/* 下半反射 */}
      <Box position="absolute" bottom="0" left="0" right="0" h="50%" bg={`${COLORS.pureWhite}05`} />
      <M.Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize={{ base: "10px", md: "13px" }}
        color={COLORS.metalWhite}
        lineHeight={1}
        position="relative"
        zIndex={1}
        initial={{ y: "35%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.fast, ease: EASING.sharp }}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {digit}
      </M.Text>
    </Box>
  );
}

function FlipValue({ value, color = COLORS.red }: { value: string; color?: string }) {
  return (
    <Flex gap="1px" flexShrink={0}>
      {value.split("").map((char, i) =>
        /[0-9]/.test(char) ? (
          <FlipDigit key={`${i}-${char}`} digit={char} />
        ) : (
          <Text
            key={`${i}-${char}`}
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize={{ base: "10px", md: "13px" }}
            color={color}
            opacity={0.75}
            lineHeight={1}
            w={{ base: "6px", md: "8px" }}
            textAlign="center"
            alignSelf="center"
            flexShrink={0}
          >
            {char}
          </Text>
        )
      )}
    </Flex>
  );
}

/* =========================================
 * 顶部红色扫描线 — 缓慢平移的机械扫描
 * ========================================= */

function Scanline() {
  return (
    <Box h="2px" w="100%" overflow="hidden" flexShrink={0}>
      <M.Box
        h="100%"
        w="200%"
        backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 4px, transparent 4px, transparent 8px)`}
        opacity={0.6}
        animate={{ x: ["0px", "8px"] }}
        transition={{ duration: DURATION.slow, repeat: Infinity, ease: "linear" }}
      />
    </Box>
  );
}

/* =========================================
 * 底部仪器色条
 * ========================================= */

function InstrumentStrip() {
  return (
    <Flex h="4px" w="100%" flexShrink={0}>
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
      <Box flex={2} bg={`${COLORS.pureWhite}14`} />
    </Flex>
  );
}

/* =========================================
 * 模拟遥测数据
 * ========================================= */

type KpiDef = {
  label: string;
  unit?: string;
  color: string;
  base: number;
  jitter: number;
  min: number;
  max: number;
  format: (v: number) => string;
};

const KPI_DEFS: KpiDef[] = [
  {
    label: "OPS/S",
    color: COLORS.electricCyan,
    base: 12847,
    jitter: 420,
    min: 9000,
    max: 16000,
    format: (v) => Math.round(v).toLocaleString("en-US"),
  },
  {
    label: "GPU 利用率",
    unit: "%",
    color: COLORS.velocityOrange,
    base: 87.3,
    jitter: 3.2,
    min: 41,
    max: 98,
    format: (v) => v.toFixed(1),
  },
  {
    label: "活跃节点",
    color: COLORS.gold,
    base: 347,
    jitter: 6,
    min: 300,
    max: 380,
    format: (v) => String(Math.round(v)),
  },
  {
    label: "队列深度",
    color: COLORS.metalWhite,
    base: 12,
    jitter: 5,
    min: 0,
    max: 48,
    format: (v) => String(Math.round(v)),
  },
  {
    label: "延迟",
    unit: "MS",
    color: COLORS.redLight,
    base: 18,
    jitter: 5,
    min: 4,
    max: 64,
    format: (v) => String(Math.round(v)),
  },
  {
    label: "错误率",
    unit: "%",
    color: COLORS.statusAmber,
    base: 0.42,
    jitter: 0.18,
    min: 0.01,
    max: 2.5,
    format: (v) => v.toFixed(2),
  },
];

const INITIAL_BARS = [46, 62, 38, 71, 55, 84, 67, 92, 58, 76, 63, 88];
const BAR_COUNT = 12;
const TICK_MS = 2000;

const barColor = (v: number) =>
  v >= 85 ? COLORS.red : v >= 70 ? COLORS.gold : COLORS.electricCyan;

type Sev = "CRIT" | "WARN" | "INFO" | "OK";

const SEV_COLOR: Record<Sev, string> = {
  CRIT: COLORS.statusRed,
  WARN: COLORS.statusAmber,
  INFO: COLORS.electricCyan,
  OK: COLORS.signalGreen,
};

const EVENT_POOL: { sev: Sev; text: string }[] = [
  { sev: "CRIT", text: "GPU-07 温度 87°C — 降频保护触发" },
  { sev: "WARN", text: "队列 gpu-pool 积压 > 12 作业" },
  { sev: "INFO", text: "节点 NODE-22 上线 // 8×A100 就绪" },
  { sev: "OK", text: "训练任务 QWEN-7B 完成 EPOCH 3/5" },
  { sev: "WARN", text: "存储 JUICEFS 延迟抖动 42MS" },
  { sev: "INFO", text: "推理服务 BBT-API 扩容 → 12 副本" },
  { sev: "OK", text: "快照任务 ETCD-BACKUP 执行完成" },
  { sev: "CRIT", text: "POD TRAINER-09F OOMKILLED — 重试 2/3" },
];

type WallEvent = { id: number; time: string; sev: Sev; text: string };

const pad = (n: number) => String(n).padStart(2, "0");
const formatClock = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

const makeEvent = (id: number, date: Date): WallEvent => {
  const tpl = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
  return { id, time: formatClock(date), sev: tpl.sev, text: tpl.text };
};

/* =========================================
 * 场景 — 作战室实时监控大屏（TV WALL）
 * ========================================= */

export default function SceneMonitorWall() {
  const [now, setNow] = useState(() => new Date());
  const [metrics, setMetrics] = useState<number[]>(() => KPI_DEFS.map((k) => k.base));
  const [bars, setBars] = useState<number[]>(INITIAL_BARS);
  const [events, setEvents] = useState<WallEvent[]>(() => {
    const t0 = new Date();
    return [0, 1, 2].map((i) => makeEvent(i, new Date(t0.getTime() - (i + 1) * 3000)));
  });
  const nextIdRef = useRef(3);

  /* 实时时钟 — 每秒 */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* 遥测数据 tick — 每 2S：KPI 抖动 / 柱状图滚动 / 事件流推送 */
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) =>
        prev.map((v, i) => {
          const def = KPI_DEFS[i];
          const next = v + (Math.random() - 0.5) * 2 * def.jitter;
          return Math.min(def.max, Math.max(def.min, next));
        })
      );
      setBars((prev) => [...prev.slice(1), Math.round(58 + Math.random() * 40)]);
      setEvents((prev) =>
        [makeEvent(nextIdRef.current++, new Date()), ...prev].slice(0, 3)
      );
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const peakOps = Math.round((Math.max(...bars) / 100) * 17280);

  return (
    <Box
      h="100%"
      bg={COLORS.black}
      display="flex"
      flexDirection="column"
      overflowY="auto"
    >
      <Scanline />

      {/* ===== 顶部状态栏 ===== */}
      <Flex
        h="38px"
        px="12px"
        align="center"
        justify="space-between"
        gap="12px"
        borderBottom={`1px solid ${COLORS.pureWhite}14`}
        flexShrink={0}
      >
        <Flex align="center" gap="10px" minW="0">
          <M.Box
            w="8px"
            h="8px"
            bg={COLORS.red}
            flexShrink={0}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "11px", md: "12px" }}
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
            whiteSpace="nowrap"
          >
            作战室 // OPS WALL
          </Text>
          <Text
            display={{ base: "none", lg: "block" }}
            fontFamily={FONT.mono}
            fontSize="9px"
            letterSpacing="0.1em"
            color={COLORS.metalWhite}
            opacity={0.35}
            whiteSpace="nowrap"
          >
            集群 BBT-01 // 遥测正常
          </Text>
        </Flex>
        <Flex align="center" gap={{ base: "8px", md: "12px" }}>
          <FlipValue value={formatClock(now)} color={COLORS.red} />
          <Flex
            align="center"
            gap="5px"
            border={`1px solid ${COLORS.signalGreen}8c`}
            px="5px"
            py="2px"
          >
            <M.Box
              w="5px"
              h="5px"
              bg={COLORS.signalGreen}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.14em"
              color={COLORS.signalGreen}
            >
              LIVE
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ===== KPI 翻板仪表带 ===== */}
      <Grid
        templateColumns={{ base: "repeat(3, 1fr)", xl: "repeat(6, 1fr)" }}
        gap="8px"
        px="10px"
        pt="10px"
        flexShrink={0}
      >
        {KPI_DEFS.map((def, i) => (
          <Box
            key={def.label}
            bg={COLORS.industrialBlack}
            border={`1px solid ${COLORS.pureWhite}14`}
            p={{ base: "6px", md: "8px" }}
            overflow="hidden"
          >
            <Flex justify="space-between" align="center" mb="5px">
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                fontWeight={WEIGHT.bold}
                letterSpacing="0.12em"
                textTransform="uppercase"
                color={COLORS.metalWhite}
                opacity={0.45}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {def.label}
              </Text>
              <Box w="4px" h="4px" bg={def.color} opacity={0.8} flexShrink={0} ml="4px" />
            </Flex>
            <Flex align="flex-end" gap="4px" overflow="hidden">
              <FlipValue value={def.format(metrics[i])} color={def.color} />
              {def.unit && (
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="8px"
                  letterSpacing="0.08em"
                  color={def.color}
                  opacity={0.6}
                  mb={{ base: "3px", md: "4px" }}
                  flexShrink={0}
                >
                  {def.unit}
                </Text>
              )}
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* ===== 中部：吞吐柱状图 + 事件流 ===== */}
      <Grid
        templateColumns={{ base: "1fr", md: "3fr 2fr" }}
        gap="8px"
        px="10px"
        pt="8px"
        pb="10px"
        flex={{ base: "none", md: "1" }}
        minH="0"
      >
        {/* 柱状图面板 */}
        <Box
          bg={`${COLORS.pureWhite}05`}
          border={`1px solid ${COLORS.pureWhite}14`}
          p={{ base: "8px", md: "10px" }}
          display="flex"
          flexDirection="column"
          h={{ base: "150px", md: "100%" }}
          minW="0"
        >
          <Flex justify="space-between" align="center" mb="8px" flexShrink={0}>
            <Flex align="center" gap="6px">
              <Box w="4px" h="4px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "10px", md: "11px" }}
                letterSpacing="0.1em"
                color={COLORS.metalWhite}
              >
                吞吐量 // OPS/S
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.metalWhite}
              opacity={0.45}
              whiteSpace="nowrap"
            >
              窗口 12×2S // 峰值 {peakOps.toLocaleString("en-US")}
            </Text>
          </Flex>

          <Box flex="1" minH="0" position="relative" overflow="hidden">
            {[25, 50, 75].map((p) => (
              <Box
                key={p}
                position="absolute"
                left="0"
                right="0"
                bottom={`${p}%`}
                h="1px"
                bg={`${COLORS.pureWhite}0d`}
              />
            ))}
            <Flex h="100%" align="flex-end" gap={{ base: "3px", md: "5px" }}>
              {bars.map((v, i) => (
                <M.Box
                  key={i}
                  flex={1}
                  initial={false}
                  animate={{ height: `${v}%` }}
                  transition={{ duration: DURATION.slow, ease: EASING.launch }}
                  bg={barColor(v)}
                  _hover={{ opacity: 0.8 }}
                />
              ))}
            </Flex>
          </Box>
          <Flex gap={{ base: "3px", md: "5px" }} mt="4px" flexShrink={0}>
            {bars.map((_, i) => {
              const isNow = i === BAR_COUNT - 1;
              return (
                <Text
                  key={i}
                  flex={1}
                  textAlign="center"
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  color={isNow ? COLORS.red : COLORS.metalWhite}
                  opacity={isNow ? 1 : 0.35}
                >
                  {isNow ? "NOW" : `-${(BAR_COUNT - 1 - i) * 2}S`}
                </Text>
              );
            })}
          </Flex>
        </Box>

        {/* 事件流面板 */}
        <Box
          bg={`${COLORS.pureWhite}05`}
          border={`1px solid ${COLORS.pureWhite}14`}
          p={{ base: "8px", md: "10px" }}
          display="flex"
          flexDirection="column"
          minW="0"
        >
          <Flex justify="space-between" align="center" mb="4px" flexShrink={0}>
            <Flex align="center" gap="6px">
              <M.Box
                w="4px"
                h="4px"
                bg={COLORS.red}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "10px", md: "11px" }}
                letterSpacing="0.1em"
                color={COLORS.metalWhite}
              >
                事件流 // EVENT FEED
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.metalWhite}
              opacity={0.45}
            >
              最新 3 条
            </Text>
          </Flex>

          {events.map((e) => (
            <M.Flex
              key={e.id}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, ease: EASING.launch }}
              align="center"
              gap="8px"
              py="7px"
              borderBottom={`1px solid ${COLORS.pureWhite}0f`}
              _last={{ borderBottom: "none" }}
              minW="0"
            >
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                color={COLORS.metalWhite}
                opacity={0.45}
                flexShrink={0}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {e.time}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.08em"
                color={SEV_COLOR[e.sev]}
                border={`1px solid ${SEV_COLOR[e.sev]}`}
                px="4px"
                py="1px"
                flexShrink={0}
              >
                {e.sev}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {e.text}
              </Text>
            </M.Flex>
          ))}
        </Box>
      </Grid>

      <InstrumentStrip />
    </Box>
  );
}
