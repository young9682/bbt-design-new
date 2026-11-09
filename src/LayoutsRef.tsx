import { Box, Text, Flex, VStack, HStack, Grid, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


export default function LayoutsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="空间布局" pageIndex="08" />

      {/* HERO */}
      <Box bg={COLORS.black} px="80px" py="48px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-60px"
          right="0"
          w="50%"
          h="200px"
          bg={COLORS.red}
          opacity={0.08}
          transform="skewX(-12deg)"
          transformOrigin="bottom right"
        />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="-0.02em"
        >
          结构
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.red}
          letterSpacing="-0.02em"
        >
          构成
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
          不对称不是混乱——它是方向性力量。
        </Text>
      </Box>

      {/* LAYOUT 01: Asymmetric Split */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
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
            不对称分割——海报式划分
          </Text>
        </Flex>

        <Box h="320px" position="relative" overflow="hidden" border={`${BORDER.heavy} ${COLORS.black}`}>
          {/* Left: 40% red block */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="40%"
            h="100%"
            bg={COLORS.red}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            px="32px"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="64px"
              lineHeight={0.85}
              color={COLORS.pureWhite}
              letterSpacing="-0.03em"
            >
              40
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="24px"
              color={COLORS.gold}
              letterSpacing="0.04em"
              mt="8px"
            >
              百分比
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="13px"
              color={COLORS.pureWhite}
              opacity={0.7}
              mt="12px"
              letterSpacing="0.03em"
            >
              色块锚定构图。它承载主要信息。
            </Text>
          </Box>

          {/* Right: 60% content area */}
          <Box
            position="absolute"
            top={0}
            left="40%"
            w="60%"
            h="100%"
            bg={COLORS.concrete}
            p="32px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="20px"
              letterSpacing="0.04em"
              mb="16px"
            >
              60% 内容区
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="14px"
              lineHeight={1.7}
              color={COLORS.industrialBlack}
              maxW="400px"
            >
              内容区承载操作界面。它是工作区。
              40/60 分割创造了视觉层次，而非等权重。
              不对称迫使视线移动——从锚点到内容。
            </Text>

            {/* Diagonal decorative element */}
            <Box
              position="absolute"
              bottom="0"
              right="0"
              w="120px"
              h="120px"
              border={`${BORDER.heavy} ${COLORS.gold}`}
              opacity={0.15}
              transform="rotate(45deg) translate(40px, 40px)"
            />
          </Box>

          {/* Diagonal divider line */}
          <Box
            position="absolute"
            top="10%"
            left="40%"
            w="2px"
            h="80%"
            bg={COLORS.gold}
            opacity={0.4}
            transform="rotate(-3deg)"
          />
        </Box>
      </Box>

      {/* Spatial accent: rotated square between sections */}
      <Box position="relative" h="48px" px={{ base: "32px", md: "80px" }}>
        <Box
          position="absolute"
          left={{ base: "50px", md: "160px" }}
          top="4px"
          w="40px"
          h="40px"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.15}
          transform="rotate(45deg)"
        />
        <Box
          position="absolute"
          right={{ base: "80px", md: "240px" }}
          top="16px"
          w="16px"
          h="16px"
          bg={COLORS.gold}
          opacity={0.12}
          borderRadius="50%"
        />
      </Box>

      {/* LAYOUT 02: Diagonal Split — receded to background plane */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" opacity={0.85} mt="-24px" ml="40px">
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
            对角分割——斜切构图
          </Text>
        </Flex>

        <Box h="300px" position="relative" overflow="hidden" border={`${BORDER.heavy} ${COLORS.black}`}>
          {/* Bottom-left triangle: black */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="100%"
            h="100%"
            bg={COLORS.black}
            clipPath="polygon(0 30%, 100% 100%, 0 100%)"
          />

          {/* Diagonal text on the red zone */}
          <Box
            position="absolute"
            top="20%"
            left="8%"
            zIndex={2}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="36px"
              color={COLORS.red}
              letterSpacing="0.04em"
              transform="rotate(-18deg)"
              transformOrigin="left top"
            >
              对角线
            </Text>
          </Box>

          {/* Content on the black zone */}
          <Box
            position="absolute"
            bottom="20px"
            left="32px"
            right="32px"
            zIndex={2}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="18px"
              color={COLORS.pureWhite}
              letterSpacing="0.04em"
            >
              对角线即方向
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="12px"
              color={COLORS.metalWhite}
              opacity={0.6}
              mt="4px"
              letterSpacing="0.03em"
            >
              clip-path 创建分割。内容栖息于几何区域中。角度为 18 度——足以感受动感，不至无法阅读。
            </Text>
          </Box>

          {/* Gold accent dot */}
          <Box
            position="absolute"
            top="35%"
            right="25%"
            w="16px"
            h="16px"
            bg={COLORS.gold}
            zIndex={2}
          />
        </Box>
      </Box>

      {/* LAYOUT 03: Dashboard Grid — foreground element, strong depth */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" mt="-16px" ml="-24px" position="relative" zIndex={3}>
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
            控制网格——任务控制
          </Text>
        </Flex>

        <Box
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow="6px 6px 0px rgba(0,0,0,0.2)"
          overflow="hidden"
        >
          {/* Top bar */}
          <Flex
            bg={COLORS.red}
            px="20px"
            py="12px"
            justify="space-between"
            align="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="13px"
              letterSpacing="0.04em"
              color={COLORS.pureWhite}
            >
              任务控制
            </Text>
            <HStack gap="16px">
              <Text fontFamily={FONT.mono} fontSize="11px" color={COLORS.gold} letterSpacing="0.08em">
                T-00:12:34
              </Text>
            </HStack>
          </Flex>

          {/* Grid layout */}
          <Grid
            templateColumns="200px 1fr 1fr"
            templateRows="auto auto auto"
          >
            {/* Sidebar nav */}
            <Box
             
              bg={COLORS.black}
              borderRight={`${BORDER.heavy} ${COLORS.black}`}
              py="8px"
            >
              {["工作区", "供应方", "操作", "设置", "PRO"].map(
                (item, i) => (
                  <Flex
                    key={item}
                    px="16px"
                    py="12px"
                    bg={i === 0 ? COLORS.red : "transparent"}
                    cursor="pointer"
                    _hover={i !== 0 ? { bg: COLORS.industrialBlack } : undefined}
                    transition="background 0.1s ease"
                    align="center"
                    gap="10px"
                  >
                    <Box
                      w="4px"
                      h="4px"
                      bg={i === 0 ? COLORS.pureWhite : COLORS.gold}
                      flexShrink={0}
                    />
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="11px"
                      letterSpacing="0.04em"
                      color={i === 0 ? COLORS.pureWhite : COLORS.metalWhite}
                    >
                      {item}
                    </Text>
                  </Flex>
                )
              )}
            </Box>

            {/* Stat row */}
            <Box bg={COLORS.pureWhite} borderBottom={`${BORDER.standard} ${COLORS.black}`} p="16px">
              <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="9px" letterSpacing="0" color={COLORS.industrialBlack} opacity={0.5}>
                活跃
              </Text>
              <Text fontFamily={FONT.mono} fontSize="28px" fontWeight={WEIGHT.bold}>12</Text>
            </Box>
            <Box bg={COLORS.concrete} borderBottom={`${BORDER.standard} ${COLORS.black}`} p="16px">
              <Text fontFamily={FONT.sans} fontWeight={WEIGHT.bold} fontSize="9px" letterSpacing="0" color={COLORS.industrialBlack} opacity={0.5}>
                CPU 总计
              </Text>
              <Text fontFamily={FONT.mono} fontSize="28px" fontWeight={WEIGHT.bold} color={COLORS.red}>
                347<span style={{ fontSize: "14px", color: COLORS.industrialBlack }}> 核心</span>
              </Text>
            </Box>

            {/* Main content area */}
            <Box
             
              bg={COLORS.pureWhite}
              borderBottom={`${BORDER.standard} ${COLORS.black}`}
              p="16px"
              minH="120px"
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="13px"
                letterSpacing="0.04em"
                mb="12px"
              >
                工作区列表
              </Text>
              {["frontend-dev", "api-server", "data-pipeline"].map((ws) => (
                <Flex
                  key={ws}
                  py="8px"
                  borderBottom={`${BORDER.hairline} ${COLORS.black}`}
                  justify="space-between"
                  align="center"
                >
                  <Text fontFamily={FONT.mono} fontSize="12px" letterSpacing="0.04em">
                    {ws}
                  </Text>
                  <Box bg={COLORS.statusGreen} px="8px" py="2px">
                    <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="9px" color={COLORS.pureWhite} letterSpacing="0.04em">
                      运行中
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>

            {/* Bottom bar */}
            <Box
             
              bg={COLORS.concrete}
              p="12px"
            >
              <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.5} letterSpacing="0.05em">
                网格: 200px 侧栏 + 2 等宽列 // 无圆角 // 仅硬阴影
              </Text>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* Geometric accent: geometric circle between sections */}
      <Box position="relative" h="32px" px={{ base: "32px", md: "80px" }}>
        <Box
          position="absolute"
          right={{ base: "60px", md: "200px" }}
          top="0"
          w="32px"
          h="32px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
          borderRadius="50%"
        />
      </Box>

      {/* LAYOUT 04: Full-bleed color block — mid-plane element */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" mt="-16px" ml="24px">
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
            全出血色块——巨石
          </Text>
        </Flex>

        <Box
          bg={COLORS.red}
          h="200px"
          position="relative"
          overflow="hidden"
          border={`${BORDER.heavy} ${COLORS.black}`}
        >
          {/* Overlapping geometry */}
          <Box
            position="absolute"
            top={0}
            left="60%"
            w="3px"
            h="100%"
            bg={COLORS.gold}
            opacity={0.5}
          />
          <Box
            position="absolute"
            top="50%"
            left="62%"
            w="120px"
            h="120px"
            border={`${BORDER.heavy} ${COLORS.pureWhite}`}
            opacity={0.15}
            transform="translateY(-50%) rotate(45deg)"
          />
          <Box
            position="absolute"
            top="50%"
            right="80px"
            transform="translateY(-50%)"
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="48px"
              color={COLORS.pureWhite}
              letterSpacing="-0.03em"
              lineHeight={0.9}
            >
              巨石
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.light}
              fontSize="14px"
              color={COLORS.pureWhite}
              opacity={0.6}
              letterSpacing="0.04em"
              mt="4px"
            >
              一个完整的色块统治视口
            </Text>
          </Box>
          <Box
            position="absolute"
            bottom="20px"
            left="32px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.gold}
              letterSpacing="0.08em"
            >
              用途：章节分隔、行动号召、引导页面
            </Text>
          </Box>
        </Box>
      </Box>

      {/* LAYOUT 05: Responsive considerations — receded background plane */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" opacity={0.75} mt="-20px" ml="60px">
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
            断点令牌——自适应网格
          </Text>
        </Flex>

        <VStack align="stretch" gap="0" maxW="600px">
          {[
            { name: "移动端", bp: "< 640px", cols: "1 列", note: "所有区域垂直堆叠。全出血色块。" },
            { name: "平板", bp: "640–1024px", cols: "2 列", note: "侧栏折叠为汉堡菜单。不对称分割 40/60。" },
            { name: "桌面端", bp: "1024–1440px", cols: "3 列", note: "完整任务控制网格。侧栏可见。" },
            { name: "宽屏", bp: "> 1440px", cols: "4+ 列", note: "最大宽度容器 1440px。侧边距增长。" },
          ].map((b) => (
            <Flex
              key={b.name}
              py="14px"
              px="16px"
              borderBottom={`${BORDER.standard} ${COLORS.black}`}
              align="flex-start"
              gap="16px"
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.04em"
                color={COLORS.red}
                w="90px"
                flexShrink={0}
              >
                {b.name}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="12px"
                color={COLORS.gold}
                w="110px"
                flexShrink={0}
                letterSpacing="0.04em"
              >
                {b.bp}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="11px"
                letterSpacing="0.08em"
                color={COLORS.industrialBlack}
                w="100px"
                flexShrink={0}
              >
                {b.cols}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.regular}
                fontSize="12px"
                color={COLORS.industrialBlack}
                opacity={0.6}
                flex={1}
              >
                {b.note}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* LAYOUT RULES — staggered composition */}
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
            06
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.04em"
          >
            结构规则——承重墙
          </Text>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="24px" maxW="800px">
          {[
            { title: "无圆角", desc: "每个容器都是矩形。曲线是装饰，不是结构。" },
            { title: "默认不对称", desc: "等宽列意味着犹豫不决。40/60 或 30/70 分割创造层次。" },
            { title: "对角线是装饰", desc: "通过 CSS transform 或 clip-path 实现对角线。它们引导注意力，不承载内容。" },
            { title: "色块即结构", desc: "40% 的红色色块是一堵墙，不是涂料。它划分空间并承载意义。" },
            { title: "网格：4px 基数", desc: "所有间距是 4px 的倍数。8, 16, 24, 32, 48, 64, 96。" },
            { title: "硬阴影", desc: "box-shadow: 4px 4px 0px rgba(0,0,0,0.2)。无模糊，无柔化。仅工业偏移。" },
          ].map((rule, i) => (
            <Box
              key={rule.title}
              bg={COLORS.pureWhite}
              border={`${BORDER.standard} ${COLORS.black}`}
              p="16px"
              opacity={i % 3 === 0 ? 1 : i % 3 === 1 ? 0.8 : 0.7}
              boxShadow={i % 3 === 0 ? "4px 4px 0px rgba(0,0,0,0.15)" : "none"}
              transform={i % 3 === 0 ? "translateX(-8px)" : i % 3 === 2 ? "translateX(8px)" : "none"}
              position="relative"
              zIndex={i % 3 === 0 ? 2 : 1}
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.04em"
                color={COLORS.red}
                mb="6px"
              >
                {rule.title}
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.regular}
                fontSize="12px"
                color={COLORS.industrialBlack}
                lineHeight={1.5}
              >
                {rule.desc}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Geometric accent: final rotated square before navigation */}
      <Box position="relative" h="24px" px={{ base: "32px", md: "80px" }}>
        <Box
          position="absolute"
          left={{ base: "50%", md: "50%" }}
          top="0"
          w="24px"
          h="24px"
          bg={COLORS.red}
          opacity={0.1}
          transform="rotate(45deg) translateX(-50%)"
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
