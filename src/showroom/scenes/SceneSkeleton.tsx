import { Box, Flex, Grid, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE } from "../../Theme";

const M = { Box: motion(Box) };

type VariantKey = "neutral" | "red" | "cyan" | "gold";

const VARIANT_BASE: Record<VariantKey, string> = {
  neutral: COLORS.industrialBlack,
  red: COLORS.redDark,
  cyan: COLORS.electricCyan,
  gold: COLORS.goldDark,
};

const VARIANT_SHIMMER: Record<VariantKey, string> = {
  neutral: `${COLORS.pureWhite}59`,
  red: `${COLORS.pureWhite}33`,
  cyan: `${COLORS.pureWhite}40`,
  gold: `${COLORS.pureWhite}33`,
};

/**
 * 几何构成扫描 shimmer 条
 * —— 模拟 Solari 翻板显示器在加载时的机械扫描感
 */
function ShimmerBar({
  width = "100%",
  h = "12px",
  delay = 0,
  variant = "neutral",
  flex,
}: {
  width?: string;
  h?: string;
  delay?: number;
  variant?: VariantKey;
  flex?: number;
}) {
  return (
    <Box
      w={width}
      h={h}
      flex={flex}
      bg={VARIANT_BASE[variant]}
      opacity={0.35}
      overflow="hidden"
      position="relative"
      flexShrink={0}
    >
      <M.Box
        position="absolute"
        top="0"
        left="0"
        bottom="0"
        w="55%"
        bg={`linear-gradient(105deg, transparent 20%, ${VARIANT_SHIMMER[variant]}, transparent 80%)`}
        animate={{ x: ["-220%", "240%"] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      />
    </Box>
  );
}

/**
 * 几何占位块 —— 零圆角、硬色块、带扫描 shimmer
 */
function GeoPlaceholder({
  w = "40px",
  h = "40px",
  variant = "red",
  delay = 0,
}: {
  w?: string;
  h?: string;
  variant?: VariantKey;
  delay?: number;
}) {
  return (
    <Box
      w={w}
      h={h}
      bg={variant === "neutral" ? COLORS.industrialBlack : VARIANT_BASE[variant]}
      overflow="hidden"
      position="relative"
      flexShrink={0}
    >
      <M.Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={`linear-gradient(135deg, transparent 30%, ${VARIANT_SHIMMER[variant]}, transparent 70%)`}
        animate={{ x: ["-160%", "160%"] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      />
    </Box>
  );
}

/**
 * 卡片轮廓 —— 白底、粗黑边框、硬阴影
 */
function SkeletonCard({ children, p = SPACE.md }: { children: React.ReactNode; p?: string }) {
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      p={p}
    >
      {children}
    </Box>
  );
}

/**
 * 仪器色条 —— 红 / 橙 / 金 / 青 / 绿 / 黑
 */
function InstrumentStrip() {
  return (
    <Flex h="4px" w="100%" flexShrink={0}>
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
      <Box flex={2} bg={COLORS.black} />
    </Flex>
  );
}

/**
 * 顶部扫描虚线 —— 从 RefNavBar 提取的机械感装饰
 */
function Scanline() {
  return (
    <Box
      h="2px"
      w="100%"
      backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
      opacity={0.4}
      flexShrink={0}
    />
  );
}

/**
 * 统计小卡 —— 红方块 + 两个 shimmer 行
 */
function StatSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <SkeletonCard p={SPACE.sm}>
      <VStack align="stretch" gap={SPACE.sm}>
        <Flex justify="space-between" align="center">
          <GeoPlaceholder w="24px" h="24px" variant="red" delay={delay} />
          <ShimmerBar width="32px" h="14px" variant="cyan" delay={delay + 0.15} />
        </Flex>
        <ShimmerBar width="55%" h="18px" delay={delay + 0.05} />
        <ShimmerBar width="75%" h="10px" delay={delay + 0.1} />
      </VStack>
    </SkeletonCard>
  );
}

/**
 * 列表行 —— 几何方块 + 三段 shimmer
 */
function ListRowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Flex align="center" gap={SPACE.md} py={SPACE.sm} borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}>
      <GeoPlaceholder w="32px" h="32px" variant="gold" delay={delay} />
      <ShimmerBar flex={1} h="12px" delay={delay + 0.05} />
      <ShimmerBar width="80px" h="12px" delay={delay + 0.1} />
      <ShimmerBar width="48px" h="12px" variant="cyan" delay={delay + 0.15} />
    </Flex>
  );
}

export default function SceneSkeleton() {
  return (
    <Box h="100%" bg={COLORS.concrete} display="flex" flexDirection="column" overflow="hidden">
      <Scanline />
      <InstrumentStrip />

      <Box flex={1} p={SPACE.md} overflowY="auto">
        <VStack align="stretch" gap={SPACE.md}>
          {/* Header card */}
          <SkeletonCard p={SPACE.md}>
            <Flex gap={SPACE.md} align="flex-start" justify="space-between">
              <Flex gap={SPACE.md} flex={1}>
                <GeoPlaceholder w="48px" h="48px" variant="red" delay={0} />
                <VStack align="stretch" flex={1} gap={SPACE.sm}>
                  <ShimmerBar width="60%" h="18px" delay={0.05} />
                  <ShimmerBar width="40%" h="12px" delay={0.1} />
                </VStack>
              </Flex>
              <GeoPlaceholder w="64px" h="28px" variant="cyan" delay={0.15} />
            </Flex>
          </SkeletonCard>

          {/* Stats grid */}
          <Grid templateColumns="repeat(4, 1fr)" gap={SPACE.md}>
            <StatSkeleton delay={0.1} />
            <StatSkeleton delay={0.2} />
            <StatSkeleton delay={0.3} />
            <StatSkeleton delay={0.4} />
          </Grid>

          {/* Main content block */}
          <SkeletonCard p={SPACE.md}>
            <VStack align="stretch" gap={SPACE.md}>
              <Flex justify="space-between" align="center">
                <ShimmerBar width="160px" h="16px" delay={0.2} />
                <Flex gap={SPACE.sm}>
                  <GeoPlaceholder w="20px" h="20px" variant="gold" delay={0.25} />
                  <ShimmerBar width="80px" h="14px" variant="cyan" delay={0.3} />
                </Flex>
              </Flex>

              <Flex gap={SPACE.md} align="flex-end" h="120px">
                <ShimmerBar flex={1} h="100%" variant="red" delay={0.15} />
                <ShimmerBar flex={1} h="75%" variant="red" delay={0.25} />
                <ShimmerBar flex={1} h="90%" variant="red" delay={0.35} />
                <ShimmerBar flex={1} h="55%" variant="red" delay={0.45} />
                <ShimmerBar flex={1} h="80%" variant="red" delay={0.55} />
              </Flex>

              <Flex justify="space-between" align="center" gap={SPACE.md}>
                <ShimmerBar flex={1} h="10px" delay={0.5} />
                <ShimmerBar flex={1} h="10px" delay={0.55} />
                <ShimmerBar flex={1} h="10px" delay={0.6} />
              </Flex>
            </VStack>
          </SkeletonCard>

          {/* List block */}
          <SkeletonCard p={SPACE.md}>
            <VStack align="stretch" gap={SPACE.sm}>
              <Flex justify="space-between" align="center" mb={SPACE.sm}>
                <ShimmerBar width="120px" h="16px" delay={0.3} />
                <GeoPlaceholder w="24px" h="24px" variant="cyan" delay={0.35} />
              </Flex>
              <ListRowSkeleton delay={0.35} />
              <ListRowSkeleton delay={0.45} />
              <ListRowSkeleton delay={0.55} />
              <ListRowSkeleton delay={0.65} />
            </VStack>
          </SkeletonCard>
        </VStack>
      </Box>

      <InstrumentStrip />
    </Box>
  );
}
