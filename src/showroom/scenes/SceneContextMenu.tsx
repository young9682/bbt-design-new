import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = { Box: motion(Box) };

/* === 菜单数据 === */

interface MenuAction {
  kind: "action";
  id: string;
  label: string;
  hint?: string;
  danger?: boolean;
  sub?: boolean;
}
type MenuEntry = MenuAction | { kind: "divider" };

const MENU_ENTRIES: MenuEntry[] = [
  { kind: "action", id: "open", label: "打开", hint: "⌘O" },
  { kind: "action", id: "rename", label: "重命名", hint: "F2" },
  { kind: "action", id: "copy", label: "复制链接", hint: "⌘L" },
  { kind: "action", id: "pin", label: "固定", hint: "⌘D" },
  { kind: "action", id: "export", label: "导出为", sub: true },
  { kind: "divider" },
  { kind: "action", id: "delete", label: "删除", hint: "⌫", danger: true },
];

const ACTIONS: MenuAction[] = MENU_ENTRIES.filter(
  (e): e is MenuAction => e.kind === "action"
);

const EXPORTS = [
  { id: "png", label: "PNG", ext: ".png", color: COLORS.gold },
  { id: "pdf", label: "PDF", ext: ".pdf", color: COLORS.red },
  { id: "csv", label: "CSV", ext: ".csv", color: COLORS.electricCyan },
];

/* === 画布上的文件块 === */

const BLOCKS = [
  { id: "blk-1", label: "蓝图-04.PDF", code: "DOC", color: COLORS.gold, left: "7%", top: "30%", rot: "-2deg", w: "132px" },
  { id: "blk-2", label: "数据表.CSV", code: "DAT", color: COLORS.electricCyan, left: "37%", top: "56%", rot: "1.6deg", w: "128px" },
  { id: "blk-3", label: "图版-07.PNG", code: "IMG", color: COLORS.militaryGreen, left: "64%", top: "24%", rot: "2.2deg", w: "124px" },
  { id: "blk-4", label: "备忘-引擎.MD", code: "TXT", color: COLORS.velocityOrange, left: "66%", top: "62%", rot: "-1.2deg", w: "128px", narrowHidden: true },
];

interface MenuState {
  x: number;
  y: number;
  target: string | null;
}

const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export default function SceneContextMenu() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const subRowRef = useRef<HTMLDivElement | null>(null);

  const [menu, setMenu] = useState<MenuState | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, flipX: false, flipY: false });
  const [menuSize, setMenuSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(-1);
  const [subOpen, setSubOpen] = useState(false);
  const [subActive, setSubActive] = useState(-1);
  const [subPos, setSubPos] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<string | null>(null);

  const closeMenu = () => {
    setMenu(null);
    setActive(-1);
    setSubOpen(false);
    setSubActive(-1);
  };

  const runAction = (label: string) => {
    closeMenu();
    setToast(label);
  };

  const openSub = (selectFirst: boolean) => {
    setSubActive(selectFirst ? 0 : -1);
    setSubOpen(true);
    setSubPos({ x: pos.x + menuSize.w + 4, y: pos.y + 128 });
  };

  const openAt = (e: React.MouseEvent, target: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMenu({ x, y, target });
    setPos({ x, y, flipX: false, flipY: false });
    setActive(-1);
    setSubOpen(false);
    setSubActive(-1);
  };

  /* 菜单测量 + 边缘钳制（翻转） */
  useLayoutEffect(() => {
    if (!menu || !menuRef.current || !canvasRef.current) return;
    const c = canvasRef.current.getBoundingClientRect();
    const w = menuRef.current.offsetWidth;
    const h = menuRef.current.offsetHeight;
    const x = Math.min(Math.max(menu.x, 4), Math.max(c.width - w - 4, 4));
    const y = Math.min(Math.max(menu.y, 4), Math.max(c.height - h - 4, 4));
    setPos({ x, y, flipX: x < menu.x - 0.5, flipY: y < menu.y - 0.5 });
    setMenuSize({ w, h });
  }, [menu]);

  /* 子菜单测量 + 边缘钳制（左右/上下翻转） */
  useLayoutEffect(() => {
    if (!menu || !subOpen || !subRef.current || !subRowRef.current || !canvasRef.current) return;
    const c = canvasRef.current.getBoundingClientRect();
    const w = subRef.current.offsetWidth;
    const h = subRef.current.offsetHeight;
    const rowTop = subRowRef.current.getBoundingClientRect().top - c.top;
    const rightX = pos.x + menuSize.w + 4;
    const x = rightX + w <= c.width - 4 ? rightX : Math.max(4, pos.x - w - 4);
    const y = Math.min(Math.max(rowTop - 3, 4), Math.max(c.height - h - 4, 4));
    setSubPos({ x, y });
  }, [menu, subOpen, pos, menuSize]);

  /* 点击外部 / 键盘导航 */
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || subRef.current?.contains(t)) return;
      closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        if (subOpen) {
          setSubActive((s) => (s + dir + EXPORTS.length) % EXPORTS.length);
        } else {
          setActive((a) => (a + dir + ACTIONS.length) % ACTIONS.length);
        }
        return;
      }
      if (e.key === "ArrowRight" && !subOpen && ACTIONS[active]?.sub) {
        e.preventDefault();
        openSub(true);
        return;
      }
      if (e.key === "ArrowLeft" && subOpen) {
        e.preventDefault();
        setSubOpen(false);
        setSubActive(-1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (subOpen && subActive >= 0) {
          runAction(`导出 ${EXPORTS[subActive].label}`);
          return;
        }
        const item = ACTIONS[active];
        if (!item) return;
        if (item.sub) {
          openSub(true);
          return;
        }
        runAction(item.label);
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, active, subOpen, subActive, pos, menuSize]);

  /* 提示条自动隐藏 */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const hoverRow = (i: number) => {
    setActive(i);
    const item = ACTIONS[i];
    if (item?.sub) {
      if (!subOpen) openSub(false);
    } else {
      setSubOpen(false);
      setSubActive(-1);
    }
  };

  /* 渲染菜单行 */
  const rows: React.ReactNode[] = [];
  let ai = 0;
  for (const entry of MENU_ENTRIES) {
    if (entry.kind === "divider") {
      rows.push(
        <Box key="ctx-divider" h="0" mx="7px" my="3px" borderTop={`1px solid ${COLORS.black}38`} />
      );
      continue;
    }
    const i = ai;
    ai += 1;
    const isSel = active === i;
    rows.push(
      <Flex
        key={entry.id}
        role="menuitem"
        aria-disabled={false}
        align="center"
        justify="space-between"
        gap="18px"
        px="10px"
        h="26px"
        cursor="pointer"
        bg={isSel ? COLORS.red : "transparent"}
        onMouseEnter={() => hoverRow(i)}
        onClick={() => (entry.sub ? openSub(false) : runAction(entry.label))}
        ref={entry.sub ? subRowRef : undefined}
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="11px"
          letterSpacing="0.04em"
          lineHeight={1}
          isTruncated
          flex={1}
          minW="0"
          color={isSel ? COLORS.pureWhite : entry.danger ? COLORS.red : COLORS.black}
        >
          {entry.label}
        </Text>
        {entry.sub ? (
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize="8px"
            lineHeight={1}
            color={isSel ? COLORS.pureWhite : COLORS.industrialBlack}
            opacity={isSel ? 1 : 0.7}
            flexShrink={0}
          >
            ▸
          </Text>
        ) : entry.hint ? (
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="8px"
            letterSpacing="0.08em"
            lineHeight={1}
            flexShrink={0}
            color={isSel ? COLORS.pureWhite : COLORS.industrialBlack}
            opacity={isSel ? 0.85 : 0.5}
          >
            {entry.hint}
          </Text>
        ) : null}
      </Flex>
    );
  }

  return (
    <Box
      ref={canvasRef}
      h="100%"
      position="relative"
      overflow="hidden"
      bg={COLORS.concrete}
      userSelect="none"
      onContextMenu={(e) => openAt(e, null)}
      sx={{
        backgroundImage: `linear-gradient(${COLORS.black}0b 1px, transparent 1px), linear-gradient(90deg, ${COLORS.black}0b 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    >
      {/* 几何装饰 — 对角速度线 + 角标 */}
      <Box
        position="absolute"
        top="18%"
        left="44%"
        w="170px"
        h="2px"
        bg={COLORS.electricCyan}
        opacity={0.3}
        transform="rotate(-24deg)"
        transformOrigin="left center"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom={0}
        right={0}
        w="56px"
        h="56px"
        bg={COLORS.red}
        clipPath="polygon(100% 0, 100% 100%, 0 100%)"
        opacity={0.07}
        pointerEvents="none"
      />

      {/* 指令条 */}
      <Box
        position="absolute"
        top="10px"
        left="50%"
        sx={{ transform: "translateX(-50%)" }}
        zIndex={Z_INDEX.content}
        pointerEvents="none"
      >
        <Flex bg={COLORS.black} px="10px" py="5px" gap="8px" align="center" boxShadow={SHADOW.small}>
          <M.Box
            w="5px"
            h="5px"
            bg={COLORS.red}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
          />
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="9px"
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
            lineHeight={1}
            whiteSpace="nowrap"
          >
            在画布上右键 // RIGHT-CLICK THE CANVAS
          </Text>
        </Flex>
      </Box>

      {/* 文件块 — 可拖拽观感 */}
      {BLOCKS.map((b) => {
        const isTarget = menu?.target === b.label;
        return (
          <Box
            key={b.id}
            position="absolute"
            left={b.left}
            top={b.top}
            w={b.w}
            bg={COLORS.pureWhite}
            border={`${isTarget ? BORDER.heavy : BORDER.standard} ${isTarget ? COLORS.red : COLORS.black}`}
            boxShadow={isTarget ? SHADOW.red : SHADOW.medium}
            transform={`rotate(${b.rot})`}
            p="8px"
            cursor="grab"
            display={b.narrowHidden ? { base: "none", sm: "block" } : undefined}
            transition={`box-shadow ${DURATION.fast}s ease`}
            _hover={{ boxShadow: SHADOW.large }}
            onContextMenu={(e) => openAt(e, b.label)}
          >
            <Flex align="center" justify="space-between" mb="6px">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="8px"
                letterSpacing="0.1em"
                color={b.color}
                lineHeight={1}
              >
                {b.code}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                color={COLORS.industrialBlack}
                opacity={0.4}
                lineHeight={1}
              >
                ⠿
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="11px"
              color={COLORS.black}
              lineHeight={1.2}
              isTruncated
            >
              {b.label}
            </Text>
            <Flex gap="3px" mt="7px">
              <Box w="5px" h="5px" bg={b.color} opacity={0.85} />
              <Box w="5px" h="5px" bg={COLORS.black} opacity={0.15} />
              <Box w="5px" h="5px" bg={COLORS.black} opacity={0.15} />
            </Flex>
          </Box>
        );
      })}

      {/* 上下文菜单 */}
      <AnimatePresence>
        {menu && (
          <M.Box
            key="ctx-menu"
            ref={menuRef}
            role="menu"
            aria-label="上下文菜单"
            position="absolute"
            left={`${pos.x}px`}
            top={`${pos.y}px`}
            minW="184px"
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.large}
            zIndex={Z_INDEX.modal}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
            transition={{ duration: DURATION.fast, ease: EASING.launch }}
            style={{
              transformOrigin: `${pos.flipX ? "right" : "left"} ${pos.flipY ? "bottom" : "top"}`,
            }}
            onContextMenu={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* 头部 — 上下文对象 */}
            <Flex
              h="22px"
              align="center"
              gap="7px"
              px="9px"
              bg={COLORS.black}
              borderBottom={`${BORDER.hairline} ${COLORS.industrialBlack}`}
            >
              <Box w="4px" h="4px" bg={COLORS.red} flexShrink={0} />
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.1em"
                color={COLORS.metalWhite}
                isTruncated
                flex={1}
                minW="0"
              >
                {menu.target ? `对象 // ${menu.target}` : "画布 // CANVAS"}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="7px"
                letterSpacing="0.1em"
                color={COLORS.metalWhite}
                opacity={0.45}
                lineHeight={1}
                flexShrink={0}
              >
                ESC
              </Text>
            </Flex>

            {/* 菜单项 */}
            <Box py="3px">{rows}</Box>
          </M.Box>
        )}
      </AnimatePresence>

      {/* 导出子菜单 */}
      <AnimatePresence>
        {menu && subOpen && (
          <M.Box
            key="ctx-submenu"
            ref={subRef}
            role="menu"
            aria-label="导出格式"
            position="absolute"
            left={`${subPos.x}px`}
            top={`${subPos.y}px`}
            minW="120px"
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.large}
            zIndex={Z_INDEX.modal + 1}
            py="3px"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={{ duration: DURATION.instant, ease: EASING.launch }}
            onContextMenu={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {EXPORTS.map((ex, i) => {
              const isSel = subActive === i;
              return (
                <Flex
                  key={ex.id}
                  role="menuitem"
                  align="center"
                  gap="8px"
                  px="10px"
                  h="24px"
                  cursor="pointer"
                  bg={isSel ? COLORS.red : "transparent"}
                  onMouseEnter={() => setSubActive(i)}
                  onClick={() => runAction(`导出 ${ex.label}`)}
                >
                  <Box
                    w="6px"
                    h="6px"
                    bg={ex.color}
                    opacity={isSel ? 1 : 0.75}
                    flexShrink={0}
                  />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="10px"
                    letterSpacing="0.06em"
                    lineHeight={1}
                    color={isSel ? COLORS.pureWhite : COLORS.black}
                    flex={1}
                  >
                    {ex.label}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    letterSpacing="0.06em"
                    lineHeight={1}
                    color={isSel ? COLORS.pureWhite : COLORS.industrialBlack}
                    opacity={isSel ? 0.85 : 0.5}
                    flexShrink={0}
                  >
                    {ex.ext}
                  </Text>
                </Flex>
              );
            })}
          </M.Box>
        )}
      </AnimatePresence>

      {/* 执行提示条 */}
      <AnimatePresence>
        {toast && (
          <M.Box
            key="ctx-toast"
            position="absolute"
            bottom="10px"
            left="50%"
            sx={{ transform: "translateX(-50%)" }}
            zIndex={Z_INDEX.alert}
            pointerEvents="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.launch }}
          >
            <Flex
              bg={COLORS.black}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.medium}
              px="12px"
              py="6px"
              align="center"
              gap="8px"
            >
              <Box w="5px" h="5px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                color={COLORS.pureWhite}
                lineHeight={1}
                whiteSpace="nowrap"
              >
                已执行: {toast} // OK
              </Text>
            </Flex>
          </M.Box>
        )}
      </AnimatePresence>

      {/* 坐标读数 */}
      <Flex
        position="absolute"
        bottom="8px"
        left="10px"
        gap="7px"
        align="center"
        pointerEvents="none"
      >
        <Box
          w="4px"
          h="4px"
          bg={menu ? COLORS.signalGreen : COLORS.industrialBlack}
          opacity={menu ? 1 : 0.4}
        />
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.industrialBlack}
          opacity={0.65}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {menu
            ? `X:${pad4(menu.x)} Y:${pad4(menu.y)} // 坐标`
            : "待命 // STANDBY"}
        </Text>
      </Flex>
      <Text
        position="absolute"
        bottom="8px"
        right="10px"
        fontFamily={FONT.mono}
        fontSize="8px"
        letterSpacing="0.1em"
        color={COLORS.industrialBlack}
        opacity={0.4}
        pointerEvents="none"
      >
        CTX // 06-06
      </Text>
    </Box>
  );
}
