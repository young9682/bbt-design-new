import { Box, Flex, Grid, Text, Button } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

const items = [
  { id: "UNIT-01", type: "COMPUTE", status: "ACTIVE", load: "78%", uptime: "14D 06H" },
  { id: "UNIT-02", type: "STORAGE", status: "ACTIVE", load: "42%", uptime: "09D 12H" },
  { id: "UNIT-03", type: "NETWORK", status: "WARNING", load: "91%", uptime: "03D 22H" },
  { id: "UNIT-04", type: "COMPUTE", status: "ACTIVE", load: "65%", uptime: "11D 04H" },
  { id: "UNIT-05", type: "MEMORY", status: "ERROR", load: "99%", uptime: "00D 01H" },
  { id: "UNIT-06", type: "STORAGE", status: "ACTIVE", load: "33%", uptime: "07D 18H" },
  { id: "UNIT-07", type: "COMPUTE", status: "PENDING", load: "—", uptime: "—" },
  { id: "UNIT-08", type: "NETWORK", status: "ACTIVE", load: "54%", uptime: "05D 09H" },
];

const statusColor: Record<string, string> = {
  ACTIVE: COLORS.signalGreen,
  WARNING: COLORS.statusAmber,
  ERROR: COLORS.statusRed,
  PENDING: COLORS.electricCyan,
};

const statusLabel: Record<string, string> = {
  ACTIVE: "运行中",
  WARNING: "告警",
  ERROR: "故障",
  PENDING: "待部署",
};

export default function SceneStickyFooter() {
  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border={`${BORDER.standard} ${COLORS.black}`}
      position="relative"
    >
      {/* Decorative clipped red wedge */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="72px"
        h="72px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        zIndex={0}
      />

      {/* Content area */}
      <Box flex={1} overflowY="auto" p="12px" bg={COLORS.concrete} position="relative" zIndex={1}>
        <Grid templateColumns="1fr" gap="12px">
          {items.map((item, i) => (
            <Box
              key={item.id}
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.medium}
              p="12px"
              position="relative"
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
            >
              {/* Geometric index marker */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="28px"
                h="28px"
                bg={i % 3 === 0 ? COLORS.red : i % 3 === 1 ? COLORS.gold : COLORS.electricCyan}
              />

              <Grid templateColumns="1fr auto auto auto" gap={{ base: "8px", md: "16px" }} alignItems="center">
                <Box ml="32px">
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="12px"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={COLORS.black}
                  >
                    {item.id}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="10px"
                    color={COLORS.industrialBlack}
                    opacity={0.7}
                  >
                    {item.type} // {item.uptime}
                  </Text>
                </Box>

                <Flex align="center" gap="6px">
                  <Box w="8px" h="8px" bg={statusColor[item.status]} />
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="10px"
                    fontWeight={WEIGHT.bold}
                    color={statusColor[item.status]}
                    textTransform="uppercase"
                  >
                    {statusLabel[item.status]}
                  </Text>
                </Flex>

                <Text
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  fontWeight={WEIGHT.black}
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.load}
                </Text>

                <Box
                  w="8px"
                  h="32px"
                  bg={COLORS.black}
                  opacity={0.1}
                />
              </Grid>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Sticky footer */}
      <Box
        bg={COLORS.black}
        borderTop={`3px solid ${COLORS.red}`}
        px={{ base: "12px", md: "16px" }}
        py="12px"
        position="relative"
        zIndex={2}
      >
        {/* Instrument strip above footer content */}
        <Flex
          position="absolute"
          top="-6px"
          left="16px"
          right="16px"
          h="3px"
          gap="4px"
          align="center"
        >
          <Box flex={3} h="100%" bg={COLORS.red} />
          <Box flex={1} h="100%" bg={COLORS.gold} />
          <Box flex={2} h="100%" bg={COLORS.black} />
          <Box flex={1} h="100%" bg={COLORS.electricCyan} />
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "12px", sm: "16px" }}
        >
          {/* Status block */}
          <Flex align="center" gap="16px">
            <Flex align="center" gap="8px">
              <Box
                w="10px"
                h="10px"
                bg={COLORS.red}
                animation="pulse 2s infinite"
                sx={{
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.4 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                系统在线
              </Text>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} gap={{ base: "2px", md: "12px" }}>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
                opacity={0.7}
              >
                节点: 8/8
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
                opacity={0.7}
              >
                告警: 1
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
                opacity={0.7}
              >
                故障: 1
              </Text>
            </Flex>
          </Flex>

          {/* Actions */}
          <Flex gap="8px">
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
              fontSize="11px"
              px={SPACE.md}
              py="10px"
              h="auto"
              _hover={{
                bg: COLORS.redLight,
                transform: "translateY(-2px)",
                boxShadow: SHADOW.red,
              }}
              _active={{ transform: "translateY(0)", boxShadow: SHADOW.red }}
              transition={`all ${DURATION.fast}s ease`}
            >
              全部重启
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
              fontSize="11px"
              px={SPACE.md}
              py="10px"
              h="auto"
              _hover={{
                bg: COLORS.metalWhite,
                transform: "translateY(-2px)",
                boxShadow: SHADOW.large,
              }}
              _active={{ transform: "translateY(0)", boxShadow: SHADOW.medium }}
              transition={`all ${DURATION.fast}s ease`}
            >
              导出报告
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
