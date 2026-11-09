import { Box, Flex, Text, Button, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const MBox = motion(Box);
const MFlex = motion(Flex);

/** 预置检索词表 — 中文标签 + 等宽检索码，双向匹配 */
const VOCAB = [
  { label: "计算", code: "COMPUTE" },
  { label: "存储", code: "STORAGE" },
  { label: "网络", code: "NETWORK" },
  { label: "GPU", code: "ACCELERATOR" },
  { label: "推理", code: "INFERENCE" },
  { label: "训练", code: "TRAINING" },
  { label: "监控", code: "MONITORING" },
  { label: "调度", code: "SCHEDULING" },
  { label: "数据库", code: "DATABASE" },
  { label: "容器", code: "CONTAINER" },
  { label: "缓存", code: "CACHE" },
  { label: "安全", code: "SECURITY" },
] as const;

const MAX_TAGS = 8;
const CHIP_ACCENTS = [COLORS.red, COLORS.gold, COLORS.electricCyan] as const;

interface Tag {
  id: number;
  label: string;
  accent: string;
}

/** 单个标签芯片 — 直角方框，色条标识，× 移除 */
function Chip({ tag, onRemove }: { tag: Tag; onRemove: () => void }) {
  return (
    <MFlex
      align="center"
      gap="6px"
      h="24px"
      px="8px"
      bg={COLORS.pureWhite}
      border={`${BORDER.standard} ${tag.accent}`}
      flexShrink={0}
      initial={{ opacity: 0, scale: 0.8, x: -8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 8 }}
      transition={{ duration: DURATION.fast, ease: EASING.launch }}
      _hover={{ boxShadow: SHADOW.small }}
      sx={{ transition: `box-shadow ${DURATION.fast}s ease` }}
    >
      <Box w="6px" h="6px" bg={tag.accent} flexShrink={0} />
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="11px"
        color={COLORS.black}
        letterSpacing="0.02em"
        whiteSpace="nowrap"
      >
        {tag.label}
      </Text>
      <Button
        aria-label={`移除标签 ${tag.label}`}
        onClick={onRemove}
        w="14px"
        h="14px"
        minW="14px"
        p="0"
        borderRadius={0}
        bg="transparent"
        color={COLORS.industrialBlack}
        fontFamily={FONT.mono}
        fontSize="11px"
        fontWeight={WEIGHT.bold}
        lineHeight="1"
        cursor="pointer"
        _hover={{ bg: COLORS.red, color: COLORS.pureWhite }}
        _active={{ bg: COLORS.redDark, transform: "none" }}
        _focusVisible={{ boxShadow: `0 0 0 1px ${COLORS.gold}` }}
      >
        ×
      </Button>
    </MFlex>
  );
}

export default function SceneTagInput() {
  const [tags, setTags] = useState<Tag[]>([
    { id: 0, label: "计算", accent: CHIP_ACCENTS[0] },
    { id: 1, label: "GPU", accent: CHIP_ACCENTS[1] },
    { id: 2, label: "训练", accent: CHIP_ACCENTS[2] },
  ]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputFocus, setInputFocus] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef(3);
  const noticeTimer = useRef<number | null>(null);

  /** 候选匹配 — 中文标签与英文检索码双向包含 */
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return VOCAB.filter(
      (v) => v.label.toLowerCase().includes(q) || v.code.toLowerCase().includes(q)
    );
  }, [query]);

  const showSuggest = inputFocus && query.trim() !== "" && matches.length > 0;

  /** 输入变化时重置高亮行 */
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  /** 键盘导航时保持高亮行可见 */
  useEffect(() => {
    if (!showSuggest) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, showSuggest]);

  /** 卸载时清理提示定时器 */
  useEffect(
    () => () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    },
    []
  );

  const flash = (message: string) => {
    setNotice(message);
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1600);
  };

  /** 提交标签 — 去重 / 限额 / 附加循环色 */
  const commitTag = (raw: string): boolean => {
    const label = raw.trim();
    if (!label) return false;
    if (tags.some((t) => t.label === label)) {
      flash(`「${label}」已存在`);
      return false;
    }
    if (tags.length >= MAX_TAGS) {
      flash(`最多 ${MAX_TAGS} 个标签`);
      return false;
    }
    const id = seqRef.current;
    seqRef.current += 1;
    setTags((prev) => [...prev, { id, label, accent: CHIP_ACCENTS[id % CHIP_ACCENTS.length] }]);
    return true;
  };

  /** 逗号（中英文）连续输入 */
  const handleChange = (raw: string) => {
    const parts = raw.split(/[,，]/);
    if (parts.length > 1) {
      parts.slice(0, -1).forEach((p) => commitTag(p));
      setQuery(parts[parts.length - 1]);
    } else {
      setQuery(raw);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggest && matches[activeIndex]) {
        commitTag(matches[activeIndex].label);
      } else {
        commitTag(query);
      }
      setQuery("");
      return;
    }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && showSuggest) {
      e.preventDefault();
      setActiveIndex((i) =>
        e.key === "ArrowDown"
          ? (i + 1) % matches.length
          : (i - 1 + matches.length) % matches.length
      );
      return;
    }
    if (e.key === "Backspace" && query === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
      return;
    }
    if (e.key === "Escape") {
      setQuery("");
    }
  };

  const removeTag = (id: number) => setTags((prev) => prev.filter((t) => t.id !== id));

  const clearAll = () => {
    setTags([]);
    inputRef.current?.focus();
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete}>
      {/* 标签行 — 金色大写标签 + 词表读数 */}
      <Flex justify="space-between" align="center" mb="8px" flexWrap="wrap" gap="4px">
        <Flex align="center" gap="8px">
          <Box w="6px" h="6px" bg={COLORS.red} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.bold}
            fontSize="11px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={COLORS.gold}
          >
            资源标签 / TAGS
          </Text>
        </Flex>
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          letterSpacing="0.08em"
          color={COLORS.electricCyan}
        >
          VOCAB={VOCAB.length} · MAX={MAX_TAGS}
        </Text>
      </Flex>

      {/* 标签输入框 + 候选下拉 */}
      <Box position="relative">
        <Flex
          wrap="wrap"
          gap="6px"
          align="center"
          p="8px"
          minH="76px"
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${inputFocus ? COLORS.red : COLORS.black}`}
          position="relative"
          cursor="text"
          onClick={() => inputRef.current?.focus()}
          sx={{ transition: `border-color ${DURATION.fast}s ease` }}
        >
          {inputFocus && (
            <Box
              position="absolute"
              top="-3px"
              left="-3px"
              w="8px"
              h="8px"
              bg={COLORS.gold}
              pointerEvents="none"
            />
          )}

          <AnimatePresence initial={false}>
            {tags.map((tag) => (
              <Chip key={tag.id} tag={tag} onRemove={() => removeTag(tag.id)} />
            ))}
          </AnimatePresence>

          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            placeholder={tags.length === 0 ? "输入关键词，如：GPU / 网络 / 推理 …" : "继续输入…"}
            flex={1}
            minWidth="120px"
            h="auto"
            py="4px"
            px="0"
            borderRadius={0}
            border="none"
            bg="transparent"
            fontFamily={FONT.mono}
            fontSize="13px"
            letterSpacing="0.02em"
            color={COLORS.black}
            _focus={{ boxShadow: SHADOW.none }}
            _placeholder={{ color: COLORS.industrialBlack, opacity: 0.45 }}
          />
        </Flex>

        {/* 候选下拉 — 硬阴影覆盖层 */}
        <AnimatePresence>
          {showSuggest && (
            <MBox
              position="absolute"
              top="calc(100% + 4px)"
              left="0"
              right="0"
              zIndex={Z_INDEX.overlay}
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.large}
              maxHeight="180px"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: DURATION.fast, ease: EASING.launch }}
            >
              <Flex
                bg={COLORS.black}
                px="10px"
                py="5px"
                justify="space-between"
                align="center"
                flexShrink={0}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  letterSpacing="0.12em"
                  color={COLORS.gold}
                >
                  匹配候选
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  letterSpacing="0.08em"
                  color={COLORS.metalWhite}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(matches.length).padStart(2, "0")} 项
                </Text>
              </Flex>

              <Box ref={listRef} overflowY="auto" flex={1}>
                {matches.map((item, i) => {
                  const active = i === activeIndex;
                  const added = tags.some((t) => t.label === item.label);
                  return (
                    <Flex
                      key={item.code}
                      data-active={active ? "true" : undefined}
                      align="center"
                      gap="8px"
                      px="10px"
                      py="7px"
                      cursor="pointer"
                      bg={active ? COLORS.red : COLORS.pureWhite}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => {
                        commitTag(item.label);
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      sx={{ transition: `background ${DURATION.instant}s ease` }}
                    >
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="9px"
                        fontWeight={WEIGHT.black}
                        color={active ? COLORS.pureWhite : COLORS.gold}
                        w="16px"
                        flexShrink={0}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontWeight={WEIGHT.bold}
                        fontSize="12px"
                        letterSpacing="0.02em"
                        color={active ? COLORS.pureWhite : COLORS.black}
                        whiteSpace="nowrap"
                      >
                        {item.label}
                      </Text>
                      <Box flex={1} />
                      {added && (
                        <Text
                          fontFamily={FONT.mono}
                          fontSize="8px"
                          letterSpacing="0.08em"
                          color={active ? COLORS.pureWhite : COLORS.statusGreen}
                        >
                          已选
                        </Text>
                      )}
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        letterSpacing="0.1em"
                        color={active ? COLORS.pureWhite : COLORS.industrialBlack}
                        opacity={active ? 0.8 : 0.5}
                      >
                        {item.code}
                      </Text>
                    </Flex>
                  );
                })}
              </Box>
            </MBox>
          )}
        </AnimatePresence>
      </Box>

      {/* 已选标签读数条 — 黑色仪表带 */}
      <Flex
        mt="12px"
        bg={COLORS.black}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.small}
        px="10px"
        py="7px"
        align="center"
        gap="8px"
      >
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          fontWeight={WEIGHT.black}
          letterSpacing="0.12em"
          color={COLORS.gold}
          flexShrink={0}
        >
          已选标签
        </Text>
        <Box w="6px" h="6px" bg={COLORS.red} flexShrink={0} />
        <Text
          fontFamily={FONT.mono}
          fontSize="11px"
          color={COLORS.metalWhite}
          letterSpacing="0.03em"
          flex={1}
          minWidth={0}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {tags.length === 0
            ? "// 空"
            : `${String(tags.length).padStart(2, "0")} 项 // ${tags
                .map((t) => t.label)
                .join(" · ")}`}
        </Text>
        <MBox
          w="6px"
          h="10px"
          bg={COLORS.electricCyan}
          flexShrink={0}
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <Button
          borderRadius={0}
          bg="transparent"
          color={COLORS.metalWhite}
          border={`${BORDER.standard} ${COLORS.metalWhite}`}
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          px="10px"
          py="3px"
          h="auto"
          flexShrink={0}
          _hover={{ bg: COLORS.red, borderColor: COLORS.red, color: COLORS.pureWhite }}
          _disabled={{ opacity: 0.35, cursor: "not-allowed" }}
          isDisabled={tags.length === 0}
          onClick={clearAll}
        >
          清空
        </Button>
      </Flex>

      {/* 操作提示 / 闪现通告 */}
      <Flex mt="8px" justify="space-between" align="baseline" gap="8px" flexWrap="wrap">
        {notice ? (
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.bold}
            fontSize="10px"
            letterSpacing="0.06em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            ! {notice}
          </Text>
        ) : (
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.industrialBlack}
            opacity={0.6}
            letterSpacing="0.04em"
          >
            ENTER/逗号 确认 · ⌫ 删除末项 · ↑↓ 选择 · ESC 清空输入
          </Text>
        )}
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          color={COLORS.electricCyan}
          opacity={0.8}
          letterSpacing="0.06em"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(tags.length).padStart(2, "0")}/{String(MAX_TAGS).padStart(2, "0")}
        </Text>
      </Flex>

      {/* 底部速度色条 — 锚定构图 */}
      <Flex h="3px" mt="auto" opacity={0.9}>
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>
    </Box>
  );
}
