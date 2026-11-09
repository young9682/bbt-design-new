import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING } from "../../Theme";

const M = {
  Flex: motion(Flex),
};

const AUTOPLAY_MS = 4000;

interface SlideConfig {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  bg: string;
  fg: string;
  accent: string;
  number: string;
  numberColor: string;
  numberShadow: string;
  composition: React.ReactNode;
}

/** 方形导航按钮 — 黑底红箭头，硬阴影 */
function ArrowButton({
  glyph,
  label,
  side,
  onClick,
}: {
  glyph: string;
  label: string;
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <Box
      position="absolute"
      top="50%"
      mt={{ base: "-17px", md: "-21px" }}
      left={side === "left" ? { base: SPACE.sm, md: SPACE.md } : undefined}
      right={side === "right" ? { base: SPACE.sm, md: SPACE.md } : undefined}
      zIndex={3}
    >
      <Flex
        as="button"
        aria-label={label}
        onClick={onClick}
        w={{ base: "34px", md: "42px" }}
        h={{ base: "34px", md: "42px" }}
        align="center"
        justify="center"
        bg={COLORS.black}
        border={`${BORDER.standard} ${COLORS.black}`}
        borderRadius="0"
        boxShadow={SHADOW.red}
        cursor="pointer"
        transition={`box-shadow ${DURATION.fast}s ease, transform ${DURATION.instant}s ease`}
        _hover={{ boxShadow: `6px 6px 0px ${COLORS.red}` }}
        _active={{ transform: "translate(2px, 2px)", boxShadow: `2px 2px 0px ${COLORS.red}` }}
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "18px", md: "22px" }}
          lineHeight={1}
          color={COLORS.redLight}
          userSelect="none"
        >
          {glyph}
        </Text>
      </Flex>
    </Box>
  );
}

const SLIDES: SlideConfig[] = [
  {
    id: "wedge",
    kicker: "GEOMETRY IS MEANING",
    title: "对角构成",
    subtitle: "对角线构图 · 视觉动力",
    bg: COLORS.concrete,
    fg: COLORS.black,
    accent: COLORS.red,
    number: "01",
    numberColor: COLORS.red,
    numberShadow: COLORS.black,
    composition: (
      <>
        {/* 红色楔形 — 自左上角切入 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w={{ base: "104px", md: "160px" }}
          h={{ base: "104px", md: "160px" }}
          bg={COLORS.red}
          css={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        {/* 金色楔形 — 叠于红色之上，构成层次 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w={{ base: "52px", md: "80px" }}
          h={{ base: "52px", md: "80px" }}
          bg={COLORS.gold}
          css={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        {/* 金色对角细线 */}
        <Box
          position="absolute"
          top="22%"
          left="16%"
          w={{ base: "42%", md: "38%" }}
          h="3px"
          bg={COLORS.gold}
          opacity={0.8}
          css={{ transform: "rotate(-12deg)" }}
        />
        {/* 黑色小方块 — 右下锚点 */}
        <Box
          position="absolute"
          bottom={{ base: SPACE.md, md: SPACE.lg }}
          right={{ base: SPACE.md, md: SPACE.lg }}
          w={{ base: "14px", md: "20px" }}
          h={{ base: "14px", md: "20px" }}
          bg={COLORS.black}
        />
      </>
    ),
  },
  {
    id: "block",
    kicker: "COLOR IS IDEOLOGY",
    title: "金色矩形",
    subtitle: "工业成就的色度 · 悬浮于黑色虚空",
    bg: COLORS.black,
    fg: COLORS.pureWhite,
    accent: COLORS.gold,
    number: "02",
    numberColor: COLORS.gold,
    numberShadow: COLORS.red,
    composition: (
      <>
        {/* 金色矩形 — 悬浮的主体，红色硬阴影 */}
        <Box
          position="absolute"
          top={{ base: "36px", md: "52px" }}
          left={{ base: SPACE.md, md: SPACE.xl }}
          w={{ base: "124px", md: "184px" }}
          h={{ base: "74px", md: "108px" }}
          bg={COLORS.gold}
          boxShadow={SHADOW.red}
        />
        {/* 电青色对角信号线 */}
        <Box
          position="absolute"
          top="18%"
          right="0"
          w={{ base: "44%", md: "36%" }}
          h="2px"
          bg={COLORS.electricCyan}
          opacity={0.7}
          css={{ transform: "rotate(-24deg)" }}
        />
        {/* 金属白旋转方框 — 远景深度暗示 */}
        <Box
          position="absolute"
          top={{ base: "34px", md: "48px" }}
          right={{ base: "72px", md: "116px" }}
          w={{ base: "22px", md: "30px" }}
          h={{ base: "22px", md: "30px" }}
          border={`${BORDER.standard} ${COLORS.metalWhite}66`}
          css={{ transform: "rotate(45deg)" }}
        />
      </>
    ),
  },
  {
    id: "diagonal",
    kicker: "MOTION IS PROGRESS",
    title: "黑色对角",
    subtitle: "斜线切割秩序 · 运动传递状态",
    bg: COLORS.gold,
    fg: COLORS.black,
    accent: COLORS.red,
    number: "03",
    numberColor: COLORS.black,
    numberShadow: COLORS.pureWhite,
    composition: (
      <>
        {/* 黑色对角带 — 贯穿画面的动势 */}
        <Box
          position="absolute"
          top="34%"
          left="-20%"
          w="140%"
          h={{ base: "52px", md: "72px" }}
          bg={COLORS.black}
          css={{ transform: "rotate(-16deg)" }}
        />
        {/* 白色楔形 — 左下角稳定锚 */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w={{ base: "88px", md: "136px" }}
          h={{ base: "88px", md: "136px" }}
          bg={COLORS.pureWhite}
          css={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        />
        {/* 红色小方块 — 右上角标记 */}
        <Box
          position="absolute"
          top={{ base: "40px", md: "56px" }}
          right={{ base: SPACE.md, md: SPACE.lg }}
          w={{ base: "14px", md: "20px" }}
          h={{ base: "14px", md: "20px" }}
          bg={COLORS.red}
        />
      </>
    ),
  },
  {
    id: "orbit",
    kicker: "CIRCLE IS ORBIT",
    title: "白色圆形",
    subtitle: "圆从平面进入空间 · 轨道就此展开",
    bg: COLORS.pureWhite,
    fg: COLORS.black,
    accent: COLORS.red,
    number: "04",
    numberColor: COLORS.black,
    numberShadow: COLORS.pureWhite,
    composition: (
      <>
        {/* 红色圆形 — 数字悬浮其上的轨道 */}
        <Box
          position="absolute"
          top="50%"
          right={{ base: "18px", md: "36px" }}
          w={{ base: "140px", md: "200px" }}
          h={{ base: "140px", md: "200px" }}
          mt={{ base: "-70px", md: "-100px" }}
          borderRadius="50%"
          bg={COLORS.red}
          boxShadow={SHADOW.medium}
        />
        {/* 黑色对角细线 — 穿过圆的轨迹 */}
        <Box
          position="absolute"
          top="30%"
          right="24%"
          w={{ base: "48%", md: "40%" }}
          h="3px"
          bg={COLORS.black}
          opacity={0.35}
          css={{ transform: "rotate(-20deg)" }}
        />
        {/* 金色小方块 — 右下锚点 */}
        <Box
          position="absolute"
          bottom={{ base: SPACE.md, md: SPACE.lg }}
          right={{ base: SPACE.md, md: SPACE.lg }}
          w={{ base: "14px", md: "20px" }}
          h={{ base: "14px", md: "20px" }}
          bg={COLORS.gold}
        />
      </>
    ),
  },
];

export default function SceneCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // 手动导航时自增，重置自动轮播的 4s 计时窗口
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, cycle]);

  const step = (dir: 1 | -1) => {
    setActive((a) => (a + dir + SLIDES.length) % SLIDES.length);
    setCycle((c) => c + 1);
  };

  const jumpTo = (index: number) => {
    setActive(index);
    setCycle((c) => c + 1);
  };

  const slide = SLIDES[active];

  return (
    <Flex
      h="100%"
      direction="column"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 舞台 — 全出血幻灯片 */}
      <Box flex="1" position="relative" overflow="hidden">
        <M.Flex
          h="100%"
          w="100%"
          animate={{ x: `-${active * 100}%` }}
          transition={{ duration: DURATION.slow, ease: EASING.launch }}
        >
          {SLIDES.map((s) => (
            <Box
              key={s.id}
              w="100%"
              h="100%"
              flexShrink={0}
              position="relative"
              overflow="hidden"
              bg={s.bg}
            >
              {s.composition}

              {/* 巨大数字 — 每幕的构成主体 */}
              <Text
                position="absolute"
                top="50%"
                right={{ base: "16px", md: "40px" }}
                mt={{ base: "-44px", md: "-66px" }}
                zIndex={1}
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "88px", md: "132px" }}
                letterSpacing="-0.05em"
                lineHeight={1}
                color={s.numberColor}
                sx={{
                  fontVariantNumeric: "tabular-nums",
                  textShadow: `5px 5px 0px ${s.numberShadow}`,
                }}
              >
                {s.number}
              </Text>

              {/* 标题块 — 左下角 */}
              <Box
                position="absolute"
                bottom={{ base: SPACE.md, md: SPACE.xl }}
                left={{ base: SPACE.md, md: SPACE.xl }}
                zIndex={2}
                maxW="72%"
              >
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize={{ base: "9px", md: "11px" }}
                  letterSpacing="0.16em"
                  textTransform="uppercase"
                  color={s.accent}
                  mb={{ base: "6px", md: SPACE.sm }}
                >
                  {s.kicker}
                </Text>
                <Flex align="center" gap={{ base: "8px", md: "12px" }}>
                  <Box
                    w={{ base: "6px", md: "8px" }}
                    h={{ base: "24px", md: "34px" }}
                    bg={s.accent}
                    flexShrink={0}
                  />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize={{ base: "22px", md: "32px" }}
                    letterSpacing="0.04em"
                    lineHeight={1.1}
                    color={s.fg}
                  >
                    {s.title}
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.light}
                  fontSize={{ base: "11px", md: "13px" }}
                  letterSpacing="0.06em"
                  color={s.fg}
                  opacity={0.75}
                  mt={{ base: "6px", md: SPACE.sm }}
                >
                  {s.subtitle}
                </Text>
              </Box>
            </Box>
          ))}
        </M.Flex>

        {/* 幻灯片计数器 — 右上角 */}
        <Text
          position="absolute"
          top={{ base: SPACE.sm, md: SPACE.md }}
          right={{ base: SPACE.md, md: SPACE.lg }}
          zIndex={3}
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize={{ base: "10px", md: "12px" }}
          letterSpacing="0.12em"
          color={slide.fg}
          opacity={0.85}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {slide.number} / 0{SLIDES.length}
        </Text>

        {/* 前后箭头 */}
        <ArrowButton glyph="←" label="上一幕" side="left" onClick={() => step(-1)} />
        <ArrowButton glyph="→" label="下一幕" side="right" onClick={() => step(1)} />
      </Box>

      {/* 控制栏 — 指示器 */}
      <Flex
        h={{ base: "38px", md: "44px" }}
        flexShrink={0}
        bg={COLORS.black}
        align="center"
        justify="space-between"
        px={{ base: SPACE.md, md: SPACE.lg }}
      >
        <Text
          fontFamily={FONT.mono}
          fontSize={{ base: "8px", md: "9px" }}
          letterSpacing="0.14em"
          color={paused ? COLORS.gold : COLORS.metalWhite}
          opacity={paused ? 1 : 0.55}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {paused ? "悬停已暂停 // PAUSED" : `自动轮播 // AUTOPLAY ${AUTOPLAY_MS / 1000}S`}
        </Text>

        <Flex gap={{ base: SPACE.sm, md: SPACE.md }}>
          {SLIDES.map((s, i) => (
            <Box
              key={s.id}
              as="button"
              aria-label={`切换到第 ${i + 1} 幕：${s.title}`}
              onClick={() => jumpTo(i)}
              w={{ base: "10px", md: "12px" }}
              h={{ base: "10px", md: "12px" }}
              p={0}
              bg={i === active ? COLORS.red : "transparent"}
              border={
                i === active
                  ? `${BORDER.standard} ${COLORS.redLight}`
                  : `${BORDER.standard} ${COLORS.metalWhite}`
              }
              borderRadius="0"
              cursor="pointer"
              transition={`background ${DURATION.fast}s ease, border-color ${DURATION.fast}s ease`}
              _hover={
                i === active ? undefined : { borderColor: COLORS.gold }
              }
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
