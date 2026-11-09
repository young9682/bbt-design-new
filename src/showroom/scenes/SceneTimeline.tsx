import { useMemo, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

// === TYPES ===

type EventStatus = "done" | "active" | "future";
type FilterKey = "all" | "done" | "active";
type ShapeKind = "square" | "diamond" | "circle" | "triangle";

interface MissionEvent {
  id: string;
  title: string;
  date: string;
  operator: string;
  desc: string;
  status: EventStatus;
  logs?: string[];
}

// === DATA — 任务/研发事件流 ===

const EVENTS: MissionEvent[] = [
  {
    id: "EVT-0001",
    title: "集群引导启动",
    date: "03-02 08:12",
    operator: "root",
    desc: "RKE2 控制平面初始化，etcd 三节点仲裁建立。",
    status: "done",
  },
  {
    id: "EVT-0002",
    title: "镜像仓库同步",
    date: "03-15 14:47",
    operator: "ops-bot",
    desc: "Nexus 代理缓存预热完成，共 1,284 层。",
    status: "done",
  },
  {
    id: "EVT-0003",
    title: "GPU 池扩容",
    date: "04-03 09:30",
    operator: "cluster-admin",
    desc: "gpu-pool 新增 8 × A100 节点，Volcano 队列刷新。",
    status: "done",
  },
  {
    id: "EVT-0004",
    title: "SLURM 作业系统接入",
    date: "05-21 17:05",
    operator: "hpc-op",
    desc: "NodeSet ibs9 上线，InfiniBand SR-IOV 就绪。",
    status: "done",
  },
  {
    id: "EVT-0005",
    title: "分布式训练压测",
    date: "今日 10:24",
    operator: "research-lab",
    desc: "FSDP 千卡对齐中，NCCL 集合通信基准第 3 轮。",
    status: "active",
    logs: [
      "10:24:01 NCCL_INIT OK / 1024 RANKS / IBS9",
      "10:31:47 ALLREDUCE BUSBW 141.2 GB/S (+6.4%)",
      "10:40:12 CKPT-0034 → juicefs://ckpt/fsdp",
      "10:52:00 第 4 轮基准排队 / ETA 18M",
    ],
  },
  {
    id: "EVT-0006",
    title: "跨区容灾演练",
    date: "09-01 02:00",
    operator: "待定",
    desc: "etcd 快照恢复 + 控制平面重建预演。",
    status: "future",
  },
  {
    id: "EVT-0007",
    title: "训练队列开放申请",
    date: "10-08 09:00",
    operator: "待定",
    desc: "导师配额发放，学生作业队列开放。",
    status: "future",
  },
];

/** 状态 → 徽章配色 */
const STATUS_META: Record<EventStatus, { label: string; color: string }> = {
  done: { label: "已完成", color: COLORS.gold },
  active: { label: "进行中", color: COLORS.red },
  future: { label: "未开始", color: COLORS.industrialBlack },
};

/** 几何节点 — 几何构成的四种符号 */
const SHAPES: ShapeKind[] = ["square", "diamond", "circle", "triangle"];

const SHAPE_ACCENT: Record<ShapeKind, string> = {
  square: COLORS.red,
  diamond: COLORS.gold,
  circle: COLORS.electricCyan,
  triangle: COLORS.black,
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "done", label: "已完成" },
  { key: "active", label: "进行中" },
];

// === 零件 ===

/** 节点几何符号 — 正方 / 菱形 / 圆环 / 三角 */
function NodeMark({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case "square":
      return (
        <Box w="11px" h="11px" bg={COLORS.red} border={`2px solid ${COLORS.black}`} />
      );
    case "diamond":
      return (
        <Box
          w="10px"
          h="10px"
          bg={COLORS.gold}
          border={`2px solid ${COLORS.black}`}
          transform="rotate(45deg)"
        />
      );
    case "circle":
      return (
        <Box w="12px" h="12px" borderRadius="50%" border={`3px solid ${COLORS.electricCyan}`} />
      );
    case "triangle":
      return (
        <Box
          w={0}
          h={0}
          borderLeft="6px solid transparent"
          borderRight="6px solid transparent"
          borderBottom={`10px solid ${COLORS.black}`}
        />
      );
  }
}

/** 日期戳 — 单色等宽芯片 */
function DateStamp({ date, accent }: { date: string; accent: string }) {
  return (
    <Flex
      align="center"
      gap="5px"
      px="6px"
      py="3px"
      bg={COLORS.pureWhite}
      border={`1px solid ${COLORS.black}`}
      flexShrink={0}
    >
      <Box w="4px" h="4px" bg={accent} flexShrink={0} />
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="10px"
        letterSpacing="0.05em"
        color={COLORS.black}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {date}
      </Text>
    </Flex>
  );
}

/** 状态徽章 — 进行中带脉冲红点 */
function StatusChip({ status }: { status: EventStatus }) {
  const meta = STATUS_META[status];
  const isFuture = status === "future";
  return (
    <Flex
      align="center"
      gap="5px"
      px="5px"
      py="2px"
      flexShrink={0}
      border={`1px ${isFuture ? "dashed" : "solid"} ${isFuture ? COLORS.industrialBlack : meta.color}`}
      bg={status === "active" ? `${COLORS.red}0f` : "transparent"}
    >
      {status === "active" ? (
        <Box
          w="6px"
          h="6px"
          bg={COLORS.red}
          flexShrink={0}
          animation="tl-pulse 1.4s infinite"
          sx={{
            "@keyframes tl-pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.3 },
              "100%": { opacity: 1 },
            },
          }}
        />
      ) : (
        <Box w="5px" h="5px" bg={meta.color} opacity={isFuture ? 0.5 : 1} flexShrink={0} />
      )}
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.bold}
        fontSize="9px"
        letterSpacing="0.06em"
        color={isFuture ? COLORS.industrialBlack : meta.color}
      >
        {meta.label}
      </Text>
    </Flex>
  );
}

/** 事件卡片 — 白底 / 重黑边 / 硬阴影 */
function EventCard({
  event,
  accent,
  expanded,
  onToggle,
}: {
  event: MissionEvent;
  accent: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isFuture = event.status === "future";
  const isActive = event.status === "active";
  const hasLogs = Boolean(event.logs);

  return (
    <Box
      bg={isFuture ? COLORS.concrete : COLORS.pureWhite}
      border={
        isFuture
          ? `2px dashed ${COLORS.industrialBlack}`
          : `${BORDER.heavy} ${COLORS.black}`
      }
      borderLeft={isActive ? `6px solid ${COLORS.red}` : undefined}
      boxShadow={isActive ? SHADOW.red : isFuture ? SHADOW.none : SHADOW.medium}
      p={{ base: "10px", md: "12px" }}
      opacity={isFuture ? 0.62 : 1}
      transition={`opacity ${DURATION.fast}s ease, box-shadow ${DURATION.fast}s ease`}
      _hover={isFuture ? { opacity: 0.85 } : { boxShadow: SHADOW.large }}
    >
      {/* 窄屏日期戳 — 收进卡片头部 */}
      <Flex display={{ base: "flex", md: "none" }} mb="6px">
        <DateStamp date={event.date} accent={accent} />
      </Flex>

      {/* 标题行 */}
      <Flex align="center" gap="8px">
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="12px"
          letterSpacing="0.03em"
          lineHeight={1.2}
          color={isFuture ? COLORS.industrialBlack : COLORS.black}
          flex={1}
        >
          {event.title}
        </Text>
        <StatusChip status={event.status} />
      </Flex>

      {/* 等宽元数据 */}
      <Text
        fontFamily={FONT.mono}
        fontSize="9px"
        letterSpacing="0.04em"
        color={COLORS.industrialBlack}
        opacity={0.8}
        mt="6px"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        操作人: {event.operator} · ID: {event.id}
      </Text>

      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.regular}
        fontSize="11px"
        lineHeight={1.5}
        color={COLORS.industrialBlack}
        mt="5px"
      >
        {event.desc}
      </Text>

      {/* 展开日志 */}
      {hasLogs && (
        <>
          <Flex
            as="button"
            mt="8px"
            px="6px"
            py="3px"
            align="center"
            gap="6px"
            width="fit-content"
            bg={expanded ? COLORS.black : COLORS.pureWhite}
            border={`2px solid ${COLORS.black}`}
            cursor="pointer"
            transition={`background ${DURATION.instant}s ease`}
            _hover={{ bg: expanded ? COLORS.industrialBlack : COLORS.concrete }}
            onClick={onToggle}
            aria-expanded={expanded}
          >
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.05em"
              color={expanded ? COLORS.gold : COLORS.red}
            >
              {expanded ? "收起日志 ↑" : "查看详情 ↓"}
            </Text>
          </Flex>

          {expanded && (
            <Box mt="8px" bg={COLORS.black} p="8px" border={`2px solid ${COLORS.black}`}>
              {event.logs?.map((line, idx) => (
                <Flex key={idx} gap="8px" align="baseline" py="2px">
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    color={COLORS.gold}
                    flexShrink={0}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="9px"
                    letterSpacing="0.03em"
                    color={COLORS.metalWhite}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {line}
                  </Text>
                </Flex>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

// === 场景 ===

export default function SceneTimeline() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? EVENTS : EVENTS.filter((e) => e.status === filter)),
    [filter]
  );

  const countFor = (key: FilterKey) =>
    key === "all" ? EVENTS.length : EVENTS.filter((e) => e.status === key).length;

  const activeFilterLabel = FILTERS.find((f) => f.key === filter)?.label ?? "全部";

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} gap={SPACE.sm} overflow="hidden">
      {/* 标题 + 过滤芯片 */}
      <Flex align="center" gap={SPACE.sm} flexWrap="wrap" flexShrink={0}>
        <Box w="14px" h="14px" bg={COLORS.red} boxShadow={SHADOW.small} flexShrink={0} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="13px"
          letterSpacing="0.04em"
          color={COLORS.black}
          flexShrink={0}
        >
          任务时间轴
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          letterSpacing="0.06em"
          color={COLORS.industrialBlack}
          opacity={0.65}
          display={{ base: "none", md: "block" }}
          flexShrink={0}
        >
          // MISSION TIMELINE
        </Text>
        <Box flex={1} h="2px" bg={COLORS.black} opacity={0.12} minWidth="10px" />
        <Flex gap="6px" flexShrink={0}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Flex
                key={f.key}
                as="button"
                align="center"
                gap="6px"
                px="8px"
                py="3px"
                bg={active ? COLORS.black : COLORS.pureWhite}
                border={`2px solid ${active ? COLORS.red : COLORS.black}`}
                boxShadow={active ? `3px 3px 0px ${COLORS.red}` : SHADOW.small}
                cursor="pointer"
                transition={`all ${DURATION.instant}s ease`}
                _hover={active ? { transform: "translateY(-1px)" } : { bg: COLORS.concrete }}
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
              >
                {active && <Box w="5px" h="5px" bg={COLORS.redLight} flexShrink={0} />}
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="10px"
                  letterSpacing="0.05em"
                  color={active ? COLORS.pureWhite : COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {f.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={active ? COLORS.gold : COLORS.industrialBlack}
                  opacity={active ? 1 : 0.55}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {countFor(f.key)}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>

      {/* 遥测条 — 黑色仪表读数 */}
      <Flex align="center" gap="8px" bg={COLORS.black} px="10px" py="5px" flexShrink={0}>
        <Box w="6px" h="6px" bg={filter === "all" ? COLORS.gold : COLORS.redLight} flexShrink={0} />
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="9px"
          letterSpacing="0.05em"
          color={COLORS.metalWhite}
          sx={{ fontVariantNumeric: "tabular-nums" }}
          flexShrink={0}
        >
          过滤: {activeFilterLabel} · 显示 {visible.length}/{EVENTS.length} 事件
        </Text>
        <Box flex={1} h="1px" bg={`${COLORS.pureWhite}26`} />
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          letterSpacing="0.08em"
          color={COLORS.electricCyan}
          flexShrink={0}
        >
          SCROLL ▼
        </Text>
      </Flex>

      {/* 时间轴主体 — 可滚动 */}
      <Box flex={1} minH={0} overflowY="auto">
        <Box position="relative" pt="4px" pb="46px">
          {/* 红色竖轨 — 3px，窄屏靠左 / 宽屏居中 */}
          <Box
            position="absolute"
            top="10px"
            bottom="42px"
            w="3px"
            bg={COLORS.red}
            left={{ base: "20px", md: "50%" }}
            transform="translateX(-50%)"
          />

          {/* 轨道终点 — 黑色菱形终结符 */}
          <Box
            position="absolute"
            bottom="20px"
            left={{ base: "20px", md: "50%" }}
            transform="translateX(-50%) rotate(45deg)"
            w="9px"
            h="9px"
            bg={COLORS.black}
          />
          <Text
            position="absolute"
            bottom="16px"
            left={{ base: "34px", md: "calc(50% + 16px)" }}
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.08em"
            color={COLORS.industrialBlack}
            opacity={0.6}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            LOG END // {EVENTS.length} EVENTS
          </Text>

          {/* 事件行 */}
          {visible.map((event, i) => {
            const shape = SHAPES[i % SHAPES.length];
            const accent = SHAPE_ACCENT[shape];
            const cardOnLeft = i % 2 === 0; // 宽屏下卡片左右交替
            const isDim = event.status === "future";
            // 非对称间距 — 进行中事件两侧留出仪式感
            const marginBottom =
              event.status === "active" ? "28px" : `${14 + ((i * 5) % 3) * 6}px`;

            return (
              <Box
                key={event.id}
                position="relative"
                pl={{ base: "44px", md: 0 }}
                mb={marginBottom}
              >
                {/* 节点符号 — 骑在轨上 */}
                <Box
                  position="absolute"
                  top="9px"
                  left={{ base: "20px", md: "50%" }}
                  transform="translateX(-50%)"
                  zIndex={1}
                >
                  <Flex
                    w="18px"
                    h="18px"
                    align="center"
                    justify="center"
                    bg={COLORS.concrete}
                    opacity={isDim ? 0.55 : 1}
                  >
                    <NodeMark kind={shape} />
                  </Flex>
                </Box>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 0, md: "12px" }}>
                  {/* 左列 */}
                  {cardOnLeft ? (
                    <Flex
                      justify={{ md: "flex-end" }}
                      pr={{ md: "26px" }}
                      align="flex-start"
                    >
                      <Box w="100%" maxW={{ md: "310px" }}>
                        <EventCard
                          event={event}
                          accent={accent}
                          expanded={expanded}
                          onToggle={() => setExpanded((v) => !v)}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <Flex
                      display={{ base: "none", md: "flex" }}
                      align="center"
                      justify="flex-end"
                      pr="26px"
                      pt="10px"
                    >
                      <DateStamp date={event.date} accent={accent} />
                      <Box w="14px" h="2px" bg={COLORS.black} opacity={0.6} flexShrink={0} />
                    </Flex>
                  )}

                  {/* 右列 */}
                  {cardOnLeft ? (
                    <Flex
                      display={{ base: "none", md: "flex" }}
                      align="center"
                      justify="flex-start"
                      pl="26px"
                      pt="10px"
                    >
                      <Box w="14px" h="2px" bg={COLORS.black} opacity={0.6} flexShrink={0} />
                      <DateStamp date={event.date} accent={accent} />
                    </Flex>
                  ) : (
                    <Flex justify={{ md: "flex-start" }} pl={{ md: "26px" }} align="flex-start">
                      <Box w="100%" maxW={{ md: "310px" }}>
                        <EventCard
                          event={event}
                          accent={accent}
                          expanded={expanded}
                          onToggle={() => setExpanded((v) => !v)}
                        />
                      </Box>
                    </Flex>
                  )}
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Flex>
  );
}
