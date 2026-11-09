import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION, EASING, Z_INDEX } from "../../Theme";

const M = { Box: motion(Box) };

interface MenuLink {
  label: string;
  code: string;
}

interface MenuColumn {
  label: string;
  code: string;
  links: MenuLink[];
}

interface NavItem {
  id: string;
  label: string;
  tagline: string;
  active?: boolean;
  columns: MenuColumn[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "platform",
    label: "平台",
    tagline: "计算 · 存储 · 网络",
    columns: [
      {
        label: "计算",
        code: "01",
        links: [
          { label: "容器集群", code: "K8S" },
          { label: "作业调度", code: "VCN" },
          { label: "GPU 训练池", code: "GPU" },
        ],
      },
      {
        label: "存储",
        code: "02",
        links: [
          { label: "对象存储", code: "OSS" },
          { label: "并行文件系统", code: "PFS" },
          { label: "归档冷库", code: "ARC" },
        ],
      },
      {
        label: "网络",
        code: "03",
        links: [
          { label: "虚拟私有网", code: "VPC" },
          { label: "负载均衡", code: "SLB" },
          { label: "域名解析", code: "DNS" },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "数据",
    tagline: "湖仓 · 流 · 治理",
    columns: [
      {
        label: "湖仓",
        code: "01",
        links: [
          { label: "数据湖", code: "DLK" },
          { label: "指标仓库", code: "DWH" },
          { label: "特征存储", code: "FTR" },
        ],
      },
      {
        label: "流处理",
        code: "02",
        links: [
          { label: "实时管道", code: "STM" },
          { label: "消息队列", code: "MQX" },
          { label: "事件总线", code: "EVT" },
        ],
      },
      {
        label: "治理",
        code: "03",
        links: [
          { label: "血缘追踪", code: "LIN" },
          { label: "质量规则", code: "DQR" },
          { label: "元数据中心", code: "MET" },
        ],
      },
    ],
  },
  {
    id: "ops",
    label: "运维",
    tagline: "监控 · 告警 · 审计",
    active: true,
    columns: [
      {
        label: "监控",
        code: "01",
        links: [
          { label: "指标墙", code: "MON" },
          { label: "链路追踪", code: "TRC" },
          { label: "日志检索", code: "LOG" },
        ],
      },
      {
        label: "告警",
        code: "02",
        links: [
          { label: "警报规则", code: "ALR" },
          { label: "值班轮换", code: "ONC" },
          { label: "静默窗口", code: "SLC" },
        ],
      },
      {
        label: "审计",
        code: "03",
        links: [
          { label: "操作记录", code: "AUD" },
          { label: "合规报告", code: "CMP" },
          { label: "密钥台账", code: "KEY" },
        ],
      },
    ],
  },
  {
    id: "docs",
    label: "文档",
    tagline: "手册 · 接口 · 案例",
    columns: [
      {
        label: "手册",
        code: "01",
        links: [
          { label: "快速开始", code: "QCK" },
          { label: "最佳实践", code: "BST" },
          { label: "升级指南", code: "UPG" },
        ],
      },
      {
        label: "接口",
        code: "02",
        links: [
          { label: "REST 参考", code: "API" },
          { label: "SDK 列表", code: "SDK" },
          { label: "Webhook", code: "WHK" },
        ],
      },
      {
        label: "案例",
        code: "03",
        links: [
          { label: "行业方案", code: "CS" },
          { label: "迁移故事", code: "MIG" },
        ],
      },
    ],
  },
];

/** 仪器色条 — 装饰性分割线 */
function InstrumentStrip() {
  return (
    <Flex h="4px" w="100%">
      <Box flex={3} bg={COLORS.red} />
      <Box flex={1} bg={COLORS.velocityOrange} />
      <Box flex={2} bg={COLORS.gold} />
      <Box flex={1} bg={COLORS.electricCyan} />
      <Box flex={1} bg={COLORS.signalGreen} />
      <Box flex={2} bg={COLORS.black} />
    </Flex>
  );
}

/** 下拉列中的链接行 — 红色 hover 态 */
function MenuLinkRow({ link, onNavigate }: { link: MenuLink; onNavigate?: () => void }) {
  return (
    <Flex
      align="center"
      gap="8px"
      py="5px"
      cursor="pointer"
      onClick={onNavigate}
      transition={`transform ${DURATION.fast}s ease, color ${DURATION.fast}s ease`}
      _hover={{ transform: "translateX(3px)", color: COLORS.red }}
    >
      <Box w="4px" h="4px" bg={COLORS.black} opacity={0.4} flexShrink={0} />
      <Text
        flex={1}
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.bold}
        fontSize="11px"
        letterSpacing="0.02em"
        color={COLORS.black}
        lineHeight={1}
      >
        {link.label}
      </Text>
      <Text
        fontFamily={FONT.mono}
        fontSize="8px"
        fontWeight={WEIGHT.black}
        color={COLORS.industrialBlack}
        opacity={0.55}
        letterSpacing="0.08em"
        lineHeight={1}
      >
        {link.code}
      </Text>
    </Flex>
  );
}

export default function SceneTopNavMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const openItem = NAV_ITEMS.find((item) => item.id === openId) ?? null;
  const linkCount = openItem
    ? openItem.columns.reduce((sum, col) => sum + col.links.length, 0)
    : 0;

  const closeAll = () => {
    setOpenId(null);
    setMobileOpen(false);
  };

  return (
    <Box h="100%" position="relative" overflow="hidden" bg={COLORS.concrete}>
      {/* ============================================
          顶部导航 — 黑色几何构成横梁 + 红色底边
          ============================================ */}
      <Box
        position="relative"
        zIndex={Z_INDEX.navigation}
        onMouseLeave={() => setOpenId(null)}
      >
        {/* 顶部扫描线 */}
        <Box
          h="2px"
          backgroundImage={`repeating-linear-gradient(90deg, ${COLORS.red} 0px, ${COLORS.red} 3px, transparent 3px, transparent 6px)`}
          opacity={0.4}
        />

        <Flex
          h="40px"
          align="stretch"
          justify="space-between"
          borderBottom={`2px solid ${COLORS.red}`}
          bg={COLORS.black}
        >
          {/* 左：Logo 标记 — 旋转红色方块 + DS */}
          <Flex
            align="center"
            gap="8px"
            pl="12px"
            pr={{ base: "8px", md: "16px" }}
            borderRight={`1px solid ${COLORS.pureWhite}14`}
          >
            <Box
              w="10px"
              h="10px"
              bg={COLORS.red}
              transform="rotate(45deg)"
              boxShadow={SHADOW.red}
              flexShrink={0}
            />
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="13px"
              color={COLORS.pureWhite}
              letterSpacing="0.06em"
              lineHeight={1}
            >
              DS
            </Text>
          </Flex>

          {/* 中：导航项（md+ 显示）— 悬停/点击展开下拉 */}
          <Flex
            align="stretch"
            display={{ base: "none", md: "flex" }}
            onClick={() => setMobileOpen(false)}
          >
            {NAV_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <Flex
                  key={item.id}
                  align="center"
                  gap="6px"
                  px="14px"
                  position="relative"
                  cursor="pointer"
                  bg={isOpen ? COLORS.red : "transparent"}
                  onMouseEnter={() => setOpenId(item.id)}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  transition={`background ${DURATION.fast}s ease`}
                  _hover={{ bg: COLORS.red }}
                >
                  {item.active && (
                    <Box
                      w="5px"
                      h="5px"
                      bg={isOpen ? COLORS.pureWhite : COLORS.red}
                      transform="rotate(45deg)"
                      flexShrink={0}
                    />
                  )}
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.bold}
                    fontSize="11px"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    lineHeight={1}
                    color={
                      isOpen
                        ? COLORS.pureWhite
                        : item.active
                        ? COLORS.red
                        : COLORS.metalWhite
                    }
                  >
                    {item.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>

          {/* 右：模块代码 + 汉堡按钮（窄屏显示） */}
          <Flex align="stretch">
            <Flex
              align="center"
              px="12px"
              borderLeft={`1px solid ${COLORS.pureWhite}14`}
              display={{ base: "none", md: "flex" }}
            >
              <Text
                fontFamily={FONT.mono}
                fontSize="9px"
                fontWeight={WEIGHT.black}
                color={COLORS.gold}
                letterSpacing="0.12em"
                lineHeight={1}
              >
                MOD-01-06
              </Text>
            </Flex>
            <Flex
              align="center"
              justify="center"
              w="40px"
              borderLeft={`1px solid ${COLORS.pureWhite}14`}
              cursor="pointer"
              display={{ base: "flex", md: "none" }}
              onClick={() => setMobileOpen((v) => !v)}
              transition={`background ${DURATION.fast}s ease`}
              _hover={{ bg: COLORS.red }}
            >
              <Flex direction="column" gap="3px">
                <Box w="14px" h="2px" bg={mobileOpen ? COLORS.red : COLORS.metalWhite} />
                <Box w="14px" h="2px" bg={mobileOpen ? COLORS.red : COLORS.metalWhite} />
                <Box w="14px" h="2px" bg={mobileOpen ? COLORS.red : COLORS.metalWhite} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* ============================================
            桌面端 Mega Menu 下拉面板
            ============================================ */}
        <AnimatePresence>
          {openItem && (
            <M.Box
              key={`mega-${openItem.id}`}
              position="absolute"
              top="44px"
              left="8px"
              right="8px"
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.large}
              zIndex={Z_INDEX.overlay}
              maxH="274px"
              overflowY="auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: DURATION.fast, ease: EASING.launch }}
            >
              <InstrumentStrip />

              {/* 面板头部 — 标题 + 金色几何装饰 */}
              <Flex
                align="center"
                justify="space-between"
                px="14px"
                py="8px"
                borderBottom={`${BORDER.standard} ${COLORS.black}`}
                position="relative"
                overflow="hidden"
              >
                <Flex align="center" gap="8px">
                  <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" />
                  <Text
                    fontFamily={FONT.sans}
                    fontWeight={WEIGHT.black}
                    fontSize="13px"
                    color={COLORS.black}
                    letterSpacing="0.04em"
                    textTransform="uppercase"
                    lineHeight={1}
                  >
                    {openItem.label} · {openItem.tagline}
                  </Text>
                </Flex>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  fontWeight={WEIGHT.black}
                  color={COLORS.gold}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  lineHeight={1}
                >
                  MENU // {openItem.id.toUpperCase()}
                </Text>

                {/* 金色旋转方块 — 几何装饰 */}
                <Box
                  position="absolute"
                  top="-16px"
                  right="44px"
                  w="48px"
                  h="48px"
                  border={`${BORDER.heavy} ${COLORS.gold}`}
                  transform="rotate(45deg)"
                  opacity={0.25}
                  pointerEvents="none"
                />
                {/* 金色对角线 */}
                <Box
                  position="absolute"
                  top="6px"
                  right="0"
                  w="130px"
                  h="2px"
                  bg={COLORS.gold}
                  transform="rotate(-12deg)"
                  transformOrigin="right top"
                  opacity={0.5}
                  pointerEvents="none"
                />
              </Flex>

              {/* 分组链接列 — 交替底色构成柱式分栏 */}
              <Grid
                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              >
                {openItem.columns.map((col, index) => (
                  <Box
                    key={col.label}
                    px="14px"
                    py="10px"
                    bg={index % 2 === 1 ? COLORS.concrete : "transparent"}
                  >
                    <Flex
                      align="baseline"
                      gap="6px"
                      pb="4px"
                      mb="6px"
                      borderBottom={`${BORDER.hairline} ${COLORS.metalWhite}`}
                    >
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="9px"
                        fontWeight={WEIGHT.black}
                        color={COLORS.red}
                        letterSpacing="0.08em"
                        lineHeight={1}
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {col.code}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="9px"
                        fontWeight={WEIGHT.bold}
                        color={COLORS.industrialBlack}
                        letterSpacing="0.14em"
                        textTransform="uppercase"
                        lineHeight={1}
                      >
                        {col.label}
                      </Text>
                    </Flex>
                    {col.links.map((link) => (
                      <MenuLinkRow key={link.code} link={link} onNavigate={closeAll} />
                    ))}
                  </Box>
                ))}
              </Grid>

              {/* 面板底部 */}
              <Flex
                justify="space-between"
                align="center"
                px="14px"
                py="6px"
                borderTop={`${BORDER.hairline} ${COLORS.metalWhite}`}
                bg={COLORS.black}
              >
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  color={COLORS.metalWhite}
                  opacity={0.6}
                  letterSpacing="0.1em"
                  lineHeight={1}
                >
                  {linkCount} 个目的地 // 选择你的轨道
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontSize="8px"
                  color={COLORS.red}
                  fontWeight={WEIGHT.bold}
                  letterSpacing="0.1em"
                  lineHeight={1}
                >
                  点击空白处关闭
                </Text>
              </Flex>
            </M.Box>
          )}
        </AnimatePresence>

        {/* ============================================
            窄屏垂直菜单 — 手风琴式
            ============================================ */}
        <AnimatePresence>
          {mobileOpen && (
            <M.Box
              key="mobile-menu"
              position="absolute"
              top="44px"
              left="8px"
              right="8px"
              bg={COLORS.pureWhite}
              border={`${BORDER.heavy} ${COLORS.black}`}
              boxShadow={SHADOW.large}
              zIndex={Z_INDEX.overlay}
              maxH="274px"
              overflowY="auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: DURATION.fast, ease: EASING.launch }}
            >
              <InstrumentStrip />
              {NAV_ITEMS.map((item, index) => {
                const expanded = mobileExpanded === item.id;
                return (
                  <Box
                    key={item.id}
                    borderBottom={
                      index < NAV_ITEMS.length - 1
                        ? `${BORDER.hairline} ${COLORS.metalWhite}`
                        : undefined
                    }
                  >
                    <Flex
                      align="center"
                      gap="8px"
                      px="12px"
                      py="9px"
                      bg={COLORS.black}
                      cursor="pointer"
                      onClick={() => setMobileExpanded(expanded ? null : item.id)}
                    >
                      <Box
                        w="6px"
                        h="6px"
                        bg={COLORS.red}
                        transform="rotate(45deg)"
                        flexShrink={0}
                      />
                      <Text
                        flex={1}
                        fontFamily={FONT.sans}
                        fontWeight={WEIGHT.black}
                        fontSize="12px"
                        color={COLORS.pureWhite}
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        lineHeight={1}
                      >
                        {item.label}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="8px"
                        fontWeight={WEIGHT.black}
                        color={COLORS.gold}
                        letterSpacing="0.12em"
                        lineHeight={1}
                      >
                        {item.id.toUpperCase()}
                      </Text>
                      <Text
                        fontFamily={FONT.mono}
                        fontSize="12px"
                        color={COLORS.metalWhite}
                        lineHeight={1}
                        w="12px"
                        textAlign="center"
                      >
                        {expanded ? "−" : "+"}
                      </Text>
                    </Flex>
                    {expanded && (
                      <Box bg={COLORS.concrete}>
                        {item.columns.map((col) => (
                          <Box key={col.label} px="12px" py="6px">
                            <Text
                              fontFamily={FONT.mono}
                              fontSize="8px"
                              fontWeight={WEIGHT.black}
                              color={COLORS.red}
                              letterSpacing="0.14em"
                              textTransform="uppercase"
                              lineHeight={1}
                              mb="2px"
                            >
                              {col.code} // {col.label}
                            </Text>
                            {col.links.map((link) => (
                              <MenuLinkRow key={link.code} link={link} onNavigate={closeAll} />
                            ))}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </M.Box>
          )}
        </AnimatePresence>
      </Box>

      {/* ============================================
          页面背景 — 迷你工作台，衬托下拉层
          ============================================ */}
      <Box
        h="calc(100% - 44px)"
        position="relative"
        overflow="hidden"
        onClick={() => setOpenId(null)}
      >
        {/* 红色对角线装饰 */}
        <Box
          position="absolute"
          top="0"
          right="70px"
          w="2px"
          h="140%"
          bg={COLORS.red}
          transform="rotate(18deg)"
          transformOrigin="top"
          opacity={0.15}
          pointerEvents="none"
        />
        {/* 裁切红色角块 */}
        <Box
          position="absolute"
          bottom="0"
          right="0"
          w="150px"
          h="90px"
          bg={COLORS.red}
          clipPath="polygon(40% 0, 100% 0, 100% 100%, 0% 100%)"
          opacity={0.07}
          pointerEvents="none"
        />

        <Flex direction="column" h="100%" p={{ base: "10px", md: "14px" }} position="relative">
          {/* 标题行 */}
          <Flex justify="space-between" align="center" mb="10px" gap="8px">
            <Flex align="center" gap="8px">
              <Box w="8px" h="8px" bg={COLORS.red} transform="rotate(45deg)" />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="13px"
                color={COLORS.black}
                letterSpacing="0.04em"
                textTransform="uppercase"
              >
                集群概览
              </Text>
            </Flex>
            <Text
              fontFamily={FONT.mono}
              fontSize="9px"
              color={COLORS.industrialBlack}
              opacity={0.6}
              letterSpacing="0.08em"
              lineHeight={1}
            >
              LIVE // 08:12:44
            </Text>
          </Flex>

          {/* 数据块 */}
          <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="10px">
            {[
              { label: "节点", value: "347", color: COLORS.red },
              { label: "作业", value: "128", color: COLORS.electricCyan },
              { label: "GPU", value: "87%", color: COLORS.velocityOrange },
            ].map((stat) => (
              <Box
                key={stat.label}
                bg={COLORS.pureWhite}
                border={`${BORDER.heavy} ${COLORS.black}`}
                boxShadow={SHADOW.small}
                p="8px"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top="0" left="0" w="6px" h="6px" bg={stat.color} />
                <Text
                  fontFamily={FONT.sans}
                  fontSize="9px"
                  fontWeight={WEIGHT.bold}
                  color={COLORS.industrialBlack}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  lineHeight={1}
                >
                  {stat.label}
                </Text>
                <Text
                  fontFamily={FONT.mono}
                  fontWeight={WEIGHT.black}
                  fontSize={{ base: "14px", md: "16px" }}
                  color={stat.color}
                  mt="4px"
                  lineHeight={1}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {stat.value}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* 负载柱状面板 */}
          <Box
            flex={1}
            bg={COLORS.pureWhite}
            border={`${BORDER.heavy} ${COLORS.black}`}
            boxShadow={SHADOW.medium}
            p="10px"
            overflow="hidden"
          >
            <Flex justify="space-between" align="center" mb="8px">
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="10px"
                color={COLORS.black}
                letterSpacing="0.06em"
                textTransform="uppercase"
              >
                负载趋势
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.industrialBlack}
                opacity={0.6}
                letterSpacing="0.06em"
              >
                24H
              </Text>
            </Flex>
            <Flex align="flex-end" gap="5px" h="calc(100% - 26px)">
              {[35, 52, 28, 66, 48, 82, 55, 74, 44, 68, 60, 90].map((h, i) => (
                <Box
                  key={i}
                  flex={1}
                  h={`${h}%`}
                  maxH="100%"
                  bg={i === 11 ? COLORS.red : COLORS.black}
                  opacity={i === 11 ? 1 : 0.7}
                />
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
