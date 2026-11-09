import { Box, Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = {
  Box: motion(Box),
};

const BATCH_SIZE = 8;
const MAX_ITEMS = 60;
/** 模拟批次到达延迟（毫秒） */
const FETCH_DELAY = 650;

type Shape = "square" | "diamond" | "circle" | "triangle";

interface StreamEvent {
  seq: number;
  id: string;
  source: string;
  action: string;
  target: string;
  time: string;
  mark: { shape: Shape; color: string };
}

const SHAPES: Shape[] = ["square", "diamond", "circle", "triangle"];
const MARK_COLORS = [
  COLORS.red,
  COLORS.gold,
  COLORS.electricCyan,
  COLORS.velocityOrange,
  COLORS.signalGreen,
];

const SOURCES = [
  "调度器",
  "监控中心",
  "CI 流水线",
  "镜像服务",
  "备份系统",
  "运维机器人",
  "训练集群",
  "网络探针",
];

const ACTIONS = [
  "写入事件记录",
  "推送指标样本",
  "同步分片数据",
  "归档日志分段",
  "更新路由表",
  "校验数据块",
  "刷新缓存行",
  "上报心跳信号",
];

const TARGETS = [
  "ns/llm-serving",
  "node/gpu-agent-07",
  "pg/netbox",
  "harbor/nexus",
  "volcano/cpu-pool",
  "juicefs/workspace",
  "calico/bgp-peer",
  "rancher/cattle-agent",
];

/** 时间轴基准：首条事件 17:32:08，向前每条回退 47 秒 */
const BASE_SECONDS = 17 * 3600 + 32 * 60 + 8;

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600) % 24;
  const m = Math.floor(s / 60) % 60;
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

/** 确定性伪随机：同一 seq 永远生成同一条事件 */
function makeEvent(seq: number): StreamEvent {
  return {
    seq,
    id: `EV-${String(seq + 1).padStart(4, "0")}`,
    source: SOURCES[(seq * 3) % SOURCES.length],
    action: ACTIONS[(seq * 5) % ACTIONS.length],
    target: TARGETS[(seq * 7) % TARGETS.length],
    time: formatClock(BASE_SECONDS - seq * 47),
    mark: {
      shape: SHAPES[seq % SHAPES.length],
      color: MARK_COLORS[seq % MARK_COLORS.length],
    },
  };
}

function makeBatch(start: number, count: number): StreamEvent[] {
  return Array.from({ length: count }, (_, i) => makeEvent(start + i));
}

/** 几何标记 — 方 / 菱 / 圆 / 三角 */
function GeomMark({ mark }: { mark: StreamEvent["mark"] }) {
  return (
    <Flex
      w="22px"
      h="22px"
      align="center"
      justify="center"
      flexShrink={0}
      bg={COLORS.metalWhite}
      border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
    >
      {mark.shape === "square" && <Box w="10px" h="10px" bg={mark.color} />}
      {mark.shape === "diamond" && (
        <Box w="9px" h="9px" bg={mark.color} transform="rotate(45deg)" />
      )}
      {mark.shape === "circle" && (
        <Box w="10px" h="10px" bg={mark.color} borderRadius="50%" />
      )}
      {mark.shape === "triangle" && (
        <Box
          w="12px"
          h="10px"
          bg={mark.color}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
      )}
    </Flex>
  );
}

const batchVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.launch },
  },
};

function EventRow({ event }: { event: StreamEvent }) {
  return (
    <M.Box
      variants={rowVariants}
      px="12px"
      py="8px"
      bg={COLORS.pureWhite}
      borderBottom={`1px solid ${COLORS.black}24`}
      _hover={{ bg: COLORS.metalWhite }}
      sx={{ transition: `background-color ${DURATION.fast}s ease` }}
    >
      <Flex gap="10px" align="flex-start" flexWrap="wrap">
        <GeomMark mark={event.mark} />
        <Box flex="1 1 150px" minWidth={0}>
          {/* 行 1：等宽编号 + 时间戳 */}
          <Flex gap="8px" align="baseline" flexWrap="wrap" justify="space-between">
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.12em"
              color={COLORS.red}
              lineHeight={1.6}
              flexShrink={0}
            >
              {event.id}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.08em"
              color={COLORS.black}
              opacity={0.55}
              lineHeight={1.6}
              flexShrink={0}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {event.time}
            </Text>
          </Flex>
          {/* 行 2：事件描述 */}
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.regular}
            fontSize="10px"
            letterSpacing="0.01em"
            color={COLORS.industrialBlack}
            lineHeight={1.6}
            mt="1px"
            wordBreak="break-word"
          >
            {event.source} · {event.action} · {event.target}
          </Text>
        </Box>
      </Flex>
    </M.Box>
  );
}

/** 哨兵加载条 — 红底脉冲 + 扫描填充 */
function SentinelLoader({
  sentinelRef,
  loading,
  nextId,
}: {
  sentinelRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  nextId: string;
}) {
  return (
    <M.Box
      m="12px"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Flex
        ref={sentinelRef}
        bg={COLORS.red}
        borderLeft={`4px solid ${COLORS.redDark}`}
        align="center"
        gap="10px"
        px="12px"
        py="9px"
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="9px"
          letterSpacing="0.15em"
          color={COLORS.pureWhite}
          lineHeight={1.4}
          flexShrink={0}
        >
          加载中 // LOADING
        </Text>
        <Box
          flex={1}
          h="6px"
          bg={COLORS.redDark}
          position="relative"
          overflow="hidden"
          minWidth="40px"
        >
          <M.Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg={COLORS.pureWhite}
            style={{ transformOrigin: "left center" }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.pureWhite}
          opacity={loading ? 1 : 0.65}
          lineHeight={1.4}
          flexShrink={0}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {loading ? "SYNC" : "RDY"} {nextId}
        </Text>
      </Flex>
    </M.Box>
  );
}

/** 流终止标记 — 黑条 + 金色方块 */
function EndMarker({ total }: { total: number }) {
  return (
    <M.Box
      m="12px"
      bg={COLORS.black}
      borderLeft={`4px solid ${COLORS.gold}`}
      px="12px"
      py="10px"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
    >
      <Flex align="center" justify="center" gap="10px">
        <Box w="8px" h="8px" bg={COLORS.gold} flexShrink={0} />
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="9px"
          letterSpacing="0.2em"
          color={COLORS.metalWhite}
          lineHeight={1.4}
        >
          — END OF STREAM —
        </Text>
        <Box w="8px" h="8px" bg={COLORS.gold} flexShrink={0} />
      </Flex>
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.regular}
        fontSize="8px"
        letterSpacing="0.12em"
        color={COLORS.metalWhite}
        opacity={0.5}
        textAlign="center"
        mt="4px"
        lineHeight={1.6}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        数据流终止 · 共 {total} 条记录
      </Text>
    </M.Box>
  );
}

export default function SceneInfiniteScroll() {
  const [items, setItems] = useState<StreamEvent[]>(() => makeBatch(0, BATCH_SIZE));
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const doneRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const done = items.length >= MAX_ITEMS;

  const loadMore = useCallback(() => {
    if (loadingRef.current || doneRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setItems((prev) => {
        if (prev.length >= MAX_ITEMS) return prev;
        const add = Math.min(BATCH_SIZE, MAX_ITEMS - prev.length);
        const next = [...prev, ...makeBatch(prev.length, add)];
        if (next.length >= MAX_ITEMS) doneRef.current = true;
        return next;
      });
      loadingRef.current = false;
      setLoading(false);
    }, FETCH_DELAY);
  }, []);

  /* 哨兵 IO：进入滚动容器视野（提前 24px）即追加批次，流终止后立即拆除 */
  useEffect(() => {
    if (done) return;
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { root, rootMargin: "0px 0px 24px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, done]);

  /* 卸载时清理挂起的批次定时器 */
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const batches: StreamEvent[][] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }
  const progress = Math.round((items.length / MAX_ITEMS) * 100);
  const nextId = `EV-${String(Math.min(items.length + 1, MAX_ITEMS)).padStart(4, "0")}`;

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} overflow="hidden">
      {/* 头部仪表条：黑底 + 红色顶线 + 硬阴影 */}
      <Box
        bg={COLORS.black}
        flexShrink={0}
        position="relative"
        zIndex={1}
        boxShadow={SHADOW.medium}
      >
        <Box h="2px" bg={COLORS.red} />
        <Flex px="12px" py="8px" justify="space-between" align="center" gap="8px" flexWrap="wrap">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
            lineHeight={1.4}
          >
            无限数据流 // INFINITE SCROLL
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="9px"
            letterSpacing="0.1em"
            color={COLORS.redLight}
            lineHeight={1.4}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            已加载 {String(items.length).padStart(2, "0")} / {MAX_ITEMS} 条
          </Text>
        </Flex>
        {/* 载入进度条：红填充 / 暗底 */}
        <Box h="4px" bg={COLORS.industrialBlack}>
          <M.Box
            h="100%"
            bg={COLORS.red}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: DURATION.normal, ease: EASING.launch }}
          />
        </Box>
      </Box>

      {/* 可滚动事件流 */}
      <Box ref={scrollRef} flex={1} overflowY="auto" sx={{ scrollbarWidth: "thin" }}>
        <Box bg={COLORS.pureWhite}>
          {batches.map((batch) => (
            <M.Box key={batch[0].seq} variants={batchVariants} initial="hidden" animate="show">
              {batch.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </M.Box>
          ))}
        </Box>

        {done ? (
          <EndMarker total={items.length} />
        ) : (
          <SentinelLoader sentinelRef={sentinelRef} loading={loading} nextId={nextId} />
        )}
      </Box>
    </Flex>
  );
}
