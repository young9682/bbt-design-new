import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = {
  Flex: motion(Flex),
};

const entries = [
  {
    id: "EVT-0917",
    level: "SUCCESS",
    time: "09:17:04",
    source: "ORBIT-CTL",
    message: "控制节点握手完成，监控链路已建立",
  },
  {
    id: "EVT-0918",
    level: "INFO",
    time: "09:18:22",
    source: "TELEMETRY",
    message: "下行数据速率 14.208 ops/s，延迟 18 ms",
  },
  {
    id: "EVT-0919",
    level: "WARN",
    time: "09:19:11",
    source: "THERMAL",
    message: "三号舱段温度接近阈值，启动备用散热循环",
  },
  {
    id: "EVT-0920",
    level: "ERROR",
    time: "09:20:47",
    source: "POD-09E",
    message: "容器内存占用 7.8G，触发 OOM 保护，已隔离",
  },
  {
    id: "EVT-0921",
    level: "INFO",
    time: "09:21:03",
    source: "SCHEDULER",
    message: "Volcano 队列 cpu-pool 提交新训练任务 #TX-4402",
  },
  {
    id: "EVT-0922",
    level: "SUCCESS",
    time: "09:22:19",
    source: "CHECKPOINT",
    message: "第 12800 步检查点已写入 JuiceFS，耗时 3.4 s",
  },
  {
    id: "EVT-0923",
    level: "WARN",
    time: "09:23:55",
    source: "NETWORK",
    message: "IB 端口 ibs9 流量抖动，建议检查 SR-IOV VF 绑定",
  },
  {
    id: "EVT-0924",
    level: "INFO",
    time: "09:24:31",
    source: "DATALINK",
    message: "地面站 A 信号锁定，信噪比 42 dB",
  },
  {
    id: "EVT-0925",
    level: "SUCCESS",
    time: "09:25:08",
    source: "TASK",
    message: "批量任务执行确认，处理速率 4.2 ops/s",
  },
  {
    id: "EVT-0926",
    level: "INFO",
    time: "09:26:44",
    source: "POWER",
    message: "太阳能阵列展开完毕，输出功率 18.4 kW",
  },
];

const levelColors: Record<
  string,
  { bg: string; border: string; shadow: string; text: string }
> = {
  SUCCESS: {
    bg: COLORS.signalGreen,
    border: COLORS.militaryGreen,
    shadow: `0 0 10px ${COLORS.signalGreen}40`,
    text: COLORS.pureWhite,
  },
  INFO: {
    bg: COLORS.electricCyan,
    border: COLORS.electricCyan,
    shadow: SHADOW.cyan,
    text: COLORS.pureWhite,
  },
  WARN: {
    bg: COLORS.gold,
    border: COLORS.goldDark,
    shadow: SHADOW.gold,
    text: COLORS.black,
  },
  ERROR: {
    bg: COLORS.red,
    border: COLORS.redDark,
    shadow: SHADOW.red,
    text: COLORS.pureWhite,
  },
};

export default function SceneScrollReveal() {
  return (
    <Box
      h="100%"
      overflowY="auto"
      p="12px"
      bg={COLORS.concrete}
      position="relative"
    >
      {/* Decorative red wedge in upper right */}
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

      {/* Decorative rotated gold square */}
      <Box
        position="absolute"
        bottom="32px"
        left="32px"
        w="36px"
        h="36px"
        border={`${BORDER.heavy} ${COLORS.gold}`}
        transform="rotate(45deg)"
        zIndex={0}
        opacity={0.9}
      />

      {/* Decorative cyan speed line */}
      <Box
        position="absolute"
        top="45%"
        left="-24px"
        w="160px"
        h="3px"
        bg={COLORS.electricCyan}
        transform="rotate(-12deg)"
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
          <Box w="10px" h="10px" bg={COLORS.red} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
          >
            事件日志 // 滚动揭示
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.metalWhite}
          opacity={0.7}
        >
          SCROLL REVEAL REF
        </Text>
      </Flex>

      {/* Scroll reveal list */}
      <VStack align="stretch" gap="12px" position="relative" zIndex={1}>
        {entries.map((entry, i) => {
          const tone = levelColors[entry.level] ?? levelColors.INFO;
          const isLeft = i % 2 === 0;
          const accentColor =
            i % 3 === 0 ? COLORS.red : i % 3 === 1 ? COLORS.gold : COLORS.electricCyan;

          return (
            <M.Flex
              key={entry.id}
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.medium}
              initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: DURATION.normal,
                ease: EASING.launch,
                delay: i * 0.05,
              }}
              whileHover={{
                y: -4,
                boxShadow: SHADOW.large,
              }}
              align="stretch"
              overflow="hidden"
            >
              {/* Left accent block */}
              <Box w="8px" minW="8px" bg={accentColor} />

              {/* Index marker */}
              <Flex
                w="72px"
                minW="72px"
                bg={COLORS.metalWhite}
                borderRight={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                direction="column"
                align="center"
                justify="center"
                p="8px"
              >
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="14px"
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="8px"
                  letterSpacing="0.06em"
                  color={COLORS.industrialBlack}
                  textTransform="uppercase"
                >
                  SEQ
                </Text>
              </Flex>

              {/* Content */}
              <Flex
                flex={1}
                direction="column"
                p="12px"
                gap="6px"
                justify="center"
              >
                <Flex justify="space-between" align="center">
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color={COLORS.industrialBlack}
                    textTransform="uppercase"
                  >
                    {entry.source}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.regular}
                    fontSize="10px"
                    color={COLORS.industrialBlack}
                    opacity={0.7}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {entry.time}
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.regular}
                  fontSize="13px"
                  color={COLORS.black}
                  lineHeight={1.3}
                >
                  {entry.message}
                </Text>
              </Flex>

              {/* Status badge */}
              <Flex
                align="center"
                justify="center"
                px="12px"
                borderLeft={`${BORDER.hairline} ${COLORS.industrialBlack}`}
              >
                <Box
                  bg={tone.bg}
                  color={tone.text}
                  border={`2px solid ${tone.border}`}
                  boxShadow={tone.shadow}
                  px="10px"
                  py="4px"
                >
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="10px"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    {entry.level}
                  </Text>
                </Box>
              </Flex>
            </M.Flex>
          );
        })}
      </VStack>

      {/* Bottom spacer for scroll */}
      <Box h="24px" />
    </Box>
  );
}
