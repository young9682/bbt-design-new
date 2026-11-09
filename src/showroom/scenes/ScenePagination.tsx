import { useRef, useState } from "react";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box) };

const TOTAL_ITEMS = 114;
const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / PAGE_SIZE); // 12

type Status = "运行" | "待命" | "告警" | "离线";

interface LogRow {
  id: string;
  title: string;
  status: Status;
  time: string;
}

const STATUS_COLOR: Record<Status, string> = {
  运行: COLORS.statusGreen,
  待命: COLORS.statusAmber,
  告警: COLORS.statusRed,
  离线: COLORS.industrialBlack,
};

const STATUSES: Status[] = ["运行", "待命", "告警", "离线"];

const TITLE_POOL = [
  "矢量喷管冷却回路压检",
  "姿控推力器序列自检",
  "太阳翼跟踪误差校正",
  "下行链路载波锁定",
  "飞轮转速闭环测试",
  "热管温差补偿记录",
  "星敏探头视场标定",
  "电源母线纹波采样",
  "结构微振动频谱采集",
  "磁力矩器退磁归零",
  "燃料舱压力梯度巡检",
  "天线指向余量评估",
  "陀螺漂移补偿注入",
  "应急电池组切换演练",
];

function formatTime(index: number): string {
  const total = 9 * 3600 - index * 53;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function makeRow(index: number): LogRow {
  return {
    id: `LOG-${String(index + 1).padStart(3, "0")}`,
    title: TITLE_POOL[index % TITLE_POOL.length],
    status: STATUSES[(index * 3 + 1) % STATUSES.length],
    time: formatTime(index),
  };
}

type PageSlot = number | "leading" | "trailing";

function buildPageSlots(current: number, total: number): PageSlot[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "trailing", total];
  }
  if (current >= total - 3) {
    return [1, "leading", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "leading", current - 1, current, current + 1, "trailing", total];
}

const ROW_COLUMNS = { base: "72px 1fr 76px", sm: "88px 1fr 88px 72px" };

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      w="28px"
      h="28px"
      minW="28px"
      p={0}
      borderRadius={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={active ? COLORS.red : COLORS.pureWhite}
      border={`2px solid ${active ? COLORS.redDark : COLORS.black}`}
      boxShadow={active ? `2px 2px 0px ${COLORS.gold}`: `2px 2px 0px ${COLORS.metalWhite}4d`}
      _hover={
        active
          ? undefined
          : {
              transform: "translateY(-1px)",
              boxShadow: `2px 2px 0px ${COLORS.electricCyan}`,
            }
      }
      _active={{
        transform: active ? undefined : "translate(1px, 1px)",
        boxShadow: active ? `2px 2px 0px ${COLORS.gold}` : "none",
      }}
      transition={`all ${DURATION.instant}s ease`}
      cursor="pointer"
    >
      <Text
        fontFamily={FONT.mono}
        fontSize="12px"
        fontWeight={WEIGHT.black}
        color={active ? COLORS.pureWhite : COLORS.black}
        lineHeight={1}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {page}
      </Text>
    </Button>
  );
}

function NavButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      isDisabled={disabled}
      onClick={onClick}
      h="30px"
      px={{ base: "10px", md: "14px" }}
      borderRadius={0}
      display="flex"
      alignItems="center"
      gap="6px"
      bg={COLORS.red}
      border={`2px solid ${COLORS.redDark}`}
      boxShadow={`3px 3px 0px ${COLORS.metalWhite}4d`}
      opacity={disabled ? 0.35 : 1}
      _disabled={{ opacity: 0.35, boxShadow: SHADOW.none, cursor: "not-allowed" }}
      _hover={{
        bg: disabled ? COLORS.red : COLORS.redLight,
        boxShadow: disabled ? "none" : `3px 3px 0px ${COLORS.gold}`,
        transform: disabled ? undefined : "translateY(-1px)",
      }}
      _active={{
        transform: disabled ? undefined : "translate(2px, 2px)",
        boxShadow: disabled ? "none" : "none",
      }}
      transition={`all ${DURATION.instant}s ease`}
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      {children}
    </Button>
  );
}

export default function ScenePagination() {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const goTo = (next: number) => {
    const target = Math.min(Math.max(next, 1), TOTAL_PAGES);
    if (target === page) return;
    setPage(target);
    listRef.current?.scrollTo({ top: 0 });
  };

  const startIndex = (page - 1) * PAGE_SIZE;
  const count = Math.min(PAGE_SIZE, TOTAL_ITEMS - startIndex);
  const rows = Array.from({ length: count }, (_, i) => makeRow(startIndex + i));
  const slots = buildPageSlots(page, TOTAL_PAGES);

  return (
    <Flex h="100%" direction="column" bg={COLORS.concrete} overflow="hidden">
      {/* === 结果列表 === */}
      <Flex
        flex="1"
        minH="0"
        direction="column"
        mx={{ base: "6px", md: "10px" }}
        mt={{ base: "6px", md: "10px" }}
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        overflow="hidden"
      >
        {/* 列表头 — 黑底 + 红色下边线 + 金色对角线 */}
        <Grid
          position="relative"
          templateColumns={ROW_COLUMNS}
          gap="8px"
          alignItems="center"
          px="12px"
          h="30px"
          flexShrink={0}
          bg={COLORS.black}
          borderBottom={`3px solid ${COLORS.red}`}
          overflow="hidden"
        >
          <Text
            position="relative"
            zIndex={1}
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.black}
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
          >
            编号
          </Text>
          <Text
            position="relative"
            zIndex={1}
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.black}
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
          >
            记录
          </Text>
          <Text
            position="relative"
            zIndex={1}
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.black}
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
          >
            状态
          </Text>
          <Text
            position="relative"
            zIndex={1}
            display={{ base: "none", sm: "block" }}
            textAlign="right"
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.black}
            letterSpacing="0.12em"
            color={COLORS.pureWhite}
          >
            时间
          </Text>
          {/* 金色对角线 — 几何构成装饰 */}
          <Box
            position="absolute"
            right="28px"
            top="14px"
            w="110px"
            h="2px"
            bg={COLORS.gold}
            transform="rotate(-14deg)"
            opacity={0.85}
            zIndex={0}
            pointerEvents="none"
          />
        </Grid>

        {/* 滚动区 — 换页时回到顶部 */}
        <Box ref={listRef} flex="1" minH="0" overflowY="auto">
          <M.Box
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.launch }}
          >
            {rows.map((row) => (
              <Grid
                key={row.id}
                templateColumns={ROW_COLUMNS}
                gap="8px"
                alignItems="center"
                px="12px"
                h="30px"
                bg={COLORS.pureWhite}
                borderBottom={`${BORDER.hairline} ${COLORS.black}`}
                transition={`all ${DURATION.instant}s ease`}
                _hover={{
                  bg: COLORS.metalWhite,
                  boxShadow: `inset 3px 0 0 ${COLORS.red}`,
                }}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="11px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.black}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {row.id}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="11px"
                  color={COLORS.industrialBlack}
                  isTruncated
                  minW="0"
                >
                  {row.title}
                </Text>
                <Flex align="center" gap="6px" minW="0">
                  <Box
                    w="8px"
                    h="8px"
                    flexShrink={0}
                    bg={STATUS_COLOR[row.status]}
                  />
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    fontWeight={WEIGHT.bold}
                    color={STATUS_COLOR[row.status]}
                    isTruncated
                  >
                    {row.status}
                  </Text>
                </Flex>
                <Text
                  display={{ base: "none", sm: "block" }}
                  textAlign="right"
                  fontFamily={FONT.mono}
                  fontSize="10px"
                  color={COLORS.industrialBlack}
                  opacity={0.8}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {row.time}
                </Text>
              </Grid>
            ))}
          </M.Box>

          {/* 末页收尾金线 */}
          <Box h="2px" bg={COLORS.gold} />
        </Box>
      </Flex>

      {/* === 粘性分页条 — 黑色控制条 === */}
      <Box
        flexShrink={0}
        bg={COLORS.black}
        borderTop={`3px solid ${COLORS.red}`}
        mt={{ base: "6px", md: "10px" }}
        px={{ base: "8px", md: "12px" }}
        pt="7px"
        pb={{ base: "6px", md: "8px" }}
      >
        {/* 元信息行 — 读数 */}
        <Flex justify="space-between" align="center" mb="7px" px="2px">
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            letterSpacing="0.14em"
            color={COLORS.metalWhite}
            opacity={0.5}
          >
            PAGINATION // 索引控制
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontSize="10px"
            fontWeight={WEIGHT.bold}
            color={COLORS.gold}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            第 {page} / {TOTAL_PAGES} 页 · 共 {TOTAL_ITEMS} 条
          </Text>
        </Flex>

        {/* 控制行 — 上一页 / 页码 / 下一页 */}
        <Flex align="center" justify="space-between" gap="8px">
          <NavButton disabled={page === 1} onClick={() => goTo(page - 1)}>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              fontWeight={WEIGHT.black}
              color={COLORS.pureWhite}
              lineHeight={1}
            >
              ←
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontSize="12px"
              fontWeight={WEIGHT.black}
              letterSpacing="0.06em"
              color={COLORS.pureWhite}
              lineHeight={1}
            >
              上一页
            </Text>
          </NavButton>

          {/* 页码组 — 宽度不足时折叠 */}
          <Flex display={{ base: "none", md: "flex" }} align="center" gap="4px">
            {slots.map((slot) =>
              typeof slot === "number" ? (
                <PageButton
                  key={slot}
                  page={slot}
                  active={slot === page}
                  onClick={() => goTo(slot)}
                />
              ) : (
                <Text
                  key={slot}
                  w="14px"
                  textAlign="center"
                  fontFamily={FONT.mono}
                  fontSize="12px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.metalWhite}
                  opacity={0.55}
                  lineHeight={1}
                >
                  …
                </Text>
              )
            )}
          </Flex>

          {/* 紧凑页码 — 窄屏形态 [3/12] */}
          <Flex
            display={{ base: "flex", md: "none" }}
            align="center"
            justify="center"
            h="30px"
            px="12px"
            bg={COLORS.metalWhite}
            border={`2px solid ${COLORS.black}`}
            boxShadow={`2px 2px 0px ${COLORS.metalWhite}4d`}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="12px"
              fontWeight={WEIGHT.black}
              color={COLORS.black}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {page}/{TOTAL_PAGES}
            </Text>
          </Flex>

          <NavButton disabled={page === TOTAL_PAGES} onClick={() => goTo(page + 1)}>
            <Text
              fontFamily={FONT.sans}
              fontSize="12px"
              fontWeight={WEIGHT.black}
              letterSpacing="0.06em"
              color={COLORS.pureWhite}
              lineHeight={1}
            >
              下一页
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="11px"
              fontWeight={WEIGHT.black}
              color={COLORS.pureWhite}
              lineHeight={1}
            >
              →
            </Text>
          </NavButton>
        </Flex>
      </Box>
    </Flex>
  );
}
