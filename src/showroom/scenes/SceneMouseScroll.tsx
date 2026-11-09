import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef, useEffect, useCallback } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

type PanelTheme = "red" | "black" | "gold" | "white";

interface PanelConfig {
  theme: PanelTheme;
  label: string;
  meta: string;
}

const PANELS: PanelConfig[] = [
  { theme: "red", label: "楔子", meta: "AX-01 // 刺入" },
  { theme: "black", label: "基地", meta: "AX-02 // 支撑" },
  { theme: "gold", label: "徽章", meta: "AX-03 // 成就" },
  { theme: "white", label: "信号", meta: "AX-04 // 广播" },
  { theme: "red", label: "推进", meta: "AX-05 // 加速" },
  { theme: "black", label: "轨道", meta: "AX-06 // 导航" },
  { theme: "gold", label: "构建", meta: "REQ-07 // 成型" },
  { theme: "white", label: "数据", meta: "REQ-08 // 监控" },
  { theme: "red", label: "提交", meta: "REQ-09 // 处理中" },
  { theme: "black", label: "归档", meta: "REQ-10 // 终点" },
];

const THEME_STYLES: Record<
  PanelTheme,
  {
    bg: string;
    color: string;
    border: string;
    shadow: string;
    accent: string;
    numberColor: string;
  }
> = {
  red: {
    bg: COLORS.red,
    color: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    shadow: SHADOW.red,
    accent: COLORS.gold,
    numberColor: `${COLORS.pureWhite}2e`,
  },
  black: {
    bg: COLORS.black,
    color: COLORS.metalWhite,
    border: `${BORDER.heavy} ${COLORS.industrialBlack}`,
    shadow: SHADOW.large,
    accent: COLORS.electricCyan,
    numberColor: `${COLORS.metalWhite}1f`,
  },
  gold: {
    bg: COLORS.gold,
    color: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.goldDark}`,
    shadow: SHADOW.gold,
    accent: COLORS.red,
    numberColor: `${COLORS.black}26`,
  },
  white: {
    bg: COLORS.pureWhite,
    color: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    accent: COLORS.electricCyan,
    numberColor: `${COLORS.black}14`,
  },
};

function GalleryPanel({ index, config }: { index: number; config: PanelConfig }) {
  const style = THEME_STYLES[config.theme];
  const displayNumber = String(index + 1).padStart(2, "0");

  return (
    <Box
      position="relative"
      h="100%"
      flexShrink={0}
      minW={{ base: "160px", sm: "190px", md: "220px", lg: "260px" }}
      bg={style.bg}
      color={style.color}
      border={style.border}
      boxShadow={style.shadow}
      p={SPACE.md}
      overflow="hidden"
      cursor="pointer"
      transition={`transform ${DURATION.fast}s ease-out, box-shadow ${DURATION.fast}s ease-out`}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: SHADOW.large,
      }}
    >
      {/* 左上角几何标记 */}
      <Box
        position="absolute"
        top="12px"
        left="12px"
        w="28px"
        h="28px"
        bg={style.accent}
      />

      {/* 右上斜向速度线 */}
      <Box
        position="absolute"
        top="18px"
        right="-22px"
        w="72px"
        h="3px"
        bg={style.accent}
        transform="rotate(45deg)"
        opacity={0.7}
      />
      <Box
        position="absolute"
        top="30px"
        right="-18px"
        w="48px"
        h="2px"
        bg={style.accent}
        transform="rotate(45deg)"
        opacity={0.4}
      />

      {/* 底部仪器色条 */}
      <Flex position="absolute" bottom="0" left="0" right="0" h="4px">
        <Box flex={3} bg={style.accent} />
        <Box flex={1} bg={COLORS.black} opacity={0.3} />
        <Box flex={2} bg={style.accent} opacity={0.5} />
      </Flex>

      {/* 背景巨型编号 */}
      <Text
        position="absolute"
        right="-8px"
        bottom="-18px"
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize={{ base: "92px", md: "120px" }}
        lineHeight={0.85}
        color={style.numberColor}
        letterSpacing="-0.04em"
        userSelect="none"
      >
        {displayNumber}
      </Text>

      {/* 前景内容 */}
      <Flex direction="column" justify="space-between" h="100%" position="relative" zIndex={1}>
        <Box>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="10px"
            letterSpacing="0.1em"
            opacity={0.7}
            textTransform="uppercase"
          >
            PANEL {displayNumber}
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "22px", md: "28px" }}
            lineHeight={0.9}
            letterSpacing="-0.02em"
            textTransform="uppercase"
            mt={SPACE.xs}
          >
            {config.label}
          </Text>
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          letterSpacing="0.1em"
          opacity={0.8}
        >
          {config.meta}
        </Text>
      </Flex>
    </Box>
  );
}

export default function SceneMouseScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const smoothScroll = useCallback(() => {
    if (!trackRef.current) {
      rafRef.current = requestAnimationFrame(smoothScroll);
      return;
    }

    const track = trackRef.current;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    // Keep target within bounds after resize
    targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, maxScroll));

    const diff = targetScrollRef.current - currentScrollRef.current;

    if (Math.abs(diff) >= 0.5) {
      currentScrollRef.current += diff * 0.12;
      track.scrollLeft = currentScrollRef.current;
    } else if (diff !== 0) {
      currentScrollRef.current = targetScrollRef.current;
      track.scrollLeft = currentScrollRef.current;
    }

    if (progressRef.current) {
      const progress = maxScroll > 0 ? currentScrollRef.current / maxScroll : 0;
      progressRef.current.style.width = `${progress * 100}%`;
    }

    rafRef.current = requestAnimationFrame(smoothScroll);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(smoothScroll);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothScroll]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const pct = clampedX / rect.width;
    const maxScroll = Math.max(0, trackRef.current.scrollWidth - trackRef.current.clientWidth);
    targetScrollRef.current = pct * maxScroll;
  }, []);

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const left = trackRef.current.scrollLeft;
    currentScrollRef.current = left;
    targetScrollRef.current = left;
  }, []);

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Flex align="center" justify="space-between" mb={SPACE.sm}>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.industrialBlack}
          opacity={0.7}
          letterSpacing="0.08em"
        >
          鼠标在轨道内左右移动即可控制横向滚动
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.red}
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          Scroll Gallery
        </Text>
      </Flex>

      <Box position="relative" flex="1" overflow="hidden">
        <Flex
          ref={trackRef}
          h="100%"
          overflowX="auto"
          gap={{ base: "12px", md: "16px" }}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          {PANELS.map((panel, i) => (
            <GalleryPanel key={i} index={i} config={panel} />
          ))}
        </Flex>
      </Box>

      <Box h="4px" bg={COLORS.black} opacity={0.08} mt={SPACE.xs}>
        <Box ref={progressRef} h="100%" bg={COLORS.red} w="0%" />
      </Box>
    </Box>
  );
}
