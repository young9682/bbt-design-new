import { Box, Text } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT } from "../Theme";

export default function DemoLabel({ number, title }: { number: string; title: string }) {
  return (
    <Box mb="12px">
      <Text
        fontFamily={FONT.mono}
        fontSize="11px"
        color={COLORS.gold}
        letterSpacing="0.08em"
        mb="4px"
      >
        {number}
      </Text>
      <Text
        fontFamily={FONT.sans}
        fontWeight={WEIGHT.black}
        fontSize="14px"
        color={COLORS.black}
        letterSpacing="0.04em"
      >
        {title}
      </Text>
    </Box>
  );
}
