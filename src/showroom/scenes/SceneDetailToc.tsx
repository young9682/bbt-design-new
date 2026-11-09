import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING } from "../../Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};

interface Section {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  body: string[];
  metrics: { label: string; value: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "overview",
    index: "01",
    title: "任务概述",
    subtitle: "MISSION OVERVIEW",
    body: [
      "设计参考系统是一次面向工业级界面的视觉重构任务。目标是为 BBT 产品线建立一套高辨识度、可工程化落地的设计语言，使其在密集数据、复杂流程与长时间操作中保持稳定可读。",
      "该任务不追求装饰性趋势，而是将几何构成的几何意志、工业仪表风的仪器美学，以及高效动效的动效哲学熔铸为统一的组件与布局规范。",
    ],
    metrics: [
      { label: "版本", value: "v1.0.0" },
      { label: "状态", value: "RELEASED" },
    ],
  },
  {
    id: "doctrine",
    index: "02",
    title: "设计信条",
    subtitle: "DESIGN DOCTRINE",
    body: [
      "所有元素拒绝圆角，以绝对直线与锐角建立空间秩序。大面积色块承载方向与权重，黑色粗边框将界面元素锚定为工业面板。",
      "大写标签、等宽数据、硬阴影共同构成仪器的可读性层级。我们不使用渐变、毛玻璃或柔化阴影——界面保持原始、精确、有力的视觉层级。",
    ],
    metrics: [
      { label: "圆角", value: "0 px" },
      { label: "网格", value: "4 px" },
    ],
  },
  {
    id: "structure",
    index: "03",
    title: "系统构成",
    subtitle: "SYSTEM STRUCTURE",
    body: [
      "色彩体系以信号红为主轴，黄铜金作为成就点缀，工业黑白构建中性基底，电信号青色与速度橙色处理数据流与告警。所有色彩均映射到语义角色，禁止随意替换。",
      "排版分为标题与数据两条轨道。标题使用黑体字重 900、负字距；标签统一大写、宽字距；数字与状态信息强制等宽与 tabular-nums，确保表格与仪表在读数时不会抖动。",
    ],
    metrics: [
      { label: "主色", value: COLORS.red },
      { label: "辅色", value: COLORS.gold },
    ],
  },
  {
    id: "implementation",
    index: "04",
    title: "实施规范",
    subtitle: "IMPLEMENTATION",
    body: [
      "组件实现优先使用 Theme.tsx 中导出的 COLORS、FONT、WEIGHT、BORDER、SHADOW 等令牌，避免硬编码。按钮提供 Primary / Secondary / Ghost 三种变体，卡片统一使用 3px 黑边框与 4px 硬阴影。",
      "动效遵循 launch、decelerate、accelerate、sharp 四条曲线。入场使用 launch 缓动并配合 y 轴位移；hover 通过 translateY(-2px) 与阴影加深制造升起感；避免使用 opacity 做状态切换。",
    ],
    metrics: [
      { label: "组件", value: "40+" },
      { label: "缓动", value: "4" },
    ],
  },
  {
    id: "verification",
    index: "05",
    title: "验证发布",
    subtitle: "VERIFICATION",
    body: [
      "每次变更须通过 TypeScript 类型检查与构建验证，确保令牌引用、组件 props 与响应式断点没有退化。建议运行 npm run types:check 与 npm run build 作为发布前的最后检查。",
      "发布前需完成视觉回归：对照 ColorsRef、TypographyRef、ButtonsRef 等参考页核对色彩、字号、按钮尺寸是否一致。只有通过全部检查的设计变更才允许进入生产环境。",
    ],
    metrics: [
      { label: "检查项", value: "12" },
      { label: "阈值", value: "PASS" },
    ],
  },
];

function InstrumentStrip() {
  return (
    <Flex h="4px" w="100%" flexShrink={0}>
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
      <Box flex={2} bg={COLORS.black} />
    </Flex>
  );
}

function SectionCard({
  section,
  isActive,
}: {
  section: Section;
  isActive: boolean;
}) {
  return (
    <M.Box
      id={section.id}
      mb={SPACE.lg}
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={isActive ? SHADOW.large : SHADOW.medium}
      p={{ base: SPACE.md, md: SPACE.lg }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION.normal,
        ease: EASING.launch,
      }}
      _hover={{ boxShadow: SHADOW.large, transform: "translateY(-2px)" }}
    >
      <Flex align="flex-start" gap={SPACE.md} mb={SPACE.md}>
        <Box
          bg={isActive ? COLORS.red : COLORS.black}
          color={COLORS.pureWhite}
          px="8px"
          py="4px"
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="12px"
          lineHeight={1}
        >
          {section.index}
        </Box>
        <Box flex={1}>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "18px", md: "22px" }}
            color={COLORS.black}
            letterSpacing="-0.02em"
            lineHeight={0.95}
            mb="4px"
          >
            {section.title}
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="10px"
            color={COLORS.gold}
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            {section.subtitle}
          </Text>
        </Box>
      </Flex>

      <Box h="2px" bg={COLORS.red} mb={SPACE.md} />

      <VStack align="stretch" gap={SPACE.sm} mb={SPACE.md}>
        {section.body.map((paragraph, i) => (
          <Text
            key={i}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.regular}
            fontSize="13px"
            color={COLORS.industrialBlack}
            lineHeight={1.6}
          >
            {paragraph}
          </Text>
        ))}
      </VStack>

      <HStack gap={SPACE.sm} flexWrap="wrap">
        {section.metrics.map((metric) => (
          <Box
            key={metric.label}
            bg={COLORS.concrete}
            border={`${BORDER.standard} ${COLORS.black}`}
            px={SPACE.sm}
            py="6px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.black}
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb="2px"
            >
              {metric.label}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="14px"
              color={COLORS.black}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {metric.value}
            </Text>
          </Box>
        ))}
      </HStack>
    </M.Box>
  );
}

export default function SceneDetailToc() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = SECTIONS.findIndex((s) => s.id === visible[0].target.id);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        root,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    const container = contentRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - 16;
    container.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <Flex h="100%" overflow="hidden">
      {/* Floating TOC sidebar */}
      <Box
        w={{ base: "56px", md: "200px" }}
        h="100%"
        bg={COLORS.black}
        flexShrink={0}
        display="flex"
        flexDirection="column"
        borderRight={`${BORDER.standard} ${COLORS.red}`}
        position="relative"
      >
        <InstrumentStrip />

        {/* Header */}
        <Box p={{ base: "10px", md: SPACE.md }} borderBottom={`1px solid ${COLORS.pureWhite}14`}>
          <Flex align="center" gap="8px" mb={{ base: "0", md: "8px" }}>
            <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />
            <Text
              display={{ base: "none", md: "block" }}
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="12px"
              color={COLORS.pureWhite}
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              目录
            </Text>
          </Flex>
          <Text
            display={{ base: "none", md: "block" }}
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.gold}
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            Table of Contents
          </Text>
        </Box>

        {/* TOC items */}
        <VStack align="stretch" gap="0" flex={1} overflowY="auto" p={{ base: "6px", md: SPACE.sm }}>
          {SECTIONS.map((section, i) => {
            const active = activeIndex === i;
            return (
              <Box
                key={section.id}
                as="button"
                onClick={() => scrollToSection(section.id)}
                w="100%"
                textAlign="left"
                bg={active ? `${COLORS.red}1f` : "transparent"}
                borderLeft={`3px solid ${active ? COLORS.red : "transparent"}`}
                px={{ base: "6px", md: SPACE.sm }}
                py={{ base: "8px", md: "10px" }}
                cursor="pointer"
                transition={`all ${DURATION.fast}s ease`}
                _hover={{
                  bg: active ? `${COLORS.red}2e`: `${COLORS.pureWhite}0f`,
                }}
              >
                <Flex align="center" gap={{ base: "0", md: "10px" }}>
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.black}
                    fontSize="12px"
                    color={active ? COLORS.red : COLORS.metalWhite}
                    lineHeight={1}
                    opacity={active ? 1 : 0.7}
                  >
                    {section.index}
                  </Text>
                  <Box display={{ base: "none", md: "block" }} flex={1}>
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={active ? WEIGHT.black : WEIGHT.bold}
                      fontSize="11px"
                      color={active ? COLORS.pureWhite : COLORS.metalWhite}
                      letterSpacing="0.06em"
                      lineHeight={1.2}
                      mb="2px"
                    >
                      {section.title}
                    </Text>
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.bold}
                      fontSize="8px"
                      color={COLORS.gold}
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      opacity={active ? 1 : 0.6}
                    >
                      {section.subtitle}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </VStack>

        {/* Geometric footer decoration */}
        <Box p={{ base: "8px", md: SPACE.md }} borderTop={`1px solid ${COLORS.pureWhite}14`}>
          <Flex justify="space-between" align="center">
            <Box w="6px" h="6px" bg={COLORS.gold} />
            <Box w="10px" h="3px" bg={COLORS.red} />
            <Box w="4px" h="4px" bg={COLORS.electricCyan} />
          </Flex>
          <Text
            display={{ base: "none", md: "block" }}
            fontFamily={FONT.mono}
            fontSize="8px"
            color={COLORS.metalWhite}
            opacity={0.4}
            letterSpacing="0.1em"
            mt="8px"
          >
            DESIGN REF
          </Text>
        </Box>
      </Box>

      {/* Main content */}
      <Box
        ref={contentRef}
        flex={1}
        h="100%"
        overflowY="auto"
        bg={COLORS.concrete}
        p={{ base: SPACE.sm, md: SPACE.lg }}
        position="relative"
      >
        {/* Decorative top bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bg={COLORS.red}
          zIndex={1}
        />

        <Box mb={SPACE.md}>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "20px", md: "28px" }}
            color={COLORS.black}
            letterSpacing="-0.02em"
            lineHeight={0.95}
            mb="6px"
          >
            设计参考系统
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="11px"
            color={COLORS.gold}
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            Long-Content Page / Floating Table of Contents
          </Text>
        </Box>

        {SECTIONS.map((section, i) => (
          <Box
            key={section.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          >
            <SectionCard section={section} isActive={activeIndex === i} />
          </Box>
        ))}

        <Box h="40px" />
      </Box>
    </Flex>
  );
}
