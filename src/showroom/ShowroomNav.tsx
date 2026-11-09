import {
  Box,
  Text,
  VStack,
  Link,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { COLORS, FONT, WEIGHT, BORDER, DURATION } from "../Theme";

const CATEGORIES = [
  { id: "nav-structure", label: "导航与结构" },
  { id: "scroll-parallax", label: "滚动与视差" },
  { id: "form-flow", label: "表单与流程" },
  { id: "data-dashboard", label: "数据与仪表" },
  { id: "content-display", label: "内容展示" },
  { id: "state-overlay", label: "状态与浮层" },
  { id: "interaction", label: "交互密集型" },
];

function NavContent({ activeId, onClick }: { activeId: string; onClick?: () => void }) {
  return (
    <VStack align="stretch" gap="4px">
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="14px"
        color={COLORS.pureWhite}
        letterSpacing="0.08em"
        mb="12px"
        px="16px"
      >
        样板房
      </Text>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={`#${cat.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth" });
            onClick?.();
          }}
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
        >
          <Box
            px="16px"
            py="8px"
            borderLeft={`3px solid ${activeId === cat.id ? COLORS.red : "transparent"}`}
            bg={activeId === cat.id ? `${COLORS.red}1f` : "transparent"}
            transition={`all ${DURATION.fast}s ease`}
          >
            <Text
              fontFamily={FONT.sans}
              fontWeight={activeId === cat.id ? WEIGHT.black : WEIGHT.bold}
              fontSize="12px"
              color={activeId === cat.id ? COLORS.pureWhite : COLORS.metalWhite}
              letterSpacing="0.04em"
            >
              {cat.label}
            </Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
}

export default function ShowroomNav() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    CATEGORIES.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box
        display={{ base: "none", md: "block" }}
        w="240px"
        h="100vh"
        bg={COLORS.black}
        borderRight={`${BORDER.heavy} ${COLORS.red}`}
        py="24px"
        position="sticky"
        top={0}
        flexShrink={0}
      >
        <NavContent activeId={activeId} />
      </Box>

      <Box display={{ base: "block", md: "none" }} position="fixed" top="16px" left="16px" zIndex={20}>
        <Button onClick={onOpen} size="sm" bg={COLORS.red} color={COLORS.pureWhite} borderRadius={0}>
          目录
        </Button>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={COLORS.black} maxW="240px">
          <DrawerCloseButton color={COLORS.pureWhite} />
          <DrawerBody pt="48px">
            <NavContent activeId={activeId} onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
