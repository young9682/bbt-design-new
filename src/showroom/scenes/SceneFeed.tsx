import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = {
  Box: motion(Box),
};

type Severity = "info" | "warn" | "critical";
type Channel = "alert" | "system";
type Filter = "all" | Channel;
type Shape = "square" | "diamond" | "circle" | "triangle";

interface FeedItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  type: string;
  time: string;
  severity: Severity;
  channel: Channel;
  unread: boolean;
  mark: { shape: Shape; color: string };
}

const ITEMS: FeedItem[] = [
  {
    id: "NT-1087",
    actor: "王工",
    action: "完成了生产环境部署",
    target: "ns/llm-serving · v2.4.1",
    type: "部署完成",
    time: "14:32:07",
    severity: "info",
    channel: "system",
    unread: true,
    mark: { shape: "square", color: COLORS.red },
  },
  {
    id: "NT-1086",
    actor: "调度器",
    action: "报告节点离线超过 5 分钟",
    target: "node/gpu-agent-07 · 192.168.4.31",
    type: "节点离线",
    time: "14:18:52",
    severity: "critical",
    channel: "alert",
    unread: true,
    mark: { shape: "triangle", color: COLORS.red },
  },
  {
    id: "NT-1085",
    actor: "李教授",
    action: "调整了命名空间 GPU 配额",
    target: "ns/material-lab · 8 → 16 卡",
    type: "配额变更",
    time: "13:55:20",
    severity: "info",
    channel: "system",
    unread: true,
    mark: { shape: "diamond", color: COLORS.gold },
  },
  {
    id: "NT-1084",
    actor: "CI 流水线",
    action: "构建失败 · 退出码 137",
    target: "bbt-console · #4821 · OOM",
    type: "构建失败",
    time: "13:41:03",
    severity: "critical",
    channel: "alert",
    unread: true,
    mark: { shape: "square", color: COLORS.red },
  },
  {
    id: "NT-1083",
    actor: "监控中心",
    action: "GPU 结点温度超过阈值",
    target: "gpu-pool · 87°C / 阈值 83°C",
    type: "温度告警",
    time: "12:58:44",
    severity: "warn",
    channel: "alert",
    unread: false,
    mark: { shape: "triangle", color: COLORS.gold },
  },
  {
    id: "NT-1082",
    actor: "镜像服务",
    action: "完成跨集群镜像同步",
    target: "nexus → harbor · 214 层",
    type: "镜像同步",
    time: "11:47:16",
    severity: "info",
    channel: "system",
    unread: false,
    mark: { shape: "circle", color: COLORS.electricCyan },
  },
  {
    id: "NT-1081",
    actor: "赵晓",
    action: "加入了团队命名空间",
    target: "ns/vision-group · Role: viewer",
    type: "成员变更",
    time: "10:22:39",
    severity: "info",
    channel: "system",
    unread: false,
    mark: { shape: "circle", color: COLORS.electricCyan },
  },
  {
    id: "NT-1080",
    actor: "运维机器人",
    action: "检测到 TLS 证书即将过期",
    target: "*.bbt.sspu.edu.cn · 剩余 6 天",
    type: "证书告警",
    time: "09:30:02",
    severity: "warn",
    channel: "alert",
    unread: false,
    mark: { shape: "diamond", color: COLORS.gold },
  },
  {
    id: "NT-1079",
    actor: "备份系统",
    action: "完成数据库全量备份",
    target: "pg/netbox · 4.2 GB · JuiceFS",
    type: "备份完成",
    time: "08-16 23:00",
    severity: "info",
    channel: "system",
    unread: false,
    mark: { shape: "square", color: COLORS.electricCyan },
  },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "alert", label: "告警" },
  { key: "system", label: "系统" },
];

const SEVERITY_META: Record<
  Severity,
  { label: string; bg: string; color: string; border: string }
> = {
  info: {
    label: "信息",
    bg: COLORS.pureWhite,
    color: COLORS.electricCyan,
    border: COLORS.electricCyan,
  },
  warn: {
    label: "警告",
    bg: COLORS.gold,
    color: COLORS.black,
    border: COLORS.goldDark,
  },
  critical: {
    label: "严重",
    bg: COLORS.red,
    color: COLORS.pureWhite,
    border: COLORS.redDark,
  },
};

/** 几何头像标记 — square / diamond / circle / triangle */
function AvatarMark({ mark }: { mark: FeedItem["mark"] }) {
  return (
    <Flex
      w="26px"
      h="26px"
      align="center"
      justify="center"
      flexShrink={0}
      bg={COLORS.metalWhite}
      border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
    >
      {mark.shape === "square" && (
        <Box w="14px" h="14px" bg={mark.color} border={`${BORDER.hairline} ${COLORS.black}`} />
      )}
      {mark.shape === "diamond" && (
        <Box
          w="12px"
          h="12px"
          bg={mark.color}
          border={`${BORDER.hairline} ${COLORS.black}`}
          transform="rotate(45deg)"
        />
      )}
      {mark.shape === "circle" && (
        <Box
          w="14px"
          h="14px"
          bg={mark.color}
          border={`${BORDER.hairline} ${COLORS.black}`}
          borderRadius="50%"
        />
      )}
      {mark.shape === "triangle" && (
        <Box
          w="16px"
          h="14px"
          bg={mark.color}
          clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
        />
      )}
    </Flex>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY_META[severity];
  return (
    <Box
      px="6px"
      py="2px"
      bg={s.bg}
      color={s.color}
      border={`${BORDER.hairline} ${s.border}`}
      fontFamily={FONT.mono}
      fontWeight={WEIGHT.bold}
      fontSize="8px"
      lineHeight={1.5}
      letterSpacing="0.15em"
      flexShrink={0}
      ml="auto"
    >
      {s.label}
    </Box>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.launch },
  },
};

function FeedCard({
  item,
  isRead,
  onRead,
}: {
  item: FeedItem;
  isRead: boolean;
  onRead: () => void;
}) {
  const unread = item.unread && !isRead;

  return (
    <M.Box
      variants={cardVariants}
      position="relative"
      bg={COLORS.pureWhite}
      borderTop={`${BORDER.standard} ${COLORS.black}`}
      borderRight={`${BORDER.standard} ${COLORS.black}`}
      borderBottom={`${BORDER.standard} ${COLORS.black}`}
      borderLeft={`4px solid ${unread ? COLORS.red : COLORS.black}`}
      boxShadow={SHADOW.small}
      p="10px"
      pl="12px"
      cursor="pointer"
      onClick={onRead}
      whileHover={{ y: -2, boxShadow: SHADOW.medium }}
      transition={{ duration: DURATION.fast, ease: EASING.sharp }}
    >
      <Flex gap="10px" align="flex-start">
        <AvatarMark mark={item.mark} />

        <Box flex={1} minWidth={0}>
          {/* 行 1：操作者 + 动作 + 严重度徽章 */}
          <Flex gap="6px" align="flex-start" flexWrap="wrap">
            {unread && <Box w="6px" h="6px" bg={COLORS.red} mt="5px" flexShrink={0} />}
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              letterSpacing="0.02em"
              color={COLORS.black}
              lineHeight={1.5}
            >
              {item.actor}
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.regular}
              fontSize="10px"
              color={COLORS.industrialBlack}
              lineHeight={1.5}
            >
              {item.action}
            </Text>
            <SeverityBadge severity={item.severity} />
          </Flex>

          <Box h="1px" bg={COLORS.black} opacity={0.15} my="6px" />

          {/* 行 2：类型 + 对象（等宽遥测） */}
          <Flex gap="8px" align="flex-start" flexWrap="wrap">
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.12em"
              color={COLORS.pureWhite}
              bg={COLORS.industrialBlack}
              px="4px"
              py="1px"
              lineHeight={1.6}
              flexShrink={0}
            >
              {item.type}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.regular}
              fontSize="8px"
              letterSpacing="0.04em"
              color={COLORS.industrialBlack}
              opacity={0.8}
              lineHeight={1.8}
              minWidth={0}
            >
              {item.target}
            </Text>
          </Flex>

          {/* 行 3：时间戳 + 编号 */}
          <Flex gap="8px" align="center" flexWrap="wrap" mt="3px">
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.08em"
              color={COLORS.black}
              opacity={0.65}
              lineHeight={1.6}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {item.time}
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.regular}
              fontSize="8px"
              letterSpacing="0.08em"
              color={COLORS.industrialBlack}
              opacity={0.45}
              lineHeight={1.6}
            >
              #{item.id}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </M.Box>
  );
}

export default function SceneFeed() {
  const [filter, setFilter] = useState<Filter>("all");
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());

  const visible = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((i) => i.channel === filter)),
    [filter]
  );

  const counts = useMemo(
    () => ({
      all: ITEMS.length,
      alert: ITEMS.filter((i) => i.channel === "alert").length,
      system: ITEMS.filter((i) => i.channel === "system").length,
    }),
    []
  );

  const unreadCount = ITEMS.filter((i) => i.unread && !readIds.has(i.id)).length;

  const markRead = (id: string) =>
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} overflow="hidden">
      {/* 头部仪表条：黑底 + 红色扫描线 + 过滤芯片 */}
      <Box bg={COLORS.black} flexShrink={0}>
        <Box
          h="2px"
          bg={COLORS.red}
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 6px, transparent 6px, transparent 10px)`}
        />
        <Flex px="12px" pt="9px" pb="8px" direction="column" gap="8px">
          <Flex justify="space-between" align="center" gap="8px" flexWrap="wrap">
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="11px"
              letterSpacing="0.18em"
              textTransform="uppercase"
              color={COLORS.pureWhite}
              lineHeight={1.2}
            >
              活动遥测 // FEED
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.1em"
              color={COLORS.redLight}
              sx={{ fontVariantNumeric: "tabular-nums" }}
              lineHeight={1.2}
            >
              未读 {String(unreadCount).padStart(2, "0")}
            </Text>
          </Flex>

          <Flex gap="6px" flexWrap="wrap">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <Box
                  key={f.key}
                  as="button"
                  px="10px"
                  py="3px"
                  bg={active ? COLORS.red : "transparent"}
                  color={active ? COLORS.pureWhite : COLORS.metalWhite}
                  border={`${BORDER.standard} ${active ? COLORS.redDark : "${COLORS.metalWhite}59"}`}
                  fontFamily={FONT.sans}
                  fontWeight={active ? WEIGHT.black : WEIGHT.bold}
                  fontSize="9px"
                  letterSpacing="0.1em"
                  lineHeight={1.4}
                  cursor="pointer"
                  onClick={() => setFilter(f.key)}
                  transition={`all ${DURATION.fast}s ease`}
                  _hover={
                    active
                      ? { bg: COLORS.redLight }
                      : { color: COLORS.pureWhite, borderColor: COLORS.metalWhite }
                  }
                >
                  {f.label} {String(counts[f.key]).padStart(2, "0")}
                </Box>
              );
            })}
          </Flex>
        </Flex>
        {/* 仪器色条：红(3) / 暗(7) */}
        <Flex h="4px">
          <Box flex={3} bg={COLORS.red} />
          <Box flex={7} bg={COLORS.industrialBlack} />
        </Flex>
      </Box>

      {/* 可滚动列表 */}
      <Box
        flex={1}
        overflowY="auto"
        px="10px"
        py="10px"
        sx={{ scrollbarWidth: "thin" }}
      >
        <AnimatePresence mode="wait">
          <M.Box
            key={filter}
            initial="hidden"
            animate="show"
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: DURATION.fast, ease: EASING.accelerate },
            }}
            variants={listVariants}
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            {visible.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                isRead={readIds.has(item.id)}
                onRead={() => markRead(item.id)}
              />
            ))}
            {visible.length === 0 && (
              <Box
                bg={COLORS.pureWhite}
                border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                p="16px"
                textAlign="center"
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  letterSpacing="0.15em"
                  color={COLORS.industrialBlack}
                  opacity={0.6}
                >
                  NO SIGNAL // 频道无事件
                </Text>
              </Box>
            )}
          </M.Box>
        </AnimatePresence>
      </Box>
    </Flex>
  );
}
