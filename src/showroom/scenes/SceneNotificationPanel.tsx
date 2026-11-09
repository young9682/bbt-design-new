import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = {
  Box: motion(Box),
};

type Severity = "critical" | "warn" | "info";
type GroupKey = "today" | "earlier";

interface Notice {
  id: string;
  title: string;
  time: string;
  severity: Severity;
  group: GroupKey;
  unread: boolean;
}

const NOTICES: Notice[] = [
  { id: "N-4212", title: "节点 gpu-agent-07 心跳丢失", time: "14:18", severity: "critical", group: "today", unread: true },
  { id: "N-4211", title: "GPU 结点温度 87°C 超阈值", time: "12:58", severity: "warn", group: "today", unread: true },
  { id: "N-4210", title: "生产环境部署完成 v2.4.1", time: "11:42", severity: "info", group: "today", unread: true },
  { id: "N-4209", title: "pg/netbox 全量备份 4.2 GB", time: "10:05", severity: "info", group: "today", unread: true },
  { id: "N-4208", title: "CI 构建 #4821 失败 · OOM", time: "昨天 22:40", severity: "critical", group: "earlier", unread: true },
  { id: "N-4207", title: "TLS 证书剩余有效期 6 天", time: "昨天 18:12", severity: "warn", group: "earlier", unread: false },
  { id: "N-4206", title: "命名空间 GPU 配额 8 → 16 卡", time: "08-15", severity: "info", group: "earlier", unread: false },
];

const GROUPS: { key: GroupKey; label: string; tag: string }[] = [
  { key: "today", label: "今天", tag: "TODAY" },
  { key: "earlier", label: "更早", tag: "EARLIER" },
];

/** 几何严重度标记 — 三角(严重) / 菱形(警告) / 方块(信息) */
const SEVERITY_META: Record<Severity, { color: string }> = {
  critical: { color: COLORS.red },
  warn: { color: COLORS.gold },
  info: { color: COLORS.electricCyan },
};

function SeverityMark({ severity }: { severity: Severity }) {
  const { color } = SEVERITY_META[severity];
  return (
    <Flex
      w="20px"
      h="20px"
      align="center"
      justify="center"
      flexShrink={0}
      bg={COLORS.metalWhite}
      border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
      mt="1px"
    >
      {severity === "critical" && (
        <Box w="12px" h="10px" bg={color} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" />
      )}
      {severity === "warn" && (
        <Box w="9px" h="9px" bg={color} transform="rotate(45deg)" />
      )}
      {severity === "info" && <Box w="10px" h="10px" bg={color} />}
    </Flex>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: 10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.normal, ease: EASING.launch },
  },
};

function NoticeRow({
  notice,
  isRead,
  onRead,
}: {
  notice: Notice;
  isRead: boolean;
  onRead: () => void;
}) {
  const unread = notice.unread && !isRead;

  return (
    <M.Box
      variants={rowVariants}
      as="button"
      display="flex"
      alignItems="flex-start"
      gap="8px"
      w="100%"
      textAlign="left"
      px="10px"
      py="8px"
      pl="9px"
      bg={unread ? `${COLORS.red}0d` : COLORS.pureWhite}
      borderLeft={`3px solid ${unread ? COLORS.red : "transparent"}`}
      borderBottom={`${BORDER.hairline} ${COLORS.black}1f`}
      cursor="pointer"
      onClick={onRead}
      transition={`background-color ${DURATION.fast}s ease`}
      _hover={{ bg: unread ? `${COLORS.red}17` : COLORS.metalWhite }}
    >
      <SeverityMark severity={notice.severity} />

      <Text
        flex={1}
        minWidth={0}
        fontFamily={FONT.sans}
        fontWeight={unread ? WEIGHT.black : WEIGHT.regular}
        fontSize="10px"
        letterSpacing="0.02em"
        color={COLORS.black}
        lineHeight={2}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {notice.title}
      </Text>

      {unread && <Box w="5px" h="5px" bg={COLORS.red} mt="7px" flexShrink={0} />}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="8px"
        letterSpacing="0.06em"
        color={COLORS.industrialBlack}
        opacity={0.6}
        lineHeight={2.5}
        flexShrink={0}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {notice.time}
      </Text>
    </M.Box>
  );
}

/** 几何铃铛 — 剪裁多边形 + 撞锤 */
function BellGlyph({ color }: { color: string }) {
  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        w="13px"
        h="12px"
        bg={color}
        clipPath="polygon(50% 0%, 68% 10%, 80% 34%, 86% 62%, 100% 78%, 100% 91%, 0% 91%, 0% 78%, 14% 62%, 20% 34%, 32% 10%)"
      />
      <Box w="4px" h="2px" bg={color} mt="1px" />
    </Flex>
  );
}

/** 休止态背景内容块 — 低对比，衬托浮层 */
function BackdropBlocks() {
  const stats = [
    { label: "ONLINE", value: "347" },
    { label: "JOBS", value: "12" },
    { label: "GPU", value: "87%" },
  ];
  const bars = ["32%", "56%", "40%", "72%", "50%", "86%", "64%", "95%"];

  return (
    <Flex direction="column" gap="10px" pointerEvents="none">
      {/* 遥测统计条 */}
      <Flex gap="8px">
        {stats.map((s) => (
          <Flex
            key={s.label}
            flex={1}
            direction="column"
            gap="2px"
            bg={COLORS.pureWhite}
            border={`${BORDER.hairline} ${COLORS.black}40`}
            px="8px"
            py="6px"
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="7px"
              letterSpacing="0.14em"
              color={COLORS.industrialBlack}
              opacity={0.55}
              lineHeight={1.4}
            >
              {s.label}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="14px"
              color={COLORS.black}
              lineHeight={1.1}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {s.value}
            </Text>
          </Flex>
        ))}
      </Flex>

      {/* 吞吐柱状图块 */}
      <Box
        bg={COLORS.pureWhite}
        border={`${BORDER.hairline} ${COLORS.black}40`}
        px="10px"
        py="8px"
        sx={{
          backgroundImage: `repeating-linear-gradient(45deg, ${COLORS.black}0a 0px, ${COLORS.black}0a 1px, transparent 1px, transparent 6px)`,
        }}
      >
        <Text
          fontFamily={FONT.mono}
          fontSize="7px"
          letterSpacing="0.14em"
          color={COLORS.industrialBlack}
          opacity={0.55}
          mb="6px"
        >
          集群吞吐 // GB/M
        </Text>
        <Flex h="44px" align="flex-end" gap="3px">
          {bars.map((h, i) => (
            <Box
              key={i}
              flex={1}
              h={h}
              bg={i === bars.length - 1 ? COLORS.red : COLORS.black}
              opacity={i === bars.length - 1 ? 1 : 0.82}
            />
          ))}
        </Flex>
      </Box>

      {/* 骨架列表块 */}
      <Box bg={COLORS.pureWhite} border={`${BORDER.hairline} ${COLORS.black}40`} px="10px" py="8px">
        <Flex direction="column" gap="8px">
          {["72%", "46%", "86%", "58%"].map((w, i) => (
            <Flex key={i} align="center" gap="8px">
              <Box w="6px" h="6px" bg={COLORS.black} opacity={0.25} flexShrink={0} />
              <Box h="5px" w={w} bg={COLORS.black} opacity={0.14} />
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

export default function SceneNotificationPanel() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());

  const unreadCount = useMemo(
    () => NOTICES.filter((n) => n.unread && !readIds.has(n.id)).length,
    [readIds]
  );

  const markRead = (id: string) =>
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const markAllRead = () => setReadIds(new Set(NOTICES.map((n) => n.id)));

  /* ESC 关闭面板 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete}>
      {/* === 迷你应用顶栏 === */}
      <Flex
        h="44px"
        bg={COLORS.black}
        align="center"
        gap="10px"
        px="10px"
        position="relative"
        zIndex={Z_INDEX.navigation}
      >
        {/* 顶部红色扫描线 */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="2px"
          bg={COLORS.red}
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 6px, transparent 6px, transparent 10px)`}
        />

        {/* 徽标 */}
        <Flex w="20px" h="20px" bg={COLORS.red} align="center" justify="center" flexShrink={0}>
          <Box w="10px" h="8px" bg={COLORS.pureWhite} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" />
        </Flex>

        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="11px"
          letterSpacing="0.14em"
          color={COLORS.pureWhite}
          whiteSpace="nowrap"
        >
          BBT 控制台
        </Text>
        <Text
          display={{ base: "none", md: "block" }}
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.12em"
          color={COLORS.metalWhite}
          opacity={0.4}
        >
          // CONSOLE
        </Text>

        <Text
          display={{ base: "none", md: "block" }}
          ml="auto"
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.metalWhite}
          opacity={0.55}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          OP-77 · 14:32
        </Text>

        {/* 铃铛按钮 + 未读徽章 */}
        <Box
          as="button"
          ml={{ base: "auto", md: "12px" }}
          position="relative"
          w="30px"
          h="30px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          bg={open ? COLORS.red : "transparent"}
          border={`${BORDER.hairline} ${open ? COLORS.redDark : "${COLORS.metalWhite}66"}`}
          cursor="pointer"
          aria-label="通知中心"
          onClick={() => setOpen((o) => !o)}
          transition={`all ${DURATION.fast}s ease`}
          _hover={{
            borderColor: COLORS.metalWhite,
            bg: open ? COLORS.redLight: `${COLORS.metalWhite}14`,
          }}
        >
          <BellGlyph color={open ? COLORS.pureWhite : COLORS.metalWhite} />
          {unreadCount > 0 && (
            <Flex
              position="absolute"
              top="-5px"
              right="-5px"
              minW="14px"
              h="14px"
              px="2px"
              align="center"
              justify="center"
              bg={COLORS.red}
              color={COLORS.pureWhite}
              border={`${BORDER.hairline} ${COLORS.pureWhite}`}
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="8px"
              lineHeight={1}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {unreadCount}
            </Flex>
          )}
        </Box>
      </Flex>

      {/* === 休止态背景内容 === */}
      <Box px="10px" pt="14px" pb="26px" h="calc(100% - 44px)" overflow="hidden">
        <BackdropBlocks />
        <Text
          position="absolute"
          bottom="8px"
          left="10px"
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.industrialBlack}
          opacity={0.5}
          pointerEvents="none"
        >
          点击铃铛开启通知 · ESC 关闭
        </Text>
      </Box>

      {/* === 点击遮罩关闭 === */}
      <AnimatePresence>
        {open && (
          <M.Box
            key="notice-scrim"
            position="absolute"
            top="44px"
            left={0}
            right={0}
            bottom={0}
            bg={`${COLORS.black}24`}
            zIndex={Z_INDEX.content}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: DURATION.fast } }}
            exit={{ opacity: 0, transition: { duration: DURATION.instant } }}
          />
        )}
      </AnimatePresence>

      {/* === 通知中心下拉面板 === */}
      <AnimatePresence>
        {open && (
          <M.Box
            key="notice-panel"
            position="absolute"
            top="52px"
            right="8px"
            w={{ base: "calc(100% - 16px)", md: "340px" }}
            maxH="calc(100% - 60px)"
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.large}
            display="flex"
            flexDirection="column"
            zIndex={Z_INDEX.overlay}
            transformOrigin="top right"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: DURATION.fast, ease: EASING.launch },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.97,
              transition: { duration: DURATION.instant, ease: EASING.accelerate },
            }}
          >
            {/* 面板头 */}
            <Flex
              align="center"
              gap="8px"
              px="12px"
              py="9px"
              borderBottom={`${BORDER.hairline} ${COLORS.black}`}
              flexShrink={0}
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.06em"
                color={COLORS.black}
              >
                通知中心
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.1em"
                color={unreadCount > 0 ? COLORS.red : COLORS.industrialBlack}
                opacity={unreadCount > 0 ? 1 : 0.5}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                未读 {String(unreadCount).padStart(2, "0")}
              </Text>
              <Box
                as="button"
                ml="auto"
                bg="transparent"
                border="none"
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                color={unreadCount > 0 ? COLORS.red : COLORS.industrialBlack}
                opacity={unreadCount > 0 ? 1 : 0.45}
                cursor={unreadCount > 0 ? "pointer" : "default"}
                textDecoration={unreadCount > 0 ? "underline" : "none"}
                sx={{ textUnderlineOffset: "3px" }}
                onClick={markAllRead}
                _hover={unreadCount > 0 ? { color: COLORS.redDark } : undefined}
              >
                全部已读
              </Box>
            </Flex>

            {/* 分组列表 */}
            <M.Box
              flex={1}
              minHeight={0}
              overflowY="auto"
              sx={{ scrollbarWidth: "thin" }}
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {GROUPS.map((g) => {
                const items = NOTICES.filter((n) => n.group === g.key);
                const groupUnread = items.filter((n) => n.unread && !readIds.has(n.id)).length;
                return (
                  <M.Box key={g.key} display="flex" flexDirection="column">
                    <Flex
                      align="center"
                      gap="6px"
                      bg={COLORS.metalWhite}
                      px="12px"
                      py="4px"
                      borderBottom={`${BORDER.hairline} ${COLORS.black}2e`}
                    >
                      <Box w="3px" h="10px" bg={groupUnread > 0 ? COLORS.red : COLORS.black} />
                      <Text
                        fontFamily={FONT.sans}
                        fontWeight={WEIGHT.bold}
                        fontSize="9px"
                        letterSpacing="0.12em"
                        color={COLORS.black}
                      >
                        {g.label}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="7px"
                        letterSpacing="0.14em"
                        color={COLORS.industrialBlack}
                        opacity={0.5}
                      >
                        {g.tag}
                      </Text>
                      <Text
                        ml="auto"
                        fontFamily={FONT.mono}
                        fontWeight={WEIGHT.bold}
                        fontSize="8px"
                        letterSpacing="0.08em"
                        color={COLORS.industrialBlack}
                        opacity={0.6}
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {String(groupUnread).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </Text>
                    </Flex>
                    {items.map((n) => (
                      <NoticeRow
                        key={n.id}
                        notice={n}
                        isRead={readIds.has(n.id)}
                        onRead={() => markRead(n.id)}
                      />
                    ))}
                  </M.Box>
                );
              })}
            </M.Box>

            {/* 面板脚 */}
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="6px"
              py="8px"
              bg={COLORS.black}
              color={COLORS.pureWhite}
              cursor="pointer"
              flexShrink={0}
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.18em"
              onClick={() => setOpen(false)}
              transition={`background-color ${DURATION.fast}s ease`}
              _hover={{ bg: COLORS.red }}
            >
              查看全部通知 <Box as="span">→</Box>
            </Box>
          </M.Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
