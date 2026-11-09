import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, animate, type AnimationPlaybackControls } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box) };

const INITIAL_POS = 62;

/* =========================================
 * 优化前 — 灰色混凝土构成（底层，稀疏）
 * ========================================= */
function BeforeComposition() {
  return (
    <Box position="absolute" inset={0} bg={COLORS.concrete} overflow="hidden">
      {/* 大块灰色板材 — 未完成的底色 */}
      <Box
        position="absolute"
        top="16%"
        left="7%"
        w="44%"
        h="36%"
        bg={COLORS.industrialBlack}
        opacity={0.1}
      />
      {/* 轮廓框 — 空置的规划区块 */}
      <Box
        position="absolute"
        top="30%"
        right="12%"
        w="26%"
        h="20%"
        border={`1px solid ${COLORS.black}47`}
      />
      {/* 垂直灰条 — 贫瘠的秩序 */}
      <Box
        position="absolute"
        top="10%"
        left="63%"
        w="7%"
        h="54%"
        bg={`${COLORS.black}14`}
      />
      {/* 细灰对角线 — 唯一的动势 */}
      <Box
        position="absolute"
        top="58%"
        left="-10%"
        w="120%"
        h="2px"
        bg={COLORS.black}
        opacity={0.2}
        css={{ transform: "rotate(-6deg)" }}
      />
      {/* 底部斜纹施工带 */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="16%"
        backgroundImage={`repeating-linear-gradient(45deg, ${COLORS.black}12 0px, ${COLORS.black}12 6px, transparent 6px, transparent 12px)`}
      />
      {/* 黑色小方块 — 锚点 */}
      <Box
        position="absolute"
        bottom="22%"
        left="10%"
        w="12px"
        h="12px"
        bg={COLORS.black}
        opacity={0.35}
      />
    </Box>
  );
}

/* =========================================
 * 优化后 — 红金青构成（上层，被滑块裁剪）
 * ========================================= */
function AfterComposition() {
  return (
    <Box position="absolute" inset={0} bg={COLORS.black} overflow="hidden">
      {/* 红色楔形 — 自左下刺入 */}
      <Box
        position="absolute"
        bottom={0}
        left="-4%"
        w="62%"
        h="72%"
        bg={COLORS.red}
        css={{ clipPath: "polygon(0 32%, 100% 0%, 100% 100%, 0% 100%)" }}
      />
      {/* 金色矩形 — 错位双版，印刷深度 */}
      <Box
        position="absolute"
        top="19%"
        left="16%"
        w="36%"
        h="30%"
        bg={COLORS.goldDark}
      />
      <Box
        position="absolute"
        top="14%"
        left="12%"
        w="36%"
        h="30%"
        bg={COLORS.gold}
      />
      {/* 电青色信号线 — 斜切画面 */}
      <Box
        position="absolute"
        top="20%"
        right="6%"
        w="40%"
        h="3px"
        bg={COLORS.electricCyan}
        opacity={0.8}
        css={{ transform: "rotate(-28deg)", transformOrigin: "right center" }}
      />
      <Box
        position="absolute"
        top="30%"
        right="10%"
        w="30%"
        h="2px"
        bg={COLORS.electricCyan}
        opacity={0.5}
        css={{ transform: "rotate(-28deg)", transformOrigin: "right center" }}
      />
      {/* 白色圆形 — 从平面进入空间 */}
      <Box
        position="absolute"
        top="34%"
        left="48%"
        w={{ base: "44px", md: "60px" }}
        h={{ base: "44px", md: "60px" }}
        borderRadius="50%"
        border={`${BORDER.heavy} ${COLORS.pureWhite}`}
        opacity={0.65}
      />
      {/* 信号绿旋转方框 — 轨道标记 */}
      <Box
        position="absolute"
        bottom="18%"
        right="14%"
        w={{ base: "32px", md: "44px" }}
        h={{ base: "32px", md: "44px" }}
        border={`${BORDER.standard} ${COLORS.signalGreen}`}
        opacity={0.5}
        css={{ transform: "rotate(45deg)" }}
      />
      {/* 白色小方块 — 节点 */}
      <Box
        position="absolute"
        top="12%"
        right="24%"
        w="10px"
        h="10px"
        bg={COLORS.pureWhite}
        opacity={0.8}
      />
    </Box>
  );
}

/* =========================================
 * 角标芯片 — BEFORE / AFTER
 * ========================================= */
function CornerChip({
  title,
  sub,
  bg,
  color,
  borderColor,
  top,
  left,
  right,
}: {
  title: string;
  sub: string;
  bg: string;
  color: string;
  borderColor: string;
  top: string;
  left?: string;
  right?: string;
}) {
  return (
    <Flex
      position="absolute"
      top={top}
      left={left}
      right={right}
      zIndex={4}
      align="center"
      gap="6px"
      px="8px"
      py="4px"
      bg={bg}
      border={`${BORDER.standard} ${borderColor}`}
      boxShadow={SHADOW.small}
      pointerEvents="none"
    >
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize={{ base: "9px", md: "10px" }}
        letterSpacing="0.1em"
        color={color}
        lineHeight={1}
      >
        {title}
      </Text>
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize={{ base: "9px", md: "10px" }}
        letterSpacing="0.06em"
        color={color}
        opacity={0.75}
        lineHeight={1}
      >
        {sub}
      </Text>
    </Flex>
  );
}

export default function SceneCompareSlider() {
  const [pos, setPos] = useState(INITIAL_POS);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(INITIAL_POS);
  const introRef = useRef<AnimationPlaybackControls | null>(null);

  const updateFromClientX = (clientX: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const next = Math.min(100, Math.max(0, raw));
    posRef.current = next;
    setPos(next);
  };

  const stopIntro = () => introRef.current?.stop();

  /* 入场仪式 — 分隔线自右向左扫入，揭示 AFTER */
  useEffect(() => {
    introRef.current = animate(92, INITIAL_POS, {
      duration: 1.4,
      ease: EASING.launch,
      onUpdate: (v) => {
        posRef.current = v;
        setPos(v);
      },
    });
    return () => introRef.current?.stop();
  }, []);

  /* 全局拖拽 — mousedown 起锚，window mousemove 跟踪，mouseup 清理 */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const onViewportMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    stopIntro();
    updateFromClientX(e.clientX);
    setDragging(true);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    stopIntro();
    const delta = e.key === "ArrowLeft" ? -2 : 2;
    const next = Math.min(100, Math.max(0, posRef.current + delta));
    posRef.current = next;
    setPos(next);
  };

  const rounded = Math.round(pos);

  return (
    <Flex h="100%" direction="column" gap="10px">
      {/* 对比视口 — BEFORE 底层 + AFTER 裁剪层 */}
      <M.Box
        ref={viewportRef as unknown as React.Ref<HTMLDivElement>}
        flex="1"
        minH="0"
        position="relative"
        overflow="hidden"
        bg={COLORS.concrete}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.large}
        borderRadius="0"
        cursor="ew-resize"
        userSelect="none"
        onMouseDown={onViewportMouseDown}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, ease: EASING.launch }}
      >
        {/* 底层：优化前 */}
        <BeforeComposition />

        {/* 上层：优化后 — 由滑块位置裁剪，右侧为 AFTER */}
        <Box
          position="absolute"
          inset={0}
          zIndex={1}
          css={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <AfterComposition />
        </Box>

        {/* 角标芯片 */}
        <CornerChip
          title="BEFORE"
          sub="/ 优化前"
          bg={COLORS.concrete}
          color={COLORS.black}
          borderColor={COLORS.black}
          top="10px"
          left="10px"
        />
        <CornerChip
          title="AFTER"
          sub="/ 优化后"
          bg={COLORS.red}
          color={COLORS.pureWhite}
          borderColor={COLORS.redDark}
          top="10px"
          right="10px"
        />

        {/* 红色分隔线 */}
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={`${pos}%`}
          w="3px"
          ml="-1px"
          bg={COLORS.red}
          zIndex={2}
          pointerEvents="none"
          boxShadow={`0 0 0 1px ${COLORS.pureWhite}40`}
        />

        {/* 方形拖拽手柄 — 红底白箭头，硬阴影 */}
        <Flex
          as="button"
          role="slider"
          aria-label="对比位置"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          tabIndex={0}
          position="absolute"
          top="50%"
          left={`${pos}%`}
          mt={{ base: "-16px", md: "-19px" }}
          ml={{ base: "-16px", md: "-19px" }}
          w={{ base: "32px", md: "38px" }}
          h={{ base: "32px", md: "38px" }}
          zIndex={3}
          align="center"
          justify="center"
          gap="2px"
          p={0}
          bg={COLORS.red}
          border={`${BORDER.standard} ${COLORS.redDark}`}
          borderRadius="0"
          boxShadow={dragging ? `2px 2px 0px ${COLORS.black}` : SHADOW.medium}
          cursor={dragging ? "grabbing" : "grab"}
          transition={`box-shadow ${DURATION.fast}s ease`}
          _focus={{ outline: `2px solid ${COLORS.gold}`, outlineOffset: "2px" }}
          onMouseDown={(e: React.MouseEvent) => {
            e.preventDefault();
            stopIntro();
            setDragging(true);
          }}
          onKeyDown={onHandleKeyDown}
        >
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "12px", md: "14px" }}
            lineHeight={1}
            color={COLORS.pureWhite}
            userSelect="none"
          >
            ←
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "12px", md: "14px" }}
            lineHeight={1}
            color={COLORS.pureWhite}
            userSelect="none"
          >
            →
          </Text>
        </Flex>
      </M.Box>

      {/* 仪器读出条 — 位置遥测 */}
      <Flex
        h="38px"
        flexShrink={0}
        bg={COLORS.black}
        border={`${BORDER.standard} ${COLORS.black}`}
        borderRadius="0"
        align="center"
        gap={{ base: "10px", md: "14px" }}
        px={{ base: "10px", md: "14px" }}
      >
        <Box w="8px" h="8px" bg={COLORS.red} flexShrink={0} />

        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize={{ base: "8px", md: "9px" }}
          letterSpacing="0.14em"
          textTransform="uppercase"
          color={dragging ? COLORS.gold : COLORS.metalWhite}
          opacity={dragging ? 1 : 0.55}
          flexShrink={0}
        >
          {dragging ? "拖动中 // DRAGGING" : "拖动 / 点击 // DRAG·CLICK"}
        </Text>

        {/* 位置轨道 */}
        <Box
          flex={1}
          h="8px"
          position="relative"
          bg={`${COLORS.pureWhite}1a`}
          border={`1px solid ${COLORS.pureWhite}24`}
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            width={`${pos}%`}
            bg={COLORS.red}
          />
          <Box
            position="absolute"
            top="-2px"
            bottom="-2px"
            left={`${pos}%`}
            w="2px"
            bg={COLORS.gold}
          />
        </Box>

        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize={{ base: "10px", md: "12px" }}
          letterSpacing="0.08em"
          color={COLORS.metalWhite}
          flexShrink={0}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          对比位置:{" "}
          <Text as="span" color={COLORS.redLight}>
            {rounded}%
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
}
