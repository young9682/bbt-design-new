import { Box, Text, Flex, VStack, HStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RefNavBar } from "./RefNavBar"
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, EASING } from "./Theme";

const M = {
  Box: motion(Box),
  Text: motion(Text),
};


function FormLabel({ children, fieldCode }: { children: React.ReactNode; fieldCode?: string }) {
  return (
    <Flex align="baseline" gap="8px" mb="8px">
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="11px"
        letterSpacing="0.04em"
        textTransform="uppercase"
        color={COLORS.black}
      >
        {children}
      </Text>
      {fieldCode && (
        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          color={COLORS.red}
          letterSpacing="0.08em"
          opacity={0.6}
        >
          [{fieldCode}]
        </Text>
      )}
    </Flex>
  );
}

function FormHelper({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily={FONT.mono}
      fontSize="11px"
      color={COLORS.industrialBlack}
      opacity={0.6}
      mt="4px"
      letterSpacing="0.03em"
      lineHeight={1.7}
    >
      {children}
    </Text>
  );
}

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily={FONT.sans}
      fontWeight={WEIGHT.bold}
      fontSize="11px"
      letterSpacing="0.04em"
      textTransform="uppercase"
      color={COLORS.red}
      mt="4px"
    >
      {children}
    </Text>
  );
}

function InputField({
  placeholder,
  value,
  hasError,
  disabled,
}: {
  placeholder?: string;
  value?: string;
  hasError?: boolean;
  disabled?: boolean;
}) {
  return (
    <Box
      bg={disabled ? COLORS.metalWhite : COLORS.pureWhite}
      border={`${BORDER.heavy} ${hasError ? COLORS.red : COLORS.black}`}
      boxShadow={hasError ? `inset 0 0 0 1px ${COLORS.red}` : "none"}
      px="14px"
      py="12px"
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? "not-allowed" : "text"}
      position="relative"
    >
      {/* Scanline texture */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.03} pointerEvents="none"
        backgroundImage="repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)"
      />
      {/* Corner brackets */}
      <Box position="absolute" top="-1px" left="-1px" w="6px" h="6px" borderTop={`2px solid ${hasError ? COLORS.red : COLORS.red}`} borderLeft={`2px solid ${hasError ? COLORS.red : COLORS.red}`} opacity={0.4} />
      <Box position="absolute" bottom="-1px" right="-1px" w="6px" h="6px" borderBottom={`2px solid ${hasError ? COLORS.red : COLORS.red}`} borderRight={`2px solid ${hasError ? COLORS.red : COLORS.red}`} opacity={0.4} />
      <Flex align="center" gap="8px">
        {/* Status indicator dot */}
        <Box
          w="4px" h="4px" flexShrink={0}
          bg={hasError ? COLORS.red : disabled ? COLORS.industrialBlack : COLORS.statusGreen}
          opacity={hasError ? 1 : 0.6}
        />
        <Text
          fontFamily={FONT.mono}
          fontSize="14px"
          color={value ? COLORS.black : COLORS.industrialBlack}
          opacity={value ? 1 : 0.4}
          letterSpacing="0.03em"
        >
          {value || placeholder}
        </Text>
        {/* Blinking cursor simulation */}
        {!disabled && (
          <M.Box
            w="2px" h="16px" bg={COLORS.black} opacity={0.5} flexShrink={0}
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
          />
        )}
      </Flex>
    </Box>
  );
}

function SelectField({ value }: { value: string }) {
  return (
    <Flex
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      px="14px"
      py="12px"
      cursor="pointer"
      align="center"
      justify="space-between"
      position="relative"
    >
      {/* Bottom gauge marks */}
      <Box position="absolute" bottom="3px" left="14px" right="14px" display="flex" justifyContent="space-between" opacity={0.15}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <Box key={i} w="1px" h={i % 3 === 0 ? "4px" : "2px"} bg={COLORS.black} />
        ))}
      </Box>
      <Flex align="center" gap="8px">
        <Box w="4px" h="4px" bg={COLORS.electricCyan} opacity={0.5} flexShrink={0} />
        <Text
          fontFamily={FONT.mono}
          fontSize="14px"
          color={COLORS.black}
          letterSpacing="0.03em"
        >
          {value}
        </Text>
      </Flex>
      <Flex align="center" gap="4px">
        <Text fontFamily={FONT.mono} fontSize="8px" color={COLORS.industrialBlack} opacity={0.4} letterSpacing="0.08em">
          SEL
        </Text>
        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.red}>
          &#9660;
        </Text>
      </Flex>
    </Flex>
  );
}

function CheckboxField({ label, checked }: { label: string; checked: boolean }) {
  return (
    <Flex align="center" gap="12px" cursor="pointer">
      <Box
        w="20px"
        h="20px"
        border={`${BORDER.heavy} ${COLORS.black}`}
        bg={checked ? COLORS.red : COLORS.pureWhite}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        position="relative"
      >
        {checked && (
          <>
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="14px" color={COLORS.pureWhite}>
              &#10003;
            </Text>
            {/* Active signal ring */}
            <Box position="absolute" top="-3px" right="-3px" w="5px" h="5px" bg={COLORS.gold} />
          </>
        )}
        {/* Corner tick marks */}
        <Box position="absolute" top="-2px" left="-2px" w="3px" h="1px" bg={COLORS.black} opacity={0.3} />
        <Box position="absolute" bottom="-2px" right="-2px" w="3px" h="1px" bg={COLORS.black} opacity={0.3} />
      </Box>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="13px"
        letterSpacing="0.04em"
        color={COLORS.black}
      >
        {label}
      </Text>
    </Flex>
  );
}

function ToggleField({ label, active }: { label: string; active: boolean }) {
  return (
    <Flex align="center" justify="space-between" cursor="pointer">
      <Flex align="center" gap="8px">
        {/* Channel indicator */}
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          color={COLORS.red}
          letterSpacing="0.1em"
          opacity={0.5}
        >
          {active ? "ON" : "OFF"}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="13px"
          letterSpacing="0.04em"
          color={COLORS.black}
        >
          {label}
        </Text>
      </Flex>
      <Box
        w="48px"
        h="24px"
        bg={active ? COLORS.red : COLORS.metalWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        position="relative"
        transition="background 0.15s ease"
      >
        <Box
          position="absolute"
          top="2px"
          left={active ? "24px" : "2px"}
          w="16px"
          h="16px"
          bg={COLORS.pureWhite}
          border={`${BORDER.standard} ${COLORS.black}`}
          transition="left 0.15s ease"
        />
        {/* Rail marks */}
        <Box position="absolute" top="50%" left="8px" w="4px" h="1px" bg={COLORS.black} opacity={0.15} transform="translateY(-50%)" />
        <Box position="absolute" top="50%" right="8px" w="4px" h="1px" bg={COLORS.black} opacity={0.15} transform="translateY(-50%)" />
      </Box>
    </Flex>
  );
}

function TextareaField({ value, rows }: { value: string; rows?: number }) {
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      p="14px"
      minH={rows ? `${rows * 24}px` : "120px"}
      position="relative"
    >
      {/* Terminal scanline overlay */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.04} pointerEvents="none"
        backgroundImage="repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)"
      />
      {/* Line numbers gutter */}
      <Flex>
        <Box w="24px" flexShrink={0} borderRight={`1px solid ${COLORS.black}`} opacity={0.15} mr="12px" pr="6px">
          {Array.from({ length: Math.min(rows || 10, 12) }).map((_, i) => (
            <Text key={i} fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} lineHeight="1.6" textAlign="right">
              {i + 1}
            </Text>
          ))}
        </Box>
        <Box flex={1}>
          <Text
            fontFamily={FONT.mono}
            fontSize="13px"
            color={COLORS.black}
            letterSpacing="0.03em"
            whiteSpace="pre-wrap"
            lineHeight={1.6}
          >
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default function InputsRef() {
  return (
    <Box minH="100vh" bg={COLORS.concrete} position="relative">
      <RefNavBar title="输入控件" pageIndex="05" />

      {/* HERO */}
      <Box bg={COLORS.red} px="80px" py="48px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top={0}
          right="0"
          w="40%"
          h="100%"
          bg={COLORS.gold}
          opacity={0.08}
          transform="skewX(-12deg)"
          transformOrigin="bottom right"
        />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.pureWhite}
          letterSpacing="-0.02em"
        >
          数据接收
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="48px"
          lineHeight={0.9}
          color={COLORS.gold}
          letterSpacing="-0.02em"
        >
          协议
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.light}
          fontSize="14px"
          color={COLORS.pureWhite}
          opacity={0.7}
          mt="16px"
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          每个字段都是进步表格中的一个单元格。
        </Text>
      </Box>

      {/* ── Geometric composition: hero-to-form transition ── */}
      <Box position="relative" h="80px" overflow="hidden">
        {/* Overlapping circle + rotated square */}
        <Box
          position="absolute" top="12px" left={{ base: "40px", md: "100px" }}
          w="48px" h="48px" borderRadius="50%"
          border={`2px solid ${COLORS.electricCyan}`}
          opacity={0.12}
        />
        <Box
          position="absolute" top="20px" left={{ base: "56px", md: "116px" }}
          w="32px" h="32px"
          border={`2px solid ${COLORS.red}`}
          transform="rotate(45deg)"
          opacity={0.1}
        />
        {/* Diagonal slash line */}
        <Box
          position="absolute" top="0" left="50%" w="2px" h="80px"
          bg={COLORS.black} opacity={0.06}
          transform="rotate(-25deg)" transformOrigin="top center"
        />
        {/* Plus/cross shape */}
        <Box position="absolute" top="30px" right={{ base: "60px", md: "160px" }}>
          <Box w="12px" h="2px" bg={COLORS.gold} opacity={0.15} />
          <Box w="2px" h="12px" bg={COLORS.gold} opacity={0.15} position="absolute" top="-5px" left="5px" />
        </Box>
      </Box>

      {/* FORM DEMO */}
      <Box px={{ base: "32px", md: "80px" }} py="48px">
        <Flex align="baseline" gap="16px" mb="32px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            01
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            工作区创建表单——任务简报
          </Text>
        </Flex>

        <Box
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow="8px 8px 0px rgba(0,0,0,0.25)"
          maxW="720px"
          position="relative"
          zIndex={3}
          transform="translateY(-12px)"
          overflow="hidden"
        >
          {/* ── Background geometric plane: large triangle at 5% ── */}
          <Box
            position="absolute" top="0" right="0" w="100%" h="100%"
            pointerEvents="none" zIndex={0}
            opacity={0.05}
          >
            <Box
              position="absolute" top="0" right="0"
              w="0" h="0"
              borderStyle="solid"
              borderWidth="0 280px 400px 0"
              borderColor={`transparent ${COLORS.red} transparent transparent`}
            />
          </Box>

          {/* ── L-shaped corner brackets framing the card ── */}
          {/* Top-left bracket */}
          <Box position="absolute" top="-4px" left="-4px" w="24px" h="24px" borderTop={`3px solid ${COLORS.electricCyan}`} borderLeft={`3px solid ${COLORS.electricCyan}`} opacity={0.15} zIndex={4} pointerEvents="none" />
          {/* Top-right bracket */}
          <Box position="absolute" top="-4px" right="-4px" w="24px" h="24px" borderTop={`3px solid ${COLORS.electricCyan}`} borderRight={`3px solid ${COLORS.electricCyan}`} opacity={0.15} zIndex={4} pointerEvents="none" />
          {/* Bottom-left bracket */}
          <Box position="absolute" bottom="-4px" left="-4px" w="24px" h="24px" borderBottom={`3px solid ${COLORS.electricCyan}`} borderLeft={`3px solid ${COLORS.electricCyan}`} opacity={0.15} zIndex={4} pointerEvents="none" />
          {/* Bottom-right bracket */}
          <Box position="absolute" bottom="-4px" right="-4px" w="24px" h="24px" borderBottom={`3px solid ${COLORS.electricCyan}`} borderRight={`3px solid ${COLORS.electricCyan}`} opacity={0.15} zIndex={4} pointerEvents="none" />

          {/* Form header */}
          <Box bg={COLORS.black} px="24px" py="16px" position="relative">
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="12px">
                <Box w="8px" h="8px" bg={COLORS.red} />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="16px"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  color={COLORS.pureWhite}
                >
                  新建工作区
                </Text>
              </Flex>
              <Flex align="center" gap="12px">
                <Box w="6px" h="6px" bg={COLORS.statusGreen} opacity={0.6} />
                <Text
                  fontFamily={FONT.mono}
                  fontSize="11px"
                  color={COLORS.gold}
                  letterSpacing="0.1em"
                >
                  FORM-WS-001
                </Text>
              </Flex>
            </Flex>
            {/* Header bottom scanline */}
            <Box position="absolute" bottom="0" left="0" right="0" h="2px"
              backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.gold} 0px, ${COLORS.gold} 4px, transparent 4px, transparent 8px)`}
              opacity={0.3}
            />
          </Box>

          <Box p="24px">
            <VStack align="stretch" gap="20px">
              {/* Workspace ID */}
              <Box>
                <FormLabel fieldCode="IN-01">工作区标识符</FormLabel>
                <InputField placeholder="e.g. frontend-dev" value="my-workspace" />
                <FormHelper>小写字母数字，连字符，3-32 字符</FormHelper>
              </Box>

              {/* Provider */}
              <Box>
                <FormLabel fieldCode="SEL-01">供应方</FormLabel>
                <SelectField value="docker" />
              </Box>

              {/* Source */}
              <Box>
                <FormLabel fieldCode="IN-02">源仓库</FormLabel>
                <InputField placeholder="https://github.com/..." />
                <FormHelper>包含 devcontainer.json 的 Git 仓库 URL 或本地路径</FormHelper>
              </Box>

              {/* Error state */}
              <Box>
                <FormLabel fieldCode="IN-03">配置 URL</FormLabel>
                <InputField placeholder="https://..." hasError />
                <FormError>无效 URL 格式——需要协议（HTTP/HTTPS）</FormError>
              </Box>

              {/* IDE */}
              <Box>
                <FormLabel fieldCode="SEL-02">默认 IDE</FormLabel>
                <SelectField value="vscode" />
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* ── Section divider: form(01) → checkboxes(02) — diagonal line + small cross ── */}
      <Box position="relative" h="48px" px={{ base: "32px", md: "80px" }}>
        <Box position="absolute" top="24px" left={{ base: "60px", md: "120px" }} right={{ base: "60px", md: "300px" }} h="2px" bg={COLORS.black} opacity={0.06} transform="rotate(-8deg)" />
        <Box position="absolute" top="16px" right={{ base: "40px", md: "120px" }}>
          <Box w="8px" h="2px" bg={COLORS.velocityOrange} opacity={0.2} />
          <Box w="2px" h="8px" bg={COLORS.velocityOrange} opacity={0.2} position="absolute" top="-3px" left="3px" />
        </Box>
      </Box>

      {/* CHECKBOXES + TOGGLES */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative" zIndex={1}>
        {/* Geometric accent — rotated square */}
        <Box
          position="absolute"
          top="0"
          left={{ base: "12px", md: "48px" }}
          w="36px"
          h="36px"
          border={`${BORDER.standard} ${COLORS.black}`}
          transform="rotate(45deg)"
          opacity={0.12}
          zIndex={0}
        />
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            02
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            布尔控件——是或否，没有也许
          </Text>
        </Flex>

        <Box
          bg={COLORS.pureWhite}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          maxW="520px"
          p="24px"
          opacity={0.85}
          ml={{ base: "0px", md: "40px" }}
          mt="-16px"
          position="relative"
          zIndex={1}
        >
          <VStack align="stretch" gap="20px">
            <CheckboxField label="登录时自动启动" checked={true} />
            <CheckboxField label="同步工作区状态" checked={true} />
            <CheckboxField label="启用遥测" checked={false} />
            <CheckboxField label="配置变更时强制重建" checked={false} />

            <Box h="1px" bg={COLORS.black} opacity={0.15} my="8px" />

            <ToggleField label="自动更新供应方" active={true} />
            <ToggleField label="SSH 代理转发" active={true} />
            <ToggleField label="详细日志" active={false} />
            <ToggleField label="守护进程模式" active={false} />
          </VStack>
        </Box>
      </Box>

      {/* ── Section divider: checkboxes(02) → textarea(03) — concentric circles ── */}
      <Box position="relative" h="64px" overflow="hidden">
        <Box position="absolute" top="8px" left={{ base: "20px", md: "80px" }} w="56px" h="56px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.08} />
        <Box position="absolute" top="18px" left={{ base: "30px", md: "90px" }} w="36px" h="36px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.08} />
        <Box position="absolute" top="26px" left={{ base: "38px", md: "98px" }} w="20px" h="20px" borderRadius="50%" border={`1px solid ${COLORS.red}`} opacity={0.08} />
        <Box position="absolute" top="32px" left={{ base: "44px", md: "104px" }} w="8px" h="8px" borderRadius="50%" bg={COLORS.red} opacity={0.06} />
      </Box>

      {/* TEXTAREA / CODE */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative" zIndex={5}>
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            03
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            扩展输入——清单
          </Text>
        </Flex>

        <Box
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          maxW="780px"
          boxShadow="10px 10px 0px rgba(180,40,40,0.3)"
          position="relative"
          transform="translateX(12px)"
        >
          <Flex
            bg={COLORS.industrialBlack}
            px="16px"
            py="10px"
            justify="space-between"
            align="center"
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="11px"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color={COLORS.metalWhite}
            >
              DEVCONTAINER.JSON
            </Text>
            <HStack gap="12px">
              <Text
                fontFamily={FONT.mono}
                fontSize="10px"
                color={COLORS.metalWhite}
                opacity={0.5}
                letterSpacing="0.05em"
              >
                YAML
              </Text>
              <Box w="12px" h="12px" bg={COLORS.red} />
            </HStack>
          </Flex>
          <Box p="16px">
            {/* ── Scan line decorations inside textarea card ── */}
            <Box position="absolute" top="0" left="0" right="0" h="1px"
              backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.electricCyan} 0px, ${COLORS.electricCyan} 8px, transparent 8px, transparent 16px)`}
              opacity={0.12}
            />
            {/* Dashed vertical accent on left */}
            <Box position="absolute" top="40px" left="6px" bottom="16px" w="1px"
              backgroundImage={`repeating-linear-gradient(180deg, ${COLORS.gold} 0px, ${COLORS.gold} 4px, transparent 4px, transparent 8px)`}
              opacity={0.1}
            />
            <TextareaField
              value={`{
  "name": "my-workspace",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {}
  },
  "forwardPorts": [3000, 8080],
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint"]
    }
  }
}`}
              rows={12}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Section divider: textarea(03) → search(04) — chevron + dotted line ── */}
      <Box position="relative" h="56px" px={{ base: "32px", md: "80px" }}>
        {/* Chevron arrow pointing right */}
        <Box position="absolute" top="16px" left={{ base: "50px", md: "100px" }}>
          <Box w="16px" h="2px" bg={COLORS.electricCyan} opacity={0.15} transform="rotate(-30deg)" transformOrigin="right center" />
          <Box w="16px" h="2px" bg={COLORS.electricCyan} opacity={0.15} transform="rotate(30deg)" transformOrigin="right center" position="absolute" top="8px" />
        </Box>
        {/* Dotted horizontal line */}
        <Box position="absolute" top="26px" left={{ base: "90px", md: "140px" }} right={{ base: "40px", md: "200px" }} h="1px"
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.gold} 0px, ${COLORS.gold} 3px, transparent 3px, transparent 7px)`}
          opacity={0.12}
        />
      </Box>

      {/* SEARCH FIELD */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" position="relative">
        {/* ── Background rotated square inside search section ── */}
        <Box
          position="absolute" bottom="10px" left={{ base: "60px", md: "180px" }}
          w="64px" h="64px"
          border={`2px solid ${COLORS.velocityOrange}`}
          transform="rotate(45deg)"
          opacity={0.06}
          pointerEvents="none"
        />
        {/* Geometric accent — circle */}
        <Box
          position="absolute"
          top="16px"
          right={{ base: "24px", md: "100px" }}
          w="28px"
          h="28px"
          borderRadius="50%"
          border={`${BORDER.standard} ${COLORS.red}`}
          opacity={0.15}
        />
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            04
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            搜索——瞄准系统
          </Text>
        </Flex>

        <Box maxW="560px" ml={{ base: "0px", md: "-20px" }} transform="translateY(-8px)" position="relative" zIndex={2}>
          <Flex
            border={`${BORDER.heavy} ${COLORS.black}`}
            bg={COLORS.pureWhite}
            boxShadow="5px 5px 0px rgba(0,0,0,0.15)"
            position="relative"
          >
            {/* Radar sweep indicator */}
            <Box
              bg={COLORS.black}
              w="48px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              position="relative"
            >
              <Text fontFamily={FONT.mono} fontSize="16px" color={COLORS.red}>
                &#8981;
              </Text>
              <M.Box
                position="absolute" bottom="2px" left="50%" transform="translateX(-50%)"
                w="16px" h="1px" bg={COLORS.red}
                animate={{ opacity: [0.6, 0.1, 0.6], width: ["16px", "8px", "16px"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </Box>
            <Box flex={1} px="14px" py="12px" position="relative">
              <Flex align="center" gap="6px">
                <Text
                  fontFamily={FONT.mono}
                  fontSize="14px"
                  color={COLORS.industrialBlack}
                  opacity={0.4}
                  letterSpacing="0.03em"
                >
                  搜索工作区、供应方、操作...
                </Text>
              </Flex>
              {/* Horizontal scan line inside search */}
              <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.03} pointerEvents="none"
                backgroundImage="repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 5px)"
              />
            </Box>
            <Box
              bg={COLORS.red}
              px="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              position="relative"
            >
              {/* Corner notch */}
              <Box position="absolute" top="-1px" left="-1px" w="0" h="0"
                borderStyle="solid" borderWidth="6px 6px 0 0"
                borderColor={`${COLORS.concrete} transparent transparent transparent`}
              />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="11px"
                letterSpacing="0.12em"
                color={COLORS.pureWhite}
              >
                搜索
              </Text>
            </Box>
          </Flex>
          {/* Bottom calibration ticks */}
          <Flex justify="space-between" px="48px" mt="2px" opacity={0.15}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Box key={i} w="1px" h={i % 5 === 0 ? "4px" : "2px"} bg={COLORS.black} />
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ── Section divider: search(04) → disabled(05) — series of small triangles ── */}
      <Box position="relative" h="48px" px={{ base: "32px", md: "80px" }} overflow="hidden">
        <Flex position="absolute" top="14px" left={{ base: "40px", md: "100px" }} gap="12px" opacity={0.1}>
          {[0,1,2,3,4,5,6].map(i => (
            <Box key={i} w="0" h="0" borderStyle="solid" borderWidth="0 6px 10px 6px" borderColor={`transparent transparent ${i % 2 === 0 ? COLORS.red : COLORS.gold} transparent`} />
          ))}
        </Flex>
      </Box>

      {/* DISABLED STATE */}
      <Box px={{ base: "32px", md: "80px" }} py="32px" opacity={0.7} position="relative" zIndex={0}>
        <Flex align="baseline" gap="16px" mb="24px">
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color={COLORS.red}
          >
            05
          </Text>
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="18px"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            禁用——锁定的仪表
          </Text>
        </Flex>

        <Box maxW="480px" ml={{ base: "0px", md: "60px" }}>
          <FormLabel fieldCode="RO-01">供应方端点（只读）</FormLabel>
          <InputField value="unix:///var/run/docker.sock" disabled />
          <FormHelper>端点已被管理员策略锁定</FormHelper>
        </Box>
      </Box>

      {/* BACK */}
      <Box px="80px" py="32px">
        {/* ── Repeating calibration tick border before back link ── */}
        <Box mb="24px" position="relative">
          <Flex justify="space-between" opacity={0.08}>
            {Array.from({ length: 40 }).map((_, i) => (
              <Box key={i} w="1px" h={i % 8 === 0 ? "8px" : i % 4 === 0 ? "5px" : "2px"} bg={COLORS.black} />
            ))}
          </Flex>
        </Box>
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex
            align="center"
            gap="8px"
            cursor="pointer"
            _hover={{ gap: "16px" }}
            transition="gap 0.15s ease"
          >
            <Text fontFamily={FONT.mono} fontSize="18px" color={COLORS.red}>
              &#8592;
            </Text>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.bold}
              fontSize="13px"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={COLORS.black}
            >
              返回索引
            </Text>
          </Flex>
        </Link>
      </Box>
    </Box>
  );
}
