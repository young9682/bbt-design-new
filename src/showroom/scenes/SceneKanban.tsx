import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, SPACE, DURATION } from "../../Theme";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  tag: string;
  priority: Priority;
  assignee: string;
  due: string;
}

interface ColumnDef {
  id: string;
  title: string;
  code: string;
  tasks: Task[];
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: COLORS.red,
  medium: COLORS.gold,
  low: COLORS.electricCyan,
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

const COLUMNS: ColumnDef[] = [
  {
    id: "todo",
    title: "待办",
    code: "TODO",
    tasks: [
      { id: "T-042", title: "设计系统令牌补全", tag: "UI/UX", priority: "high", assignee: "ZK", due: "08-20" },
      { id: "T-043", title: "看板组件动效接入", tag: "Frontend", priority: "medium", assignee: "LY", due: "08-22" },
      { id: "T-044", title: "响应式断点测试", tag: "QA", priority: "low", assignee: "CW", due: "08-25" },
    ],
  },
  {
    id: "doing",
    title: "进行中",
    code: "DOING",
    tasks: [
      { id: "T-038", title: "仪表盘布局重构", tag: "Frontend", priority: "high", assignee: "MX", due: "08-18" },
      { id: "T-039", title: "空状态插画输出", tag: "Design", priority: "medium", assignee: "ZK", due: "08-21" },
    ],
  },
  {
    id: "done",
    title: "已完成",
    code: "DONE",
    tasks: [
      { id: "T-031", title: "导航栏翻页时钟", tag: "Frontend", priority: "high", assignee: "MX", due: "08-15" },
      { id: "T-032", title: "命令面板搜索", tag: "Backend", priority: "medium", assignee: "LY", due: "08-14" },
      { id: "T-033", title: "日历视图布局", tag: "Frontend", priority: "low", assignee: "CW", due: "08-13" },
    ],
  },
];

function GeometricMarker({ color }: { color: string }) {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="28px"
      h="28px"
      bg={color}
      boxShadow={SHADOW.small}
    >
      <Box
        position="absolute"
        bottom="4px"
        right="4px"
        w="8px"
        h="8px"
        bg={COLORS.pureWhite}
      />
    </Box>
  );
}

function TaskCard({ task }: { task: Task }) {
  const pColor = PRIORITY_COLOR[task.priority];
  return (
    <Box
      position="relative"
      bg={COLORS.pureWhite}
      border={`${BORDER.heavy} ${COLORS.black}`}
      boxShadow={SHADOW.medium}
      p="12px"
      pl="40px"
      transition={`all ${DURATION.fast}s ease`}
      _hover={{ transform: "translateY(-2px)", boxShadow: SHADOW.large }}
    >
      <GeometricMarker color={pColor} />

      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="11px"
        letterSpacing="0.04em"
        textTransform="uppercase"
        color={COLORS.black}
        lineHeight={1.2}
        mb="8px"
      >
        {task.title}
      </Text>

      <Flex
        align="center"
        gap="6px"
        mb="10px"
        pl="6px"
        borderLeft={`2px solid ${pColor}`}
      >
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.bold}
          fontSize="8px"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={COLORS.industrialBlack}
        >
          {task.tag}
        </Text>
      </Flex>

      <Flex justify="space-between" align="center">
        <Flex align="center" gap="6px">
          <Box
            w="20px"
            h="20px"
            bg={COLORS.black}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontFamily={FONT.mono}
              fontWeight={WEIGHT.bold}
              fontSize="9px"
              color={COLORS.pureWhite}
            >
              {task.assignee}
            </Text>
          </Box>
          <Text
            fontFamily={FONT.mono}
            fontSize="8px"
            fontWeight={WEIGHT.bold}
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={pColor}
          >
            {PRIORITY_LABEL[task.priority]}
          </Text>
        </Flex>

        <Text
          fontFamily={FONT.mono}
          fontSize="9px"
          color={COLORS.industrialBlack}
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {task.id} · {task.due}
        </Text>
      </Flex>
    </Box>
  );
}

export default function SceneKanban() {
  return (
    <Flex
      h="100%"
      gap={SPACE.md}
      bg={COLORS.concrete}
      p={SPACE.md}
      overflowX="auto"
      alignItems="stretch"
    >
      {COLUMNS.map((col) => (
        <Flex
          key={col.id}
          direction="column"
          minW={["260px", "280px", "300px"]}
          flex="1 0 auto"
          bg={COLORS.black}
          border={`${BORDER.heavy} ${COLORS.black}`}
          boxShadow={SHADOW.large}
        >
          {/* Instrument line */}
          <Flex h="3px">
            <Box flex={3} bg={COLORS.red} />
            <Box flex={7} bg={`${COLORS.pureWhite}0f`} />
          </Flex>

          {/* Column header */}
          <Flex
            align="center"
            justify="space-between"
            px={SPACE.md}
            py={SPACE.sm}
            borderBottom={`${BORDER.standard} ${COLORS.industrialBlack}`}
          >
            <Flex align="center" gap={SPACE.sm}>
              <Box w="8px" h="8px" bg={COLORS.red} />
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.black}
                fontSize="11px"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={COLORS.pureWhite}
              >
                {col.title}
              </Text>
              <Text
                fontFamily={FONT.mono}
                fontSize="8px"
                color={COLORS.metalWhite}
                opacity={0.4}
                letterSpacing="0.08em"
              >
                {col.code}
              </Text>
            </Flex>

            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              fontWeight={WEIGHT.black}
              color={COLORS.metalWhite}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(col.tasks.length).padStart(2, "0")}
            </Text>
          </Flex>

          {/* Cards */}
          <VStack
            align="stretch"
            gap={SPACE.sm}
            flex={1}
            overflowY="auto"
            p={SPACE.md}
          >
            {col.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </VStack>

          {/* New-task trigger */}
          <Box
            p={SPACE.md}
            pt="0"
          >
            <Flex
              align="center"
              justify="center"
              h="32px"
              border={`${BORDER.standard} ${COLORS.pureWhite}40`}
              bg="transparent"
              color={COLORS.metalWhite}
              cursor="pointer"
              transition={`all ${DURATION.fast}s ease`}
              _hover={{ borderColor: COLORS.red, color: COLORS.red }}
            >
              <Text
                fontFamily={FONT.sans}
                fontWeight={WEIGHT.bold}
                fontSize="9px"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                + 新建任务
              </Text>
            </Flex>
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}
