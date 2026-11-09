import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { RefNavBar } from "./RefNavBar";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};

interface ColorEntry {
  name: string;
  hex: string;
  usage: string;
}

const PRIMARY_COLORS: ColorEntry[] = [
  {
    name: "信号红",
    hex: COLORS.red,
    usage: "主要操作、进度指示器、警报状态。",
  },
  {
    name: "黄铜金",
    hex: COLORS.gold,
    usage: "点缀、徽章、装饰性几何。",
  },
];

const NEUTRAL_COLORS: ColorEntry[] = [
  {
    name: "太空黑",
    hex: COLORS.black,
    usage: "文字、粗边框、页脚。",
  },
  {
    name: "工业黑",
    hex: COLORS.industrialBlack,
    usage: "次要文字、边框、微妙对比。",
  },
  {
    name: "金属白",
    hex: COLORS.metalWhite,
    usage: "次要背景、弱化元素。",
  },
  {
    name: "混凝土",
    hex: COLORS.concrete,
    usage: "主要背景。",
  },
  {
    name: "纯白",
    hex: COLORS.pureWhite,
    usage: "深色背景上的文字。输入框。最大对比区域。",
  },
];

const ACCENT_COLORS: ColorEntry[] = [
  {
    name: "军绿",
    hex: COLORS.militaryGreen,
    usage: "仅用于成功状态。",
  },
];

const VELOCITY_COLORS: ColorEntry[] = [
  {
    name: "电青色",
    hex: COLORS.electricCyan,
    usage: "数据流、跑马灯、活跃指示器。",
  },
  {
    name: "速度橙",
    hex: COLORS.velocityOrange,
    usage: "紧急警告、进度加速。",
  },
  {
    name: "信号绿",
    hex: COLORS.signalGreen,
    usage: "关键成功指示器、活跃进程。",
  },
];

const SEMANTIC_COLORS: ColorEntry[] = [
  {
    name: "状态绿",
    hex: COLORS.statusGreen,
    usage: "运行中、已连接。",
  },
  {
    name: "状态琥珀",
    hex: COLORS.statusAmber,
    usage: "警告、待定。",
  },
  {
    name: "状态红",
    hex: COLORS.statusRed,
    usage: "错误、严重、需要立即关注。",
  },
];

function ColorBlock({ entry, large }: { entry: ColorEntry; large?: boolean }) {
  const isLight =
    entry.hex === COLORS.pureWhite ||
    entry.hex === COLORS.concrete ||
    entry.hex === COLORS.metalWhite;

  return (
    <M.Box
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
    >
      <Box
        bg={entry.hex}
        border={`${BORDER.heavy} ${COLORS.black}`}
        minH={large ? "200px" : "140px"}
        p={large ? "32px" : "20px"}
        position="relative"
        overflow="hidden"
      >
        {/* Diagonal corner accent */}
        <Box
          position="absolute"
          bottom={0}
          right={0}
          w="40px"
          h="40px"
          bg={isLight ? COLORS.red : COLORS.gold}
          opacity={0.12}
        />

        <VStack align="flex-start" gap="12px" h="100%" justify="space-between">
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={large ? "28px" : "18px"}
              letterSpacing="0"
              textTransform="uppercase"
              color={isLight ? COLORS.black : COLORS.pureWhite}
              lineHeight={1.3}
            >
              {entry.name}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="13px"
              color={isLight ? COLORS.black : COLORS.metalWhite}
              opacity={0.7}
              mt="4px"
              letterSpacing="0.05em"
            >
              {entry.hex.toUpperCase()}
            </Text>
          </Box>
        </VStack>
      </Box>
      {/* Usage description */}
      <Box
        bg={COLORS.pureWhite}
        borderX={`${BORDER.standard} ${COLORS.black}`}
        borderBottom={`${BORDER.heavy} ${COLORS.black}`}
        px="16px"
        py="12px"
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="12px"
          color={COLORS.industrialBlack}
          lineHeight={1.8}
          letterSpacing="0"
        >
          {entry.usage}
        </Text>
      </Box>
    </M.Box>
  );
}

export default function ColorsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      {/* NAV BAR — RefNavBar（翻页时钟风格导航） */}
      <RefNavBar title="色彩体系" pageIndex="01" />

      {/* PRIMARY COLORS */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex direction="column" position="relative">
          <Box
            w="100%"
            minH="240px"
            boxShadow={SHADOW.large}
            position="relative"
            zIndex={1}
          >
            <ColorBlock entry={PRIMARY_COLORS[0]!} large />
          </Box>
          <Box
            w={{ base: "100%", md: "60%" }}
            minH="160px"
            ml="-40px"
            mt="40px"
            boxShadow={SHADOW.large}
            position="relative"
            zIndex={2}
          >
            <ColorBlock entry={PRIMARY_COLORS[1]!} large />
          </Box>
        </Flex>
      </Box>

      {/* GEOMETRIC DECORATION */}
      <Box ml="40%" mt="-20px" mb="20px" position="relative" zIndex={0}>
        <Box
          w="60px"
          h="60px"
          bg={COLORS.red}
          opacity={0.15}
          transform="rotate(45deg)"
        />
      </Box>

      {/* NEUTRAL COLORS */}
      <Box px={{ base: "32px", md: "80px" }} py="24px">
        <Flex direction="column" position="relative">
          {/* First row: larger cards with offset */}
          <Flex position="relative">
            <Box
              w="55%"
              minH="170px"
              position="relative"
              zIndex={3}
              boxShadow={SHADOW.large}
            >
              <ColorBlock entry={NEUTRAL_COLORS[0]!} large />
            </Box>
            <Box
              w="50%"
              minH="150px"
              ml="-30px"
              position="relative"
              zIndex={2}
              boxShadow={SHADOW.medium}
            >
              <ColorBlock entry={NEUTRAL_COLORS[1]!} large />
            </Box>
          </Flex>
          {/* Second row: smaller staggered cards */}
          <Flex mt="-20px" position="relative">
            <Box
              w="35%"
              minH="130px"
              ml="20px"
              position="relative"
              zIndex={4}
              boxShadow={SHADOW.medium}
            >
              <ColorBlock entry={NEUTRAL_COLORS[2]!} />
            </Box>
            <Box
              w="35%"
              minH="120px"
              ml="-20px"
              mt="30px"
              position="relative"
              zIndex={3}
              boxShadow={SHADOW.medium}
            >
              <ColorBlock entry={NEUTRAL_COLORS[3]!} />
            </Box>
            <Box
              w="30%"
              minH="110px"
              ml="-15px"
              mt="15px"
              position="relative"
              zIndex={2}
              boxShadow={SHADOW.small}
            >
              <ColorBlock entry={NEUTRAL_COLORS[4]!} />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Tick pattern divider — between neutral and accent */}
      <Box px={{ base: "32px", md: "80px" }} py="12px">
        <Flex gap="8px" align="center">
          {Array.from({ length: 24 }).map((_, i) => (
            <Box
              key={i}
              w="1px"
              h={i % 3 === 0 ? "12px" : "6px"}
              bg={COLORS.black}
              opacity={0.15}
            />
          ))}
        </Flex>
      </Box>

      {/* ACCENT + VELOCITY */}
      <Box px={{ base: "32px", md: "80px" }} py="24px">
        <Box maxW="33%">
          {ACCENT_COLORS.map((c) => (
            <ColorBlock key={c.hex} entry={c} />
          ))}
        </Box>
      </Box>

      {/* Concentric circles — between accent and velocity */}
      <Box
        px={{ base: "32px", md: "80px" }}
        py="8px"
        position="relative"
        display="flex"
        justifyContent="flex-end"
      >
        <Box position="relative" w="80px" h="80px" pointerEvents="none">
          <Box
            position="absolute"
            top="0"
            left="0"
            w="80px"
            h="80px"
            borderRadius="50%"
            border={`1px solid ${COLORS.electricCyan}`}
            opacity={0.12}
          />
          <Box
            position="absolute"
            top="12px"
            left="12px"
            w="56px"
            h="56px"
            borderRadius="50%"
            border={`1px solid ${COLORS.electricCyan}`}
            opacity={0.1}
          />
          <Box
            position="absolute"
            top="24px"
            left="24px"
            w="32px"
            h="32px"
            borderRadius="50%"
            border={`1px solid ${COLORS.electricCyan}`}
            opacity={0.08}
          />
        </Box>
      </Box>

      {/* VELOCITY COLORS — signal accents */}
      <Box px={{ base: "32px", md: "80px" }} py="24px">
        <Flex direction="column" position="relative">
          <Box
            w="60%"
            minH="200px"
            position="relative"
            zIndex={3}
            boxShadow={SHADOW.large}
          >
            <ColorBlock entry={VELOCITY_COLORS[0]!} large />
          </Box>
          <Box
            w="55%"
            minH="180px"
            ml="16px"
            mt="-20px"
            position="relative"
            zIndex={2}
            boxShadow={SHADOW.medium}
          >
            <ColorBlock entry={VELOCITY_COLORS[1]!} large />
          </Box>
          <Box
            w="50%"
            minH="160px"
            ml="32px"
            mt="-20px"
            position="relative"
            zIndex={1}
            boxShadow={SHADOW.medium}
          >
            <ColorBlock entry={VELOCITY_COLORS[2]!} large />
          </Box>
        </Flex>
      </Box>

      {/* CYAN CIRCLE DECORATION */}
      <Flex justify="center" py="16px" position="relative">
        <Box
          w="40px"
          h="40px"
          borderRadius="50%"
          border={`2px solid ${COLORS.electricCyan}`}
          opacity={0.2}
        />
      </Flex>

      {/* Cross/plus shape — between velocity and semantic */}
      <Box px={{ base: "32px", md: "80px" }} py="8px" position="relative">
        <Box position="absolute" left="45%" top="0" pointerEvents="none">
          <Box w="24px" h="3px" bg={COLORS.red} opacity={0.15} />
          <Box
            w="3px"
            h="24px"
            bg={COLORS.red}
            opacity={0.15}
            position="absolute"
            top="-10px"
            left="10px"
          />
        </Box>
      </Box>

      <Box px={{ base: "32px", md: "80px" }} py="24px">
        <Flex position="relative" align="flex-end">
          <Box flex={1} position="relative" zIndex={1}>
            <ColorBlock entry={SEMANTIC_COLORS[0]!} />
          </Box>
          <Box
            flex={1}
            mt="-16px"
            position="relative"
            zIndex={2}
            boxShadow={SHADOW.large}
          >
            <ColorBlock entry={SEMANTIC_COLORS[1]!} />
          </Box>
          <Box flex={1} position="relative" zIndex={1}>
            <ColorBlock entry={SEMANTIC_COLORS[2]!} />
          </Box>
        </Flex>
      </Box>

      {/* Diagonal line cutting across — before color ratios */}
      <Box px={{ base: "32px", md: "80px" }} py="0" position="relative">
        <Box
          position="absolute"
          top="-20px"
          right="80px"
          w="2px"
          h="60px"
          bg={COLORS.velocityOrange}
          opacity={0.12}
          transform="rotate(-35deg)"
          pointerEvents="none"
        />
      </Box>

      {/* BACK */}
      <Box px="80px" py="32px">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex
            align="center"
            gap="8px"
            cursor="pointer"
            _hover={{ gap: "16px" }}
            transition={`gap ${DURATION.fast}s ease`}
          >
            <Text fontFamily={FONT.mono} fontSize="18px" color={COLORS.red}>
              &#8592;
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="13px"
              letterSpacing="0"
              textTransform="uppercase"
              color={COLORS.black}
            >
              返回索引
            </Text>
          </Flex>
        </Link>
      </Box>
    </Box>
  );
}
