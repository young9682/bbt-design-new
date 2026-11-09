import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

const M = { Box: motion(Box) };

export default function SceneArticle() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p={{ base: "12px", md: "16px" }} position="relative">
      {/* Decorative clipped red block */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="100px"
        h="100px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        opacity={0.12}
        zIndex={0}
      />

      {/* Article header */}
      <Box position="relative" zIndex={1} mb="16px">
        <Flex align="center" gap="8px" mb="8px">
          <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" />
          <Text
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.black}
            color={COLORS.gold}
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            05-02 // 文档
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "18px", md: "22px" }}
          color={COLORS.black}
          lineHeight={0.95}
          letterSpacing="-0.01em"
        >
          设计规范要点
        </Text>
        <Box h="3px" bg={COLORS.red} mt="10px" w={{ base: "60px", md: "100px" }} />
      </Box>

      {/* Meta bar */}
      <Flex
        position="relative"
        zIndex={1}
        bg={COLORS.black}
        px="12px"
        py="8px"
        mb="12px"
        justify="space-between"
        align="center"
      >
        <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.metalWhite} opacity={0.7}>
          作者 // BBT LAB
        </Text>
        <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.gold}>
          2026-08-17
        </Text>
      </Flex>

      {/* Article body */}
      <Grid
        position="relative"
        zIndex={1}
        templateColumns={{ base: "1fr", md: "1fr 80px" }}
        gap="12px"
      >
        <Box>
          {[
            { w: "100%", h: "14px" },
            { w: "100%", h: "14px" },
            { w: "80%", h: "14px" },
            { w: "100%", h: "14px", bg: COLORS.pureWhite, border: true },
            { w: "100%", h: "14px" },
            { w: "60%", h: "14px" },
          ].map((line, i) => (
            <M.Box
              key={i}
              w={line.w}
              h={line.h}
              mb="10px"
              bg={line.bg || COLORS.pureWhite}
              border={line.border ? `${BORDER.standard} ${COLORS.black}` : `${BORDER.hairline} ${COLORS.industrialBlack}`}
              boxShadow={line.border ? SHADOW.small : "none"}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: i * 0.05 }}
            />
          ))}
        </Box>

        {/* Right margin decorations */}
        <Box display={{ base: "none", md: "block" }} position="relative">
          <Box position="absolute" top="0" right="0" w="3px" h="60px" bg={COLORS.gold} />
          <Box position="absolute" top="80px" right="20px" w="24px" h="24px" border={`${BORDER.heavy} ${COLORS.red}`} transform="rotate(45deg)" />
          <Box position="absolute" top="140px" right="0" w="2px" h="80px" bg={COLORS.electricCyan} transform="rotate(-10deg)" transformOrigin="top" />
        </Box>
      </Grid>
    </Box>
  );
}
