import { useMemo, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

/* ============================================================
   日历 / 时间轴
   时间是被规划的领土 — 网格即秩序，红色即当下
   ============================================================ */

type EventKind = "review" | "release" | "duty" | "ops";

interface CalEvent {
  time: string;
  label: string;
  kind: EventKind;
}

const KIND_COLOR: Record<EventKind, string> = {
  review: COLORS.red,
  release: COLORS.gold,
  duty: COLORS.electricCyan,
  ops: COLORS.velocityOrange,
};

const BASE_YEAR = 2026;
const BASE_MONTH = 7; // 八月
const TODAY_KEY = "2026-08-17";

const MONTH_CN = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];
const MONTH_EN = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const WEEKDAY_CN = ["一", "二", "三", "四", "五", "六", "日"];
const WEEK_CN_FULL = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 2026-08 排期 — 评审 / 发布 / 值班 / 运维 */
const EVENTS: Record<string, CalEvent[]> = {
  "2026-08-01": [{ time: "09:00", label: "值班开始", kind: "duty" }],
  "2026-08-03": [{ time: "14:00", label: "评审会议", kind: "review" }],
  "2026-08-05": [{ time: "22:00", label: "发布窗口", kind: "release" }],
  "2026-08-07": [
    { time: "09:00", label: "值班交接", kind: "duty" },
    { time: "10:30", label: "GPU 例检", kind: "ops" },
  ],
  "2026-08-10": [{ time: "14:00", label: "评审会议", kind: "review" }],
  "2026-08-12": [
    { time: "02:00", label: "集群维护", kind: "ops" },
    { time: "09:00", label: "值班交接", kind: "duty" },
  ],
  "2026-08-14": [{ time: "22:00", label: "发布窗口", kind: "release" }],
  "2026-08-17": [
    { time: "09:00", label: "值班交接", kind: "duty" },
    { time: "14:00", label: "评审会议", kind: "review" },
    { time: "18:00", label: "版本冻结", kind: "release" },
  ],
  "2026-08-19": [{ time: "09:00", label: "值班交接", kind: "duty" }],
  "2026-08-21": [
    { time: "16:00", label: "备份演练", kind: "ops" },
    { time: "22:00", label: "发布窗口", kind: "release" },
  ],
  "2026-08-24": [
    { time: "09:00", label: "值班交接", kind: "duty" },
    { time: "11:00", label: "容量规划", kind: "ops" },
    { time: "14:00", label: "评审会议", kind: "review" },
    { time: "17:00", label: "发布窗口", kind: "release" },
  ],
  "2026-08-26": [{ time: "09:00", label: "值班交接", kind: "duty" }],
  "2026-08-28": [{ time: "22:00", label: "发布窗口", kind: "release" }],
  "2026-08-31": [
    { time: "11:00", label: "月度复盘", kind: "ops" },
    { time: "14:00", label: "评审会议", kind: "review" },
  ],
};

const dateKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

interface DayCell {
  key: string;
  day: number;
  inMonth: boolean;
  weekend: boolean;
  dateKey: string;
  events: CalEvent[];
}

/** 本周时间带（W34: 08-17 ~ 08-23） */
const WEEK_BAR: { key: string; day: number; events: CalEvent[] }[] =
  Array.from({ length: 7 }, (_, i) => {
    const d = 17 + i;
    const k = dateKey(BASE_YEAR, BASE_MONTH, d);
    return { key: k, day: d, events: EVENTS[k] ?? [] };
  });

function MonthNavMarker({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const clip =
    dir === "prev"
      ? "polygon(100% 0, 100% 100%, 0 50%)"
      : "polygon(0 0, 100% 50%, 0 100%)";
  return (
    <Box
      as="button"
      aria-label={dir === "prev" ? "上一月" : "下一月"}
      w="26px"
      h="22px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="transparent"
      border="none"
      p={0}
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: COLORS.red }}
      sx={{ "&:hover > div": { bg: COLORS.pureWhite } }}
    >
      <Box w="9px" h="10px" bg={COLORS.red} sx={{ clipPath: clip }} />
    </Box>
  );
}

function DayCellBox({
  cell,
  isToday,
  isSelected,
  onSelect,
}: {
  cell: DayCell;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (key: string) => void;
}) {
  const bg = isToday
    ? COLORS.red
    : !cell.inMonth
      ? COLORS.concrete
      : cell.weekend
        ? COLORS.metalWhite
        : COLORS.pureWhite;

  return (
    <Flex
      direction="column"
      p="3px"
      h="100%"
      bg={bg}
      position="relative"
      overflow="hidden"
      borderRight={`${BORDER.hairline} ${COLORS.black}`}
      borderBottom={`${BORDER.hairline} ${COLORS.black}`}
      boxShadow={isSelected ? `inset 0 0 0 2px ${COLORS.black}` : undefined}
      zIndex={isSelected ? 1 : undefined}
      cursor={cell.inMonth ? "pointer" : "default"}
      onClick={cell.inMonth ? () => onSelect(cell.dateKey) : undefined}
      _hover={
        cell.inMonth && !isToday
          ? { bg: cell.weekend ? `${COLORS.red}14`: `${COLORS.red}0d` }
          : undefined
      }
      transition={`background-color ${DURATION.instant}s ease`}
    >
      {/* 今日角标 — 白色几何三角 */}
      {isToday && (
        <Box
          position="absolute"
          top={0}
          right={0}
          w={0}
          h={0}
          borderTop={`8px solid ${COLORS.pureWhite}d9`}
          borderLeft="8px solid transparent"
        />
      )}

      <Text
        fontFamily={FONT.mono}
        fontWeight={isToday ? WEIGHT.black : WEIGHT.bold}
        fontSize="9px"
        lineHeight={1}
        letterSpacing="0.05em"
        color={isToday ? COLORS.pureWhite : cell.inMonth ? COLORS.black : COLORS.industrialBlack}
        opacity={cell.inMonth ? (cell.weekend ? 0.65 : 0.9) : 0.25}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {String(cell.day).padStart(2, "0")}
      </Text>

      {/* 事件标记 — 几何方块 + 计数徽章 */}
      {cell.inMonth && cell.events.length > 0 && (
        <Flex mt="auto" gap="2px" align="center">
          {cell.events.slice(0, 3).map((e, i) => (
            <Box
              key={i}
              w="4px"
              h="4px"
              flexShrink={0}
              bg={KIND_COLOR[e.kind]}
              boxShadow={isToday ? `0 0 0 1px ${COLORS.pureWhite}` : undefined}
            />
          ))}
          {cell.events.length > 3 && (
            <Box bg={COLORS.black} px="2px" flexShrink={0} display="flex">
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="7px"
                lineHeight="9px"
                color={COLORS.pureWhite}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {cell.events.length}
              </Text>
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default function SceneCalendar() {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(TODAY_KEY);

  const { year, month, cells } = useMemo(() => {
    const view = new Date(BASE_YEAR, BASE_MONTH + offset, 1);
    const y = view.getFullYear();
    const m = view.getMonth();
    const firstWeekday = (view.getDay() + 6) % 7; // 周一为列首
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const total = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    const list: DayCell[] = [];
    for (let i = 0; i < total; i++) {
      const col = i % 7;
      if (i < firstWeekday) {
        const d = daysInPrev - firstWeekday + 1 + i;
        list.push({
          key: `prev-${d}`,
          day: d,
          inMonth: false,
          weekend: col >= 5,
          dateKey: dateKey(y, m - 1, d),
          events: [],
        });
      } else if (i - firstWeekday < daysInMonth) {
        const d = i - firstWeekday + 1;
        const k = dateKey(y, m, d);
        list.push({
          key: k,
          day: d,
          inMonth: true,
          weekend: col >= 5,
          dateKey: k,
          events: EVENTS[k] ?? [],
        });
      } else {
        const d = i - firstWeekday - daysInMonth + 1;
        list.push({
          key: `next-${d}`,
          day: d,
          inMonth: false,
          weekend: col >= 5,
          dateKey: dateKey(y, m + 1, d),
          events: [],
        });
      }
    }
    return { year: y, month: m, cells: list };
  }, [offset]);

  const monthEventCount = useMemo(
    () => cells.filter((c) => c.inMonth).reduce((n, c) => n + c.events.length, 0),
    [cells]
  );

  const [selY, selM, selD] = selected.split("-").map(Number);
  const selDate = new Date(selY, selM - 1, selD);
  const selEvents = EVENTS[selected] ?? [];

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} p="8px" gap="6px" overflow="hidden">
      {/* === 月头部 — 黑色横条 === */}
      <Flex
        h="32px"
        flexShrink={0}
        bg={COLORS.black}
        align="center"
        px="4px"
        position="relative"
      >
        {/* 底部仪表线 */}
        <Box position="absolute" bottom={0} left={0} right={0} h="2px">
          <Flex h="100%">
            <Box flex={2} bg={COLORS.red} />
            <Box flex={1} bg={COLORS.gold} />
            <Box flex={9} bg={`${COLORS.pureWhite}0d`} />
          </Flex>
        </Box>

        <MonthNavMarker dir="prev" onClick={() => setOffset((o) => o - 1)} />

        <Flex flex={1} align="baseline" justify="center" gap="8px" minW={0}>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="14px"
            letterSpacing="0.2em"
            color={COLORS.pureWhite}
          >
            {MONTH_CN[month]}
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="10px"
            letterSpacing="0.12em"
            color={COLORS.gold}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {year}-{String(month + 1).padStart(2, "0")}
          </Text>
          <Text
            display={{ base: "none", md: "block" }}
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.15em"
            color={COLORS.electricCyan}
            opacity={0.7}
          >
            {MONTH_EN[month]}
          </Text>
        </Flex>

        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          gap="5px"
          mr="6px"
          flexShrink={0}
        >
          <Box w="4px" h="4px" bg={COLORS.red} />
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.08em"
            color={COLORS.metalWhite}
            opacity={0.55}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(monthEventCount).padStart(2, "0")} 事件
          </Text>
        </Flex>

        <MonthNavMarker dir="next" onClick={() => setOffset((o) => o + 1)} />
      </Flex>

      {/* === 星期表头 — 黑色行 === */}
      <Grid templateColumns="repeat(7, 1fr)" flexShrink={0}>
        {WEEKDAY_CN.map((d, i) => (
          <Box
            key={d}
            bg={COLORS.black}
            py="4px"
            textAlign="center"
            borderLeft={i > 0 ? `1px solid ${COLORS.pureWhite}14` : "none"}
          >
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.3em"
              color={i >= 5 ? COLORS.gold : COLORS.metalWhite}
              opacity={i >= 5 ? 0.85 : 0.6}
            >
              {d}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* === 日期网格 — 白色单元 + 发丝线 === */}
      <Box
        flex={1}
        minH={0}
        borderTop={`${BORDER.hairline} ${COLORS.black}`}
        borderLeft={`${BORDER.hairline} ${COLORS.black}`}
        overflow="hidden"
      >
        <Grid templateColumns="repeat(7, 1fr)" h="100%" gridAutoRows="1fr">
          {cells.map((cell) => (
            <DayCellBox
              key={cell.key}
              cell={cell}
              isToday={cell.dateKey === TODAY_KEY && cell.inMonth}
              isSelected={cell.inMonth && cell.dateKey === selected}
              onSelect={setSelected}
            />
          ))}
        </Grid>
      </Box>

      {/* === 底部：本周时间带 + 选中日详情 === */}
      <Flex gap="6px" h="46px" flexShrink={0} align="stretch">
        {/* 本周事件时间带 */}
        <Flex
          flex={1}
          minW={0}
          direction="column"
          bg={COLORS.black}
          overflow="hidden"
        >
          <Flex align="center" gap="6px" px="6px" pt="4px" flexShrink={0}>
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="8px"
              letterSpacing="0.12em"
              color={COLORS.electricCyan}
            >
              W34
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="7px"
              letterSpacing="0.1em"
              color={COLORS.metalWhite}
              opacity={0.35}
              display={{ base: "none", sm: "block" }}
            >
              本周事件带
            </Text>
            <Box flex={1} h="1px" bg={`${COLORS.pureWhite}14`} />
          </Flex>
          <Flex flex={1} align="stretch" minH={0}>
            {WEEK_BAR.map((d, idx) => {
              const isToday = d.key === TODAY_KEY;
              const isSel = d.key === selected;
              return (
                <Box
                  as="button"
                  key={d.key}
                  aria-label={d.key}
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap="3px"
                  bg={isToday ? COLORS.red : "transparent"}
                  borderLeft={idx > 0 ? `1px solid ${COLORS.pureWhite}12` : "none"}
                  cursor="pointer"
                  position="relative"
                  onClick={() => setSelected(d.key)}
                  _hover={{ bg: isToday ? COLORS.redLight: `${COLORS.pureWhite}0f` }}
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="8px"
                    lineHeight={1}
                    letterSpacing="0.05em"
                    color={isToday ? COLORS.pureWhite : isSel ? COLORS.gold : COLORS.metalWhite}
                    opacity={isToday || isSel ? 1 : 0.55}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(d.day).padStart(2, "0")}
                  </Text>
                  <Flex gap="2px" h="3px" align="center">
                    {d.events.slice(0, 3).map((e, i) => (
                      <Box
                        key={i}
                        w="3px"
                        h="3px"
                        bg={
                          isToday && KIND_COLOR[e.kind] === COLORS.red
                            ? COLORS.pureWhite
                            : KIND_COLOR[e.kind]
                        }
                      />
                    ))}
                  </Flex>
                  {isSel && !isToday && (
                    <Box position="absolute" bottom={0} left={0} right={0} h="2px" bg={COLORS.gold} />
                  )}
                </Box>
              );
            })}
          </Flex>
        </Flex>

        {/* 选中日详情 — 硬阴影芯片 */}
        <Flex
          display={{ base: "none", sm: "flex" }}
          w="228px"
          flexShrink={0}
          direction="column"
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          overflow="hidden"
        >
          <Flex
            align="center"
            gap="6px"
            px="8px"
            py="3px"
            bg={COLORS.concrete}
            borderBottom={`${BORDER.hairline} ${COLORS.black}`}
            flexShrink={0}
          >
            <Box w="6px" h="6px" bg={COLORS.red} flexShrink={0} />
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="9px"
              letterSpacing="0.08em"
              color={COLORS.black}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(selM).padStart(2, "0")}-{String(selD).padStart(2, "0")}
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              color={COLORS.industrialBlack}
            >
              {WEEK_CN_FULL[selDate.getDay()]}
            </Text>
            <Box flex={1} />
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              fontWeight={WEIGHT.bold}
              letterSpacing="0.08em"
              color={COLORS.red}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(selEvents.length).padStart(2, "0")} 项
            </Text>
          </Flex>
          <Flex flex={1} direction="column" justify="center" gap="2px" px="8px" overflow="hidden">
            {selEvents.length === 0 ? (
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                letterSpacing="0.08em"
                color={COLORS.industrialBlack}
                opacity={0.45}
              >
                无日程 // 空闲时段
              </Text>
            ) : (
              selEvents.slice(0, 2).map((e) => (
                <Flex key={`${e.time}-${e.label}`} align="center" gap="6px" minW={0}>
                  <Box w="4px" h="4px" bg={KIND_COLOR[e.kind]} flexShrink={0} />
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    color={COLORS.industrialBlack}
                    w="32px"
                    flexShrink={0}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {e.time}
                  </Text>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="9px"
                    color={COLORS.black}
                    isTruncated
                  >
                    {e.label}
                  </Text>
                </Flex>
              ))
            )}
            {selEvents.length > 2 && (
              <Text
                fontFamily={FONT.mono}
                fontSize="7px"
                letterSpacing="0.08em"
                color={COLORS.industrialBlack}
                opacity={0.5}
              >
                +{selEvents.length - 2} 更多
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
