import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

interface MissionRow {
  id: string;
  name: string;
  status: "运行中" | "待机" | "告警" | "离线";
  priority: "P0" | "P1" | "P2";
  system: string;
  value: number;
  unit: string;
  updatedAt: string;
}

const missions: MissionRow[] = [
  { id: "M-1047", name: "权限同步 // 监控节点", status: "运行中", priority: "P0", system: "AUTH-α", value: 98.4, unit: "%", updatedAt: "09:14:22" },
  { id: "M-1046", name: "接口压力自检", status: "待机", priority: "P1", system: "API-7", value: 14.2, unit: "ms", updatedAt: "09:12:07" },
  { id: "M-1045", name: "太阳能电池板展开", status: "运行中", priority: "P0", system: "SOL-2", value: 312.0, unit: "W", updatedAt: "09:10:55" },
  { id: "M-1044", name: "热控循环泵流量", status: "告警", priority: "P0", system: "THERM-9", value: 4.8, unit: "L/m", updatedAt: "09:09:33" },
  { id: "M-1043", name: "姿态确定与控制系统", status: "运行中", priority: "P1", system: "ADCS-1", value: 0.003, unit: "°/s", updatedAt: "09:08:17" },
  { id: "M-1042", name: "地面链路握手", status: "离线", priority: "P2", system: "COM-4", value: 0, unit: "dBm", updatedAt: "08:57:41" },
  { id: "M-1041", name: "星载计算机负载", status: "运行中", priority: "P1", system: "OBC-0", value: 67.3, unit: "%", updatedAt: "09:14:01" },
  { id: "M-1040", name: "储能模块温度", status: "待机", priority: "P2", system: "BATT-3", value: 18.6, unit: "°C", updatedAt: "09:11:19" },
];

const statusConfig: Record<MissionRow["status"], { color: string; shadow: string }> = {
  运行中: { color: COLORS.statusGreen, shadow: SHADOW.cyan },
  待机: { color: COLORS.statusAmber, shadow: SHADOW.gold },
  告警: { color: COLORS.statusRed, shadow: SHADOW.red },
  离线: { color: COLORS.industrialBlack, shadow: SHADOW.medium },
};

const priorityConfig: Record<MissionRow["priority"], { bg: string; border: string; color: string }> = {
  P0: { bg: COLORS.red, border: COLORS.redDark, color: COLORS.pureWhite },
  P1: { bg: COLORS.gold, border: COLORS.goldDark, color: COLORS.black },
  P2: { bg: COLORS.metalWhite, border: COLORS.black, color: COLORS.black },
};

const columns = [
  { key: "id", label: "任务 ID", width: "96px" },
  { key: "name", label: "任务名称", width: "1fr" },
  { key: "status", label: "状态", width: "104px" },
  { key: "priority", label: "优先级", width: "72px" },
  { key: "system", label: "系统", width: "96px" },
  { key: "value", label: "指标值", width: "104px" },
  { key: "updatedAt", label: "更新时间", width: "96px" },
];

export default function SceneResponsiveTable() {
  return (
    <Box
      h="100%"
      overflow="auto"
      bg={COLORS.concrete}
      p={SPACE.md}
      position="relative"
    >
      {/* Decorative red wedge */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="120px"
        h="120px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        zIndex={0}
      />

      {/* Decorative gold diagonal */}
      <Box
        position="absolute"
        top="30%"
        left="-24px"
        w="160px"
        h="3px"
        bg={COLORS.gold}
        transform="rotate(-12deg)"
        zIndex={0}
        opacity={0.7}
      />

      {/* Decorative red square */}
      <Box
        position="absolute"
        bottom={SPACE.lg}
        left={SPACE.lg}
        w="32px"
        h="32px"
        bg={COLORS.red}
        zIndex={0}
        boxShadow={SHADOW.red}
      />

      {/* Instrument color strip */}
      <Flex
        position="relative"
        zIndex={1}
        h="4px"
        mb={SPACE.md}
        borderTop={`1px solid ${COLORS.black}`}
      >
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>

      {/* Title block */}
      <Flex
        position="relative"
        zIndex={1}
        align="flex-end"
        justify="space-between"
        mb={SPACE.md}
        gap={SPACE.md}
      >
        <Flex align="flex-start" gap={SPACE.sm}>
          <Box w="40px" h="40px" bg={COLORS.red} flexShrink={0} boxShadow={SHADOW.red} />
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="18px"
              letterSpacing="-0.02em"
              lineHeight={0.9}
              textTransform="uppercase"
              color={COLORS.black}
            >
              任务指标表
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              color={COLORS.industrialBlack}
              opacity={0.7}
              mt="4px"
            >
              MISSION TELEMETRY // TABLE REF
            </Text>
          </Box>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          fontWeight={WEIGHT.bold}
          color={COLORS.gold}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          8 ENTRIES // SYNCED
        </Text>
      </Flex>

      {/* Table card */}
      <Box
        position="relative"
        zIndex={1}
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.large}
        overflow="hidden"
      >
        {/* Horizontal scroll wrapper */}
        <Box overflowX="auto" overflowY="hidden">
          <Box minW="720px">
            {/* Header */}
            <Grid
              templateColumns={columns.map((c) => c.width).join(" ")}
              gap={SPACE.sm}
              bg={COLORS.black}
              px={SPACE.md}
              py={SPACE.sm}
              borderBottom={`4px solid ${COLORS.red}`}
            >
              {columns.map((col) => (
                <Text
                  key={col.key}
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="11px"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color={COLORS.pureWhite}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {col.label}
                </Text>
              ))}
            </Grid>

            {/* Rows */}
            {missions.map((mission) => (
              <Grid
                key={mission.id}
                templateColumns={columns.map((c) => c.width).join(" ")}
                gap={SPACE.sm}
                alignItems="center"
                px={SPACE.md}
                py={SPACE.sm}
                bg={COLORS.pureWhite}
                borderBottom={`${BORDER.hairline} ${COLORS.black}`}
                transition={`all ${DURATION.fast}s ease`}
                _hover={{
                  transform: "translateY(-2px)",
                  bg: COLORS.metalWhite,
                  boxShadow: `inset 4px 0 0 ${COLORS.red}`,
                }}
                _last={{ borderBottom: "none" }}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="13px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {mission.id}
                </Text>

                <Text
                  fontFamily={FONT.sans}
                  fontSize="13px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.black}
                >
                  {mission.name}
                </Text>

                <Flex align="center" gap="6px">
                  <Box
                    w="8px"
                    h="8px"
                    bg={statusConfig[mission.status].color}
                    boxShadow={statusConfig[mission.status].shadow}
                  />
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="12px"
                    fontWeight={WEIGHT.bold}
                    color={statusConfig[mission.status].color}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {mission.status}
                  </Text>
                </Flex>

                <Flex
                  align="center"
                  justify="center"
                  px="8px"
                  py="2px"
                  bg={priorityConfig[mission.priority].bg}
                  border={`${BORDER.standard} ${priorityConfig[mission.priority].border}`}
                  boxShadow={SHADOW.small}
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    fontWeight={WEIGHT.black}
                    color={priorityConfig[mission.priority].color}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {mission.priority}
                  </Text>
                </Flex>

                <Text
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.industrialBlack}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {mission.system}
                </Text>

                <Text
                  fontFamily={FONT.mono}
                  fontSize="13px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.electricCyan}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {mission.value.toFixed(mission.value < 1 ? 3 : 1)} {mission.unit}
                </Text>

                <Text
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.industrialBlack}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {mission.updatedAt}
                </Text>
              </Grid>
            ))}
          </Box>
        </Box>

        {/* Bottom gold accent line */}
        <Box h="3px" bg={COLORS.gold} />
      </Box>
    </Box>
  );
}
