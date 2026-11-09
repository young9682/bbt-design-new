import { Box, Flex, Text, Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "../../Theme";

const MBox = motion(Box);

type Mode = "login" | "register";

/** 仪表色带 — 几何构成仪器条 */
function InstrumentStrip() {
  return (
    <Box position="absolute" bottom={0} left={0} right={0} h="6px" display="flex">
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
    </Box>
  );
}

/** 登录/注册切换标签 — 黑色激活态 + 红色下划线 */
function AuthTab({
  code,
  label,
  active,
  onClick,
}: {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      gap="6px"
      py="7px"
      cursor="pointer"
      userSelect="none"
      bg={active ? COLORS.black : COLORS.pureWhite}
      borderBottom={`${BORDER.heavy} ${active ? COLORS.red : "transparent"}`}
      borderRight={`${BORDER.standard} ${active ? COLORS.black : COLORS.metalWhite}`}
      _hover={{ bg: active ? COLORS.black : COLORS.metalWhite }}
      transition={`background ${DURATION.fast}s ease`}
      onClick={onClick}
    >
      <Text
        fontFamily={FONT.mono}
        fontWeight={WEIGHT.black}
        fontSize="9px"
        letterSpacing="0.1em"
        color={active ? COLORS.gold : COLORS.industrialBlack}
        opacity={active ? 1 : 0.5}
      >
        {code}
      </Text>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="12px"
        letterSpacing="0.14em"
        color={active ? COLORS.pureWhite : COLORS.black}
      >
        {label}
      </Text>
    </Flex>
  );
}

/** 认证输入域 — 重边框 + 等宽占位符 + 红色聚焦/错误态 */
function AuthField({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorHint = "必填 // REQUIRED",
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error: boolean;
  errorHint?: string;
  type?: string;
}) {
  return (
    <Box>
      <Flex justify="space-between" align="baseline" gap="8px" mb="5px">
        <Text {...TOKENS.label} color={COLORS.black}>
          {label}
        </Text>
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          letterSpacing="0.08em"
          flexShrink={0}
          color={error ? COLORS.red : COLORS.industrialBlack}
          opacity={error ? 1 : 0.45}
        >
          {error ? `▲ ${errorHint}` : "[REQ]"}
        </Text>
      </Flex>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        h="34px"
        px="10px"
        borderRadius={0}
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${error ? COLORS.red : COLORS.industrialBlack}`}
        fontFamily={FONT.mono}
        fontSize="12px"
        color={COLORS.black}
        letterSpacing="0.02em"
        _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
        _focus={{ border: `${BORDER.heavy} ${COLORS.red}`, boxShadow: SHADOW.none }}
        transition={`border ${DURATION.fast}s ease`}
      />
    </Box>
  );
}

export default function SceneAuthSplit() {
  const [mode, setMode] = useState<Mode>("login");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [authOk, setAuthOk] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isLogin = mode === "login";

  const accErr = attempted && account.trim() === "";
  const pwdErr = attempted && password.trim() === "";
  const confirmEmpty = confirm.trim() === "";
  const confirmMismatch = !confirmEmpty && confirm !== password;
  const confirmErr = !isLogin && attempted && (confirmEmpty || confirmMismatch);

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setAttempted(false);
    setAuthOk(false);
  };

  const flashNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const submit = () => {
    setAttempted(true);
    const valid =
      account.trim() !== "" &&
      password.trim() !== "" &&
      (isLogin || (!confirmEmpty && !confirmMismatch));
    if (!valid) return;
    setAuthOk(true);
    window.setTimeout(() => setAuthOk(false), 2400);
  };

  return (
    <Flex
      h="100%"
      direction={{ base: "column", md: "row" }}
      bg={COLORS.concrete}
      overflow="hidden"
    >
      {/* === 左侧黑色几何构成面板（窄屏折叠为顶部横幅） === */}
      <Box
        position="relative"
        overflow="hidden"
        flexShrink={0}
        w={{ base: "100%", md: "40%" }}
        h={{ base: "76px", md: "100%" }}
        bg={COLORS.black}
        p={{ base: "10px 14px 16px", md: "16px 16px 18px" }}
        borderRight={{ md: `${BORDER.heavy} ${COLORS.black}` }}
        borderBottom={{ base: `${BORDER.heavy} ${COLORS.black}` }}
        display="flex"
        flexDirection={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "stretch" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        {/* 红色楔形 — 自右下刺入 */}
        <Box
          display={{ base: "none", md: "block" }}
          position="absolute"
          bottom="10px"
          right="-2px"
          w="130px"
          h="86px"
          bg={COLORS.red}
          opacity={0.92}
          clipPath="polygon(100% 0, 100% 100%, 0 100%)"
        />
        {/* 金色旋转方块 */}
        <Box
          position="absolute"
          top={{ base: "50%", md: "46px" }}
          right={{ base: "16px", md: "22px" }}
          w={{ base: "16px", md: "26px" }}
          h={{ base: "16px", md: "26px" }}
          bg={COLORS.gold}
          border={`${BORDER.standard} ${COLORS.goldDark}`}
          boxShadow={SHADOW.gold}
          transform={{
            base: "translateY(-50%) rotate(45deg)",
            md: "rotate(45deg)",
          }}
        />
        {/* 右缘仪器刻度 */}
        <Flex
          display={{ base: "none", md: "flex" }}
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          direction="column"
          gap="6px"
        >
          {[6, 12, 6, 16, 6, 12, 6].map((w, i) => (
            <Box key={i} w={`${w}px`} h="2px" bg={COLORS.metalWhite} opacity={0.25} />
          ))}
        </Flex>

        {/* 顶部编码（仅宽屏） */}
        <Text
          display={{ base: "none", md: "block" }}
          fontFamily={FONT.mono}
          fontSize="9px"
          letterSpacing="0.18em"
          color={COLORS.gold}
          opacity={0.7}
        >
          SECURE GATE // 001
        </Text>

        {/* 字标 + 口号 */}
        <Flex
          direction={{ base: "row", md: "column" }}
          align={{ base: "center", md: "flex-start" }}
          gap={{ base: "12px", md: "8px" }}
          mt={{ md: "auto" }}
        >
          <Flex align="center" gap={{ base: "6px", md: "10px" }}>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "24px", md: "46px" }}
              letterSpacing="-0.02em"
              lineHeight={0.9}
              color={COLORS.pureWhite}
            >
              DS
            </Text>
            <Box
              w={{ base: "8px", md: "12px" }}
              h={{ base: "8px", md: "12px" }}
              bg={COLORS.red}
              flexShrink={0}
            />
            <Box
              display={{ base: "none", md: "block" }}
              w="26px"
              h="4px"
              bg={COLORS.gold}
            />
          </Flex>
          {/* 分隔线：窄屏竖线 / 宽屏横线 */}
          <Box
            w={{ base: "1px", md: "56px" }}
            h={{ base: "28px", md: "1px" }}
            bg={`${COLORS.pureWhite}33`}
            flexShrink={0}
          />
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "13px", md: "18px" }}
              letterSpacing="0.1em"
              color={COLORS.pureWhite}
            >
              进入控制台
            </Text>
            <Text
              display={{ base: "none", md: "block" }}
              fontFamily={FONT.mono}
              fontSize="9px"
              letterSpacing="0.16em"
              color={COLORS.metalWhite}
              opacity={0.45}
              mt="4px"
            >
              CONTROL CONSOLE // SECURE ACCESS
            </Text>
          </Box>
        </Flex>

        {/* 底部通道状态（仅宽屏） */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          gap="6px"
          mt="auto"
        >
          <Box w="5px" h="5px" bg={COLORS.signalGreen} flexShrink={0} />
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.12em"
            color={COLORS.metalWhite}
            opacity={0.45}
          >
            GATE-07 · TLS 1.3 · ONLINE
          </Text>
        </Flex>

        <InstrumentStrip />
      </Box>

      {/* === 右侧登录/注册表单 === */}
      <Flex
        flex={1}
        minW={0}
        direction="column"
        position="relative"
        overflow="hidden"
        bg={COLORS.concrete}
      >
        {/* 混凝土斜纹肌理 */}
        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          opacity={0.025}
          backgroundImage={`repeating-linear-gradient(45deg, transparent 0px, transparent 6px, ${COLORS.black}33 6px, ${COLORS.black}33 7px)`}
        />

        <Flex
          direction="column"
          h="100%"
          position="relative"
          p={{ base: "10px 12px", md: "14px 16px" }}
          gap={{ base: "8px", md: "10px" }}
        >
          {/* 标签切换 */}
          <Flex
            border={`${BORDER.heavy} ${COLORS.black}`}
            bg={COLORS.pureWhite}
            boxShadow={SHADOW.small}
            flexShrink={0}
          >
            <AuthTab
              code="01"
              label="登录"
              active={isLogin}
              onClick={() => switchMode("login")}
            />
            <AuthTab
              code="02"
              label="注册"
              active={!isLogin}
              onClick={() => switchMode("register")}
            />
          </Flex>

          {/* 认证通过状态条 */}
          <AnimatePresence>
            {authOk && (
              <MBox
                key="auth-ok"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
                overflow="hidden"
                flexShrink={0}
              >
                <Flex align="center" gap="8px" px="10px" py="7px" bg={COLORS.black}>
                  <MBox
                    w="7px"
                    h="7px"
                    bg={COLORS.signalGreen}
                    flexShrink={0}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                  <Text
                    fontFamily={FONT.mono}
                    fontWeight={WEIGHT.bold}
                    fontSize="10px"
                    letterSpacing="0.12em"
                    color={COLORS.pureWhite}
                  >
                    认证通过 // AUTH OK
                  </Text>
                  <Text
                    ml="auto"
                    fontFamily={FONT.mono}
                    fontSize="9px"
                    letterSpacing="0.08em"
                    color={COLORS.gold}
                    opacity={0.8}
                  >
                    SID 0x3F2A
                  </Text>
                </Flex>
              </MBox>
            )}
          </AnimatePresence>

          {/* 表单滚动区 */}
          <Box flex={1} minH={0} overflowY="auto">
            <VStack align="stretch" gap={{ base: "8px", md: "10px" }}>
              <AuthField
                label={isLogin ? "操作员账号" : "创建账号"}
                placeholder="OP-0000 // OPERATOR ID"
                value={account}
                onChange={setAccount}
                error={accErr}
              />
              <AuthField
                label={isLogin ? "访问密码" : "设置密码"}
                placeholder="MIN 8 CHARS"
                type="password"
                value={password}
                onChange={setPassword}
                error={pwdErr}
              />
              {!isLogin && (
                <AuthField
                  label="确认密码"
                  placeholder="REPEAT PASSWORD"
                  type="password"
                  value={confirm}
                  onChange={setConfirm}
                  error={confirmErr}
                  errorHint={
                    confirmMismatch ? "不一致 // MISMATCH" : "必填 // REQUIRED"
                  }
                />
              )}

              {/* 通知行（忘记密码等瞬时反馈） */}
              <AnimatePresence>
                {notice && (
                  <MBox
                    key={notice}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASING.launch }}
                  >
                    <Text
                      fontFamily={FONT.mono}
                      fontSize="9px"
                      letterSpacing="0.06em"
                      color={COLORS.electricCyan}
                    >
                      » {notice}
                    </Text>
                  </MBox>
                )}
              </AnimatePresence>

              {isLogin && (
                <Flex justify="space-between" align="center" pt="2px">
                  {/* 记住此设备 — 方形复选框 + 红色对勾 */}
                  <Flex
                    align="center"
                    gap="8px"
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => setRemember(!remember)}
                  >
                    <Box
                      w="16px"
                      h="16px"
                      border={`${BORDER.heavy} ${COLORS.black}`}
                      bg={remember ? COLORS.red : COLORS.pureWhite}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      transition={`background ${DURATION.fast}s ease`}
                    >
                      {remember && (
                        <Text
                          fontFamily={FONT.sans}
                          fontWeight={WEIGHT.black}
                          fontSize="11px"
                          color={COLORS.pureWhite}
                          lineHeight={1}
                        >
                          &#10003;
                        </Text>
                      )}
                    </Box>
                    <Text
                      fontFamily={FONT.sans}
                      fontWeight={WEIGHT.bold}
                      fontSize="11px"
                      letterSpacing="0.04em"
                      color={COLORS.black}
                    >
                      记住此设备
                    </Text>
                  </Flex>

                  <Text
                    as="span"
                    cursor="pointer"
                    fontFamily={FONT.mono}
                    fontSize="10px"
                    letterSpacing="0.06em"
                    color={COLORS.red}
                    textDecoration="underline"
                    textDecorationColor={COLORS.redDark}
                    textUnderlineOffset="3px"
                    _hover={{ color: COLORS.redLight }}
                    onClick={() => flashNotice("重置令牌已下发 // RESET TOKEN ISSUED")}
                  >
                    忘记密码
                  </Text>
                </Flex>
              )}
            </VStack>
          </Box>

          {/* 提交按钮 — 红色主按钮 + 硬阴影 + 悬停抬升 */}
          <Button
            w="100%"
            h="38px"
            flexShrink={0}
            borderRadius={0}
            bg={COLORS.red}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            boxShadow={SHADOW.red}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="12px"
            letterSpacing="0.14em"
            textTransform="uppercase"
            _hover={{
              bg: COLORS.redLight,
              transform: "translateY(-2px)",
              boxShadow: SHADOW.red,
            }}
            _active={{ transform: "translateY(0)", boxShadow: SHADOW.red }}
            transition={`all ${DURATION.fast}s ease`}
            onClick={submit}
          >
            {isLogin ? "进入系统" : "创建账户"}
          </Button>

          {/* 模块版本脚注 */}
          <Flex
            display={{ base: "none", md: "flex" }}
            justify="space-between"
            flexShrink={0}
          >
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              letterSpacing="0.1em"
              color={COLORS.industrialBlack}
              opacity={0.45}
            >
              AUTH MODULE
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              letterSpacing="0.1em"
              color={COLORS.industrialBlack}
              opacity={0.45}
            >
              1.2.1
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
