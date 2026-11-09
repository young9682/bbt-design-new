import { Box, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, SHADOW } from "../../Theme";

export default function SceneHero() {
  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete}>
      {/* 底层：黑色建筑平面，从左下升起 */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="60%"
        bg={COLORS.black}
        clipPath="polygon(0 35%, 100% 0%, 100% 100%, 0% 100%)"
        zIndex={1}
      />

      {/* 红色楔形 — 从左下刺入空间 */}
      <Box
        position="absolute"
        bottom="0"
        left="-6%"
        w="78%"
        h="82%"
        bg={COLORS.red}
        clipPath="polygon(0 50%, 100% 0%, 100% 100%, 0% 100%)"
        zIndex={2}
      />

      {/* 金色矩形 — 倾斜浮于左上，制造前景深度 */}
      <Box
        position="absolute"
        top="10%"
        left="6%"
        w={{ base: "72px", md: "120px" }}
        h={{ base: "48px", md: "72px" }}
        bg={COLORS.gold}
        boxShadow={SHADOW.gold}
        transform="perspective(500px) rotateY(-12deg) rotateX(6deg)"
        zIndex={3}
      />

      {/* 电青色速度线 — 从右上斜切 */}
      <Box
        position="absolute"
        top="8%"
        right="4%"
        w={{ base: "100px", md: "200px" }}
        h="3px"
        bg={COLORS.electricCyan}
        transform="rotate(-28deg)"
        transformOrigin="right center"
        zIndex={3}
      />
      <Box
        position="absolute"
        top="16%"
        right="10%"
        w={{ base: "70px", md: "140px" }}
        h="2px"
        bg={COLORS.electricCyan}
        transform="rotate(-28deg)"
        transformOrigin="right center"
        opacity={0.5}
        zIndex={3}
      />

      {/* 电青色菱形 — 右下空间标记 */}
      <Box
        position="absolute"
        bottom="16%"
        right="14%"
        w={{ base: "32px", md: "52px" }}
        h={{ base: "32px", md: "52px" }}
        bg={COLORS.electricCyan}
        opacity={0.22}
        transform="rotate(45deg)"
        zIndex={2}
      />

      {/* 主标题层 — 右上，压在深色区域上确保可读 */}
      <Box
        position="absolute"
        top={{ base: "24px", md: "40px" }}
        right={{ base: "20px", md: "48px" }}
        zIndex={10}
        textAlign="right"
        maxW={{ base: "58%", md: "46%" }}
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "24px", md: "36px" }}
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="0.02em"
          sx={{
            textShadow: `2px 2px 0 ${COLORS.black}`,
          }}
        >
          以红色楔形
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "24px", md: "36px" }}
          lineHeight={0.9}
          color={COLORS.electricCyan}
          letterSpacing="0.02em"
          mt="2px"
          sx={{
            textShadow: `2px 2px 0 ${COLORS.black}`,
          }}
        >
          刺入白色
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.light}
          fontSize={{ base: "9px", md: "11px" }}
          color={COLORS.metalWhite}
          mt={{ base: "8px", md: "12px" }}
          letterSpacing="0.08em"
          opacity={0.7}
        >
          BBT DESIGN SYSTEM // 布局样板房
        </Text>
      </Box>

      {/* 左下编号标签 */}
      <Box
        position="absolute"
        bottom={{ base: "16px", md: "24px" }}
        left={{ base: "16px", md: "32px" }}
        zIndex={10}
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize={{ base: "10px", md: "12px" }}
          color={COLORS.gold}
          letterSpacing="0.1em"
        >
          05-03
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.light}
          fontSize={{ base: "8px", md: "9px" }}
          color={COLORS.metalWhite}
          opacity={0.5}
          letterSpacing="0.06em"
        >
          HERO // 全屏首屏
        </Text>
      </Box>
    </Box>
  );
}
