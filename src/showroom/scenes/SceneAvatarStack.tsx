import { Box, Flex, Text, Button, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = {
  Box: motion(Box),
};

type Role = "admin" | "member" | "guest";
type Status = "online" | "busy" | "offline" | "pending";

interface Accent {
  bg: string;
  ink: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: Role;
  status: Status;
  accent: Accent;
}

/** 头像叠层最多直显数量，超出折叠为 +N */
const MAX_VISIBLE = 5;

const ACCENTS: Accent[] = [
  { bg: COLORS.red, ink: COLORS.pureWhite },
  { bg: COLORS.gold, ink: COLORS.black },
  { bg: COLORS.electricCyan, ink: COLORS.pureWhite },
  { bg: COLORS.black, ink: COLORS.metalWhite },
];

const ROLE_CYCLE: Role[] = ["admin", "member", "guest"];

const ROLE_META: Record<
  Role,
  { label: string; code: string; bg: string; ink: string; border: string }
> = {
  admin: {
    label: "管理员",
    code: "ADMIN",
    bg: COLORS.red,
    ink: COLORS.pureWhite,
    border: COLORS.redDark,
  },
  member: {
    label: "成员",
    code: "MEMBER",
    bg: COLORS.black,
    ink: COLORS.pureWhite,
    border: COLORS.black,
  },
  guest: {
    label: "访客",
    code: "GUEST",
    bg: COLORS.pureWhite,
    ink: COLORS.black,
    border: COLORS.gold,
  },
};

const STATUS_META: Record<Status, { label: string; code: string; color: string }> = {
  online: { label: "在线", code: "ONLINE", color: COLORS.statusGreen },
  busy: { label: "忙碌", code: "BUSY", color: COLORS.velocityOrange },
  offline: { label: "离线", code: "OFFLINE", color: COLORS.industrialBlack },
  pending: { label: "待接受", code: "PENDING", color: COLORS.statusAmber },
};

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "李维东", email: "wei-dong.li@bbt.sspu.edu.cn", initials: "维东", role: "admin", status: "online", accent: ACCENTS[0] },
  { id: 2, name: "周安", email: "an.zhou@bbt.sspu.edu.cn", initials: "ZA", role: "member", status: "busy", accent: ACCENTS[1] },
  { id: 3, name: "孙晓雯", email: "xiaowen.sun@bbt.sspu.edu.cn", initials: "晓雯", role: "member", status: "online", accent: ACCENTS[2] },
  { id: 4, name: "毛凯", email: "kai.mao@bbt.sspu.edu.cn", initials: "MK", role: "guest", status: "offline", accent: ACCENTS[3] },
  { id: 5, name: "赵铁牛", email: "tie-niu.zhao@bbt.sspu.edu.cn", initials: "铁牛", role: "member", status: "online", accent: ACCENTS[0] },
  { id: 6, name: "唐棠", email: "tang.tang@bbt.sspu.edu.cn", initials: "TT", role: "guest", status: "offline", accent: ACCENTS[1] },
  { id: 7, name: "林一舟", email: "yi-zhou.lin@bbt.sspu.edu.cn", initials: "一舟", role: "member", status: "online", accent: ACCENTS[2] },
  { id: 8, name: "李思思", email: "si-si.li@bbt.sspu.edu.cn", initials: "LS", role: "guest", status: "pending", accent: ACCENTS[3] },
];

/** 从邀请输入推导显示名：中文原样，拉丁按分隔词首字母大写 */
const deriveDisplayName = (raw: string): string => {
  const local = (raw.includes("@") ? raw.split("@")[0] : raw).trim();
  if (!local) return "新成员";
  if (/^[一-龥]+$/.test(local)) return local;
  const parts = local
    .split(/[._\-\s+]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  return parts.join(" ");
};

/** 头像字号标：拉丁取前两字母，中文取末两字 */
const deriveInitials = (name: string): string => {
  const latin = name.replace(/[^A-Za-z]/g, "");
  if (latin.length >= 2) return latin.slice(0, 2).toUpperCase();
  const han = name.replace(/[^一-龥]/g, "");
  if (han.length >= 2) return han.slice(-2);
  return (latin || han || "??").slice(0, 2).toUpperCase();
};

/** 方形头像标 — 直角方块 + 重边框，绝不使用圆形 */
function AvatarMark({
  member,
  size,
  fontSize,
}: {
  member: Member;
  size: string;
  fontSize: string;
}) {
  return (
    <Flex
      w={size}
      h={size}
      bg={member.accent.bg}
      border={`${BORDER.standard} ${COLORS.black}`}
      align="center"
      justify="center"
      flexShrink={0}
    >
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize={fontSize}
        color={member.accent.ink}
        letterSpacing="0.02em"
        lineHeight={1}
        whiteSpace="nowrap"
      >
        {member.initials}
      </Text>
    </Flex>
  );
}

/** 状态方点 — 待接受状态琥珀色闪烁 */
function StatusDot({ status }: { status: Status }) {
  const color = STATUS_META[status].color;
  if (status === "pending") {
    return (
      <M.Box
        w="7px"
        h="7px"
        bg={color}
        flexShrink={0}
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
    );
  }
  return (
    <Box
      w="7px"
      h="7px"
      bg={color}
      opacity={status === "offline" ? 0.4 : 1}
      flexShrink={0}
    />
  );
}

/** 角色徽章 — 点击循环切换 管理员→成员→访客 */
function RoleBadge({ role, onCycle }: { role: Role; onCycle: () => void }) {
  const meta = ROLE_META[role];
  return (
    <Button
      aria-label={`切换角色（当前 ${meta.label}）`}
      title="点击切换角色"
      onClick={onCycle}
      h="20px"
      minW="56px"
      px="6px"
      borderRadius={0}
      bg={meta.bg}
      color={meta.ink}
      border={`${BORDER.standard} ${meta.border}`}
      fontFamily={FONT.sans}
      fontWeight={WEIGHT.bold}
      fontSize="10px"
      letterSpacing="0.08em"
      lineHeight={1}
      cursor="pointer"
      transition={`all ${DURATION.instant}s ease`}
      _hover={{ boxShadow: SHADOW.small }}
      _active={{ transform: "none", bg: meta.bg }}
      _focusVisible={{ boxShadow: `0 0 0 2px ${COLORS.gold}` }}
    >
      {meta.label}
    </Button>
  );
}

/** 单行成员 — 常规视图 / 红色移除确认条 双态切换 */
function MemberRow({
  member,
  confirming,
  onToggleConfirm,
  onCancelConfirm,
  onConfirmRemove,
  onCycleRole,
}: {
  member: Member;
  confirming: boolean;
  onToggleConfirm: () => void;
  onCancelConfirm: () => void;
  onConfirmRemove: () => void;
  onCycleRole: () => void;
}) {
  const status = STATUS_META[member.status];

  return (
    <M.Box
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 36 }}
      transition={{ duration: DURATION.fast, ease: EASING.launch }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {confirming ? (
          <M.Box
            key="confirm"
            display="flex"
            alignItems="center"
            gap="8px"
            px="12px"
            py="8px"
            bg={COLORS.red}
            borderBottom={`${BORDER.standard} ${COLORS.redDark}`}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: DURATION.instant, ease: EASING.launch }}
          >
            <Box
              w="10px"
              h="9px"
              bg={COLORS.pureWhite}
              clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
              flexShrink={0}
            />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.04em"
              color={COLORS.pureWhite}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              minWidth={0}
            >
              确认移除「{member.name}」？
            </Text>
            <Flex ml="auto" gap="6px" flexShrink={0}>
              <Button
                borderRadius={0}
                h="22px"
                px="10px"
                bg="transparent"
                border={`${BORDER.standard} ${COLORS.pureWhite}`}
                color={COLORS.pureWhite}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                lineHeight={1}
                cursor="pointer"
                _hover={{ bg: `${COLORS.pureWhite}33` }}
                _active={{ transform: "none", bg: "transparent" }}
                _focusVisible={{ boxShadow: `0 0 0 2px ${COLORS.pureWhite}` }}
                onClick={onCancelConfirm}
              >
                取消
              </Button>
              <Button
                borderRadius={0}
                h="22px"
                px="10px"
                bg={COLORS.pureWhite}
                border={`${BORDER.standard} ${COLORS.pureWhite}`}
                color={COLORS.red}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="9px"
                letterSpacing="0.08em"
                lineHeight={1}
                cursor="pointer"
                transition={`all ${DURATION.instant}s ease`}
                _hover={{ bg: COLORS.black, color: COLORS.pureWhite }}
                _active={{ transform: "none", bg: COLORS.pureWhite }}
                _focusVisible={{ boxShadow: `0 0 0 2px ${COLORS.gold}` }}
                onClick={onConfirmRemove}
              >
                确认移除
              </Button>
            </Flex>
          </M.Box>
        ) : (
          <M.Box
            key="view"
            role="group"
            display="flex"
            alignItems="center"
            gap="10px"
            pl={member.status === "pending" ? "9px" : "12px"}
            pr="12px"
            py="7px"
            bg={COLORS.pureWhite}
            borderLeft={`3px solid ${
              member.status === "pending" ? COLORS.statusAmber : "transparent"
            }`}
            borderBottom={`${BORDER.hairline} ${COLORS.black}24`}
            cursor="default"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: DURATION.instant, ease: EASING.launch }}
            sx={{ transition: `background ${DURATION.instant}s ease` }}
            _hover={{ bg: COLORS.metalWhite }}
          >
            <AvatarMark member={member} size="30px" fontSize="11px" />

            <Text
              flex={1}
              minWidth={0}
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="12px"
              letterSpacing="0.02em"
              color={COLORS.black}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {member.name}
            </Text>

            {/* 邮箱列 — 窄帧隐藏 */}
            <Box
              display={{ base: "none", md: "block" }}
              w="30%"
              minWidth={0}
              flexShrink={0}
            >
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                letterSpacing="0.02em"
                color={COLORS.industrialBlack}
                opacity={0.65}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {member.email}
              </Text>
            </Box>

            <Flex w="64px" justify="center" flexShrink={0}>
              <RoleBadge role={member.role} onCycle={onCycleRole} />
            </Flex>

            <Flex w="76px" align="center" gap="6px" flexShrink={0}>
              <StatusDot status={member.status} />
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.04em"
                color={status.color}
                opacity={member.status === "offline" ? 0.75 : 1}
                whiteSpace="nowrap"
              >
                {status.label}
              </Text>
            </Flex>

            <Flex w="22px" justify="center" flexShrink={0}>
              <Box
                as="button"
                aria-label={`移除 ${member.name}`}
                w="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="transparent"
                border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
                color={COLORS.industrialBlack}
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="11px"
                lineHeight={1}
                cursor="pointer"
                opacity={0}
                transition={`all ${DURATION.instant}s ease`}
                _groupHover={{ opacity: 1 }}
                _hover={{
                  bg: COLORS.red,
                  borderColor: COLORS.red,
                  color: COLORS.pureWhite,
                }}
                _focusVisible={{
                  opacity: 1,
                  boxShadow: `0 0 0 2px ${COLORS.gold}`,
                }}
                onClick={onToggleConfirm}
              >
                ×
              </Box>
            </Flex>
          </M.Box>
        )}
      </AnimatePresence>
    </M.Box>
  );
}

export default function SceneAvatarStack() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [expanded, setExpanded] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const inviteInputRef = useRef<HTMLInputElement>(null);
  const seqRef = useRef(101);

  const visibleMembers = expanded ? members : members.slice(0, MAX_VISIBLE);
  const overflowCount = Math.max(0, members.length - MAX_VISIBLE);

  const counts = useMemo(
    () => ({
      online: members.filter((m) => m.status === "online").length,
      busy: members.filter((m) => m.status === "busy").length,
      offline: members.filter((m) => m.status === "offline").length,
      pending: members.filter((m) => m.status === "pending").length,
    }),
    [members]
  );

  /* 弹层开启时聚焦邮箱输入 */
  useEffect(() => {
    if (inviteOpen) inviteInputRef.current?.focus();
  }, [inviteOpen]);

  /* ESC 关闭邀请弹层 / 取消移除确认 */
  useEffect(() => {
    if (!inviteOpen && confirmId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setInviteOpen(false);
        setConfirmId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inviteOpen, confirmId]);

  const cycleRole = (id: number) =>
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              role: ROLE_CYCLE[(ROLE_CYCLE.indexOf(m.role) + 1) % ROLE_CYCLE.length],
            }
          : m
      )
    );

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setConfirmId(null);
  };

  const submitInvite = () => {
    const raw = inviteEmail.trim();
    if (!raw) {
      setInviteError("请输入成员邮箱或姓名");
      inviteInputRef.current?.focus();
      return;
    }
    const name = deriveDisplayName(raw);
    const email = raw.includes("@") ? raw : `invite-${seqRef.current}@bbt.sspu.edu.cn`;
    const id = seqRef.current;
    seqRef.current += 1;
    setMembers((prev) => [
      {
        id,
        name,
        email,
        initials: deriveInitials(name),
        role: inviteRole,
        status: "pending",
        accent: ACCENTS[id % ACCENTS.length],
      },
      ...prev,
    ]);
    setInviteEmail("");
    setInviteError(null);
    setInviteRole("member");
    setInviteOpen(false);
  };

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg={COLORS.concrete}
      overflow="hidden"
      position="relative"
    >
      {/* === 顶部项目条 — 黑色构造带 + 头像堆叠 === */}
      <Flex
        position="relative"
        zIndex={Z_INDEX.navigation}
        bg={COLORS.black}
        minH="48px"
        py="8px"
        px="12px"
        align="center"
        justify="space-between"
        gap="12px"
        flexWrap="wrap"
        flexShrink={0}
      >
        {/* 底缘红色虚线扫描 */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="2px"
          bg={COLORS.red}
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 6px, transparent 6px, transparent 10px)`}
        />

        <Flex align="center" gap="10px" minWidth={0}>
          <Flex
            w="22px"
            h="22px"
            bg={COLORS.red}
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Box
              w="12px"
              h="9px"
              bg={COLORS.pureWhite}
              clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
            />
          </Flex>
          <Box minWidth={0}>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="12px"
              letterSpacing="0.14em"
              color={COLORS.pureWhite}
              whiteSpace="nowrap"
              lineHeight={1.3}
            >
              第七设计局
            </Text>
            <Text
              display={{ base: "none", md: "block" }}
              fontFamily={FONT.mono}
              fontSize="7px"
              letterSpacing="0.16em"
              color={COLORS.metalWhite}
              opacity={0.45}
              whiteSpace="nowrap"
              lineHeight={1.4}
            >
              PROJECT-07 // 成员编制
            </Text>
          </Box>
        </Flex>

        {/* 头像堆叠 — 负边距重叠方形标 + +N 折叠 + 邀请 */}
        <Flex align="center" wrap="wrap" rowGap="8px">
          {visibleMembers.map((m, i) => (
            <Box
              key={m.id}
              role="group"
              position="relative"
              marginLeft={i === 0 ? "0" : "-10px"}
              zIndex={visibleMembers.length - i}
              _hover={{ zIndex: Z_INDEX.content }}
            >
              <Flex
                w="32px"
                h="32px"
                bg={m.accent.bg}
                border={`${BORDER.standard} ${COLORS.black}`}
                align="center"
                justify="center"
                transition={`all ${DURATION.instant}s ease`}
                _groupHover={{
                  transform: "translateY(-3px)",
                  boxShadow: `3px 3px 0 ${COLORS.metalWhite}`,
                }}
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="12px"
                  color={m.accent.ink}
                  letterSpacing="0.02em"
                  lineHeight={1}
                  whiteSpace="nowrap"
                >
                  {m.initials}
                </Text>
              </Flex>

              {/* 等宽字体姓名浮签 — 下展避开裁切 */}
              <Flex
                position="absolute"
                top="calc(100% + 6px)"
                right={0}
                bg={COLORS.pureWhite}
                border={`${BORDER.standard} ${COLORS.black}`}
                boxShadow={SHADOW.small}
                px="8px"
                py="4px"
                gap="6px"
                align="baseline"
                opacity={0}
                transform="translateY(-4px)"
                pointerEvents="none"
                whiteSpace="nowrap"
                zIndex={Z_INDEX.overlay}
                transition={`all ${DURATION.instant}s ease`}
                _groupHover={{ opacity: 1, transform: "translateY(0)" }}
              >
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.bold}
                  fontSize="10px"
                  color={COLORS.black}
                  letterSpacing="0.02em"
                >
                  {m.name}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="8px"
                  letterSpacing="0.08em"
                  color={STATUS_META[m.status].color}
                >
                  {STATUS_META[m.status].code}
                </Text>
              </Flex>
            </Box>
          ))}

          {/* +N 折叠瓦片 — 点击展开/收起堆叠 */}
          {overflowCount > 0 && (
            <Flex
              as="button"
              aria-label={expanded ? "收起头像堆叠" : `展开其余 ${overflowCount} 名成员`}
              marginLeft="-10px"
              w="32px"
              h="32px"
              align="center"
              justify="center"
              bg={COLORS.black}
              border={`${BORDER.standard} ${COLORS.metalWhite}80`}
              cursor="pointer"
              flexShrink={0}
              transition={`all ${DURATION.instant}s ease`}
              color={COLORS.metalWhite}
              _hover={{ borderColor: COLORS.gold, color: COLORS.gold }}
              onClick={() => setExpanded((e) => !e)}
            >
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize="10px"
                color="inherit"
                lineHeight={1}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {expanded ? "−" : `+${overflowCount}`}
              </Text>
            </Flex>
          )}

          {/* + 邀请 — 虚线边框动作瓦 + 内联邀请弹层 */}
          <Box position="relative" marginLeft="8px">
            <Flex
              as="button"
              aria-label="邀请成员"
              alignItems="center"
              gap="4px"
              h="32px"
              px="10px"
              bg={inviteOpen ? COLORS.red : "transparent"}
              border={`2px dashed ${
                inviteOpen ? COLORS.redLight : "${COLORS.metalWhite}8c"
              }`}
              color={COLORS.pureWhite}
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="10px"
              letterSpacing="0.12em"
              lineHeight={1}
              cursor="pointer"
              flexShrink={0}
              transition={`all ${DURATION.instant}s ease`}
              _hover={{ borderColor: COLORS.pureWhite, bg: COLORS.red }}
              onClick={() => {
                setInviteOpen((o) => !o);
                setInviteError(null);
              }}
            >
              <Text as="span" fontWeight={WEIGHT.black} fontSize="12px" lineHeight={1}>
                +
              </Text>
              邀请
            </Flex>

            <AnimatePresence>
              {inviteOpen && (
                <M.Box
                  position="absolute"
                  top="calc(100% + 8px)"
                  right={0}
                  w={{ base: "216px", md: "272px" }}
                  bg={COLORS.pureWhite}
                  border={`${BORDER.heavy} ${COLORS.black}`}
                  boxShadow={SHADOW.large}
                  zIndex={Z_INDEX.overlay}
                  transformOrigin="top right"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: DURATION.fast, ease: EASING.launch }}
                >
                  {/* 弹层头 */}
                  <Flex
                    bg={COLORS.black}
                    px="10px"
                    py="7px"
                    align="center"
                    gap="6px"
                  >
                    <Box w="6px" h="6px" bg={COLORS.red} flexShrink={0} />
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.1em"
                      color={COLORS.pureWhite}
                    >
                      邀请成员
                    </Text>
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="7px"
                      letterSpacing="0.14em"
                      color={COLORS.gold}
                    >
                      // INVITE
                    </Text>
                    <Box
                      as="button"
                      ml="auto"
                      aria-label="关闭邀请弹层"
                      bg="transparent"
                      border="none"
                      color={COLORS.metalWhite}
                      fontFamily={FONT.mono}
                      fontWeight={WEIGHT.bold}
                      fontSize="12px"
                      lineHeight={1}
                      cursor="pointer"
                      px="2px"
                      transition={`all ${DURATION.instant}s ease`}
                      _hover={{ color: COLORS.pureWhite, bg: COLORS.red }}
                      onClick={() => setInviteOpen(false)}
                    >
                      ×
                    </Box>
                  </Flex>

                  {/* 弹层体 */}
                  <Flex direction="column" gap="10px" px="12px" py="12px">
                    <Box>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        fontWeight={WEIGHT.bold}
                        letterSpacing="0.14em"
                        color={COLORS.industrialBlack}
                        opacity={0.6}
                        mb="4px"
                      >
                        邮箱 / EMAIL
                      </Text>
                      <Input
                        ref={inviteInputRef}
                        value={inviteEmail}
                        onChange={(e) => {
                          setInviteEmail(e.target.value);
                          setInviteError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitInvite();
                          }
                        }}
                        placeholder="name@bbt.sspu.edu.cn"
                        h="30px"
                        px="8px"
                        borderRadius={0}
                        bg={COLORS.pureWhite}
                        border={`${BORDER.standard} ${
                          inviteError ? COLORS.red : COLORS.industrialBlack
                        }`}
                        fontFamily={FONT.mono}
                        fontSize="11px"
                        letterSpacing="0.02em"
                        color={COLORS.black}
                        transition={`border-color ${DURATION.instant}s ease`}
                        _focus={{
                          borderColor: COLORS.red,
                          boxShadow: SHADOW.none,
                        }}
                        _placeholder={{ color: COLORS.industrialBlack, opacity: 0.4 }}
                      />
                    </Box>

                    <Box>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        fontWeight={WEIGHT.bold}
                        letterSpacing="0.14em"
                        color={COLORS.industrialBlack}
                        opacity={0.6}
                        mb="4px"
                      >
                        角色 / ROLE
                      </Text>
                      <Flex border={`${BORDER.standard} ${COLORS.black}`}>
                        {ROLE_CYCLE.map((r, i) => {
                          const meta = ROLE_META[r];
                          const selected = inviteRole === r;
                          const selBg = r === "guest" ? COLORS.gold : meta.bg;
                          const selInk = r === "guest" ? COLORS.black : meta.ink;
                          return (
                            <Box
                              key={r}
                              as="button"
                              flex={1}
                              py="6px"
                              bg={selected ? selBg : COLORS.pureWhite}
                              color={selected ? selInk : COLORS.industrialBlack}
                              borderLeft={
                                i > 0 ? `${BORDER.hairline} ${COLORS.black}` : undefined
                              }
                              fontFamily={FONT.sans}
                              fontWeight={selected ? WEIGHT.black : WEIGHT.bold}
                              fontSize="10px"
                              letterSpacing="0.06em"
                              lineHeight={1}
                              cursor="pointer"
                              opacity={selected ? 1 : 0.65}
                              transition={`all ${DURATION.instant}s ease`}
                              _hover={{ opacity: 1, bg: selected ? selBg : COLORS.metalWhite }}
                              onClick={() => setInviteRole(r)}
                            >
                              {meta.label}
                            </Box>
                          );
                        })}
                      </Flex>
                    </Box>

                    <AnimatePresence>
                      {inviteError && (
                        <M.Box
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: DURATION.instant, ease: EASING.launch }}
                        >
                          <Text
                            fontFamily={FONT.mono}
                            fontWeight={WEIGHT.bold}
                            fontSize="9px"
                            letterSpacing="0.06em"
                            color={COLORS.red}
                          >
                            ! {inviteError}
                          </Text>
                        </M.Box>
                      )}
                    </AnimatePresence>

                    <Button
                      w="100%"
                      h="32px"
                      borderRadius={0}
                      bg={COLORS.red}
                      border={`${BORDER.standard} ${COLORS.redDark}`}
                      boxShadow={SHADOW.small}
                      color={COLORS.pureWhite}
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.black}
                      fontSize="11px"
                      letterSpacing="0.18em"
                      lineHeight={1}
                      cursor="pointer"
                      transition={`all ${DURATION.instant}s ease`}
                      _hover={{ bg: COLORS.redLight, transform: "translateY(-1px)", boxShadow: SHADOW.medium }}
                      _active={{ transform: "none", bg: COLORS.redDark }}
                      _focusVisible={{ boxShadow: `0 0 0 2px ${COLORS.black}` }}
                      onClick={submitInvite}
                    >
                      发送邀请 →
                    </Button>
                  </Flex>
                </M.Box>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
      </Flex>

      {/* === 成员管理面板 === */}
      <Box flex={1} minHeight={0} px="8px" py="8px">
        <Flex
          direction="column"
          h="100%"
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.small}
        >
          {/* 列头 — 黑色微缩仪表带 */}
          <Flex
            align="center"
            gap="10px"
            px="12px"
            h="24px"
            bg={COLORS.black}
            flexShrink={0}
          >
            <Box w="30px" flexShrink={0} />
            <Text
              flex={1}
              minWidth={0}
              fontFamily={FONT.mono}
              fontSize="8px"
              fontWeight={WEIGHT.black}
              letterSpacing="0.14em"
              color={COLORS.gold}
              whiteSpace="nowrap"
            >
              成员 / MEMBER
            </Text>
            <Box display={{ base: "none", md: "block" }} w="30%" flexShrink={0}>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                fontWeight={WEIGHT.bold}
                letterSpacing="0.14em"
                color={COLORS.metalWhite}
                opacity={0.6}
                whiteSpace="nowrap"
              >
                邮箱 / EMAIL
              </Text>
            </Box>
            <Flex w="64px" justify="center" flexShrink={0}>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                fontWeight={WEIGHT.bold}
                letterSpacing="0.14em"
                color={COLORS.metalWhite}
                opacity={0.6}
                whiteSpace="nowrap"
              >
                角色
              </Text>
            </Flex>
            <Flex w="76px" flexShrink={0}>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                fontWeight={WEIGHT.bold}
                letterSpacing="0.14em"
                color={COLORS.metalWhite}
                opacity={0.6}
                whiteSpace="nowrap"
              >
                状态
              </Text>
            </Flex>
            <Box w="22px" flexShrink={0} />
          </Flex>

          {/* 行列表 */}
          <Box flex={1} minHeight={0} overflowY="auto" sx={{ scrollbarWidth: "thin" }}>
            <AnimatePresence initial={false}>
              {members.map((m) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  confirming={confirmId === m.id}
                  onToggleConfirm={() =>
                    setConfirmId((prev) => (prev === m.id ? null : m.id))
                  }
                  onCancelConfirm={() => setConfirmId(null)}
                  onConfirmRemove={() => removeMember(m.id)}
                  onCycleRole={() => cycleRole(m.id)}
                />
              ))}
            </AnimatePresence>

            {members.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="12px"
                py="28px"
                px="16px"
              >
                <Flex
                  w="44px"
                  h="44px"
                  align="center"
                  justify="center"
                  border={`2px dashed ${COLORS.industrialBlack}`}
                  opacity={0.45}
                >
                  <Box
                    w="14px"
                    h="12px"
                    bg={COLORS.industrialBlack}
                    clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
                  />
                </Flex>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="9px"
                  letterSpacing="0.1em"
                  color={COLORS.industrialBlack}
                  opacity={0.6}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  00 成员 // 编制空缺
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  letterSpacing="0.08em"
                  color={COLORS.industrialBlack}
                  opacity={0.45}
                  textAlign="center"
                >
                  点击顶部「+ 邀请」补充编制
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>

      {/* === 编制读数条 === */}
      <Flex
        bg={COLORS.black}
        px="12px"
        py="5px"
        minH="24px"
        align="center"
        gap={{ base: "8px", md: "12px" }}
        flexWrap="wrap"
        flexShrink={0}
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="8px"
          letterSpacing="0.14em"
          color={COLORS.gold}
          flexShrink={0}
        >
          编制 // CREW
        </Text>
        <Flex align="center" gap="5px">
          <Box w="5px" h="5px" bg={COLORS.metalWhite} />
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            letterSpacing="0.04em"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            成员 {String(members.length).padStart(2, "0")}
          </Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Box w="5px" h="5px" bg={COLORS.statusGreen} />
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            letterSpacing="0.04em"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            在线 {String(counts.online).padStart(2, "0")}
          </Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Box w="5px" h="5px" bg={COLORS.velocityOrange} />
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            letterSpacing="0.04em"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            忙碌 {String(counts.busy).padStart(2, "0")}
          </Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Box w="5px" h="5px" bg={COLORS.metalWhite} opacity={0.4} />
          <Text
            fontFamily={FONT.mono}
            fontSize="9px"
            color={COLORS.metalWhite}
            letterSpacing="0.04em"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            离线 {String(counts.offline).padStart(2, "0")}
          </Text>
        </Flex>
        {counts.pending > 0 && (
          <Flex align="center" gap="5px">
            <M.Box
              w="5px"
              h="5px"
              bg={COLORS.statusAmber}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.statusAmber}
              letterSpacing="0.04em"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              待接受 {String(counts.pending).padStart(2, "0")}
            </Text>
          </Flex>
        )}
        <Text
          ml="auto"
          display={{ base: "none", md: "block" }}
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.06em"
          color={COLORS.metalWhite}
          opacity={0.4}
          whiteSpace="nowrap"
        >
          徽章点击切换角色 · × 二次确认移除
        </Text>
      </Flex>

      {/* 底部速度色条 — 锚定构图 */}
      <Flex h="3px" flexShrink={0} opacity={0.9}>
        <Box flex={3} bg={COLORS.red} />
        <Box flex={1} bg={COLORS.velocityOrange} />
        <Box flex={2} bg={COLORS.gold} />
        <Box flex={1} bg={COLORS.electricCyan} />
        <Box flex={1} bg={COLORS.signalGreen} />
        <Box flex={2} bg={COLORS.black} />
      </Flex>
    </Box>
  );
}
