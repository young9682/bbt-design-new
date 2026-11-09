import { useMemo, useState } from "react";
import { Box, Flex, Grid, Select, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

// === DATA ===

type ItemType = "sensor" | "compute" | "power" | "struct";
type ItemStatus = "online" | "maint" | "offline";
type FacetGroupId = "type" | "status" | "rating";
type SortKey = "id" | "rating" | "name";

interface Item {
  id: string;
  name: string;
  type: ItemType;
  status: ItemStatus;
  rating: number;
  meta: string;
  geom: { w: number; c: string }[];
}

const TYPE_LABEL: Record<ItemType, string> = {
  sensor: "传感器",
  compute: "计算模块",
  power: "电源",
  struct: "结构件",
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  online: "在线",
  maint: "维护",
  offline: "离线",
};

const STATUS_COLOR: Record<ItemStatus, string> = {
  online: COLORS.signalGreen,
  maint: COLORS.statusAmber,
  offline: COLORS.industrialBlack,
};

// Geometric thumbnail palette — color bars
const GEO_COLORS: Record<string, string> = {
  r: COLORS.red,
  g: COLORS.gold,
  c: COLORS.electricCyan,
  k: COLORS.black,
  o: COLORS.velocityOrange,
  w: COLORS.metalWhite,
};

// "3r 1g 2c" → [ {w:3, red}, {w:1, gold}, {w:2, cyan} ]
const geom = (spec: string): { w: number; c: string }[] =>
  spec.split(" ").map((seg) => ({ w: Number(seg[0]), c: GEO_COLORS[seg.slice(1)] }));

const ITEMS: Item[] = [
  { id: "MOD-01", name: "光谱传感器 S-200", type: "sensor", status: "online", rating: 4.8, meta: "12W", geom: geom("3r 1g 2c 1w") },
  { id: "MOD-02", name: "计算核心 CORE-C", type: "compute", status: "online", rating: 4.6, meta: "45W", geom: geom("1k 3c 1r 2w") },
  { id: "MOD-03", name: "电源阵列 P-77", type: "power", status: "maint", rating: 4.2, meta: "240W", geom: geom("2g 1k 1c 2r") },
  { id: "MOD-04", name: "桁架结构件 T-12", type: "struct", status: "offline", rating: 3.4, meta: "4.2kg", geom: geom("1w 2k 1g 1c") },
  { id: "MOD-05", name: "温度探头 T-900", type: "sensor", status: "maint", rating: 4.0, meta: "3W", geom: geom("2c 1r 1w 3k") },
  { id: "MOD-06", name: "边缘计算 E-33", type: "compute", status: "offline", rating: 3.8, meta: "18W", geom: geom("1o 2w 1r 2k") },
  { id: "MOD-07", name: "太阳能板 S-450", type: "power", status: "online", rating: 4.9, meta: "450W", geom: geom("3g 1c 2r 1w") },
  { id: "MOD-08", name: "振动模块 V-11", type: "sensor", status: "online", rating: 3.9, meta: "5W", geom: geom("1r 1w 3c 1g") },
  { id: "MOD-09", name: "冗余电源 R-08", type: "power", status: "offline", rating: 4.1, meta: "360W", geom: geom("2k 1g 2w 1r") },
  { id: "MOD-10", name: "协处理器 C-55", type: "compute", status: "maint", rating: 4.4, meta: "28W", geom: geom("1c 3r 1k 1g") },
];

// === FACETS ===

interface FacetOption {
  id: string;
  label: string;
}
interface FacetGroup {
  id: FacetGroupId;
  label: string;
  code: string;
  marker: string;
  options: FacetOption[];
}

const FACET_GROUPS: FacetGroup[] = [
  {
    id: "type",
    label: "类型",
    code: "TYPE",
    marker: COLORS.red,
    options: [
      { id: "sensor", label: "传感器" },
      { id: "compute", label: "计算模块" },
      { id: "power", label: "电源" },
      { id: "struct", label: "结构件" },
    ],
  },
  {
    id: "status",
    label: "状态",
    code: "STATUS",
    marker: COLORS.gold,
    options: [
      { id: "online", label: "在线" },
      { id: "maint", label: "维护" },
      { id: "offline", label: "离线" },
    ],
  },
  {
    id: "rating",
    label: "评分",
    code: "RATING",
    marker: COLORS.electricCyan,
    options: [
      { id: "a", label: "A ≥ 4.5" },
      { id: "b", label: "B 4.0+" },
      { id: "c", label: "C < 4.0" },
    ],
  },
];

const ratingBucket = (r: number): string => (r >= 4.5 ? "a" : r >= 4.0 ? "b" : "c");

const facetValue = (item: Item, group: FacetGroupId): string =>
  group === "type" ? item.type : group === "status" ? item.status : ratingBucket(item.rating);

const SORTERS: Record<SortKey, (a: Item, b: Item) => number> = {
  id: (a, b) => a.id.localeCompare(b.id),
  rating: (a, b) => b.rating - a.rating || a.id.localeCompare(b.id),
  name: (a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"),
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id", label: "SORT · 编号" },
  { value: "rating", label: "SORT · 评分" },
  { value: "name", label: "SORT · 名称" },
];

// === SUBCOMPONENTS ===

function ResultCard({ item }: { item: Item }) {
  const sc = STATUS_COLOR[item.status];
  const filled = Math.round(item.rating);
  return (
    <Flex
      direction="column"
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      overflow="hidden"
      transition={`all ${DURATION.fast}s ease`}
      _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
    >
      {/* Geometric thumbnail — color composition */}
      <Flex h="34px" flexShrink={0} borderBottom={`${BORDER.standard} ${COLORS.black}`}>
        {item.geom.map((g, i) => (
          <Box key={i} flex={g.w} h="100%" bg={g.c} />
        ))}
      </Flex>

      <Flex direction="column" flex={1} p="8px">
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="11px"
          lineHeight={1.25}
          letterSpacing="0.02em"
          color={COLORS.black}
          noOfLines={2}
          mb="4px"
        >
          {item.name}
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.04em"
          color={COLORS.industrialBlack}
          sx={{ fontVariantNumeric: "tabular-nums" }}
          noOfLines={1}
        >
          {item.id} · {TYPE_LABEL[item.type]} · {item.meta}
        </Text>
        <Flex justify="space-between" align="flex-end" mt="auto" pt="8px">
          <Flex align="center" gap="4px" px="4px" py="2px" border={`1px solid ${sc}`}>
            <Box w="5px" h="5px" bg={sc} />
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.06em"
              color={COLORS.black}
            >
              {STATUS_LABEL[item.status]}
            </Text>
          </Flex>
          <Flex align="center" gap="2px" aria-label={`评分 ${item.rating}`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Box
                key={n}
                w="5px"
                h="5px"
                border={`1px solid ${COLORS.industrialBlack}`}
                bg={n <= filled ? COLORS.gold : COLORS.pureWhite}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

function EmptyStrip({ onClear }: { onClear: () => void }) {
  return (
    <Flex
      align="center"
      gap="12px"
      bg={COLORS.pureWhite}
      border={`${BORDER.standard} ${COLORS.black}`}
      boxShadow={SHADOW.small}
      px="14px"
      py="12px"
    >
      <Box w="16px" h="16px" bg={COLORS.gold} flexShrink={0} />
      <Box minW="0">
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="12px"
          color={COLORS.black}
        >
          无匹配结果
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          color={COLORS.industrialBlack}
          mt="2px"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          NO MATCH // 调整或清除筛选条件
        </Text>
      </Box>
      <Flex
        as="button"
        role="group"
        ml="auto"
        flexShrink={0}
        align="center"
        justify="center"
        h="24px"
        px="10px"
        border={`${BORDER.standard} ${COLORS.black}`}
        cursor="pointer"
        transition={`all ${DURATION.instant}s ease`}
        _hover={{ bg: COLORS.red, borderColor: COLORS.redDark }}
        onClick={onClear}
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="9px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={COLORS.black}
          _groupHover={{ color: COLORS.pureWhite }}
        >
          清除全部
        </Text>
      </Flex>
    </Flex>
  );
}

// === SCENE ===

export default function SceneFilterResults() {
  const [active, setActive] = useState<Record<FacetGroupId, string[]>>({
    type: [],
    status: [],
    rating: [],
  });
  const [sort, setSort] = useState<SortKey>("id");

  const itemMatches = (item: Item, skip?: FacetGroupId) =>
    FACET_GROUPS.every(
      (g) =>
        g.id === skip ||
        active[g.id].length === 0 ||
        active[g.id].includes(facetValue(item, g.id))
    );

  const results = useMemo(
    () => ITEMS.filter((it) => itemMatches(it)).sort(SORTERS[sort]),
    [active, sort]
  );

  // Faceted counts — each option counted against all OTHER active groups
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of FACET_GROUPS) {
      for (const o of g.options) {
        map[`${g.id}:${o.id}`] = ITEMS.filter(
          (it) => itemMatches(it, g.id) && facetValue(it, g.id) === o.id
        ).length;
      }
    }
    return map;
  }, [active]);

  const activeChips = useMemo(
    () =>
      FACET_GROUPS.flatMap((g) =>
        active[g.id].map((oid) => ({
          key: `${g.id}:${oid}`,
          group: g.id,
          id: oid,
          label: g.options.find((o) => o.id === oid)?.label ?? oid,
        }))
      ),
    [active]
  );

  const activeCount = activeChips.length;

  const toggle = (g: FacetGroupId, oid: string) =>
    setActive((prev) => ({
      ...prev,
      [g]: prev[g].includes(oid)
        ? prev[g].filter((v) => v !== oid)
        : [...prev[g], oid],
    }));

  const clearAll = () => setActive({ type: [], status: [], rating: [] });

  return (
    <Flex h="100%" bg={COLORS.concrete} overflow="hidden">
      {/* Filter sidebar — desktop */}
      <Box
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        w="140px"
        flexShrink={0}
        bg={COLORS.pureWhite}
        borderRight={`1px solid ${COLORS.black}59`}
      >
        {/* Instrument line */}
        <Flex h="3px" flexShrink={0}>
          <Box flex={3} bg={COLORS.red} />
          <Box flex={7} bg={COLORS.metalWhite} />
        </Flex>

        <Flex
          align="center"
          gap="6px"
          px="10px"
          h="28px"
          flexShrink={0}
          borderBottom={`1px solid ${COLORS.black}26`}
        >
          <Box w="8px" h="8px" bg={COLORS.red} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="10px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={COLORS.black}
          >
            筛选 // FACET
          </Text>
        </Flex>

        {/* Facet groups */}
        <Box flex={1} overflowY="auto" px="10px" py="8px">
          {FACET_GROUPS.map((g) => (
            <Box key={g.id} mb="10px">
              <Flex align="center" gap="5px" mb="3px">
                <Box w="5px" h="5px" bg={g.marker} />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="9px"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color={COLORS.industrialBlack}
                >
                  {g.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="7px"
                  letterSpacing="0.08em"
                  color={COLORS.industrialBlack}
                  opacity={0.5}
                  ml="auto"
                >
                  {g.code}
                </Text>
              </Flex>
              {g.options.map((o) => {
                const checked = active[g.id].includes(o.id);
                const cnt = counts[`${g.id}:${o.id}`];
                return (
                  <Flex
                    key={o.id}
                    as="button"
                    w="100%"
                    align="center"
                    gap="7px"
                    py="3px"
                    px="0"
                    bg="transparent"
                    border="none"
                    textAlign="left"
                    cursor="pointer"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggle(g.id, o.id)}
                    transition={`background ${DURATION.instant}s ease`}
                    _hover={{ bg: `${COLORS.black}0a` }}
                  >
                    <Box
                      w="11px"
                      h="11px"
                      flexShrink={0}
                      border={`2px solid ${checked ? COLORS.redDark : COLORS.industrialBlack}`}
                      bg={checked ? COLORS.red : COLORS.pureWhite}
                      transition={`all ${DURATION.instant}s ease`}
                    />
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="10px"
                      lineHeight={1.3}
                      color={checked ? COLORS.black : COLORS.industrialBlack}
                      noOfLines={1}
                    >
                      {o.label}
                    </Text>
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="9px"
                      ml="auto"
                      color={COLORS.industrialBlack}
                      opacity={cnt === 0 ? 0.35 : 0.75}
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {cnt}
                    </Text>
                  </Flex>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Clear all */}
        <Box px="10px" py="10px" flexShrink={0} borderTop={`1px solid ${COLORS.black}26`}>
          <Flex
            as="button"
            role="group"
            justify="center"
            align="center"
            h="26px"
            w="100%"
            border={`${BORDER.standard} ${activeCount > 0 ? COLORS.red : COLORS.industrialBlack}`}
            opacity={activeCount > 0 ? 1 : 0.45}
            cursor={activeCount > 0 ? "pointer" : "not-allowed"}
            transition={`all ${DURATION.instant}s ease`}
            _hover={
              activeCount > 0
                ? { bg: COLORS.red, borderColor: COLORS.redDark }
                : undefined
            }
            onClick={activeCount > 0 ? clearAll : undefined}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={COLORS.black}
              sx={{ pointerEvents: "none" }}
              _groupHover={{ color: COLORS.pureWhite }}
            >
              清除全部
            </Text>
          </Flex>
        </Box>
      </Box>

      {/* Content column */}
      <Flex direction="column" flex={1} minW="0">
        {/* Mobile facet chip row */}
        <Flex
          display={{ base: "flex", md: "none" }}
          gap="6px"
          px="10px"
          py="8px"
          bg={COLORS.pureWhite}
          borderBottom={`1px solid ${COLORS.black}26`}
          overflowX="auto"
          flexShrink={0}
        >
          {activeCount > 0 && (
            <Flex
              as="button"
              flexShrink={0}
              align="center"
              h="22px"
              px="7px"
              border={`2px solid ${COLORS.redDark}`}
              cursor="pointer"
              onClick={clearAll}
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.06em"
                color={COLORS.red}
              >
                清除 ×
              </Text>
            </Flex>
          )}
          {FACET_GROUPS.flatMap((g) =>
            g.options.map((o) => {
              const on = active[g.id].includes(o.id);
              return (
                <Flex
                  key={`${g.id}-${o.id}`}
                  as="button"
                  flexShrink={0}
                  align="center"
                  gap="4px"
                  h="22px"
                  px="7px"
                  border={`2px solid ${on ? COLORS.redDark : COLORS.industrialBlack}`}
                  bg={on ? COLORS.red : COLORS.pureWhite}
                  cursor="pointer"
                  transition={`all ${DURATION.instant}s ease`}
                  onClick={() => toggle(g.id, o.id)}
                >
                  <Box w="5px" h="5px" bg={on ? COLORS.pureWhite : g.marker} />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    color={on ? COLORS.pureWhite : COLORS.black}
                  >
                    {o.label}
                  </Text>
                </Flex>
              );
            })
          )}
        </Flex>

        {/* Results top bar */}
        <Flex
          align="center"
          gap="8px"
          px="12px"
          py="7px"
          bg={COLORS.pureWhite}
          borderBottom={`1px solid ${COLORS.black}26`}
          flexShrink={0}
        >
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.04em"
            color={COLORS.black}
            flexShrink={0}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            共 {results.length} 个结果
          </Text>

          {/* Active filter chips */}
          <Flex
            display={{ base: "none", md: "flex" }}
            flex="1"
            minW="0"
            flexWrap="wrap"
            rowGap="4px"
            gap="4px"
            align="center"
          >
            {activeChips.map((chip) => (
              <Flex
                key={chip.key}
                align="center"
                h="20px"
                pl="7px"
                pr="4px"
                border={`2px solid ${COLORS.red}`}
                bg={COLORS.pureWhite}
                flexShrink={0}
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="9px"
                  color={COLORS.black}
                >
                  {chip.label}
                </Text>
                <Flex
                  as="button"
                  ml="5px"
                  w="12px"
                  h="12px"
                  align="center"
                  justify="center"
                  bg={COLORS.red}
                  cursor="pointer"
                  transition={`background ${DURATION.instant}s ease`}
                  _hover={{ bg: COLORS.redDark }}
                  onClick={() => toggle(chip.group, chip.id)}
                  aria-label={`移除筛选 ${chip.label}`}
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="10px"
                    lineHeight={1}
                    color={COLORS.pureWhite}
                    sx={{ pointerEvents: "none" }}
                  >
                    ×
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>

          {/* Sort select */}
          <Select
            ml="auto"
            flexShrink={0}
            w={{ base: "104px", md: "116px" }}
            size="xs"
            borderRadius={0}
            border={`${BORDER.standard} ${COLORS.black}`}
            bg={COLORS.pureWhite}
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="9px"
            letterSpacing="0.04em"
            color={COLORS.black}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            iconColor={COLORS.red}
            _hover={{ borderColor: COLORS.red }}
            _focus={{ borderColor: COLORS.red, boxShadow: SHADOW.none }}
            sx={{ borderRadius: 0 }}
            aria-label="排序方式"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Flex>

        {/* Results grid */}
        <Box flex={1} overflowY="auto" p="12px" position="relative">
          {/* Decorative red wedge */}
          <Box
            position="absolute"
            top="0"
            right="0"
            w="90px"
            h="90px"
            bg={COLORS.red}
            clipPath="polygon(100% 0, 100% 100%, 0 0)"
            zIndex={0}
            opacity={0.9}
            pointerEvents="none"
          />
          {/* Decorative rotated gold square */}
          <Box
            position="absolute"
            bottom="16px"
            left="16px"
            w="28px"
            h="28px"
            border={`${BORDER.heavy} ${COLORS.gold}`}
            transform="rotate(45deg)"
            zIndex={0}
            opacity={0.7}
            pointerEvents="none"
          />

          {results.length === 0 ? (
            <Box position="relative" zIndex={1}>
              <EmptyStrip onClear={clearAll} />
            </Box>
          ) : (
            <Grid
              position="relative"
              zIndex={1}
              templateColumns={{ base: "repeat(2, 1fr)", "2xl": "repeat(3, 1fr)" }}
              gap="10px"
            >
              {results.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </Grid>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
