import { Box, Text, Flex, VStack, HStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


function ButtonShowcase({
  label,
  sublabel,
  sublabelFontSize,
  children,
}: {
  label: string;
  sublabel: string;
  sublabelFontSize?: string;
  children: React.ReactNode;
}) {
  return (
    <Box mb="48px">
      <Flex align="baseline" gap="16px" mb="20px">
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize={sublabelFontSize || "11px"}
          letterSpacing="0.2em"
          textTransform="uppercase"
          color={COLORS.red}
        >
          {sublabel}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="18px"
          letterSpacing="0.06em"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Flex gap="24px" align="flex-start" flexWrap="wrap">
        {children}
      </Flex>
    </Box>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ x: 4, y: -2 }}
      whileTap={{ x: 8, y: 2 }}
      bg={COLORS.red}
      border={`${BORDER.heavy} ${COLORS.redDark}`}
      boxShadow={SHADOW.red}
      px="32px"
      py="14px"
      cursor="pointer"
      userSelect="none"
      display="inline-block"
      position="relative"
    >
      {/* Top activation line */}
      <Box position="absolute" top="0" left="4px" right="4px" h="2px" bg={COLORS.gold} opacity={0.5} />
      {/* Corner brackets */}
      <Box position="absolute" top="-2px" left="-2px" w="8px" h="8px" borderTop={`2px solid ${COLORS.gold}`} borderLeft={`2px solid ${COLORS.gold}`} opacity={0.6} />
      <Box position="absolute" top="-2px" right="-2px" w="8px" h="8px" borderTop={`2px solid ${COLORS.gold}`} borderRight={`2px solid ${COLORS.gold}`} opacity={0.6} />
      {/* Scanline overlay */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.06} pointerEvents="none"
        backgroundImage={`repeating-linear-gradient(0deg, transparent, transparent 2px, ${COLORS.black}4d 2px, ${COLORS.black}4d 4px)`}
      />
      <Flex align="center" gap="10px">
        {/* Indicator LED */}
        <Box w="6px" h="6px" bg={COLORS.gold} flexShrink={0} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="14px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={COLORS.pureWhite}
          textAlign="center"
        >
          {children}
        </Text>
      </Flex>
    </M.Box>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ x: 4, y: -2 }}
      whileTap={{ x: 8, y: 2 }}
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      px="32px"
      py="14px"
      cursor="pointer"
      userSelect="none"
      display="inline-block"
      position="relative"
    >
      {/* Bottom circuit line */}
      <Box position="absolute" bottom="0" left="6px" right="6px" h="2px" bg={COLORS.black} opacity={0.3} />
      <Flex align="center" gap="10px">
        {/* Hollow indicator */}
        <Box w="6px" h="6px" border={`1.5px solid ${COLORS.black}`} flexShrink={0} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="14px"
          letterSpacing="0.05em"
          textTransform="uppercase"
          color={COLORS.black}
          textAlign="center"
        >
          {children}
        </Text>
      </Flex>
    </M.Box>
  );
}

function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ bg: COLORS.black, color: COLORS.pureWhite }}
      bg="transparent"
      border={`${BORDER.standard} ${COLORS.industrialBlack}`}
      px="24px"
      py="12px"
      cursor="pointer"
      userSelect="none"
      display="inline-block"
    >
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="13px"
        letterSpacing="0.05em"
        textTransform="uppercase"
        color={COLORS.black}
        textAlign="center"
      >
        {children}
      </Text>
    </M.Box>
  );
}

function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ x: 4, y: -2, bg: COLORS.redDark }}
      whileTap={{ x: 8, y: 2 }}
      bg={COLORS.black}
      border={`${BORDER.heavy} ${COLORS.red}`}
      boxShadow={`4px 4px 0px ${COLORS.red}`}
      px="32px"
      py="14px"
      cursor="pointer"
      userSelect="none"
      display="inline-block"
      position="relative"
    >
      {/* Diagonal hazard stripe */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" overflow="hidden" pointerEvents="none" opacity={0.08}>
        <Box position="absolute" top="-10px" left="-10px" w="200%" h="3px" bg={COLORS.gold} transform="rotate(-45deg)" transformOrigin="top left" />
        <Box position="absolute" top="4px" left="-10px" w="200%" h="3px" bg={COLORS.gold} transform="rotate(-45deg)" transformOrigin="top left" />
      </Box>
      <Flex align="center" gap="10px">
        {/* Pulsing warning indicator */}
        <M.Box
          w="6px" h="6px" bg={COLORS.red} flexShrink={0}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="14px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={COLORS.red}
          textAlign="center"
        >
          {children}
        </Text>
      </Flex>
    </M.Box>
  );
}

function GoldButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ x: 4, y: -2 }}
      whileTap={{ x: 8, y: 2 }}
      bg={COLORS.gold}
      border={`${BORDER.heavy} ${COLORS.goldDark}`}
      boxShadow={SHADOW.gold}
      px="32px"
      py="14px"
      cursor="pointer"
      userSelect="none"
      display="inline-block"
      position="relative"
    >
      {/* Corner notch — top-right cut */}
      <Box position="absolute" top="-1px" right="-1px" w="0" h="0"
        borderStyle="solid" borderWidth="0 10px 10px 0"
        borderColor={`transparent ${COLORS.concrete} transparent transparent`}
      />
      <Flex align="center" gap="10px">
        {/* Diamond indicator */}
        <Box w="5px" h="5px" bg={COLORS.black} transform="rotate(45deg)" flexShrink={0} opacity={0.6} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="14px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={COLORS.black}
          textAlign="center"
        >
          {children}
        </Text>
      </Flex>
    </M.Box>
  );
}

function DisabledButton({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg={COLORS.metalWhite}
      border={`${BORDER.heavy} ${COLORS.industrialBlack}`}
      px="32px"
      py="14px"
      opacity={0.5}
      cursor="not-allowed"
      userSelect="none"
      display="inline-block"
    >
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="14px"
        letterSpacing="0.05em"
        textTransform="uppercase"
        color={COLORS.industrialBlack}
        textAlign="center"
      >
        {children}
      </Text>
    </Box>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <M.Box
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.normal, ease: EASING.launch }}
      whileHover={{ bg: COLORS.red }}
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      w="48px"
      h="48px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      userSelect="none"
      position="relative"
    >
      {/* Crosshair corners */}
      <Box position="absolute" top="3px" left="3px" w="5px" h="1px" bg={COLORS.red} opacity={0.4} />
      <Box position="absolute" top="3px" left="3px" w="1px" h="5px" bg={COLORS.red} opacity={0.4} />
      <Box position="absolute" bottom="3px" right="3px" w="5px" h="1px" bg={COLORS.red} opacity={0.4} />
      <Box position="absolute" bottom="3px" right="3px" w="1px" h="5px" bg={COLORS.red} opacity={0.4} />
      <Text
        fontFamily={FONT.mono}
        fontSize="18px"
        color={COLORS.black}
        textAlign="center"
        lineHeight={1}
      >
        {children}
      </Text>
    </M.Box>
  );
}

export default function ButtonsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="按钮系统" pageIndex="03" />

      {/* HERO */}
      <Box bg={COLORS.red} px="80px" py="48px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-60px"
          right="100px"
          w="160px"
          h="160px"
          borderRadius="50%"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.12}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-20px"
          right="60px"
          w="80px"
          h="80px"
          border={`3px solid ${COLORS.gold}`}
          opacity={0.15}
          transform="rotate(45deg)"
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
          决策即
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.gold}
          letterSpacing="-0.02em"
        >
          行动
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.pureWhite}
          opacity={0.7}
          mt="16px"
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          按钮是一次承诺。按下即不可逆。
        </Text>
      </Box>

      {/* Geometric accent: hero-to-variants transition — overlapping circle + triangle + line */}
      <Box position="relative" h="48px" overflow="hidden" pointerEvents="none">
        {/* Large concentric circle */}
        <Box
          position="absolute"
          top="-40px"
          left="80px"
          w="120px"
          h="120px"
          borderRadius="50%"
          border={`2px solid ${COLORS.red}`}
          opacity={0.08}
        />
        <Box
          position="absolute"
          top="-20px"
          left="100px"
          w="80px"
          h="80px"
          borderRadius="50%"
          border={`1px solid ${COLORS.gold}`}
          opacity={0.12}
        />
        {/* Triangle via clipPath */}
        <Box
          position="absolute"
          top="6px"
          right="200px"
          w="40px"
          h="40px"
          bg={COLORS.electricCyan}
          opacity={0.07}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
        {/* Diagonal line */}
        <Box
          position="absolute"
          top="24px"
          left="220px"
          w="180px"
          h="1px"
          bg={COLORS.gold}
          opacity={0.15}
          transform="rotate(-12deg)"
          transformOrigin="left center"
        />
      </Box>

      {/* BUTTON VARIANTS */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        {/* Primary — red background plane + left accent */}
        <Box position="relative" pl="16px" pt="8px" borderLeft={`4px solid ${COLORS.red}`}>
          <Box
            bg={COLORS.red}
            opacity={0.06}
            position="absolute"
            top={0}
            left={0}
            right="-16px"
            bottom={0}
            pointerEvents="none"
          />
          <Box position="relative">
            <ButtonShowcase label="主按钮——命令" sublabel="01">
              <PrimaryButton>提交</PrimaryButton>
              <PrimaryButton>部署</PrimaryButton>
              <PrimaryButton>创建工作区</PrimaryButton>
              <PrimaryButton>连接</PrimaryButton>
            </ButtonShowcase>
          </Box>
        </Box>

        {/* Geometric divider: dotted line + rotated square between 01 and 02 */}
        <Box position="relative" h="24px" my="8px" pointerEvents="none">
          <Box
            position="absolute"
            top="12px"
            left="16px"
            right="60px"
            h="1px"
            bg={COLORS.industrialBlack}
            opacity={0.12}
            backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.industrialBlack} 0px, ${COLORS.industrialBlack} 3px, transparent 3px, transparent 8px)`}
          />
          <Box
            position="absolute"
            top="4px"
            right="24px"
            w="14px"
            h="14px"
            border={`1px solid ${COLORS.gold}`}
            opacity={0.15}
            transform="rotate(45deg)"
          />
        </Box>

        {/* Secondary */}
        <ButtonShowcase label="次按钮——替代方案" sublabel="02">
          <SecondaryButton>配置</SecondaryButton>
          <SecondaryButton>导入</SecondaryButton>
          <SecondaryButton>查看日志</SecondaryButton>
        </ButtonShowcase>

        {/* Ghost — receded plane */}
        <Box opacity={0.85}>
          <ButtonShowcase
            label="幽灵按钮——沉默的选择"
            sublabel="03"
            sublabelFontSize="9px"
          >
            <GhostButton>取消</GhostButton>
            <GhostButton>忽略</GhostButton>
            <GhostButton>跳过</GhostButton>
          </ButtonShowcase>
        </Box>

        {/* Geometric divider: chevron pointing right between 03 and 04 */}
        <Box position="relative" h="20px" my="4px" pointerEvents="none">
          <Box
            position="absolute"
            top="2px"
            left="32px"
            w="16px"
            h="16px"
            borderRight={`2px solid ${COLORS.red}`}
            borderBottom={`2px solid ${COLORS.red}`}
            opacity={0.18}
            transform="rotate(-45deg)"
          />
          {/* Second smaller chevron */}
          <Box
            position="absolute"
            top="5px"
            left="48px"
            w="10px"
            h="10px"
            borderRight={`1.5px solid ${COLORS.red}`}
            borderBottom={`1.5px solid ${COLORS.red}`}
            opacity={0.10}
            transform="rotate(-45deg)"
          />
        </Box>

        {/* Danger — left accent */}
        <Box pl="24px" borderLeft={`4px solid ${COLORS.red}`}>
          <ButtonShowcase label="危险按钮——不可逆" sublabel="04">
            <DangerButton>销毁</DangerButton>
            <DangerButton>强制停止</DangerButton>
            <DangerButton>全部删除</DangerButton>
          </ButtonShowcase>
        </Box>

        {/* Gold/Accent */}
        <ButtonShowcase label="金色按钮——成就" sublabel="05">
          <GoldButton>升级</GoldButton>
          <GoldButton>导出报告</GoldButton>
        </ButtonShowcase>

        {/* Geometric divider: concentric circles between 05 and 06 */}
        <Box position="relative" h="32px" my="4px" pointerEvents="none">
          <Box
            position="absolute"
            top="-16px"
            left="40px"
            w="64px"
            h="64px"
            borderRadius="50%"
            border={`1px solid ${COLORS.gold}`}
            opacity={0.08}
          />
          <Box
            position="absolute"
            top="-6px"
            left="50px"
            w="44px"
            h="44px"
            borderRadius="50%"
            border={`1px solid ${COLORS.gold}`}
            opacity={0.12}
          />
          <Box
            position="absolute"
            top="4px"
            left="60px"
            w="24px"
            h="24px"
            borderRadius="50%"
            border={`1px solid ${COLORS.gold}`}
            opacity={0.16}
          />
          <Box
            position="absolute"
            top="13px"
            left="69px"
            w="6px"
            h="6px"
            borderRadius="50%"
            bg={COLORS.gold}
            opacity={0.10}
          />
        </Box>

        {/* Disabled — receded plane */}
        <Box opacity={0.85}>
          <ButtonShowcase label="禁用——等待状态" sublabel="06" sublabelFontSize="9px">
            <DisabledButton>等待信号...</DisabledButton>
            <DisabledButton>不可用</DisabledButton>
          </ButtonShowcase>
        </Box>

        {/* Geometric divider: small cross between 06 and 07 */}
        <Box position="relative" h="20px" my="4px" pointerEvents="none">
          <Box
            position="absolute"
            top="4px"
            left="48px"
            w="14px"
            h="1.5px"
            bg={COLORS.electricCyan}
            opacity={0.18}
          />
          <Box
            position="absolute"
            top="-2px"
            left="54px"
            w="1.5px"
            h="14px"
            bg={COLORS.electricCyan}
            opacity={0.18}
          />
          {/* Small calibration ticks flanking the cross */}
          <Box position="absolute" top="8px" left="28px" w="8px" h="1px" bg={COLORS.industrialBlack} opacity={0.08} />
          <Box position="absolute" top="4px" left="28px" w="1px" h="8px" bg={COLORS.industrialBlack} opacity={0.08} />
          <Box position="absolute" top="8px" left="80px" w="8px" h="1px" bg={COLORS.industrialBlack} opacity={0.08} />
          <Box position="absolute" top="4px" left="87px" w="1px" h="8px" bg={COLORS.industrialBlack} opacity={0.08} />
        </Box>

        {/* Icon buttons — offset plane */}
        <Box ml="32px">
          <ButtonShowcase label="图标按钮——工具" sublabel="07">
            <IconButton>+</IconButton>
            <IconButton>&#8592;</IconButton>
            <IconButton>&#8594;</IconButton>
            <IconButton>&#8635;</IconButton>
            <IconButton>&#9776;</IconButton>
          </ButtonShowcase>
        </Box>
      </Box>

      {/* Geometric transition: diagonal line + arrow between variants and context demo */}
      <Box position="relative" h="28px" mx={{ base: "32px", md: "80px" }} pointerEvents="none">
        {/* Long diagonal line */}
        <Box
          position="absolute"
          top="14px"
          left="0"
          w="200px"
          h="1px"
          bg={COLORS.electricCyan}
          opacity={0.14}
          transform="rotate(-8deg)"
          transformOrigin="left center"
        />
        {/* Arrow head (chevron) at end of line */}
        <Box
          position="absolute"
          top="4px"
          left="184px"
          w="10px"
          h="10px"
          borderRight={`1.5px solid ${COLORS.electricCyan}`}
          borderBottom={`1.5px solid ${COLORS.electricCyan}`}
          opacity={0.14}
          transform="rotate(-45deg)"
        />
        {/* Hash marks along the diagonal */}
        <Box position="absolute" top="6px" left="60px" w="1px" h="6px" bg={COLORS.electricCyan} opacity={0.08} />
        <Box position="absolute" top="8px" left="90px" w="1px" h="6px" bg={COLORS.electricCyan} opacity={0.08} />
        <Box position="absolute" top="10px" left="120px" w="1px" h="6px" bg={COLORS.electricCyan} opacity={0.08} />
        <Box position="absolute" top="12px" left="150px" w="1px" h="6px" bg={COLORS.electricCyan} opacity={0.08} />
      </Box>

      {/* CONTEXT DEMO — full-width composition */}
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
            08
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            使用场景——控制条
          </Text>
        </Flex>

        <Box
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          p="24px"
          position="relative"
          overflow="hidden"
        >
          {/* Background geometric plane — large rotated rectangle */}
          <Box
            position="absolute"
            top="-40px"
            right="-20px"
            w="180px"
            h="260px"
            border={`1px solid ${COLORS.electricCyan}`}
            opacity={0.06}
            transform="rotate(15deg)"
            pointerEvents="none"
          />
          {/* Background small circle */}
          <Box
            position="absolute"
            bottom="-12px"
            left="40px"
            w="50px"
            h="50px"
            borderRadius="50%"
            border={`1px solid ${COLORS.red}`}
            opacity={0.05}
            pointerEvents="none"
          />
          {/* L-shaped corner brackets on context demo card */}
          <Box position="absolute" top="-4px" left="-4px" w="18px" h="18px" borderTop={`2px solid ${COLORS.electricCyan}`} borderLeft={`2px solid ${COLORS.electricCyan}`} opacity={0.18} pointerEvents="none" />
          <Box position="absolute" top="-4px" right="-4px" w="18px" h="18px" borderTop={`2px solid ${COLORS.electricCyan}`} borderRight={`2px solid ${COLORS.electricCyan}`} opacity={0.18} pointerEvents="none" />
          <Box position="absolute" bottom="-4px" left="-4px" w="18px" h="18px" borderBottom={`2px solid ${COLORS.electricCyan}`} borderLeft={`2px solid ${COLORS.electricCyan}`} opacity={0.18} pointerEvents="none" />
          <Box position="absolute" bottom="-4px" right="-4px" w="18px" h="18px" borderBottom={`2px solid ${COLORS.electricCyan}`} borderRight={`2px solid ${COLORS.electricCyan}`} opacity={0.18} pointerEvents="none" />
          <Flex justify="space-between" align="center" flexWrap="wrap" gap="16px">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="20px"
              letterSpacing="0.04em"
              textTransform="uppercase"
            >
              工作区：FRONTEND-DEV
            </Text>
            <HStack gap="12px">
              <GhostButton>日志</GhostButton>
              <SecondaryButton>配置</SecondaryButton>
              <PrimaryButton>启动</PrimaryButton>
            </HStack>
          </Flex>
        </Box>

        {/* Gold diagonal line between cards */}
        <Box
          h="16px"
          position="relative"
          mt="-6px"
          ml="24px"
          pointerEvents="none"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            w="120px"
            h="1px"
            bg={COLORS.gold}
            opacity={0.4}
            transform="rotate(-15deg)"
            transformOrigin="left center"
          />
        </Box>

        {/* Danger context — overlapping the workspace card */}
        <Box
          bg={COLORS.red}
          border={`${BORDER.heavy} ${COLORS.redDark}`}
          p="24px"
          mt="-12px"
          ml="24px"
          position="relative"
          zIndex={2}
        >
          <Flex justify="space-between" align="center" flexWrap="wrap" gap="16px">
            <Box>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="20px"
                letterSpacing="0.04em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                危急：工作区损坏
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="12px"
                color={COLORS.pureWhite}
                opacity={0.7}
                mt="4px"
                letterSpacing="0.03em"
              >
                LAST KNOWN STATE: 2024-04-12T08:34:00Z
              </Text>
            </Box>
            <HStack gap="12px">
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
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                  color={COLORS.pureWhite}
                >
                  尝试恢复
                </Text>
              </Box>
              <DangerButton>销毁并重建</DangerButton>
            </HStack>
          </Flex>
        </Box>
      </Box>

      {/* Geometric transition: series of small triangles between danger card and back */}
      <Box position="relative" h="28px" mx={{ base: "32px", md: "80px" }} pointerEvents="none">
        <Box
          position="absolute"
          top="10px"
          left="24px"
          w="10px"
          h="10px"
          bg={COLORS.red}
          opacity={0.08}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
        <Box
          position="absolute"
          top="12px"
          left="44px"
          w="8px"
          h="8px"
          bg={COLORS.gold}
          opacity={0.10}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
        <Box
          position="absolute"
          top="10px"
          left="60px"
          w="10px"
          h="10px"
          bg={COLORS.red}
          opacity={0.06}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
        <Box
          position="absolute"
          top="14px"
          left="78px"
          w="6px"
          h="6px"
          bg={COLORS.electricCyan}
          opacity={0.12}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
        <Box
          position="absolute"
          top="10px"
          left="92px"
          w="10px"
          h="10px"
          bg={COLORS.gold}
          opacity={0.07}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
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
            transition={`gap ${DURATION.fast}s ease`}
          >
            <Box
              w="12px"
              h="12px"
              bg={COLORS.gold}
              opacity={0.3}
              transform="rotate(45deg)"
              mr="8px"
              flexShrink={0}
            />
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
