import { Box, Grid, Text, Flex } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE } from "../../Theme";

export default function SceneEditorial() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p={{ base: SPACE.sm, md: SPACE.md }}>
      {/* Top instrument bar */}
      <Flex h="4px" mb={SPACE.md} gap="1px">
        <Box flex="3" h="100%" bg={COLORS.red} />
        <Box flex="1" h="100%" bg={COLORS.velocityOrange} />
        <Box flex="2" h="100%" bg={COLORS.gold} />
        <Box flex="1" h="100%" bg={COLORS.electricCyan} />
        <Box flex="1" h="100%" bg={COLORS.signalGreen} />
        <Box flex="2" h="100%" bg={COLORS.black} />
      </Flex>

      {/* Issue meta */}
      <Flex justify="space-between" align="baseline" mb={SPACE.md} px={{ base: 0, md: SPACE.xs }}>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          fontWeight={WEIGHT.black}
          color={COLORS.red}
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          MAG // 05-04
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          fontWeight={WEIGHT.bold}
          color={COLORS.industrialBlack}
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          EDITORIAL
        </Text>
      </Flex>

      {/* Main editorial grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "1.15fr 0.85fr" }}
        gap={{ base: SPACE.md, md: SPACE.lg }}
        position="relative"
      >
        {/* Left column: large image block */}
        <Box position="relative">
          <Box
            position="relative"
            h={{ base: "220px", md: "100%", lg: "360px" }}
            minH={{ base: "220px", md: "320px" }}
            bg={COLORS.metalWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.large}
            overflow="hidden"
          >
            {/* Geometric image placeholder */}
            <Box
              position="absolute"
              inset="0"
              bg={`linear-gradient(135deg, ${COLORS.black} 0%, ${COLORS.industrialBlack} 40%, ${COLORS.red} 40%, ${COLORS.redLight} 70%, ${COLORS.gold} 70%, ${COLORS.goldLight} 100%)`}
            />

            {/* Diagonal black plane */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg={COLORS.black}
              clipPath="polygon(0 0, 55% 0, 35% 100%, 0 100%)"
              opacity={0.86}
            />

            {/* Red wedge cutting in */}
            <Box
              position="absolute"
              top="0"
              right="0"
              w="45%"
              h="100%"
              bg={COLORS.red}
              clipPath="polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
              opacity={0.9}
            />

            {/* Floating gold rectangle */}
            <Box
              position="absolute"
              top="18%"
              left="12%"
              w={{ base: "48px", md: "72px" }}
              h={{ base: "72px", md: "108px" }}
              bg={COLORS.gold}
              boxShadow={SHADOW.gold}
              transform="perspective(500px) rotateY(-14deg) rotateX(8deg)"
              zIndex={2}
            />

            {/* Cyan signal line */}
            <Box
              position="absolute"
              bottom="22%"
              left="8%"
              w={{ base: "80px", md: "140px" }}
              h="3px"
              bg={COLORS.electricCyan}
              transform="rotate(-8deg)"
              zIndex={3}
            />

            {/* Image caption */}
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              bg={COLORS.black}
              px={SPACE.md}
              py={SPACE.sm}
              zIndex={4}
            >
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                fontWeight={WEIGHT.bold}
                color={COLORS.metalWhite}
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                图 01 // 几何构成空间构成，1920
              </Text>
            </Box>
          </Box>

          {/* Overlapping geometric index */}
          <Box
            position="absolute"
            top="-12px"
            left="-12px"
            w="40px"
            h="40px"
            bg={COLORS.red}
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={5}
            border={`${BORDER.standard} ${COLORS.black}`}
            boxShadow={SHADOW.small}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="12px"
              fontWeight={WEIGHT.black}
              color={COLORS.pureWhite}
            >
              01
            </Text>
          </Box>
        </Box>

        {/* Right column: asymmetric text stack */}
        <Box position="relative" pt={{ base: 0, md: SPACE.lg }}>
          {/* Category label */}
          <Flex align="center" gap={SPACE.sm} mb={SPACE.sm}>
            <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" />
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              fontWeight={WEIGHT.black}
              color={COLORS.gold}
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              专题 // 排版规范
            </Text>
          </Flex>

          {/* Main headline */}
          <Box mb={SPACE.md}>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "26px", md: "30px", lg: "34px" }}
              lineHeight={0.9}
              letterSpacing="-0.02em"
              color={COLORS.black}
            >
              红色楔形
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "26px", md: "30px", lg: "34px" }}
              lineHeight={0.9}
              letterSpacing="-0.02em"
              color={COLORS.red}
              mt="2px"
            >
              刺入版面
            </Text>
          </Box>

          {/* Author / date bar */}
          <Flex
            bg={COLORS.black}
            px={SPACE.md}
            py={SPACE.sm}
            mb={SPACE.md}
            justify="space-between"
            align="center"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              fontWeight={WEIGHT.bold}
              color={COLORS.metalWhite}
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              作者 // 设计组
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              fontWeight={WEIGHT.bold}
              color={COLORS.gold}
              letterSpacing="0.08em"
            >
              2026.08.17
            </Text>
          </Flex>

          {/* Body copy */}
          <Box mb={SPACE.md}>
            <Text
              fontFamily={FONT.sans}
              fontSize="13px"
              fontWeight={WEIGHT.regular}
              lineHeight={1.55}
              color={COLORS.black}
              mb={SPACE.sm}
            >
              几何构成排版拒绝居中与对称。它把版面当作建筑工地：黑色的地基、红色的斜面、金色的悬挑体块，在二维平面上争夺空间。
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontSize="13px"
              fontWeight={WEIGHT.regular}
              lineHeight={1.55}
              color={COLORS.industrialBlack}
              mb={SPACE.sm}
            >
              文字不再是温顺的填充物。标题以九百字重砸向左侧，正文被挤压成狭窄的竖栏，注释则像铆钉一样散落在边缘。每一个空白都是主动切割出来的负形。
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontSize="13px"
              fontWeight={WEIGHT.regular}
              lineHeight={1.55}
              color={COLORS.industrialBlack}
            >
              硬阴影是这股力量的签名。没有柔边、没有渐变，只有纯粹的偏移与重量。当屏幕收窄，所有块面垂直堆叠——但几何的对抗从未消失。
            </Text>
          </Box>

          {/* Pull quote */}
          <Box
            position="relative"
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            p={SPACE.md}
            mt={{ base: 0, md: SPACE.md }}
            ml={{ base: 0, md: "-40px" }}
            zIndex={6}
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
              fontSize="15px"
              fontWeight={WEIGHT.black}
              lineHeight={1.25}
              color={COLORS.black}
              pl={SPACE.sm}
            >
              “几何即意义，阴影即重量，空白即切割。”
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              fontWeight={WEIGHT.bold}
              color={COLORS.gold}
              letterSpacing="0.08em"
              textTransform="uppercase"
              mt={SPACE.sm}
              pl={SPACE.sm}
            >
              —— 设计规范
            </Text>
          </Box>
        </Box>
      </Grid>

      {/* Bottom decorations */}
      <Flex mt={SPACE.lg} gap={SPACE.sm} align="flex-start" position="relative">
        <Box w="32px" h="32px" bg={COLORS.electricCyan} transform="rotate(45deg)" flexShrink={0} />
        <Box flex={1}>
          <Box h="2px" bg={COLORS.black} mb={SPACE.xs} />
          <Box h="2px" bg={COLORS.red} w="60%" mb={SPACE.xs} />
          <Box h="2px" bg={COLORS.gold} w="40%" />
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          fontWeight={WEIGHT.bold}
          color={COLORS.industrialBlack}
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          继续阅读 02
        </Text>
      </Flex>
    </Box>
  );
}
