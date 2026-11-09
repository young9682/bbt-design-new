import { Box, Flex, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box) };

type Side = "them" | "me";

type ChatMsg = {
  id: number;
  from: Side;
  text: string;
  time: string;
};

const INITIAL_MESSAGES: ChatMsg[] = [
  { id: 1, from: "them", text: "报告：第三班次审批窗口已确认，权限策略同步完毕。", time: "09:41" },
  { id: 2, from: "me", text: "收到。权限下发进度？", time: "09:42" },
  { id: 3, from: "them", text: "92% // 预计 14 分钟后完成全部生效。", time: "09:43" },
  { id: 4, from: "them", text: "同步链路稳定，接口延迟 8ms。策略校验完毕。", time: "09:44" },
  { id: 5, from: "me", text: "保持监控。红色即进度。", time: "09:45" },
];

const REPLIES = [
  "收到。红色信号已确认。",
  "几何即意义。继续推进。",
  "监控正常 // 延迟 8ms，全速前进。",
  "同意。以红色楔形切入白色空间。",
  "信号加速中。保持频率，同志。",
];

const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** 顶部扫描虚线 —— RefNavBar 机械感装饰 */
function Scanline() {
  return (
    <Box
      h="2px"
      w="100%"
      flexShrink={0}
      backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
      opacity={0.5}
    />
  );
}

/** 仪器色条 —— 红 / 橙 / 金 / 青 / 绿 / 黑 */
function InstrumentStrip() {
  return (
    <Flex h="4px" w="100%" flexShrink={0}>
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
      <Box flex={2} bg={COLORS.black} />
    </Flex>
  );
}

/** 几何发送者标记 —— 零圆角的几何构成头像 */
function SenderMark({ side, size = "20px" }: { side: Side; size?: string }) {
  const inner = side === "them" ? "6px" : "6px";
  return (
    <Box
      w={size}
      h={size}
      bg={side === "them" ? COLORS.gold : COLORS.black}
      border={side === "them" ? "none" : `1px solid ${COLORS.gold}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Box w={inner} h={inner} bg={side === "them" ? COLORS.black : COLORS.red} />
    </Box>
  );
}

/** 日期分隔线 —— 等宽金字 + 两侧细线 */
function DayDivider({ label }: { label: string }) {
  return (
    <Flex align="center" gap={SPACE.sm} flexShrink={0}>
      <Box flex={1} h="1px" bg={COLORS.black} opacity={0.25} />
      <Text
        fontFamily={FONT.mono}
        fontSize="8px"
        fontWeight={WEIGHT.bold}
        letterSpacing="0.15em"
        color={COLORS.gold}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {label}
      </Text>
      <Box flex={1} h="1px" bg={COLORS.black} opacity={0.25} />
    </Flex>
  );
}

/** 单条消息行 —— 对方黑泡 / 自己红泡，不对称最大宽度，等宽时间戳 */
function MessageRow({ msg }: { msg: ChatMsg }) {
  const isMe = msg.from === "me";
  return (
    <M.Box
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast, ease: EASING.launch }}
      alignSelf={isMe ? "flex-end" : "flex-start"}
      maxW={isMe ? "68%" : "75%"}
      display="flex"
      alignItems="flex-end"
      gap={SPACE.sm}
      flexDirection={isMe ? "row-reverse" : "row"}
    >
      <SenderMark side={msg.from} />
      <Box>
        <Box
          bg={isMe ? COLORS.red : COLORS.black}
          border={isMe ? `${BORDER.standard} ${COLORS.redDark}` : "none"}
          boxShadow={isMe ? SHADOW.red : SHADOW.small}
          px="10px"
          py="7px"
        >
          <Text
            fontFamily={FONT.sans}
            fontSize="11px"
            fontWeight={WEIGHT.regular}
            lineHeight={1.55}
            color={COLORS.pureWhite}
            wordBreak="break-word"
          >
            {msg.text}
          </Text>
        </Box>
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          color={COLORS.industrialBlack}
          opacity={0.6}
          mt="3px"
          textAlign={isMe ? "right" : "left"}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {msg.time}
        </Text>
      </Box>
    </M.Box>
  );
}

/** 对方正在输入 —— 黑泡内三枚脉冲方块 */
function TypingBubble() {
  return (
    <M.Box
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast, ease: EASING.launch }}
      alignSelf="flex-start"
      maxW="75%"
      display="flex"
      alignItems="flex-end"
      gap={SPACE.sm}
    >
      <SenderMark side="them" />
      <Box bg={COLORS.black} boxShadow={SHADOW.small} px="12px" py="9px">
        <Flex gap="5px">
          {[COLORS.gold, COLORS.red, COLORS.electricCyan].map((c, i) => (
            <M.Box
              key={c}
              w="6px"
              h="6px"
              bg={c}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: i * 0.18 }}
            />
          ))}
        </Flex>
      </Box>
    </M.Box>
  );
}

export default function SceneChat() {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const idRef = useRef(INITIAL_MESSAGES.length + 1);
  const replyIdx = useRef(0);
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 卸载时清理定时器，防止 setState 泄漏
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // 新消息 / 输入态变化时自动滚到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: idRef.current++, from: "me", text, time: nowTime() }]);
    setDraft("");
    const t1 = window.setTimeout(() => setIsTyping(true), 500);
    const t2 = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          from: "them",
          text: REPLIES[replyIdx.current++ % REPLIES.length],
          time: nowTime(),
        },
      ]);
    }, 2100);
    timers.current.push(t1, t2);
  };

  const canSend = draft.trim() !== "";

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={COLORS.concrete} overflow="hidden">
      {/* === 区域一：联系人头部 —— 黑色仪表条 === */}
      <Box bg={COLORS.black} flexShrink={0}>
        <Scanline />
        <Flex h="44px" px="12px" align="center" gap="10px">
          {/* 大号几何标记 */}
          <SenderMark side="them" size="28px" />
          <VStack align="flex-start" gap="1px" flex={1} minW={0}>
            <Flex align="center" gap="8px" minW={0}>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="13px"
                color={COLORS.pureWhite}
                letterSpacing="0.04em"
                isTruncated
              >
                赤色通讯员
              </Text>
              <Box w="8px" h="8px" bg={COLORS.gold} flexShrink={0} />
            </Flex>
            <Flex align="center" gap="6px">
              <M.Box
                w="6px"
                h="6px"
                bg={COLORS.signalGreen}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                color={COLORS.metalWhite}
                opacity={0.6}
                letterSpacing="0.08em"
              >
                在线 // 链路已加密
              </Text>
            </Flex>
          </VStack>
          <VStack align="flex-end" gap="1px" flexShrink={0} spacing={0}>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              fontWeight={WEIGHT.bold}
              color={COLORS.gold}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              CH-07
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              color={COLORS.electricCyan}
              letterSpacing="0.1em"
              opacity={0.8}
            >
              SECURE
            </Text>
          </VStack>
        </Flex>
        <Box h="2px" bg={COLORS.red} />
      </Box>

      {/* === 区域二：消息流 —— 可滚动 === */}
      <Box
        ref={scrollRef}
        flex={1}
        overflowY="auto"
        px="12px"
        py="10px"
        position="relative"
        sx={{
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { bg: COLORS.industrialBlack },
        }}
      >
        {/* 远景几何装饰 —— 几何金色菱形 */}
        <Box
          position="absolute"
          top="12px"
          right="8px"
          w="72px"
          h="72px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.1}
          transform="rotate(45deg)"
          pointerEvents="none"
        />
        <VStack align="stretch" gap={SPACE.sm} position="relative">
          <DayDivider label="08.17 // 今日" />
          {messages.map((msg) => (
            <MessageRow key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingBubble />}
        </VStack>
      </Box>

      {/* === 区域三：输入条 —— 重型顶边框 === */}
      <Box bg={COLORS.pureWhite} borderTop={`${BORDER.heavy} ${COLORS.black}`} flexShrink={0}>
        <Flex p="10px" gap={SPACE.sm} alignItems="stretch">
          <Box
            flex={1}
            minW={0}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.industrialBlack}`}
            px="10px"
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
                if (e.key === "Enter") send();
              }}
              placeholder="输入讯息 // 回车发送"
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
            onClick={send}
            isDisabled={!canSend}
            bg={COLORS.red}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            boxShadow={SHADOW.red}
            borderRadius={0}
            h="auto"
            px="14px"
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            _hover={
              canSend
                ? { bg: COLORS.redLight, transform: "translateY(-2px)", boxShadow: SHADOW.red }
                : undefined
            }
            _active={canSend ? { transform: "translateY(1px)", boxShadow: `2px 2px 0px ${COLORS.redDark}` } : undefined}
            transition={`all ${DURATION.fast}s ease`}
          >
            发送 →
          </Button>
        </Flex>
        <InstrumentStrip />
      </Box>
    </Box>
  );
}
