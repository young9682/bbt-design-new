import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useRef, useCallback } from "react";
import { COLORS, FONT, WEIGHT, BORDER, SHADOW, DURATION } from "../../Theme";

type FileNode = {
  name: string;
  type: "folder" | "file";
  depth: number;
  active?: boolean;
};

const FILE_TREE: FileNode[] = [
  { name: "src", type: "folder", depth: 0 },
  { name: "Theme.tsx", type: "file", depth: 1 },
  { name: "App.tsx", type: "file", depth: 1 },
  { name: "showroom", type: "folder", depth: 1 },
  { name: "DemoFrame.tsx", type: "file", depth: 2 },
  { name: "SceneSplitPane.tsx", type: "file", depth: 2, active: true },
  { name: "RefNavBar.tsx", type: "file", depth: 2 },
  { name: "assets", type: "folder", depth: 0 },
  { name: "logo.svg", type: "file", depth: 1 },
  { name: "index.html", type: "file", depth: 0 },
];

function PanelHeader({
  title,
  iconColor,
  bg,
  borderColor,
  textColor,
}: {
  title: string;
  iconColor: string;
  bg: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <Flex
      h="36px"
      align="center"
      justify="space-between"
      px="12px"
      bg={bg}
      borderBottom={`${BORDER.standard} ${borderColor}`}
      flexShrink={0}
    >
      <Flex align="center" gap="8px">
        <Box w="8px" h="8px" bg={iconColor} />
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="11px"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color={textColor}
        >
          {title}
        </Text>
      </Flex>
      <Box w="6px" h="6px" bg={iconColor} opacity={0.6} />
    </Flex>
  );
}

function FileTreeItem({ node }: { node: FileNode }) {
  const isFolder = node.type === "folder";
  return (
    <Flex
      h="32px"
      align="center"
      px="12px"
      pl={`calc(12px + ${node.depth * 16}px)`}
      bg={node.active ? `${COLORS.red}24` : "transparent"}
      borderLeft={`3px solid ${node.active ? COLORS.red : "transparent"}`}
      cursor="pointer"
      _hover={{ bg: COLORS.industrialBlack }}
      transition={`background ${DURATION.instant}s ease`}
    >
      <Box
        w={isFolder ? "10px" : "6px"}
        h={isFolder ? "8px" : "6px"}
        bg={isFolder ? COLORS.gold : node.active ? COLORS.electricCyan : COLORS.metalWhite}
        opacity={isFolder ? 1 : 0.7}
        flexShrink={0}
      />
      <Text
        ml="10px"
        fontFamily={FONT.mono}
        fontWeight={node.active ? WEIGHT.bold : WEIGHT.regular}
        fontSize="12px"
        color={isFolder ? COLORS.gold : node.active ? COLORS.red : COLORS.metalWhite}
        letterSpacing="0.04em"
      >
        {node.name}
      </Text>
    </Flex>
  );
}

function WorkspacePreview() {
  return (
    <Box flex={1} p="16px" overflow="auto">
      <Box
        bg={COLORS.pureWhite}
        border={`${BORDER.heavy} ${COLORS.black}`}
        boxShadow={SHADOW.medium}
        h="100%"
        p="16px"
        position="relative"
        overflow="hidden"
      >
        <Flex justify="space-between" align="flex-start" mb="16px">
          <Box>
            <Text
              fontFamily={FONT.sans}
              fontWeight={WEIGHT.black}
              fontSize="14px"
              color={COLORS.black}
              letterSpacing="-0.01em"
              mb="4px"
            >
              SceneSplitPane.tsx
            </Text>
            <Text
              fontFamily={FONT.mono}
              fontSize="10px"
              color={COLORS.industrialBlack}
              opacity={0.7}
            >
              src/showroom/scenes/
            </Text>
          </Box>
          <Box w="12px" h="12px" bg={COLORS.red} />
        </Flex>

        <Box mb="16px">
          {["70%", "90%", "55%", "80%", "60%"].map((w, i) => (
            <Box
              key={i}
              h="8px"
              w={w}
              bg={COLORS.metalWhite}
              mb="8px"
              border={`${BORDER.hairline} ${COLORS.industrialBlack}`}
            />
          ))}
        </Box>

        <Flex gap="12px" mt="24px">
          <Box flex={1} h="80px" bg={COLORS.concrete} border={`${BORDER.standard} ${COLORS.black}`} boxShadow={SHADOW.small} />
          <Box flex={1} h="80px" bg={COLORS.red} border={`${BORDER.standard} ${COLORS.redDark}`} boxShadow={SHADOW.red} />
        </Flex>

        <Box
          position="absolute"
          bottom="16px"
          right="16px"
          w="40px"
          h="40px"
          bg={COLORS.gold}
          clipPath="polygon(100% 0, 0 100%, 100% 100%)"
        />
      </Box>
    </Box>
  );
}

function StatusBar() {
  return (
    <Flex
      h="24px"
      bg={COLORS.black}
      align="center"
      justify="space-between"
      px="12px"
      borderTop={`${BORDER.standard} ${COLORS.redDark}`}
      flexShrink={0}
    >
      <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.metalWhite}>
        BBT DESIGN SYSTEM // SPLIT-PANE
      </Text>
      <Flex align="center" gap="8px">
        <Box w="6px" h="6px" bg={COLORS.signalGreen} />
        <Text fontFamily={FONT.mono} fontSize="10px" color={COLORS.signalGreen}>
          READY
        </Text>
      </Flex>
    </Flex>
  );
}

export default function SceneSplitPane() {
  const [ratio, setRatio] = useState(35);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setRatio(Math.min(80, Math.max(20, pct)));
  }, []);

  const stopDrag = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", stopDrag);
  }, [handleMove]);

  const startDrag = () => {
    dragging.current = true;
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const pct = ((touch.clientX - rect.left) / rect.width) * 100;
    setRatio(Math.min(80, Math.max(20, pct)));
  }, []);

  const stopTouchDrag = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", stopTouchDrag);
  }, [handleTouchMove]);

  const startTouchDrag = () => {
    dragging.current = true;
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopTouchDrag);
  };

  return (
    <Flex ref={containerRef} h="100%" position="relative" bg={COLORS.black}>
      {/* Left panel — file tree / sidebar */}
      <Flex
        w={`${ratio}%`}
        h="100%"
        direction="column"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.red}`}
        overflow="hidden"
      >
        <PanelHeader
          title="PROJECT // EXPLORER"
          iconColor={COLORS.red}
          bg={COLORS.industrialBlack}
          borderColor={COLORS.redDark}
          textColor={COLORS.metalWhite}
        />
        <Box flex={1} overflowY="auto">
          {FILE_TREE.map((node, idx) => (
            <FileTreeItem key={`${node.name}-${idx}`} node={node} />
          ))}
        </Box>
      </Flex>

      {/* Drag handle */}
      <Flex
        w="10px"
        h="100%"
        bg={COLORS.red}
        cursor="col-resize"
        direction="column"
        align="center"
        justify="center"
        gap="3px"
        flexShrink={0}
        position="relative"
        zIndex={2}
        onMouseDown={startDrag}
        onTouchStart={startTouchDrag}
        _hover={{ bg: COLORS.redLight }}
        _active={{ bg: COLORS.redDark }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} w="4px" h="2px" bg={`${COLORS.pureWhite}e6`} />
        ))}
      </Flex>

      {/* Right panel — workspace */}
      <Flex
        flex={1}
        h="100%"
        direction="column"
        bg={COLORS.concrete}
        overflow="hidden"
      >
        <PanelHeader
          title="WORKSPACE // PREVIEW"
          iconColor={COLORS.electricCyan}
          bg={COLORS.pureWhite}
          borderColor={COLORS.black}
          textColor={COLORS.black}
        />
        <WorkspacePreview />
        <StatusBar />
      </Flex>
    </Flex>
  );
}
