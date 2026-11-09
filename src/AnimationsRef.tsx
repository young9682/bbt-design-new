import { Box, Text, Flex, VStack, HStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
  Flex: motion(Flex),
};


/** Orbit stroke animation — circle draws itself */
function OrbitAnimation() {
  const size = 160;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Box>
      <Flex align="center" gap="40px">
        <Box position="relative" w={`${size}px`} h={`${size}px`}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.black}
              strokeWidth={strokeWidth}
              opacity={0.1}
            />
            {/* Animated orbit */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1,
              }}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          {/* Satellite dot at center */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="12px"
            h="12px"
            bg={COLORS.red}
          />
        </Box>

        <Box>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="16px"
            letterSpacing="0.06em"
            textTransform="uppercase"
            mb="8px"
          >
            轨道笔画
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.regular}
            fontSize="13px"
            color={COLORS.industrialBlack}
            lineHeight={1.6}
            maxW="300px"
          >
            圆沿路径自我绘制。代表轨道完成、加载循环、连接建立。每圈2秒，线性缓动。
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

/** Launch slide-in — element enters from the left with authority */
function LaunchAnimation() {
  return (
    <Box overflow="hidden" py="16px">
      <M.Box
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASING.launch }}
        bg={COLORS.red}
        px="32px"
        py="20px"
        maxW="500px"
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="24px"
          color={COLORS.pureWhite}
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          入场序列
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="12px"
          color={COLORS.pureWhite}
          opacity={0.7}
          mt="4px"
        >
          元素从左侧进入。0.6 秒，减速缓动。
        </Text>
      </M.Box>
    </Box>
  );
}

/** Number counter animation */
function CounterAnimation() {
  const count = useMotionValue(0);
  const display = useTransform(count, (v: number) => Math.round(v).toLocaleString());
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(count, 1957, {
      duration: 2.5,
      ease: EASING.accelerate,
      onComplete: () => {
        // Reset and repeat
        setTimeout(() => {
          count.set(0);
          const controls2 = animate(count, 1957, {
            duration: 2.5,
            ease: EASING.accelerate,
            onUpdate: (v: number) => setDisplayValue(Math.round(v).toLocaleString()),
          });
          return () => controls2.stop();
        }, 1000);
      },
      onUpdate: (v: number) => setDisplayValue(Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, []);

  return (
    <Flex align="center" gap="40px">
      <Box
        bg={COLORS.black}
        border={`${BORDER.heavy} ${COLORS.black}`}
        px="40px"
        py="24px"
        minW="240px"
        textAlign="center"
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="72px"
          color={COLORS.red}
          lineHeight={1}
          letterSpacing="-0.02em"
        >
          {displayValue}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="11px"
          letterSpacing="0.15em"
          textTransform="uppercase"
          color={COLORS.gold}
          mt="8px"
        >
          加速中
        </Text>
      </Box>
      <Box>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="16px"
          letterSpacing="0.06em"
          textTransform="uppercase"
          mb="8px"
        >
          计数器——加速的数字
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="13px"
          color={COLORS.industrialBlack}
          lineHeight={1.6}
          maxW="300px"
        >
          数字以加速缓动增长。每一位数字的增长都是可见的进步。起步慢，结尾快——如同火箭。
        </Text>
      </Box>
    </Flex>
  );
}

/** Progress bar — single direction, no loop */
function ProgressAnimation() {
  return (
    <Box>
      <VStack align="stretch" gap="24px">
        {/* Determinate progress */}
        <Box>
          <Flex justify="space-between" mb="8px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              部署工作区
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.industrialBlack}
              letterSpacing="0.05em"
            >
              73%
            </Text>
          </Flex>
          <Box h="8px" bg={COLORS.metalWhite} border={`${BORDER.standard} ${COLORS.black}`} position="relative">
            <M.Box
              h="100%"
              bg={COLORS.red}
              initial={{ width: "0%" }}
              animate={{ width: "73%" }}
              transition={{ duration: 1.8, ease: EASING.launch }}
            />
          </Box>
        </Box>

        {/* Full progress */}
        <Box>
          <Flex justify="space-between" mb="8px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              镜像拉取完成
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.statusGreen}
              letterSpacing="0.05em"
            >
              100%
            </Text>
          </Flex>
          <Box h="8px" bg={COLORS.metalWhite} border={`${BORDER.standard} ${COLORS.black}`}>
            <Box h="100%" bg={COLORS.statusGreen} w="100%" />
          </Box>
        </Box>

        {/* Indeterminate segment */}
        <Box>
          <Flex justify="space-between" mb="8px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.12em"
              textTransform="uppercase"
            >
              建立连接
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.statusAmber}
              letterSpacing="0.05em"
            >
              等待中
            </Text>
          </Flex>
          <Box h="8px" bg={COLORS.metalWhite} border={`${BORDER.standard} ${COLORS.black}`} overflow="hidden">
            <M.Box
              h="100%"
              bg={COLORS.statusAmber}
              w="30%"
              animate={{ x: ["-30%", "130%"] }}
              transition={{
                duration: 1.5,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

/** Pulse / signal animation */
function SignalAnimation() {
  return (
    <Flex align="center" gap="40px">
      <Box position="relative" w="80px" h="80px">
        {/* Outer pulse ring */}
        <M.Box
          position="absolute"
          top="50%"
          left="50%"
          w="80px"
          h="80px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.red}`}
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Inner solid */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          w="24px"
          h="24px"
          bg={COLORS.red}
          borderRadius="50%"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </Box>
      <Box>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="16px"
          letterSpacing="0.06em"
          textTransform="uppercase"
          mb="8px"
        >
          信号脉冲
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="13px"
          color={COLORS.industrialBlack}
          lineHeight={1.6}
          maxW="300px"
        >
          用于活动/传输状态的径向脉冲。2秒周期。环形扩展并消散。信号永不停歇。
        </Text>
      </Box>
    </Flex>
  );
}

/** Stagger entrance — elements enter one after another */
function StaggerAnimation() {
  const items = ["供应方", "工作区", "配置", "网络", "部署"];

  return (
    <Box>
      <VStack align="stretch" gap="0">
        {items.map((item, i) => (
          <M.Box
            key={item}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: DURATION.normal,
              delay: i * 0.1,
              ease: EASING.launch,
            }}
            bg={i % 2 === 0 ? COLORS.pureWhite : COLORS.concrete}
            border={`${BORDER.standard} ${COLORS.black}`}
            px="20px"
            py="14px"
          >
            <Flex align="center" gap="16px">
              <Text
                fontFamily={FONT.mono}
                fontSize="12px"
                color={COLORS.gold}
                w="24px"
                letterSpacing="0.05em"
              >
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="14px"
                letterSpacing="0.06em"
                textTransform="uppercase"
              >
                {item}
              </Text>
            </Flex>
          </M.Box>
        ))}
      </VStack>
    </Box>
  );
}

/** Speed lines — diagonal streaks suggesting forward motion */
function SpeedLinesAnimation() {
  return (
    <Flex align="center" gap="40px">
      <Box
        bg={COLORS.black}
        border={`${BORDER.heavy} ${COLORS.black}`}
        w="280px"
        h="160px"
        position="relative"
        overflow="hidden"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <M.Box
            key={i}
            position="absolute"
            top={`${i * 20 + 5}%`}
            left="-10%"
            h="1px"
            bg={i % 3 === 0 ? COLORS.electricCyan : i % 3 === 1 ? COLORS.red : COLORS.gold}
            opacity={0.6}
            animate={{
              x: ["-20%", "120%"],
              width: [`${40 + Math.random() * 30}%`],
            }}
            transition={{
              duration: 0.8 + i * 0.15,
              delay: i * 0.2,
              ease: "linear" as const,
              repeat: Infinity,
              repeatDelay: 0.5 + Math.random() * 0.5,
            }}
          />
        ))}
        <Text
          position="absolute"
          bottom="12px"
          right="12px"
          fontFamily={FONT.mono}
          fontSize="11px"
          color={COLORS.electricCyan}
          letterSpacing="0.08em"
          opacity={0.6}
        >
          VELOCITY &#8594;
        </Text>
      </Box>
      <Box>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="16px"
          letterSpacing="0.06em"
          textTransform="uppercase"
          mb="8px"
        >
          速度线
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="13px"
          color={COLORS.industrialBlack}
          lineHeight={1.6}
          maxW="300px"
        >
          青色、红色和金色的对角条纹。暗示速度而非字面运动。用于英雄背景、加载状态，以及任何未来正在逼近的地方。
        </Text>
      </Box>
    </Flex>
  );
}

/** Data stream — scrolling monospace text */
function DataStreamAnimation() {
  const lines = [
    "系统.线程.001 >> 已初始化",
    "网络.套接字 >> 连接已建立 [12ms]",
    "部署.流水线 >> 第3阶段完成",
    "GPU.集群 >> 已分配 4x A100",
    "构建.制品 >> 哈希: a4f3e2c1",
    "内存.池 >> GC完成 [释放: 2.3GB]",
    "节点.347 >> 健康检查: 通过",
    "加速.吞吐量 >> 12,847 OPS/S",
  ];
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const next = prev + 1;
        const sliced: string[] = [];
        for (let i = 0; i < 5; i++) {
          sliced.push(lines[(next + i) % lines.length]!);
        }
        setVisibleLines(sliced);
        return next;
      });
    }, 600);
    // Initial fill
    const initial: string[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(lines[i]!);
    }
    setVisibleLines(initial);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex align="center" gap="40px">
      <Box
        bg={COLORS.black}
        border={`${BORDER.heavy} ${COLORS.black}`}
        w="340px"
        p="16px"
      >
        <Flex align="center" gap="8px" mb="12px">
          <M.Box
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            w="6px"
            h="6px"
            bg={COLORS.signalGreen}
          />
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.electricCyan}
            letterSpacing="0.12em"
          >
            实时流
          </Text>
        </Flex>
        <VStack align="stretch" gap="2px" h="120px" overflow="hidden">
          {visibleLines.map((line, i) => (
            <M.Text
              key={`${offset}-${i}`}
              fontFamily={FONT.mono}
              fontSize="11px"
              color={i === visibleLines.length - 1 ? COLORS.electricCyan : COLORS.metalWhite}
              opacity={i === visibleLines.length - 1 ? 1 : 0.4 + i * 0.1}
              letterSpacing="0.03em"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: i === visibleLines.length - 1 ? 1 : 0.4 + i * 0.1 }}
              transition={{ duration: 0.2 }}
            >
              {line}
            </M.Text>
          ))}
        </VStack>
      </Box>
      <Box>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="16px"
          letterSpacing="0.06em"
          textTransform="uppercase"
          mb="8px"
        >
          数据流
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="13px"
          color={COLORS.industrialBlack}
          lineHeight={1.6}
          maxW="300px"
        >
          等宽字体在黑色背景上以青色滚动。机器持续诉说——你的任务是倾听。600毫秒节奏。最新行最亮。用于日志、状态流、任何"存活"指示器。
        </Text>
      </Box>
    </Flex>
  );
}

export default function AnimationsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="动效系统" pageIndex="06" />

      {/* HERO */}
      <Box bg={COLORS.black} px="80px" py="48px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-30px"
          right="60px"
          w="160px"
          h="160px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.electricCyan}`}
          opacity={0.15}
          pointerEvents="none"
        />
        {/* Speed lines through hero */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            key={i}
            position="absolute"
            top={`${i * 22}%`}
            left="-10%"
            w={`${130 + i * 5}%`}
            h="1px"
            bg={i % 2 === 0 ? COLORS.electricCyan : COLORS.red}
            opacity={0.06}
            transform="rotate(-12deg)"
            transformOrigin="left center"
            pointerEvents="none"
          />
        ))}
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="-0.02em"
          sx={{ textShadow: `2px 0 ${COLORS.electricCyan}` }}
        >
          运动
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.electricCyan}
          letterSpacing="-0.02em"
        >
          即加速
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.metalWhite}
          opacity={0.6}
          mt="16px"
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          静止是敌人。每个元素都在前进。未来不会等待。
        </Text>
      </Box>

      {/* ===== DECORATIVE: Between hero and section 01 — overlapping circle + rotated square + diagonal ===== */}
      <Box position="relative" h="48px" overflow="hidden">
        {/* Overlapping circle */}
        <Box
          position="absolute"
          top="8px"
          left={{ base: "40px", md: "140px" }}
          w="40px"
          h="40px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
          pointerEvents="none"
        />
        {/* Rotated square overlapping the circle */}
        <Box
          position="absolute"
          top="14px"
          left={{ base: "60px", md: "160px" }}
          w="22px"
          h="22px"
          bg={COLORS.red}
          opacity={0.08}
          transform="rotate(45deg)"
          pointerEvents="none"
        />
        {/* Diagonal line cutting across */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="200%"
          h="1px"
          bg={COLORS.electricCyan}
          opacity={0.1}
          transform="rotate(-8deg)"
          transformOrigin="top left"
          pointerEvents="none"
        />
      </Box>

      {/* ORBIT */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
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
            轨道笔画——圆自我完成
          </Text>
        </Flex>
        <OrbitAnimation />
      </Box>

      {/* LAUNCH SLIDE-IN — receded plane */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        ml={{ base: "0", md: "40px" }}
        opacity={0.8}
      >
        {/* ===== DECORATIVE: L-shaped corner bracket — top-left on section 02 ===== */}
        <Box position="absolute" top="8px" left={{ base: "12px", md: "40px" }} pointerEvents="none">
          <Box w="24px" h="2px" bg={COLORS.red} opacity={0.18} />
          <Box w="2px" h="24px" bg={COLORS.red} opacity={0.18} position="absolute" top="0" left="0" />
        </Box>
        {/* ===== DECORATIVE: L-shaped corner bracket — bottom-right on section 02 ===== */}
        <Box position="absolute" bottom="8px" right={{ base: "12px", md: "40px" }} pointerEvents="none">
          <Box w="24px" h="2px" bg={COLORS.red} opacity={0.18} position="absolute" bottom="0" right="0" />
          <Box w="2px" h="24px" bg={COLORS.red} opacity={0.18} position="absolute" bottom="0" right="0" />
        </Box>
        <Box
          position="absolute"
          top="-12px"
          right={{ base: "40px", md: "120px" }}
          w="36px"
          h="36px"
          border={`${BORDER.heavy} ${COLORS.red}`}
          transform="rotate(45deg)"
          opacity={0.12}
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
            02
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            从左侧入场
          </Text>
        </Flex>
        <LaunchAnimation />
      </Box>

      {/* ===== DECORATIVE: Between sections 02 and 03 — cross shape + dotted line ===== */}
      <Box position="relative" h="32px">
        {/* Cross / plus shape */}
        <Box position="absolute" top="50%" left={{ base: "50%", md: "300px" }} transform="translate(-50%, -50%)" pointerEvents="none">
          <Box w="20px" h="2px" bg={COLORS.black} opacity={0.12} />
          <Box w="2px" h="20px" bg={COLORS.black} opacity={0.12} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" />
        </Box>
        {/* Dotted horizontal line */}
        <Box
          position="absolute"
          bottom="0"
          left={{ base: "20px", md: "80px" }}
          right={{ base: "20px", md: "80px" }}
          h="2px"
          opacity={0.08}
          pointerEvents="none"
          backgroundImage={`repeating-linear-gradient(0deg, ${COLORS.gold} 0px, ${COLORS.gold} 4px, transparent 4px, transparent 10px)`}
        />
      </Box>

      {/* COUNTER — foreground plane */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        mt="-16px"
        bg={COLORS.pureWhite}
        boxShadow={SHADOW.large}
        zIndex={2}
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
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            计数器——加速的数字
          </Text>
        </Flex>
        <CounterAnimation />
        {/* ===== DECORATIVE: L-shaped corner brackets — top-right + bottom-left on section 03 ===== */}
        <Box position="absolute" top="8px" right={{ base: "12px", md: "40px" }} pointerEvents="none">
          <Box w="24px" h="2px" bg={COLORS.electricCyan} opacity={0.15} position="absolute" top="0" right="0" />
          <Box w="2px" h="24px" bg={COLORS.electricCyan} opacity={0.15} position="absolute" top="0" right="0" />
        </Box>
        <Box position="absolute" bottom="8px" left={{ base: "12px", md: "40px" }} pointerEvents="none">
          <Box w="24px" h="2px" bg={COLORS.electricCyan} opacity={0.15} position="absolute" bottom="0" left="0" />
          <Box w="2px" h="24px" bg={COLORS.electricCyan} opacity={0.15} position="absolute" bottom="0" left="0" />
        </Box>
      </Box>

      {/* ===== DECORATIVE: Between sections 03 and 04 — concentric circles ===== */}
      <Box position="relative" h="40px">
        {/* Outer concentric circle */}
        <Box
          position="absolute"
          top="50%"
          right={{ base: "30px", md: "100px" }}
          w="50px"
          h="50px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.electricCyan}`}
          opacity={0.1}
          transform="translate(0, -50%)"
          pointerEvents="none"
        />
        {/* Middle concentric circle */}
        <Box
          position="absolute"
          top="50%"
          right={{ base: "39px", md: "109px" }}
          w="32px"
          h="32px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.electricCyan}`}
          opacity={0.14}
          transform="translate(0, -50%)"
          pointerEvents="none"
        />
        {/* Inner concentric circle */}
        <Box
          position="absolute"
          top="50%"
          right={{ base: "46px", md: "116px" }}
          w="18px"
          h="18px"
          borderRadius="50%"
          bg={COLORS.electricCyan}
          opacity={0.06}
          transform="translate(0, -50%)"
          pointerEvents="none"
        />
      </Box>

      {/* PROGRESS — mid-plane */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        opacity={0.85}
      >
        <Box
          position="absolute"
          bottom="0"
          left={{ base: "12px", md: "40px" }}
          w="28px"
          h="28px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.electricCyan}`}
          opacity={0.15}
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
            04
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            进度条——单方向，不后退
          </Text>
        </Flex>
        <Box maxW="600px">
          <ProgressAnimation />
        </Box>
      </Box>

      {/* ===== DECORATIVE: Repeating tick border — between sections 04 and 05 ===== */}
      <Box position="relative" h="12px" overflow="hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Box
            key={`tick-border-a-${i}`}
            position="absolute"
            top="0"
            left={`${i * 5}%`}
            w="1px"
            h={i % 4 === 0 ? "12px" : "6px"}
            bg={COLORS.gold}
            opacity={0.12}
            pointerEvents="none"
          />
        ))}
      </Box>

      {/* SIGNAL PULSE — foreground, offset right */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        ml={{ base: "0", md: "60px" }}
        boxShadow={SHADOW.medium}
        bg={COLORS.concrete}
        zIndex={2}
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
            05
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            信号脉冲——传输信标
          </Text>
        </Flex>
        <SignalAnimation />
      </Box>

      {/* Geometric accent between planes */}
      <Box
        position="relative"
        h="32px"
      >
        <Box
          position="absolute"
          top="4px"
          left={{ base: "60px", md: "200px" }}
          w="20px"
          h="20px"
          bg={COLORS.black}
          opacity={0.08}
          transform="rotate(45deg)"
          pointerEvents="none"
        />
      </Box>

      {/* ===== DECORATIVE: Between sections 05-06 pair and 07 — large background triangle ===== */}
      <Box position="relative" h="24px" overflow="hidden">
        <Box
          position="absolute"
          top="-60px"
          left={{ base: "-40px", md: "60px" }}
          w="0"
          h="0"
          borderLeft="80px solid transparent"
          borderBottom="140px solid transparent"
          borderTop="140px solid transparent"
          borderRight="80px solid transparent"
          borderTopColor={COLORS.red}
          opacity={0.05}
          pointerEvents="none"
        />
      </Box>

      {/* ===== DECORATIVE: Repeating tick border — between geometric accent and section 06 ===== */}
      <Box position="relative" h="8px" overflow="hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <Box
            key={`tick-border-b-${i}`}
            position="absolute"
            bottom="0"
            left={`${i * 6 + 2}%`}
            w="1.5px"
            h={i % 3 === 0 ? "8px" : "4px"}
            bg={COLORS.red}
            opacity={0.1}
            pointerEvents="none"
          />
        ))}
      </Box>

      {/* STAGGER — background plane, offset left */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        ml={{ base: "0", md: "-24px" }}
        opacity={0.75}
        zIndex={1}
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
            06
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            逐次入场——一个接一个，如同火箭各级
          </Text>
        </Flex>
        <Box maxW="400px">
          <StaggerAnimation />
        </Box>
      </Box>

      {/* SPEED LINES — foreground plane */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        boxShadow={SHADOW.large}
        bg={COLORS.pureWhite}
        zIndex={3}
      >
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.electricCyan}
          >
            07
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            速度线——速度场
          </Text>
        </Flex>
        <SpeedLinesAnimation />
      </Box>

      {/* Geometric accent */}
      <Box position="relative" h="24px">
        <Box
          position="absolute"
          top="0"
          right={{ base: "80px", md: "160px" }}
          w="32px"
          h="32px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
          transform="translateY(-8px)"
          pointerEvents="none"
        />
      </Box>

      {/* ===== DECORATIVE: Between sections 07 and 08 — chevron + calibration ticks ===== */}
      <Box position="relative" h="36px" overflow="hidden">
        {/* Chevron pointing down */}
        <Box position="absolute" top="4px" left={{ base: "50%", md: "260px" }} transform="translateX(-50%)" pointerEvents="none">
          <Box w="16px" h="2px" bg={COLORS.black} opacity={0.15} transform="rotate(35deg) translateX(4px)" />
          <Box w="16px" h="2px" bg={COLORS.black} opacity={0.15} transform="rotate(-35deg) translateX(-4px)" position="absolute" top="0" left="0" />
        </Box>
        {/* Calibration ticks — small repeating vertical lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Box
            key={`cal-tick-${i}`}
            position="absolute"
            bottom="0"
            left={`calc(${i * 8}% + 4%)`}
            w="1px"
            h={i % 3 === 0 ? "10px" : "5px"}
            bg={COLORS.black}
            opacity={0.1}
            pointerEvents="none"
          />
        ))}
      </Box>

      {/* DATA STREAM — receded, overlapping */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="32px"
        mt="-20px"
        opacity={0.75}
        ml={{ base: "0", md: "32px" }}
        zIndex={1}
      >
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.electricCyan}
          >
            08
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            数据流——机器持续诉说
          </Text>
        </Flex>
        <DataStreamAnimation />
      </Box>

      {/* ===== DECORATIVE: Between sections 08 and 09 — diagonal line + small rotated square ===== */}
      <Box position="relative" h="28px" overflow="hidden">
        {/* Diagonal line cutting across */}
        <Box
          position="absolute"
          top="0"
          right="0"
          w="150%"
          h="1px"
          bg={COLORS.red}
          opacity={0.1}
          transform="rotate(-15deg)"
          transformOrigin="top right"
          pointerEvents="none"
        />
        {/* Small rotated square */}
        <Box
          position="absolute"
          top="6px"
          right={{ base: "20px", md: "80px" }}
          w="12px"
          h="12px"
          border={`${BORDER.standard} ${COLORS.gold}`}
          transform="rotate(45deg)"
          opacity={0.15}
          pointerEvents="none"
        />
      </Box>

      {/* TIMING REFERENCE — foreground plane with accent */}
      <Box
        position="relative"
        px={{ base: "32px", md: "80px" }}
        py="48px"
        boxShadow={SHADOW.medium}
        zIndex={2}
      >
        <Box
          position="absolute"
          top="16px"
          right={{ base: "20px", md: "60px" }}
          w="44px"
          h="44px"
          border={`${BORDER.heavy} ${COLORS.red}`}
          transform="rotate(45deg)"
          opacity={0.1}
          pointerEvents="none"
        />
        {/* ===== DECORATIVE: Background geometric plane inside timing section ===== */}
        <Box
          position="absolute"
          top="40%"
          left={{ base: "-20px", md: "0" }}
          w={{ base: "120px", md: "200px" }}
          h="60%"
          bg={COLORS.red}
          opacity={0.05}
          transform="skewY(-6deg)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="10%"
          right={{ base: "-10px", md: "30px" }}
          w="80px"
          h="80px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.08}
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
            09
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            时间令牌
          </Text>
        </Flex>
        <VStack align="stretch" gap="0" maxW="600px">
          <Flex
            py="12px"
            px="16px"
            borderBottom={`${BORDER.standard} ${COLORS.black}`}
            bg={COLORS.pureWhite}
            justify="space-between"
          >
            <Text fontFamily={FONT.mono} fontSize="13px" letterSpacing="0.05em">INSTANT</Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>0.1s</Text>
            <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} opacity={0.6}>微反馈：切换、聚焦</Text>
          </Flex>
          <Flex
            py="12px"
            px="16px"
            borderBottom={`${BORDER.standard} ${COLORS.black}`}
            bg={COLORS.concrete}
            justify="space-between"
          >
            <Text fontFamily={FONT.mono} fontSize="13px" letterSpacing="0.05em">FAST</Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>0.2s</Text>
            <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} opacity={0.6}>悬停、按压、状态变化</Text>
          </Flex>
          <Flex
            py="12px"
            px="16px"
            borderBottom={`${BORDER.standard} ${COLORS.black}`}
            bg={COLORS.pureWhite}
            justify="space-between"
          >
            <Text fontFamily={FONT.mono} fontSize="13px" letterSpacing="0.05em">NORMAL</Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>0.4s</Text>
            <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} opacity={0.6}>面板打开、卡片出现</Text>
          </Flex>
          <Flex
            py="12px"
            px="16px"
            borderBottom={`${BORDER.standard} ${COLORS.black}`}
            bg={COLORS.concrete}
            justify="space-between"
          >
            <Text fontFamily={FONT.mono} fontSize="13px" letterSpacing="0.05em">SLOW</Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>0.8s</Text>
            <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} opacity={0.6}>页面过渡、弹窗</Text>
          </Flex>
          <Flex
            py="12px"
            px="16px"
            bg={COLORS.pureWhite}
            justify="space-between"
          >
            <Text fontFamily={FONT.mono} fontSize="13px" letterSpacing="0.05em">CEREMONIAL</Text>
            <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.gold}>1.5s</Text>
            <Text fontFamily={FONT.sans} fontSize="12px" color={COLORS.industrialBlack} opacity={0.6}>入场序列、强调入场</Text>
          </Flex>
        </VStack>
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
