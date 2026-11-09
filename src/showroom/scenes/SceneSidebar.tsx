import { Box, Flex, Grid, Text, VStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

const TOOLS = [
  { label: "控制台", code: "CON", mark: "square" },
  { label: "节点池", code: "NOD", mark: "diamond" },
  { label: "作业流", code: "JOB", mark: "circle" },
  { label: "存储卷", code: "STO", mark: "triangle" },
  { label: "设置", code: "SET", mark: "bar" },
] as const;

function GeometricMark({ type, active }: { type: string; active?: boolean }) {
  const color = active ? COLORS.red : COLORS.gold;
  switch (type) {
    case "square":
      return <Box w="8px" h="8px" bg={color} />;
    case "diamond":
      return <Box w="8px" h="8px" bg={color} transform="rotate(45deg)" />;
    case "circle":
      return <Box w="8px" h="8px" bg={color} borderRadius="50%" />;
    case "triangle":
      return <Box w="10px" h="10px" bg={color} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" />;
    default:
      return <Box w="10px" h="4px" bg={color} />;
  }
}

export default function SceneSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? "48px" : { base: "64px", md: "140px" };

  return (
    <Flex h="100%" overflow="hidden">
      {/* Sidebar — asymmetric tool rail */}
      <Box
        w={sidebarWidth}
        h="100%"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.red}`}
        flexShrink={0}
        position="relative"
        overflow="hidden"
        transition={`width ${DURATION.fast}s ease`}
      >
        {/* Decorative clipped red block */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="44px"
          bg={COLORS.red}
          clipPath="polygon(0 0, 100% 0, 100% 55%, 0 100%)"
          opacity={0.15}
        />

        {/* Sidebar header mark */}
        <Flex
          h="40px"
          align="center"
          justify="center"
          borderBottom={`${BORDER.standard} ${COLORS.industrialBlack}`}
          position="relative"
        >
          <Box w="10px" h="10px" bg={COLORS.red} transform="rotate(45deg)" boxShadow={SHADOW.red} />
        </Flex>

        <VStack align="stretch" gap="0" mt="8px" position="relative">
          {TOOLS.map((tool, index) => (
            <Flex
              key={tool.code}
              h="38px"
              align="center"
              px={collapsed ? "0" : { base: "10px", md: "14px" }}
              justify={collapsed ? "center" : "flex-start"}
              cursor="pointer"
              _hover={{ bg: COLORS.industrialBlack }}
              transition={`background ${DURATION.fast}s ease`}
            >
              <Box flexShrink={0}>
                <GeometricMark type={tool.mark} active={index === 0} />
              </Box>
              {!collapsed && (
                <Text
                  ml="10px"
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize={{ base: "9px", md: "10px" }}
                  color={COLORS.metalWhite}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  display={{ base: "none", md: "block" }}
                >
                  {tool.label}
                </Text>
              )}
            </Flex>
          ))}
        </VStack>

        {/* Bottom index label */}
        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="28px"
          align="center"
          justify="center"
          borderTop={`${BORDER.hairline} ${COLORS.industrialBlack}`}
        >
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            fontWeight={WEIGHT.black}
            color={COLORS.gold}
            letterSpacing="0.1em"
          >
            DS
          </Text>
        </Flex>
      </Box>

      {/* Main content — mini workspace dashboard */}
      <Box flex={1} bg={COLORS.concrete} position="relative" overflow="hidden">
        {/* Diagonal line decoration */}
        <Box
          position="absolute"
          top="0"
          right="96px"
          w="2px"
          h="120%"
          bg={COLORS.red}
          transform="rotate(18deg)"
          transformOrigin="top"
          opacity={0.2}
        />

        {/* Clipped red corner block */}
        <Box
          position="absolute"
          bottom="0"
          right="0"
          w="160px"
          h="110px"
          bg={COLORS.red}
          clipPath="polygon(40% 0, 100% 0, 100% 100%, 0% 100%)"
          opacity={0.08}
        />

        <Flex direction="column" h="100%" p={{ base: "8px", md: "16px" }} position="relative" zIndex={1}>
          {/* Content header */}
          <Flex justify="space-between" align="center" mb="12px" gap="8px">
            <Flex align="center" gap="10px">
              <Box w="10px" h="10px" bg={COLORS.red} transform="rotate(45deg)" />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "12px", md: "14px" }}
                color={COLORS.black}
                letterSpacing="0.02em"
                textTransform="uppercase"
              >
                工作区
              </Text>
            </Flex>
            <Flex align="center" gap="12px">
              <Text
                fontFamily={FONT.mono}
                fontSize={{ base: "9px", md: "10px" }}
                fontWeight={WEIGHT.black}
                color={COLORS.gold}
                letterSpacing="0.12em"
                border={`${BORDER.standard} ${COLORS.gold}`}
                px="8px"
                py="2px"
              >
                MOD-01
              </Text>
              <Button
                size="xs"
                bg={COLORS.black}
                color={COLORS.pureWhite}
                borderRadius={0}
                border={`${BORDER.standard} ${COLORS.industrialBlack}`}
                onClick={() => setCollapsed((c) => !c)}
                fontFamily={FONT.mono}
                fontSize="10px"
                px="8px"
                h="24px"
                _hover={{ bg: COLORS.red }}
              >
                {collapsed ? "展开" : "收起"}
              </Button>
            </Flex>
          </Flex>

          {/* Stat cards */}
          <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="12px">
            {[
              { label: "CPU", value: "84%", color: COLORS.red },
              { label: "MEM", value: "62%", color: COLORS.electricCyan },
              { label: "NET", value: "1.2G", color: COLORS.signalGreen },
            ].map((stat) => (
              <Box
                key={stat.label}
                bg={COLORS.pureWhite}
                border={`${BORDER.heavy} ${COLORS.black}`}
                boxShadow={SHADOW.small}
                p="8px"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top="0" left="0" w="6px" h="6px" bg={stat.color} />
                <Text
                  fontFamily={FONT.sans}
                  fontSize="9px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.industrialBlack}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                >
                  {stat.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "14px", md: "18px" }}
                  color={stat.color}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                  mt="4px"
                >
                  {stat.value}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* Chart panel */}
          <Box
            flex={1}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            p="12px"
            position="relative"
            overflow="hidden"
          >
            <Flex justify="space-between" align="center" mb="10px">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="10px"
                color={COLORS.black}
                letterSpacing="0.06em"
                textTransform="uppercase"
              >
                负载趋势
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.industrialBlack}
                opacity={0.6}
              >
                LIVE // 07:42:18
              </Text>
            </Flex>
            <Flex align="flex-end" gap="6px" h="calc(100% - 34px)">
              {[35, 52, 28, 66, 48, 82, 55, 74, 44, 68, 60, 90].map((h, i) => (
                <Box
                  key={i}
                  flex={1}
                  h={`${h}%`}
                  maxH="100%"
                  bg={i === 11 ? COLORS.red : COLORS.black}
                  opacity={i === 11 ? 1 : 0.75}
                  transition={`height ${DURATION.normal}s ease`}
                />
              ))}
            </Flex>
          </Box>

          {/* Footer status */}
          <Flex
            mt="12px"
            pt="8px"
            borderTop={`${BORDER.hairline} ${COLORS.industrialBlack}`}
            justify="space-between"
            align="center"
          >
            <Flex align="center" gap="8px">
              <Box w="6px" h="6px" bg={COLORS.signalGreen} borderRadius="50%" />
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                fontWeight={WEIGHT.bold}
                color={COLORS.black}
                letterSpacing="0.08em"
              >
                ONLINE
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.industrialBlack}
              opacity={0.6}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              v1.4.2 // build-8842
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
