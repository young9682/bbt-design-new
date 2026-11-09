import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../Theme";

const M = { Box: motion(Box) };

export default function DemoFrame({
  number,
  title,
  height = "360px",
  wide = false,
  note,
  children,
}: {
  number: string;
  title: string;
  height?: string;
  wide?: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <M.Box
      gridColumn={wide ? "1 / -1" : undefined}
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      p={{ base: "12px", md: "16px" }}
      h={height}
      position="relative"
      overflow="hidden"
      sx={{ transition: `box-shadow ${DURATION.fast}s ease` }}
      _hover={{ boxShadow: SHADOW.large }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
    >
      {/* 左侧红色竖条 — 角标装饰 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="4px"
        h="100%"
        bg={COLORS.red}
        opacity={0.15}
        pointerEvents="none"
      />

      {/* 标题行 */}
      <Flex
        justify="space-between"
        align="baseline"
        gap="12px"
        mb="12px"
        pl="8px"
        borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}
        pb="8px"
      >
        <Flex align="baseline" gap="10px" flexWrap="wrap">
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            color={COLORS.gold}
            letterSpacing="0.12em"
          >
            {number}
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "13px", md: "14px" }}
            color={COLORS.black}
            letterSpacing="0.04em"
          >
            {title}
          </Text>
        </Flex>
        {note && (
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.industrialBlack}
            opacity={0.55}
            letterSpacing="0.06em"
            display={{ base: "none", md: "block" }}
          >
            {note}
          </Text>
        )}
      </Flex>

      {/* 演示区 */}
      <Box
        h={`calc(${height} - 72px)`}
        position="relative"
        overflow="hidden"
        ml="4px"
      >
        {children}
      </Box>
    </M.Box>
  );
}
