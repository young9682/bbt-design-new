import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = { Box: motion(Box) };

/* === 定位类型 — 12 个位置：top/bottom/left/right × start/center/end === */
type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";
type Mark = "square" | "diamond" | "circle";
type Placement = { side: Side; align: Align };
type Rect = { x: number; y: number; w: number; h: number };
type Fit = { left: number; top: number };
type EdgePos = { left?: string; top?: string; right?: string; bottom?: string };

interface Solved {
  left: number;
  top: number;
  side: Side;
  align: Align;
  label: string;
  flipped: boolean;
  clamped: boolean;
  arrowX?: number;
  arrowY?: number;
}

interface ActiveState {
  id: string;
  pref: string;
  rect: Rect;
}

interface LastState {
  pref: string;
  actual: string;
  flipped: boolean;
  clamped: boolean;
}

const GAP = 8; // 提示与目标间距
const PAD = 6; // 画布内边距（钳位边界）
const ARROW = 8; // 箭头方塊边长

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function parse(label: string): Placement {
  const [side, align] = label.split("-");
  return { side: side as Side, align: (align as Align) ?? "center" };
}

/** 理想坐标 — 未考虑边界 */
function baseFit(side: Side, align: Align, r: Rect, tw: number, th: number): Fit {
  if (side === "top" || side === "bottom") {
    const left =
      align === "start"
        ? r.x
        : align === "center"
          ? r.x + r.w / 2 - tw / 2
          : r.x + r.w - tw;
    const top = side === "top" ? r.y - th - GAP : r.y + r.h + GAP;
    return { left, top };
  }
  const top =
    align === "start"
      ? r.y
      : align === "center"
        ? r.y + r.h / 2 - th / 2
        : r.y + r.h - th;
  const left = side === "left" ? r.x - tw - GAP : r.x + r.w + GAP;
  return { left, top };
}

/** 求解实际位置 — 翻转 + 钳位，箭头指向目标 */
function solve(
  rect: Rect,
  pref: Placement,
  rendered: Placement,
  tw: number,
  th: number,
  fw: number,
  fh: number
): Solved {
  const fits = (f: Fit) =>
    f.left >= PAD &&
    f.top >= PAD &&
    f.left + tw <= fw - PAD &&
    f.top + th <= fh - PAD;
  const overflow = (f: Fit) =>
    Math.max(
      PAD - f.left,
      PAD - f.top,
      f.left + tw - (fw - PAD),
      f.top + th - (fh - PAD),
      0
    );

  let side = rendered.side;
  let fit = baseFit(side, rendered.align, rect, tw, th);
  if (!fits(fit)) {
    const alt = OPPOSITE[side];
    const altFit = baseFit(alt, rendered.align, rect, tw, th);
    side = alt;
    fit = altFit;
    /* 翻转后仍溢出 → 取溢出较小的一侧 */
    const homeFit = baseFit(rendered.side, rendered.align, rect, tw, th);
    if (!fits(altFit) && overflow(homeFit) < overflow(altFit)) {
      side = rendered.side;
      fit = homeFit;
    }
  }

  const maxX = Math.max(PAD, fw - tw - PAD);
  const maxY = Math.max(PAD, fh - th - PAD);
  const left = Math.min(Math.max(fit.left, PAD), maxX);
  const top = Math.min(Math.max(fit.top, PAD), maxY);
  const clamped = left !== fit.left || top !== fit.top;
  const flipped = side !== pref.side;

  /* 箭头沿提示边滑动，始终指向目标中心 */
  let arrowX: number | undefined;
  let arrowY: number | undefined;
  if (side === "top" || side === "bottom") {
    arrowX = Math.min(
      Math.max(rect.x + rect.w / 2 - left - ARROW / 2, 4),
      Math.max(4, tw - ARROW - 4)
    );
  } else {
    arrowY = Math.min(
      Math.max(rect.y + rect.h / 2 - top - ARROW / 2, 4),
      Math.max(4, th - ARROW - 4)
    );
  }

  return {
    left,
    top,
    side,
    align: rendered.align,
    label: `${side}-${rendered.align}`,
    flipped,
    clamped,
    arrowX,
    arrowY,
  };
}

/* === 目标定义 === */
const GRID_TARGETS: { placement: string; mark: Mark }[] = [
  { placement: "top-start", mark: "square" },
  { placement: "top-center", mark: "circle" },
  { placement: "top-end", mark: "diamond" },
  { placement: "left-center", mark: "square" },
  { placement: "right-center", mark: "circle" },
  { placement: "bottom-start", mark: "diamond" },
  { placement: "bottom-center", mark: "square" },
  { placement: "bottom-end", mark: "circle" },
];

const EDGE_TARGETS: { placement: string; mark: Mark; pos: EdgePos }[] = [
  { placement: "left-start", mark: "square", pos: { left: "12px", top: "15%" } },
  { placement: "left-end", mark: "diamond", pos: { left: "12px", bottom: "13%" } },
  { placement: "right-start", mark: "circle", pos: { right: "12px", top: "24%" } },
  { placement: "right-end", mark: "square", pos: { right: "12px", bottom: "19%" } },
];

/* === 几何符号 — 方 / 菱 / 圆 === */
function Glyph({ mark, size }: { mark: Mark; size: number }) {
  return (
    <Box
      w={`${size}px`}
      h={`${size}px`}
      flexShrink={0}
      bg={COLORS.pureWhite}
      borderRadius={mark === "circle" ? "50%" : 0}
      transform={mark === "diamond" ? "rotate(45deg)" : undefined}
    />
  );
}

/* === 目标按钮 — 黑底白色几何符号，硬阴影 === */
function TargetButton({
  placement,
  mark,
  size,
  markSize,
  active,
  onShow,
  onHide,
}: {
  placement: string;
  mark: Mark;
  size: string | { base: string; sm: string };
  markSize: number;
  active: boolean;
  onShow: (placement: string, el: HTMLElement) => void;
  onHide: () => void;
}) {
  return (
    <Box
      as="button"
      type="button"
      aria-label={`工具提示定位 ${placement}`}
      w={size}
      h={size}
      p={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={active ? COLORS.industrialBlack : COLORS.black}
      border={`${BORDER.standard} ${active ? COLORS.red : COLORS.black}`}
      borderRadius={0}
      boxShadow={active ? `3px 3px 0px ${COLORS.gold}` : SHADOW.small}
      cursor="pointer"
      transition={`box-shadow ${DURATION.fast}s ease, transform ${DURATION.instant}s ease, background-color ${DURATION.fast}s ease, border-color ${DURATION.fast}s ease`}
      _hover={{ boxShadow: `3px 3px 0px ${COLORS.red}`, transform: "translateY(-1px)" }}
      _active={{ transform: "translate(1px, 1px)", boxShadow: `1px 1px 0px ${COLORS.red}` }}
      _focusVisible={{ outline: `2px solid ${COLORS.red}`, outlineOffset: "2px" }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
        onShow(placement, e.currentTarget)
      }
      onMouseLeave={onHide}
      onFocus={(e: React.FocusEvent<HTMLDivElement>) =>
        onShow(placement, e.currentTarget)
      }
      onBlur={onHide}
    >
      <Glyph mark={mark} size={markSize} />
    </Box>
  );
}

export default function SceneTooltip() {
  const [active, setActive] = useState<ActiveState | null>(null);
  const [pos, setPos] = useState<(Solved & { id: string }) | null>(null);
  const [last, setLast] = useState<LastState | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const passRef = useRef(0);

  const shown = active && pos && pos.id === active.id ? pos : null;

  const show = (placement: string, el: HTMLElement) => {
    const frame = frameRef.current;
    if (!frame) return;
    const fr = frame.getBoundingClientRect();
    const tr = el.getBoundingClientRect();
    passRef.current = 0;
    setActive({
      id: placement,
      pref: placement,
      rect: {
        x: tr.left - fr.left,
        y: tr.top - fr.top,
        w: tr.width,
        h: tr.height,
      },
    });
  };

  const hide = () => setActive(null);

  /* 视口变化后坐标失效 — 收起提示 */
  useLayoutEffect(() => {
    const onResize = () => setActive(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* 两遍求解：先按首选标签测量，翻转后标签变化则复测一次（passRef 防振荡） */
  useLayoutEffect(() => {
    if (!active || !frameRef.current || !tipRef.current) return;
    if (passRef.current > 2) return;
    passRef.current += 1;
    const fw = frameRef.current.clientWidth;
    const fh = frameRef.current.clientHeight;
    const tw = tipRef.current.offsetWidth;
    const th = tipRef.current.offsetHeight;
    const renderedLabel = pos && pos.id === active.id ? pos.label : active.pref;
    const solved = solve(
      active.rect,
      parse(active.pref),
      parse(renderedLabel),
      tw,
      th,
      fw,
      fh
    );
    if (pos && pos.id === active.id && pos.label === solved.label) return;
    setPos({ id: active.id, ...solved });
    setLast({
      pref: active.pref,
      actual: solved.label,
      flipped: solved.flipped,
      clamped: solved.clamped,
    });
  }, [active, pos]);

  /* 滑入方向 — 自目标一侧 4px 偏移滑入 */
  const slideSide = shown ? shown.side : parse(active?.pref ?? "top").side;
  const slide =
    slideSide === "top"
      ? { x: 0, y: 4 }
      : slideSide === "bottom"
        ? { x: 0, y: -4 }
        : slideSide === "left"
          ? { x: 4, y: 0 }
          : { x: -4, y: 0 };

  const noteText = !last
    ? "待悬停"
    : last.flipped && last.clamped
      ? "翻转+钳位"
      : last.flipped
        ? "翻转"
        : last.clamped
          ? "钳位"
          : "无翻转";
  const noteColor = !last
    ? COLORS.metalWhite
    : last.flipped
      ? COLORS.gold
      : last.clamped
        ? COLORS.velocityOrange
        : COLORS.electricCyan;

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} overflow="hidden">
      {/* === 状态条 === */}
      <Flex
        h="26px"
        flexShrink={0}
        bg={COLORS.black}
        borderBottom={`3px solid ${COLORS.red}`}
        px="10px"
        align="center"
        justify="space-between"
      >
        <Flex align="center" gap="8px">
          <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="10px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
            lineHeight={1}
          >
            浮层定位 // Tooltip · Popover
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.metalWhite}
          opacity={0.65}
          lineHeight={1}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          12 位置 · 悬停目标
        </Text>
      </Flex>

      {/* === 定位画布 — 混凝土底 + 蓝图网格 === */}
      <Box
        flex={1}
        minH={0}
        m={{ base: "8px", md: "10px" }}
        position="relative"
        overflow="hidden"
        bg={COLORS.concrete}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        sx={{
          backgroundImage: `linear-gradient(${COLORS.black}0d 1px, transparent 1px), linear-gradient(90deg, ${COLORS.black}0d 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
        }}
      >
        {/* 几何构成装饰 — 角括号 / 信号斜线 / 场标注 */}
        <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderTop={`2px solid ${COLORS.black}`} borderLeft={`2px solid ${COLORS.black}`} opacity={0.35} pointerEvents="none" />
        <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderTop={`2px solid ${COLORS.black}`} borderRight={`2px solid ${COLORS.black}`} opacity={0.35} pointerEvents="none" />
        <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderBottom={`2px solid ${COLORS.black}`} borderLeft={`2px solid ${COLORS.black}`} opacity={0.35} pointerEvents="none" />
        <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderBottom={`2px solid ${COLORS.black}`} borderRight={`2px solid ${COLORS.black}`} opacity={0.35} pointerEvents="none" />
        <Box position="absolute" top="16%" right="20%" w="80px" h="2px" bg={COLORS.electricCyan} opacity={0.5} transform="rotate(-26deg)" pointerEvents="none" />
        <Box position="absolute" bottom="18%" left="18%" w="64px" h="2px" bg={COLORS.gold} opacity={0.45} transform="rotate(-26deg)" pointerEvents="none" />
        <Text
          position="absolute"
          top="8px"
          left="22px"
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.14em"
          color={COLORS.black}
          opacity={0.4}
          pointerEvents="none"
          lineHeight={1}
        >
          FIELD-A // 定位场
        </Text>
        <Text
          position="absolute"
          bottom="8px"
          right="22px"
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.14em"
          color={COLORS.black}
          opacity={0.4}
          pointerEvents="none"
          lineHeight={1}
          display={{ base: "none", sm: "block" }}
        >
          BOUNDS=FRAME
        </Text>

        {/* 测量基准层 — 所有目标与提示以此为坐标系 */}
        <Box ref={frameRef} position="absolute" inset={0}>
          {/* 中央 3×3 阵列 — 8 目标 + 红色徽记 */}
          <Grid
            position="absolute"
            inset={0}
            zIndex={2}
            templateColumns={{ base: "repeat(2, 38px)", sm: "repeat(3, 40px)" }}
            gap={{ base: "10px", sm: "12px" }}
            justifyContent="center"
            alignContent="center"
          >
            {GRID_TARGETS.map((t, i) => (
              <Fragment key={t.placement}>
                {i === 4 && (
                  <Flex
                    w={{ base: "38px", sm: "40px" }}
                    h={{ base: "38px", sm: "40px" }}
                    align="center"
                    justify="center"
                    bg={COLORS.red}
                    border={`${BORDER.standard} ${COLORS.black}`}
                    boxShadow={SHADOW.small}
                    userSelect="none"
                  >
                    <Box w="13px" h="13px" bg={COLORS.pureWhite} borderRadius="50%" />
                  </Flex>
                )}
                <TargetButton
                  placement={t.placement}
                  mark={t.mark}
                  size={{ base: "38px", sm: "40px" }}
                  markSize={10}
                  active={active?.id === t.placement}
                  onShow={show}
                  onHide={hide}
                />
              </Fragment>
            ))}
          </Grid>

          {/* 边缘目标 — 贴近边界，演示翻转/钳位 */}
          {EDGE_TARGETS.map((t) => (
            <Box key={t.placement} position="absolute" zIndex={2} {...t.pos}>
              <TargetButton
                placement={t.placement}
                mark={t.mark}
                size="30px"
                markSize={8}
                active={active?.id === t.placement}
                onShow={show}
                onHide={hide}
              />
            </Box>
          ))}

          {/* 瞄准十字线 — 激活目标中心 */}
          {active && (
            <>
              <Box
                position="absolute"
                left={0}
                right={0}
                top={active.rect.y + active.rect.h / 2}
                h="1px"
                opacity={0.35}
                pointerEvents="none"
                zIndex={1}
                sx={{
                  backgroundImage: `repeating-linear-gradient(90deg, ${COLORS.red} 0 5px, transparent 5px 10px)`,
                }}
              />
              <Box
                position="absolute"
                top={0}
                bottom={0}
                left={active.rect.x + active.rect.w / 2}
                w="1px"
                opacity={0.35}
                pointerEvents="none"
                zIndex={1}
                sx={{
                  backgroundImage: `repeating-linear-gradient(180deg, ${COLORS.red} 0 5px, transparent 5px 10px)`,
                }}
              />
            </>
          )}

          {/* === 工具提示 — 黑面板 / 红色左标 / 旋转方块箭头 === */}
          <AnimatePresence>
            {active && (
              <M.Box
                key={active.id}
                ref={tipRef}
                position="absolute"
                left={shown ? shown.left : 0}
                top={shown ? shown.top : 0}
                visibility={shown ? "visible" : "hidden"}
                zIndex={Z_INDEX.overlay}
                pointerEvents="none"
                display="flex"
                alignItems="center"
                bg={COLORS.black}
                borderLeft={`4px solid ${COLORS.red}`}
                boxShadow={SHADOW.red}
                borderRadius={0}
                px="9px"
                py="5px"
                initial={{ opacity: 0, x: slide.x, y: slide.y }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: slide.x * 0.6, y: slide.y * 0.6 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="10px"
                  letterSpacing="0.1em"
                  color={COLORS.pureWhite}
                  lineHeight={1.3}
                  whiteSpace="nowrap"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {shown ? shown.label : active.pref}
                </Text>
                {/* 箭头 — 旋转方块缺口，指向目标 */}
                {shown && (shown.side === "top" || shown.side === "bottom") && (
                  <Box
                    position="absolute"
                    left={`${shown.arrowX ?? 0}px`}
                    top={shown.side === "top" ? undefined : "-5px"}
                    bottom={shown.side === "top" ? "-5px" : undefined}
                    w={`${ARROW}px`}
                    h={`${ARROW}px`}
                    bg={COLORS.black}
                    transform="rotate(45deg)"
                  />
                )}
                {shown && (shown.side === "left" || shown.side === "right") && (
                  <Box
                    position="absolute"
                    top={`${shown.arrowY ?? 0}px`}
                    left={shown.side === "right" ? "-5px" : undefined}
                    right={shown.side === "left" ? "-5px" : undefined}
                    w={`${ARROW}px`}
                    h={`${ARROW}px`}
                    bg={COLORS.black}
                    transform="rotate(45deg)"
                  />
                )}
              </M.Box>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* === 读数条 — 上次/实际定位 === */}
      <Flex
        h="30px"
        flexShrink={0}
        bg={COLORS.black}
        borderTop={`3px solid ${COLORS.red}`}
        px="10px"
        align="center"
        justify="space-between"
        gap="8px"
        overflow="hidden"
      >
        <Flex align="center" gap="8px" minW={0}>
          <Box w="8px" h="8px" bg={COLORS.gold} flexShrink={0} />
          <Text
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.bold}
            letterSpacing="0.06em"
            color={COLORS.metalWhite}
            isTruncated
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            上次:{" "}
            <Text as="span" color={COLORS.gold}>
              {last?.pref ?? "—"}
            </Text>
            {" → "}实际:{" "}
            <Text as="span" color={COLORS.pureWhite}>
              {last?.actual ?? "—"}
            </Text>
            {" ("}
            <Text as="span" color={noteColor}>
              {noteText}
            </Text>
            {")"}
          </Text>
        </Flex>
        <Text
          display={{ base: "none", sm: "block" }}
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.metalWhite}
          opacity={0.5}
          flexShrink={0}
          lineHeight={1}
        >
          AUTO-FLIP 翻转 · CLAMP 钳位
        </Text>
      </Flex>
    </Flex>
  );
}
