import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "../../Theme";

const MotionBox = motion(Box);

type Tone = "red" | "black" | "gold" | "white";
type IconShape = "triangle" | "diamond" | "circle" | "square" | "bar" | "cross";

interface CardData {
  id: string;
  label: string;
  value: string;
  unit: string;
  tone: Tone;
  icon: IconShape;
}

const cards: CardData[] = [
  {
    id: "SYS-01",
    label: "处理单元",
    value: "108",
    unit: "%",
    tone: "red",
    icon: "triangle",
  },
  {
    id: "SYS-02",
    label: "服务节点",
    value: "NOMINAL",
    unit: "",
    tone: "black",
    icon: "circle",
  },
  {
    id: "SYS-03",
    label: "遥测",
    value: "14.2",
    unit: "K",
    tone: "gold",
    icon: "diamond",
  },
  {
    id: "SYS-04",
    label: "配额",
    value: "87",
    unit: "%",
    tone: "white",
    icon: "square",
  },
  {
    id: "SYS-05",
    label: "信号",
    value: "LOCKED",
    unit: "",
    tone: "red",
    icon: "bar",
  },
  {
    id: "SYS-06",
    label: "任务量",
    value: "420",
    unit: "KG",
    tone: "black",
    icon: "cross",
  },
  {
    id: "SYS-07",
    label: "电压",
    value: "28.4",
    unit: "V",
    tone: "gold",
    icon: "triangle",
  },
  {
    id: "SYS-08",
    label: "温度",
    value: "342",
    unit: "K",
    tone: "white",
    icon: "bar",
  },
];

const toneStyles: Record<
  Tone,
  {
    bg: string;
    border: string;
    shadow: string;
    hoverShadow: string;
    color: string;
    accent: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  red: {
    bg: COLORS.red,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    shadow: SHADOW.red,
    hoverShadow: `8px 8px 0px ${COLORS.red}`,
    color: COLORS.pureWhite,
    accent: COLORS.gold,
    iconBg: COLORS.pureWhite,
    iconColor: COLORS.red,
  },
  black: {
    bg: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.large,
    hoverShadow: `8px 8px 0px ${COLORS.black}4d`,
    color: COLORS.pureWhite,
    accent: COLORS.electricCyan,
    iconBg: COLORS.electricCyan,
    iconColor: COLORS.black,
  },
  gold: {
    bg: COLORS.gold,
    border: `${BORDER.heavy} ${COLORS.goldDark}`,
    shadow: SHADOW.gold,
    hoverShadow: `8px 8px 0px ${COLORS.gold}`,
    color: COLORS.black,
    accent: COLORS.red,
    iconBg: COLORS.black,
    iconColor: COLORS.gold,
  },
  white: {
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    hoverShadow: `8px 8px 0px ${COLORS.black}40`,
    color: COLORS.black,
    accent: COLORS.red,
    iconBg: COLORS.red,
    iconColor: COLORS.pureWhite,
  },
};

function GeometricIcon({
  icon,
  bg,
}: {
  icon: IconShape;
  bg: string;
}) {
  switch (icon) {
    case "triangle":
      return (
        <Box
          w="32px"
          h="32px"
          bg={bg}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
      );
    case "diamond":
      return <Box w="28px" h="28px" bg={bg} transform="rotate(45deg)" />;
    case "circle":
      return <Box w="32px" h="32px" bg={bg} borderRadius="50%" />;
    case "square":
      return <Box w="32px" h="32px" bg={bg} />;
    case "bar":
      return <Box w="32px" h="8px" bg={bg} />;
    case "cross":
      return (
        <Box position="relative" w="32px" h="32px">
          <Box
            position="absolute"
            top="12px"
            left="0"
            w="32px"
            h="8px"
            bg={bg}
          />
          <Box
            position="absolute"
            top="0"
            left="12px"
            w="8px"
            h="32px"
            bg={bg}
          />
        </Box>
      );
    default:
      return <Box w="32px" h="32px" bg={bg} />;
  }
}

export default function SceneHorizontalScroll() {
  return (
    <Box
      h="100%"
      overflowX="auto"
      css={{ scrollbarWidth: "thin" }}
      bg={COLORS.concrete}
    >
      <Flex
        gap={{ base: "12px", md: "16px" }}
        h="100%"
        minW="max-content"
        p={{ base: "16px", md: "24px" }}
        align="stretch"
      >
        {cards.map((card, index) => {
          const style = toneStyles[card.tone];
          return (
            <MotionBox
              key={card.id}
              w={{ base: "220px", sm: "240px", md: "260px", lg: "280px" }}
              h="100%"
              bg={style.bg}
              border={style.border}
              boxShadow={style.shadow}
              flexShrink={0}
              display="flex"
              flexDirection="column"
              p="16px"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -4,
                boxShadow: style.hoverShadow,
              }}
              transition={{
                duration: DURATION.normal,
                ease: EASING.launch,
                delay: index * 0.05,
              }}
            >
              <Flex justify="space-between" align="flex-start" mb="16px">
                <GeometricIcon icon={card.icon} bg={style.iconBg} />
                <Text
                  {...TOKENS.label}
                  color={style.color}
                  opacity={0.7}
                  fontSize="10px"
                >
                  {card.id}
                </Text>
              </Flex>

              <Text {...TOKENS.label} color={style.color} mb="8px">
                {card.label}
              </Text>

              <Flex align="baseline" gap="6px" mt="auto">
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="32px"
                  color={style.color}
                  lineHeight={0.95}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {card.value}
                </Text>
                {card.unit && (
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="12px"
                    color={style.accent}
                  >
                    {card.unit}
                  </Text>
                )}
              </Flex>

              <Box w="100%" h="4px" bg={style.accent} mt="16px" />
            </MotionBox>
          );
        })}
      </Flex>
    </Box>
  );
}
