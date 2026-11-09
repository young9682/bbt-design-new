import { Box, Flex, Grid, Text, Button, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = {
  Box: motion(Box),
  Flex: motion(Flex),
};

/* === 命令数据 === */

interface Command {
  id: string;
  label: string;
  group: GroupKey;
  glyph: string;
  hint: string;
  kw: string[];
}

type GroupKey = "nav" | "act" | "cfg";

const GROUPS: { key: GroupKey; label: string; code: string; color: string }[] = [
  { key: "nav", label: "导航", code: "NAV", color: COLORS.red },
  { key: "act", label: "操作", code: "ACT", color: COLORS.gold },
  { key: "cfg", label: "设置", code: "CFG", color: COLORS.electricCyan },
];

const COMMANDS: Command[] = [
  { id: "nav-dashboard", label: "前往仪表板", group: "nav", glyph: "▸", hint: "G D", kw: ["dashboard", "goto"] },
  { id: "nav-tasks", label: "前往任务列表", group: "nav", glyph: "▸", hint: "G T", kw: ["tasks", "goto"] },
  { id: "nav-data", label: "前往数据中心", group: "nav", glyph: "▸", hint: "G P", kw: ["data", "goto"] },
  { id: "act-new", label: "新建任务", group: "act", glyph: "＋", hint: "N", kw: ["new", "create"] },
  { id: "act-export", label: "导出数据", group: "act", glyph: "↧", hint: "⇧ E", kw: ["export"] },
  { id: "act-archive", label: "归档已完成项", group: "act", glyph: "▣", hint: "⇧ A", kw: ["archive"] },
  { id: "cfg-theme", label: "切换主题", group: "cfg", glyph: "◐", hint: "⌘ T", kw: ["theme"] },
  { id: "cfg-settings", label: "打开设置", group: "cfg", glyph: "⚙", hint: "⌘ ,", kw: ["settings"] },
  { id: "cfg-shortcuts", label: "键盘快捷键", group: "cfg", glyph: "?", hint: "⌘ /", kw: ["shortcuts", "help"] },
];

const FILES = [
  { idx: "01", name: "季度运营报告", status: COLORS.signalGreen },
  { idx: "02", name: "权限变更评估", status: COLORS.statusAmber },
  { idx: "03", name: "零件清单 v2", status: COLORS.industrialBlack },
];

/** 键盘提示徽章 */
function KbdBadge({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <Box
      border={`1px solid ${dark ? `${COLORS.pureWhite}40` : COLORS.industrialBlack}`}
      bg={dark ? "transparent" : COLORS.pureWhite}
      px="4px"
      py="1px"
      flexShrink={0}
    >
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="8px"
        lineHeight={1}
        letterSpacing="0.08em"
        color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
        textTransform="uppercase"
      >
        {children}
      </Text>
    </Box>
  );
}

export default function SceneCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [lastCmd, setLastCmd] = useState<string | null>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.kw.some((k) => k.includes(q))
    );
  }, [query]);

  const visibleCountRef = useRef(visible.length);
  visibleCountRef.current = visible.length;

  const selIdx = Math.min(selected, Math.max(visible.length - 1, 0));

  const openPalette = () => {
    setQuery("");
    setSelected(0);
    setOpen(true);
  };

  const execute = (label: string) => {
    setLastCmd(label);
    setOpen(false);
  };

  /* 全局 ⌘K / Ctrl+K 呼出 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* 面板内键盘导航 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s + 1) % Math.max(visibleCountRef.current, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected(
          (s) => (s - 1 + Math.max(visibleCountRef.current, 1)) % Math.max(visibleCountRef.current, 1)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visibleCountRef.current > 0) execute(visible[selIdx]?.label ?? "");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, selIdx, visible]);

  /* 选中项保持可见 */
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selIdx]);

  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete}>
      {/* === 休止态：工作台背景 === */}
      <Box bg={COLORS.black} position="relative">
        {/* 顶部扫描线 */}
        <Box
          h="2px"
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
          opacity={0.4}
        />
        <Flex px="12px" h="30px" align="center" justify="space-between">
          <Flex align="center" gap="8px">
            <Box w="5px" h="5px" bg={COLORS.red} flexShrink={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.08em"
              color={COLORS.pureWhite}
              textTransform="uppercase"
              lineHeight={1}
            >
              工作台 Workspace
            </Text>
          </Flex>
          <Flex align="center" gap="8px">
            <Flex align="center" gap="5px" display={{ base: "none", md: "flex" }}>
              <Box w="4px" h="4px" bg={COLORS.signalGreen} />
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.metalWhite}
                opacity={0.5}
                letterSpacing="0.12em"
                textTransform="uppercase"
                lineHeight={1}
              >
                SYS.OK
              </Text>
            </Flex>
            <Box
              as="button"
              aria-label="打开命令面板"
              onClick={openPalette}
              bg={COLORS.industrialBlack}
              border={`1px solid ${COLORS.pureWhite}33`}
              px="6px"
              py="3px"
              cursor="pointer"
              _hover={{ bg: COLORS.red, borderColor: COLORS.red }}
              transition={`background ${DURATION.fast}s ease`}
            >
              <Text fontFamily={FONT.mono} fontWeight={WEIGHT.bold} fontSize="9px" color={COLORS.metalWhite} lineHeight={1}>
                ⌘K
              </Text>
            </Box>
          </Flex>
        </Flex>
        {/* 底部仪器线 */}
        <Flex h="2px">
          <Box flex={3} bg={COLORS.red} />
          <Box flex={7} bg={`${COLORS.pureWhite}0a`} />
        </Flex>
      </Box>

      {/* 内容区 */}
      <Flex direction="column" h="calc(100% - 34px)" p={SPACE.sm} gap={SPACE.sm}>
        {/* 元信息行 + 几何点缀 */}
        <Flex align="center" justify="space-between" px="2px">
          <Flex align="center" gap="8px">
            <Box w="24px" h="3px" bg={COLORS.gold} />
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              color={COLORS.industrialBlack}
              opacity={0.7}
              letterSpacing="0.14em"
              textTransform="uppercase"
              lineHeight={1}
            >
              OPS-07 // 仪表盘
            </Text>
          </Flex>
          <Box w="8px" h="8px" bg={COLORS.gold} transform="rotate(45deg)" boxShadow={SHADOW.gold} />
        </Flex>

        {/* 内容卡片 */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={SPACE.sm}>
          {/* 卡片：任务进度 */}
          <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.medium} p="10px">
            <Flex align="center" gap="6px" mb="8px">
              <Box w="6px" h="6px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                color={COLORS.industrialBlack}
                letterSpacing="0.12em"
                textTransform="uppercase"
                lineHeight={1}
              >
                任务进度 // OPS
              </Text>
            </Flex>
            <Flex align="flex-end" justify="space-between" mb="6px">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="22px"
                color={COLORS.black}
                lineHeight={1}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                68.4%
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                color={COLORS.signalGreen}
                lineHeight={1}
              >
                ▲ 2.1
              </Text>
            </Flex>
            <Box h="10px" border={`2px solid ${COLORS.black}`} bg={COLORS.concrete} position="relative">
              <Box position="absolute" top={0} left={0} bottom={0} width="68%" bg={COLORS.red} />
            </Box>
          </Box>

          {/* 卡片：最近文件 */}
          <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.medium} p="10px">
            <Flex align="center" gap="6px" mb="8px">
              <Box w="6px" h="6px" bg={COLORS.gold} />
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                color={COLORS.industrialBlack}
                letterSpacing="0.12em"
                textTransform="uppercase"
                lineHeight={1}
              >
                最近文件 // FILES
              </Text>
            </Flex>
            {FILES.map((f, i) => (
              <Flex
                key={f.idx}
                align="center"
                gap="8px"
                py="4px"
                borderBottom={i < FILES.length - 1 ? `${BORDER.hairline} ${COLORS.metalWhite}` : "none"}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="8px"
                  color={COLORS.industrialBlack}
                  opacity={0.6}
                  lineHeight={1}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {f.idx}
                </Text>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="10px"
                  color={COLORS.black}
                  lineHeight={1}
                  flex={1}
                  isTruncated
                >
                  {f.name}
                </Text>
                <Box w="6px" h="6px" bg={f.status} flexShrink={0} />
              </Flex>
            ))}
          </Box>
        </Grid>

        {/* 触发区 */}
        <Flex direction="column" align="center" justify="center" flex={1} gap="10px">
          <Button
            borderRadius={0}
            bg={COLORS.black}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.red}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="12px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            px={SPACE.md}
            py="12px"
            h="auto"
            lineHeight={1}
            _hover={{
              bg: COLORS.industrialBlack,
              transform: "translateY(-2px)",
              boxShadow: SHADOW.red,
            }}
            _active={{
              transform: "translateY(0px)",
              boxShadow: SHADOW.red,
            }}
            onClick={openPalette}
          >
            <Flex align="center" gap="10px">
              <Flex
                bg={COLORS.red}
                border={`1px solid ${COLORS.redDark}`}
                px="6px"
                py="3px"
                align="center"
                justify="center"
              >
                <Text fontFamily={FONT.mono} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite} lineHeight={1}>
                  ⌘K
                </Text>
              </Flex>
              <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" letterSpacing="0.08em" textTransform="uppercase" lineHeight={1}>
                命令面板
              </Text>
              <Text fontFamily={FONT.mono} fontWeight={WEIGHT.bold} fontSize="8px" opacity={0.5} letterSpacing="0.1em" lineHeight={1}>
                CMD
              </Text>
            </Flex>
          </Button>
          <Flex direction="column" align="center" gap="4px">
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              color={COLORS.industrialBlack}
              opacity={0.7}
              letterSpacing="0.12em"
              textTransform="uppercase"
              lineHeight={1}
            >
              点击或按 ⌘K 打开 // Click or press ⌘K
            </Text>
            {lastCmd && (
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                color={COLORS.signalGreen}
                letterSpacing="0.08em"
                lineHeight={1}
              >
                已执行：{lastCmd}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>

      {/* === 打开态：命令面板 === */}
      <AnimatePresence>
        {open && (
          <M.Flex
            key="cmd-backdrop"
            position="absolute"
            inset={0}
            bg={`${COLORS.black}bf`}
            zIndex={Z_INDEX.modal}
            align="center"
            justify="center"
            p={SPACE.sm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.launch }}
            onClick={() => setOpen(false)}
          >
            <M.Box
              key="cmd-panel"
              role="dialog"
              aria-label="命令面板"
              w="85%"
              maxW="440px"
              maxH="100%"
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.red}
              display="flex"
              flexDirection="column"
              overflow="hidden"
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: DURATION.normal, ease: EASING.launch }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* 红色顶条 */}
              <Flex h="6px" flexShrink={0}>
                <Box flex={5} bg={COLORS.red} />
                <Box flex={1} bg={COLORS.gold} />
                <Box flex={1} bg={COLORS.black} />
              </Flex>

              {/* 输入行 */}
              <Flex
                align="center"
                gap="8px"
                px="12px"
                h="42px"
                flexShrink={0}
                borderBottom={`${BORDER.standard} ${COLORS.black}`}
                bg={COLORS.concrete}
              >
                <Text fontFamily={FONT.mono} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.red} lineHeight={1}>
                  ›
                </Text>
                <Input
                  variant="unstyled"
                  flex={1}
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(0);
                  }}
                  placeholder="搜索命令…"
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="13px"
                  color={COLORS.black}
                  borderRadius={0}
                  _placeholder={{ color: COLORS.industrialBlack, opacity: 0.55 }}
                />
                <KbdBadge>ESC</KbdBadge>
              </Flex>

              {/* 命令列表 */}
              <Box
                flex={1}
                minHeight={0}
                overflowY="auto"
                py="4px"
                sx={{ scrollbarWidth: "thin" }}
              >
                {visible.length === 0 ? (
                  <Flex direction="column" align="center" gap="6px" py={SPACE.lg}>
                    <Box w="8px" h="8px" bg={COLORS.industrialBlack} transform="rotate(45deg)" />
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.bold}
                      fontSize="10px"
                      color={COLORS.industrialBlack}
                      letterSpacing="0.08em"
                      lineHeight={1}
                    >
                      无匹配命令
                    </Text>
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="8px"
                      color={COLORS.industrialBlack}
                      opacity={0.6}
                      letterSpacing="0.12em"
                      textTransform="uppercase"
                      lineHeight={1}
                    >
                      NO MATCH // 尝试其他关键词
                    </Text>
                  </Flex>
                ) : (
                  GROUPS.map((g) => {
                    const groupItems = visible.filter((c) => c.group === g.key);
                    if (groupItems.length === 0) return null;
                    return (
                      <Box key={g.key}>
                        <Flex align="center" gap="6px" px="12px" py="4px">
                          <Box w="6px" h="6px" bg={g.color} />
                          <Text
                            fontFamily={FONT.mono}
                            fontWeight={WEIGHT.bold}
                            fontSize="8px"
                            color={COLORS.industrialBlack}
                            opacity={0.75}
                            letterSpacing="0.14em"
                            textTransform="uppercase"
                            lineHeight={1}
                          >
                            {g.label} // {g.code}
                          </Text>
                        </Flex>
                        {groupItems.map((item) => {
                          const flatIdx = visible.indexOf(item);
                          const isSel = flatIdx === selIdx;
                          return (
                            <Flex
                              key={item.id}
                              role="option"
                              aria-selected={isSel}
                              align="center"
                              gap="10px"
                              px="12px"
                              h="26px"
                              cursor="pointer"
                              bg={isSel ? COLORS.red : "transparent"}
                              onMouseEnter={() => setSelected(flatIdx)}
                              onClick={() => execute(item.label)}
                              ref={isSel ? selectedRef : undefined}
                            >
                              <Flex
                                w="16px"
                                h="16px"
                                align="center"
                                justify="center"
                                border={`1px solid ${isSel ? COLORS.pureWhite : g.color}`}
                                flexShrink={0}
                              >
                                <Text
                                  fontFamily={FONT.mono}
                                  fontWeight={WEIGHT.black}
                                  fontSize="9px"
                                  color={isSel ? COLORS.pureWhite : g.color}
                                  lineHeight={1}
                                >
                                  {item.glyph}
                                </Text>
                              </Flex>
                              <Text
                                fontFamily={FONT.sans}
                                fontWeight={WEIGHT.bold}
                                fontSize="12px"
                                letterSpacing="0.02em"
                                color={isSel ? COLORS.pureWhite : COLORS.black}
                                lineHeight={1}
                                flex={1}
                              >
                                {item.label}
                              </Text>
                              <Flex
                                border={`1px solid ${isSel ? COLORS.pureWhite : COLORS.industrialBlack}`}
                                bg={isSel ? "transparent" : COLORS.concrete}
                                px="4px"
                                py="2px"
                                flexShrink={0}
                              >
                                <Text
                                  fontFamily={FONT.mono}
                                  fontWeight={WEIGHT.bold}
                                  fontSize="8px"
                                  letterSpacing="0.08em"
                                  color={isSel ? COLORS.pureWhite : COLORS.industrialBlack}
                                  lineHeight={1}
                                >
                                  {item.hint}
                                </Text>
                              </Flex>
                            </Flex>
                          );
                        })}
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* 底部提示栏 */}
              <Flex
                bg={COLORS.black}
                align="center"
                justify="space-between"
                px="10px"
                h="30px"
                flexShrink={0}
                gap="8px"
              >
                <Flex align="center" gap="8px" display={{ base: "none", sm: "flex" }}>
                  <Box w="5px" h="5px" bg={COLORS.gold} transform="rotate(45deg)" />
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    color={COLORS.metalWhite}
                    opacity={0.5}
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                    lineHeight={1}
                  >
                    CMD // 06-04
                  </Text>
                </Flex>
                <Flex align="center" gap="8px">
                  <Flex align="center" gap="4px">
                    <KbdBadge dark>↑↓</KbdBadge>
                    <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.6} lineHeight={1}>
                      导航
                    </Text>
                  </Flex>
                  <Flex align="center" gap="4px">
                    <KbdBadge dark>↵</KbdBadge>
                    <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.6} lineHeight={1}>
                      执行
                    </Text>
                  </Flex>
                  <Flex align="center" gap="4px" display={{ base: "none", md: "flex" }}>
                    <KbdBadge dark>ESC</KbdBadge>
                    <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.6} lineHeight={1}>
                      关闭
                    </Text>
                  </Flex>
                  <Button
                    borderRadius={0}
                    bg={COLORS.red}
                    color={COLORS.pureWhite}
                    border={`1px solid ${COLORS.redDark}`}
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="9px"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    px="8px"
                    py="3px"
                    h="auto"
                    lineHeight={1}
                    _hover={{ bg: COLORS.redLight }}
                    _active={{ bg: COLORS.redDark }}
                    onClick={() => setOpen(false)}
                  >
                    关闭
                  </Button>
                </Flex>
              </Flex>
            </M.Box>
          </M.Flex>
        )}
      </AnimatePresence>
    </Box>
  );
}
