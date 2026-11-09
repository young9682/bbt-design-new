import { Box, Flex, Text, Input, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

const M = { Box: motion(Box) };

// === TYPES ===

type FileKind = "folder" | "doc" | "dataset" | "model" | "image" | "archive";
type ViewMode = "list" | "grid";
type MarkName = "square" | "squareOutline" | "diamond" | "triangle" | "circle" | "bars";

interface FsNode {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  date: string;
  items?: number;
}

interface TrashItem {
  node: FsNode;
  from: string;
  deleted: string;
}

type Location =
  | { kind: "dir"; path: string[] }
  | { kind: "recent" }
  | { kind: "trash" };

type Selection = { node: FsNode; dirKey: string | null } | null;

const KIND_STYLE: Record<FileKind, { color: string; code: string; mark: MarkName }> = {
  folder: { color: COLORS.gold, code: "DIR", mark: "square" },
  doc: { color: COLORS.industrialBlack, code: "DOC", mark: "squareOutline" },
  dataset: { color: COLORS.electricCyan, code: "DAT", mark: "diamond" },
  model: { color: COLORS.velocityOrange, code: "MDL", mark: "triangle" },
  image: { color: COLORS.militaryGreen, code: "IMG", mark: "circle" },
  archive: { color: COLORS.signalGreen, code: "ARC", mark: "bars" },
};

// === FILE SYSTEM DATA ===

const TREE: Record<string, FsNode[]> = {
  home: [
    { id: "docs", name: "文档", kind: "folder", size: "—", items: 4, date: "08-16" },
    { id: "datasets", name: "数据集", kind: "folder", size: "—", items: 5, date: "08-15" },
    { id: "models", name: "模型", kind: "folder", size: "—", items: 5, date: "08-12" },
    { id: "imagery", name: "图像语料", kind: "folder", size: "—", items: 4, date: "08-09" },
    { id: "manifest", name: "项目说明-v2.pdf", kind: "doc", size: "2.1M", date: "08-16" },
    { id: "runs-0808", name: "运行归档-0808.tar", kind: "archive", size: "4.7G", date: "08-08" },
  ],
  "home/docs": [
    { id: "wp-ds", name: "白皮书-v2.pdf", kind: "doc", size: "8.4M", date: "08-14" },
    { id: "glossary", name: "术语表.md", kind: "doc", size: "48K", date: "08-13" },
    { id: "release", name: "版本发布说明.docx", kind: "doc", size: "312K", date: "08-11" },
    { id: "lecture", name: "设计规范-03.pdf", kind: "doc", size: "15M", date: "08-02" },
  ],
  "home/datasets": [
    { id: "cpc-200m", name: "cpc-200m.parquet", kind: "dataset", size: "118G", date: "08-15" },
    { id: "sft-v3", name: "指令微调-v3.jsonl", kind: "dataset", size: "42G", date: "08-14" },
    { id: "mmlu", name: "评测集-mmlu.parquet", kind: "dataset", size: "1.6G", date: "08-12" },
    { id: "replay", name: "轨迹回放-0731.csv", kind: "dataset", size: "8.2G", date: "08-01" },
    { id: "captions", name: "图像字幕对.zip", kind: "archive", size: "96G", date: "07-28" },
  ],
  "home/models": [
    { id: "qwen3-8b", name: "qwen3-8b-base.safetensors", kind: "model", size: "16G", date: "08-12" },
    { id: "lora-01", name: "lora-脊线-01.bin", kind: "model", size: "640M", date: "08-10" },
    { id: "tokenizer", name: "tokenizer-构建.json", kind: "model", size: "22M", date: "08-09" },
    { id: "checkpoint", name: "checkpoint-8800", kind: "folder", size: "—", items: 3, date: "08-08" },
    { id: "vae", name: "vae-重构器.pt", kind: "model", size: "335M", date: "08-04" },
  ],
  "home/models/checkpoint": [
    { id: "ckpt-optimizer", name: "optimizer.pt", kind: "model", size: "32G", date: "08-08" },
    { id: "ckpt-scheduler", name: "scheduler.json", kind: "doc", size: "2K", date: "08-08" },
    { id: "ckpt-state", name: "trainer-state.bin", kind: "model", size: "1.1G", date: "08-08" },
  ],
  "home/imagery": [
    { id: "poster-01", name: "海报-构成-01.png", kind: "image", size: "8.1M", date: "08-09" },
    { id: "scan-1962", name: "扫描-档案-1962.jpg", kind: "image", size: "44M", date: "08-07" },
    { id: "grid-ref", name: "版式网格-参考.tiff", kind: "image", size: "210M", date: "07-30" },
    { id: "geo-icons", name: "图标-几何集.svg", kind: "image", size: "2.4M", date: "07-22" },
  ],
};

const SEGMENT_LABELS: Record<string, string> = {
  home: "主页",
  docs: "文档",
  datasets: "数据集",
  models: "模型",
  imagery: "图像语料",
  checkpoint: "checkpoint",
};

const RECENT_REFS: Array<{ dir: string; id: string }> = [
  { dir: "home/datasets", id: "cpc-200m" },
  { dir: "home/models", id: "qwen3-8b" },
  { dir: "home/datasets", id: "sft-v3" },
  { dir: "home/docs", id: "wp-ds" },
  { dir: "home/imagery", id: "poster-01" },
  { dir: "home/models", id: "lora-01" },
];

const INITIAL_TRASH: TrashItem[] = [
  { node: { id: "old-manifesto", name: "旧规范-废弃稿.doc", kind: "doc", size: "88K", date: "—" }, from: "home/docs", deleted: "08-16" },
  { node: { id: "backup-06", name: "冗余备份-06.tar", kind: "archive", size: "220G", date: "—" }, from: "home", deleted: "08-15" },
  { node: { id: "draft-evolution", name: "草稿-演化实验.md", kind: "doc", size: "12K", date: "—" }, from: "home/docs", deleted: "08-14" },
];

const FAVORITES: Array<{ id: string; label: string; mark: MarkName; color: string; loc: Location }> = [
  { id: "fav-recent", label: "最近", mark: "bars", color: COLORS.signalGreen, loc: { kind: "recent" } },
  { id: "fav-docs", label: "文档", mark: "square", color: COLORS.gold, loc: { kind: "dir", path: ["home", "docs"] } },
  { id: "fav-datasets", label: "数据集", mark: "diamond", color: COLORS.electricCyan, loc: { kind: "dir", path: ["home", "datasets"] } },
  { id: "fav-models", label: "模型", mark: "triangle", color: COLORS.velocityOrange, loc: { kind: "dir", path: ["home", "models"] } },
  { id: "fav-trash", label: "回收站", mark: "circle", color: COLORS.red, loc: { kind: "trash" } },
];

// === GEOMETRIC PRIMITIVES ===

function Mark({ name, color, size = 8 }: { name: MarkName; color: string; size?: number }) {
  switch (name) {
    case "diamond":
      return <Box w={`${size}px`} h={`${size}px`} bg={color} transform="rotate(45deg)" />;
    case "triangle":
      return <Box w={`${size + 2}px`} h={`${size}px`} bg={color} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" />;
    case "circle":
      return <Box w={`${size}px`} h={`${size}px`} bg={color} borderRadius="50%" />;
    case "squareOutline":
      return <Box w={`${size}px`} h={`${size}px`} border={`2px solid ${color}`} />;
    case "bars":
      return (
        <Flex direction="column" gap="2px" align="flex-start">
          <Box w={`${size}px`} h="2px" bg={color} />
          <Box w={`${Math.round(size * 0.66)}px`} h="2px" bg={color} />
          <Box w={`${Math.round(size * 0.4)}px`} h="2px" bg={color} />
        </Flex>
      );
    default:
      return <Box w={`${size}px`} h={`${size}px`} bg={color} />;
  }
}

function Thumb({ kind }: { kind: FileKind }) {
  const s = KIND_STYLE[kind];
  return (
    <Box
      h="40px"
      bg={COLORS.concrete}
      border={`1px solid ${COLORS.black}26`}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {kind === "folder" ? (
        <Box w="18px" h="18px" bg={s.color} position="relative">
          <Box position="absolute" bottom="3px" right="3px" w="6px" h="6px" bg={COLORS.pureWhite} />
        </Box>
      ) : (
        <Mark name={s.mark} color={s.color} size={13} />
      )}
      <Box position="absolute" top={0} left={0} w="6px" h="6px" bg={s.color} opacity={0.85} />
    </Box>
  );
}

function StripBtn({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <Box
      as="button"
      px="8px"
      h="22px"
      border={`${BORDER.standard} ${danger ? COLORS.red : COLORS.black}`}
      bg={COLORS.pureWhite}
      color={danger ? COLORS.red : COLORS.black}
      fontFamily={FONT.sans}
      fontWeight={WEIGHT.bold}
      fontSize="10px"
      letterSpacing="0.08em"
      cursor="pointer"
      borderRadius={0}
      _hover={{ bg: danger ? COLORS.red : COLORS.black, color: COLORS.pureWhite }}
      transition={`all ${DURATION.instant}s ease`}
    >
      {label}
    </Box>
  );
}

// === MAIN ===

export default function SceneFileManager() {
  const [fs, setFs] = useState<Record<string, FsNode[]>>(TREE);
  const [trash, setTrash] = useState<TrashItem[]>(INITIAL_TRASH);
  const [loc, setLoc] = useState<Location>({ kind: "dir", path: ["home"] });
  const [view, setView] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Selection>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1600);
    return () => clearTimeout(t);
  }, [flash]);

  const locKey = loc.kind === "dir" ? loc.path.join("/") : loc.kind;

  const activeFav = useMemo(() => {
    if (loc.kind === "recent") return "fav-recent";
    if (loc.kind === "trash") return "fav-trash";
    if (locKey.startsWith("home/docs")) return "fav-docs";
    if (locKey.startsWith("home/datasets")) return "fav-datasets";
    if (locKey.startsWith("home/models")) return "fav-models";
    return null;
  }, [loc, locKey]);

  const items = useMemo(() => {
    let base: FsNode[];
    if (loc.kind === "dir") {
      base = fs[locKey] ?? [];
    } else if (loc.kind === "trash") {
      base = trash.map((t) => ({ ...t.node, date: t.deleted }));
    } else {
      base = RECENT_REFS.map((r) => {
        const node = fs[r.dir]?.find((n) => n.id === r.id);
        return node ? { ...node } : null;
      }).filter((n): n is FsNode => n !== null);
    }
    const q = query.trim().toLowerCase();
    const filtered = q ? base.filter((n) => n.name.toLowerCase().includes(q)) : base;
    // 文件夹优先，组内保持定义顺序
    return [...filtered].sort((a, b) => (a.kind === "folder" ? 0 : 1) - (b.kind === "folder" ? 0 : 1));
  }, [loc.kind, locKey, fs, trash, query]);

  const folderCount = items.filter((n) => n.kind === "folder").length;
  const fileCount = items.length - folderCount;

  const locLabel = useMemo(() => {
    if (loc.kind === "recent") return "最近";
    if (loc.kind === "trash") return "回收站";
    return "/" + loc.path.map((s) => SEGMENT_LABELS[s] ?? s).join("/");
  }, [loc]);

  const navigate = (next: Location) => {
    setLoc(next);
    setSelected(null);
    setQuery("");
  };

  const openFolder = (node: FsNode) => {
    if (loc.kind !== "dir") return;
    const nextPath = [...loc.path, node.id];
    if (!fs[nextPath.join("/")]) return;
    navigate({ kind: "dir", path: nextPath });
  };

  const selectFile = (node: FsNode, dirKey: string | null) => {
    setSelected((prev) => (prev && prev.node.id === node.id ? null : { node, dirKey }));
  };

  const downloadSelected = () => setFlash("已加入下载队列 // QUEUED");

  const deleteSelected = () => {
    if (!selected) return;
    if (loc.kind === "trash") {
      setTrash((prev) => prev.filter((x) => x.node.id !== selected.node.id));
    } else {
      const fromKey = selected.dirKey;
      if (fromKey && fs[fromKey]) {
        setFs((prev) => ({ ...prev, [fromKey]: prev[fromKey].filter((n) => n.id !== selected.node.id) }));
        setTrash((prev) => [{ node: selected.node, from: fromKey, deleted: "08-17" }, ...prev]);
      }
    }
    setSelected(null);
  };

  const restoreSelected = () => {
    if (!selected || loc.kind !== "trash") return;
    const entry = trash.find((x) => x.node.id === selected.node.id);
    if (entry) {
      setFs((prev) => ({ ...prev, [entry.from]: [entry.node, ...(prev[entry.from] ?? [])] }));
      setTrash((prev) => prev.filter((x) => x.node.id !== entry.node.id));
    }
    setSelected(null);
  };

  return (
    <Flex h="100%" overflow="hidden" bg={COLORS.pureWhite}>
      {/* === SIDEBAR — 黑色收藏栏 === */}
      <Box
        w={{ base: "40px", md: "148px" }}
        h="100%"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.industrialBlack}`}
        flexShrink={0}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header */}
        <Box h="34px" position="relative" overflow="hidden" borderBottom={`1px solid ${COLORS.industrialBlack}`} flexShrink={0}>
          <Box
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            bg={COLORS.red}
            clipPath="polygon(0 0, 100% 0, 100% 55%, 0 100%)"
            opacity={0.22}
          />
          <Flex h="100%" align="center" justify={{ base: "center", md: "flex-start" }} px={{ md: "12px" }} gap="8px" position="relative">
            <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" flexShrink={0} />
            <Text
              display={{ base: "none", md: "block" }}
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.black}
              fontSize="10px"
              color={COLORS.metalWhite}
              letterSpacing="0.14em"
            >
              档案局 // FILES
            </Text>
          </Flex>
        </Box>

        {/* Favorites */}
        <Text
          display={{ base: "none", md: "block" }}
          fontFamily={FONT.mono}
          fontSize="8px"
          color={COLORS.metalWhite}
          opacity={0.4}
          letterSpacing="0.16em"
          px="12px"
          mt="10px"
          mb="4px"
        >
          收藏 FAVORITES
        </Text>
        <Box flex={1} overflow="hidden">
          {FAVORITES.map((fav) => {
            const active = activeFav === fav.id;
            return (
              <Flex
                key={fav.id}
                h="32px"
                align="center"
                justify={{ base: "center", md: "flex-start" }}
                px={{ md: "12px" }}
                gap="10px"
                cursor="pointer"
                position="relative"
                bg={active ? COLORS.industrialBlack : "transparent"}
                _hover={{ bg: COLORS.industrialBlack }}
                transition={`background ${DURATION.instant}s ease`}
                onClick={() => navigate(fav.loc)}
              >
                {active && <Box position="absolute" left={0} top={0} h="100%" w="3px" bg={COLORS.red} />}
                <Box opacity={active ? 1 : 0.6} flexShrink={0}>
                  <Mark name={fav.mark} color={fav.color} size={8} />
                </Box>
                <Text
                  display={{ base: "none", md: "block" }}
                  fontFamily={FONT.sans}
                  fontWeight={active ? WEIGHT.black : WEIGHT.regular}
                  fontSize="11px"
                  color={active ? COLORS.pureWhite : COLORS.metalWhite}
                  letterSpacing="0.06em"
                  flex={1}
                  isTruncated
                >
                  {fav.label}
                </Text>
                {fav.id === "fav-trash" && trash.length > 0 && (
                  <Text
                    display={{ base: "none", md: "block" }}
                    fontFamily={FONT.mono}
                    fontSize="8px"
                    fontWeight={WEIGHT.black}
                    color={COLORS.red}
                    flexShrink={0}
                  >
                    {String(trash.length).padStart(2, "0")}
                  </Text>
                )}
              </Flex>
            );
          })}
        </Box>

        {/* Storage meter */}
        <Box px="12px" py="8px" borderTop={`1px solid ${COLORS.industrialBlack}`} display={{ base: "none", md: "block" }} flexShrink={0}>
          <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.metalWhite} opacity={0.45} letterSpacing="0.14em">
            存储 STORAGE
          </Text>
          <Flex gap="2px" mt="5px">
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} flex={1} h="5px" bg={i < 5 ? COLORS.red : COLORS.industrialBlack} />
            ))}
          </Flex>
          <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} mt="4px" sx={{ fontVariantNumeric: "tabular-nums" }}>
            1.2T / 2.0T
          </Text>
        </Box>

        <Flex h="24px" align="center" justify="center" borderTop={`1px solid ${COLORS.industrialBlack}`} flexShrink={0}>
          <Text fontFamily={FONT.mono} fontSize="8px" fontWeight={WEIGHT.black} color={COLORS.gold} letterSpacing="0.12em">
            FS
          </Text>
        </Flex>
      </Box>

      {/* === MAIN === */}
      <Flex flex={1} direction="column" minW="0" overflow="hidden">
        {/* Toolbar */}
        <Flex
          h="36px"
          bg={COLORS.pureWhite}
          borderBottom={`${BORDER.hairline} ${COLORS.industrialBlack}`}
          align="center"
          gap="8px"
          px="10px"
          flexShrink={0}
        >
          {/* Breadcrumb */}
          <Flex align="center" gap="6px" flex={1} minW="0" overflow="hidden">
            <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.4}>
              /
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              fontWeight={WEIGHT.bold}
              color={COLORS.black}
              cursor={loc.kind === "dir" && loc.path.length > 1 ? "pointer" : "default"}
              onClick={() => loc.kind === "dir" && loc.path.length > 1 && navigate({ kind: "dir", path: ["home"] })}
              _hover={loc.kind === "dir" && loc.path.length > 1 ? { color: COLORS.red } : undefined}
              flexShrink={0}
            >
              主页
            </Text>
            {loc.kind === "dir"
              ? loc.path.slice(1).map((seg, i) => {
                  const isLast = i === loc.path.length - 2;
                  const goBack = () => navigate({ kind: "dir", path: loc.path.slice(0, i + 2) });
                  return (
                    <Flex key={seg} align="center" gap="6px" minW="0">
                      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.4} flexShrink={0}>
                        /
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="10px"
                        isTruncated
                        flexShrink={0}
                        fontWeight={isLast ? WEIGHT.black : WEIGHT.regular}
                        color={isLast ? COLORS.red : COLORS.black}
                        cursor={isLast ? "default" : "pointer"}
                        onClick={() => !isLast && goBack()}
                        _hover={isLast ? undefined : { color: COLORS.red }}
                      >
                        {SEGMENT_LABELS[seg] ?? seg}
                      </Text>
                    </Flex>
                  );
                })
              : (
                <>
                  <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.4}>
                    /
                  </Text>
                  <Text fontFamily={FONT.mono} fontSize="10px" fontWeight={WEIGHT.black} color={COLORS.red}>
                    {loc.kind === "recent" ? "最近" : "回收站"}
                  </Text>
                </>
              )}
          </Flex>

          {/* View toggle */}
          <Flex border={`${BORDER.standard} ${COLORS.black}`} flexShrink={0}>
            {(["list", "grid"] as const).map((v, i) => {
              const active = view === v;
              return (
                <Flex
                  key={v}
                  as="button"
                  align="center"
                  justify="center"
                  h="24px"
                  w={{ base: "26px", md: "auto" }}
                  px={{ md: "8px" }}
                  gap="5px"
                  borderLeft={i === 1 ? `1px solid ${COLORS.black}` : "none"}
                  bg={active ? COLORS.red : COLORS.pureWhite}
                  cursor="pointer"
                  borderRadius={0}
                  _hover={active ? undefined : { bg: COLORS.concrete }}
                  transition={`background ${DURATION.instant}s ease`}
                  onClick={() => setView(v)}
                  title={v === "list" ? "列表视图" : "网格视图"}
                >
                  <Text fontFamily={FONT.mono} fontSize="11px" fontWeight={WEIGHT.black} color={active ? COLORS.pureWhite : COLORS.black} lineHeight={1}>
                    {v === "list" ? "≡" : "▦"}
                  </Text>
                  <Text
                    display={{ base: "none", md: "block" }}
                    fontFamily={FONT.sans}
                    fontSize="9px"
                    fontWeight={WEIGHT.bold}
                    letterSpacing="0.08em"
                    color={active ? COLORS.pureWhite : COLORS.black}
                  >
                    {v === "list" ? "列表" : "网格"}
                  </Text>
                </Flex>
              );
            })}
          </Flex>

          {/* Search */}
          <Input
            h="24px"
            w={{ base: "72px", md: "118px" }}
            flexShrink={0}
            borderRadius={0}
            border={`${BORDER.standard} ${COLORS.industrialBlack}`}
            fontFamily={FONT.mono}
            fontSize="10px"
            px="8px"
            placeholder="搜索档案"
            _placeholder={{ color: `${COLORS.black}59` }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            _focus={{ border: `${BORDER.standard} ${COLORS.red}`, boxShadow: SHADOW.none }}
          />
        </Flex>

        {/* Content */}
        <Box flex={1} overflowY="auto" bg={COLORS.pureWhite} position="relative">
          {items.length === 0 ? (
            <Flex h="100%" direction="column" align="center" justify="center" gap="10px">
              <Box w="28px" h="28px" border={`${BORDER.standard} ${COLORS.black}`} opacity={0.3} position="relative">
                <Box position="absolute" top="5px" left="5px" w="6px" h="6px" bg={COLORS.red} opacity={0.5} />
              </Box>
              <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.5} letterSpacing="0.08em">
                {query ? "未发现匹配 // NO MATCH" : loc.kind === "trash" ? "回收站为空 // EMPTY" : "空文件夹 // EMPTY"}
              </Text>
            </Flex>
          ) : (
            <M.Box
              key={`${locKey}|${view}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {view === "list" ? (
                <Box>
                  {/* Column header */}
                  <Flex
                    align="center"
                    gap="8px"
                    px="10px"
                    h="22px"
                    bg={COLORS.concrete}
                    borderBottom={`1px solid ${COLORS.black}26`}
                    position="sticky"
                    top={0}
                    zIndex={1}
                  >
                    <Box w="8px" flexShrink={0} />
                    <Box w="26px" flexShrink={0} display={{ base: "none", md: "block" }} />
                    <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.6} letterSpacing="0.12em">
                      名称
                    </Text>
                    <Text
                      w="52px"
                      textAlign="right"
                      fontFamily={FONT.mono}
                      fontSize="8px"
                      color={COLORS.industrialBlack}
                      opacity={0.6}
                      letterSpacing="0.12em"
                      display={{ base: "none", md: "block" }}
                    >
                      大小
                    </Text>
                    <Text
                      w="48px"
                      textAlign="right"
                      fontFamily={FONT.mono}
                      fontSize="8px"
                      color={COLORS.industrialBlack}
                      opacity={0.6}
                      letterSpacing="0.12em"
                      display={{ base: "none", md: "block" }}
                    >
                      修改
                    </Text>
                  </Flex>

                  {/* Rows */}
                  {items.map((node) => {
                    const s = KIND_STYLE[node.kind];
                    const isSel = selected?.node.id === node.id;
                    return (
                      <Flex
                        key={node.id}
                        h="28px"
                        align="center"
                        gap="8px"
                        px="10px"
                        cursor="pointer"
                        borderBottom={`1px solid ${COLORS.black}0f`}
                        bg={isSel ? `${COLORS.red}0f` : "transparent"}
                        boxShadow={isSel ? `inset 3px 0 0 0 ${COLORS.red}` : undefined}
                        _hover={{ bg: isSel ? `${COLORS.red}0f` : COLORS.concrete }}
                        transition={`background ${DURATION.instant}s ease`}
                        onClick={() =>
                          node.kind === "folder"
                            ? openFolder(node)
                            : selectFile(node, loc.kind === "dir" ? locKey : loc.kind === "recent" ? RECENT_REFS.find((r) => r.id === node.id)?.dir ?? null : null)
                        }
                      >
                        <Box w="8px" flexShrink={0} display="flex" alignItems="center">
                          <Mark name={s.mark} color={s.color} size={8} />
                        </Box>
                        <Text
                          w="26px"
                          flexShrink={0}
                          fontFamily={FONT.mono}
                          fontSize="8px"
                          fontWeight={WEIGHT.black}
                          color={s.color}
                          letterSpacing="0.06em"
                          display={{ base: "none", md: "block" }}
                        >
                          {s.code}
                        </Text>
                        <Text
                          flex={1}
                          minW="0"
                          isTruncated
                          fontFamily={FONT.sans}
                          fontWeight={node.kind === "folder" ? WEIGHT.black : WEIGHT.bold}
                          fontSize="11px"
                          color={COLORS.black}
                        >
                          {node.name}
                        </Text>
                        {node.kind === "folder" && (
                          <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.industrialBlack} opacity={0.4} flexShrink={0}>
                            ›
                          </Text>
                        )}
                        <Text
                          w="52px"
                          textAlign="right"
                          fontFamily={FONT.mono}
                          fontSize="9px"
                          color={COLORS.industrialBlack}
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                          display={{ base: "none", md: "block" }}
                          flexShrink={0}
                        >
                          {node.kind === "folder" ? `${node.items ?? 0} 项` : node.size}
                        </Text>
                        <Text
                          w="48px"
                          textAlign="right"
                          fontFamily={FONT.mono}
                          fontSize="9px"
                          color={COLORS.industrialBlack}
                          opacity={0.75}
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                          display={{ base: "none", md: "block" }}
                          flexShrink={0}
                        >
                          {node.date}
                        </Text>
                      </Flex>
                    );
                  })}
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} gap="10px" p="12px">
                  {items.map((node) => {
                    const isSel = selected?.node.id === node.id;
                    return (
                      <Box
                        key={node.id}
                        p="6px"
                        bg={COLORS.pureWhite}
                        border={isSel ? `${BORDER.standard} ${COLORS.red}` : `${BORDER.standard} ${COLORS.black}`}
                        boxShadow={isSel ? `3px 3px 0 ${COLORS.red}` : SHADOW.small}
                        cursor="pointer"
                        textAlign="center"
                        _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.medium }}
                        transition={`all ${DURATION.instant}s ease`}
                        onClick={() =>
                          node.kind === "folder"
                            ? openFolder(node)
                            : selectFile(node, loc.kind === "dir" ? locKey : loc.kind === "recent" ? RECENT_REFS.find((r) => r.id === node.id)?.dir ?? null : null)
                        }
                      >
                        <Thumb kind={node.kind} />
                        <Text
                          mt="6px"
                          fontFamily={FONT.sans}
                          fontWeight={WEIGHT.bold}
                          fontSize="10px"
                          color={COLORS.black}
                          isTruncated
                        >
                          {node.name}
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.6} sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {node.kind === "folder" ? `${node.items ?? 0} 项` : node.size}
                        </Text>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
            </M.Box>
          )}
        </Box>

        {/* Detail strip */}
        <AnimatePresence>
          {selected && (
            <M.Box
              key="detail-strip"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: "easeOut" }}
              overflow="hidden"
              flexShrink={0}
            >
              <Flex
                h="54px"
                bg={COLORS.pureWhite}
                borderTop={`${BORDER.heavy} ${COLORS.black}`}
                align="center"
                gap="10px"
                px="12px"
              >
                <Flex
                  w="28px"
                  h="28px"
                  border={`${BORDER.standard} ${COLORS.black}`}
                  bg={COLORS.concrete}
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Mark name={KIND_STYLE[selected.node.kind].mark} color={KIND_STYLE[selected.node.kind].color} size={10} />
                </Flex>
                <Box flex={1} minW="0">
                  <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="11px" color={COLORS.black} isTruncated>
                    {selected.node.name}
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="9px"
                    color={flash ? COLORS.signalGreen : COLORS.industrialBlack}
                    opacity={flash ? 1 : 0.7}
                    letterSpacing="0.04em"
                    isTruncated
                  >
                    {flash
                      ? flash
                      : `${KIND_STYLE[selected.node.kind].code} · ${selected.node.size} · ${selected.node.date} · ${locLabel}`}
                  </Text>
                </Box>
                <Flex gap="6px" flexShrink={0}>
                  {loc.kind === "trash" ? (
                    <StripBtn label="还原" onClick={restoreSelected} />
                  ) : (
                    <StripBtn label="下载" onClick={downloadSelected} />
                  )}
                  <StripBtn label={loc.kind === "trash" ? "粉碎" : "删除"} danger onClick={deleteSelected} />
                </Flex>
                <Box
                  as="button"
                  ml="2px"
                  w="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                  fontFamily={FONT.mono}
                  fontSize="11px"
                  color={COLORS.black}
                  cursor="pointer"
                  borderRadius={0}
                  bg={COLORS.pureWhite}
                  _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
                  onClick={() => setSelected(null)}
                  flexShrink={0}
                >
                  ×
                </Box>
              </Flex>
            </M.Box>
          )}
        </AnimatePresence>

        {/* Status bar */}
        <Flex
          h="22px"
          bg={COLORS.black}
          align="center"
          justify="space-between"
          px="10px"
          gap="8px"
          flexShrink={0}
        >
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            color={COLORS.metalWhite}
            opacity={0.6}
            letterSpacing="0.08em"
            isTruncated
          >
            共 {items.length} 项 // {folderCount} 文件夹 // {fileCount} 文件
          </Text>
          <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.gold} letterSpacing="0.08em" flexShrink={0}
            display={{ base: "none", sm: "block" }}>
            FS // 1.2T 已用
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
