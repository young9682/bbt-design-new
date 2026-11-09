import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = {
  Box: motion(Box),
};

/* === 数据模型 === */

type NodeType = "cluster" | "pool" | "node" | "pod";
type NodeStatus = "running" | "warning" | "error";

interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  cpu: string;
  mem: string;
  uptime: string;
  children?: TreeNode[];
}

const STATUS: Record<NodeStatus, { label: string; color: string }> = {
  running: { label: "运行中", color: COLORS.statusGreen },
  warning: { label: "警告", color: COLORS.statusAmber },
  error: { label: "错误", color: COLORS.statusRed },
};

const TYPE: Record<
  NodeType,
  { label: string; en: string; bg: string; fg: string }
> = {
  cluster: { label: "集群", en: "CLUSTER", bg: COLORS.red, fg: COLORS.pureWhite },
  pool: { label: "节点池", en: "POOL", bg: COLORS.black, fg: COLORS.pureWhite },
  node: { label: "节点", en: "NODE", bg: COLORS.electricCyan, fg: COLORS.pureWhite },
  pod: { label: "POD", en: "POD", bg: COLORS.gold, fg: COLORS.black },
};

const TREE: TreeNode[] = [
  {
    id: "c-prod",
    name: "prod-shanghai",
    type: "cluster",
    status: "running",
    cpu: "37%",
    mem: "52%",
    uptime: "214d 06h",
    children: [
      {
        id: "p-cpu",
        name: "cpu-pool",
        type: "pool",
        status: "warning",
        cpu: "41%",
        mem: "58%",
        uptime: "96d 11h",
        children: [
          {
            id: "n-a1",
            name: "node-a1",
            type: "node",
            status: "running",
            cpu: "48%",
            mem: "61%",
            uptime: "42d 03h",
            children: [
              { id: "pod-api", name: "api-gateway-7d9b6", type: "pod", status: "running", cpu: "12%", mem: "340Mi", uptime: "8d 19h" },
              { id: "pod-auth", name: "auth-svc-5f2kc", type: "pod", status: "running", cpu: "6%", mem: "210Mi", uptime: "8d 19h" },
              { id: "pod-cache", name: "cache-redis-0", type: "pod", status: "warning", cpu: "71%", mem: "1.2Gi", uptime: "31d 02h" },
            ],
          },
          {
            id: "n-a2",
            name: "node-a2",
            type: "node",
            status: "running",
            cpu: "22%",
            mem: "35%",
            uptime: "42d 03h",
            children: [
              { id: "pod-ngx", name: "nginx-ingress-2vxk7", type: "pod", status: "running", cpu: "3%", mem: "150Mi", uptime: "16d 08h" },
              { id: "pod-metrics", name: "metrics-collector-9c4", type: "pod", status: "running", cpu: "2%", mem: "96Mi", uptime: "16d 08h" },
            ],
          },
        ],
      },
      {
        id: "p-gpu",
        name: "gpu-pool",
        type: "pool",
        status: "error",
        cpu: "76%",
        mem: "83%",
        uptime: "12d 17h",
        children: [
          {
            id: "n-g1",
            name: "node-g1",
            type: "node",
            status: "error",
            cpu: "92%",
            mem: "88%",
            uptime: "5d 22h",
            children: [
              { id: "pod-tr0", name: "llm-trainer-0", type: "pod", status: "running", cpu: "98%", mem: "62Gi", uptime: "2d 14h" },
              { id: "pod-tr1", name: "llm-trainer-1", type: "pod", status: "error", cpu: "0%", mem: "0Gi", uptime: "0d 00h" },
            ],
          },
          {
            id: "n-g2",
            name: "node-g2",
            type: "node",
            status: "running",
            cpu: "61%",
            mem: "70%",
            uptime: "12d 17h",
            children: [
              { id: "pod-inf", name: "inference-svc-1", type: "pod", status: "running", cpu: "44%", mem: "18Gi", uptime: "9d 01h" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-stg",
    name: "staging-beijing",
    type: "cluster",
    status: "running",
    cpu: "18%",
    mem: "24%",
    uptime: "88d 09h",
    children: [
      {
        id: "p-stg",
        name: "cpu-pool",
        type: "pool",
        status: "running",
        cpu: "18%",
        mem: "24%",
        uptime: "88d 09h",
        children: [
          {
            id: "n-s1",
            name: "node-s1",
            type: "node",
            status: "running",
            cpu: "16%",
            mem: "21%",
            uptime: "30d 12h",
            children: [
              { id: "pod-s-api", name: "staging-api-1", type: "pod", status: "running", cpu: "5%", mem: "180Mi", uptime: "4d 07h" },
              { id: "pod-s-web", name: "staging-web-2", type: "pod", status: "running", cpu: "4%", mem: "160Mi", uptime: "4d 07h" },
            ],
          },
        ],
      },
    ],
  },
];

/* === 工具函数 === */

function collectBranchIds(nodes: TreeNode[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children?.length) {
      acc.push(n.id);
      collectBranchIds(n.children, acc);
    }
  }
  return acc;
}

function countByType(nodes: TreeNode[]): Record<NodeType, number> {
  const acc: Record<NodeType, number> = { cluster: 0, pool: 0, node: 0, pod: 0 };
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      acc[n.type] += 1;
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return acc;
}

function buildIndex(
  nodes: TreeNode[],
  trail: string[],
  map: Map<string, { node: TreeNode; path: string[] }>
): Map<string, { node: TreeNode; path: string[] }> {
  for (const n of nodes) {
    map.set(n.id, { node: n, path: [...trail, n.name] });
    if (n.children) buildIndex(n.children, [...trail, n.name], map);
  }
  return map;
}

/* === 树面板部件 === */

/** 几何节点类型标记：方块=集群 / 菱形=节点池 / 空心方=节点 / 小金方=POD */
function TypeMark({ type }: { type: NodeType }) {
  if (type === "cluster") return <Box w="9px" h="9px" bg={COLORS.red} flexShrink={0} />;
  if (type === "pool")
    return <Box w="7px" h="7px" bg={COLORS.black} transform="rotate(45deg)" flexShrink={0} />;
  if (type === "node")
    return <Box w="8px" h="8px" border={`2px solid ${COLORS.black}`} flexShrink={0} />;
  return <Box w="6px" h="6px" bg={COLORS.gold} flexShrink={0} />;
}

interface TreeRowProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  selectedId: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function TreeRow({ node, depth, expanded, selectedId, onToggle, onSelect }: TreeRowProps) {
  const isBranch = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <Box>
      <Flex
        align="center"
        w="100%"
        textAlign="left"
        py="5px"
        pr="10px"
        cursor="pointer"
        userSelect="none"
        bg={isSelected ? `${COLORS.red}0f` : "transparent"}
        boxShadow={isSelected ? `inset 3px 0 0 ${COLORS.red}` : undefined}
        transition={`background-color ${DURATION.fast}s ease`}
        _hover={{ bg: isSelected ? `${COLORS.red}1a` : COLORS.concrete }}
        onClick={() => onSelect(node.id)}
      >
        {/* 缩进轨道 — 左侧 hairline 竖线 */}
        {Array.from({ length: depth }).map((_, i) => (
          <Box
            key={i}
            w="18px"
            flexShrink={0}
            alignSelf="stretch"
            borderLeft={`1px solid ${COLORS.metalWhite}`}
          />
        ))}

        {/* 展开三角 / 叶子状态方块 */}
        <Flex w="18px" h="18px" align="center" justify="center" flexShrink={0}>
          {isBranch ? (
            <Box
              as="button"
              w="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              aria-label={isOpen ? "收起" : "展开"}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
            >
              <M.Box
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: DURATION.fast, ease: EASING.sharp }}
              >
                <Text
                  fontSize="8px"
                  lineHeight={1}
                  color={COLORS.red}
                  fontWeight={WEIGHT.black}
                >
                  ▶
                </Text>
              </M.Box>
            </Box>
          ) : (
            <Box w="6px" h="6px" bg={STATUS[node.status].color} />
          )}
        </Flex>

        <Box w="9px" flexShrink={0} />
        <TypeMark type={node.type} />
        <Box w="9px" flexShrink={0} />

        <Text
          flex={1}
          isTruncated
          fontFamily={FONT.mono}
          fontWeight={isSelected ? WEIGHT.black : WEIGHT.bold}
          fontSize="11px"
          letterSpacing="0.02em"
          color={isSelected ? COLORS.red : COLORS.black}
        >
          {node.name}
        </Text>

        {/* 分支节点的等宽子计数 */}
        {isBranch && (
          <Box
            border={`1px solid ${COLORS.metalWhite}`}
            px="4px"
            py="1px"
            ml="6px"
            flexShrink={0}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              lineHeight={1}
              color={COLORS.industrialBlack}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {node.children!.length}
            </Text>
          </Box>
        )}
      </Flex>

      {/* 高度动画展开/收起 */}
      <AnimatePresence initial={false}>
        {isBranch && isOpen && (
          <M.Box
            key="children"
            overflow="hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASING.launch }}
          >
            {node.children!.map((child) => (
              <TreeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </M.Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

function PanelButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      fontFamily={FONT.mono}
      fontWeight={WEIGHT.bold}
      fontSize="9px"
      letterSpacing="0.08em"
      color={COLORS.black}
      bg={COLORS.pureWhite}
      border={`${BORDER.hairline} ${COLORS.black}`}
      px="6px"
      py="3px"
      cursor="pointer"
      transition={`all ${DURATION.fast}s ease`}
      _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
    >
      {label}
    </Box>
  );
}

/* === 主场景 === */

export default function SceneTreeView() {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["c-prod", "p-cpu", "n-a1"])
  );
  const [selectedId, setSelectedId] = useState("n-a1");

  /* 容器宽度测量（响应式切换布局） */
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isNarrow = width > 0 && width < 600;

  const index = useMemo(
    () => buildIndex(TREE, [], new Map()),
    []
  );
  const branchIds = useMemo(() => collectBranchIds(TREE), []);
  const totals = useMemo(() => countByType(TREE), []);

  const selected = index.get(selectedId);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const expandAll = () => setExpanded(new Set(branchIds));
  const collapseAll = () => setExpanded(new Set());

  return (
    <Box ref={rootRef} h="100%" bg={COLORS.concrete} p="8px" overflow="hidden">
      <Flex h="100%" direction={isNarrow ? "column" : "row"} gap="8px">
        {/* 左：树面板 */}
        <Box
          display="flex"
          flexDirection="column"
          w={isNarrow ? "100%" : "55%"}
          flex={isNarrow ? 1 : undefined}
          minW={0}
          minH={0}
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          overflow="hidden"
        >
          {/* 面板头 */}
          <Flex
            justify="space-between"
            align="center"
            gap="8px"
            flexWrap="wrap"
            px="12px"
            py="8px"
            borderBottom={`1px solid ${COLORS.metalWhite}`}
            flexShrink={0}
          >
            <Flex align="center" gap="7px">
              <Box w="8px" h="8px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="11px"
                color={COLORS.black}
                letterSpacing="0.1em"
              >
                资源树
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                color={COLORS.gold}
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                Resource Tree
              </Text>
            </Flex>
            <Flex gap="5px">
              <PanelButton label="全部展开" onClick={expandAll} />
              <PanelButton label="全部收起" onClick={collapseAll} />
            </Flex>
          </Flex>

          {/* 树主体 */}
          <Box flex={1} minHeight={0} overflowY="auto" py="4px">
            {TREE.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                depth={0}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={toggle}
                onSelect={setSelectedId}
              />
            ))}
          </Box>

          {/* 面板脚注 — 等宽统计 */}
          <Box
            borderTop={`1px solid ${COLORS.metalWhite}`}
            px="12px"
            py="6px"
            flexShrink={0}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              letterSpacing="0.08em"
              color={COLORS.industrialBlack}
              opacity={0.75}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              集群 {totals.cluster} · 节点池 {totals.pool} · 节点 {totals.node} ·
              POD {totals.pod}
            </Text>
          </Box>
        </Box>

        {/* 右：详情面板（窄宽度时堆叠在树下方） */}
        <Box
          display="flex"
          flexDirection="column"
          flex={isNarrow ? undefined : 1}
          w={isNarrow ? "100%" : undefined}
          flexShrink={isNarrow ? 0 : undefined}
          maxHeight={isNarrow ? "46%" : undefined}
          minW={0}
          overflow="hidden"
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
        >
          <Box h="3px" bg={COLORS.red} flexShrink={0} />

          <Box
            flex={1}
            minHeight={0}
            overflowY="auto"
            p={isNarrow ? "10px" : "16px"}
          >
            {selected && (
              <M.Box
                key={selectedId}
                initial={{ x: 14 }}
                animate={{ x: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING.launch }}
              >
                {/* 类型徽章 + 状态 */}
                <Flex align="center" gap="8px" flexWrap="wrap" mb="10px">
                  <Box
                    px="7px"
                    py="3px"
                    bg={TYPE[selected.node.type].bg}
                    color={TYPE[selected.node.type].fg}
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.black}
                    fontSize="9px"
                    letterSpacing="0.1em"
                  >
                    {TYPE[selected.node.type].label} · {TYPE[selected.node.type].en}
                  </Box>
                  <Flex
                    align="center"
                    gap="5px"
                    border={`${BORDER.hairline} ${COLORS.black}`}
                    px="6px"
                    py="3px"
                  >
                    <Box
                      w="6px"
                      h="6px"
                      bg={STATUS[selected.node.status].color}
                    />
                    <Text
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.bold}
                      fontSize="9px"
                      letterSpacing="0.08em"
                      color={COLORS.black}
                    >
                      {STATUS[selected.node.status].label}
                    </Text>
                  </Flex>
                </Flex>

                {/* 标题 + 路径 */}
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize={isNarrow ? "15px" : "18px"}
                  color={COLORS.black}
                  letterSpacing="-0.02em"
                  lineHeight={1}
                  mb="4px"
                  isTruncated
                >
                  {selected.node.name}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="9px"
                  color={COLORS.industrialBlack}
                  letterSpacing="0.04em"
                  mb={isNarrow ? "8px" : "14px"}
                  isTruncated
                >
                  {selected.path.join(" / ")}
                </Text>

                {/* 等宽元数据网格 */}
                <SimpleGrid
                  columns={isNarrow ? 4 : 2}
                  spacing="1px"
                  bg={COLORS.metalWhite}
                  border={`${BORDER.hairline} ${COLORS.metalWhite}`}
                  mb={isNarrow ? "10px" : "14px"}
                >
                  {[
                    {
                      label: "状态",
                      value: STATUS[selected.node.status].label,
                      color: STATUS[selected.node.status].color,
                    },
                    { label: "CPU", value: selected.node.cpu, color: COLORS.black },
                    { label: "内存", value: selected.node.mem, color: COLORS.black },
                    { label: "上线时间", value: selected.node.uptime, color: COLORS.black },
                  ].map((meta) => (
                    <Box key={meta.label} bg={COLORS.concrete} px="10px" py="8px">
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color={COLORS.industrialBlack}
                        opacity={0.75}
                        mb="3px"
                      >
                        {meta.label}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontWeight={WEIGHT.black}
                        fontSize={isNarrow ? "11px" : "14px"}
                        color={meta.color}
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                        isTruncated
                      >
                        {meta.value}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* 操作行 */}
                <Flex gap="8px" flexWrap="wrap">
                  <Box
                    as="button"
                    bg={COLORS.red}
                    color={COLORS.pureWhite}
                    border={`2px solid ${COLORS.redDark}`}
                    boxShadow={SHADOW.red}
                    px="14px"
                    py="7px"
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="11px"
                    letterSpacing="0.12em"
                    cursor="pointer"
                    transition={`all ${DURATION.fast}s ease`}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: `4px 4px 0px ${COLORS.redDark}`,
                    }}
                    _active={{ transform: "translateY(0)" }}
                  >
                    重启
                  </Box>
                  <Box
                    as="button"
                    bg="transparent"
                    color={COLORS.black}
                    border={`2px solid ${COLORS.industrialBlack}`}
                    px="14px"
                    py="7px"
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="11px"
                    letterSpacing="0.12em"
                    cursor="pointer"
                    transition={`all ${DURATION.fast}s ease`}
                    _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
                  >
                    日志
                  </Box>
                </Flex>
              </M.Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
