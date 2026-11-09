import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


/** Animated counter hook */
function useCounter(target: number, duration: number, delay: number): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const motionVal = { current: 0 };
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        // Acceleration easing
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}

/** Mini bar chart — horizontal */
function MiniBar({
  value,
  max,
  color,
  label,
  detail,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  detail: string;
}) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <Box>
      <Flex justify="space-between" mb="4px">
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} letterSpacing="0.04em">
          {detail}
        </Text>
      </Flex>
      <Box h="6px" bg={COLORS.metalWhite} border={`${BORDER.hairline} ${COLORS.black}`}>
        <Box h="100%" bg={color} w={`${pct}%`} transition="width 0.3s ease" />
      </Box>
    </Box>
  );
}

export default function DiagnosticsRef() {
  const wsCount = useCounter(12, 1.5, 0.3);
  const cpuCores = useCounter(347, 2, 0.5);
  const memGB = useCounter(48, 1.8, 0.7);
  const uptimeHours = useCounter(2847, 2.5, 0.9);

  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="系统诊断" pageIndex="10" />

      {/* HERO */}
      <Box bg={COLORS.black} px="80px" py="48px" position="relative" overflow="hidden">
        {/* Geometric decoration */}
        <Box
          position="absolute"
          top="-40px"
          right="40px"
          w="180px"
          h="180px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.1}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="-20px"
          right="100px"
          w="100px"
          h="100px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.gold}`}
          opacity={0.08}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom={0}
          left="0"
          right="0"
          h="3px"
          bg={COLORS.red}
        />

        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="-0.02em"
        >
          任务
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.gold}
          letterSpacing="-0.02em"
        >
          控制
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.metalWhite}
          opacity={0.6}
          mt="16px"
          letterSpacing="0.04em"
        >
          全部数据。全部系统。全天候。永不眨眼的仪表盘。
        </Text>
      </Box>

      {/* TOP LEVEL METRICS */}
      <Box px={{ base: "32px", md: "80px" }} py="40px">
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
            letterSpacing="0.04em"
          >
            系统概览——第一眼
          </Text>
        </Flex>

        <Flex wrap="wrap" gap="0" position="relative">
          {/* Foreground plane — large, prominent */}
          <M.Box
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASING.launch }}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow="6px 6px 0px rgba(0,0,0,0.2)"
            p="28px"
            w={{ base: "100%", md: "45%" }}
            position="relative"
            zIndex={3}
            overflow="hidden"
          >
            <Box h="3px" bg={COLORS.statusGreen} position="absolute" top={0} left={0} right={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0"
              color={COLORS.industrialBlack}
              opacity={0.5}
            >
              活跃工作区
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="64px"
              color={COLORS.black}
              lineHeight={1}
              mt="4px"
            >
              {wsCount}
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.1em"
              color={COLORS.statusGreen}
              mt="4px"
            >
              较上周 +3
            </Text>
          </M.Box>

          {/* Mid-ground — receded, overlapping left */}
          <M.Box
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: EASING.launch }}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow="3px 3px 0px rgba(0,0,0,0.12)"
            p="24px"
            w={{ base: "100%", md: "38%" }}
            ml={{ base: "0", md: "-16px" }}
            mt={{ base: "0", md: "24px" }}
            position="relative"
            zIndex={2}
            opacity={0.85}
          >
            <Box h="3px" bg={COLORS.red} position="absolute" top={0} left={0} right={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0"
              color={COLORS.industrialBlack}
              opacity={0.5}
            >
              已分配 CPU 核心
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="48px"
              color={COLORS.red}
              lineHeight={1}
              mt="4px"
            >
              {cpuCores}
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.1em"
              color={COLORS.industrialBlack}
              opacity={0.5}
              mt="4px"
            >
              87% 利用率
            </Text>
          </M.Box>

          {/* Background plane — smaller, further back */}
          <M.Box
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7, ease: EASING.launch }}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow="1px 1px 0px rgba(0,0,0,0.08)"
            p="20px"
            w={{ base: "100%", md: "30%" }}
            ml={{ base: "0", md: "20px" }}
            mt={{ base: "0", md: "-12px" }}
            position="relative"
            zIndex={1}
            opacity={0.7}
          >
            <Box h="3px" bg={COLORS.gold} position="absolute" top={0} left={0} right={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0"
              color={COLORS.industrialBlack}
              opacity={0.5}
            >
              已分配内存
            </Text>
            <Flex align="baseline" gap="4px" mt="4px">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="36px"
                color={COLORS.black}
                lineHeight={1}
              >
                {memGB}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="14px"
                letterSpacing="0.08em"
                color={COLORS.gold}
              >
                GB
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.1em"
              color={COLORS.industrialBlack}
              opacity={0.5}
              mt="4px"
            >
              共 64 GB
            </Text>
          </M.Box>

          {/* Deep background — smallest, most receded */}
          <M.Box
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9, ease: EASING.launch }}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow="1px 1px 0px rgba(0,0,0,0.05)"
            p="18px"
            w={{ base: "100%", md: "25%" }}
            mt={{ base: "0", md: "32px" }}
            position="relative"
            zIndex={1}
            opacity={0.7}
          >
            <Box h="3px" bg={COLORS.militaryGreen} position="absolute" top={0} left={0} right={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0"
              color={COLORS.industrialBlack}
              opacity={0.5}
            >
              总运行时间
            </Text>
            <Flex align="baseline" gap="4px" mt="4px">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="36px"
                color={COLORS.black}
                lineHeight={1}
              >
                {uptimeHours}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="14px"
                letterSpacing="0.08em"
                color={COLORS.militaryGreen}
              >
                小时
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.1em"
              color={COLORS.statusGreen}
              mt="4px"
            >
              99.7% 可用率
            </Text>
          </M.Box>
        </Flex>
      </Box>

      {/* Geometric accent — rotated square */}
      <Box px={{ base: "32px", md: "80px" }} position="relative" h="0">
        <Box
          position="relative"
          top="-20px"
          left="220px"
          w="40px"
          h="40px"
          transform="rotate(45deg)"
          opacity={0.12}
          bg={COLORS.red}
          pointerEvents="none"
          zIndex={0}
        />
      </Box>

      {/* RESOURCE BREAKDOWN */}
      <Box px={{ base: "32px", md: "80px" }} py="24px" ml={{ base: "0", md: "40px" }} opacity={0.85} position="relative">
        {/* Diagonal stripes pattern — background of resource section */}
        <Box
          position="absolute"
          top="0"
          right="-20px"
          w="200px"
          h="100%"
          overflow="hidden"
          pointerEvents="none"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Box
              key={i}
              position="absolute"
              top={`${i * 40 - 20}px`}
              right="0"
              w="2px"
              h="60px"
              bg={COLORS.velocityOrange}
              opacity={0.08}
              transform="rotate(-25deg)"
            />
          ))}
        </Box>
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
            letterSpacing="0.04em"
          >
            资源分配——燃料表
          </Text>
        </Flex>

        <Box
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow="4px 4px 0px rgba(0,0,0,0.15)"
          p="24px"
          maxW="700px"
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="13px"
            letterSpacing="0.04em"
            mb="20px"
          >
            按工作区使用量
          </Text>
          <VStack align="stretch" gap="16px">
            <MiniBar label="FRONTEND-DEV" value={23} max={100} color={COLORS.statusGreen} detail="23% CPU" />
            <MiniBar label="API-SERVER" value={67} max={100} color={COLORS.statusAmber} detail="67% CPU" />
            <MiniBar label="DATA-PIPELINE" value={45} max={100} color={COLORS.statusGreen} detail="45% CPU" />
            <MiniBar label="ML-TRAINING" value={94} max={100} color={COLORS.red} detail="94% CPU" />
            <MiniBar label="DOCS-SITE" value={12} max={100} color={COLORS.statusGreen} detail="12% CPU" />
            <MiniBar label="STAGING-ENV" value={0} max={100} color={COLORS.industrialBlack} detail="已停止" />
          </VStack>

          <Box h="1px" bg={COLORS.black} opacity={0.1} my="20px" />

          <Flex justify="space-between">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.04em"
              color={COLORS.industrialBlack}
              opacity={0.5}
            >
              集群总计
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="12px"
              fontWeight={WEIGHT.bold}
              color={COLORS.red}
              letterSpacing="0.04em"
            >
              241 / 347 CORES (69%)
            </Text>
          </Flex>
        </Box>
      </Box>

      {/* Repeating tick border — between resource breakdown and event log */}
      <Box px={{ base: "32px", md: "80px" }} py="8px">
        <Flex gap="6px" align="center" justify="center">
          {Array.from({ length: 30 }).map((_, i) => (
            <Box key={i} w="1px" h={i % 4 === 0 ? "14px" : "6px"} bg={COLORS.electricCyan} opacity={0.12} />
          ))}
        </Flex>
      </Box>

      {/* EVENT LOG */}
      <Box
        px={{ base: "32px", md: "80px" }}
        py="24px"
        mt="-16px"
        position="relative"
        zIndex={4}
      >
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
            letterSpacing="0.04em"
          >
            事件日志——传输记录
          </Text>
        </Flex>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow="8px 8px 0px rgba(0,0,0,0.25)"
          maxW="700px"
        >
          {/* Log header */}
          <Flex
            bg={COLORS.industrialBlack}
            px="16px"
            py="10px"
            justify="space-between"
            align="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="11px"
              letterSpacing="0.04em"
              color={COLORS.metalWhite}
            >
              实时事件流
            </Text>
            <M.Box
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              w="8px"
              h="8px"
              bg={COLORS.statusGreen}
            />
          </Flex>

          {/* Log entries */}
          <Box px="16px" py="8px" maxH="280px" overflow="auto">
            <VStack align="stretch" gap="2px">
              {[
                { time: "08:34:12", level: "ERR", msg: "供应方 docker: 连接超时 (30s)", color: COLORS.red },
                { time: "08:34:10", level: "WRN", msg: "工作区 ml-training: 内存使用率达 94%", color: COLORS.statusAmber },
                { time: "08:33:58", level: "INF", msg: "工作区 api-server: 部署完成 (12.4s)", color: COLORS.statusGreen },
                { time: "08:33:45", level: "INF", msg: "工作区 frontend-dev: IDE 连接已建立", color: COLORS.statusGreen },
                { time: "08:33:30", level: "INF", msg: "供应方 kubernetes: 3 节点健康", color: COLORS.statusGreen },
                { time: "08:33:12", level: "WRN", msg: "守护进程: 文件描述符使用率高 (8096/16384)", color: COLORS.statusAmber },
                { time: "08:32:58", level: "INF", msg: "工作区 data-pipeline: 同步已启动 (批次 #47)", color: COLORS.statusGreen },
                { time: "08:32:40", level: "ERR", msg: "工作区 staging-env: 容器 OOMKilled (退出码 137)", color: COLORS.red },
                { time: "08:32:15", level: "INF", msg: "供应方 aws: 区域 us-east-1 延迟 23ms", color: COLORS.statusGreen },
                { time: "08:31:58", level: "INF", msg: "系统: 垃圾回收完成 (释放 2.3GB)", color: COLORS.statusGreen },
                { time: "08:31:30", level: "WRN", msg: "配置: devcontainer.json 模式 v1 已弃用", color: COLORS.statusAmber },
                { time: "08:31:12", level: "INF", msg: "供应方 gcp: 2 实例运行于 asia-east1", color: COLORS.statusGreen },
              ].map((entry, i) => (
                <Flex key={i} py="4px" gap="12px" align="flex-start">
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.metalWhite}
                    opacity={0.4}
                    flexShrink={0}
                    w="64px"
                    letterSpacing="0.04em"
                  >
                    {entry.time}
                  </Text>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="10px"
                    color={entry.color}
                    w="28px"
                    flexShrink={0}
                    letterSpacing="0.08em"
                  >
                    {entry.level}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.metalWhite}
                    opacity={0.75}
                    letterSpacing="0.02em"
                    lineHeight={1.4}
                  >
                    {entry.msg}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* PROVIDER STATUS GRID */}
      <Box px={{ base: "32px", md: "80px" }} py="24px">
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
            letterSpacing="0.04em"
          >
            供应方状态——地面站
          </Text>
        </Flex>

        <Flex wrap="wrap" maxW="700px" gap="0">
          {/* Geometric circle accent between provider cards */}
          {[
            { name: "DOCKER", status: "健康", latency: "2ms", ws: 5, color: COLORS.statusGreen },
            { name: "KUBERNETES", status: "健康", latency: "12ms", ws: 3, color: COLORS.statusGreen },
            { name: "AWS EC2", status: "降级", latency: "89ms", ws: 2, color: COLORS.statusAmber },
            { name: "GCP COMPUTE", status: "健康", latency: "34ms", ws: 2, color: COLORS.statusGreen },
          ].map((p, idx) => (
            <Box
              key={p.name}
              bg={COLORS.pureWhite}
              border={`${BORDER.standard} ${COLORS.black}`}
              p="16px"
              w={{ base: "100%", md: "50%" }}
              mt={idx >= 2 ? "-8px" : "0"}
              ml={idx % 2 === 1 ? "-12px" : "0"}
              position="relative"
              zIndex={idx < 2 ? 2 : 1}
              opacity={idx < 2 ? 1 : 0.75}
              boxShadow={idx === 0 ? "4px 4px 0px rgba(0,0,0,0.15)" : "none"}
            >
              {/* Rotated square accent on first card */}
              {idx === 1 && (
                <Box
                  position="absolute"
                  top="-12px"
                  right="-12px"
                  w="24px"
                  h="24px"
                  transform="rotate(45deg)"
                  opacity={0.15}
                  border={`${BORDER.standard} ${COLORS.gold}`}
                  pointerEvents="none"
                />
              )}
              <Flex justify="space-between" align="center" mb="12px">
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="14px"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                >
                  {p.name}
                </Text>
                <Box bg={p.color} px="8px" py="3px">
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="9px"
                    letterSpacing="0.04em"
                    color={COLORS.pureWhite}
                  >
                    {p.status}
                  </Text>
                </Box>
              </Flex>
              <HStack gap="24px">
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="8px"
                    letterSpacing="0"
                    color={COLORS.industrialBlack}
                    opacity={0.5}
                  >
                    延迟
                  </Text>
                  <Text fontFamily={FONT.mono} fontSize="16px" fontWeight={WEIGHT.bold}>
                    {p.latency}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="8px"
                    letterSpacing="0"
                    color={COLORS.industrialBlack}
                    opacity={0.5}
                  >
                    工作区
                  </Text>
                  <Text fontFamily={FONT.mono} fontSize="16px" fontWeight={WEIGHT.bold}>
                    {p.ws}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Circle accent between provider status and system health */}
      <Box px={{ base: "32px", md: "80px" }} position="relative" h="0">
        <Box
          position="relative"
          top="8px"
          left="500px"
          w="60px"
          h="60px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.militaryGreen}`}
          opacity={0.1}
          pointerEvents="none"
          zIndex={0}
        />
      </Box>

      {/* Cross shape — between event log and system health */}
      <Box px={{ base: "32px", md: "80px" }} py="8px" position="relative" h="30px">
        <Box position="absolute" left="50%" top="0" pointerEvents="none">
          <Box w="20px" h="2px" bg={COLORS.gold} opacity={0.15} />
          <Box w="2px" h="20px" bg={COLORS.gold} opacity={0.15} position="absolute" top="-9px" left="9px" />
        </Box>
      </Box>

      {/* SYSTEM HEALTH */}
      <Box px={{ base: "32px", md: "80px" }} py="24px" mt="-12px" position="relative" zIndex={5}>
        {/* Background triangle behind system health */}
        <Box
          position="absolute"
          top="-30px"
          left="-40px"
          w="0"
          h="0"
          borderRight="250px solid transparent"
          borderBottom="180px solid"
          borderBottomColor={COLORS.red}
          opacity={0.04}
          pointerEvents="none"
          zIndex={0}
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
            05
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
          >
            系统健康——生命体征
          </Text>
        </Flex>

        {/* Composite accent — circle + rotated square overlapping */}
        <Box
          position="absolute"
          top="60px"
          right={{ base: "-10px", md: "40px" }}
          pointerEvents="none"
          zIndex={0}
        >
          <Box w="50px" h="50px" borderRadius="50%" border={`2px solid ${COLORS.gold}`} opacity={0.1} />
          <Box
            position="absolute"
            top="10px"
            left="10px"
            w="30px"
            h="30px"
            transform="rotate(45deg)"
            bg={COLORS.electricCyan}
            opacity={0.06}
          />
        </Box>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          p="24px"
          maxW="700px"
          boxShadow="6px 6px 0px rgba(200,16,46,0.3)"
        >
          <Grid templateColumns="repeat(3, 1fr)" gap="0">
            {[
              { label: "守护进程", value: "运行中", status: true },
              { label: "文件描述符", value: "8096 / 16384", status: true },
              { label: "守护进程版本", value: "v0.4.2", status: true },
              { label: "套接字", value: "已连接", status: true },
              { label: "Go 协程", value: "247", status: true },
              { label: "配置模式", value: "v2", status: true },
              { label: "运行时间", value: "14d 3h 27m", status: true },
              { label: "守护进程内存", value: "128 MB", status: true },
              { label: "上次 GC", value: "0.4s 前", status: true },
            ].map((item) => (
              <Box
                key={item.label}
                border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                p="12px"
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="8px"
                  letterSpacing="0"
                  color={COLORS.metalWhite}
                  opacity={0.4}
                >
                  {item.label}
                </Text>
                <Flex align="center" gap="6px" mt="4px">
                  {item.status && (
                    <Box w="5px" h="5px" bg={COLORS.statusGreen} flexShrink={0} />
                  )}
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="13px"
                    color={COLORS.pureWhite}
                    letterSpacing="0.03em"
                  >
                    {item.value}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Grid>
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
              letterSpacing="0.04em"
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
