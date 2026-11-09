import { Box, Flex, Text, Grid, HStack, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
  Flex: motion(Flex),
};

const EASE_LAUNCH: [number, number, number, number] = [0.0, 0.0, 0.2, 1.0];

export default function SceneFullHeight() {
  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      border={`${BORDER.standard} ${COLORS.black}`}
      bg={COLORS.concrete}
      position="relative"
      overflow="hidden"
    >
      {/* ============================================================
          HEADER — 仪器面板风格，黑色底色 + 红色底边
          ============================================================ */}
      <Box bg={COLORS.black} borderBottom={`2px solid ${COLORS.red}`} flexShrink={0}>
        {/* 顶部红色扫描线 */}
        <Box
          h="2px"
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
          opacity={0.4}
        />

        <Flex
          px={{ base: SPACE.md, md: "20px" }}
          h="48px"
          align="center"
          justify="space-between"
          gap="12px"
        >
          <Flex align="center" gap="12px" h="100%">
            <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="13px"
              color={COLORS.pureWhite}
              letterSpacing="0.08em"
              textTransform="uppercase"
              lineHeight={1}
            >
              全高视口布局
            </Text>
            <Box h="16px" w="1px" bg={`${COLORS.pureWhite}14`} />
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.metalWhite}
              opacity={0.35}
              letterSpacing="0.12em"
              textTransform="uppercase"
              lineHeight={1}
            >
              MOD-01-05
            </Text>
          </Flex>

          <HStack gap="10px" spacing={0} align="center">
            <Box w="6px" h="6px" borderRadius="50%" bg={COLORS.signalGreen} flexShrink={0} />
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.signalGreen}
              letterSpacing="0.1em"
              textTransform="uppercase"
              lineHeight={1}
            >
              SYSTEM ONLINE
            </Text>
          </HStack>
        </Flex>

        {/* 底部仪器线 */}
        <Flex h="2px">
          <Box flex={3} bg={COLORS.red} />
          <Box flex={7} bg={`${COLORS.pureWhite}0a`} />
        </Flex>
      </Box>

      {/* 速度色条 */}
      <Flex h="4px" flexShrink={0}>
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>

      {/* ============================================================
          MAIN — 红色楔形 + 卡片层，填满剩余高度并支持滚动
          ============================================================ */}
      <Box flex={1} overflow="auto" p={{ base: SPACE.md, md: SPACE.lg }} position="relative">
        {/* 几何装饰：黑色建筑平面 */}
        <Box
          position="absolute"
          bottom={0}
          right={0}
          w="55%"
          h="45%"
          bg={COLORS.black}
          opacity={0.06}
          clipPath="polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)"
          pointerEvents="none"
        />
        {/* 红色楔形从左下切入 */}
        <Box
          position="absolute"
          bottom={0}
          left="-10%"
          w="60%"
          h="35%"
          bg={COLORS.red}
          opacity={0.08}
          clipPath="polygon(0 30%, 100% 0%, 100% 100%, 0% 100%)"
          pointerEvents="none"
        />
        {/* 金色旋转方块 */}
        <Box
          position="absolute"
          top="8%"
          right="8%"
          w="64px"
          h="64px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
          transform="rotate(45deg)"
          pointerEvents="none"
        />

        <Grid
          templateColumns={{ base: "1fr", md: "1.3fr 0.7fr" }}
          gap={SPACE.md}
          position="relative"
          zIndex={1}
        >
          {/* 前景：白色大卡片 */}
          <M.Box
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.normal, ease: EASE_LAUNCH }}
          >
            <Box
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.large}
              p={{ base: "20px", md: "28px" }}
              position="relative"
              overflow="hidden"
              _hover={{ transform: "translateY(-4px)", boxShadow: SHADOW.large }}
              transition={`all ${DURATION.fast}s ease`}
              h="100%"
            >
              <Box position="absolute" top={0} left={0} w="48px" h="48px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.mono}
                fontSize="11px"
                color={COLORS.gold}
                letterSpacing="0.1em"
                textTransform="uppercase"
                ml="56px"
                mb="8px"
              >
                任务概览
              </Text>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "22px", md: "28px" }}
                lineHeight={1.1}
                ml="56px"
                color={COLORS.black}
              >
                运算次数 // OPS/S
              </Text>

              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "56px", md: "80px" }}
                lineHeight={0.85}
                color={COLORS.electricCyan}
                letterSpacing="-0.03em"
                mt="16px"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                09,847
              </Text>

              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.signalGreen}
                letterSpacing="0.08em"
                mt="4px"
                textTransform="uppercase"
              >
                +12.4% 较上周期
              </Text>

              {/* 迷你 CSS 柱状图 */}
              <Flex mt="24px" gap="6px" align="flex-end" h="52px">
                {[40, 62, 48, 80, 55, 90, 72].map((h, i) => (
                  <Box
                    key={i}
                    flex={1}
                    h={`${h}%`}
                    bg={i === 5 ? COLORS.red : COLORS.black}
                    opacity={i === 5 ? 1 : 0.7 + i * 0.04}
                    _hover={{ bg: COLORS.red, opacity: 1 }}
                    transition={`all ${DURATION.fast}s ease`}
                  />
                ))}
              </Flex>
              <Flex justify="space-between" mt="6px">
                {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"].map((t) => (
                  <Text
                    key={t}
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    color={COLORS.industrialBlack}
                    opacity={0.5}
                    flex={1}
                    textAlign="center"
                  >
                    {t}
                  </Text>
                ))}
              </Flex>
            </Box>
          </M.Box>

          {/* 右侧：两个中景卡片 */}
          <VStack gap={SPACE.md} align="stretch">
            <M.Box
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.1, ease: EASE_LAUNCH }}
            >
              <Box
                bg={COLORS.black}
                border={`${BORDER.heavy} ${COLORS.black}`}
                boxShadow={SHADOW.medium}
                p="18px"
                position="relative"
                overflow="hidden"
                _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
                transition={`all ${DURATION.fast}s ease`}
              >
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="24px"
                  h="100%"
                  bg={COLORS.red}
                  opacity={0.6}
                />
                <Text
                  fontFamily={FONT.mono}
                  fontSize="10px"
                  color={COLORS.electricCyan}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="8px"
                >
                  节点状态
                </Text>
                <VStack align="stretch" gap="10px" pr="24px">
                  {[
                    { name: "server-01", status: "RUNNING", color: COLORS.signalGreen },
                    { name: "server-02", status: "RUNNING", color: COLORS.signalGreen },
                    { name: "worker-03", status: "PENDING", color: COLORS.statusAmber },
                  ].map((node) => (
                    <Flex key={node.name} align="center" justify="space-between">
                      <Text fontFamily={FONT.mono} fontSize="11px" color={COLORS.metalWhite}>
                        {node.name}
                      </Text>
                      <HStack gap="6px" spacing={0} align="center">
                        <Box w="5px" h="5px" borderRadius="50%" bg={node.color} />
                        <Text
                          fontFamily={FONT.mono}
                          fontSize="9px"
                          color={node.color}
                          letterSpacing="0.08em"
                        >
                          {node.status}
                        </Text>
                      </HStack>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </M.Box>

            <M.Box
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.2, ease: EASE_LAUNCH }}
            >
              <Box
                bg={COLORS.gold}
                border={`${BORDER.heavy} ${COLORS.goldDark}`}
                boxShadow={SHADOW.gold}
                p="18px"
                position="relative"
                overflow="hidden"
                _hover={{ transform: "translateY(-2px)", boxShadow: `6px 6px 0px ${COLORS.gold}` }}
                transition={`all ${DURATION.fast}s ease`}
              >
                <Box
                  position="absolute"
                  bottom="-12px"
                  right="-12px"
                  w="48px"
                  h="48px"
                  bg={COLORS.black}
                  opacity={0.15}
                  transform="rotate(45deg)"
                />
                <Text
                  fontFamily={FONT.mono}
                  fontSize="10px"
                  color={COLORS.black}
                  opacity={0.6}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="6px"
                >
                  资源配额
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="28px"
                  color={COLORS.black}
                  lineHeight={1}
                >
                  87.3%
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={COLORS.black}
                  opacity={0.6}
                  letterSpacing="0.06em"
                  mt="6px"
                >
                  GPU 池 // 24/32 核心活跃
                </Text>
                <Box w="100%" h="4px" bg={`${COLORS.black}26`} mt="12px">
                  <Box w="87.3%" h="100%" bg={COLORS.black} />
                </Box>
              </Box>
            </M.Box>
          </VStack>
        </Grid>

        {/* 底部：四个远景指标卡片 */}
        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap="12px" mt={SPACE.md}>
          {[
            { label: "延迟", value: "8 MS", color: COLORS.electricCyan },
            { label: "吞吐", value: "94.2 GB/M", color: COLORS.gold },
            { label: "健康", value: "99.97%", color: COLORS.signalGreen },
            { label: "队列", value: "042", color: COLORS.red },
          ].map((metric, i) => (
            <M.Box
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.25 + i * 0.06, ease: EASE_LAUNCH }}
            >
              <Box
                bg={COLORS.pureWhite}
                border={`${BORDER.standard} ${COLORS.black}`}
                boxShadow={SHADOW.small}
                p="14px"
                _hover={{ transform: "translateY(-2px)", boxShadow: `5px 5px 0px ${COLORS.black}2e` }}
                transition={`all ${DURATION.fast}s ease`}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={COLORS.industrialBlack}
                  opacity={0.5}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  mb="6px"
                >
                  {metric.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize="18px"
                  color={metric.color}
                  lineHeight={1}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {metric.value}
                </Text>
              </Box>
            </M.Box>
          ))}
        </Grid>
      </Box>

      {/* ============================================================
          FOOTER — 黑色页脚 + 仪器线 + 元数据
          ============================================================ */}
      <Box bg={COLORS.black} flexShrink={0}>
        <Flex h="2px">
          <Box flex={2} bg={COLORS.red} />
          <Box flex={8} bg={`${COLORS.pureWhite}0a`} />
        </Flex>
        <Flex
          px={SPACE.md}
          py="10px"
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap="8px"
        >
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            opacity={0.5}
            letterSpacing="0.08em"
          >
            全高布局 // MOD-01-05 // 仅参考 // 非生产环境
          </Text>
          <HStack gap="16px" spacing={0}>
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.red} letterSpacing="0.08em">
              高效动效
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.gold} letterSpacing="0.08em">
              几何构成
            </Text>
            <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.electricCyan} letterSpacing="0.08em">
              工业复古
            </Text>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
