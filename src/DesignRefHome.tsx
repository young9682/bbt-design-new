import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
  Flex: motion(Flex),
};

const PAGES = [
  { slug: "colors", label: "色彩体系", sub: "语义化的色板" },
  { slug: "typography", label: "文字构成", sub: "形式即武器" },
  { slug: "buttons", label: "按钮系统", sub: "决策即行动" },
  { slug: "cards", label: "信息卡片", sub: "仪表面板" },
  { slug: "inputs", label: "输入控件", sub: "数据接收" },
  { slug: "animations", label: "动效系统", sub: "运动即进步" },
  { slug: "status", label: "状态指示", sub: "轨道遥测" },
  { slug: "layouts", label: "空间布局", sub: "结构构成" },
  { slug: "errors", label: "错误状态", sub: "警报机制" },
  { slug: "diagnostics", label: "系统诊断", sub: "任务控制" },
] as const;

/** 翻页式仪表盘数字单元 */
function FlipDigit({ digit }: { digit: string }) {
  return (
    <Box
      w="18px"
      h="26px"
      bg={COLORS.industrialBlack}
      border={`1px solid ${COLORS.pureWhite}0f`}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {/* Split flap line */}
      <Box position="absolute" top="50%" left="0" right="0" h="1px" bg={COLORS.black} zIndex={2} />
      {/* Top shadow */}
      <Box position="absolute" top="0" left="0" right="0" h="50%" bg={`${COLORS.black}4d`} />
      {/* Bottom reflection */}
      <Box position="absolute" bottom="0" left="0" right="0" h="50%" bg={`${COLORS.pureWhite}05`} />
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize="14px"
        color={COLORS.metalWhite}
        lineHeight={1}
        position="relative"
        zIndex={1}
      >
        {digit}
      </Text>
    </Box>
  )
}

/** 翻页式数值显示 */
function FlipValue({ value, color }: { value: string; color: string }) {
  return (
    <HStack gap="1px" spacing={0}>
      {value.split("").map((char, i) => (
        char === "." || char === "," || char === "/" || char === "%" || char === ":" ? (
          <Text key={i} fontFamily={FONT.mono} fontWeight={WEIGHT.bold} fontSize="14px" color={color} opacity={0.7} lineHeight={1} w="8px" textAlign="center">
            {char}
          </Text>
        ) : (
          <FlipDigit key={i} digit={char} />
        )
      ))}
    </HStack>
  )
}

/** 翻页式仪表板 — Solari 分裂翻板 */
function FlipBoard() {
  const metrics = [
    { label: "OPS/S", value: "12847", color: COLORS.electricCyan },
    { label: "节点", value: "347", color: COLORS.statusGreen },
    { label: "吞吐", value: "94.2", unit: "GB/M", color: COLORS.gold },
    { label: "延迟", value: "8", unit: "MS", color: COLORS.metalWhite },
    { label: "健康", value: "99.97", unit: "%", color: COLORS.statusGreen },
    { label: "GPU", value: "87.3", unit: "%", color: COLORS.velocityOrange },
  ]

  return (
    <Box bg={COLORS.black} position="relative">
      {/* Top red line */}
      <Box h="2px" bg={COLORS.red} />

      <Flex
        px="24px"
        py="0"
        align="stretch"
        h="52px"
        gap="0"
      >
        {metrics.map((m, idx) => (
          <Flex
            key={m.label}
            align="center"
            h="100%"
            px="12px"
            gap="8px"
            borderRight={idx < metrics.length - 1 ? `1px solid ${COLORS.pureWhite}0a` : "none"}
            flex={idx === 0 ? 1.3 : idx === 4 ? 1.2 : 1}
          >
            {/* Label */}
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              color={COLORS.metalWhite}
              opacity={0.35}
              letterSpacing="0.12em"
              textTransform="uppercase"
              lineHeight={1}
              w="28px"
              flexShrink={0}
            >
              {m.label}
            </Text>

            {/* Flip display value */}
            <Flex align="center" gap="2px">
              <FlipValue value={m.value} color={m.color} />
              {m.unit && (
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  color={m.color}
                  opacity={0.5}
                  letterSpacing="0.08em"
                  ml="2px"
                  lineHeight={1}
                >
                  {m.unit}
                </Text>
              )}
            </Flex>

            {/* Status dot */}
            <Box w="3px" h="3px" bg={m.color} opacity={0.5} flexShrink={0} />
          </Flex>
        ))}
      </Flex>

      {/* Bottom instrument line */}
      <Flex h="2px">
        <Box flex={1} bg={COLORS.red} />
        <Box flex={5} bg={`${COLORS.pureWhite}08`} />
      </Flex>
    </Box>
  )
}

/** 运行计数器 */
function RunningCounter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 3000;
    const target = 19571;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setTimeout(() => { start = null; frame = requestAnimationFrame(step); }, 2000);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Text
      fontFamily={FONT.mono}
      fontWeight={WEIGHT.black}
      fontSize={{ base: "80px", md: "140px" }}
      lineHeight={0.85}
      color={COLORS.electricCyan}
      letterSpacing="-0.04em"
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value.toLocaleString()}
    </Text>
  );
}

export default function DesignRefHome() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg={COLORS.concrete} overflow="hidden" position="relative">
      <FlipBoard />



      {/* ==========================================
          几何空间构成 — 平面与纵深互嵌
          二维与三维互嵌，几何对立产生体积感
          ========================================== */}
      <Box
        position="relative"
        h={{ base: "520px", md: "640px" }}
        overflow="hidden"
        bg={COLORS.concrete}
      >
        {/* 底层：黑色建筑平面 */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="55%"
          bg={COLORS.black}
          clipPath="polygon(0 30%, 100% 0%, 100% 100%, 0% 100%)"
        />

        {/* 红色楔形 — 从左下切入空间 */}
        <Box
          position="absolute"
          bottom={0}
          left="-5%"
          w="65%"
          h="70%"
          bg={COLORS.red}
          clipPath="polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)"
        />

        {/* 金色矩形 — 倾斜浮于红色之上，暗示空间深度 */}
        <Box
          position="absolute"
          top="18%"
          left="12%"
          w="180px"
          h="120px"
          bg={COLORS.gold}
          opacity={0.85}
          transform="perspective(600px) rotateY(-8deg) rotateX(5deg)"
          boxShadow={SHADOW.large}
        />

        {/* 电青色平面 — 斜插过画面 */}
        <Box
          position="absolute"
          top="8%"
          right="8%"
          w="280px"
          h="3px"
          bg={COLORS.electricCyan}
          transform="rotate(-28deg)"
          transformOrigin="right center"
          opacity={0.7}
        />
        <Box
          position="absolute"
          top="14%"
          right="12%"
          w="200px"
          h="2px"
          bg={COLORS.electricCyan}
          transform="rotate(-28deg)"
          transformOrigin="right center"
          opacity={0.4}
        />

        {/* 白色圆形 — 从平面进入空间的圆，从平面进入空间 */}
        <Box
          position="absolute"
          top="25%"
          left="38%"
          w="100px"
          h="100px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.pureWhite}`}
          opacity={0.6}
          transform="perspective(400px) rotateY(15deg)"
        />
        {/* 圆变成椭圆 — 二维向三维过渡 */}
        <Box
          position="absolute"
          top="32%"
          left="42%"
          w="60px"
          h="60px"
          borderRadius="50%"
          bg={COLORS.pureWhite}
          opacity={0.15}
          transform="perspective(400px) rotateY(25deg)"
        />

        {/* 正方形旋转变菱形 — 空间旋转 */}
        <Box
          position="absolute"
          bottom="20%"
          right="18%"
          w="80px"
          h="80px"
          bg={COLORS.electricCyan}
          opacity={0.2}
          transform="rotate(45deg)"
        />
        <Box
          position="absolute"
          bottom="22%"
          right="20%"
          w="60px"
          h="60px"
          border={`${BORDER.heavy} ${COLORS.signalGreen}`}
          opacity={0.4}
          transform="rotate(45deg) perspective(300px) rotateY(-20deg)"
        />

        {/* 文字层 — 浮于几何空间之上 */}
        <Box
          position="absolute"
          top={{ base: "32px", md: "48px" }}
          left={{ base: "32px", md: "80px" }}
          zIndex={10}
        >
          <M.Box
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.slow, ease: EASING.launch }}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "64px", md: "120px" }}
              lineHeight={0.85}
              color={COLORS.pureWhite}
              letterSpacing="0.02em"
              sx={{
                textShadow: `3px 0 ${COLORS.electricCyan}, -3px 0 ${COLORS.velocityOrange}`,
                mixBlendMode: "difference",
              }}
            >
              DS
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize={{ base: "18px", md: "28px" }}
              color={COLORS.gold}
              letterSpacing="0.1em"
              mt="8px"
            >
              设计系统参考
            </Text>
          </M.Box>
        </Box>

        {/* 右侧：对角文字 */}
        <Box
          position="absolute"
          top={{ base: "40%", md: "35%" }}
          right={{ base: "32px", md: "80px" }}
          zIndex={10}
          textAlign="right"
        >
          <M.Box
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.2, ease: EASING.launch }}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "20px", md: "36px" }}
              lineHeight={1.1}
              color={COLORS.pureWhite}
              letterSpacing="0.04em"
            >
              以几何构筑
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "20px", md: "36px" }}
              lineHeight={1.1}
              color={COLORS.electricCyan}
              letterSpacing="0.04em"
            >
              空间秩序
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize={{ base: "12px", md: "15px" }}
              color={COLORS.metalWhite}
              mt="12px"
              opacity={0.6}
              letterSpacing="0.06em"
            >
              二维与三维互嵌 · 几何对立产生体积
            </Text>
          </M.Box>
        </Box>

        {/* 底部：加速计数器 */}
        <Box
          position="absolute"
          bottom={{ base: "20px", md: "32px" }}
          left={{ base: "32px", md: "80px" }}
          zIndex={10}
        >
          <RunningCounter />
          <Text
            fontFamily={FONT.mono}
            fontSize="10px"
            color={COLORS.signalGreen}
            letterSpacing="0.08em"
            mt="4px"
          >
            运算次数 // 计数器永不停歇
          </Text>
        </Box>
      </Box>

      {/* 速度色条 */}
      <Flex h="4px">
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>

      {/* ==========================================
          导航区 — 空间层次构成
          前景/中景/远景三层，大小错落，互相叠加
          ========================================== */}
      <Box px={{ base: "24px", md: "80px" }} py="48px" position="relative">
        <Flex align="baseline" gap="16px" mb="40px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="13px"
            color={COLORS.red}
          >
            参考模块
          </Text>
          <Box flex={1} h="2px" bg={COLORS.black} opacity={0.15} />
          <Text
            fontFamily={FONT.mono}
            fontSize="10px"
            color={COLORS.electricCyan}
            letterSpacing="0.08em"
          >
            10/10 在线
          </Text>
        </Flex>

        {/* === 前景层 — 大卡片，深阴影，红底 === */}
        <Box position="relative" mb={{ base: "80px", md: "120px" }}>
          {/* 红色背景平面 — 前景层的"地板" */}
          <Box
            position="absolute"
            bottom="-16px"
            left="-16px"
            right="20%"
            h="60%"
            bg={COLORS.red}
            opacity={0.08}
            zIndex={0}
          />

          <Box position="relative" zIndex={1}>
            {/* 第一行：两个大卡片并排，高度不同 */}
            <Flex gap="0" mb="-20px" position="relative">
              {/* 色彩体系 — 最大的卡片，"最近" */}
              <M.Box
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING.launch }}
                flex={1}
                zIndex={3}
                position="relative"
              >
                <Link as={RouterLink} to="/colors" _hover={{ textDecoration: "none" }}>
                  <Box
                    bg={COLORS.pureWhite}
                    border={`${BORDER.heavy} ${COLORS.black}`}
                    boxShadow={SHADOW.large}
                    p="28px"
                    minH="140px"
                    _hover={{ transform: "translateY(-4px)", boxShadow: `12px 12px 0px ${COLORS.black}40` }}
                    transition={`all ${DURATION.fast}s ease`}
                    cursor="pointer"
                    position="relative"
                    overflow="hidden"
                  >
                    {/* 左上角色块 — 几何装饰 */}
                    <Box position="absolute" top={0} left={0} w="40px" h="40px" bg={COLORS.red} />
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="12px"
                      color={COLORS.gold}
                      ml="48px"
                      mb="8px"
                    >
                      01
                    </Text>
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="28px"
                      lineHeight={1.1}
                      ml="48px"
                    >
                      色彩体系
                    </Text>
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.light}
                      fontSize="13px"
                      color={COLORS.industrialBlack}
                      mt="8px"
                      ml="48px"
                    >
                      语义化的色板
                    </Text>
                  </Box>
                </Link>
              </M.Box>

              {/* 文字构成 — 稍矮，向右偏移，叠加在色彩之上 */}
              <M.Box
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, delay: 0.1, ease: EASING.launch }}
                flex={1}
                zIndex={2}
                ml="-24px"
                mt="24px"
                position="relative"
              >
                <Link as={RouterLink} to="/typography" _hover={{ textDecoration: "none" }}>
                  <Box
                    bg={COLORS.concrete}
                    border={`${BORDER.heavy} ${COLORS.black}`}
                    boxShadow={SHADOW.large}
                    p="24px"
                    minH="110px"
                    _hover={{ transform: "translateY(-4px)", boxShadow: `10px 10px 0px ${COLORS.black}33` }}
                    transition={`all ${DURATION.fast}s ease`}
                    cursor="pointer"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box position="absolute" top={0} right={0} w="8px" h="100%" bg={COLORS.gold} opacity={0.4} />
                    <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.gold} mb="6px">02</Text>
                    <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="24px" lineHeight={1.1}>
                      文字构成
                    </Text>
                    <Text fontFamily={FONT.sans} fontWeight={WEIGHT.light} fontSize="12px" color={COLORS.industrialBlack} mt="6px">
                      形式即武器
                    </Text>
                  </Box>
                </Link>
              </M.Box>
            </Flex>

            {/* 第二行：按钮系统 — 独立大卡片，与上方叠加 */}
            <M.Box
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.2, ease: EASING.launch }}
              maxW="55%"
              ml="40px"
              mt="-12px"
              position="relative"
              zIndex={2}
            >
              <Link as={RouterLink} to="/buttons" _hover={{ textDecoration: "none" }}>
                <Box
                  bg={COLORS.black}
                  border={`${BORDER.heavy} ${COLORS.black}`}
                  boxShadow={SHADOW.large}
                  p="24px"
                  _hover={{ transform: "translateY(-4px) translateX(4px)", boxShadow: `10px 10px 0px ${COLORS.black}4d` }}
                  transition={`all ${DURATION.fast}s ease`}
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                >
                  {/* 红色对角线装饰 */}
                  <Box
                    position="absolute"
                    top={0}
                    left="0"
                    w="3px"
                    h="100%"
                    bg={COLORS.red}
                    transform="rotate(-15deg)"
                    transformOrigin="top"
                    opacity={0.6}
                  />
                  <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.electricCyan} mb="6px" ml="16px">03</Text>
                  <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="24px" color={COLORS.pureWhite} lineHeight={1.1} ml="16px">
                    按钮系统
                  </Text>
                  <Text fontFamily={FONT.sans} fontWeight={WEIGHT.light} fontSize="12px" color={COLORS.metalWhite} mt="6px" ml="16px" opacity={0.6}>
                    决策即行动
                  </Text>
                </Box>
              </Link>
            </M.Box>
          </Box>
        </Box>

        {/* === 中景层 — 中等卡片，2x2 网格，错开排列 === */}
        <Box position="relative" mb={{ base: "60px", md: "100px" }}>
          {/* 金色几何装饰 — 浮于中景与远景之间 */}
          <Box
            position="absolute"
            top="-30px"
            right="10%"
            w="120px"
            h="120px"
            border={`${BORDER.heavy} ${COLORS.gold}`}
            opacity={0.12}
            transform="rotate(45deg)"
            pointerEvents="none"
            zIndex={0}
          />

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap="16px"
            position="relative"
            zIndex={1}
          >
            {[3, 4, 5, 6].map((idx) => {
              const page = PAGES[idx];
              if (!page) return null;
              const bgColors = [COLORS.pureWhite, COLORS.concrete, COLORS.pureWhite, COLORS.concrete];
              const offsets = [0, 12, 0, 12];
              return (
                <M.Box
                  key={page.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.normal, delay: 0.08 * idx, ease: EASING.launch }}
                  mt={`${offsets[idx - 3]}px`}
                >
                  <Link as={RouterLink} to={`/${page.slug}`} _hover={{ textDecoration: "none" }}>
                    <Box
                      bg={bgColors[idx - 3]}
                      border={`${BORDER.standard} ${COLORS.black}`}
                      boxShadow={SHADOW.medium}
                      p="18px"
                      _hover={{ boxShadow: SHADOW.large, transform: "translateY(-2px)" }}
                      transition={`all ${DURATION.fast}s ease`}
                      cursor="pointer"
                      position="relative"
                    >
                      <Flex align="center" gap="12px">
                        <Text fontFamily={FONT.mono} fontSize="11px" color={COLORS.gold}>
                          {String(idx + 1).padStart(2, "0")}
                        </Text>
                        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="18px" flex={1}>
                          {page.label}
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="14px" color={COLORS.red}>
                          &#8594;
                        </Text>
                      </Flex>
                      <Text fontFamily={FONT.sans} fontWeight={WEIGHT.light} fontSize="11px" color={COLORS.industrialBlack} mt="4px" opacity={0.5}>
                        {page.sub}
                      </Text>
                    </Box>
                  </Link>
                </M.Box>
              );
            })}
          </Grid>
        </Box>

        {/* === 远景层 — 最小卡片，降低对比度，排成一行 === */}
        <Box position="relative">
          {/* 淡化的几何 — 远景的深度暗示 */}
          <Box
            position="absolute"
            bottom="-20px"
            left="30%"
            w="80px"
            h="80px"
            borderRadius="50%"
            border={`${BORDER.standard} ${COLORS.industrialBlack}`}
            opacity={0.08}
            pointerEvents="none"
          />

          <Flex gap="0" position="relative" zIndex={1} flexWrap="wrap">
            {[7, 8, 9].map((idx) => {
              const page = PAGES[idx];
              if (!page) return null;
              return (
                <M.Box
                  key={page.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.normal, delay: 0.06 * idx, ease: EASING.launch }}
                  flex={1}
                  minW="160px"
                >
                  <Link as={RouterLink} to={`/${page.slug}`} _hover={{ textDecoration: "none" }}>
                    <Box
                      borderY={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                      px="14px"
                      py="14px"
                      opacity={0.7}
                      _hover={{ opacity: 1, bg: COLORS.red, color: COLORS.pureWhite }}
                      transition={`all ${DURATION.fast}s ease`}
                      cursor="pointer"
                      _groupHover={{ opacity: 1 }}
                    >
                      <Flex align="center" gap="10px">
                        <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.5}>
                          {String(idx + 1).padStart(2, "0")}
                        </Text>
                        <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="14px">
                          {page.label}
                        </Text>
                      </Flex>
                    </Box>
                  </Link>
                </M.Box>
              );
            })}

            {/* Showroom entry */}
            <M.Box
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.7, ease: EASING.launch }}
              flex={1}
              minW="160px"
            >
              <Link as={RouterLink} to="/showroom" _hover={{ textDecoration: "none" }}>
                <Box
                  borderY={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                  px="14px"
                  py="14px"
                  opacity={0.7}
                  _hover={{ opacity: 1, bg: COLORS.red, color: COLORS.pureWhite }}
                  transition={`all ${DURATION.fast}s ease`}
                  cursor="pointer"
                >
                  <Flex align="center" gap="10px">
                    <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.5}>
                      11
                    </Text>
                    <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="14px">
                      样板房
                    </Text>
                  </Flex>
                </Box>
              </Link>
            </M.Box>
          </Flex>
        </Box>
      </Box>

      {/* 页脚 */}
      <Box
        bg={COLORS.black}
        px={{ base: "32px", md: "80px" }}
        py="32px"
      >
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap="16px"
        >
          <Text
            fontFamily={FONT.mono}
            fontSize="11px"
            color={COLORS.metalWhite}
            opacity={0.5}
          >
            设计参考 V0.9.0 // 仅参考 // 非生产环境
          </Text>
          <HStack gap="24px">
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.electricCyan}
            >
              高效动效
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
            >
              几何构成
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.red}
            >
              工业复古
            </Text>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
