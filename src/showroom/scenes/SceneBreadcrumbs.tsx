import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const MBox = motion(Box);

type Stat = { label: string; value: string; unit?: string; color?: string };
type MetaRow = { k: string; v: string; color?: string };
type NodeKind = "root" | "cluster" | "section" | "leaf";

interface NavNode {
  id: string;
  label: string;
  code: string;
  kind: NodeKind;
  parent: string | null;
  children?: string[];
  meta: MetaRow[];
  stats: Stat[];
}

/**
 * 导航树 — 路径状态是单一事实来源：
 * 面包屑、侧边导航、内容面板全部从 selectedId 派生。
 */
const NODES: Record<string, NavNode> = {
  console: {
    id: "console",
    label: "控制台",
    code: "00",
    kind: "root",
    parent: null,
    meta: [
      { k: "平台", v: "BBT-CLOUD" },
      { k: "版本", v: "1.2.1" },
      { k: "区域", v: "CN-EAST-1" },
    ],
    stats: [
      { label: "对象总数", value: "12847" },
      { label: "集群", value: "6", unit: "组", color: COLORS.electricCyan },
      { label: "活跃告警", value: "3", color: COLORS.red },
    ],
  },
  cluster: {
    id: "cluster",
    label: "集群",
    code: "RKE2-PROD",
    kind: "cluster",
    parent: "console",
    meta: [
      { k: "集群", v: "rke2-prod" },
      { k: "节点", v: "347" },
      { k: "状态", v: "健康", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "CPU", value: "87", unit: "%" },
      { label: "内存", value: "62", unit: "%" },
      { label: "GPU", value: "244/256", color: COLORS.gold },
    ],
  },
  nodepool: {
    id: "nodepool",
    label: "节点池",
    code: "01",
    kind: "section",
    parent: "cluster",
    children: ["pod-07a", "pod-07b", "pod-11c"],
    meta: [
      { k: "池类型", v: "GPU-POOL" },
      { k: "调度器", v: "VOLCANO" },
      { k: "队列", v: "gpu-pool" },
    ],
    stats: [
      { label: "节点", value: "3" },
      { label: "GPU", value: "24", unit: "卡", color: COLORS.gold },
      { label: "待调度", value: "2", color: COLORS.statusAmber },
    ],
  },
  "pod-07a": {
    id: "pod-07a",
    label: "POD-07A",
    code: "NP-07A",
    kind: "leaf",
    parent: "nodepool",
    meta: [
      { k: "实例 ID", v: "pod-07a-9f3e" },
      { k: "镜像", v: "torch:2.4-cu12" },
      { k: "状态", v: "运行中", color: COLORS.statusGreen },
      { k: "启动", v: "08-16 21:04" },
    ],
    stats: [
      { label: "GPU 利用率", value: "94.2", unit: "%", color: COLORS.gold },
      { label: "显存", value: "71.6", unit: "GB" },
      { label: "重启", value: "0", color: COLORS.statusGreen },
    ],
  },
  "pod-07b": {
    id: "pod-07b",
    label: "POD-07B",
    code: "NP-07B",
    kind: "leaf",
    parent: "nodepool",
    meta: [
      { k: "实例 ID", v: "pod-07b-2c8d" },
      { k: "镜像", v: "vllm:v0.6.1" },
      { k: "状态", v: "运行中", color: COLORS.statusGreen },
      { k: "启动", v: "08-15 09:32" },
    ],
    stats: [
      { label: "GPU 利用率", value: "88.7", unit: "%", color: COLORS.gold },
      { label: "显存", value: "148.2", unit: "GB" },
      { label: "重启", value: "1", color: COLORS.statusAmber },
    ],
  },
  "pod-11c": {
    id: "pod-11c",
    label: "POD-11C",
    code: "NP-11C",
    kind: "leaf",
    parent: "nodepool",
    meta: [
      { k: "实例 ID", v: "pod-11c-77aa" },
      { k: "镜像", v: "openmpi:4.1" },
      { k: "状态", v: "排队中", color: COLORS.statusAmber },
      { k: "启动", v: "—" },
    ],
    stats: [
      { label: "GPU 利用率", value: "0", unit: "%" },
      { label: "排队时长", value: "4.2", unit: "H", color: COLORS.statusAmber },
      { label: "优先级", value: "HIGH", color: COLORS.red },
    ],
  },
  workload: {
    id: "workload",
    label: "工作负载",
    code: "02",
    kind: "section",
    parent: "cluster",
    children: ["deploy-web", "job-1187", "cron-recon"],
    meta: [
      { k: "命名空间", v: "poc" },
      { k: "类型", v: "无状态 / 任务" },
      { k: "副本合计", v: "18" },
    ],
    stats: [
      { label: "负载", value: "18" },
      { label: "健康", value: "16", color: COLORS.statusGreen },
      { label: "异常", value: "2", color: COLORS.red },
    ],
  },
  "deploy-web": {
    id: "deploy-web",
    label: "DEPLOY-WEB",
    code: "WL-D01",
    kind: "leaf",
    parent: "workload",
    meta: [
      { k: "副本", v: "4/4" },
      { k: "镜像", v: "nginx:1.27" },
      { k: "状态", v: "运行中", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "QPS", value: "12847" },
      { label: "P99 延迟", value: "8", unit: "MS", color: COLORS.gold },
      { label: "错误率", value: "0.02", unit: "%", color: COLORS.statusGreen },
    ],
  },
  "job-1187": {
    id: "job-1187",
    label: "JOB-1187",
    code: "WL-J87",
    kind: "leaf",
    parent: "workload",
    meta: [
      { k: "类型", v: "VOLCANO JOB" },
      { k: "队列", v: "gpu-pool" },
      { k: "状态", v: "运行中", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "进度", value: "62", unit: "%", color: COLORS.electricCyan },
      { label: "步骤", value: "31/50" },
      { label: "预计完成", value: "42", unit: "MIN" },
    ],
  },
  "cron-recon": {
    id: "cron-recon",
    label: "CRON-RECON",
    code: "WL-C12",
    kind: "leaf",
    parent: "workload",
    meta: [
      { k: "周期", v: "0 3 * * *" },
      { k: "上次执行", v: "08-17 03:00" },
      { k: "状态", v: "成功", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "累计执行", value: "217" },
      { label: "失败", value: "3", color: COLORS.red },
      { label: "耗时", value: "4.2", unit: "MIN" },
    ],
  },
  storage: {
    id: "storage",
    label: "存储卷",
    code: "03",
    kind: "section",
    parent: "cluster",
    children: ["pvc-data", "pv-logs"],
    meta: [
      { k: "后端", v: "NFS / JUICEFS" },
      { k: "卷数量", v: "12" },
      { k: "快照策略", v: "每日" },
    ],
    stats: [
      { label: "总容量", value: "48", unit: "TB" },
      { label: "已用", value: "62", unit: "%", color: COLORS.gold },
      { label: "IOPS", value: "8.4", unit: "K", color: COLORS.electricCyan },
    ],
  },
  "pvc-data": {
    id: "pvc-data",
    label: "PVC-DATA",
    code: "ST-01",
    kind: "leaf",
    parent: "storage",
    meta: [
      { k: "容量", v: "2 TB" },
      { k: "访问模式", v: "RWX" },
      { k: "状态", v: "已绑定", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "已用", value: "1.24/2", unit: "TB", color: COLORS.gold },
      { label: "延迟", value: "1.8", unit: "MS" },
      { label: "待重建", value: "无", color: COLORS.statusGreen },
    ],
  },
  "pv-logs": {
    id: "pv-logs",
    label: "PV-LOGS",
    code: "ST-02",
    kind: "leaf",
    parent: "storage",
    meta: [
      { k: "容量", v: "512 GB" },
      { k: "访问模式", v: "RWO" },
      { k: "状态", v: "已绑定", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "已用", value: "488/512", unit: "GB", color: COLORS.statusAmber },
      { label: "延迟", value: "3.1", unit: "MS" },
      { label: "待重建", value: "无", color: COLORS.statusGreen },
    ],
  },
  observ: {
    id: "observ",
    label: "可观测性",
    code: "04",
    kind: "section",
    parent: "cluster",
    children: ["metrics", "logs"],
    meta: [
      { k: "采集", v: "PROMETHEUS" },
      { k: "保留", v: "30 天" },
      { k: "精度", v: "15 秒" },
    ],
    stats: [
      { label: "时间序列", value: "2.1", unit: "M" },
      { label: "采样间隔", value: "15", unit: "S", color: COLORS.electricCyan },
      { label: "活跃告警", value: "3", color: COLORS.red },
    ],
  },
  metrics: {
    id: "metrics",
    label: "监控面板",
    code: "OB-M",
    kind: "leaf",
    parent: "observ",
    meta: [
      { k: "面板", v: "GPU 总览" },
      { k: "刷新", v: "30 秒" },
      { k: "状态", v: "在线", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "面板数", value: "24" },
      { label: "联动源", value: "6", color: COLORS.electricCyan },
      { label: "查询延迟", value: "220", unit: "MS", color: COLORS.gold },
    ],
  },
  logs: {
    id: "logs",
    label: "日志检索",
    code: "OB-L",
    kind: "leaf",
    parent: "observ",
    meta: [
      { k: "索引", v: "08-17" },
      { k: "条目", v: "1.4 M" },
      { k: "状态", v: "在线", color: COLORS.statusGreen },
    ],
    stats: [
      { label: "检索 QPS", value: "340" },
      { label: "命中", value: "12.8", unit: "K", color: COLORS.statusGreen },
      { label: "延迟", value: "45", unit: "MS" },
    ],
  },
};

const SECTION_ORDER = ["nodepool", "workload", "storage", "observ"];

const HIDE_SCROLLBAR = {
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
} as const;

function buildPath(id: string): NavNode[] {
  const path: NavNode[] = [];
  let cur: NavNode | undefined = NODES[id];
  while (cur) {
    path.unshift(cur);
    cur = cur.parent ? NODES[cur.parent] : undefined;
  }
  return path;
}

/** 面包屑段 — 祖先可点击导航，当前段金色 */
function CrumbSegment({
  node,
  current,
  onClick,
}: {
  node: NavNode;
  current: boolean;
  onClick: () => void;
}) {
  return (
    <Text
      fontFamily={FONT.mono}
      fontSize="10px"
      fontWeight={current ? WEIGHT.black : WEIGHT.regular}
      letterSpacing="0.08em"
      color={current ? COLORS.gold : COLORS.metalWhite}
      opacity={current ? 1 : 0.75}
      whiteSpace="nowrap"
      cursor={current ? "default" : "pointer"}
      _hover={current ? undefined : { color: COLORS.gold, opacity: 1 }}
      onClick={current ? undefined : onClick}
      transition={`color ${DURATION.fast}s ease`}
    >
      {node.label}
    </Text>
  );
}

export default function SceneBreadcrumbs() {
  const [selectedId, setSelectedId] = useState("pod-07a");
  const node = NODES[selectedId];
  const path = buildPath(selectedId);
  const activeSectionId =
    node.kind === "leaf" ? node.parent : node.kind === "section" ? node.id : null;
  const activeSection = activeSectionId ? NODES[activeSectionId] : null;
  const collapsed = path.length > 3;
  const truncatedCrumb = collapsed ? [path[0], path[path.length - 1]] : path;

  const select = (id: string) => setSelectedId(id);

  return (
    <Box
      h="100%"
      bg={COLORS.concrete}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      px={{ base: "8px", md: "10px" }}
      py="8px"
    >
      {/* ============ 面包屑条 — 黑色条带，单色路径 ============ */}
      <Flex
        h="32px"
        flexShrink={0}
        bg={COLORS.black}
        border={`${BORDER.standard} ${COLORS.black}`}
        boxShadow={SHADOW.small}
        align="center"
        px="10px"
        gap="6px"
        overflow="hidden"
        position="relative"
      >
        <Box w="5px" h="5px" bg={COLORS.red} transform="rotate(45deg)" flexShrink={0} />

        {/* 完整路径 — md+ */}
        <Flex display={{ base: "none", md: "flex" }} align="center" gap="6px" minW={0} overflow="hidden">
          {path.map((n, i) => (
            <Fragment key={n.id}>
              {i > 0 && (
                <Text
                  fontFamily={FONT.mono}
                  fontSize="10px"
                  fontWeight={WEIGHT.black}
                  color={COLORS.redLight}
                  flexShrink={0}
                >
                  →
                </Text>
              )}
              <CrumbSegment node={n} current={i === path.length - 1} onClick={() => select(n.id)} />
            </Fragment>
          ))}
        </Flex>

        {/* 截断路径 — 基座断点：首段 … 末段 */}
        <Flex display={{ base: "flex", md: "none" }} align="center" gap="6px" minW={0} overflow="hidden">
          {truncatedCrumb.map((n, i) => (
            <Fragment key={n.id}>
              {i > 0 && (
                <>
                  {collapsed && i === truncatedCrumb.length - 1 && (
                    <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.metalWhite} opacity={0.4} flexShrink={0}>
                      …
                    </Text>
                  )}
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="10px"
                    fontWeight={WEIGHT.black}
                    color={COLORS.redLight}
                    flexShrink={0}
                  >
                    →
                  </Text>
                </>
              )}
              <CrumbSegment
                node={n}
                current={n.id === path[path.length - 1].id}
                onClick={() => select(n.id)}
              />
            </Fragment>
          ))}
        </Flex>

        <Text
          display={{ base: "none", md: "block" }}
          ml="auto"
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.1em"
          color={COLORS.signalGreen}
          whiteSpace="nowrap"
          pl="8px"
        >
          DEPTH {String(path.length).padStart(2, "0")}
        </Text>
      </Flex>

      {/* ============ 基座断点：横向芯片导航 ============ */}
      <Box display={{ base: "block", md: "none" }} mt="8px" flexShrink={0}>
        <Flex gap="6px" overflowX="auto" pb="2px" sx={HIDE_SCROLLBAR}>
          {SECTION_ORDER.map((sid) => {
            const section = NODES[sid];
            const active = sid === activeSectionId;
            return (
              <Flex
                key={sid}
                align="center"
                gap="6px"
                flexShrink={0}
                px="8px"
                py="4px"
                border={`${BORDER.standard} ${COLORS.black}`}
                bg={active ? COLORS.black : COLORS.pureWhite}
                boxShadow={SHADOW.small}
                cursor="pointer"
                onClick={() => select(sid)}
              >
                <Box w="5px" h="5px" bg={active ? COLORS.gold : COLORS.red} transform="rotate(45deg)" />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="10px"
                  letterSpacing="0.04em"
                  color={active ? COLORS.pureWhite : COLORS.black}
                  whiteSpace="nowrap"
                >
                  {section.label}
                </Text>
              </Flex>
            );
          })}
        </Flex>
        {activeSection && activeSection.children && (
          <Flex gap="6px" overflowX="auto" mt="6px" sx={HIDE_SCROLLBAR}>
            {activeSection.children.map((cid) => {
              const child = NODES[cid];
              const active = cid === selectedId;
              return (
                <Flex
                  key={cid}
                  align="center"
                  flexShrink={0}
                  px="7px"
                  py="3px"
                  border={`${BORDER.hairline} ${COLORS.black}`}
                  bg={active ? COLORS.red : COLORS.pureWhite}
                  cursor="pointer"
                  onClick={() => select(cid)}
                >
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.black}
                    fontSize="9px"
                    letterSpacing="0.04em"
                    color={active ? COLORS.pureWhite : COLORS.black}
                    whiteSpace="nowrap"
                  >
                    {child.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        )}
      </Box>

      {/* ============ 主体：两级侧导航 + 内容面板 ============ */}
      <Flex flex={1} minH={0} mt="8px" gap={{ base: "0px", md: "10px" }} align="stretch">
        {/* 侧导航 — md+ */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w="164px"
          flexShrink={0}
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.small}
          overflowY="auto"
        >
          {/* 集群快捷入口 */}
          <Box
            px="10px"
            py="7px"
            borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}
            bg={selectedId === "cluster" || selectedId === "console" ? COLORS.black : "transparent"}
            color={
              selectedId === "cluster" || selectedId === "console"
                ? COLORS.pureWhite
                : COLORS.black
            }
            cursor="pointer"
            onClick={() => select("cluster")}
            _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
          >
            <Flex align="center" gap="6px">
              <Box w="6px" h="6px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.06em"
                lineHeight={1}
                mt="2px"
              >
                集群
              </Text>
              <Text
                ml="auto"
                fontFamily={FONT.mono}
                fontSize="8px"
                letterSpacing="0.08em"
                color={COLORS.gold}
              >
                RKE2
              </Text>
            </Flex>
          </Box>

          {/* 分区 + 子节点 */}
          {SECTION_ORDER.map((sid) => {
            const section = NODES[sid];
            const sectionActive = sid === activeSectionId;
            return (
              <Box key={sid} borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}>
                <Flex
                  align="center"
                  gap="7px"
                  px="10px"
                  py="6px"
                  cursor="pointer"
                  bg={selectedId === sid ? COLORS.black : "transparent"}
                  color={selectedId === sid ? COLORS.pureWhite : COLORS.black}
                  onClick={() => select(sid)}
                  _hover={selectedId === sid ? undefined : { bg: COLORS.black, color: COLORS.pureWhite }}
                >
                  <Box
                    w="6px"
                    h="6px"
                    border={`1px solid ${COLORS.black}`}
                    transform="rotate(45deg)"
                    bg={sectionActive ? COLORS.red : "transparent"}
                    flexShrink={0}
                  />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="11px"
                    letterSpacing="0.06em"
                  >
                    {section.label}
                  </Text>
                  <Text
                    ml="auto"
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    color={COLORS.gold}
                    letterSpacing="0.08em"
                  >
                    {String(section.children?.length ?? 0).padStart(2, "0")}
                  </Text>
                </Flex>
                {section.children?.map((cid) => {
                  const child = NODES[cid];
                  const childActive = cid === selectedId;
                  return (
                    <Flex
                      key={cid}
                      align="center"
                      gap="7px"
                      pl="24px"
                      pr="10px"
                      py="4px"
                      cursor="pointer"
                      bg={childActive ? COLORS.red : "transparent"}
                      color={childActive ? COLORS.pureWhite : COLORS.black}
                      onClick={() => select(cid)}
                      _hover={childActive ? undefined : { bg: COLORS.black, color: COLORS.pureWhite }}
                    >
                      <Box w="8px" h="1px" bg={COLORS.metalWhite} opacity={0.5} flexShrink={0} />
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="10px"
                        fontWeight={childActive ? WEIGHT.black : WEIGHT.regular}
                        letterSpacing="0.04em"
                        whiteSpace="nowrap"
                      >
                        {child.label}
                      </Text>
                      {childActive && (
                        <Box ml="auto" w="4px" h="4px" bg={COLORS.gold} transform="rotate(45deg)" />
                      )}
                    </Flex>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        {/* 内容面板 */}
        <Box
          flex={1}
          minW={0}
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          position="relative"
        >
          {/* 速度色条 */}
          <Flex h="3px" flexShrink={0}>
            <Box flex={3} bg={COLORS.red} />
            <Box flex={1} bg={COLORS.velocityOrange} />
            <Box flex={2} bg={COLORS.gold} />
            <Box flex={1} bg={COLORS.electricCyan} />
            <Box flex={2} bg={COLORS.black} />
          </Flex>

          {/* 装饰性红色斜切角 */}
          <Box
            position="absolute"
            top="3px"
            right="0"
            w="56px"
            h="56px"
            bg={COLORS.red}
            clipPath="polygon(100% 0, 100% 100%, 0 0)"
            opacity={0.08}
            pointerEvents="none"
          />

          <Box flex={1} overflowY="auto" px={{ base: "10px", md: "14px" }} py="12px">
            <AnimatePresence mode="wait">
              <MBox
                key={selectedId}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
              >
                {/* 标题行 — 旋转方块几何角标 */}
                <Flex align="center" gap="8px">
                  <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" flexShrink={0} />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize={{ base: "15px", md: "18px" }}
                    letterSpacing="0.02em"
                    color={COLORS.black}
                    lineHeight={1}
                    noOfLines={1}
                  >
                    {node.label}
                  </Text>
                  <Text
                    ml="auto"
                    fontFamily={FONT.mono}
                    fontSize="9px"
                    fontWeight={WEIGHT.black}
                    letterSpacing="0.1em"
                    color={COLORS.gold}
                    whiteSpace="nowrap"
                  >
                    {node.code}
                  </Text>
                </Flex>
                <Box h="3px" bg={COLORS.red} w={{ base: "44px", md: "64px" }} mt="8px" />

                {/* 元数据行 */}
                <Box mt="12px" borderTop={`${BORDER.hairline} ${COLORS.metalWhite}`}>
                  {node.meta.map((row) => (
                    <Flex
                      key={row.k}
                      justify="space-between"
                      align="baseline"
                      gap="10px"
                      px="2px"
                      py="5px"
                      borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}
                    >
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="9px"
                        letterSpacing="0.1em"
                        color={COLORS.industrialBlack}
                        opacity={0.75}
                      >
                        {row.k}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="11px"
                        fontWeight={WEIGHT.bold}
                        color={row.color || COLORS.black}
                        textAlign="right"
                        whiteSpace="nowrap"
                      >
                        {row.v}
                      </Text>
                    </Flex>
                  ))}
                </Box>

                {/* 统计块 */}
                <Grid templateColumns="repeat(3, 1fr)" gap="8px" mt="12px">
                  {node.stats.map((stat, i) => (
                    <Box
                      key={stat.label}
                      position="relative"
                      bg={i === 0 ? COLORS.black : COLORS.concrete}
                      border={`${BORDER.standard} ${COLORS.black}`}
                      p={{ base: "7px", md: "9px" }}
                      overflow="hidden"
                    >
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        letterSpacing="0.08em"
                        color={i === 0 ? COLORS.metalWhite : COLORS.industrialBlack}
                        opacity={0.7}
                        noOfLines={1}
                      >
                        {stat.label}
                      </Text>
                      <Flex align="baseline" gap="3px" mt="3px">
                        <Text
                          fontFamily={FONT.mono}
                          fontWeight={WEIGHT.black}
                          fontSize={{ base: "14px", md: "17px" }}
                          lineHeight={1}
                          color={
                            stat.color || (i === 0 ? COLORS.gold : COLORS.black)
                          }
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                          noOfLines={1}
                        >
                          {stat.value}
                        </Text>
                        {stat.unit && (
                          <Text
                            fontFamily={FONT.mono}
                            fontSize="8px"
                            color={stat.color || (i === 0 ? COLORS.gold : COLORS.industrialBlack)}
                            opacity={0.8}
                          >
                            {stat.unit}
                          </Text>
                        )}
                      </Flex>
                      <Box
                        position="absolute"
                        bottom="5px"
                        right="5px"
                        w="4px"
                        h="4px"
                        bg={stat.color || COLORS.red}
                        transform="rotate(45deg)"
                        opacity={0.7}
                      />
                    </Box>
                  ))}
                </Grid>
              </MBox>
            </AnimatePresence>
          </Box>

          {/* 底部路径回显 */}
          <Flex
            h="20px"
            flexShrink={0}
            bg={COLORS.black}
            align="center"
            px="10px"
            gap="6px"
            overflow="hidden"
          >
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.redLight} flexShrink={0}>
              ~/
            </Text>
            <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.65} isTruncated>
              {path.map((n) => n.label).join("/")}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
