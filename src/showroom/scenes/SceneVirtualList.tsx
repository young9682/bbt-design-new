import { Box, Flex, Text } from "@chakra-ui/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { COLORS, FONT, WEIGHT, SHADOW, DURATION } from "../../Theme";

/* ============================================================
   虚拟滚动长列表 — 手写窗口化（无第三方库）
   仅渲染可视窗口 + overscan，绝对定位行 + 总高度占位
   ============================================================ */

const TOTAL = 10_000;
const ROW_H = 36;
const OVERSCAN = 6;
/** 里程行间隔：每 1000 条一道金色刻线 */
const MILESTONE = 1_000;
const RAIL_THUMB_H = 24;

const CATEGORIES = [
  { key: "STR", label: "结构", color: COLORS.red },
  { key: "SIG", label: "信号", color: COLORS.electricCyan },
  { key: "PWR", label: "动力", color: COLORS.gold },
] as const;

const UNITS = [
  "轴承阵列",
  "液压泵组",
  "整流机柜",
  "张紧机构",
  "传感节点",
  "配电母线",
  "伺服电机",
  "冷却栅格",
];

const SECTORS = ["ALPHA", "BRAVO", "CYGNE", "DELTA", "EPOCH", "FARGO", "GYRE", "HELIO"];

interface VirtualRow {
  index: number;
  id: string;
  cat: (typeof CATEGORIES)[number];
  name: string;
  value: string;
  delta: number;
}

/** 确定性散列：同一序号永远生成同一条记录 */
function hashIndex(n: number): number {
  let x = Math.imul(n + 1, 2654435761);
  x = Math.imul(x ^ (x >>> 13), 1597334677);
  return (x ^ (x >>> 16)) >>> 0;
}

function makeRow(index: number): VirtualRow {
  const h = hashIndex(index);
  return {
    index,
    id: `ITEM-${String(index + 1).padStart(5, "0")}`,
    cat: CATEGORIES[h % CATEGORIES.length],
    name: `${UNITS[(h >>> 4) % UNITS.length]} · ${SECTORS[(h >>> 9) % SECTORS.length]}-${((h >>> 14) % 89) + 10}`,
    value: ((h % 997) / 10).toFixed(1),
    delta: ((h >>> 7) % 21) - 10,
  };
}

function formatNum(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** 单行 — 绝对定位，仅由可视窗口挂载 */
function Row({ row }: { row: VirtualRow }) {
  const milestone = (row.index + 1) % MILESTONE === 0;
  return (
    <Flex
      position="absolute"
      top={`${row.index * ROW_H}px`}
      left="0"
      right="0"
      h={`${ROW_H}px`}
      align="center"
      gap="10px"
      px="12px"
      bg={row.index % 2 === 0 ? COLORS.pureWhite : COLORS.concrete}
      borderBottom={milestone ? `2px solid ${COLORS.gold}`: `1px solid ${COLORS.black}24`}
      _hover={{ bg: COLORS.metalWhite }}
      sx={{ transition: `background-color ${DURATION.instant}s ease` }}
    >
      {/* 里程刻线 — 每 1000 条一道金色竖标 */}
      {milestone && (
        <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg={COLORS.gold} />
      )}

      {/* 索引 — 等宽数字 */}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="10px"
        letterSpacing="0.08em"
        color={milestone ? COLORS.gold : COLORS.black}
        opacity={milestone ? 1 : 0.55}
        w="46px"
        flexShrink={0}
        lineHeight={1}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {String(row.index + 1).padStart(5, "0")}
      </Text>

      {/* 类别几何标记 — 红/金/青方块 */}
      <Box w="8px" h="8px" bg={row.cat.color} flexShrink={0} />

      {/* 等宽编号 */}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="9px"
        letterSpacing="0.1em"
        color={COLORS.red}
        display={{ base: "none", md: "block" }}
        flexShrink={0}
        lineHeight={1}
      >
        {row.id}
      </Text>

      {/* 名称 — 窄屏优雅截断 */}
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.regular}
        fontSize="11px"
        letterSpacing="0.01em"
        color={COLORS.industrialBlack}
        flex={1}
        minWidth={0}
        isTruncated
        lineHeight={1}
      >
        {row.cat.label} / {row.name}
      </Text>

      {/* 数值 */}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="10px"
        letterSpacing="0.06em"
        color={COLORS.black}
        flexShrink={0}
        lineHeight={1}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {row.value}%
      </Text>

      {/* 涨落 */}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="9px"
        letterSpacing="0.04em"
        color={row.delta >= 0 ? COLORS.signalGreen : COLORS.red}
        display={{ base: "none", md: "block" }}
        w="34px"
        textAlign="right"
        flexShrink={0}
        lineHeight={1}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {row.delta >= 0 ? "▲" : "▼"}
        {Math.abs(row.delta)}
      </Text>
    </Flex>
  );
}

export default function SceneVirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /* 视口高度测量（含响应式变化） */
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setViewportH(el.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  /* 快滚轨道：点击/拖拽即跳转 scrollTop */
  const seekToPointerY = useCallback((clientY: number) => {
    const rail = railRef.current;
    const scroller = scrollRef.current;
    if (!rail || !scroller) return;
    const rect = rail.getBoundingClientRect();
    if (rect.height <= 0) return;
    const frac = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const maxScroll = TOTAL * ROW_H - scroller.clientHeight;
    scroller.scrollTop = frac * maxScroll;
  }, []);

  /* 窗口计算 */
  const totalH = TOTAL * ROW_H;
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const end = Math.min(TOTAL, Math.ceil((scrollTop + viewportH) / ROW_H) + OVERSCAN);
  const visible = Math.min(TOTAL, Math.ceil(viewportH / ROW_H));
  const rendered = end - start;
  const maxScroll = Math.max(1, totalH - viewportH);
  const progress = Math.min(1, scrollTop / maxScroll);

  const rows: VirtualRow[] = [];
  for (let i = start; i < end; i++) rows.push(makeRow(i));

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} overflow="hidden">
      {/* 头部仪表条 — 黑底 + 红色顶线 + 硬阴影 */}
      <Box bg={COLORS.black} flexShrink={0} position="relative" zIndex={1} boxShadow={SHADOW.medium}>
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
            虚拟滚动长列 // VIRTUAL LIST
          </Text>
          {/* 实时读数 — 滚动时持续更新，证明只渲染可视窗口 */}
          <Flex align="center" gap="6px" flexWrap="wrap">
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.1em"
              color={COLORS.metalWhite}
              opacity={0.85}
              lineHeight={1.4}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              总条目 {formatNum(TOTAL)}
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.metalWhite} opacity={0.4} lineHeight={1.4}>
              ·
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.1em"
              color={COLORS.electricCyan}
              lineHeight={1.4}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              可见 {visible}
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.metalWhite} opacity={0.4} lineHeight={1.4}>
              ·
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="9px"
              letterSpacing="0.1em"
              color={COLORS.gold}
              lineHeight={1.4}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              渲染 {rendered}
            </Text>
          </Flex>
        </Flex>
        {/* 滚动进度：红填充 / 暗底 */}
        <Box h="3px" bg={COLORS.industrialBlack}>
          <Box h="100%" bg={COLORS.red} width={`${progress * 100}%`} />
        </Box>
      </Box>

      {/* 列表主体 + 快滚轨道 */}
      <Flex flex={1} overflow="hidden" minWidth={0}>
        {/* 可滚动视口 — 内部仅挂载可视窗口行 */}
        <Box
          ref={scrollRef}
          flex={1}
          minWidth={0}
          overflowY="auto"
          position="relative"
          bg={COLORS.pureWhite}
          onScroll={handleScroll}
          sx={{ overscrollBehavior: "contain", scrollbarWidth: "thin" }}
        >
          {/* 总高度占位 — 撑出完整滚动范围 */}
          <Box position="relative" h={`${totalH}px`}>
            {rows.map((row) => (
              <Row key={row.index} row={row} />
            ))}
          </Box>
        </Box>

        {/* 迷你地图轨道 — 点击/拖拽跳转 */}
        <Box
          ref={railRef}
          w="18px"
          flexShrink={0}
          bg={COLORS.black}
          position="relative"
          cursor="pointer"
          userSelect="none"
          sx={{ touchAction: "none" }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seekToPointerY(e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) seekToPointerY(e.clientY);
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
        >
          {/* 千条刻度 — 金色横线 */}
          {Array.from({ length: Math.floor(TOTAL / MILESTONE) + 1 }, (_, k) => (
            <Box
              key={k}
              position="absolute"
              left={0}
              right={0}
              h="1px"
              bg={COLORS.gold}
              opacity={0.35}
              top={`${(k * MILESTONE * 100) / TOTAL}%`}
            />
          ))}
          {/* 视口滑块 */}
          <Box
            position="absolute"
            left="3px"
            right="3px"
            h={`${RAIL_THUMB_H}px`}
            bg={COLORS.red}
            top={`calc(${(progress * 100).toFixed(2)}% - ${(progress * RAIL_THUMB_H).toFixed(2)}px)`}
          />
        </Box>
      </Flex>

      {/* 底部遥测条 — 窗口范围 + 像素读数 */}
      <Box bg={COLORS.black} flexShrink={0} borderTop={`2px solid ${COLORS.red}`}>
        <Flex px="12px" py="6px" justify="space-between" align="center" gap="8px" flexWrap="wrap">
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="8px"
            letterSpacing="0.12em"
            color={COLORS.metalWhite}
            opacity={0.65}
            lineHeight={1.4}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            窗口 {String(start + 1).padStart(5, "0")}–{String(end).padStart(5, "0")} / {formatNum(TOTAL)}
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="8px"
            letterSpacing="0.12em"
            color={COLORS.electricCyan}
            lineHeight={1.4}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            SCROLL {formatNum(scrollTop)} / {formatNum(totalH)} PX
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
