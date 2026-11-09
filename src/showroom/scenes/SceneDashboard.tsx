import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

const kpis = [
  { label: "OPS/S", value: "14,208", delta: "+12.4%", tone: COLORS.electricCyan },
  { label: "节点", value: "96 / 128", delta: "75% 在线", tone: COLORS.gold },
  { label: "延迟", value: "18 MS", delta: "-2 MS", tone: COLORS.signalGreen },
];

const bars = [
  { label: "00:00", value: 34, color: COLORS.electricCyan },
  { label: "04:00", value: 52, color: COLORS.red },
  { label: "08:00", value: 78, color: COLORS.electricCyan },
  { label: "12:00", value: 64, color: COLORS.gold },
  { label: "16:00", value: 91, color: COLORS.red },
  { label: "20:00", value: 47, color: COLORS.electricCyan },
];

const rows = [
  { id: "POD-07A", status: "RUNNING", cpu: "78%", mem: "4.2G" },
  { id: "POD-12F", status: "PENDING", cpu: "—", mem: "—" },
  { id: "POD-03C", status: "RUNNING", cpu: "42%", mem: "2.1G" },
  { id: "POD-09E", status: "ERROR", cpu: "99%", mem: "7.8G" },
];

const statusColor: Record<string, string> = {
  RUNNING: COLORS.signalGreen,
  PENDING: COLORS.statusAmber,
  ERROR: COLORS.statusRed,
};

export default function SceneDashboard() {
  return (
    <Box
      h="100%"
      overflowY="auto"
      bg={COLORS.concrete}
      p="12px"
      position="relative"
    >
      {/* Decorative clipped red block */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="80px"
        h="80px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        zIndex={0}
      />

      {/* Decorative rotated gold square */}
      <Box
        position="absolute"
        bottom="24px"
        left="24px"
        w="32px"
        h="32px"
        border={`${BORDER.heavy} ${COLORS.gold}`}
        transform="rotate(45deg)"
        zIndex={0}
        opacity={0.9}
      />

      {/* Decorative diagonal gold line */}
      <Box
        position="absolute"
        top="50%"
        left="-20px"
        w="140px"
        h="3px"
        bg={COLORS.gold}
        transform="rotate(-15deg)"
        zIndex={0}
        opacity={0.6}
      />

      {/* Status strip */}
      <Flex
        position="relative"
        zIndex={1}
        bg={COLORS.black}
        borderBottom={`4px solid ${COLORS.red}`}
        px="12px"
        py="8px"
        justify="space-between"
        align="center"
        mb="12px"
      >
        <Flex align="center" gap="8px">
          <Box w="10px" h="10px" borderRadius="50%" bg={COLORS.red} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
          >
            系统状态 // 在线
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.metalWhite}
          opacity={0.7}
        >
          DASHBOARD REF
        </Text>
      </Flex>

      {/* KPI row */}
      <Grid
        position="relative"
        zIndex={1}
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap="12px"
        mb="12px"
      >
        {kpis.map((kpi) => (
          <Box
            key={kpi.label}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            p="12px"
            position="relative"
            transition={`all ${DURATION.fast}s ease`}
            _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              w="28px"
              h="28px"
              bg={COLORS.red}
            />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={COLORS.industrialBlack}
              mb="8px"
              ml="32px"
            >
              {kpi.label}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="22px"
              color={COLORS.black}
              lineHeight={0.95}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {kpi.value}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              color={kpi.tone}
              mt="6px"
            >
              {kpi.delta}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Main content: chart + list */}
      <Grid
        position="relative"
        zIndex={1}
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap="12px"
        h={{ base: "auto", md: "calc(100% - 180px)" }}
      >
        {/* Bar chart area */}
        <Box
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.large}
          p="12px"
          display="flex"
          flexDirection="column"
        >
          <Flex justify="space-between" align="flex-end" mb="12px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="12px"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={COLORS.black}
            >
              吞吐量 // OPS/S
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              color={COLORS.industrialBlack}
            >
              过去 24H
            </Text>
          </Flex>

          <Flex
            flex={1}
            align="flex-end"
            justify="space-between"
            gap="8px"
            minH="80px"
          >
            {bars.map((bar) => (
              <Flex
                key={bar.label}
                direction="column"
                align="center"
                flex={1}
                gap="4px"
              >
                <Box
                  w="100%"
                  maxW="32px"
                  h={`${bar.value}%`}
                  minH="8px"
                  bg={bar.color}
                  boxShadow={SHADOW.small}
                  transition={`all ${DURATION.fast}s ease`}
                  _hover={{ transform: "translateY(-2px)" }}
                />
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={COLORS.industrialBlack}
                  textAlign="center"
                >
                  {bar.label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Mini list area */}
        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          p="12px"
          overflow="auto"
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={COLORS.metalWhite}
            mb="10px"
          >
            节点列表 // POD
          </Text>

          <Grid
            templateColumns="1fr auto auto auto"
            gap="8px"
            borderBottom={`${BORDER.standard} ${COLORS.industrialBlack}`}
            pb="6px"
            mb="6px"
          >
            {["ID", "状态", "CPU", "MEM"].map((head) => (
              <Text
                key={head}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.metalWhite}
                opacity={0.6}
              >
                {head}
              </Text>
            ))}
          </Grid>

          {rows.map((row) => (
            <Grid
              key={row.id}
              templateColumns="1fr auto auto auto"
              gap="8px"
              py="6px"
              borderBottom={`1px solid ${COLORS.industrialBlack}`}
              _last={{ borderBottom: "none" }}
            >
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.pureWhite}
              >
                {row.id}
              </Text>
              <Flex align="center" gap="4px">
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="50%"
                  bg={statusColor[row.status]}
                />
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={statusColor[row.status]}
                >
                  {row.status}
                </Text>
              </Flex>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
              >
                {row.cpu}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
              >
                {row.mem}
              </Text>
            </Grid>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}
