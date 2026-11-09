import { useMemo, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

// === TYPES ===

type NodeStatus = "运行中" | "待定" | "错误";
type SortKey = "id" | "name" | "status" | "value" | "updatedAt";
type SortDir = "asc" | "desc";
type SortState = { key: SortKey; dir: SortDir } | null;

interface NodeRow {
  id: string;
  name: string;
  status: NodeStatus;
  value: number;
  updatedAt: string;
}

// === DATA ===

const NODES: NodeRow[] = [
  { id: "ND-1047", name: "等离子切割臂", status: "运行中", value: 98.4, updatedAt: "09:14:22" },
  { id: "ND-1046", name: "液压稳定平台", status: "待定", value: 212.7, updatedAt: "09:13:58" },
  { id: "ND-1045", name: "光学检测阵列", status: "错误", value: 4.8, updatedAt: "09:13:41" },
  { id: "ND-1044", name: "伺服传送带 C-2", status: "运行中", value: 1240, updatedAt: "09:12:37" },
  { id: "ND-1043", name: "冷却回路泵组", status: "待定", value: 67.3, updatedAt: "09:11:55" },
  { id: "ND-1042", name: "焊接机器人 W-7", status: "错误", value: 0, updatedAt: "09:10:12" },
  { id: "ND-1041", name: "粉末喷涂舱", status: "运行中", value: 45.6, updatedAt: "09:09:48" },
  { id: "ND-1040", name: "总装夹具平台", status: "待定", value: 830.2, updatedAt: "09:08:03" },
];

/** 状态元数据 — 颜色 + 排序权重（运行中 → 待定 → 错误） */
const STATUS_META: Record<NodeStatus, { color: string; rank: number }> = {
  运行中: { color: COLORS.statusGreen, rank: 0 },
  待定: { color: COLORS.statusAmber, rank: 1 },
  错误: { color: COLORS.statusRed, rank: 2 },
};

// === COLUMNS ===

interface ColumnDef {
  key: SortKey;
  label: string;
  width: string;
  align: "left" | "right";
}

const COLUMNS: ColumnDef[] = [
  { key: "id", label: "编号", width: "88px", align: "left" },
  { key: "name", label: "名称", width: "1fr", align: "left" },
  { key: "status", label: "状态", width: "104px", align: "left" },
  { key: "value", label: "数值", width: "88px", align: "right" },
  { key: "updatedAt", label: "更新时间", width: "88px", align: "left" },
];

const GRID_COLS = COLUMNS.map((c) => c.width).join(" ");

/** 多类型比较器 — string / number / status-rank */
const compareRows = (a: NodeRow, b: NodeRow, key: SortKey): number => {
  switch (key) {
    case "value":
      return a.value - b.value;
    case "status":
      return STATUS_META[a.status].rank - STATUS_META[b.status].rank;
    case "name":
      return a.name.localeCompare(b.name, "zh-Hans-CN");
    case "id":
      return a.id.localeCompare(b.id);
    case "updatedAt":
      return a.updatedAt.localeCompare(b.updatedAt);
  }
};

// === SCENE ===

export default function SceneSortableTable() {
  const [sort, setSort] = useState<SortState>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 排序：升 → 降 → 无 三态循环
  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const toggleSelect = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  const sorted = useMemo(() => {
    if (!sort) return NODES;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...NODES].sort((a, b) => {
      const base = compareRows(a, b, sort.key);
      return base !== 0 ? dir * base : a.id.localeCompare(b.id);
    });
  }, [sort]);

  const activeLabel = sort
    ? `${COLUMNS.find((c) => c.key === sort.key)?.label ?? ""} ${
        sort.dir === "asc" ? "↑" : "↓"
      }`
    : "无";

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} p={SPACE.sm} gap={SPACE.sm} overflow="hidden">
      {/* 标题行 */}
      <Flex align="center" gap={SPACE.sm} flexShrink={0}>
        <Box w="14px" h="14px" bg={COLORS.red} boxShadow={SHADOW.small} flexShrink={0} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="13px"
          letterSpacing="0.04em"
          color={COLORS.black}
          flexShrink={0}
        >
          装配线节点表
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
          // NODE TELEMETRY GRID
        </Text>
        <Box flex={1} h="2px" bg={COLORS.black} opacity={0.12} minWidth="12px" />
      </Flex>

      {/* 排序状态条 — 单色仪表读数 */}
      <Flex
        align="center"
        gap={SPACE.sm}
        bg={COLORS.black}
        px="10px"
        py="6px"
        flexShrink={0}
      >
        <Box
          w="6px"
          h="6px"
          bg={sort ? COLORS.redLight : COLORS.gold}
          flexShrink={0}
        />
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          letterSpacing="0.04em"
          color={COLORS.metalWhite}
          sx={{ fontVariantNumeric: "tabular-nums" }}
          flexShrink={0}
        >
          排序:{" "}
          <Text as="span" color={sort ? COLORS.redLight : COLORS.metalWhite} opacity={sort ? 1 : 0.55}>
            {activeLabel}
          </Text>
          {" · "}
          {sorted.length} 条
        </Text>
        <Box flex={1} h="1px" bg={`${COLORS.pureWhite}26`} />
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          letterSpacing="0.08em"
          color={COLORS.gold}
          opacity={0.85}
          flexShrink={0}
        >
          CLICK HEADER ▲▼
        </Text>
      </Flex>

      {/* 表格卡片 */}
      <Flex
        direction="column"
        flex={1}
        minH={0}
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        overflow="hidden"
      >
        <Box flex={1} minH={0} overflow="auto">
          <Box minW="640px">
            {/* 表头 — 黑色，粘性，硬阴影 */}
            <Grid
              templateColumns={GRID_COLS}
              gap={SPACE.sm}
              bg={COLORS.black}
              px={SPACE.md}
              position="sticky"
              top={0}
              zIndex={1}
              boxShadow={`0 3px 0 ${COLORS.black}33`}
            >
              {COLUMNS.map((col, i) => {
                const asc = sort !== null && sort.key === col.key && sort.dir === "asc";
                const desc = sort !== null && sort.key === col.key && sort.dir === "desc";
                const isActive = asc || desc;
                return (
                  <Box
                    key={col.key}
                    role="columnheader"
                    aria-sort={asc ? "ascending" : desc ? "descending" : "none"}
                    display="flex"
                    alignItems="stretch"
                    borderRight={
                      i < COLUMNS.length - 1
                        ? `1px solid ${COLORS.pureWhite}14`
                        : undefined
                    }
                    borderBottom={`3px solid ${isActive ? COLORS.redLight : "transparent"}`}
                  >
                    <Flex
                      as="button"
                      flex={1}
                      align="center"
                      justify={col.align === "right" ? "flex-end" : "flex-start"}
                      gap="5px"
                      px="6px"
                      py="8px"
                      bg="transparent"
                      border="none"
                      cursor="pointer"
                      transition={`background ${DURATION.instant}s ease`}
                      _hover={{ bg: COLORS.industrialBlack }}
                      onClick={() => toggleSort(col.key)}
                      aria-label={`按${col.label}排序`}
                    >
                      <Text
                        fontFamily={FONT.sans}
                        fontWeight={WEIGHT.black}
                        fontSize="10px"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color={COLORS.pureWhite}
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {col.label}
                      </Text>
                      {/* 排序指示器 — 活动向导红色，非活动金属白弱化 */}
                      <Flex direction="column" gap="1px" alignItems="center" flexShrink={0}>
                        <Text
                          fontSize="6px"
                          lineHeight={1}
                          color={asc ? COLORS.redLight : COLORS.metalWhite}
                          opacity={asc ? 1 : 0.35}
                        >
                          ▲
                        </Text>
                        <Text
                          fontSize="6px"
                          lineHeight={1}
                          color={desc ? COLORS.redLight : COLORS.metalWhite}
                          opacity={desc ? 1 : 0.35}
                        >
                          ▼
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>

            {/* 数据行 */}
            {sorted.map((node) => {
              const selected = selectedId === node.id;
              const sc = STATUS_META[node.status].color;
              return (
                <Grid
                  key={node.id}
                  templateColumns={GRID_COLS}
                  gap={SPACE.sm}
                  alignItems="center"
                  px={SPACE.md}
                  py="7px"
                  bg={selected ? `${COLORS.red}0d` : COLORS.pureWhite}
                  boxShadow={selected ? `inset 3px 0 0 ${COLORS.red}` : undefined}
                  borderBottom={`${BORDER.hairline} ${COLORS.black}40`}
                  cursor="pointer"
                  transition={`background ${DURATION.instant}s ease`}
                  _hover={{ bg: selected ? `${COLORS.red}17` : COLORS.concrete }}
                  _last={{ borderBottom: "none" }}
                  onClick={() => toggleSelect(node.id)}
                  role="button"
                  aria-pressed={selected}
                  aria-label={`节点 ${node.id} ${node.name}`}
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="12px"
                    color={selected ? COLORS.red : COLORS.black}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {node.id}
                  </Text>

                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="12px"
                    color={COLORS.black}
                  >
                    {node.name}
                  </Text>

                  {/* 状态徽章 */}
                  <Flex
                    align="center"
                    gap="5px"
                    w="fit-content"
                    px="6px"
                    py="2px"
                    border={`1px solid ${sc}`}
                  >
                    <Box w="5px" h="5px" bg={sc} flexShrink={0} />
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.bold}
                      fontSize="10px"
                      letterSpacing="0.04em"
                      color={sc}
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {node.status}
                    </Text>
                  </Flex>

                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="12px"
                    color={COLORS.electricCyan}
                    textAlign="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {node.value.toFixed(1)}
                  </Text>

                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.industrialBlack}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {node.updatedAt}
                  </Text>
                </Grid>
              );
            })}
          </Box>
        </Box>

        {/* 底部金色仪器线 */}
        <Box h="3px" bg={COLORS.gold} flexShrink={0} />
      </Flex>
    </Flex>
  );
}
