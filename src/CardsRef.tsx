import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


function GeometricCorner({
  position,
  color,
}: {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  color: string;
}) {
  const base: Record<string, React.CSSProperties> = {
    topLeft: { top: 0, left: 0, borderTop: `3px solid ${color}`, borderLeft: `3px solid ${color}` },
    topRight: { top: 0, right: 0, borderTop: `3px solid ${color}`, borderRight: `3px solid ${color}` },
    bottomLeft: { bottom: 0, left: 0, borderBottom: `3px solid ${color}`, borderLeft: `3px solid ${color}` },
    bottomRight: { bottom: 0, right: 0, borderBottom: `3px solid ${color}`, borderRight: `3px solid ${color}` },
  };

  return (
    <Box
      position="absolute"
      w="16px"
      h="16px"
      style={base[position]}
      pointerEvents="none"
    />
  );
}

function WorkspaceCard({
  name,
  provider,
  status,
  cpu,
  mem,
  uptime,
}: {
  name: string;
  provider: string;
  status: "running" | "stopped" | "building";
  cpu: string;
  mem: string;
  uptime: string;
}) {
  const statusColor =
    status === "running"
      ? COLORS.statusGreen
      : status === "building"
        ? COLORS.statusAmber
        : COLORS.industrialBlack;

  const statusLabel =
    status === "running"
      ? "运行中"
      : status === "building"
        ? "构建中"
        : "已停止";

  return (
    <M.Box
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ y: -4, boxShadow: SHADOW.large }}
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      position="relative"
      overflow="hidden"
      cursor="pointer"
    >
      <GeometricCorner position="topRight" color={statusColor} />
      <GeometricCorner position="bottomLeft" color={COLORS.gold} />

      {/* Top accent line */}
      <Box h="3px" bg={statusColor} />

      <Box p="20px">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb="16px">
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="18px"
              letterSpacing="0.03em"
              textTransform="uppercase"
              lineHeight={1}
            >
              {name}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.industrialBlack}
              letterSpacing="0.05em"
              mt="4px"
            >
              {provider}
            </Text>
          </Box>
          <Box
            bg={statusColor}
            px="10px"
            py="4px"
            border={`${BORDER.standard} ${COLORS.black}`}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.04em"
              color={COLORS.pureWhite}
            >
              {statusLabel}
            </Text>
          </Box>
        </Flex>

        {/* Metrics */}
        <HStack gap="20px">
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color={COLORS.industrialBlack}
              opacity={0.6}
            >
              CPU
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="18px"
              fontWeight={WEIGHT.bold}
              color={COLORS.black}
            >
              {cpu}
            </Text>
          </Box>
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color={COLORS.industrialBlack}
              opacity={0.6}
            >
              MEM
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="18px"
              fontWeight={WEIGHT.bold}
              color={COLORS.black}
            >
              {mem}
            </Text>
          </Box>
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.12em"
              textTransform="uppercase"
              color={COLORS.industrialBlack}
              opacity={0.6}
            >
              UPTIME
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="18px"
              fontWeight={WEIGHT.bold}
              color={COLORS.black}
            >
              {uptime}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Bottom decorative stripe */}
      <Box
        position="absolute"
        bottom="0"
        right="0"
        w="60px"
        h="3px"
        bg={COLORS.gold}
      />
    </M.Box>
  );
}

function StatCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
}) {
  return (
    <M.Box
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      bg={COLORS.black}
      border={`${BORDER.heavy} ${COLORS.black}`}
      p="20px"
      position="relative"
      overflow="hidden"
    >
      {/* Accent top */}
      <Box h="3px" bg={accent} mb="16px" />

      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="10px"
        letterSpacing="0.04em"
        textTransform="uppercase"
        color={COLORS.metalWhite}
        opacity={0.5}
      >
        {label}
      </Text>
      <Flex align="baseline" gap="4px" mt="4px">
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="36px"
          color={COLORS.pureWhite}
          lineHeight={1}
        >
          {value}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="12px"
          letterSpacing="0.1em"
          color={accent}
        >
          {unit}
        </Text>
      </Flex>

      {/* Decorative circle */}
      <Box
        position="absolute"
        bottom="-12px"
        right="-12px"
        w="60px"
        h="60px"
        borderRadius="50%"
        border={`${BORDER.standard} ${accent}`}
        opacity={0.15}
        pointerEvents="none"
      />
    </M.Box>
  );
}

function AlertCard({ title, message }: { title: string; message: string }) {
  return (
    <Box
      bg={COLORS.red}
      border={`${BORDER.heavy} ${COLORS.redDark}`}
      p="24px"
      position="relative"
      overflow="hidden"
    >
      {/* Diagonal stripe */}
      <Box
        position="absolute"
        top={0}
        right="30%"
        w="3px"
        h="100%"
        bg={COLORS.pureWhite}
        opacity={0.1}
        transform="rotate(-15deg)"
        transformOrigin="top"
      />

      <Flex align="flex-start" gap="16px">
        <Box
          bg={COLORS.pureWhite}
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="18px" color={COLORS.red}>
            !
          </Text>
        </Box>
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="16px"
            letterSpacing="0.06em"
            textTransform="uppercase"
            color={COLORS.pureWhite}
          >
            {title}
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.regular}
            fontSize="13px"
            color={COLORS.pureWhite}
            opacity={0.8}
            mt="4px"
            lineHeight={1.7}
          >
            {message}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function ProviderCard({ name, type, region }: { name: string; type: string; region: string }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ x: 8 }}
      bg={COLORS.concrete}
      border={`${BORDER.heavy} ${COLORS.black}`}
      p="20px"
      position="relative"
      cursor="pointer"
    >
      {/* Left accent */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="4px"
        h="100%"
        bg={COLORS.gold}
      />

      <Flex justify="space-between" align="center">
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="16px"
            letterSpacing="0.04em"
            textTransform="uppercase"
            pl="12px"
          >
            {name}
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontSize="11px"
            color={COLORS.industrialBlack}
            pl="12px"
            mt="2px"
            letterSpacing="0.04em"
          >
            {type} / {region}
          </Text>
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontSize="18px"
          color={COLORS.red}
        >
          &#8594;
        </Text>
      </Flex>
    </M.Box>
  );
}

export default function CardsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="信息卡片" pageIndex="04" />

      {/* HERO */}
      <Box bg={COLORS.black} px="80px" py="48px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-40px"
          right="80px"
          w="200px"
          h="200px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.1}
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
          仪表
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.gold}
          letterSpacing="-0.02em"
        >
          面板
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.metalWhite}
          opacity={0.6}
          mt="16px"
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          每张卡片都是仪表。每条边框都是参照系。
        </Text>
      </Box>

      {/* WORKSPACE CARDS */}
      <Box px={{ base: "32px", md: "80px" }} py="48px" position="relative">
        {/* Background geometric wedge — large translucent triangle */}
        <Box
          position="absolute"
          top="0"
          right="-20px"
          w="0"
          h="0"
          borderLeft="300px solid transparent"
          borderBottom="200px solid"
          borderBottomColor={COLORS.gold}
          opacity={0.04}
          pointerEvents="none"
        />
        <Flex align="baseline" gap="16px" mb="24px">
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
            工作区卡片——舰队
          </Text>
        </Flex>

        {/* Spatial Layer 1 — Foreground: first 2 cards, first card larger/closer */}
        <Flex wrap="wrap" gap="24px">
          <Box flex="1 1 calc(55% - 12px)" minW="280px" transform="scale(1.02)" boxShadow={SHADOW.large}>
            <WorkspaceCard
              name="frontend-dev"
              provider="docker"
              status="running"
              cpu="23%"
              mem="512MB"
              uptime="4h12m"
            />
          </Box>
          <Box flex="1 1 calc(45% - 12px)" minW="280px">
            <WorkspaceCard
              name="api-server"
              provider="kubernetes"
              status="running"
              cpu="67%"
              mem="1.2GB"
              uptime="12d3h"
            />
          </Box>
        </Flex>

        {/* Spatial Layer 2 — Midground: offset diagonal cascade */}
        <Flex wrap="wrap" gap="24px" ml="40px" mt="-16px">
          <Box flex="1 1 calc(50% - 12px)" minW="280px">
            <WorkspaceCard
              name="data-pipeline"
              provider="docker"
              status="building"
              cpu="--"
              mem="--"
              uptime="--"
            />
          </Box>
          <Box flex="1 1 calc(50% - 12px)" minW="280px">
            <WorkspaceCard
              name="staging-env"
              provider="aws"
              status="stopped"
              cpu="--"
              mem="--"
              uptime="--"
            />
          </Box>
        </Flex>

        {/* Spatial Layer 3 — Background: single column, receding */}
        <Flex wrap="wrap" gap="24px" maxW="600px" opacity={0.85}>
          <Box flex="1 1 100%">
            <WorkspaceCard
              name="ml-training"
              provider="gcp"
              status="running"
              cpu="94%"
              mem="3.8GB"
              uptime="2d18h"
            />
          </Box>
          <Box flex="1 1 100%">
            <WorkspaceCard
              name="docs-site"
              provider="docker"
              status="stopped"
              cpu="--"
              mem="--"
              uptime="--"
            />
          </Box>
        </Flex>
      </Box>

      {/* STAT CARDS */}
      <Box px={{ base: "32px", md: "80px" }} py="32px">
        <Flex align="baseline" gap="16px" mb="24px">
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
            统计卡片——遥测
          </Text>
        </Flex>

        <Flex gap="0" wrap="wrap">
          <Box flex={2} minW="200px" boxShadow={`6px 6px 0px ${COLORS.pureWhite}1a`}>
            <StatCard label="活跃工作区" value="12" unit="在线" accent={COLORS.statusGreen} />
          </Box>
          <Box flex={1} minW="140px">
            <StatCard label="CPU 集群" value="347" unit="核心" accent={COLORS.red} />
          </Box>
          <Box flex={1} minW="140px">
            <StatCard label="已分配内存" value="48" unit="GB" accent={COLORS.gold} />
          </Box>
          <Box flex={1} minW="140px" opacity={0.8}>
            <StatCard label="供应方" value="06" unit="已配置" accent={COLORS.metalWhite} />
          </Box>
        </Flex>
      </Box>

      {/* Geometric decoration — between STAT and ALERT */}
      <Box px={{ base: "32px", md: "80px" }} position="relative">
        <Box w="60px" h="60px" bg={COLORS.gold} opacity={0.1} transform="rotate(45deg)" my="24px" ml="60%" />
        {/* Concentric circles — supplementary accent */}
        <Box position="absolute" top="0" left="30%" pointerEvents="none">
          <Box w="50px" h="50px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.1} />
          <Box w="34px" h="34px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.08} position="absolute" top="8px" left="8px" />
          <Box w="18px" h="18px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.06} position="absolute" top="16px" left="16px" />
        </Box>
      </Box>

      {/* ALERT CARD */}
      <Box px={{ base: "32px", md: "80px" }} py="32px">
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
            警报卡片——预警
          </Text>
        </Flex>

        <Box maxW="700px" position="relative">
          {/* L-bracket decorations — top-left and bottom-right corners */}
          <Box
            position="absolute"
            top="-8px"
            left="-8px"
            w="20px"
            h="20px"
            borderTop={`3px solid ${COLORS.velocityOrange}`}
            borderLeft={`3px solid ${COLORS.velocityOrange}`}
            opacity={0.2}
            pointerEvents="none"
            zIndex={5}
          />
          <Box
            position="absolute"
            bottom="-8px"
            right="-8px"
            w="20px"
            h="20px"
            borderBottom={`3px solid ${COLORS.velocityOrange}`}
            borderRight={`3px solid ${COLORS.velocityOrange}`}
            opacity={0.2}
            pointerEvents="none"
            zIndex={5}
          />
          <Box position="relative" zIndex={1}>
            <Box borderLeft="3px solid" borderColor={COLORS.gold} pl="8px">
              <AlertCard
                title="供应方连接丢失"
                message="Docker 守护进程未响应。正在尝试重新连接。上次成功握手：2024-04-12T08:34:00Z。"
              />
            </Box>
          </Box>
          <Box mt="-8px" ml="16px" position="relative" zIndex={2}>
            <Box borderLeft="3px solid" borderColor={COLORS.gold} pl="8px" ml="4px">
              <AlertCard
                title="工作区内存危急"
                message="ml-training 工作区已超过 90% 内存分配。建议扩容或终止未使用的进程。"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Circle decoration — between ALERT and PROVIDER */}
      <Box px={{ base: "32px", md: "80px" }} position="relative">
        <Box w="40px" h="40px" borderRadius="50%" border={`2px solid ${COLORS.electricCyan}`} opacity={0.2} my="16px" ml="20%" />
        {/* Chevron/arrow pointing down */}
        <Box position="absolute" top="4px" left="50%" pointerEvents="none">
          <Box w="16px" h="16px" borderRight={`2px solid ${COLORS.gold}`} borderBottom={`2px solid ${COLORS.gold}`} transform="rotate(45deg)" opacity={0.15} />
        </Box>
      </Box>

      {/* PROVIDER CARDS */}
      <Box px={{ base: "32px", md: "80px" }} py="32px">
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
            供应方卡片——基础设施
          </Text>
        </Flex>

        <VStack align="stretch" gap="12px" maxW="600px">
          <Box ml="0px">
            <ProviderCard name="Docker" type="容器运行时" region="Local" />
          </Box>
          <Box ml="8px">
            <ProviderCard name="Kubernetes" type="集群" region="us-east-1" />
          </Box>
          <Box ml="16px">
            <ProviderCard name="AWS EC2" type="云实例" region="eu-west-1" />
          </Box>
          <Box ml="24px">
            <ProviderCard name="GCP Compute" type="云实例" region="asia-east1" />
          </Box>
        </VStack>
      </Box>

      {/* BACK */}
      <Box px="80px" py="32px" position="relative">
        {/* Dashed line divider — above back link */}
        <Box mb="20px">
          {Array.from({ length: 40 }).map((_, i) => (
            <Box key={i} display="inline-block" w="8px" h="1px" bg={COLORS.black} opacity={0.12} mr="4px" />
          ))}
        </Box>
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
