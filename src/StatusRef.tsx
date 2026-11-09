import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


/** Orbit ring with dot — like satellite status */
function OrbitIndicator({ color, size, active }: { color: string; size: number; active: boolean }) {
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.black}
          strokeWidth={strokeWidth}
          opacity={0.1}
        />
        {active && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            strokeDasharray={`${Math.PI * radius}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * radius}` }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      {/* Center dot */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={`${Math.max(8, size * 0.15)}px`}
        h={`${Math.max(8, size * 0.15)}px`}
        bg={color}
        borderRadius="50%"
      />
    </Box>
  );
}

/** Simple status dot — no ring */
function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <Box position="relative" w="12px" h="12px" flexShrink={0}>
      {pulse && (
        <M.Box
          position="absolute"
          top="-4px"
          left="-4px"
          w="20px"
          h="20px"
          borderRadius="50%"
          border={`${BORDER.standard} ${color}`}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      <Box w="12px" h="12px" bg={color} borderRadius="50%" />
    </Box>
  );
}

/** Status badge — rectangular with label */
function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <Flex
      align="center"
      gap="8px"
      bg={color}
      px="12px"
      py="6px"
      border={`${BORDER.standard} ${COLORS.black}`}
    >
      <Box w="8px" h="8px" bg={COLORS.pureWhite} borderRadius="50%" />
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="10px"
        letterSpacing="0.15em"
        textTransform="uppercase"
        color={COLORS.pureWhite}
      >
        {label}
      </Text>
    </Flex>
  );
}

/** Satellite panel row */
function SatelliteRow({
  name,
  status,
  signal,
  latency,
}: {
  name: string;
  status: "online" | "offline" | "degraded" | "syncing";
  signal: string;
  latency: string;
}) {
  const statusColor =
    status === "online"
      ? COLORS.statusGreen
      : status === "syncing"
        ? COLORS.statusAmber
        : status === "degraded"
          ? COLORS.red
          : COLORS.industrialBlack;

  const statusLabel =
    status === "online"
      ? "运行中"
      : status === "syncing"
        ? "同步中"
        : status === "degraded"
          ? "危急"
          : "离线";

  return (
    <Flex
      align="center"
      py="14px"
      px="16px"
      borderBottom={`${BORDER.standard} ${COLORS.black}`}
      bg={COLORS.pureWhite}
      _hover={{ bg: COLORS.concrete }}
      transition="background 0.1s ease"
    >
      <HStack gap="12px" flex={1}>
        <StatusDot color={statusColor} pulse={status === "online"} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="14px"
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          {name}
        </Text>
      </HStack>
      <Text
        fontFamily={FONT.mono}
        fontSize="12px"
        color={COLORS.industrialBlack}
        w="100px"
        letterSpacing="0.04em"
      >
        {signal}
      </Text>
      <Text
        fontFamily={FONT.mono}
        fontSize="12px"
        color={statusColor}
        w="80px"
        letterSpacing="0.04em"
      >
        {latency}
      </Text>
      <Box w="60px" display="flex" justifyContent="flex-end">
        <StatusBadge label={statusLabel} color={statusColor} />
      </Box>
    </Flex>
  );
}

export default function StatusRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="状态指示" pageIndex="07" />

      {/* HERO — diagonal composition */}
      <Box bg={COLORS.red} px="80px" py="48px" position="relative" overflow="hidden">
        {/* Orbit decoration */}
        <Box
          position="absolute"
          top="50%"
          right="80px"
          transform="translateY(-50%)"
          pointerEvents="none"
          opacity={0.9}
        >
          <OrbitIndicator color={COLORS.gold} size={120} active={true} />
        </Box>
        <Box
          position="absolute"
          top="50%"
          right="160px"
          transform="translateY(-50%)"
          pointerEvents="none"
          opacity={0.5}
        >
          <OrbitIndicator color={COLORS.pureWhite} size={80} active={false} />
        </Box>

        {/* Geometric accent — rotated square receded */}
        <Box
          position="absolute"
          bottom="-20px"
          left="60%"
          w="64px"
          h="64px"
          transform="rotate(45deg)"
          opacity={0.15}
          bg={COLORS.pureWhite}
          pointerEvents="none"
        />

        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="-0.02em"
        >
          轨道
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.gold}
          letterSpacing="-0.02em"
          ml="24px"
        >
          遥测
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.pureWhite}
          opacity={0.7}
          mt="16px"
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          每个系统都在报告。每个状态都是来自轨道的信号。
        </Text>
      </Box>

      {/* STATUS DOTS — staggered cards */}
      <Box px={{ base: "32px", md: "80px" }} py="48px" position="relative">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            01
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            状态点——信号灯
          </Text>
        </Flex>

        {/* Geometric accent — receded plane */}
        <Box
          position="absolute"
          top="20px"
          right={{ base: "32px", md: "120px" }}
          w="48px"
          h="48px"
          transform="rotate(45deg)"
          opacity={0.12}
          bg={COLORS.red}
          pointerEvents="none"
        />

        <Flex gap="24px" flexWrap="wrap" align="flex-start">
          {[
            { color: COLORS.statusGreen, label: "运行中", sub: "所有系统正常", scale: 1 },
            { color: COLORS.statusAmber, label: "警告", sub: "需要关注", scale: 0.85 },
            { color: COLORS.statusRed, label: "危急", sub: "需要立即行动", scale: 1 },
            { color: COLORS.industrialBlack, label: "离线", sub: "未检测到信号", scale: 0.85 },
          ].map((s, i) => (
            <Box
              key={s.label}
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              p="20px"
              opacity={s.scale === 1 ? 1 : 0.8}
              mt={i % 2 === 1 ? "24px" : "0px"}
              ml={i === 2 ? "-12px" : "0px"}
              boxShadow={s.scale === 1 ? `5px 5px 0px rgba(0,0,0,0.18)` : "none"}
              position="relative"
              zIndex={s.scale === 1 ? 2 : 1}
              flex={{ base: "1 1 100%", md: `1 1 ${s.scale === 1 ? "220px" : "180px"}` }}
            >
              <Flex align="center" gap="12px" mb="12px">
                <StatusDot color={s.color} pulse={s.label === "运行中"} />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="14px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {s.label}
                </Text>
              </Flex>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.regular}
                fontSize="12px"
                color={COLORS.industrialBlack}
                letterSpacing="0.03em"
              >
                {s.sub}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Overlapping triangles — between status dots and orbit */}
      <Box px={{ base: "32px", md: "80px" }} py="8px" position="relative" h="40px">
        <Box
          position="absolute"
          left="35%"
          top="0"
          w="0"
          h="0"
          borderLeft="20px solid transparent"
          borderRight="20px solid transparent"
          borderBottom="28px solid"
          borderBottomColor={COLORS.electricCyan}
          opacity={0.08}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          left="38%"
          top="8px"
          w="0"
          h="0"
          borderLeft="14px solid transparent"
          borderRight="14px solid transparent"
          borderBottom="20px solid"
          borderBottomColor={COLORS.gold}
          opacity={0.1}
          pointerEvents="none"
        />
      </Box>

      {/* ORBIT INDICATORS — diagonal rhythm */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            02
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            轨道环——卫星视角
          </Text>
        </Flex>

        {/* Geometric accent — circle receded */}
        <Box
          position="absolute"
          bottom="-10px"
          left={{ base: "60px", md: "160px" }}
          w="60px"
          h="60px"
          borderRadius="50%"
          opacity={0.08}
          bg={COLORS.gold}
          pointerEvents="none"
        />

        <Flex gap="48px" align="flex-start" flexWrap="wrap">
          {[
            { color: COLORS.statusGreen, label: "已连接", active: true, plane: "fg" },
            { color: COLORS.statusAmber, label: "同步中", active: true, plane: "mid" },
            { color: COLORS.statusRed, label: "重连中", active: true, plane: "mid" },
            { color: COLORS.industrialBlack, label: "空闲", active: false, plane: "bg" },
          ].map((o, i) => (
            <VStack
              key={o.label}
              gap="12px"
              opacity={o.plane === "fg" ? 1 : o.plane === "mid" ? 0.85 : 0.7}
              transform={i === 1 ? "translateY(18px)" : i === 3 ? "translateY(-12px)" : "none"}
              position="relative"
              zIndex={o.plane === "fg" ? 3 : o.plane === "mid" ? 2 : 1}
            >
              <OrbitIndicator
                color={o.color}
                size={o.plane === "fg" ? 96 : o.plane === "bg" ? 64 : 80}
                active={o.active}
              />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="11px"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                {o.label}
              </Text>
            </VStack>
          ))}
        </Flex>
      </Box>

      {/* STATUS BADGES — overlapping plane */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative">
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            03
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            状态徽章——任务臂章
          </Text>
        </Flex>

        {/* Geometric accent — rotated square */}
        <Box
          position="absolute"
          top="60px"
          right={{ base: "20px", md: "100px" }}
          w="36px"
          h="36px"
          transform="rotate(45deg)"
          opacity={0.15}
          border={`${BORDER.heavy} ${COLORS.black}`}
          pointerEvents="none"
        />

        <HStack gap="0px" flexWrap="wrap" ml="-4px">
          <Box ml="4px" mt="0px" boxShadow="4px 4px 0px rgba(0,0,0,0.15)">
            <StatusBadge label="运行中" color={COLORS.statusGreen} />
          </Box>
          <Box ml="-2px" mt="8px" opacity={0.85}>
            <StatusBadge label="已停止" color={COLORS.industrialBlack} />
          </Box>
          <Box ml="4px" mt="0px" boxShadow="4px 4px 0px rgba(0,0,0,0.15)">
            <StatusBadge label="构建中" color={COLORS.statusAmber} />
          </Box>
          <Box ml="-2px" mt="8px" opacity={0.85}>
            <StatusBadge label="错误" color={COLORS.statusRed} />
          </Box>
          <Box ml="4px" mt="0px" opacity={0.75}>
            <StatusBadge label="等待中" color={COLORS.gold} />
          </Box>
          <Box ml="-2px" mt="8px" opacity={0.75}>
            <StatusBadge label="同步中" color={COLORS.militaryGreen} />
          </Box>
        </HStack>
      </Box>

      {/* Chevrons between badges and satellite panel */}
      <Box px={{ base: "32px", md: "80px" }} py="8px" display="flex" justifyContent="center" gap="12px">
        <Box w="12px" h="12px" borderRight={`2px solid ${COLORS.red}`} borderBottom={`2px solid ${COLORS.red}`} transform="rotate(45deg)" opacity={0.15} />
        <Box w="12px" h="12px" borderRight={`2px solid ${COLORS.red}`} borderBottom={`2px solid ${COLORS.red}`} transform="rotate(45deg)" opacity={0.12} />
        <Box w="12px" h="12px" borderRight={`2px solid ${COLORS.red}`} borderBottom={`2px solid ${COLORS.red}`} transform="rotate(45deg)" opacity={0.09} />
      </Box>

      {/* SATELLITE PANEL — foreground dominant plane */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative">
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            04
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            卫星面板——舰队状态
          </Text>
        </Flex>

        {/* Background geometric — large receded rectangle */}
        <Box
          position="absolute"
          top="-20px"
          right={{ base: "0px", md: "40px" }}
          w="120px"
          h="180px"
          opacity={0.06}
          bg={COLORS.red}
          pointerEvents="none"
        />

        {/* Diagonal line cutting through satellite panel area */}
        <Box
          position="absolute"
          top="0"
          left={{ base: "60%", md: "70%" }}
          w="2px"
          h="100%"
          bg={COLORS.electricCyan}
          opacity={0.08}
          transform="rotate(-12deg)"
          transformOrigin="top"
          pointerEvents="none"
        />

        <Box
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow="8px 8px 0px rgba(0,0,0,0.2)"
          maxW="800px"
          position="relative"
          zIndex={2}
          transform="translateX(16px)"
        >
          {/* Table header */}
          <Flex
            bg={COLORS.black}
            py="12px"
            px="16px"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.metalWhite}
              flex={1}
            >
              工作区
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.metalWhite}
              w="100px"
            >
              信号
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.metalWhite}
              w="80px"
            >
              延迟
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.metalWhite}
              w="60px"
              textAlign="right"
            >
              状态
            </Text>
          </Flex>

          <SatelliteRow name="frontend-dev" status="online" signal="强" latency="12ms" />
          <SatelliteRow name="api-server" status="online" signal="强" latency="8ms" />
          <SatelliteRow name="data-pipeline" status="syncing" signal="中" latency="45ms" />
          <SatelliteRow name="ml-training" status="degraded" signal="弱" latency="230ms" />
          <SatelliteRow name="staging-env" status="offline" signal="无" latency="--" />
          <SatelliteRow name="docs-site" status="offline" signal="无" latency="--" />
        </Box>
      </Box>

      {/* COMPOSITE STATUS — dominant foreground element */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative">
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            05
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            组合——完整轨道显示
          </Text>
        </Flex>

        {/* Large background geometric — concentric circle behind composite */}
        <Box
          position="absolute"
          top="-40px"
          right={{ base: "-20px", md: "60px" }}
          w="200px"
          h="200px"
          borderRadius="50%"
          border={`2px solid ${COLORS.gold}`}
          opacity={0.07}
          pointerEvents="none"
          zIndex={0}
        />
        <Box
          position="absolute"
          top="-20px"
          right={{ base: "0px", md: "80px" }}
          w="140px"
          h="140px"
          borderRadius="50%"
          border={`1px solid ${COLORS.gold}`}
          opacity={0.05}
          pointerEvents="none"
          zIndex={0}
        />

        {/* Overlapping geometric accent */}
        <Box
          position="absolute"
          top="-16px"
          left={{ base: "16px", md: "48px" }}
          w="50px"
          h="50px"
          transform="rotate(30deg)"
          opacity={0.1}
          bg={COLORS.gold}
          pointerEvents="none"
          zIndex={1}
        />

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          p="32px"
          maxW="600px"
          position="relative"
          zIndex={3}
          boxShadow="10px 10px 0px rgba(0,0,0,0.25)"
          ml="-16px"
        >
          <Flex gap="32px" align="center">
            <OrbitIndicator color={COLORS.statusGreen} size={140} active={true} />
            <Box>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="28px"
                color={COLORS.pureWhite}
                letterSpacing="0.04em"
                textTransform="uppercase"
              >
                FRONTEND-DEV
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="12px"
                color={COLORS.statusGreen}
                letterSpacing="0.05em"
              >
                运行中
              </Text>
              <HStack gap="24px" mt="16px">
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    color={COLORS.metalWhite}
                    opacity={0.5}
                  >
                    运行时间
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="18px"
                    color={COLORS.pureWhite}
                  >
                    4h 12m
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    color={COLORS.metalWhite}
                    opacity={0.5}
                  >
                    CPU
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="18px"
                    color={COLORS.pureWhite}
                  >
                    23%
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    color={COLORS.metalWhite}
                    opacity={0.5}
                  >
                    MEM
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="18px"
                    color={COLORS.pureWhite}
                  >
                    512MB
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* BACK */}
      <Box px="80px" py="32px">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex
            align="center"
            gap="8px"
            cursor="pointer"
            _hover={{ gap: "16px" }}
            transition="gap 0.15s ease"
          >
            <Text fontFamily={FONT.mono} fontSize="18px" color={COLORS.red}>
              &#8592;
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="13px"
              letterSpacing="0.1em"
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
