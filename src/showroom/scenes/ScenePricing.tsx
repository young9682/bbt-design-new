import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING } from "../../Theme";

const M = { Box: motion(Box), Text: motion(Text) };

/* =========================================
 * 数据 — 三档定价（非对称层级）
 * ========================================= */

type BillMode = "monthly" | "yearly";
type FeatureState = "core" | "plus" | "off";

interface TierFeature {
  text: string;
  state: FeatureState;
}

interface Tier {
  id: string;
  name: string;
  en: string;
  tagline: string;
  monthly: number | null; // null => 定制报价
  mark: "square" | "diamond" | "triangle";
  markColor: string;
  features: TierFeature[];
  cta: string;
  featured?: boolean;
}

const YEARLY_FACTOR = 0.8;
const annualOf = (monthly: number) => Math.round(monthly * YEARLY_FACTOR);

const TIERS: Tier[] = [
  {
    id: "basic",
    name: "基础",
    en: "BASIC",
    tagline: "个人开发者 · 起步轨道",
    monthly: 29,
    mark: "square",
    markColor: COLORS.gold,
    features: [
      { text: "5 个项目工作区", state: "core" },
      { text: "基础遥测面板", state: "core" },
      { text: "社区支持", state: "core" },
      { text: "SLA 保障", state: "off" },
    ],
    cta: "开始使用",
  },
  {
    id: "pro",
    name: "专业",
    en: "PROFESSIONAL",
    tagline: "团队协作 · 主力推进",
    monthly: 99,
    mark: "diamond",
    markColor: COLORS.red,
    features: [
      { text: "不限项目工作区", state: "plus" },
      { text: "高级遥测 + 告警", state: "plus" },
      { text: "优先技术支持", state: "core" },
      { text: "99.9% SLA 保障", state: "core" },
    ],
    cta: "立即升级",
    featured: true,
  },
  {
    id: "enterprise",
    name: "企业",
    en: "ENTERPRISE",
    tagline: "私有化部署 · 定制轨道",
    monthly: null,
    mark: "triangle",
    markColor: COLORS.electricCyan,
    features: [
      { text: "私有化部署", state: "core" },
      { text: "专属客户工程师", state: "plus" },
      { text: "定制集成与审计", state: "core" },
      { text: "7×24 全天候值守", state: "plus" },
    ],
    cta: "联系我们",
  },
];

/* =========================================
 * 几何档位标记 — 方 / 菱 / 三角
 * ========================================= */

function TierMark({ shape, color }: { shape: Tier["mark"]; color: string }) {
  return (
    <Flex w="16px" h="16px" align="center" justify="center" flexShrink={0}>
      {shape === "square" && <Box w="11px" h="11px" bg={color} />}
      {shape === "diamond" && (
        <Box w="11px" h="11px" bg={color} transform="rotate(45deg)" />
      )}
      {shape === "triangle" && (
        <Box
          w="13px"
          h="12px"
          bg={color}
          css={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        />
      )}
    </Flex>
  );
}

/* =========================================
 * 特性行 — 红/金方块 ✓，暗色 ✕
 * ========================================= */

function FeatureRow({ feature, dark }: { feature: TierFeature; dark: boolean }) {
  if (feature.state === "off") {
    return (
      <Flex align="center" gap="8px" opacity={dark ? 0.38 : 0.45}>
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.bold}
          fontSize="10px"
          w="14px"
          textAlign="center"
          flexShrink={0}
          lineHeight={1}
          color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
        >
          ✕
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.regular}
          fontSize="11px"
          lineHeight={1.2}
          color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
        >
          {feature.text}
        </Text>
      </Flex>
    );
  }

  const markBg = feature.state === "plus" ? COLORS.gold : COLORS.red;
  return (
    <Flex align="center" gap="8px">
      <Flex
        w="14px"
        h="14px"
        bg={markBg}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Text
          fontFamily={FONT.mono}
          fontWeight={WEIGHT.black}
          fontSize="9px"
          color={COLORS.pureWhite}
          lineHeight={1}
        >
          ✓
        </Text>
      </Flex>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.regular}
        fontSize="11px"
        lineHeight={1.2}
        color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
      >
        {feature.text}
      </Text>
    </Flex>
  );
}

/* =========================================
 * 档位卡片
 * ========================================= */

function TierCard({ tier, mode, index }: { tier: Tier; mode: BillMode; index: number }) {
  const dark = !!tier.featured;
  const primary = !!tier.featured;
  const yearly = mode === "yearly";
  const base = tier.monthly;
  const price = base === null ? null : yearly ? annualOf(base) : base;
  const savings = base === null ? 0 : (base - annualOf(base)) * 12;
  const priceColor = yearly
    ? dark
      ? COLORS.gold
      : COLORS.red
    : dark
      ? COLORS.pureWhite
      : COLORS.black;

  const cardBg = dark ? COLORS.black : tier.id === "enterprise" ? COLORS.concrete : COLORS.pureWhite;
  const cardShadow = dark ? `8px 8px 0px ${COLORS.red}` : tier.id === "enterprise" ? SHADOW.small : SHADOW.medium;

  return (
    <M.Box
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, delay: 0.08 + index * 0.08, ease: EASING.launch }}
      display="flex"
      flexDirection="column"
      flex={{ base: "none", md: tier.featured ? 1.3 : tier.id === "enterprise" ? 1.05 : 1 }}
      w={{ base: "100%", md: "auto" }}
      mt={{ base: "0px", md: tier.featured ? "0px" : tier.id === "basic" ? "20px" : "30px" }}
      zIndex={tier.featured ? 3 : 1}
      position="relative"
    >
      <Flex
        direction="column"
        flex="1"
        bg={cardBg}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={cardShadow}
        p={{ base: "9px", md: dark ? "14px" : "12px" }}
        position="relative"
        transition={`transform ${DURATION.fast}s ease, box-shadow ${DURATION.fast}s ease`}
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: dark ? `10px 10px 0px ${COLORS.redDark}` : SHADOW.medium,
        }}
      >
        {/* 角落缎带 — 仅限推荐档（md+ 旋转缎带，base 内联标签） */}
        {tier.featured && (
          <Box
            position="absolute"
            top="16px"
            right="-34px"
            w="112px"
            py="4px"
            bg={COLORS.red}
            borderY={`1px solid ${COLORS.redDark}`}
            transform="rotate(45deg)"
            display={{ base: "none", md: "block" }}
            zIndex={2}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="9px"
              letterSpacing="0.3em"
              color={COLORS.pureWhite}
              textAlign="center"
              lineHeight={1}
            >
              推荐
            </Text>
          </Box>
        )}

        {/* 名称行 */}
        <Flex align="center" gap="8px">
          <TierMark shape={tier.mark} color={tier.markColor} />
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.black}
            fontSize={{ base: "14px", md: dark ? "17px" : "15px" }}
            letterSpacing="0.04em"
            color={dark ? COLORS.pureWhite : COLORS.black}
            lineHeight={1}
          >
            {tier.name}
          </Text>
          {tier.featured && (
            <Flex bg={COLORS.red} px="5px" py="2px" ml="2px" display={{ base: "flex", md: "none" }}>
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="8px"
                letterSpacing="0.2em"
                color={COLORS.pureWhite}
                lineHeight={1}
              >
                推荐
              </Text>
            </Flex>
          )}
          <Text
            fontFamily={FONT.mono}
            fontWeight={WEIGHT.bold}
            fontSize="8px"
            letterSpacing="0.14em"
            color={COLORS.gold}
            opacity={dark ? 1 : 0.85}
            ml="auto"
            lineHeight={1}
            whiteSpace="nowrap"
          >
            {tier.en}
          </Text>
        </Flex>

        {/* 副题 — 仅推荐档（强化锚点层级） */}
        {tier.featured && (
          <Text
            fontFamily={FONT.sans}
            fontWeight={WEIGHT.light}
            fontSize="10px"
            color={COLORS.metalWhite}
            opacity={0.65}
            mt="6px"
            display={{ base: "none", md: "block" }}
          >
            {tier.tagline}
          </Text>
        )}

        {/* 价格块 */}
        {price === null ? (
          <Box mt={{ md: "8px" }}>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize={{ base: "18px", md: "22px" }}
              letterSpacing="0.02em"
              lineHeight={1}
              color={COLORS.black}
            >
              定制报价
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              letterSpacing="0.1em"
              color={COLORS.industrialBlack}
              opacity={0.7}
              mt="6px"
              lineHeight={1}
              display={{ base: "none", md: "block" }}
            >
              按需核算 // 私有化交付
            </Text>
          </Box>
        ) : (
          <Box mt="6px">
            <Flex align="baseline" gap="6px" flexWrap="wrap">
              {yearly && base !== null && (
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.bold}
                  fontSize="12px"
                  color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
                  opacity={0.55}
                  textDecoration="line-through"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  ¥{base}
                </Text>
              )}
              <M.Text
                key={`${tier.id}-${price}`}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: DURATION.normal, ease: EASING.launch }}
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.black}
                fontSize={{ base: "22px", md: dark ? "30px" : "25px" }}
                letterSpacing="-0.02em"
                lineHeight={1}
                color={priceColor}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                ¥{price}
              </M.Text>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                color={dark ? COLORS.metalWhite : COLORS.industrialBlack}
                opacity={0.6}
                letterSpacing="0.08em"
                lineHeight={1}
              >
                /月
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="8px"
              letterSpacing="0.08em"
              mt="5px"
              lineHeight={1}
              color={yearly ? (dark ? COLORS.gold : COLORS.red) : dark ? COLORS.metalWhite : COLORS.industrialBlack}
              opacity={yearly ? 1 : 0.55}
              display={{ base: "none", md: "block" }}
            >
              {yearly ? `年付预付 // 立省 ¥${savings}` : "按月计费 // 随时取消"}
            </Text>
          </Box>
        )}

        {/* 分隔线 */}
        <Box
          h="1px"
          bg={dark ? `${COLORS.pureWhite}24`: `${COLORS.black}1f`}
          my={{ base: "7px", md: "8px" }}
          flexShrink={0}
        />

        {/* 特性清单 */}
        <Flex
          direction="column"
          gap="5px"
          display={{ base: "none", md: "flex" }}
        >
          {tier.features.map((f) => (
            <FeatureRow key={f.text} feature={f} dark={dark} />
          ))}
        </Flex>

        {/* CTA */}
        <Box mt="auto" pt={{ base: "7px", md: "10px" }}>
          <Flex
            as="button"
            w="100%"
            justify="center"
            py={{ base: "6px", md: "7px" }}
            bg={primary ? COLORS.red : COLORS.pureWhite}
            border={`${BORDER.heavy} ${primary ? COLORS.redDark : COLORS.black}`}
            boxShadow={primary ? SHADOW.red : SHADOW.small}
            cursor="pointer"
            transition={`transform ${DURATION.instant}s ease, box-shadow ${DURATION.fast}s ease`}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: primary ? `6px 6px 0px ${COLORS.redDark}` : SHADOW.medium,
            }}
            _active={{ transform: "translate(2px, 2px)", boxShadow: SHADOW.small }}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="11px"
              letterSpacing="0.14em"
              color={primary ? COLORS.pureWhite : COLORS.black}
              textTransform="uppercase"
              lineHeight={1}
            >
              {tier.cta}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </M.Box>
  );
}

/* =========================================
 * 场景 — 几何构成定价页
 * 非对称三档：白色小卡 / 黑色主卡 / 混凝土远卡
 * ========================================= */

export default function ScenePricing() {
  const [mode, setMode] = useState<BillMode>("monthly");

  return (
    <Box
      h="100%"
      bg={COLORS.concrete}
      display="flex"
      flexDirection="column"
      overflowY="auto"
      position="relative"
    >
      {/* 远景几何 — 淡化方框，暗示空间深度 */}
      <Box
        position="absolute"
        top="36%"
        right="-26px"
        w="150px"
        h="150px"
        border={`${BORDER.heavy} ${COLORS.red}`}
        opacity={0.07}
        transform="rotate(12deg)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="40px"
        left="-22px"
        w="110px"
        h="110px"
        border={`${BORDER.standard} ${COLORS.electricCyan}`}
        opacity={0.1}
        transform="rotate(-18deg)"
        pointerEvents="none"
      />

      <Flex
        direction="column"
        flex="1"
        px={{ base: "10px", md: "14px" }}
        pt={{ base: "8px", md: "10px" }}
        pb="10px"
        gap={{ base: "8px", md: "10px" }}
        position="relative"
        minH="0"
      >
        {/* ===== 页头 — 黑标题 + 红色标尺 + 等宽副题 ===== */}
        <M.Box
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.normal, ease: EASING.launch }}
          flexShrink={0}
        >
          <Flex justify="space-between" align="flex-start" gap="12px" flexWrap="wrap">
            <Box minW="0">
              <Flex align="center" gap="8px">
                <Box w="10px" h="20px" bg={COLORS.red} flexShrink={0} />
                <Text
                  fontFamily={FONT.sans}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "17px", md: "20px" }}
                  letterSpacing="0.04em"
                  color={COLORS.black}
                  lineHeight={1}
                >
                  定价方案
                </Text>
              </Flex>
              <Text
                fontFamily={FONT.mono}
                fontWeight={WEIGHT.bold}
                fontSize="8px"
                letterSpacing="0.16em"
                color={COLORS.industrialBlack}
                opacity={0.6}
                mt="6px"
                ml="18px"
                lineHeight={1}
              >
                PRICING // 三档轨道 · 选择你的推进速度
              </Text>
            </Box>

            {/* 计费切换 — 方形分段按钮 */}
            <Flex
              border={`${BORDER.standard} ${COLORS.black}`}
              bg={COLORS.pureWhite}
              boxShadow={SHADOW.small}
              flexShrink={0}
            >
              {(
                [
                  { key: "monthly", label: "月付", badge: null },
                  { key: "yearly", label: "年付", badge: "-20%" },
                ] as const
              ).map((opt, i) => {
                const active = mode === opt.key;
                return (
                  <Box
                    as="button"
                    key={opt.key}
                    aria-pressed={active}
                    onClick={() => setMode(opt.key)}
                    px={{ base: "12px", md: "14px" }}
                    py="6px"
                    borderLeft={i > 0 ? `${BORDER.standard} ${COLORS.black}` : undefined}
                    bg={active ? COLORS.red : COLORS.pureWhite}
                    cursor="pointer"
                    transition={`background ${DURATION.fast}s ease`}
                    _hover={{ bg: active ? COLORS.redLight : COLORS.metalWhite }}
                  >
                    <Flex align="center" gap="5px">
                      <Text
                        fontFamily={FONT.sans}
                        fontWeight={active ? WEIGHT.black : WEIGHT.bold}
                        fontSize="11px"
                        letterSpacing="0.1em"
                        color={active ? COLORS.pureWhite : COLORS.black}
                        lineHeight={1}
                      >
                        {opt.label}
                      </Text>
                      {opt.badge && (
                        <Text
                          fontFamily={FONT.mono}
                          fontWeight={WEIGHT.bold}
                          fontSize="8px"
                          color={active ? COLORS.gold : COLORS.goldDark}
                          lineHeight={1}
                        >
                          {opt.badge}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </Flex>

          {/* 红色标尺 — 红段 + 细线 */}
          <Flex h="2px" mt="8px" align="stretch">
            <Box w="64px" bg={COLORS.red} />
            <Box flex="1" bg={COLORS.black} opacity={0.12} />
          </Flex>
        </M.Box>

        {/* ===== 三档 — 非对称排布：侧卡下沉，主卡升顶 ===== */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: "8px", md: "14px" }}
          flex={{ base: "none", md: "1" }}
          align={{ md: "stretch" }}
          position="relative"
          minH="0"
        >
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} mode={mode} index={i} />
          ))}
        </Flex>
      </Flex>

      {/* ===== 页脚注记 — 黑底等宽 ===== */}
      <M.Box
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.normal, delay: 0.4 }}
        flexShrink={0}
      >
        <Flex
          bg={COLORS.black}
          h={{ base: "22px", md: "24px" }}
          align="center"
          justify="space-between"
          px={{ base: "10px", md: "14px" }}
          gap="12px"
        >
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.1em"
            color={COLORS.metalWhite}
            opacity={0.55}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            所有价格人民币计价 // 年付按 12 个月折算 · 支持随时升降级
          </Text>
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            letterSpacing="0.14em"
            color={COLORS.red}
            flexShrink={0}
          >
            ¥ CNY
          </Text>
        </Flex>
      </M.Box>
    </Box>
  );
}
