import { Box, Flex, Text, Button, VStack, HStack, Grid } from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, TOKENS } from "../../Theme";

const MBox = motion(Box);

const STEPS = [
  { id: "basic", label: "基本信息", code: "01" },
  { id: "config", label: "配置参数", code: "02" },
  { id: "confirm", label: "确认提交", code: "03" },
];

interface FormData {
  name: string;
  code: string;
  description: string;
  environment: "dev" | "staging" | "prod";
  replicas: number;
  alerts: boolean;
  telemetry: boolean;
}

function StepBlock({
  label,
  code,
  status,
  onClick,
}: {
  label: string;
  code: string;
  status: "pending" | "current" | "completed";
  onClick: () => void;
}) {
  const isCurrent = status === "current";
  const isCompleted = status === "completed";

  return (
    <MBox
      flex={1}
      py="10px"
      px="8px"
      cursor={status === "completed" ? "pointer" : "default"}
      onClick={onClick}
      bg={isCurrent ? COLORS.red : isCompleted ? COLORS.redDark : COLORS.industrialBlack}
      border={`${BORDER.heavy} ${COLORS.black}`}
      borderRightWidth="0px"
      boxShadow={isCurrent ? SHADOW.red : "none"}
      position="relative"
      whileHover={status === "completed" ? { y: -2 } : undefined}
      transition={{ duration: DURATION.instant }}
    >
      {isCurrent && (
        <Box
          position="absolute"
          top="-3px"
          left="-3px"
          w="8px"
          h="8px"
          borderTop={`2px solid ${COLORS.gold}`}
          borderLeft={`2px solid ${COLORS.gold}`}
          opacity={0.6}
        />
      )}
      <HStack gap="6px" justify="center">
        <Text
          fontFamily={FONT.mono}
          fontSize="10px"
          fontWeight={WEIGHT.black}
          color={COLORS.gold}
          letterSpacing="0.08em"
        >
          {code}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="10px"
          color={isCurrent || isCompleted ? COLORS.pureWhite : COLORS.metalWhite}
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </HStack>
      {isCurrent && (
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="2px"
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.gold} 0px, ${COLORS.gold} 4px, transparent 4px, transparent 8px)`}
          opacity={0.5}
        />
      )}
    </MBox>
  );
}

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Flex align="baseline" gap="6px" mb="6px">
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="11px"
        letterSpacing="0.1em"
        textTransform="uppercase"
        color={COLORS.black}
      >
        {children}
      </Text>
      {required && (
        <Text fontFamily={FONT.mono} fontSize="9px" color={COLORS.red} letterSpacing="0.08em">
          [REQ]
        </Text>
      )}
    </Flex>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const empty = required && value.trim() === "";
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${empty ? COLORS.red : COLORS.black}`}
      px="12px"
      py="10px"
      position="relative"
      boxShadow={empty ? `inset 0 0 0 1px ${COLORS.red}` : "none"}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.03}
        pointerEvents="none"
        backgroundImage={`repeating-linear-gradient(0deg, transparent, transparent 3px, ${COLORS.black}26 3px, ${COLORS.black}26 4px)`}
      />
      <Box
        as="input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        width="100%"
        border="none"
        outline="none"
        bg="transparent"
        fontFamily={FONT.mono}
        fontSize="13px"
        color={COLORS.black}
        letterSpacing="0.02em"
        _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
      />
    </Box>
  );
}

function FormTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      px="12px"
      py="10px"
      position="relative"
      minH="72px"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.03}
        pointerEvents="none"
        backgroundImage={`repeating-linear-gradient(0deg, transparent, transparent 3px, ${COLORS.black}26 3px, ${COLORS.black}26 4px)`}
      />
      <Box
        as="textarea"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        width="100%"
        height="100%"
        minH="52px"
        border="none"
        outline="none"
        bg="transparent"
        resize="none"
        fontFamily={FONT.mono}
        fontSize="13px"
        color={COLORS.black}
        letterSpacing="0.02em"
        lineHeight={1.5}
        _placeholder={{ color: COLORS.industrialBlack, opacity: 0.5 }}
      />
    </Box>
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Box
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      px="12px"
      py="10px"
      position="relative"
      cursor="pointer"
    >
      <Box
        as="select"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        width="100%"
        border="none"
        outline="none"
        bg="transparent"
        fontFamily={FONT.mono}
        fontSize="13px"
        color={COLORS.black}
        letterSpacing="0.02em"
        cursor="pointer"
        appearance="none"
        pr="24px"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Box>
      <Text
        position="absolute"
        right="12px"
        top="50%"
        transform="translateY(-50%)"
        fontFamily={FONT.mono}
        fontSize="12px"
        color={COLORS.red}
        pointerEvents="none"
      >
        &#9660;
      </Text>
      <Box
        position="absolute"
        bottom="4px"
        left="12px"
        right="36px"
        display="flex"
        justifyContent="space-between"
        opacity={0.15}
        pointerEvents="none"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} w="1px" h={i % 3 === 0 ? "4px" : "2px"} bg={COLORS.black} />
        ))}
      </Box>
    </Box>
  );
}

function FormToggle({
  label,
  active,
  onChange,
  code,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
  code: string;
}) {
  return (
    <Flex align="center" justify="space-between" cursor="pointer" onClick={onChange}>
      <Flex align="center" gap="8px">
        <Text
          fontFamily={FONT.mono}
          fontSize="8px"
          color={active ? COLORS.signalGreen : COLORS.industrialBlack}
          letterSpacing="0.1em"
          opacity={0.7}
        >
          {code}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="12px"
          letterSpacing="0.04em"
          color={COLORS.black}
        >
          {label}
        </Text>
      </Flex>
      <Box
        w="44px"
        h="22px"
        bg={active ? COLORS.red : COLORS.metalWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        position="relative"
        transition={`background ${DURATION.fast}s ease`}
      >
        <Box
          position="absolute"
          top="2px"
          left={active ? "20px" : "2px"}
          w="14px"
          h="14px"
          bg={COLORS.pureWhite}
          border={`${BORDER.standard} ${COLORS.black}`}
          transition={`left ${DURATION.fast}s ease`}
        />
        <Box
          position="absolute"
          top="50%"
          left="6px"
          w="3px"
          h="1px"
          bg={COLORS.black}
          opacity={0.15}
          transform="translateY(-50%)"
        />
        <Box
          position="absolute"
          top="50%"
          right="6px"
          w="3px"
          h="1px"
          bg={COLORS.black}
          opacity={0.15}
          transform="translateY(-50%)"
        />
      </Box>
    </Flex>
  );
}

function FormCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Flex align="center" gap="10px" cursor="pointer" onClick={onChange}>
      <Box
        w="18px"
        h="18px"
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
            <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="12px" color={COLORS.pureWhite}>
              &#10003;
            </Text>
            <Box position="absolute" top="-3px" right="-3px" w="5px" h="5px" bg={COLORS.gold} />
          </>
        )}
      </Box>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="12px"
        letterSpacing="0.04em"
        color={COLORS.black}
      >
        {label}
      </Text>
    </Flex>
  );
}

export default function SceneStepForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<FormData>({
    name: "",
    code: "",
    description: "",
    environment: "dev",
    replicas: 1,
    alerts: true,
    telemetry: false,
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const stepValid = () => {
    if (step === 0) return data.name.trim() !== "" && data.code.trim() !== "";
    return true;
  };

  const next = () => {
    if (!stepValid()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(0);
      setData({
        name: "",
        code: "",
        description: "",
        environment: "dev",
        replicas: 1,
        alerts: true,
        telemetry: false,
      });
    }, 2000);
  };

  const stepStatus = (i: number) => {
    if (i === step) return "current";
    if (i < step) return "completed";
    return "pending";
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* Step indicator */}
      <Flex mb="12px" gap="0">
        {STEPS.map((s, i) => (
          <StepBlock
            key={s.id}
            label={s.label}
            code={s.code}
            status={stepStatus(i)}
            onClick={() => i < step && setStep(i)}
          />
        ))}
        {/* Close the right border of the last block */}
        <Box w="0" flexShrink={0} />
      </Flex>

      {/* Form body */}
      <Box
        flex={1}
        bg={COLORS.concrete}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        overflow="hidden"
        position="relative"
        display="flex"
        flexDirection="column"
      >
        {/* Instrument strip */}
        <Box h="4px" display="flex">
          <Box flex={3} bg={COLORS.red} />
          <Box flex={1} bg={COLORS.velocityOrange} />
          <Box flex={2} bg={COLORS.gold} />
          <Box flex={1} bg={COLORS.electricCyan} />
          <Box flex={1} bg={COLORS.signalGreen} />
          <Box flex={2} bg={COLORS.black} />
        </Box>

        {/* Header */}
        <Box bg={COLORS.black} px="12px" py="8px">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="8px">
              <Box w="6px" h="6px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="12px"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                {STEPS[step].label}
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.gold}
              letterSpacing="0.08em"
            >
              STEP {STEPS[step].code}/03
            </Text>
          </Flex>
        </Box>

        {/* Step content */}
        <Box flex={1} overflowY="auto" p="12px" position="relative">
          <AnimatePresence mode="wait">
            {submitted ? (
              <MBox
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
                h="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="12px"
              >
                <Box
                  w="48px"
                  h="48px"
                  bg={COLORS.signalGreen}
                  border={`${BORDER.heavy} ${COLORS.black}`}
                  boxShadow={SHADOW.medium}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily={FONT.sans} fontWeight={WEIGHT.black} fontSize="24px" color={COLORS.pureWhite}>
                    &#10003;
                  </Text>
                </Box>
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize="16px"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  color={COLORS.black}
                >
                  提交成功
                </Text>
                <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.industrialBlack} opacity={0.7}>
                  系统正在处理您的请求...
                </Text>
              </MBox>
            ) : (
              <MBox
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: DURATION.fast, ease: EASING.launch }}
              >
                {step === 0 && (
                  <VStack align="stretch" gap="12px">
                    <Box>
                      <FormLabel required>任务名称</FormLabel>
                      <FormInput
                        value={data.name}
                        onChange={(v) => update("name", v)}
                        placeholder="例如：前端构建流水线"
                        required
                      />
                    </Box>
                    <Box>
                      <FormLabel required>任务编码</FormLabel>
                      <FormInput
                        value={data.code}
                        onChange={(v) => update("code", v)}
                        placeholder="例如：FE-BUILD-001"
                        required
                      />
                    </Box>
                    <Box>
                      <FormLabel>任务描述</FormLabel>
                      <FormTextarea
                        value={data.description}
                        onChange={(v) => update("description", v)}
                        placeholder="简述任务目标与范围..."
                      />
                    </Box>
                  </VStack>
                )}

                {step === 1 && (
                  <VStack align="stretch" gap="14px">
                    <Box>
                      <FormLabel>运行环境</FormLabel>
                      <FormSelect
                        value={data.environment}
                        onChange={(v) => update("environment", v as FormData["environment"])}
                        options={[
                          { value: "dev", label: "开发环境 (DEV)" },
                          { value: "staging", label: "预发环境 (STAGING)" },
                          { value: "prod", label: "生产环境 (PROD)" },
                        ]}
                      />
                    </Box>
                    <Box>
                      <FormLabel>副本数量</FormLabel>
                      <Flex gap="8px" align="center">
                        <Button
                          size="sm"
                          borderRadius={0}
                          bg={COLORS.black}
                          color={COLORS.pureWhite}
                          fontFamily={FONT.mono}
                          fontWeight={WEIGHT.black}
                          minW="32px"
                          px="8px"
                          _hover={{ bg: COLORS.industrialBlack }}
                          onClick={() => update("replicas", Math.max(1, data.replicas - 1))}
                        >
                          -
                        </Button>
                        <Box
                          flex={1}
                          bg={COLORS.pureWhite}
                          border={`${BORDER.heavy} ${COLORS.black}`}
                          py="8px"
                          textAlign="center"
                        >
                          <Text
                            fontFamily={FONT.mono}
                            fontSize="14px"
                            fontWeight={WEIGHT.black}
                            color={COLORS.black}
                            sx={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {data.replicas}
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          borderRadius={0}
                          bg={COLORS.red}
                          color={COLORS.pureWhite}
                          fontFamily={FONT.mono}
                          fontWeight={WEIGHT.black}
                          minW="32px"
                          px="8px"
                          _hover={{ bg: COLORS.redLight }}
                          onClick={() => update("replicas", Math.min(10, data.replicas + 1))}
                        >
                          +
                        </Button>
                      </Flex>
                    </Box>
                    <Box bg={COLORS.pureWhite} border={`${BORDER.standard} ${COLORS.black}`} p="12px">
                      <VStack align="stretch" gap="10px">
                        <FormToggle
                          label="启用告警通知"
                          active={data.alerts}
                          onChange={() => update("alerts", !data.alerts)}
                          code="ALERT"
                        />
                        <FormCheckbox
                          label="开启性能遥测"
                          checked={data.telemetry}
                          onChange={() => update("telemetry", !data.telemetry)}
                        />
                      </VStack>
                    </Box>
                  </VStack>
                )}

                {step === 2 && (
                  <VStack align="stretch" gap="12px">
                    <Box bg={COLORS.pureWhite} border={`${BORDER.heavy} ${COLORS.black}`} boxShadow={SHADOW.small} p="12px">
                      <Text
                        fontFamily={FONT.sans}
                        fontWeight={WEIGHT.black}
                        fontSize="12px"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color={COLORS.black}
                        mb="8px"
                      >
                        信息核对
                      </Text>
                      <Grid templateColumns="80px 1fr" gap="6px" rowGap="6px">
                        <Text fontFamily={FONT.sans} fontSize="11px" fontWeight={WEIGHT.bold} color={COLORS.industrialBlack}>
                          名称
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.black}>
                          {data.name || "—"}
                        </Text>
                        <Text fontFamily={FONT.sans} fontSize="11px" fontWeight={WEIGHT.bold} color={COLORS.industrialBlack}>
                          编码
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.black}>
                          {data.code || "—"}
                        </Text>
                        <Text fontFamily={FONT.sans} fontSize="11px" fontWeight={WEIGHT.bold} color={COLORS.industrialBlack}>
                          环境
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.black} textTransform="uppercase">
                          {data.environment}
                        </Text>
                        <Text fontFamily={FONT.sans} fontSize="11px" fontWeight={WEIGHT.bold} color={COLORS.industrialBlack}>
                          副本
                        </Text>
                        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.black} sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {data.replicas}
                        </Text>
                      </Grid>
                    </Box>
                    <Box bg={COLORS.black} p="10px">
                      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.metalWhite} lineHeight={1.6}>
                        确认后将创建任务并下发至调度器。此操作不可撤销。
                      </Text>
                    </Box>
                  </VStack>
                )}
              </MBox>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Navigation */}
      <Flex justify="space-between" mt="12px" gap="8px">
        <Button
          borderRadius={0}
          bg={COLORS.pureWhite}
          color={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.medium}
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="11px"
          letterSpacing="0.05em"
          textTransform="uppercase"
          px="16px"
          py="10px"
          h="auto"
          _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
          _active={{ transform: "translateY(0)", boxShadow: SHADOW.small }}
          onClick={prev}
          isDisabled={step === 0 || submitted}
        >
          上一步
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            borderRadius={0}
            bg={COLORS.red}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.redDark}`}
            boxShadow={SHADOW.red}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            px="20px"
            py="10px"
            h="auto"
            _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.red }}
            _active={{ transform: "translateY(0)", boxShadow: SHADOW.small }}
            onClick={next}
            isDisabled={!stepValid()}
          >
            下一步
          </Button>
        ) : (
          <Button
            borderRadius={0}
            bg={COLORS.signalGreen}
            color={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.militaryGreen}`}
            boxShadow={SHADOW.medium}
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize="11px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            px="20px"
            py="10px"
            h="auto"
            _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
            _active={{ transform: "translateY(0)", boxShadow: SHADOW.small }}
            onClick={submit}
            isDisabled={submitted}
          >
            提交
          </Button>
        )}
      </Flex>
    </Box>
  );
}
