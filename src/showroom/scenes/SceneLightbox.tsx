import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = {
  Box: motion(Box),
  Flex: motion(Flex),
};

const pad = (n: number) => String(n).padStart(2, "0");

interface Artwork {
  id: string;
  title: string;
  code: string;
  bg: string;
  render: () => React.ReactNode;
}

/* 八幅几何 "摄影作品" — 全部百分比定位，缩略图与灯箱同一构成 */
const ARTWORKS: Artwork[] = [
  {
    id: "wedge",
    title: "红楔",
    code: "WEDGE",
    bg: COLORS.concrete,
    render: () => (
      <>
        {/* 红色楔形 — 自左上刺入画面 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg={COLORS.red}
          css={{ clipPath: "polygon(0 0, 62% 0, 0 100%)" }}
        />
        {/* 金色矩形 — 骑在楔形斜边上 */}
        <Box
          position="absolute"
          top="14%"
          left="34%"
          w="22%"
          h="26%"
          bg={COLORS.gold}
          css={{ boxShadow: SHADOW.red }}
        />
        {/* 黑色方块 — 右下锚点 */}
        <Box
          position="absolute"
          bottom="10%"
          right="8%"
          w="20%"
          h="24%"
          bg={COLORS.black}
        />
        {/* 电青色信号线 */}
        <Box
          position="absolute"
          top="66%"
          left="28%"
          w="48%"
          h="3px"
          bg={COLORS.electricCyan}
          opacity={0.8}
          css={{ transform: "rotate(-14deg)" }}
        />
      </>
    ),
  },
  {
    id: "tower",
    title: "塔式构成",
    code: "TOWER",
    bg: COLORS.pureWhite,
    render: () => (
      <>
        {/* 黑色立柱 */}
        <Box
          position="absolute"
          top="0"
          bottom="0"
          left="38%"
          w="16%"
          bg={COLORS.black}
        />
        {/* 红色横梁 */}
        <Box
          position="absolute"
          top="32%"
          left="16%"
          w="58%"
          h="15%"
          bg={COLORS.red}
        />
        {/* 金色冠块 */}
        <Box
          position="absolute"
          top="8%"
          left="34%"
          w="24%"
          h="13%"
          bg={COLORS.gold}
        />
        {/* 电青色地基 */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="100%"
          h="9%"
          bg={COLORS.electricCyan}
        />
      </>
    ),
  },
  {
    id: "diagonal",
    title: "金色对角",
    code: "DIAGONAL",
    bg: COLORS.black,
    render: () => (
      <>
        {/* 金色对角带 — 贯穿黑色虚空 */}
        <Box
          position="absolute"
          top="38%"
          left="-12%"
          w="124%"
          h="24%"
          bg={COLORS.gold}
          css={{ transform: "rotate(-16deg)" }}
        />
        {/* 红色方块 — 右上标记 */}
        <Box
          position="absolute"
          top="12%"
          right="10%"
          w="14%"
          h="18%"
          bg={COLORS.red}
        />
        {/* 金属白细线 */}
        <Box
          position="absolute"
          bottom="12%"
          left="8%"
          w="32%"
          h="2px"
          bg={COLORS.pureWhite}
          opacity={0.7}
        />
        {/* 电青色小块 */}
        <Box
          position="absolute"
          bottom="10%"
          right="14%"
          w="12%"
          h="12%"
          bg={COLORS.electricCyan}
        />
      </>
    ),
  },
  {
    id: "split",
    title: "分割平面",
    code: "SPLIT",
    bg: COLORS.pureWhite,
    render: () => (
      <>
        {/* 红色斜边竖面 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          h="100%"
          w="58%"
          bg={COLORS.red}
          css={{ clipPath: "polygon(0 0, 100% 0, 62% 100%, 0 100%)" }}
        />
        {/* 黑色三角 — 右下角 */}
        <Box
          position="absolute"
          bottom="0"
          right="0"
          w="42%"
          h="38%"
          bg={COLORS.black}
          css={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
        {/* 金色悬浮块 */}
        <Box
          position="absolute"
          top="34%"
          left="42%"
          w="18%"
          h="22%"
          bg={COLORS.gold}
          css={{ boxShadow: SHADOW.red }}
        />
        {/* 电青色顶条 */}
        <Box
          position="absolute"
          top="10%"
          right="12%"
          w="16%"
          h="10%"
          bg={COLORS.electricCyan}
        />
      </>
    ),
  },
  {
    id: "bars",
    title: "垂直节律",
    code: "BARS",
    bg: COLORS.concrete,
    render: () => (
      <>
        {/* 黑色压顶 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="10%"
          bg={COLORS.black}
        />
        {/* 四根立柱 — 高低错落 */}
        <Box position="absolute" bottom="0" left="12%" w="13%" h="52%" bg={COLORS.black} />
        <Box position="absolute" bottom="0" left="34%" w="13%" h="74%" bg={COLORS.red} />
        <Box position="absolute" bottom="0" left="56%" w="13%" h="40%" bg={COLORS.gold} />
        <Box position="absolute" bottom="0" left="78%" w="13%" h="62%" bg={COLORS.electricCyan} />
      </>
    ),
  },
  {
    id: "steps",
    title: "阶梯上升",
    code: "STEPS",
    bg: COLORS.black,
    render: () => (
      <>
        {[
          { l: "8%", h: "24%", c: COLORS.electricCyan },
          { l: "31%", h: "42%", c: COLORS.red },
          { l: "54%", h: "60%", c: COLORS.gold },
          { l: "77%", h: "78%", c: COLORS.pureWhite },
        ].map((s, i) => (
          <Box
            key={i}
            position="absolute"
            bottom="0"
            left={s.l}
            w="21%"
            h={s.h}
            bg={s.c}
          />
        ))}
      </>
    ),
  },
  {
    id: "frame",
    title: "内框空间",
    code: "FRAME",
    bg: COLORS.gold,
    render: () => (
      <>
        {/* 黑色内框 */}
        <Box
          position="absolute"
          top="12%"
          left="14%"
          right="12%"
          bottom="14%"
          border={`${BORDER.heavy} ${COLORS.black}`}
        />
        {/* 红色主体块 */}
        <Box
          position="absolute"
          top="30%"
          left="30%"
          w="32%"
          h="26%"
          bg={COLORS.red}
        />
        {/* 黑色小块 */}
        <Box
          position="absolute"
          top="62%"
          left="48%"
          w="15%"
          h="15%"
          bg={COLORS.black}
        />
        {/* 电青色角块 — 压住内框右上角 */}
        <Box
          position="absolute"
          top="12%"
          right="12%"
          w="18%"
          h="14%"
          bg={COLORS.electricCyan}
        />
      </>
    ),
  },
  {
    id: "signal",
    title: "信号轨道",
    code: "SIGNAL",
    bg: COLORS.pureWhite,
    render: () => (
      <>
        {/* 三条黑色信号轨 */}
        <Box position="absolute" top="26%" left="8%" w="84%" h="8%" bg={COLORS.black} />
        <Box position="absolute" top="46%" left="8%" w="58%" h="8%" bg={COLORS.black} />
        <Box position="absolute" top="66%" left="8%" w="72%" h="8%" bg={COLORS.black} />
        {/* 红色中断块 */}
        <Box
          position="absolute"
          top="42%"
          right="10%"
          w="22%"
          h="24%"
          bg={COLORS.red}
        />
        {/* 金色起点块 */}
        <Box position="absolute" top="8%" left="8%" w="10%" h="10%" bg={COLORS.gold} />
        {/* 电青色收尾条 */}
        <Box
          position="absolute"
          bottom="6%"
          right="8%"
          w="16%"
          h="5%"
          bg={COLORS.electricCyan}
        />
      </>
    ),
  },
];

/** 作品构成 — 缩略图与灯箱共用同一渲染 */
function Composition({ art }: { art: Artwork }) {
  return (
    <Box position="absolute" inset={0} overflow="hidden" bg={art.bg}>
      {art.render()}
    </Box>
  );
}

/** 方形导航按钮 — 黑底红箭头，硬阴影 */
function NavButton({
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
      top="44%"
      mt="-17px"
      left={side === "left" ? "10px" : undefined}
      right={side === "right" ? "10px" : undefined}
      zIndex={Z_INDEX.modal + 1}
    >
      <Flex
        as="button"
        aria-label={label}
        onClick={onClick}
        w="34px"
        h="34px"
        align="center"
        justify="center"
        bg={COLORS.black}
        border={`${BORDER.standard} ${COLORS.black}`}
        borderRadius="0"
        boxShadow={SHADOW.red}
        cursor="pointer"
        transition={`box-shadow ${DURATION.fast}s ease, transform ${DURATION.instant}s ease`}
        _hover={{ boxShadow: `6px 6px 0px ${COLORS.red}` }}
        _active={{
          transform: "translate(2px, 2px)",
          boxShadow: `2px 2px 0px ${COLORS.red}`,
        }}
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="18px"
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

export default function SceneLightbox() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = () => setOpenIdx(null);
  const step = (dir: 1 | -1) =>
    setOpenIdx((i) =>
      i === null ? i : (i + dir + ARTWORKS.length) % ARTWORKS.length
    );

  /* 灯箱键盘操作 — Esc 关闭，左右切换 */
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenIdx(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx]);

  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete}>
      <Flex h="100%" direction="column">
        {/* 状态条 */}
        <Flex
          h="26px"
          flexShrink={0}
          bg={COLORS.black}
          borderBottom={`3px solid ${COLORS.red}`}
          px="10px"
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap="8px">
            <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={COLORS.pureWhite}
              lineHeight={1}
            >
              构成画廊 // Gallery
            </Text>
          </Flex>
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.08em"
            color={COLORS.metalWhite}
            opacity={0.65}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            08 WORKS · 点击开启灯箱
          </Text>
        </Flex>

        {/* 休止态 — 缩略图网格 2×4 */}
        <Box flex={1} minH={0} pt="8px" px="10px" pb="10px">
          <Grid
            h="100%"
            gap="8px"
            templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }}
            templateRows={{ base: "repeat(4, 1fr)", sm: "repeat(2, 1fr)" }}
          >
            {ARTWORKS.map((art, i) => (
              <Box
                key={art.id}
                as="button"
                aria-label={`打开作品：${art.title}`}
                onClick={() => setOpenIdx(i)}
                p={0}
                display="flex"
                flexDirection="column"
                textAlign="left"
                minH={0}
                minW={0}
                bg={COLORS.pureWhite}
                border={`${BORDER.heavy} ${COLORS.black}`}
                borderRadius="0"
                boxShadow={SHADOW.small}
                cursor="pointer"
                transition={`transform ${DURATION.fast}s ease, box-shadow ${DURATION.fast}s ease, border-color ${DURATION.fast}s ease`}
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: SHADOW.red,
                  borderColor: COLORS.red,
                }}
                _active={{ transform: "translateY(-1px)" }}
                _focusVisible={{
                  outline: `2px solid ${COLORS.red}`,
                  outlineOffset: "2px",
                }}
              >
                <Box flex={1} minH={0} position="relative" overflow="hidden">
                  <Composition art={art} />
                </Box>
                <Flex
                  h="18px"
                  flexShrink={0}
                  bg={COLORS.black}
                  align="center"
                  justify="space-between"
                  px="6px"
                  gap="4px"
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="8px"
                    letterSpacing="0.06em"
                    color={COLORS.metalWhite}
                    isTruncated
                  >
                    {pad(i + 1)} {art.title}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="7px"
                    letterSpacing="0.08em"
                    color={COLORS.gold}
                    display={{ base: "none", sm: "block" }}
                  >
                    {art.code}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </Flex>

      {/* 灯箱浮层 — fade + scale 过渡 */}
      <AnimatePresence>
        {openIdx !== null && (
          <M.Box
            key="lightbox"
            position="absolute"
            inset={0}
            zIndex={Z_INDEX.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 暗色背幕 — 点击关闭 */}
            <Box
              position="absolute"
              inset={0}
              bg={`${COLORS.black}d9`}
              onClick={close}
            />

            {/* 中央灯箱面板 */}
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              pb="46px"
              pointerEvents="none"
            >
              <M.Flex
                role="dialog"
                aria-modal="true"
                aria-label={`作品预览：${ARTWORKS[openIdx].title}`}
                pointerEvents="auto"
                direction="column"
                w={{ base: "84%", md: "62%" }}
                maxW="90%"
                maxH="80%"
                bg={COLORS.pureWhite}
                border={`${BORDER.heavy} ${COLORS.black}`}
                boxShadow={SHADOW.large}
                overflow="hidden"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
              >
                <Box
                  position="relative"
                  overflow="hidden"
                  h={{ base: "132px", md: "188px" }}
                >
                  <Composition art={ARTWORKS[openIdx]} />
                  {/* 图版编号角标 */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    bg={COLORS.gold}
                    px="6px"
                    py="2px"
                  >
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.black}
                      fontSize="8px"
                      letterSpacing="0.1em"
                      color={COLORS.black}
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      PLATE {pad(openIdx + 1)}
                    </Text>
                  </Box>
                </Box>
                {/* 说明条 — 标题 + 索引 */}
                <Flex
                  h="30px"
                  flexShrink={0}
                  bg={COLORS.black}
                  borderTop={`3px solid ${COLORS.red}`}
                  align="center"
                  justify="space-between"
                  px="10px"
                  gap="8px"
                >
                  <Flex align="center" gap="8px" minW={0}>
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.black}
                      fontSize="10px"
                      color={COLORS.gold}
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {pad(openIdx + 1)}
                    </Text>
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.04em"
                      color={COLORS.pureWhite}
                      isTruncated
                    >
                      {ARTWORKS[openIdx].title}
                    </Text>
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="8px"
                      letterSpacing="0.08em"
                      color={COLORS.metalWhite}
                      opacity={0.6}
                      display={{ base: "none", sm: "block" }}
                    >
                      {ARTWORKS[openIdx].code}
                    </Text>
                  </Flex>
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="10px"
                    color={COLORS.pureWhite}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {pad(openIdx + 1)} / {pad(ARTWORKS.length)}
                  </Text>
                </Flex>
              </M.Flex>
            </Flex>

            {/* 前后导航 */}
            <NavButton
              glyph="←"
              label="上一件作品"
              side="left"
              onClick={() => step(-1)}
            />
            <NavButton
              glyph="→"
              label="下一件作品"
              side="right"
              onClick={() => step(1)}
            />

            {/* 关闭按钮 */}
            <Flex
              as="button"
              aria-label="关闭灯箱"
              onClick={close}
              position="absolute"
              top="10px"
              right="10px"
              zIndex={Z_INDEX.modal + 1}
              w="30px"
              h="30px"
              align="center"
              justify="center"
              bg={COLORS.black}
              border={`${BORDER.standard} ${COLORS.black}`}
              borderRadius="0"
              boxShadow={SHADOW.red}
              cursor="pointer"
              transition={`box-shadow ${DURATION.fast}s ease, transform ${DURATION.instant}s ease`}
              _hover={{ boxShadow: `6px 6px 0px ${COLORS.red}` }}
              _active={{
                transform: "translate(2px, 2px)",
                boxShadow: `2px 2px 0px ${COLORS.red}`,
              }}
            >
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="15px"
                lineHeight={1}
                color={COLORS.redLight}
                userSelect="none"
              >
                ✕
              </Text>
            </Flex>

            {/* 底部缩略图带 — 横向滚动，激活项带红色标记 */}
            <Flex
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              zIndex={Z_INDEX.modal + 1}
              align="center"
              gap="6px"
              px="10px"
              pt="6px"
              pb="8px"
              overflowX="auto"
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {ARTWORKS.map((a, i) => (
                <Box
                  key={a.id}
                  as="button"
                  aria-label={`切换到作品：${a.title}`}
                  onClick={() => setOpenIdx(i)}
                  p={0}
                  flexShrink={0}
                  w="46px"
                  h="30px"
                  position="relative"
                  overflow="hidden"
                  bg={COLORS.pureWhite}
                  borderRadius="0"
                  cursor="pointer"
                  opacity={i === openIdx ? 1 : 0.6}
                  transition={`opacity ${DURATION.fast}s ease, border-color ${DURATION.fast}s ease`}
                  _hover={{ opacity: 1 }}
                  border={
                    i === openIdx
                      ? `2px solid ${COLORS.red}`
                      : `2px solid ${COLORS.metalWhite}59`
                  }
                >
                  <Composition art={a} />
                  {i === openIdx && (
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      w="100%"
                      h="3px"
                      bg={COLORS.red}
                    />
                  )}
                </Box>
              ))}
            </Flex>
          </M.Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
