import { Box, Flex, Grid, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = {
  Box: motion(Box),
  Flex: motion(Flex),
  Text: motion(Text),
};

interface CheckItem {
  id: string;
  label: string;
  status: "ready" | "warn" | "lock";
}

const CHECKLIST: CheckItem[] = [
  { id: "A", label: "制导计算机", status: "ready" },
  { id: "B", label: "燃料压力", status: "ready" },
  { id: "C", label: "遥测链路", status: "warn" },
  { id: "D", label: "访问控制", status: "lock" },
];

export default function SceneOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      h="100%"
      position="relative"
      overflow="hidden"
      bg={COLORS.concrete}
      p={SPACE.md}
    >
      {/* 触发区 */}
      <Flex direction="column" align="flex-start" gap={SPACE.sm}>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          color={COLORS.industrialBlack}
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          Overlay // 06-03
        </Text>
        <Button
          borderRadius={0}
          bg={COLORS.red}
          color={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.redDark}`}
          boxShadow={SHADOW.red}
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="13px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          px={SPACE.lg}
          py="12px"
          h="auto"
          lineHeight={1}
          _hover={{
            bg: COLORS.redLight,
            transform: "translateY(-2px)",
            boxShadow: SHADOW.red,
          }}
          _active={{
            transform: "translateY(0px)",
            boxShadow: SHADOW.red,
          }}
          onClick={() => setOpen(true)}
        >
          启动系统控制台
        </Button>
      </Flex>

      <AnimatePresence>
        {open && (
          <M.Flex
            key="overlay-backdrop"
            position="absolute"
            inset={0}
            bg={`${COLORS.black}e0`}
            zIndex={Z_INDEX.overlay}
            align="center"
            justify="center"
            p={SPACE.md}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.launch }}
            onClick={() => setOpen(false)}
          >
            <M.Box
              key="overlay-panel"
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.large}
              w="100%"
              maxW="440px"
              position="relative"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                duration: DURATION.normal,
                ease: EASING.launch,
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* 顶部仪器色条 */}
              <Flex h="4px" w="100%">
                <Box flex={3} bg={COLORS.red} />
                <Box flex={1} bg={COLORS.velocityOrange} />
                <Box flex={2} bg={COLORS.gold} />
                <Box flex={1} bg={COLORS.electricCyan} />
                <Box flex={1} bg={COLORS.signalGreen} />
                <Box flex={2} bg={COLORS.black} />
              </Flex>

              {/* 头部 */}
              <Flex
                align="center"
                justify="space-between"
                borderBottom={`${BORDER.standard} ${COLORS.black}`}
                p={SPACE.md}
                pl="56px"
                position="relative"
              >
                {/* 左上角红色方块标记 */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  w="40px"
                  h="40px"
                  bg={COLORS.red}
                />

                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="18px"
                    color={COLORS.black}
                    letterSpacing="-0.02em"
                    lineHeight={1}
                    mb="4px"
                  >
                    系统控制台
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    color={COLORS.gold}
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                  >
                    LAUNCH CONSOLE // OVR-01
                  </Text>
                </Box>

                {/* 关闭按钮 */}
                <Button
                  as="button"
                  aria-label="关闭"
                  borderRadius={0}
                  bg={COLORS.black}
                  color={COLORS.pureWhite}
                  border={`${BORDER.heavy} ${COLORS.black}`}
                  boxShadow={SHADOW.small}
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="16px"
                  lineHeight={1}
                  px="10px"
                  py="6px"
                  h="auto"
                  _hover={{
                    bg: COLORS.red,
                    borderColor: COLORS.redDark,
                    boxShadow: SHADOW.red,
                    transform: "translateY(-2px)",
                  }}
                  _active={{
                    transform: "translateY(0px)",
                    boxShadow: SHADOW.none,
                  }}
                  onClick={() => setOpen(false)}
                >
                  ×
                </Button>
              </Flex>

              {/* 主体内容 */}
              <Box p={SPACE.md}>
                {/* 状态摘要 */}
                <Flex
                  align="center"
                  gap={SPACE.sm}
                  mb={SPACE.md}
                  flexWrap="wrap"
                >
                  <Box
                    bg={COLORS.signalGreen}
                    color={COLORS.pureWhite}
                    px="8px"
                    py="4px"
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.black}
                    fontSize="10px"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    lineHeight={1}
                  >
                    SYSTEM READY
                  </Box>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="10px"
                    color={COLORS.industrialBlack}
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    T-MINUS 00:04:19
                  </Text>
                </Flex>

                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.regular}
                  fontSize="14px"
                  color={COLORS.industrialBlack}
                  lineHeight={1.7}
                  mb={SPACE.md}
                >
                  操作前检查清单已加载。请确认以下子系统状态，所有项目锁定后方可执行下一步操作。
                </Text>

                {/* 检查清单网格 */}
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  gap={SPACE.sm}
                  mb={SPACE.md}
                >
                  {CHECKLIST.map((item) => {
                    const statusColor =
                      item.status === "ready"
                        ? COLORS.signalGreen
                        : item.status === "warn"
                        ? COLORS.velocityOrange
                        : COLORS.black;
                    const statusLabel =
                      item.status === "ready"
                        ? "就绪"
                        : item.status === "warn"
                        ? "警告"
                        : "锁定";

                    return (
                      <Box
                        key={item.id}
                        bg={COLORS.concrete}
                        border={`${BORDER.standard} ${COLORS.black}`}
                        boxShadow={SHADOW.small}
                        p="10px"
                      >
                        <Flex
                          align="center"
                          justify="space-between"
                          mb="6px"
                        >
                          <Text
                            fontFamily={FONT.mono}
                            fontWeight={WEIGHT.black}
                            fontSize="11px"
                            color={COLORS.black}
                            sx={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {item.id}
                          </Text>
                          <Box
                            w="8px"
                            h="8px"
                            bg={statusColor}
                          />
                        </Flex>
                        <Text
                          fontFamily={FONT.sans}
                          fontWeight={WEIGHT.bold}
                          fontSize="12px"
                          color={COLORS.black}
                          letterSpacing="0.02em"
                          lineHeight={1.2}
                          mb="2px"
                        >
                          {item.label}
                        </Text>
                        <Text
                          fontFamily={FONT.mono}
                          fontSize="9px"
                          color={statusColor}
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                        >
                          {statusLabel}
                        </Text>
                      </Box>
                    );
                  })}
                </Grid>

                {/* 底部操作 */}
                <Flex gap={SPACE.sm} justify="flex-end">
                  <Button
                    borderRadius={0}
                    bg="transparent"
                    color={COLORS.black}
                    border={`${BORDER.standard} ${COLORS.industrialBlack}`}
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="11px"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    px={SPACE.md}
                    py="8px"
                    h="auto"
                    lineHeight={1}
                    _hover={{
                      bg: COLORS.metalWhite,
                      transform: "translateY(-2px)",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    中止
                  </Button>
                  <Button
                    borderRadius={0}
                    bg={COLORS.red}
                    color={COLORS.pureWhite}
                    border={`${BORDER.heavy} ${COLORS.redDark}`}
                    boxShadow={SHADOW.red}
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="11px"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    px={SPACE.md}
                    py="8px"
                    h="auto"
                    lineHeight={1}
                    _hover={{
                      bg: COLORS.redLight,
                      transform: "translateY(-2px)",
                      boxShadow: SHADOW.red,
                    }}
                    _active={{
                      transform: "translateY(0px)",
                      boxShadow: SHADOW.red,
                    }}
                    onClick={() => setOpen(false)}
                  >
                    确认点火
                  </Button>
                </Flex>
              </Box>
            </M.Box>
          </M.Flex>
        )}
      </AnimatePresence>
    </Box>
  );
}
