import { Box, Flex, Grid, Text, Input, Textarea, Button, HStack, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Flex align="baseline" gap="6px" mb="6px">
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="11px"
        letterSpacing="0.1em"
        textTransform="uppercase"
        color={COLORS.gold}
      >
        {children}
      </Text>
      {required && (
        <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.red}>
          *
        </Text>
      )}
    </Flex>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily={FONT.mono}
      fontSize="10px"
      color={COLORS.industrialBlack}
      opacity={0.6}
      mt="4px"
      letterSpacing="0.03em"
      lineHeight={1.5}
    >
      {children}
    </Text>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily={FONT.sans}
      fontWeight={WEIGHT.bold}
      fontSize="10px"
      letterSpacing="0.06em"
      textTransform="uppercase"
      color={COLORS.red}
      mt="4px"
    >
      {children}
    </Text>
  );
}

function FieldInput({
  placeholder,
  value,
  error,
  type = "text",
}: {
  placeholder?: string;
  value?: string;
  error?: boolean;
  type?: string;
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      borderRadius={0}
      border={`${BORDER.heavy} ${error ? COLORS.red : COLORS.black}`}
      bg={COLORS.pureWhite}
      color={COLORS.black}
      fontFamily={FONT.mono}
      fontSize="13px"
      letterSpacing="0.03em"
      px="12px"
      py="10px"
      h="auto"
      _focus={{
        borderColor: error ? COLORS.red : COLORS.gold,
        boxShadow: SHADOW.none,
      }}
      _placeholder={{ color: COLORS.industrialBlack, opacity: 0.4 }}
    />
  );
}

function FieldSelect({ value }: { value: string }) {
  return (
    <Flex
      border={`${BORDER.heavy} ${COLORS.black}`}
      bg={COLORS.pureWhite}
      px="12px"
      py="10px"
      justify="space-between"
      align="center"
    >
      <Text fontFamily={FONT.mono} fontSize="13px" color={COLORS.black} letterSpacing="0.03em">
        {value}
      </Text>
      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.red}>
        &#9660;
      </Text>
    </Flex>
  );
}

function FieldTextarea({ rows = 3, value }: { rows?: number; value?: string }) {
  return (
    <Textarea
      defaultValue={value}
      rows={rows}
      borderRadius={0}
      border={`${BORDER.heavy} ${COLORS.black}`}
      bg={COLORS.pureWhite}
      color={COLORS.black}
      fontFamily={FONT.mono}
      fontSize="13px"
      letterSpacing="0.03em"
      p="12px"
      resize="none"
      lineHeight={1.5}
      _focus={{ borderColor: COLORS.gold, boxShadow: SHADOW.none }}
    />
  );
}

function Fieldset({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      position="relative"
      border={`${BORDER.standard} ${COLORS.industrialBlack}`}
      p="16px"
      pt="22px"
      boxShadow={SHADOW.small}
    >
      <Flex
        position="absolute"
        top="-10px"
        left="12px"
        bg={COLORS.pureWhite}
        px="8px"
        align="center"
        gap="8px"
      >
        <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.red} letterSpacing="0.1em">
          {number}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="11px"
          color={COLORS.black}
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          {title}
        </Text>
      </Flex>
      {children}
    </Box>
  );
}

export default function SceneComplexForm() {
  return (
    <Box h="100%" overflowY="auto" bg={COLORS.concrete} p={{ base: "12px", md: "16px" }}>
      <Box
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative geometric accent */}
        <Box
          position="absolute"
          top="-24px"
          right="-24px"
          w="80px"
          h="80px"
          border={`${BORDER.heavy} ${COLORS.gold}`}
          opacity={0.1}
          transform="rotate(45deg)"
          pointerEvents="none"
        />

        {/* Header */}
        <Box bg={COLORS.black} px="16px" py="12px" borderBottom={`${BORDER.standard} ${COLORS.red}`}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="12px">
              <Box w="8px" h="8px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="14px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                资源申请单
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              color={COLORS.gold}
              letterSpacing="0.1em"
            >
              REQ-2026-0817
            </Text>
          </Flex>
        </Box>

        <Box p={{ base: "16px", md: "20px" }}>
          <VStack align="stretch" gap="24px">
            {/* Basic parameters */}
            <Fieldset title="基础参数" number="01">
              <Grid templateColumns={{ base: "1fr", md: "1.3fr 0.7fr" }} gap="16px">
                <Box>
                  <FieldLabel required>项目名称</FieldLabel>
                  <FieldInput placeholder="输入项目全称" />
                  <FieldHint>2-32 个字符，支持中英文与数字</FieldHint>
                </Box>

                <Box>
                  <FieldLabel required>项目编码</FieldLabel>
                  <FieldInput placeholder="PROJ-001" error />
                  <FieldError>编码不能为空</FieldError>
                </Box>

                <Box gridColumn={{ base: "auto", md: "1 / -1" }}>
                  <FieldLabel>所属团队</FieldLabel>
                  <FieldSelect value="基础架构组" />
                  <FieldHint>选择将承担资源配额的团队</FieldHint>
                </Box>
              </Grid>
            </Fieldset>

            {/* Resource quota */}
            <Fieldset title="资源配额" number="02">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px">
                <Box>
                  <FieldLabel required>CPU</FieldLabel>
                  <FieldSelect value="8 核" />
                </Box>

                <Box>
                  <FieldLabel required>内存</FieldLabel>
                  <FieldInput value="3" type="number" error />
                  <FieldError>内存必须为 2 的幂（GB）</FieldError>
                </Box>

                <Box>
                  <FieldLabel>GPU</FieldLabel>
                  <FieldSelect value="1 × A100 40GB" />
                </Box>

                <Box>
                  <FieldLabel>存储</FieldLabel>
                  <FieldSelect value="500 GB SSD" />
                </Box>
              </Grid>
            </Fieldset>

            {/* Scheduling & notifications */}
            <Fieldset title="调度与通知" number="03">
              <Grid templateColumns={{ base: "1fr", md: "1.2fr 0.8fr" }} gap="16px">
                <Box>
                  <FieldLabel required>负责人</FieldLabel>
                  <FieldInput placeholder="姓名或工号" />
                </Box>

                <Box>
                  <FieldLabel required>通知邮箱</FieldLabel>
                  <FieldInput placeholder="name@example.com" value="invalid-email" error />
                  <FieldError>邮箱格式不正确</FieldError>
                </Box>

                <Box gridColumn={{ base: "auto", md: "1 / -1" }}>
                  <FieldLabel>备注说明</FieldLabel>
                  <FieldTextarea
                    rows={3}
                    value="用于分布式训练实验，需保持节点间 RDMA 网络互通。"
                  />
                </Box>
              </Grid>
            </Fieldset>

            {/* Validation summary */}
            <Box
              bg={COLORS.red}
              border={`${BORDER.heavy} ${COLORS.redDark}`}
              boxShadow={SHADOW.red}
              p="12px"
            >
              <Flex align="flex-start" gap="12px">
                <Box w="6px" h="6px" bg={COLORS.pureWhite} mt="6px" flexShrink={0} />
                <Box>
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="12px"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={COLORS.pureWhite}
                  >
                    表单包含 3 处错误
                  </Text>
                  <Text
                    fontFamily={FONT.mono}
                    fontSize="11px"
                    color={COLORS.pureWhite}
                    opacity={0.8}
                    mt="2px"
                  >
                    请修正标红字段后重新提交
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Actions */}
            <HStack justify="flex-end" gap="12px">
              <Button
                borderRadius={0}
                bg={COLORS.pureWhite}
                color={COLORS.black}
                border={`${BORDER.heavy} ${COLORS.black}`}
                boxShadow={SHADOW.medium}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="12px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                px="20px"
                py="10px"
                h="auto"
                _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
                transition={`all ${DURATION.fast}s ease`}
              >
                重置
              </Button>
              <Button
                borderRadius={0}
                bg={COLORS.red}
                color={COLORS.pureWhite}
                border={`${BORDER.heavy} ${COLORS.redDark}`}
                boxShadow={SHADOW.red}
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                px="24px"
                py="10px"
                h="auto"
                _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.red }}
                transition={`all ${DURATION.fast}s ease`}
              >
                提交申请
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
