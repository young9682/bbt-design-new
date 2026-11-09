import { Box, Text, Flex, VStack, HStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


export default function ErrorsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="错误状态" pageIndex="09" />

      {/* HERO — full red block */}
      <Box
        bg={COLORS.red}
        px="80px"
        py="64px"
        position="relative"
        overflow="hidden"
      >
        {/* Diagonal stripe */}
        <Box
          position="absolute"
          top={0}
          right="20%"
          w="4px"
          h="100%"
          bg={COLORS.pureWhite}
          opacity={0.1}
          transform="rotate(-10deg)"
          transformOrigin="top"
        />
        <Box
          position="absolute"
          top="-40px"
          right="-40px"
          w="200px"
          h="200px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.pureWhite}`}
          opacity={0.08}
          pointerEvents="none"
        />

        <Flex align="baseline" gap="16px">
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize="96px"
            lineHeight={0.8}
            color={COLORS.pureWhite}
            letterSpacing="-0.04em"
          >
            500
          </Text>
          <Box pb="16px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="48px"
              lineHeight={0.9}
              color={COLORS.pureWhite}
              letterSpacing="-0.02em"
            >
              警报
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="48px"
              lineHeight={0.9}
              color={COLORS.gold}
              letterSpacing="-0.02em"
            >
              机制
            </Text>
          </Box>
        </Flex>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.pureWhite}
          opacity={0.7}
          mt="20px"
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          错误不是失败——它们是需要回应的信号。
        </Text>
      </Box>

      {/* Geometric composition — circle + triangle + diagonal between hero and error levels */}
      <Box position="relative" h="80px" overflow="hidden" mx={{ base: "32px", md: "80px" }}>
        <Box
          position="absolute"
          left="10%"
          top="50%"
          transform="translateY(-50%)"
          w="60px"
          h="60px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.12}
        />
        <Box
          position="absolute"
          left="16%"
          top="10%"
          w="0"
          h="0"
          borderLeft="14px solid transparent"
          borderRight="14px solid transparent"
          borderBottom={`24px solid ${COLORS.gold}`}
          opacity={0.1}
          transform="rotate(-15deg)"
        />
        <Box
          position="absolute"
          left="8%"
          top="0"
          w="2px"
          h="100%"
          bg={COLORS.electricCyan}
          opacity={0.08}
          transform="rotate(12deg)"
          transformOrigin="top"
        />
      </Box>

      {/* ERROR LEVELS */}
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
            错误严重等级——警报层级
          </Text>
        </Flex>

        <VStack align="stretch" gap="0" maxW="700px">
          {/* Geometric accent — rotated square at junction */}
          <Box
            w="32px"
            h="32px"
            border={`${BORDER.heavy} ${COLORS.red}`}
            transform="rotate(45deg)"
            opacity={0.15}
            mb="-12px"
            ml="60px"
            position="relative"
            zIndex={0}
          />
          {/* Critical */}
          <Box
            bg={COLORS.red}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            p="24px"
            boxShadow="6px 6px 0px rgba(0,0,0,0.25)"
            position="relative"
            zIndex={2}
          >
            <Flex align="flex-start" gap="16px">
              <Box
                bg={COLORS.pureWhite}
                w="36px"
                h="36px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="20px" color={COLORS.red}>
                  !
                </Text>
              </Box>
              <Box flex={1}>
                <Flex justify="space-between" align="baseline" mb="8px">
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="18px"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                    color={COLORS.pureWhite}
                  >
                    危急
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.pureWhite}
                    opacity={0.6}
                    letterSpacing="0.05em"
                  >
                    SEV-0
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.regular}
                  fontSize="13px"
                  color={COLORS.pureWhite}
                  opacity={0.85}
                  lineHeight={1.6}
                >
                  供应方连接丢失。Docker 守护进程不可达。所有运行中的工作区受影响。需要操作员立即干预。上次心跳：8.4秒前。
                </Text>
                <Flex gap="12px" mt="16px">
                  <Box
                    bg={COLORS.pureWhite}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.red}
                      textTransform="uppercase"
                    >
                      重试连接
                    </Text>
                  </Box>
                  <Box
                    border={`${BORDER.heavy} ${COLORS.pureWhite}`}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.pureWhite}
                      textTransform="uppercase"
                    >
                      查看诊断
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Geometric separator — dotted line + cross between critical and warning */}
          <Box position="relative" h="20px" ml="24px">
            <Box
              position="absolute"
              top="50%"
              left="0"
              right="40%"
              h="0"
              borderTop={`${BORDER.hairline} ${COLORS.gold}`}
              opacity={0.2}
              borderStyle="dashed"
            />
            <Box
              position="absolute"
              top="50%"
              right="25%"
              transform="translateY(-50%)"
              opacity={0.1}
            >
              <Box w="12px" h="2px" bg={COLORS.red} position="absolute" top="5px" left="0" />
              <Box w="2px" h="12px" bg={COLORS.red} position="absolute" top="0" left="5px" />
            </Box>
          </Box>

          {/* Warning — mid-plane, offset right */}
          <Box
            bg={COLORS.gold}
            border={`${BORDER.heavy} ${COLORS.goldDark}`}
            p="24px"
            ml="24px"
            opacity={0.88}
            position="relative"
            zIndex={1}
          >
            <Flex align="flex-start" gap="16px">
              <Box
                bg={COLORS.black}
                w="36px"
                h="36px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="20px" color={COLORS.gold}>
                  &#9888;
                </Text>
              </Box>
              <Box flex={1}>
                <Flex justify="space-between" align="baseline" mb="8px">
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="18px"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                    color={COLORS.black}
                  >
                    警告
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.black}
                    opacity={0.5}
                    letterSpacing="0.05em"
                  >
                    SEV-1
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.regular}
                  fontSize="13px"
                  color={COLORS.black}
                  opacity={0.8}
                  lineHeight={1.6}
                >
                  工作区 "ml-training" 接近内存限制 (3.8GB / 4.0GB)。考虑扩容或终止未使用的进程。
                  预计15分钟内性能将下降。
                </Text>
                <Flex gap="12px" mt="16px">
                  <Box
                    bg={COLORS.black}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.gold}
                      textTransform="uppercase"
                    >
                      扩容
                    </Text>
                  </Box>
                  <Box
                    border={`${BORDER.heavy} ${COLORS.black}`}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.black}
                      textTransform="uppercase"
                    >
                      忽略
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Geometric separator — chevron between warning and info */}
          <Box position="relative" h="12px" ml="24px" mt="-4px">
            <Box
              position="absolute"
              left="12px"
              top="2px"
              w="10px"
              h="10px"
              borderTop={`${BORDER.heavy} ${COLORS.electricCyan}`}
              borderLeft={`${BORDER.heavy} ${COLORS.electricCyan}`}
              transform="rotate(-45deg)"
              opacity={0.15}
            />
          </Box>

          {/* Info — background plane, overlapping upward */}
          <Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            p="24px"
            mt="-12px"
            opacity={0.8}
            position="relative"
            zIndex={0}
          >
            <Flex align="flex-start" gap="16px">
              <Box
                bg={COLORS.black}
                w="36px"
                h="36px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontFamily={FONT.mono} fontWeight={WEIGHT.bold} fontSize="16px" color={COLORS.pureWhite}>
                  i
                </Text>
              </Box>
              <Box flex={1}>
                <Flex justify="space-between" align="baseline" mb="8px">
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="18px"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                  >
                    信息
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.industrialBlack}
                    opacity={0.5}
                    letterSpacing="0.05em"
                  >
                    SEV-2
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.regular}
                  fontSize="13px"
                  color={COLORS.industrialBlack}
                  lineHeight={1.6}
                >
                  DevPod 新版本可用 (v0.4.2)。当前版本：v0.4.0。更新包含性能改进和供应方连接修复。
                </Text>
                <Flex gap="12px" mt="16px">
                  <Box
                    bg={COLORS.black}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.pureWhite}
                      textTransform="uppercase"
                    >
                      立即更新
                    </Text>
                  </Box>
                  <Box
                    border={`${BORDER.standard} ${COLORS.black}`}
                    px="16px"
                    py="8px"
                    cursor="pointer"
                  >
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.black}
                      textTransform="uppercase"
                    >
                      稍后
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Box>

      {/* Calibration tick pattern — section boundary */}
      <Box
        position="relative"
        h="16px"
        mx={{ base: "32px", md: "80px" }}
        mb="8px"
      >
        {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156].map((offset, i) => (
          <Box
            key={`tick-top-${i}`}
            position="absolute"
            left={`${offset}px`}
            top="0"
            w={`${BORDER.hairline}`}
            h={i % 4 === 0 ? "12px" : "6px"}
            bg={COLORS.black}
            opacity={0.08}
          />
        ))}
      </Box>

      {/* FULL ERROR PAGE */}
      {/* Geometric accent between sections — concentric circles */}
      <Box
        ml={{ base: "32px", md: "120px" }}
        mb="-20px"
        position="relative"
        zIndex={0}
        w="80px"
        h="80px"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w="80px"
          h="80px"
          borderRadius="50%"
          border={`${BORDER.hairline} ${COLORS.red}`}
          opacity={0.08}
        />
        <Box
          position="absolute"
          top="12px"
          left="12px"
          w="56px"
          h="56px"
          borderRadius="50%"
          border={`${BORDER.hairline} ${COLORS.red}`}
          opacity={0.12}
        />
        <Box
          position="absolute"
          top="24px"
          left="24px"
          w="32px"
          h="32px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.red}`}
          opacity={0.15}
        />
        <Box
          position="absolute"
          top="34px"
          left="34px"
          w="12px"
          h="12px"
          borderRadius="50%"
          bg={COLORS.red}
          opacity={0.1}
        />
      </Box>
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative" zIndex={1}>
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
            完整错误页面——紧急广播
          </Text>
        </Flex>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.red}`}
          position="relative"
          overflow="hidden"
        >
          {/* Red accent stripe */}
          <Box h="4px" bg={COLORS.red} />

          {/* Diagonal decoration */}
          <Box
            position="absolute"
            top="-80px"
            right="-80px"
            w="300px"
            h="300px"
            borderRadius="50%"
            border={`${BORDER.heavy} ${COLORS.red}`}
            opacity={0.06}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-40px"
            left="30%"
            w="200px"
            h="200px"
            border={`${BORDER.heavy} ${COLORS.gold}`}
            opacity={0.04}
            transform="rotate(45deg)"
            pointerEvents="none"
          />
          {/* Background geometric plane — large triangle */}
          <Box
            position="absolute"
            top="0"
            right="0"
            w="0"
            h="0"
            borderTop={`200px solid ${COLORS.red}`}
            borderLeft="200px solid transparent"
            opacity={0.05}
            pointerEvents="none"
          />

          <Box px="48px" py="48px" position="relative" zIndex={1}>
            <Flex align="baseline" gap="24px" mb="24px">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="80px"
                lineHeight={0.8}
                color={COLORS.red}
                letterSpacing="-0.04em"
              >
                503
              </Text>
              <Box pb="12px">
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="32px"
                  color={COLORS.pureWhite}
                  letterSpacing="0.02em"
                  textTransform="uppercase"
                  lineHeight={1}
                >
                  服务
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="32px"
                  color={COLORS.gold}
                  letterSpacing="0.02em"
                  textTransform="uppercase"
                  lineHeight={1}
                >
                  不可用
                </Text>
              </Box>
            </Flex>

            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="15px"
              color={COLORS.metalWhite}
              lineHeight={1.7}
              maxW="560px"
              mb="32px"
            >
              DevPod 守护进程未响应。这可能表示进程崩溃、网络分区或配置错误。所有工作区操作已暂停，直到连接恢复。
            </Text>

            {/* Error details */}
            <Box
              bg={COLORS.industrialBlack}
              border={`${BORDER.standard} ${COLORS.red}`}
              p="16px"
              mb="32px"
              maxW="560px"
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="10px"
                letterSpacing="0.15em"
                textTransform="uppercase"
                color={COLORS.red}
                mb="8px"
              >
                错误详情
              </Text>
              <VStack align="stretch" gap="4px">
                <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.metalWhite} opacity={0.7}>
                  timestamp: 2024-04-12T08:34:12.456Z
                </Text>
                <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.metalWhite} opacity={0.7}>
                  code: DAEMON_UNREACHABLE
                </Text>
                <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.metalWhite} opacity={0.7}>
                  pid: -- (not found)
                </Text>
                <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.metalWhite} opacity={0.7}>
                  socket: unix:///tmp/devpod-daemon.sock
                </Text>
              </VStack>
            </Box>

            {/* Actions */}
            <HStack gap="16px">
              <Box
                bg={COLORS.red}
                px="24px"
                py="12px"
                border={`${BORDER.heavy} ${COLORS.redDark}`}
                boxShadow={`6px 6px 0px rgba(0,0,0,0.3)`}
                cursor="pointer"
                position="relative"
                zIndex={2}
                transform="translateY(-4px)"
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="13px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={COLORS.pureWhite}
                >
                  重启守护进程
                </Text>
              </Box>
              <Box
                bg="transparent"
                border={`${BORDER.heavy} ${COLORS.pureWhite}`}
                px="24px"
                py="12px"
                cursor="pointer"
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="13px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={COLORS.pureWhite}
                >
                  打开诊断
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Box>

      {/* Calibration tick pattern — section boundary */}
      <Box
        position="relative"
        h="16px"
        mx={{ base: "32px", md: "80px" }}
        mb="4px"
      >
        {[0, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154].map((offset, i) => (
          <Box
            key={`tick-bot-${i}`}
            position="absolute"
            right={`${offset}px`}
            bottom="0"
            w={`${BORDER.hairline}`}
            h={i % 3 === 0 ? "14px" : "7px"}
            bg={COLORS.red}
            opacity={0.07}
          />
        ))}
      </Box>

      {/* INLINE ERROR STATES */}
      {/* Geometric separator — diagonal line + rotated square */}
      <Box
        position="relative"
        h="60px"
        mx={{ base: "32px", md: "80px" }}
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="30%"
          w="2px"
          h="120%"
          bg={COLORS.electricCyan}
          opacity={0.1}
          transform="rotate(-20deg)"
          transformOrigin="top"
        />
        <Box
          position="absolute"
          top="50%"
          left="45%"
          transform="translate(-50%, -50%) rotate(45deg)"
          w="20px"
          h="20px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
        />
      </Box>
      {/* Geometric diamond accent */}
      <Box
        w="28px"
        h="28px"
        bg={COLORS.gold}
        transform="rotate(45deg)"
        opacity={0.12}
        ml={{ base: "32px", md: "200px" }}
        mb="-14px"
        position="relative"
        zIndex={0}
      />
      <Box px={{ base: "32px", md: "80px" }} py="32px" ml={{ base: "0", md: "40px" }} opacity={0.85} position="relative">
        {/* Background wedge — large clipPath triangle at very low opacity */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={COLORS.gold}
          opacity={0.03}
          clipPath="polygon(70% 0%, 100% 0%, 100% 100%, 30% 100%)"
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
            03
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            内联错误——字段警报
          </Text>
        </Flex>

        <VStack align="stretch" gap="16px" maxW="560px" position="relative">
          {/* L-shaped corner brackets framing the inline error block */}
          <Box
            position="absolute"
            top="-8px"
            left="-8px"
            w="20px"
            h="20px"
            borderTop={`${BORDER.heavy} ${COLORS.red}`}
            borderLeft={`${BORDER.heavy} ${COLORS.red}`}
            opacity={0.15}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
            w="20px"
            h="20px"
            borderTop={`${BORDER.heavy} ${COLORS.red}`}
            borderRight={`${BORDER.heavy} ${COLORS.red}`}
            opacity={0.15}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-8px"
            left="-8px"
            w="20px"
            h="20px"
            borderBottom={`${BORDER.heavy} ${COLORS.electricCyan}`}
            borderLeft={`${BORDER.heavy} ${COLORS.electricCyan}`}
            opacity={0.12}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-8px"
            right="-8px"
            w="20px"
            h="20px"
            borderBottom={`${BORDER.heavy} ${COLORS.electricCyan}`}
            borderRight={`${BORDER.heavy} ${COLORS.electricCyan}`}
            opacity={0.12}
            pointerEvents="none"
          />

          {/* Input error */}
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              mb="8px"
            >
              仓库 URL
            </Text>
            <Box
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.red}`}
              px="14px"
              py="12px"
              borderLeft={`6px solid ${COLORS.red}`}
            >
              <Text fontFamily={FONT.mono} fontSize="14px" color={COLORS.industrialBlack} letterSpacing="0.03em">
                ftp://invalid-protocol.example.com
              </Text>
            </Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={COLORS.red}
              mt="4px"
            >
              不支持的协议——使用 HTTPS:// 或 GIT://
            </Text>
          </Box>

          {/* Toast / notification error */}
          <Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            borderLeft={`6px solid ${COLORS.red}`}
            boxShadow={SHADOW.medium}
            p="16px"
            mt="16px"
          >
            <Flex align="flex-start" gap="12px">
              <Box bg={COLORS.red} w="8px" h="8px" flexShrink={0} mt="4px" />
              <Box>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="13px"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  mb="4px"
                >
                  部署失败
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.industrialBlack}
                  lineHeight={1.6}
                >
                  Error: Container exited with code 137 (OOMKilled). Memory limit: 2GB. Peak usage: 2.1GB.
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Warning toast */}
          <Box
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            borderLeft={`6px solid ${COLORS.gold}`}
            boxShadow={SHADOW.medium}
            p="16px"
          >
            <Flex align="flex-start" gap="12px">
              <Box bg={COLORS.gold} w="8px" h="8px" flexShrink={0} mt="4px" />
              <Box>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="13px"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  mb="4px"
                >
                  配置已过时
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  color={COLORS.industrialBlack}
                  lineHeight={1.6}
                >
                  Your devcontainer.json uses schema v1. Consider migrating to v2 for improved feature support.
                </Text>
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Box>

      {/* Geometric footer — series of small triangles */}
      <Box
        px={{ base: "32px", md: "80px" }}
        py="8px"
        position="relative"
        h="32px"
      >
        <Box
          position="absolute"
          left={{ base: "40px", md: "100px" }}
          bottom="4px"
          w="0"
          h="0"
          borderLeft="6px solid transparent"
          borderRight="6px solid transparent"
          borderBottom={`10px solid ${COLORS.red}`}
          opacity={0.12}
        />
        <Box
          position="absolute"
          left={{ base: "56px", md: "120px" }}
          bottom="4px"
          w="0"
          h="0"
          borderLeft="5px solid transparent"
          borderRight="5px solid transparent"
          borderBottom={`8px solid ${COLORS.gold}`}
          opacity={0.1}
          transform="rotate(15deg)"
        />
        <Box
          position="absolute"
          left={{ base: "70px", md: "140px" }}
          bottom="4px"
          w="0"
          h="0"
          borderLeft="7px solid transparent"
          borderRight="7px solid transparent"
          borderBottom={`12px solid ${COLORS.electricCyan}`}
          opacity={0.08}
        />
        <Box
          position="absolute"
          left={{ base: "88px", md: "164px" }}
          bottom="4px"
          w="0"
          h="0"
          borderLeft="4px solid transparent"
          borderRight="4px solid transparent"
          borderBottom={`7px solid ${COLORS.red}`}
          opacity={0.15}
          transform="rotate(-10deg)"
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
