import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

const labelProps = {
  fontFamily: FONT.sans,
  fontWeight: WEIGHT.bold,
  fontSize: "10px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
};

const monoProps = {
  fontFamily: FONT.mono,
  sx: { fontVariantNumeric: "tabular-nums" as const },
};

const CARDS = [
  {
    id: "tx-4402",
    height: "180px",
    bg: COLORS.red,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    shadow: SHADOW.red,
    content: (
      <Flex direction="column" h="100%" p="12px" position="relative">
        <Box position="absolute" top="0" right="0" w="40px" h="40px" bg={COLORS.gold} />
        <Text {...labelProps} color={COLORS.pureWhite} opacity={0.85}>
          Volcano 队列
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="26px"
          lineHeight={0.95}
          color={COLORS.pureWhite}
          mt="6px"
        >
          TX-4402
        </Text>
        <Flex align="center" gap="6px" mt="10px">
          <Box w="8px" h="8px" bg={COLORS.pureWhite} />
          <Text
            {...monoProps}
            fontWeight={WEIGHT.bold}
            fontSize="11px"
            color={COLORS.pureWhite}
          >
            RUNNING
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="12px"
          lineHeight={1.3}
          color={COLORS.pureWhite}
          mt="8px"
        >
          PyTorch DDP 分布式训练任务已调度至 gpu-pool 队列。
        </Text>
        <Text
          {...monoProps}
          fontSize="10px"
          color={COLORS.pureWhite}
          opacity={0.8}
          mt="auto"
        >
          GPU 4x A100 // NCCL RDMA
        </Text>
      </Flex>
    ),
  },
  {
    id: "ops",
    height: "140px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.cyan,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.electricCyan} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          OPS/S
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="30px"
          lineHeight={0.95}
          color={COLORS.black}
          mt="8px"
        >
          14,208
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.bold}
          fontSize="11px"
          color={COLORS.electricCyan}
          mt="6px"
        >
          +12.4%
        </Text>
      </Flex>
    ),
  },
  {
    id: "checkpoint",
    height: "160px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.signalGreen} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          Checkpoint
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="22px"
          lineHeight={0.95}
          color={COLORS.black}
          mt="6px"
        >
          CKPT-12800
        </Text>
        <Box
          mt="10px"
          h="8px"
          bg={COLORS.metalWhite}
          border={`${BORDER.standard} ${COLORS.industrialBlack}`}
        >
          <Box w="78%" h="100%" bg={COLORS.signalGreen} />
        </Box>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          color={COLORS.signalGreen}
          mt="8px"
        >
          3.4 s // JuiceFS
        </Text>
      </Flex>
    ),
  },
  {
    id: "pod-07a",
    height: "200px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.electricCyan} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          节点 // POD
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="20px"
          color={COLORS.black}
          mt="6px"
        >
          POD-07A
        </Text>
        <Flex justify="space-between" mt="8px">
          <Text {...monoProps} fontSize="11px" color={COLORS.black}>
            CPU 78%
          </Text>
          <Text {...monoProps} fontSize="11px" color={COLORS.black}>
            MEM 4.2G
          </Text>
        </Flex>
        <Flex flex={1} align="flex-end" gap="4px" mt="10px" minH="60px">
          {[40, 65, 78, 55].map((v, i) => (
            <Box
              key={i}
              flex={1}
              h={`${v}%`}
              minH="8px"
              bg={i === 2 ? COLORS.red : COLORS.electricCyan}
            />
          ))}
        </Flex>
      </Flex>
    ),
  },
  {
    id: "thermal",
    height: "140px",
    bg: COLORS.gold,
    border: `${BORDER.heavy} ${COLORS.goldDark}`,
    shadow: SHADOW.gold,
    content: (
      <Flex direction="column" h="100%" p="12px" position="relative">
        <Box position="absolute" top="0" right="0" w="28px" h="28px" bg={COLORS.black} />
        <Text {...labelProps} color={COLORS.black} opacity={0.8}>
          Thermal Warn
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="15px"
          lineHeight={1.1}
          color={COLORS.black}
          mt="10px"
        >
          三号舱段温度接近阈值
        </Text>
        <Text
          {...monoProps}
          fontSize="10px"
          color={COLORS.black}
          mt="auto"
        >
          58.4 °C // 备用散热循环已启动
        </Text>
      </Flex>
    ),
  },
  {
    id: "network",
    height: "150px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.statusAmber} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          Network
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="20px"
          color={COLORS.black}
          mt="6px"
        >
          ibs9
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="12px"
          lineHeight={1.3}
          color={COLORS.black}
          mt="8px"
        >
          IB 端口流量抖动，建议检查 SR-IOV VF 绑定。
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          color={COLORS.statusAmber}
          mt="auto"
        >
          PENDING
        </Text>
      </Flex>
    ),
  },
  {
    id: "solar",
    height: "170px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.gold} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          Solar Array
        </Text>
        <Text
          {...monoProps}
          fontWeight={WEIGHT.black}
          fontSize="26px"
          lineHeight={0.95}
          color={COLORS.black}
          mt="6px"
        >
          18.4 kW
        </Text>
        <Flex flex={1} align="flex-end" gap="3px" mt="10px" minH="60px">
          {[30, 45, 60, 55, 75, 65, 80].map((v, i) => (
            <Box
              key={i}
              flex={1}
              h={`${v}%`}
              minH="6px"
              bg={i % 2 === 0 ? COLORS.gold : COLORS.electricCyan}
            />
          ))}
        </Flex>
      </Flex>
    ),
  },
  {
    id: "mission-log",
    height: "220px",
    bg: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.industrialBlack}`,
    shadow: SHADOW.large,
    content: (
      <Flex direction="column" h="100%" p="12px" position="relative">
        <Box position="absolute" top="0" left="0" w="6px" h="100%" bg={COLORS.red} />
        <Box
          position="absolute"
          top="12px"
          right="12px"
          w="28px"
          h="28px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          transform="rotate(45deg)"
        />
        <Text {...labelProps} color={COLORS.metalWhite} ml="16px">
          Mission Log
        </Text>
        {[
          { step: "T-00 一级点火", done: true },
          { step: "T+04 程序转弯", done: true },
          { step: "T+08 二级分离", done: true },
          { step: "T+12 入轨确认", done: false },
        ].map((item, i) => (
          <Flex key={i} ml="16px" mt="10px" align="center" gap="8px">
            <Box
              w="6px"
              h="6px"
              bg={item.done ? COLORS.signalGreen : COLORS.gold}
            />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="12px"
              color={COLORS.pureWhite}
            >
              {item.step}
            </Text>
          </Flex>
        ))}
        <Text
          {...monoProps}
          fontSize="9px"
          color={COLORS.metalWhite}
          opacity={0.6}
          mt="auto"
          ml="16px"
        >
          SYS-9 // 实时监控
        </Text>
      </Flex>
    ),
  },
  {
    id: "command-log",
    height: "130px",
    bg: COLORS.pureWhite,
    border: `${BORDER.heavy} ${COLORS.black}`,
    shadow: SHADOW.medium,
    content: (
      <Flex direction="column" h="100%" p="12px" pl="44px" position="relative">
        <Box position="absolute" top="0" left="0" w="32px" h="32px" bg={COLORS.electricCyan} />
        <Text {...labelProps} color={COLORS.industrialBlack}>
          Command Log
        </Text>
        <Box
          mt="8px"
          flex={1}
          bg={COLORS.black}
          p="8px"
          overflow="hidden"
        >
          <Text {...monoProps} fontSize="9px" color={COLORS.metalWhite}>
            {`> nccl-test --nthreads 8`}
          </Text>
          <Text {...monoProps} fontSize="9px" color={COLORS.metalWhite} mt="4px">
            {`> avg bus bandwidth 82.4 GB/s`}
          </Text>
        </Box>
      </Flex>
    ),
  },
  {
    id: "oom-error",
    height: "150px",
    bg: COLORS.red,
    border: `${BORDER.heavy} ${COLORS.redDark}`,
    shadow: SHADOW.red,
    content: (
      <Flex direction="column" h="100%" p="12px" position="relative">
        <Box
          position="absolute"
          top="0"
          right="0"
          w="36px"
          h="36px"
          bg={COLORS.black}
          clipPath="polygon(100% 0, 100% 100%, 0 0)"
        />
        <Text {...labelProps} color={COLORS.pureWhite}>
          Error
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="15px"
          lineHeight={1.1}
          color={COLORS.pureWhite}
          mt="10px"
        >
          POD-09E OOM 保护触发
        </Text>
        <Text
          {...monoProps}
          fontSize="10px"
          color={COLORS.pureWhite}
          opacity={0.85}
          mt="auto"
        >
          MEM 7.8G // 已隔离
        </Text>
      </Flex>
    ),
  },
  {
    id: "slogan",
    height: "120px",
    bg: COLORS.gold,
    border: `${BORDER.heavy} ${COLORS.goldDark}`,
    shadow: SHADOW.gold,
    content: (
      <Flex direction="column" h="100%" p="12px" justify="center" position="relative">
        <Box
          position="absolute"
          bottom="8px"
          right="8px"
          w="24px"
          h="24px"
          bg={COLORS.black}
          transform="rotate(45deg)"
        />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="22px"
          lineHeight={0.95}
          color={COLORS.black}
        >
          快速加载
        </Text>
        <Text
          {...monoProps}
          fontSize="10px"
          color={COLORS.black}
          opacity={0.7}
          mt="8px"
        >
          GRID // MASONRY
        </Text>
      </Flex>
    ),
  },
  {
    id: "ds-badge",
    height: "120px",
    bg: COLORS.black,
    border: `${BORDER.heavy} ${COLORS.industrialBlack}`,
    shadow: SHADOW.large,
    content: (
      <Flex h="100%" p="12px" align="center" gap="12px" position="relative">
        <Box
          w="48px"
          h="48px"
          bg={COLORS.gold}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="24px"
            color={COLORS.black}
          >
            DS
          </Text>
        </Box>
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="14px"
            color={COLORS.pureWhite}
          >
            DESIGN SYSTEM
          </Text>
          <Text
            {...monoProps}
            fontSize="9px"
            color={COLORS.metalWhite}
            opacity={0.7}
            mt="4px"
          >
            V0.9.0 // BBT
          </Text>
        </Box>
      </Flex>
    ),
  },
];

function MasonryCard({
  height,
  bg,
  border,
  shadow,
  children,
}: {
  height: string;
  bg: string;
  border: string;
  shadow: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      mb={SPACE.md}
      h={height}
      bg={bg}
      border={border}
      boxShadow={shadow}
      position="relative"
      overflow="hidden"
      transition={`all ${DURATION.fast}s ease`}
      _hover={{ transform: "translateY(-4px)", boxShadow: SHADOW.large }}
      sx={{ breakInside: "avoid" }}
    >
      {children}
    </Box>
  );
}

export default function SceneMasonry() {
  return (
    <Box
      h="100%"
      overflowY="auto"
      bg={COLORS.concrete}
      p="12px"
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
        top="50%"
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
            任务遥测 // Masonry
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.metalWhite}
          opacity={0.7}
        >
          WATERFALL GRID
        </Text>
      </Flex>

      {/* Masonry / waterfall grid */}
      <Box
        position="relative"
        zIndex={1}
        sx={{
          columns: { base: "1", sm: "2", md: "3" },
          columnGap: SPACE.md,
        }}
      >
        {CARDS.map((card) => (
          <MasonryCard
            key={card.id}
            height={card.height}
            bg={card.bg}
            border={card.border}
            shadow={card.shadow}
          >
            {card.content}
          </MasonryCard>
        ))}
      </Box>

      <Box h="12px" />
    </Box>
  );
}
