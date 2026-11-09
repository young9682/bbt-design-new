import { Box, Flex, Grid, Text, VStack, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING } from "../../Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
  Flex: motion(Flex),
};

interface Spec {
  label: string;
  value: string;
}

const SPECS: Spec[] = [
  { label: "版本", value: "v1.0.0" },
  { label: "网格", value: "4 px" },
  { label: "圆角", value: "0 px" },
  { label: "主色", value: COLORS.red },
];

const TAGS = ["几何构成", "硬阴影", "零圆角", "高效动效"];

export default function SceneDetailFab() {
  return (
    <Box
      h="100%"
      position="relative"
      overflow="hidden"
      bg={COLORS.concrete}
    >
      {/* ============================================================
          几何装饰层
          ============================================================ */}
      {/* 黑色建筑平面：从左下升起，作为空间地基 */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="55%"
        bg={COLORS.black}
        opacity={0.05}
        clipPath="polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)"
        pointerEvents="none"
        zIndex={0}
      />

      {/* 红色楔形 — 从右侧刺入内容区 */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w={{ base: "96px", md: "160px" }}
        h={{ base: "96px", md: "160px" }}
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        pointerEvents="none"
        zIndex={1}
      />

      {/* 金色旋转方块 — 中景点缀 */}
      <Box
        position="absolute"
        bottom={{ base: "96px", md: "128px" }}
        left={{ base: "16px", md: "32px" }}
        w={{ base: "28px", md: "40px" }}
        h={{ base: "28px", md: "40px" }}
        border={`${BORDER.heavy} ${COLORS.gold}`}
        transform="rotate(45deg)"
        opacity={0.85}
        pointerEvents="none"
        zIndex={1}
      />

      {/* 电青色速度线 — 从右上斜切 */}
      <Box
        position="absolute"
        top="12%"
        right="4%"
        w={{ base: "80px", md: "160px" }}
        h="2px"
        bg={COLORS.electricCyan}
        transform="rotate(-22deg)"
        transformOrigin="right center"
        opacity={0.6}
        pointerEvents="none"
        zIndex={1}
      />

      {/* 仪器色条 — 页面顶部 */}
      <Flex h="4px" w="100%" flexShrink={0} position="relative" zIndex={2}>
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>

      {/* ============================================================
          主内容 — 可滚动文章
          ============================================================ */}
      <Box
        h="calc(100% - 4px)"
        overflowY="auto"
        p={{ base: SPACE.md, md: SPACE.lg }}
        position="relative"
        zIndex={2}
      >
        <M.Box
          maxW="720px"
          mx="auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.normal,
            ease: EASING.launch,
          }}
        >
          {/* 文章头部：标题 + 元数据 */}
          <Box mb={SPACE.lg}>
            <Flex
              align="center"
              gap="8px"
              mb="10px"
              flexWrap="wrap"
            >
              <Box
                bg={COLORS.red}
                color={COLORS.pureWhite}
                px="8px"
                py="4px"
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="10px"
                letterSpacing="0.1em"
                textTransform="uppercase"
                lineHeight={1}
              >
                DOSSIER
              </Box>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.gold}
                letterSpacing="0.1em"
                textTransform="uppercase"
              >
                REF-07
              </Text>
            </Flex>

            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "26px", md: "38px" }}
              color={COLORS.black}
              letterSpacing="-0.02em"
              lineHeight={0.95}
              mb="10px"
            >
              用几何构筑空间层级
            </Text>

            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="12px"
              color={COLORS.industrialBlack}
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb={SPACE.md}
            >
              空间层次如何决定信息的可读性
            </Text>

            <HStack gap={SPACE.sm} flexWrap="wrap">
              {TAGS.map((tag) => (
                <Box
                  key={tag}
                  bg={COLORS.pureWhite}
                  border={`${BORDER.standard} ${COLORS.black}`}
                  px="8px"
                  py="4px"
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="9px"
                    color={COLORS.black}
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    {tag}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          {/* 主图卡片 */}
          <M.Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.large}
            p={{ base: SPACE.md, md: SPACE.lg }}
            mb={SPACE.lg}
            position="relative"
            _hover={{ boxShadow: SHADOW.large, transform: "translateY(-4px)" }}
            transition={`all ${DURATION.fast}s ease`}
          >
            {/* 左上角红色方块标记 */}
            <Box
              position="absolute"
              top="0"
              left="0"
              w="40px"
              h="40px"
              bg={COLORS.red}
            />

            <Box pl="52px">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "16px", md: "20px" }}
                color={COLORS.black}
                letterSpacing="-0.02em"
                lineHeight={1}
                mb="8px"
              >
                空间层级的三条规则
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="10px"
                color={COLORS.gold}
                letterSpacing="0.1em"
                textTransform="uppercase"
              >
                DESIGN SYSTEM // LAYOUT
              </Text>
            </Box>

            <Box h="2px" bg={COLORS.red} my={SPACE.md} />

            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="14px"
              color={COLORS.industrialBlack}
              lineHeight={1.7}
            >
              空间层级是界面设计中最容易被忽视、却最能决定可读性的维度。
              大色块承载方向与权重，深色平面提供视觉锚点，小面积的高亮色块漂浮其上，
              引导视线在页面中按优先级移动。层级不是靠堆叠元素获得的，而是靠几何关系建立的。
            </Text>
          </M.Box>

          {/* 文章正文 */}
          <VStack align="stretch" gap={SPACE.md} mb={SPACE.lg}>
            {[
              "在本设计系统中，每一个页面都是一份可校验的规范清单：背景使用低饱和的混凝土色，元素以 4px 网格严格对齐，边框拒绝任何圆角，因为几何是绝对的。",
              "硬阴影不是装饰，而是层级陈述。4px、6px、8px 的偏移阴影将元素从背景中抬起，形成可感知的空间层级。红色元素的阴影必须是红色，金色点缀投下金色阴影，电信号青色则勾勒出数据流的轮廓。",
              "大写标签与等宽数据共同构成仪器的可读性层级。标题使用黑体字重 900 并压缩字距，制造标题的冲击力；标签统一大写、宽字距，像仪器面板上的铭牌；数字与状态信息强制等宽与 tabular-nums，确保表格在读数时不会抖动。",
            ].map((paragraph, i) => (
              <M.Text
                key={i}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.regular}
                fontSize="14px"
                color={COLORS.industrialBlack}
                lineHeight={1.7}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.normal,
                  ease: EASING.launch,
                  delay: 0.05 * (i + 1),
                }}
              >
                {paragraph}
              </M.Text>
            ))}
          </VStack>

          {/* 引用块 */}
          <M.Box
            bg={COLORS.black}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            p={{ base: SPACE.md, md: SPACE.lg }}
            mb={SPACE.lg}
            position="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.normal,
              ease: EASING.launch,
              delay: 0.2,
            }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              w="6px"
              h="100%"
              bg={COLORS.red}
            />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "16px", md: "20px" }}
              color={COLORS.pureWhite}
              letterSpacing="-0.01em"
              lineHeight={1.15}
              mb="10px"
              pl="16px"
            >
              “几何即意义。红色不是装饰，而是不可阻挡之力的颜色。”
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              color={COLORS.gold}
              letterSpacing="0.1em"
              textTransform="uppercase"
              pl="16px"
            >
              设计信条 // 01
            </Text>
          </M.Box>

          {/* 规格网格 */}
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={SPACE.sm}
            mb={SPACE.xl}
          >
            {SPECS.map((spec, i) => (
              <M.Box
                key={spec.label}
                bg={COLORS.pureWhite}
                border={`${BORDER.standard} ${COLORS.black}`}
                boxShadow={SHADOW.small}
                p="10px"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.normal,
                  ease: EASING.launch,
                  delay: 0.25 + 0.05 * i,
                }}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: SHADOW.medium,
                }}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={COLORS.industrialBlack}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="4px"
                >
                  {spec.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="16px"
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                  lineHeight={1}
                >
                  {spec.value}
                </Text>
              </M.Box>
            ))}
          </Grid>

          {/* 底部留白，避免 FAB 遮挡 */}
          <Box h="80px" />
        </M.Box>
      </Box>

      {/* ============================================================
          浮动操作按钮 — 红色 FAB + 硬阴影
          ============================================================ */}
      <M.Box
        as="button"
        position="absolute"
        bottom={{ base: "20px", md: "28px" }}
        right={{ base: "20px", md: "28px" }}
        w={{ base: "52px", md: "60px" }}
        h={{ base: "52px", md: "60px" }}
        bg={COLORS.red}
        border={`${BORDER.heavy} ${COLORS.redDark}`}
        boxShadow={SHADOW.red}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        zIndex={10}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.launch,
          delay: 0.4,
        }}
        _hover={{
          bg: COLORS.redLight,
          transform: "translateY(-4px)",
          boxShadow: SHADOW.red,
        }}
        _active={{
          transform: "translateY(0px)",
          boxShadow: SHADOW.red,
        }}
        aria-label="添加收藏"
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "28px", md: "32px" }}
          color={COLORS.pureWhite}
          lineHeight={1}
          transform="translateY(-1px)"
        >
          +
        </Text>
      </M.Box>
    </Box>
  );
}
