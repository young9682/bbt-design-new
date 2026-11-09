import { Box, Text, Flex, HStack, Link } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { COLORS, FONT, WEIGHT, BORDER, DURATION } from "./Theme"

const M = {
  Box: motion(Box),
  Text: motion(Text),
}

/**
 * 翻页时钟数字单元
 * — 模拟 Solari 分裂翻板显示器
 */
function FlipCell({ char, w = "20px", h = "28px", fontSize = "16px", active }: {
  char: string
  w?: string
  h?: string
  fontSize?: string
  active?: boolean
}) {
  return (
    <Box
      w={w}
      h={h}
      bg={COLORS.industrialBlack}
      border={`1px solid ${COLORS.pureWhite}14`}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {/* Horizontal split — the flap line */}
      <Box
        position="absolute"
        top="50%"
        left="0"
        right="0"
        h="1px"
        bg={COLORS.black}
        zIndex={2}
      />
      {/* Top half — slightly darker (shadow from the flap) */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="50%"
        bg={`${COLORS.black}40`}
      />
      {/* Bottom half — subtle gradient (light reflecting off lower flap) */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="50%"
        bg={`${COLORS.pureWhite}08`}
      />
      {/* The character */}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize={fontSize}
        color={active ? COLORS.red : COLORS.metalWhite}
        lineHeight={1}
        position="relative"
        zIndex={1}
      >
        {char}
      </Text>
      {/* Left rivet */}
      <Box position="absolute" top="50%" left="1px" w="2px" h="2px" borderRadius="50%" bg={`${COLORS.pureWhite}1a`} transform="translateY(-50%)" />
      {/* Right rivet */}
      <Box position="absolute" top="50%" right="1px" w="2px" h="2px" borderRadius="50%" bg={`${COLORS.pureWhite}1a`} transform="translateY(-50%)" />
    </Box>
  )
}

/**
 * Flip-clock 风格的分隔符（冒号/斜杠）
 */
function FlipSeparator({ char = ":" }: { char?: string }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="8px"
      h="28px"
      gap="6px"
      flexShrink={0}
    >
      <Box w="2px" h="2px" bg={COLORS.metalWhite} opacity={0.6} />
      <Box w="2px" h="2px" bg={COLORS.metalWhite} opacity={0.6} />
    </Flex>
  )
}

/**
 * 翻板数字组 — 将字符串拆分为独立的翻页单元
 */
function FlipDisplay({ value, w, h, fontSize, activeIndex }: {
  value: string
  w?: string
  h?: string
  fontSize?: string
  activeIndex?: number
}) {
  return (
    <HStack gap="2px" spacing={0}>
      {value.split("").map((char, i) => (
        <FlipCell
          key={i}
          char={char}
          w={w}
          h={h}
          fontSize={fontSize}
          active={activeIndex !== undefined ? i === activeIndex : false}
        />
      ))}
    </HStack>
  )
}

/**
 * 实时时钟 — 翻页式
 */
function FlipClock() {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const [hours, minutes] = time.split(":") as [string, string]

  return (
    <HStack gap="3px" spacing={0} align="center">
      <FlipDisplay value={hours} />
      <M.Box
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <FlipSeparator />
      </M.Box>
      <FlipDisplay value={minutes} />
    </HStack>
  )
}

/**
 * 翻页时钟风格状态栏
 */
export function RefNavBar({ title, pageIndex }: { title: string; pageIndex: string }) {
  return (
    <Box
      bg={COLORS.black}
      position="sticky"
      top={0}
      zIndex={10}
      borderBottom={`2px solid ${COLORS.red}`}
    >
      {/* Top scanline strip */}
      <Box h="2px"
        backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
        opacity={0.4}
      />

      <Flex
        px="24px"
        py="0"
        align="stretch"
        justify="space-between"
        h="48px"
      >
        {/* Left section — navigation + title */}
        <Flex align="center" gap="0" h="100%">
          {/* Back button — mechanical panel button */}
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }} display="flex" alignItems="center" h="100%">
            <Flex
              align="center"
              justify="center"
              h="100%"
              px="12px"
              borderRight={`1px solid ${COLORS.pureWhite}14`}
              cursor="pointer"
              _hover={{ bg: COLORS.red }}
              transition={`background ${DURATION.fast}s ease`}
            >
              <Text fontFamily={FONT.mono} fontSize="14px" color={COLORS.red} _hover={{ color: COLORS.pureWhite }} lineHeight={1}>
                &#8592;
              </Text>
            </Flex>
          </Link>

          {/* Page title in flip cells */}
          <Flex align="center" h="100%" px="12px" gap="8px">
            <Box w="4px" h="4px" bg={COLORS.red} flexShrink={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="12px"
              letterSpacing="0.08em"
              color={COLORS.pureWhite}
              textTransform="uppercase"
              lineHeight={1}
            >
              {title}
            </Text>
          </Flex>

          {/* Module code label */}
          <Flex align="center" h="100%" px="8px" borderLeft={`1px solid ${COLORS.pureWhite}0f`}>
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              color={COLORS.metalWhite}
              opacity={0.3}
              letterSpacing="0.12em"
              textTransform="uppercase"
              lineHeight={1}
            >
              MOD-{pageIndex.replace(/ /g, "")}
            </Text>
          </Flex>
        </Flex>

        {/* Right section — flip-clock page counter + clock */}
        <Flex align="center" gap="16px" h="100%">
          {/* Page counter — flip display */}
          <HStack gap="4px" spacing={0} align="center">
            <FlipDisplay value={pageIndex} w="16px" h="24px" fontSize="13px" />
            <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.metalWhite} opacity={0.3} mx="2px">/</Text>
            <FlipDisplay value="10" w="16px" h="24px" fontSize="13px" />
          </HStack>

          {/* Vertical divider */}
          <Box w="1px" h="24px" bg={`${COLORS.pureWhite}14`} />

          {/* Live clock */}
          <Flex align="center" gap="6px">
            <Box w="3px" h="3px" bg={COLORS.statusGreen} opacity={0.6} />
            <FlipClock />
          </Flex>
        </Flex>
      </Flex>

      {/* Bottom instrument line */}
      <Flex h="2px">
        <Box flex={3} bg={COLORS.red} />
        <Box flex={7} bg={`${COLORS.pureWhite}0a`} />
      </Flex>
    </Box>
  )
}
