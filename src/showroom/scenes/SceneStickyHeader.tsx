import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

const rows = [
  { id: "JOB-9A1", label: "渲染帧序列", status: "RUNNING", time: "14:02:31", metric: "78%" },
  { id: "JOB-7F4", label: "数据同步", status: "COMPLETE", time: "14:01:18", metric: "100%" },
  { id: "JOB-3C2", label: "模型推理", status: "RUNNING", time: "13:58:07", metric: "42%" },
  { id: "JOB-8E5", label: "证书更新", status: "PENDING", time: "13:55:44", metric: "—" },
  { id: "JOB-1B0", label: "索引重建", status: "ERROR", time: "13:52:11", metric: "FAIL" },
  { id: "JOB-2D7", label: "日志压缩", status: "COMPLETE", time: "13:49:59", metric: "2.4G" },
  { id: "JOB-6A3", label: "备份校验", status: "RUNNING", time: "13:47:22", metric: "61%" },
  { id: "JOB-4F9", label: "负载均衡", status: "PENDING", time: "13:44:08", metric: "—" },
  { id: "JOB-5K2", label: "缓存预热", status: "COMPLETE", time: "13:41:55", metric: "OK" },
  { id: "JOB-0H6", label: "镜像拉取", status: "RUNNING", time: "13:38:40", metric: "35%" },
];

const statusColor: Record<string, string> = {
  RUNNING: COLORS.signalGreen,
  COMPLETE: COLORS.electricCyan,
  PENDING: COLORS.statusAmber,
  ERROR: COLORS.statusRed,
};

export default function SceneStickyHeader() {
  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border={`${BORDER.standard} ${COLORS.black}`}
      position="relative"
    >
      {/* Decorative clipped red triangle */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="64px"
        h="64px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        zIndex={0}
        opacity={0.9}
      />

      {/* Decorative rotated gold square */}
      <Box
        position="absolute"
        bottom="20px"
        left="16px"
        w="24px"
        h="24px"
        border={`${BORDER.heavy} ${COLORS.gold}`}
        transform="rotate(45deg)"
        zIndex={0}
        opacity={0.85}
      />

      {/* Decorative diagonal gold line */}
      <Box
        position="absolute"
        top="45%"
        left="-16px"
        w="120px"
        h="2px"
        bg={COLORS.gold}
        transform="rotate(-12deg)"
        zIndex={0}
        opacity={0.5}
      />

      {/* Sticky header */}
      <Flex
        position="sticky"
        top={0}
        zIndex={2}
        bg={COLORS.black}
        borderBottom={`4px solid ${COLORS.red}`}
        px={{ base: "10px", md: "14px" }}
        py="10px"
        justify="space-between"
        align="center"
        boxShadow={`0 4px 0 ${COLORS.black}33`}
      >
        <Flex align="center" gap="10px">
          <Box w="10px" h="10px" bg={COLORS.red} transform="rotate(45deg)" />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "11px", md: "12px" }}
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
          >
            系统遥测 // TELEMETRY
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize={{ base: "9px", md: "10px" }}
          color={COLORS.metalWhite}
          opacity={0.7}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          STICKY HEADER REF
        </Text>
      </Flex>

      {/* Scrollable content */}
      <Box flex={1} overflowY="auto" bg={COLORS.concrete} p={{ base: "10px", md: "14px" }}>
        <VStack align="stretch" gap="10px" position="relative" zIndex={1}>
          {rows.map((row, i) => (
            <Flex
              key={row.id}
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.medium}
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
              align="center"
              pl={{ base: "8px", md: "10px" }}
              pr={{ base: "10px", md: "14px" }}
              py={{ base: "10px", md: "12px" }}
              ml={i % 3 === 1 ? { base: "0", md: "8px" } : "0"}
              mr={i % 3 === 2 ? { base: "0", md: "8px" } : "0"}
            >
              {/* Status accent bar */}
              <Box
                w="4px"
                h="32px"
                bg={statusColor[row.status]}
                flexShrink={0}
                mr={{ base: "10px", md: "14px" }}
              />

              {/* ID + label */}
              <Box flex={1} minW="0">
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "10px", md: "12px" }}
                  color={COLORS.black}
                  lineHeight={1}
                  mb="4px"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {row.id}
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize={{ base: "9px", md: "10px" }}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={COLORS.industrialBlack}
                >
                  {row.label}
                </Text>
              </Box>

              {/* Status + metric */}
              <Flex
                align="center"
                gap={{ base: "8px", md: "14px" }}
                flexShrink={0}
              >
                <Flex align="center" gap="6px">
                  <Box w="8px" h="8px" bg={statusColor[row.status]} />
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize={{ base: "9px", md: "10px" }}
                    color={statusColor[row.status]}
                    display={{ base: "none", sm: "block" }}
                  >
                    {row.status}
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.mono}
                  fontSize={{ base: "9px", md: "10px" }}
                  color={COLORS.industrialBlack}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                  minW={{ base: "36px", md: "44px" }}
                  textAlign="right"
                >
                  {row.time}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "10px", md: "12px" }}
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                  minW={{ base: "32px", md: "40px" }}
                  textAlign="right"
                >
                  {row.metric}
                </Text>
              </Flex>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
