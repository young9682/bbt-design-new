import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, TOKENS } from "../../Theme";

export default function SceneEmptyState() {
  return (
    <Flex
      h="100%"
      minH="100%"
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="center"
      gap={{ base: SPACE.lg, md: SPACE.xl }}
      bg={COLORS.concrete}
      p={{ base: SPACE.md, md: SPACE.xl }}
      overflow="auto"
    >
      {/* Geometric warning mark: rotated red square + accents */}
      <Box
        position="relative"
        w={{ base: "100px", md: "140px" }}
        h={{ base: "100px", md: "140px" }}
        flexShrink={0}
      >
        <Box
          position="absolute"
          inset={0}
          m="auto"
          w={{ base: "72px", md: "96px" }}
          h={{ base: "72px", md: "96px" }}
          bg={COLORS.red}
          border={`${BORDER.heavy} ${COLORS.redDark}`}
          boxShadow={SHADOW.red}
          transform="rotate(45deg)"
        />
        <Text
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "40px", md: "56px" }}
          color={COLORS.pureWhite}
          lineHeight={1}
          zIndex={1}
        >
          !
        </Text>
        <Box
          position="absolute"
          bottom="8px"
          left="8px"
          w="24px"
          h="24px"
          bg={COLORS.gold}
          border={`${BORDER.standard} ${COLORS.goldDark}`}
          boxShadow={SHADOW.gold}
          zIndex={2}
        />
        <Box
          position="absolute"
          top="4px"
          right="4px"
          w="8px"
          h="48px"
          bg={COLORS.electricCyan}
          boxShadow={SHADOW.cyan}
          zIndex={2}
        />
      </Box>

      {/* Text block and actions */}
      <Flex
        direction="column"
        align={{ base: "center", md: "flex-start" }}
        textAlign={{ base: "center", md: "left" }}
        gap={SPACE.sm}
        maxW="320px"
      >
        <Text {...TOKENS.label} color={COLORS.velocityOrange}>
          NO SIGNAL
        </Text>

        <Text
          {...TOKENS.headingHero}
          fontSize={{ base: "28px", md: "36px" }}
          color={COLORS.black}
        >
          无数据信号
        </Text>

        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="13px"
          color={COLORS.industrialBlack}
          lineHeight={1.4}
        >
          系统未读取指定数据流。请检查筛选条件或重试连接。
        </Text>

        <Text
          fontFamily={FONT.mono}
          fontSize="11px"
          color={COLORS.electricCyan}
          letterSpacing="0.05em"
        >
          ERR_CODE: 0x4E2
        </Text>

        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={SPACE.sm}
          mt={SPACE.sm}
          w={{ base: "100%", md: "auto" }}
        >
          <Button
            bg={COLORS.red}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            boxShadow={SHADOW.red}
            borderRadius={0}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            letterSpacing="0.08em"
            textTransform="uppercase"
            fontSize="12px"
            px={SPACE.lg}
            py="12px"
            h="auto"
            _hover={{
              bg: COLORS.redLight,
              transform: "translateY(-2px)",
              boxShadow: SHADOW.red,
            }}
            _active={{ transform: "translateY(0)", boxShadow: SHADOW.red }}
            transition={`all ${DURATION.fast}s ease`}
          >
            重试
          </Button>
          <Button
            bg={COLORS.pureWhite}
            color={COLORS.black}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            borderRadius={0}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.bold}
            letterSpacing="0.05em"
            textTransform="uppercase"
            fontSize="12px"
            px={SPACE.lg}
            py="12px"
            h="auto"
            _hover={{
              bg: COLORS.metalWhite,
              transform: "translateY(-2px)",
              boxShadow: SHADOW.large,
            }}
            _active={{ transform: "translateY(0)", boxShadow: SHADOW.medium }}
            transition={`all ${DURATION.fast}s ease`}
          >
            返回
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
