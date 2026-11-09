import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box) };

type MarkColor = "red" | "gold" | "cyan" | "orange" | "black";

type CommentNode = {
  id: string;
  author: string;
  initials: string;
  mark: MarkColor;
  time: string;
  text: string;
  likes: number;
  floor?: number; // 仅顶层评论持有楼层号
  replies?: CommentNode[];
};

type ReplyCtx = {
  attach: string; // 回复挂载的目标节点 id
  box: string; // 输入框展示的节点 id
  thread: string; // 所属顶层线程 id
  label: string; // 占位符中的目标作者
};

const MARK_BG: Record<MarkColor, string> = {
  red: COLORS.red,
  gold: COLORS.gold,
  cyan: COLORS.electricCyan,
  orange: COLORS.velocityOrange,
  black: COLORS.black,
};

const SEED: CommentNode[] = [
  {
    id: "c1",
    author: "赵铁生",
    initials: "赵",
    mark: "red",
    time: "08-16 21:04",
    likes: 12,
    floor: 1,
    text: "设计规范的要点在于：用几何表达层级。红色方块不是装饰，是方向的标记。评论层级也应当如此——用线条与缩进表达从属，而非阴影与圆角。",
    replies: [
      {
        id: "c1-r1",
        author: "孙立",
        initials: "孙",
        mark: "cyan",
        time: "08-16 21:18",
        likes: 4,
        text: "同意。垂直红线既是视觉引导，也是结构语义：回复永远从属于左侧的父节点。",
      },
    ],
  },
  {
    id: "c2",
    author: "钱进",
    initials: "钱",
    mark: "gold",
    time: "08-17 09:32",
    likes: 7,
    floor: 2,
    text: "发布流程走查完毕：输入 → 红色按钮 → 新楼层入列。零圆角、硬阴影、等宽时间戳，全部符合设计规范。唯一问题：楼层数字建议加宽字距。",
    replies: [
      {
        id: "c2-r1",
        author: "周波",
        initials: "周",
        mark: "orange",
        time: "08-17 09:41",
        likes: 2,
        text: "字距已调至 0.08em，与仪表盘编号一致。",
        replies: [
          {
            id: "c2-r1-r1",
            author: "钱进",
            initials: "钱",
            mark: "gold",
            time: "08-17 09:44",
            likes: 1,
            text: "确认。合并到主干。",
          },
        ],
      },
      {
        id: "c2-r2",
        author: "何敏",
        initials: "何",
        mark: "cyan",
        time: "08-17 10:02",
        likes: 3,
        text: "第二层缩进建议用金色轨道，红金交替可读性最佳。",
      },
      {
        id: "c2-r3",
        author: "孙立",
        initials: "孙",
        mark: "cyan",
        time: "08-17 10:15",
        likes: 0,
        text: "已实现。展开状态下轨道透明度再降一档试试。",
      },
    ],
  },
  {
    id: "c3",
    author: "何敏",
    initials: "何",
    mark: "cyan",
    time: "08-17 11:20",
    likes: 5,
    floor: 3,
    text: "点赞交互建议：未点亮为空心计数，点亮后红色填充并 +1，撤销时即刻复原。状态必须完全可逆。",
    replies: [
      {
        id: "c3-r1",
        author: "吴兰",
        initials: "吴",
        mark: "orange",
        time: "08-17 11:28",
        likes: 2,
        text: "填充态用 redDark 描边、red 主体，hover 抬升 2px，按压下沉 1px。",
        replies: [
          {
            id: "c3-r1-r1",
            author: "何敏",
            initials: "何",
            mark: "cyan",
            time: "08-17 11:35",
            likes: 1,
            text: "已验证，对比度达标。收进规范。",
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    author: "吴兰",
    initials: "吴",
    mark: "orange",
    time: "08-17 12:47",
    likes: 1,
    floor: 4,
    text: "提醒：楼层号 #n 必须使用等宽数字，避免列表抖动。已核对，tabular-nums 生效。",
  },
  {
    id: "c5",
    author: "周波",
    initials: "周",
    mark: "red",
    time: "08-17 13:15",
    likes: 9,
    floor: 5,
    text: "整套线程就是一张讨论地图：楼层是经线，回复轨道是纬线。保持加速，同志们。",
  },
];

/** 统计全部节点数（楼层 + 各级回复） */
const countAll = (nodes: CommentNode[]): number =>
  nodes.reduce((sum, n) => sum + 1 + (n.replies?.length ? countAll(n.replies) : 0), 0);

/** 纯函数：向目标节点下挂载回复（两层封顶由调用方控制 attach 目标） */
const insertReply = (nodes: CommentNode[], targetId: string, node: CommentNode): CommentNode[] =>
  nodes.map((n) => {
    if (n.id === targetId) return { ...n, replies: [...(n.replies ?? []), node] };
    if (n.replies?.length) return { ...n, replies: insertReply(n.replies, targetId, node) };
    return n;
  });

/** 几何头像标记 —— 零圆角方块 + 等宽首字 + 角落缺口 */
function Mark({
  color,
  initials,
  size = "22px",
  fontSize = "10px",
}: {
  color: MarkColor;
  initials: string;
  size?: string;
  fontSize?: string;
}) {
  return (
    <Flex
      w={size}
      h={size}
      bg={MARK_BG[color]}
      border={color === "black" ? `1px solid ${COLORS.gold}` : "none"}
      align="center"
      justify="center"
      flexShrink={0}
      position="relative"
    >
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize={fontSize}
        lineHeight={1}
        color={color === "gold" ? COLORS.black : COLORS.pureWhite}
      >
        {initials}
      </Text>
      <Box
        position="absolute"
        bottom="0px"
        right="0px"
        w="3px"
        h="3px"
        bg={color === "black" ? COLORS.red : COLORS.black}
      />
    </Flex>
  );
}

/** 小型等宽动作按钮 —— 点亮后红色填充 */
function ActionButton({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <Button
      onClick={onClick}
      borderRadius={0}
      h="18px"
      px="7px"
      py={0}
      minWidth="auto"
      fontFamily={FONT.mono}
      fontSize="9px"
      fontWeight={WEIGHT.bold}
      letterSpacing="0.08em"
      bg={active ? COLORS.red : "transparent"}
      color={active ? COLORS.pureWhite : COLORS.industrialBlack}
      border={`1px solid ${active ? COLORS.redDark : COLORS.metalWhite}`}
      _hover={{
        bg: active ? COLORS.redLight : COLORS.black,
        color: COLORS.pureWhite,
        borderColor: COLORS.black,
      }}
      _active={{ transform: "translateY(1px)" }}
      transition={`all ${DURATION.instant}s ease`}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </Button>
  );
}

/** 展开 / 收起回复 —— 黑底金字等宽按钮 */
function ThreadToggle({
  collapsed,
  count,
  onClick,
}: {
  collapsed: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      borderRadius={0}
      h="20px"
      px="8px"
      py={0}
      mt="8px"
      alignSelf="flex-start"
      fontFamily={FONT.mono}
      fontSize="9px"
      fontWeight={WEIGHT.bold}
      letterSpacing="0.08em"
      bg={COLORS.black}
      color={COLORS.gold}
      border={`1px solid ${COLORS.black}`}
      _hover={{ bg: COLORS.red, color: COLORS.pureWhite }}
      _active={{ transform: "translateY(1px)" }}
      transition={`all ${DURATION.instant}s ease`}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {collapsed ? `展开 ${count} 条回复 ↓` : "收起回复 ↑"}
    </Button>
  );
}

export default function SceneComments() {
  const [threads, setThreads] = useState<CommentNode[]>(SEED);
  const [draft, setDraft] = useState("");
  const [likedIds, setLikedIds] = useState<ReadonlySet<string>>(new Set());
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(new Set(["c2"]));
  const [replyCtx, setReplyCtx] = useState<ReplyCtx | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const nextIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新楼层入列时自动滚到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [threads.length]);

  const toggleLike = (id: string) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleCollapse = (id: string) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const makeMine = (text: string): CommentNode => ({
    id: `n-${nextIdRef.current++}`,
    author: "你",
    initials: "你",
    mark: "black",
    time: "刚刚",
    text,
    likes: 0,
  });

  const submitTop = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads((prev) => [...prev, { ...makeMine(text), floor: prev.length + 1 }]);
    setDraft("");
  };

  const submitReply = (attachId: string, threadId: string) => {
    const text = replyDraft.trim();
    if (!text) return;
    setThreads((prev) => insertReply(prev, attachId, makeMine(text)));
    setReplyDraft("");
    setReplyCtx(null);
    // 目标线程若处于收起态则自动展开
    setCollapsedIds((prev) => {
      if (!prev.has(threadId)) return prev;
      const next = new Set(prev);
      next.delete(threadId);
      return next;
    });
  };

  const closeReplyBox = () => {
    setReplyCtx(null);
    setReplyDraft("");
  };

  /** 行内回复输入框（顶层 / 回复两种尺寸） */
  const renderReplyBox = (ctx: ReplyCtx, small: boolean) => (
    <Flex mt="8px" gap="6px" alignItems="stretch">
      <Box
        flex={1}
        minW={0}
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.industrialBlack}`}
        boxShadow={SHADOW.small}
        px="8px"
        h={small ? "26px" : "30px"}
        display="flex"
        alignItems="center"
        _focusWithin={{ borderColor: COLORS.red }}
        transition={`border-color ${DURATION.fast}s ease`}
      >
        <Box
          as="input"
          value={replyDraft}
          autoFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyDraft(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") submitReply(ctx.attach, ctx.thread);
            if (e.key === "Escape") closeReplyBox();
          }}
          placeholder={`回复 @${ctx.label} // ENTER 发布`}
          width="100%"
          border="none"
          outline="none"
          bg="transparent"
          fontFamily={FONT.mono}
          fontSize="10px"
          color={COLORS.black}
          _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
        />
      </Box>
      <Button
        flexShrink={0}
        onClick={() => submitReply(ctx.attach, ctx.thread)}
        isDisabled={!replyDraft.trim()}
        bg={COLORS.red}
        color={COLORS.pureWhite}
        border={`1px solid ${COLORS.redDark}`}
        borderRadius={0}
        h={small ? "26px" : "30px"}
        px="8px"
        fontFamily={FONT.mono}
        fontSize="9px"
        fontWeight={WEIGHT.bold}
        letterSpacing="0.08em"
        _hover={{ bg: COLORS.redLight }}
        transition={`all ${DURATION.instant}s ease`}
      >
        发布
      </Button>
      <Button
        flexShrink={0}
        onClick={closeReplyBox}
        bg="transparent"
        color={COLORS.industrialBlack}
        border={`1px solid ${COLORS.industrialBlack}`}
        borderRadius={0}
        h={small ? "26px" : "30px"}
        px="8px"
        fontFamily={FONT.mono}
        fontSize="9px"
        fontWeight={WEIGHT.bold}
        letterSpacing="0.08em"
        _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
        transition={`all ${DURATION.instant}s ease`}
      >
        取消
      </Button>
    </Flex>
  );

  /** 动作行：回复（展开行内输入）+ 点赞（红色填充切换） */
  const renderActions = (node: CommentNode, attachId: string, boxActive: boolean, threadId: string) => {
    const liked = likedIds.has(node.id);
    const likeCount = node.likes + (liked ? 1 : 0);
    return (
      <Flex gap="6px" mt="6px" alignItems="center">
        <ActionButton
          active={boxActive}
          onClick={() => {
            if (replyCtx && replyCtx.box === node.id) {
              closeReplyBox();
            } else {
              setReplyCtx({ attach: attachId, box: node.id, thread: threadId, label: node.author });
              setReplyDraft("");
            }
          }}
        >
          回复
        </ActionButton>
        <ActionButton active={liked} onClick={() => toggleLike(node.id)}>
          {`点赞 ${likeCount}`}
        </ActionButton>
      </Flex>
    );
  };

  /** 递归渲染回复分支：红色一级轨道 / 金色二级轨道 + 转角连接件 */
  const renderReply = (node: CommentNode, depth: 1 | 2, parent: CommentNode, threadId: string) => {
    const railColor = depth === 1 ? COLORS.red : COLORS.gold;
    const attachId = depth === 2 ? parent.id : node.id; // 二级回复转为同级追加，封顶两层
    return (
      <M.Box
        key={node.id}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: DURATION.fast, ease: EASING.launch }}
      >
        <Flex pl={{ base: "2px", sm: "4px" }} gap={{ base: "5px", sm: "8px" }} mt="10px" alignItems="stretch">
          {/* 轨道：转角横件 + 垂直竖线（窄屏收缩变细） */}
          <Flex flexDirection="column" alignItems="flex-end" flexShrink={0} w={{ base: "10px", sm: "14px" }}>
            <Box w={{ base: "10px", sm: "14px" }} h={{ base: "7px", sm: "8px" }} />
            <Box w={{ base: "10px", sm: "14px" }} h="2px" bg={railColor} />
            <Box w={{ base: "1px", sm: "2px" }} flex={1} bg={railColor} opacity={0.45} />
          </Flex>
          <Box flex={1} minW={0}>
            <Flex align="center" gap="6px" flexWrap="wrap">
              <Mark color={node.mark} initials={node.initials} size="18px" fontSize="9px" />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="11px"
                color={COLORS.black}
                letterSpacing="0.02em"
              >
                {node.author}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.industrialBlack}
                opacity={0.65}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {node.time}
              </Text>
            </Flex>
            <Text
              mt="3px"
              fontFamily={FONT.sans}
              fontSize="11px"
              fontWeight={WEIGHT.regular}
              lineHeight={1.6}
              color={COLORS.black}
              opacity={0.85}
              wordBreak="break-word"
            >
              {depth === 2 && (
                <Box
                  as="span"
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  color={COLORS.red}
                >{`@${parent.author} `}</Box>
              )}
              {node.text}
            </Text>
            {renderActions(node, attachId, replyCtx?.box === node.id, threadId)}
            {replyCtx?.box === node.id && renderReplyBox(replyCtx, true)}
            {depth === 1 && node.replies?.map((child) => renderReply(child, 2, node, threadId))}
          </Box>
        </Flex>
      </M.Box>
    );
  };

  /** 顶层楼层：头像 + 名称 + 等宽时间 + 金色楼层号 + 发丝分割线 */
  const renderThread = (node: CommentNode) => {
    const collapsed = collapsedIds.has(node.id);
    const replyCount = node.replies?.length ?? 0;
    return (
      <M.Box
        key={node.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.fast, ease: EASING.launch }}
        pb="12px"
        mb="12px"
        borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}
        _last={{ borderBottom: "none", mb: "0px", pb: "2px" }}
      >
        <Flex gap={{ base: "8px", sm: "10px" }} alignItems="flex-start">
          <Mark color={node.mark} initials={node.initials} />
          <Box flex={1} minW={0}>
            <Flex align="baseline" gap="8px" flexWrap="wrap">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                color={COLORS.black}
                letterSpacing="0.03em"
              >
                {node.author}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                color={COLORS.industrialBlack}
                opacity={0.6}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {node.time}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="10px"
                color={COLORS.gold}
                letterSpacing="0.08em"
                ml="auto"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >{`#${node.floor}`}</Text>
            </Flex>
            <Text
              mt="4px"
              fontFamily={FONT.sans}
              fontSize="12px"
              fontWeight={WEIGHT.regular}
              lineHeight={1.65}
              color={COLORS.black}
              wordBreak="break-word"
            >
              {node.text}
            </Text>
            {renderActions(node, node.id, replyCtx?.box === node.id, node.id)}
            {replyCtx?.box === node.id && renderReplyBox(replyCtx, false)}
            {replyCount >= 3 && (
              <ThreadToggle
                collapsed={collapsed}
                count={replyCount}
                onClick={() => toggleCollapse(node.id)}
              />
            )}
            {!collapsed && node.replies?.map((child) => renderReply(child, 1, node, node.id))}
          </Box>
        </Flex>
      </M.Box>
    );
  };

  const canPost = draft.trim() !== "";

  return (
    <Flex h="100%" flexDirection="column" bg={COLORS.concrete} overflow="hidden">
      {/* === 头部黑条 === */}
      <Box bg={COLORS.black} flexShrink={0}>
        <Box h="2px" bg={COLORS.red} />
        <Flex h="34px" px="12px" align="center" justify="space-between">
          <Flex align="center" gap="8px" minW={0}>
            <Box w="8px" h="8px" bg={COLORS.gold} flexShrink={0} />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="12px"
              color={COLORS.pureWhite}
              letterSpacing="0.08em"
              isTruncated
            >
              评论线程 // DISCUSSION
            </Text>
          </Flex>
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            opacity={0.65}
            letterSpacing="0.06em"
            flexShrink={0}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {`发言 ${countAll(threads)} // 楼层 ${threads.length}`}
          </Text>
        </Flex>
      </Box>

      {/* === 可滚动评论列 === */}
      <Box
        ref={scrollRef}
        flex={1}
        overflowY="auto"
        px="12px"
        py="12px"
        position="relative"
        sx={{
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { bg: COLORS.industrialBlack },
        }}
      >
        {/* 远景几何装饰 —— 几何红色菱形 */}
        <Box
          position="absolute"
          top="16px"
          right="8px"
          w="64px"
          h="64px"
          border={`${BORDER.heavy} ${COLORS.red}`}
          opacity={0.06}
          transform="rotate(45deg)"
          pointerEvents="none"
        />
        {threads.map(renderThread)}
      </Box>

      {/* === 底部发布器 —— 重型边框 + 硬阴影 === */}
      <Box bg={COLORS.pureWhite} borderTop={`${BORDER.heavy} ${COLORS.black}`} flexShrink={0}>
        <Flex p="10px" gap="8px" alignItems="center">
          <Mark color="black" initials="你" size="32px" fontSize="13px" />
          <Box
            flex={1}
            minW={0}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.industrialBlack}`}
            boxShadow={SHADOW.small}
            px="10px"
            h="34px"
            display="flex"
            alignItems="center"
            _focusWithin={{ borderColor: COLORS.red }}
            transition={`border-color ${DURATION.fast}s ease`}
          >
            <Box
              as="input"
              value={draft}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") submitTop();
              }}
              placeholder="发表评论 // ENTER 发布"
              width="100%"
              border="none"
              outline="none"
              bg="transparent"
              fontFamily={FONT.mono}
              fontSize="11px"
              color={COLORS.black}
              _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
            />
          </Box>
          <Button
            flexShrink={0}
            onClick={submitTop}
            isDisabled={!canPost}
            bg={COLORS.red}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            boxShadow={SHADOW.red}
            borderRadius={0}
            h="34px"
            px="14px"
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.1em"
            _hover={
              canPost
                ? { bg: COLORS.redLight, transform: "translateY(-2px)", boxShadow: SHADOW.red }
                : undefined
            }
            _active={canPost ? { transform: "translateY(1px)", boxShadow: `2px 2px 0px ${COLORS.redDark}` } : undefined}
            transition={`all ${DURATION.fast}s ease`}
          >
            发布 ↵
          </Button>
        </Flex>
        <Box h="3px" bg={COLORS.red} />
      </Box>
    </Flex>
  );
}
