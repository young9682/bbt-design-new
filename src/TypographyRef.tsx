import { Box, Text, Flex, VStack, HStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { RefNavBar } from "./RefNavBar";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, TOKENS, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};

export default function TypographyRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      {/* NAV BAR — RefNavBar（翻页时钟风格导航） */}
      <RefNavBar title="文字构成" pageIndex="02" />

      {/* HERO — Diagonal text composition */}
      <Box bg={COLORS.black} px="80px" py="64px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-80px"
          right="40px"
          w="300px"
          h="300px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.08}
          pointerEvents="none"
          transform="perspective(400px) rotateY(15deg)"
        />
        {/* Diagonal stripe */}
        <Box
          position="absolute"
          bottom={0}
          left="0"
          right="0"
          h="3px"
          bg={COLORS.red}
          transform="rotate(-4deg)"
          transformOrigin="left"
        />

        <M.Box
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: DURATION.normal, ease: EASING.launch }}
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.light}
            fontSize="14px"
            letterSpacing="0"
            textTransform="uppercase"
            color={COLORS.gold}
            mb="16px"
          >
            文字构成体系
          </Text>
          <Flex align="baseline" gap="0" flexWrap="wrap">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="96px"
              lineHeight={0.85}
              color={COLORS.pureWhite}
              letterSpacing="0"
            >
              文字
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="96px"
              lineHeight={0.85}
              color={COLORS.red}
              letterSpacing="0"
              ml="16px"
            >
              是
            </Text>
          </Flex>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="48px"
            lineHeight={0.9}
            color={COLORS.pureWhite}
            letterSpacing="0"
          >
            建设的武器
          </Text>
        </M.Box>
      </Box>

      {/* GEOMETRIC COMPOSITION: Hero-to-TypeScale boundary */}
      <Box position="relative" h="80px" overflow="hidden" mx={{ base: "32px", md: "80px" }}>
        {/* Overlapping circle */}
        <Box
          position="absolute"
          top="8px"
          left="20px"
          w="60px"
          h="60px"
          borderRadius="50%"
          border={`2px solid ${COLORS.red}`}
          opacity={0.15}
        />
        {/* Rotated square overlapping the circle */}
        <Box
          position="absolute"
          top="18px"
          left="40px"
          w="40px"
          h="40px"
          border={`2px solid ${COLORS.electricCyan}`}
          opacity={0.15}
          transform="rotate(45deg)"
        />
        {/* Diagonal line cutting across */}
        <Box
          position="absolute"
          top="0"
          left="100px"
          w="100%"
          h="2px"
          bg={COLORS.gold}
          opacity={0.12}
          transform="rotate(-12deg)"
          transformOrigin="left top"
        />
        {/* Small triangle accent */}
        <Box
          position="absolute"
          top="20px"
          right="60px"
          w="0"
          h="0"
          borderLeft="12px solid transparent"
          borderRight="12px solid transparent"
          borderBottom={`20px solid ${COLORS.red}`}
          opacity={0.12}
          transform="rotate(-15deg)"
        />
        {/* Repeating hash marks */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Box
            key={`hash-hero-${i}`}
            position="absolute"
            bottom="8px"
            left={`${80 + i * 18}px`}
            w="1px"
            h="10px"
            bg={COLORS.black}
            opacity={0.1}
            transform="rotate(-45deg)"
          />
        ))}
      </Box>

      {/* TYPE SCALE */}
      <Box px={{ base: "32px", md: "80px" }} py="48px" position="relative">
        {/* L-shaped corner bracket — top-left */}
        <Box
          position="absolute"
          top="0"
          left={{ base: "32px", md: "80px" }}
          w="24px"
          h="24px"
          borderTop={`2px solid ${COLORS.electricCyan}`}
          borderLeft={`2px solid ${COLORS.electricCyan}`}
          opacity={0.2}
        />
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            01
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
            textTransform="uppercase"
          >
            字号体系——每个尺寸都是军阶
          </Text>
        </Flex>

        <VStack align="stretch" gap="0">
          {/* Hero — 96px */}
          <Flex
            align="baseline"
            py="28px"
            borderLeft={`4px solid ${COLORS.red}`}
            bg={COLORS.pureWhite}
            boxShadow={`4px 0 0 ${COLORS.pureWhite}`}
            borderBottom={`${BORDER.standard} ${COLORS.black}`}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              96px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="96px"
              lineHeight={0.85}
              letterSpacing="0"
            >
              英雄
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="12px"
              color={COLORS.industrialBlack}
              ml="24px"
              letterSpacing="0.04em"
              textTransform="uppercase"
            >
              W900 / -0.04em / LH 0.85 / 用于数字和单字标题
            </Text>
          </Flex>

          {/* Display — 64px */}
          <Flex align="baseline" py="28px" pl="16px" borderLeft={`3px solid ${COLORS.gold}`} borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              64px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="64px"
              lineHeight={0.9}
              letterSpacing="0"
            >
              展示
            </Text>
          </Flex>

          {/* Title — 48px */}
          <Flex align="baseline" py="28px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              48px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="48px"
              lineHeight={0.9}
              letterSpacing="0"
            >
              标题/章节
            </Text>
          </Flex>

          {/* Calibration tick marks between title and subtitle rows */}
          <Flex px="16px" py="6px" align="center" gap="3px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
              <Box
                key={`cal-tick-${i}`}
                w={i % 5 === 0 ? "2px" : "1px"}
                h={i % 5 === 0 ? "8px" : "4px"}
                bg={COLORS.gold}
                opacity={0.25}
              />
            ))}
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} opacity={0.25} ml="8px" letterSpacing="0.15em">
              CAL
            </Text>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
              <Box
                key={`cal-tick-r-${i}`}
                w={i % 5 === 0 ? "2px" : "1px"}
                h={i % 5 === 0 ? "8px" : "4px"}
                bg={COLORS.gold}
                opacity={0.25}
              />
            ))}
          </Flex>

          {/* Subtitle — 28px */}
          <Flex align="baseline" py="14px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              28px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="28px"
              lineHeight={1.0}
              letterSpacing="0.04em"
            >
              副标题/组件标题
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="12px"
              color={COLORS.industrialBlack}
              ml="24px"
              letterSpacing="0.04em"
              textTransform="uppercase"
              opacity={0.8}
            >
              W700 / 0.04em / LH 1.0 / 组件标题
            </Text>
          </Flex>

          {/* Body Large — 18px */}
          <Flex align="baseline" py="14px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              18px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="18px"
              lineHeight={1.8}
              letterSpacing="0.01em"
              opacity={0.8}
            >
              大号正文——引导文字、描述语、重点文案的第一段落。
            </Text>
          </Flex>

          {/* Body — 15px */}
          <Flex align="baseline" py="14px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              15px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="15px"
              lineHeight={1.8}
              letterSpacing="0.01em"
              opacity={0.8}
            >
              正文——默认声部。文档的段落。指令的清单。工人在一臂之距阅读此字号。
            </Text>
          </Flex>

          {/* Dotted divider between body and label rows */}
          <Box px="16px" py="0">
            <Box
              h="0"
              borderTop={`1px dotted ${COLORS.velocityOrange}`}
              opacity={0.2}
              mx="0"
            />
          </Box>

          {/* Label — 11px */}
          <Flex align="baseline" py="14px" borderBottom={`${BORDER.standard} ${COLORS.black}`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              11px
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              opacity={0.8}
            >
              标签/说明/元数据——TRACKING 0.15EM / 强制大写
            </Text>
          </Flex>

          {/* Mono — 13px */}
          <Flex align="baseline" py="14px">
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              w="80px"
              flexShrink={0}
              letterSpacing="0.1em"
            >
              13px
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="13px"
              lineHeight={1.6}
              letterSpacing="0.03em"
              opacity={0.8}
            >
              等宽—— $ deploy --config devcontainer.json --provider docker // 仅限技术数据
            </Text>
          </Flex>
        </VStack>
      </Box>

      {/* WEIGHT CONTRAST DEMONSTRATION */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            02
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
            textTransform="uppercase"
          >
            字重对比——张力即清晰
          </Text>
        </Flex>

        <Flex gap="0">
          {/* Light */}
          <Box flex={1} bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} p="24px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.red}
              mb="12px"
            >
              300 细体
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="32px"
              lineHeight={1.4}
            >
              点火前的平静之重。
            </Text>
          </Box>

          {/* Regular */}
          <Box flex={1} bg={COLORS.concrete} border={`${BORDER.heavy} ${COLORS.black}`} p="24px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.red}
              mb="12px"
            >
              400 常规
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="32px"
              lineHeight={1.4}
            >
              运营数据流之重。
            </Text>
          </Box>

          {/* Bold */}
          <Box flex={1} bg={COLORS.black} border={`${BORDER.heavy} ${COLORS.black}`} p="24px" transform="translateY(-4px)">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.gold}
              mb="12px"
            >
              700 粗体
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="32px"
              lineHeight={1.4}
              color={COLORS.pureWhite}
            >
              下达命令之重。
            </Text>
          </Box>

          {/* Black */}
          <Box flex={1} bg={COLORS.red} border={`${BORDER.heavy} ${COLORS.black}`} pt="32px" pb="32px" px="24px" boxShadow={SHADOW.large}>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.gold}
              mb="12px"
            >
              900 黑体
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="32px"
              lineHeight={1.4}
              color={COLORS.pureWhite}
            >
              创造历史之重。
            </Text>
          </Box>
        </Flex>

        {/* L-shaped corner bracket — bottom-right of weight section */}
        <Box
          position="absolute"
          bottom="0"
          right={{ base: "32px", md: "80px" }}
          w="24px"
          h="24px"
          borderBottom={`2px solid ${COLORS.red}`}
          borderRight={`2px solid ${COLORS.red}`}
          opacity={0.2}
        />
      </Box>

      {/* Chevron pointing downward + dashed line — boundary between weight and poster */}
      <Box h="48px" position="relative" mx={{ base: "32px", md: "80px" }}>
        {/* Dashed line */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="0"
          borderTop={`2px dashed ${COLORS.electricCyan}`}
          opacity={0.15}
        />
        {/* Downward chevron (two rotated lines) */}
        <Box
          position="absolute"
          top="12px"
          left="50%"
          transform="translateX(-50%)"
        >
          <Box
            position="absolute"
            w="20px"
            h="2px"
            bg={COLORS.red}
            opacity={0.2}
            transform="rotate(35deg)"
            transformOrigin="right center"
            left="-10px"
          />
          <Box
            position="absolute"
            w="20px"
            h="2px"
            bg={COLORS.red}
            opacity={0.2}
            transform="rotate(-35deg)"
            transformOrigin="left center"
            left="10px"
          />
        </Box>
        {/* Dashed line bottom */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="0"
          borderTop={`1px dotted ${COLORS.gold}`}
          opacity={0.1}
        />
      </Box>

      {/* MIXED SIZE COMPOSITION — like a poster */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            03
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
            textTransform="uppercase"
          >
            构成——海报法则
          </Text>
        </Flex>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          p="48px"
          position="relative"
          overflow="hidden"
        >
          {/* Geometric decorations */}
          {/* Large background triangle wedge — structural plane */}
          <Box
            position="absolute"
            bottom="0"
            right="-40px"
            w="0"
            h="0"
            borderLeft="300px solid transparent"
            borderBottom={`300px solid ${COLORS.red}`}
            opacity={0.05}
          />
          {/* Secondary background triangle — cyan */}
          <Box
            position="absolute"
            top="0"
            left="-20px"
            w="0"
            h="0"
            borderRight="200px solid transparent"
            borderTop={`200px solid ${COLORS.electricCyan}`}
            opacity={0.05}
          />
          <Box
            position="absolute"
            top="24px"
            right="24px"
            w="120px"
            h="120px"
            borderRadius="50%"
            border={`${BORDER.heavy} ${COLORS.gold}`}
            opacity={0.2}
          />
          <Box
            position="absolute"
            top="10%"
            right="20%"
            w="30px"
            h="30px"
            bg={COLORS.electricCyan}
            opacity={0.3}
            transform="rotate(45deg)"
          />
          <Box
            position="absolute"
            bottom="0"
            left="60%"
            w="3px"
            h="60%"
            bg={COLORS.red}
            opacity={0.3}
            transform="rotate(-8deg)"
            transformOrigin="bottom"
          />

          <Box maxW="700px" position="relative" zIndex={1}>
            <Flex align="baseline" gap="0" flexWrap="wrap">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="140px"
                lineHeight={0.8}
                color={COLORS.pureWhite}
                letterSpacing="-0.05em"
              >
                19
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="72px"
                lineHeight={0.8}
                color={COLORS.red}
                letterSpacing="-0.03em"
              >
                57
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="36px"
              lineHeight={0.95}
              color={COLORS.pureWhite}
              letterSpacing="0"
              textTransform="uppercase"
              mt="8px"
            >
              每枚火箭都始于
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="36px"
              lineHeight={0.95}
              color={COLORS.gold}
              letterSpacing="0"
              textTransform="uppercase"
            >
              一个数字
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="15px"
              color={COLORS.metalWhite}
              mt="24px"
              opacity={0.6}
              letterSpacing="0"
              maxW="400px"
            >
              在单一构成中混合字号。140px 的数字锚定版面。72px 的数字制造节奏。36px 的文字提供语境。15px 的文字安定读者。
            </Text>
          </Box>
        </Box>
      </Box>

      {/* DIAGONAL TEXT */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            04
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
            textTransform="uppercase"
          >
            对角线——方向即意义
          </Text>
        </Flex>

        <Box
          bg={COLORS.red}
          border={`${BORDER.heavy} ${COLORS.black}`}
          h="280px"
          position="relative"
          overflow="hidden"
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="80px"
            color={COLORS.pureWhite}
            letterSpacing="0"
            textTransform="uppercase"
            position="absolute"
            top="30px"
            left="40px"
            transform="rotate(-18deg)"
            transformOrigin="left top"
            opacity={0.9}
          >
            进步
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="48px"
            color={COLORS.gold}
            letterSpacing="0"
            textTransform="uppercase"
            position="absolute"
            bottom="40px"
            right="60px"
            transform="rotate(-18deg)"
            transformOrigin="right bottom"
          >
            不可阻挡
          </Text>
          {/* Decorative vertical line */}
          <Box
            position="absolute"
            top={0}
            left="50%"
            w="3px"
            h="100%"
            bg={COLORS.pureWhite}
            opacity={0.15}
          />
          {/* Second diagonal crossing line */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="200%"
            h="2px"
            bg={COLORS.pureWhite}
            opacity={0.1}
            transform="rotate(35deg)"
            transformOrigin="left top"
          />
        </Box>
      </Box>

      {/* Cross/plus shape at end of diagonal section */}
      <Box position="relative" h="60px" mx={{ base: "32px", md: "80px" }}>
        {/* Horizontal bar of cross */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="36px"
          h="3px"
          bg={COLORS.electricCyan}
          opacity={0.15}
        />
        {/* Vertical bar of cross */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="3px"
          h="36px"
          bg={COLORS.electricCyan}
          opacity={0.15}
        />
        {/* Repeating triangle border pattern */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
          <Box
            key={`tri-border-${i}`}
            position="absolute"
            bottom="4px"
            left={`${i * 40 + 10}px`}
            w="0"
            h="0"
            borderLeft="6px solid transparent"
            borderRight="6px solid transparent"
            borderBottom={`8px solid ${COLORS.velocityOrange}`}
            opacity={0.1}
          />
        ))}
      </Box>

      {/* Concentric circles between diagonal and mono sections */}
      <Box h="80px" position="relative" mx={{ base: "32px", md: "80px" }} overflow="hidden">
        {/* Outermost ring */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="120px"
          h="120px"
          borderRadius="50%"
          border={`1px solid ${COLORS.electricCyan}`}
          opacity={0.08}
        />
        {/* Middle ring */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="80px"
          h="80px"
          borderRadius="50%"
          border={`1px solid ${COLORS.electricCyan}`}
          opacity={0.1}
        />
        {/* Inner ring */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="40px"
          h="40px"
          borderRadius="50%"
          border={`1.5px solid ${COLORS.electricCyan}`}
          opacity={0.14}
        />
        {/* Center dot */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={COLORS.electricCyan}
          opacity={0.2}
        />
      </Box>

      {/* MONO / CODE */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            05
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
            textTransform="uppercase"
          >
            等宽字体——机器的声音
          </Text>
        </Flex>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          p="32px"
          position="relative"
        >
          {/* L-shaped corner bracket — top-right framing the code block */}
          <Box
            position="absolute"
            top="8px"
            right="8px"
            w="20px"
            h="20px"
            borderTop={`2px solid ${COLORS.gold}`}
            borderRight={`2px solid ${COLORS.gold}`}
            opacity={0.25}
          />
          {/* L-shaped corner bracket — bottom-left framing the code block */}
          <Box
            position="absolute"
            bottom="8px"
            left="8px"
            w="20px"
            h="20px"
            borderBottom={`2px solid ${COLORS.gold}`}
            borderLeft={`2px solid ${COLORS.gold}`}
            opacity={0.25}
          />
          {/* Red vertical accent */}
          <Box
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            w="3px"
            bg={COLORS.red}
          />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.bold}
            fontSize="11px"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color={COLORS.red}
            mb="16px"
          >
            ui-monospace / SF Mono / Menlo / Consolas
          </Text>
          <VStack align="stretch" gap="2px">
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.metalWhite} opacity={0.4}>
              $ devpod up --provider docker
            </Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.metalWhite} opacity={0.4}>
              [INFO] Creating workspace...
            </Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.statusGreen}>
              [DONE] Workspace ready in 12.4s
            </Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.metalWhite} opacity={0.4}>
              $ devpod status my-workspace
            </Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>
              RUNNING | CPU: 23% | MEM: 512MB | DISK: 2.1GB
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Final geometric composition before back link */}
      <Box position="relative" h="40px" mx={{ base: "32px", md: "80px" }} overflow="hidden">
        {/* Diagonal slash */}
        <Box
          position="absolute"
          top="0"
          right="30%"
          w="200px"
          h="2px"
          bg={COLORS.red}
          opacity={0.1}
          transform="rotate(-20deg)"
          transformOrigin="right center"
        />
        {/* Small rotated square */}
        <Box
          position="absolute"
          top="8px"
          left="50px"
          w="16px"
          h="16px"
          border={`1.5px solid ${COLORS.gold}`}
          opacity={0.15}
          transform="rotate(45deg)"
        />
        {/* Small circle overlapping */}
        <Box
          position="absolute"
          top="10px"
          left="62px"
          w="12px"
          h="12px"
          borderRadius="50%"
          border={`1px solid ${COLORS.velocityOrange}`}
          opacity={0.12}
        />
        {/* Repeating small triangles */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Box
            key={`final-tri-${i}`}
            position="absolute"
            bottom="2px"
            left={`${200 + i * 30}px`}
            w="0"
            h="0"
            borderLeft="5px solid transparent"
            borderRight="5px solid transparent"
            borderBottom={`7px solid ${COLORS.electricCyan}`}
            opacity={0.08}
          />
        ))}
      </Box>

      {/* BACK */}
      <Box px="80px" py="32px">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex
            align="center"
            gap="8px"
            cursor="pointer"
            _hover={{ gap: "16px" }}
            transition={`gap ${DURATION.fast}s ease`}
          >
            <Text fontFamily={FONT.mono} fontSize="18px" color={COLORS.red}>
              &#8592;
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="13px"
              letterSpacing="0.04em"
              textTransform="uppercase"
              color={COLORS.black}
            >
              返回索引
            </Text>
          </Flex>
        </Link>
      </Box>
    </Box>
  );
}
