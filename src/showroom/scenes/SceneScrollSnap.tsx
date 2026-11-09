import { Box, Flex, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, SHADOW, SPACE } from "../../Theme";

interface PanelConfig {
  index: string;
  label: string;
  en: string;
  bg: string;
  color: string;
  accent: string;
  shadowColor: string;
  decoration: React.ReactNode;
}

const instrumentStrip = (
  <Flex h="6px" w="100%" position="absolute" bottom="0" left="0">
    <Box flex="3" bg={COLORS.red} />
    <Box flex="1" bg={COLORS.velocityOrange} />
    <Box flex="2" bg={COLORS.gold} />
    <Box flex="1" bg={COLORS.electricCyan} />
    <Box flex="1" bg={COLORS.signalGreen} />
    <Box flex="2" bg={COLORS.black} />
  </Flex>
);

function Wedge({ color, shadow, ...props }: { color: string; shadow: string; [key: string]: unknown }) {
  return (
    <Box
      position="absolute"
      w={{ base: "120px", md: "180px", lg: "240px" }}
      h={{ base: "120px", md: "180px", lg: "240px" }}
      bg={color}
      boxShadow={shadow}
      css={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      {...props}
    />
  );
}

function Block({ color, shadow, ...props }: { color: string; shadow: string; [key: string]: unknown }) {
  return (
    <Box
      position="absolute"
      bg={color}
      boxShadow={shadow}
      {...props}
    />
  );
}

function Circle({ color, shadow, ...props }: { color: string; shadow: string; [key: string]: unknown }) {
  return (
    <Box
      position="absolute"
      bg={color}
      borderRadius="50%"
      boxShadow={shadow}
      {...props}
    />
  );
}

export default function SceneScrollSnap() {
  const panels: PanelConfig[] = [
    {
      index: "01",
      label: "红色",
      en: "RED",
      bg: COLORS.red,
      color: COLORS.pureWhite,
      accent: COLORS.gold,
      shadowColor: COLORS.black,
      decoration: (
        <>
          <Wedge color={COLORS.gold} shadow={SHADOW.medium} top="0" right="0" />
          <Block
            color={COLORS.black}
            shadow={SHADOW.gold}
            w={{ base: "48px", md: "64px", lg: "80px" }}
            h={{ base: "48px", md: "64px", lg: "80px" }}
            bottom={{ base: "48px", md: "64px", lg: "80px" }}
            left={{ base: "24px", md: "48px" }}
          />
          <Circle
            color={COLORS.pureWhite}
            shadow={SHADOW.medium}
            w={{ base: "32px", md: "48px", lg: "64px" }}
            h={{ base: "32px", md: "48px", lg: "64px" }}
            bottom={{ base: "120px", md: "160px" }}
            left={{ base: "80px", md: "120px" }}
          />
        </>
      ),
    },
    {
      index: "02",
      label: "黑色",
      en: "BLACK",
      bg: COLORS.black,
      color: COLORS.pureWhite,
      accent: COLORS.red,
      shadowColor: COLORS.red,
      decoration: (
        <>
          <Circle
            color={COLORS.red}
            shadow={SHADOW.red}
            w={{ base: "96px", md: "144px", lg: "192px" }}
            h={{ base: "96px", md: "144px", lg: "192px" }}
            top={{ base: "24px", md: "48px" }}
            right={{ base: "24px", md: "48px" }}
          />
          <Block
            color={COLORS.electricCyan}
            shadow={SHADOW.cyan}
            w={{ base: "40px", md: "56px", lg: "72px" }}
            h={{ base: "40px", md: "56px", lg: "72px" }}
            top={{ base: "120px", md: "180px" }}
            right={{ base: "120px", md: "180px" }}
          />
          <Block
            color={COLORS.metalWhite}
            shadow={SHADOW.medium}
            w={{ base: "24px", md: "32px", lg: "40px" }}
            h={{ base: "24px", md: "32px", lg: "40px" }}
            bottom={{ base: "64px", md: "80px" }}
            left={{ base: "48px", md: "80px" }}
          />
        </>
      ),
    },
    {
      index: "03",
      label: "金色",
      en: "GOLD",
      bg: COLORS.gold,
      color: COLORS.black,
      accent: COLORS.pureWhite,
      shadowColor: COLORS.goldDark,
      decoration: (
        <>
          <Wedge color={COLORS.black} shadow={SHADOW.medium} bottom="0" left="0" css={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
          <Block
            color={COLORS.pureWhite}
            shadow={SHADOW.medium}
            w={{ base: "56px", md: "80px", lg: "104px" }}
            h={{ base: "56px", md: "80px", lg: "104px" }}
            top={{ base: "48px", md: "64px" }}
            left={{ base: "48px", md: "80px" }}
          />
          <Block
            color={COLORS.red}
            shadow={SHADOW.red}
            w={{ base: "32px", md: "48px", lg: "64px" }}
            h={{ base: "32px", md: "48px", lg: "64px" }}
            top={{ base: "96px", md: "128px" }}
            left={{ base: "96px", md: "144px" }}
          />
        </>
      ),
    },
    {
      index: "04",
      label: "白色",
      en: "WHITE",
      bg: COLORS.pureWhite,
      color: COLORS.black,
      accent: COLORS.red,
      shadowColor: COLORS.red,
      decoration: (
        <>
          <Block
            color={COLORS.red}
            shadow={SHADOW.red}
            w={{ base: "64px", md: "96px", lg: "128px" }}
            h={{ base: "64px", md: "96px", lg: "128px" }}
            top="0"
            right={{ base: "48px", md: "80px" }}
          />
          <Block
            color={COLORS.black}
            shadow={SHADOW.medium}
            w={{ base: "40px", md: "56px", lg: "72px" }}
            h={{ base: "40px", md: "56px", lg: "72px" }}
            top={{ base: "64px", md: "96px" }}
            right={{ base: "96px", md: "152px" }}
          />
          <Block
            color={COLORS.gold}
            shadow={SHADOW.gold}
            w={{ base: "32px", md: "48px", lg: "64px" }}
            h={{ base: "32px", md: "48px", lg: "64px" }}
            bottom={{ base: "64px", md: "80px" }}
            right={{ base: "48px", md: "80px" }}
          />
        </>
      ),
    },
  ];

  return (
    <Box
      h="100%"
      w="100%"
      overflowX="auto"
      css={{
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Flex h="100%" minW="max-content">
        {panels.map((panel) => (
          <Box
            key={panel.label}
            w={{ base: "100%", md: "85%", lg: "80%" }}
            h="100%"
            flexShrink={0}
            position="relative"
            overflow="hidden"
            css={{ scrollSnapAlign: "start" }}
            bg={panel.bg}
          >
            {panel.decoration}

            <Flex
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              direction="column"
              justify="center"
              align="center"
              p={{ base: SPACE.md, md: SPACE.xl, lg: SPACE["2xl"] }}
              zIndex={1}
            >
              <Text
                position="absolute"
                top={{ base: SPACE.md, md: SPACE.lg }}
                right={{ base: SPACE.md, md: SPACE.lg }}
                fontFamily={FONT.mono}
                fontSize={{ base: "10px", md: "11px" }}
                fontWeight={WEIGHT.bold}
                letterSpacing="0.1em"
                color={panel.color}
                opacity={0.7}
              >
                {panel.index} / 04
              </Text>

              <Box textAlign="center" maxW={{ base: "90%", md: "70%", lg: "600px" }}>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "14px", md: "16px" }}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color={panel.accent}
                  mb={SPACE.sm}
                >
                  Geometry Gallery
                </Text>

                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "64px", md: "96px", lg: "128px" }}
                  letterSpacing="-0.04em"
                  lineHeight={0.85}
                  color={panel.color}
                  css={{
                    textShadow: `4px 4px 0px ${panel.shadowColor}`,
                  }}
                >
                  {panel.label}
                </Text>

                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                  letterSpacing="0.08em"
                  color={panel.accent}
                  mt={SPACE.md}
                >
                  {panel.en}
                </Text>

                <Box
                  mt={SPACE.lg}
                  h={{ base: "8px", md: "12px" }}
                  w={{ base: "64px", md: "96px" }}
                  bg={panel.accent}
                  mx="auto"
                  boxShadow={SHADOW.medium}
                />
              </Box>
            </Flex>

            {instrumentStrip}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
