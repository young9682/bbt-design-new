import { Box, Flex, Text, Grid, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "../../Theme";

const M = {
  Box: motion(Box),
  Flex: motion(Flex),
  Text: motion(Text),
};

const STEPS = [
  {
    id: "identity",
    label: "身份",
    title: "建立操作身份",
    subtitle: "ONBOARDING // STEP 01",
    description: "输入你的账户标识与命名空间。系统将为你的会话分配一个独立的会话标识。",
  },
  {
    id: "environment",
    label: "环境",
    title: "配置计算环境",
    subtitle: "ONBOARDING // STEP 02",
    description: "选择默认工作区与供应方。你可以随时在控制台中切换集群或本地运行时。",
  },
  {
    id: "cluster",
    label: "集群",
    title: "接入 BBT 集群",
    subtitle: "ONBOARDING // STEP 03",
    description: "验证 kubeconfig 与 VPN 状态。成功后将获得 Volcano 队列与 SLURM 节点的访问权限。",
  },
  {
    id: "launch",
    label: "进入",
    title: "进入工作台",
    subtitle: "ONBOARDING // STEP 04",
    description: "所有子系统检查完毕。点击进入以进入你的工作台，开始提交任务与监控资源。",
  },
];

const PROVIDERS = [
  { key: "local", name: "LOCAL DOCKER", tag: "默认" },
  { key: "bbt-k8s", name: "BBT KUBERNETES", tag: "推荐" },
  { key: "bbt-slurm", name: "BBT SLURM", tag: "HPC" },
];

const QUEUES = [
  { key: "cpu-pool", name: "CPU-POOL", cores: "64", status: "可用" },
  { key: "gpu-pool", name: "GPU-POOL", cores: "32", status: "紧张" },
];

function ProgressIndicator({ current }: { current: number }) {
  return (
    <Flex w="100%" gap="0">
      {STEPS.map((step, i) => {
        const active = i <= current;
        const currentStep = i === current;
        return (
          <Box key={step.id} flex={1} position="relative">
            <Box
              h="8px"
              bg={active ? COLORS.red : COLORS.metalWhite}
              borderTop={`${BORDER.standard} ${active ? COLORS.redDark : COLORS.industrialBlack}`}
              borderBottom={`${BORDER.standard} ${active ? COLORS.redDark : COLORS.industrialBlack}`}
              borderLeft={i === 0 ? `${BORDER.standard} ${active ? COLORS.redDark : COLORS.industrialBlack}` : "none"}
              borderRight={`${BORDER.hairline} ${COLORS.black}`}
              position="relative"
              overflow="hidden"
            >
              {currentStep && (
                <M.Box
                  position="absolute"
                  top="0"
                  left="0"
                  bottom="0"
                  bg={COLORS.gold}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                />
              )}
            </Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="9px"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={active ? COLORS.red : COLORS.industrialBlack}
              mt="6px"
              textAlign="center"
            >
              {String(i + 1).padStart(2, "0")} {step.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
}

function StepIdentity() {
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap="16px"
      h="100%"
    >
      <VStack align="stretch" gap="12px" justify="center">
        <Box>
          <Text sx={TOKENS.label} color={COLORS.industrialBlack} mb="6px">
            任务呼号
          </Text>
          <Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.small}
            p="10px 12px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="13px"
              color={COLORS.black}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              OPERATOR-07
            </Text>
          </Box>
        </Box>
        <Box>
          <Text sx={TOKENS.label} color={COLORS.industrialBlack} mb="6px">
            命名空间
          </Text>
          <Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.small}
            p="10px 12px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="13px"
              color={COLORS.black}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              poc-operator-07
            </Text>
          </Box>
        </Box>
      </VStack>

      <Box
        bg={COLORS.black}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        p="16px"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          w="40px"
          h="40px"
          bg={COLORS.red}
          clipPath="polygon(100% 0, 100% 100%, 0 0)"
        />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="11px"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color={COLORS.metalWhite}
          mb="12px"
        >
          会话标识
        </Text>
        <Flex direction="column" gap="8px">
          {[
            { k: "UUID", v: "7a3f-9e21-04b8" },
            { k: "ROLE", v: "NAMESPACE-ADMIN" },
            { k: "VPN", v: "NETBIRD-CONNECTED" },
          ].map((row) => (
            <Flex key={row.k} justify="space-between" align="center">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.metalWhite}
                opacity={0.6}
              >
                {row.k}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="11px"
                color={COLORS.gold}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {row.v}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Grid>
  );
}

function StepEnvironment() {
  return (
    <VStack align="stretch" gap="12px" h="100%">
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="12px">
        {PROVIDERS.map((provider, i) => (
          <M.Box
            key={provider.key}
            bg={i === 1 ? COLORS.red : COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={i === 1 ? SHADOW.red : SHADOW.small}
            p="12px"
            cursor="pointer"
            whileHover={{ y: -2, boxShadow: SHADOW.medium }}
            transition={{ duration: DURATION.instant }}
            position="relative"
          >
            <Flex justify="space-between" align="flex-start">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={i === 1 ? COLORS.pureWhite : COLORS.black}
              >
                {provider.name}
              </Text>
              <Box
                bg={i === 1 ? COLORS.gold : COLORS.metalWhite}
                px="6px"
                py="2px"
                border={`${BORDER.standard} ${COLORS.black}`}
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="8px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={COLORS.black}
                >
                  {provider.tag}
                </Text>
              </Box>
            </Flex>
          </M.Box>
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" flex={1}>
        {QUEUES.map((queue) => (
          <Box
            key={queue.key}
            bg={COLORS.black}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.small}
            p="12px"
            position="relative"
          >
            <Box h="3px" bg={queue.key === "gpu-pool" ? COLORS.velocityOrange : COLORS.signalGreen} mb="10px" />
            <Flex justify="space-between" align="center" mb="8px">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="13px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                {queue.name}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={queue.key === "gpu-pool" ? COLORS.velocityOrange : COLORS.signalGreen}
              >
                {queue.status}
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="22px"
              fontWeight={WEIGHT.black}
              color={COLORS.metalWhite}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {queue.cores}
              <Text as="span" fontSize="10px" ml="4px" color={COLORS.metalWhite} opacity={0.6}>
                CORES
              </Text>
            </Text>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
}

function StepCluster() {
  const checks = [
    { label: "NETBIRD VPN", status: "OK", color: COLORS.signalGreen },
    { label: "KUBECONFIG", status: "OK", color: COLORS.signalGreen },
    { label: "RANCHER TOKEN", status: "OK", color: COLORS.signalGreen },
    { label: "NEXUS MIRROR", status: "PENDING", color: COLORS.gold },
  ];

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap="16px"
      h="100%"
    >
      <VStack align="stretch" gap="8px" justify="center">
        {checks.map((check) => (
          <Flex
            key={check.label}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.small}
            p="10px 12px"
            justify="space-between"
            align="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={COLORS.industrialBlack}
            >
              {check.label}
            </Text>
            <Flex align="center" gap="6px">
              <Box w="6px" h="6px" bg={check.color} />
              <Text
                fontFamily={FONT.mono}
                fontSize="11px"
                fontWeight={WEIGHT.bold}
                color={check.color}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {check.status}
              </Text>
            </Flex>
          </Flex>
        ))}
      </VStack>

      <Box
        bg={COLORS.metalWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        p="16px"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="100%"
          h="4px"
          bg={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 8px, transparent 8px, transparent 12px)`}
        />
        <Text sx={TOKENS.label} color={COLORS.industrialBlack} mb="12px">
          连接监控
        </Text>
        <VStack align="stretch" gap="10px">
          {[
            { k: "LATENCY", v: "18 MS" },
            { k: "CLUSTER", v: "RKE2-BBT-01" },
            { k: "NAMESPACE", v: "poc-operator-07" },
          ].map((row) => (
            <Flex key={row.k} justify="space-between" align="baseline">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.industrialBlack}
                opacity={0.7}
              >
                {row.k}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="13px"
                fontWeight={WEIGHT.bold}
                color={COLORS.black}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {row.v}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Grid>
  );
}

function StepLaunch() {
  return (
    <Box h="100%" position="relative" overflow="hidden">
      {/* Background red wedge */}
      <Box
        position="absolute"
        bottom="0"
        left="-10%"
        w="70%"
        h="100%"
        bg={COLORS.red}
        clipPath="polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)"
        opacity={0.08}
        zIndex={0}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        w="60px"
        h="60px"
        bg={COLORS.gold}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        opacity={0.15}
        zIndex={0}
      />

      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        position="relative"
        zIndex={1}
        textAlign="center"
        gap="16px"
      >
        <Box
          w="56px"
          h="56px"
          bg={COLORS.red}
          border={`${BORDER.heavy} ${COLORS.redDark}`}
          boxShadow={SHADOW.red}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize="28px"
            color={COLORS.pureWhite}
          >
            &#8594;
          </Text>
        </Box>
        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="22px"
            letterSpacing="0.02em"
            textTransform="uppercase"
            color={COLORS.black}
            lineHeight={0.95}
          >
            所有系统正常
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="22px"
            letterSpacing="0.02em"
            textTransform="uppercase"
            color={COLORS.red}
            lineHeight={0.95}
            mt="2px"
          >
            进入工作台
          </Text>
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.industrialBlack}
          letterSpacing="0.06em"
        >
          3 个供应方 · 2 个队列 · 4 项检查通过
        </Text>
      </Flex>
    </Box>
  );
}

const STEP_CONTENT: Record<string, React.FC> = {
  identity: StepIdentity,
  environment: StepEnvironment,
  cluster: StepCluster,
  launch: StepLaunch,
};

export default function SceneOnboarding() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (idx < STEPS.length - 1) {
      setDirection(1);
      setIdx(idx + 1);
    }
  };

  const goBack = () => {
    if (idx > 0) {
      setDirection(-1);
      setIdx(idx - 1);
    }
  };

  const CurrentStep = STEP_CONTENT[STEPS[idx].id];

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg={COLORS.concrete}
      p={{ base: "12px", md: "16px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative geometric elements */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="64px"
        h="64px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 0)"
        opacity={0.08}
        pointerEvents="none"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="12px"
        left="12px"
        w="24px"
        h="24px"
        border={`${BORDER.heavy} ${COLORS.gold}`}
        transform="rotate(45deg)"
        opacity={0.25}
        pointerEvents="none"
        zIndex={0}
      />
      <Box
        position="absolute"
        top="30%"
        right="6%"
        w="80px"
        h="2px"
        bg={COLORS.electricCyan}
        transform="rotate(-25deg)"
        opacity={0.35}
        pointerEvents="none"
        zIndex={0}
      />

      {/* Header */}
      <Box position="relative" zIndex={1} mb="12px">
        <Flex
          justify="space-between"
          align="flex-end"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "8px", sm: "0" }}
        >
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "20px", md: "28px" }}
              lineHeight={0.9}
              letterSpacing="-0.02em"
              color={COLORS.black}
            >
              {STEPS[idx].title}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              letterSpacing="0.08em"
              color={COLORS.industrialBlack}
              opacity={0.7}
              mt="6px"
            >
              {STEPS[idx].subtitle}
            </Text>
          </Box>
          <Box
            bg={COLORS.black}
            px="10px"
            py="5px"
            border={`${BORDER.standard} ${COLORS.black}`}
          >
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              color={COLORS.gold}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(idx + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </Text>
          </Box>
        </Flex>
        <Text
          fontFamily={FONT.sans}
          fontSize="12px"
          color={COLORS.industrialBlack}
          mt="8px"
          maxW="600px"
          lineHeight={1.5}
        >
          {STEPS[idx].description}
        </Text>
      </Box>

      {/* Progress */}
      <Box position="relative" zIndex={1} mb="12px">
        <ProgressIndicator current={idx} />
      </Box>

      {/* Content */}
      <Box
        position="relative"
        zIndex={1}
        flex={1}
        minH="0"
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        p={{ base: "12px", md: "16px" }}
        overflow="auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          <M.Box
            key={STEPS[idx].id}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: DURATION.normal, ease: EASING.launch }}
            h="100%"
          >
            <CurrentStep />
          </M.Box>
        </AnimatePresence>
      </Box>

      {/* Footer controls */}
      <Flex
        position="relative"
        zIndex={1}
        justify="space-between"
        align="center"
        mt="12px"
      >
        <M.Box
          as="button"
          onClick={goBack}
          disabled={idx === 0}
          bg={idx === 0 ? COLORS.metalWhite : COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={idx === 0 ? "none" : SHADOW.medium}
          px="16px"
          py="8px"
          cursor={idx === 0 ? "not-allowed" : "pointer"}
          whileHover={idx === 0 ? {} : { y: -2, boxShadow: SHADOW.large }}
          whileTap={idx === 0 ? {} : { y: 1 }}
          transition={{ duration: DURATION.instant }}
          opacity={idx === 0 ? 0.5 : 1}
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.bold}
            fontSize="11px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={COLORS.black}
          >
            &#8592; 返回
          </Text>
        </M.Box>

        <HStack spacing="8px" display={{ base: "none", sm: "flex" }}>
          {STEPS.map((step, i) => (
            <Box
              key={step.id}
              w="6px"
              h="6px"
              bg={i === idx ? COLORS.red : COLORS.metalWhite}
              border={`1px solid ${i === idx ? COLORS.redDark : COLORS.industrialBlack}`}
            />
          ))}
        </HStack>

        <M.Box
          as="button"
          onClick={goNext}
          disabled={idx === STEPS.length - 1}
          bg={idx === STEPS.length - 1 ? COLORS.gold : COLORS.red}
          border={`${BORDER.heavy} ${idx === STEPS.length - 1 ? COLORS.goldDark : COLORS.redDark}`}
          boxShadow={idx === STEPS.length - 1 ? SHADOW.gold : SHADOW.red}
          px="20px"
          py="10px"
          cursor={idx === STEPS.length - 1 ? "not-allowed" : "pointer"}
          whileHover={idx === STEPS.length - 1 ? {} : { y: -2, boxShadow: SHADOW.red }}
          whileTap={idx === STEPS.length - 1 ? {} : { y: 1 }}
          transition={{ duration: DURATION.instant }}
          opacity={idx === STEPS.length - 1 ? 0.6 : 1}
        >
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="12px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={idx === STEPS.length - 1 ? COLORS.black : COLORS.pureWhite}
          >
            {idx === STEPS.length - 1 ? "已完成" : "继续"} &#8594;
          </Text>
        </M.Box>
      </Flex>
    </Box>
  );
}
