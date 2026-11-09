import { Box, Text, Flex, Grid } from "@chakra-ui/react";
import { COLORS, FONT, WEIGHT, BORDER } from "../Theme";

export default function ShowroomSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      id={id}
      px={{ base: "20px", md: "32px", lg: "48px" }}
      py={{ base: "32px", md: "48px" }}
      borderBottom={`${BORDER.standard} ${COLORS.black}`}
    >
      <Flex align="baseline" gap="16px" mb="32px">
        <Text fontFamily={FONT.mono} fontSize="12px" color={COLORS.red} letterSpacing="0.12em">
          {number}
        </Text>
        <Text
          fontFamily={FONT.sans}
          fontWeight={WEIGHT.black}
          fontSize="24px"
          letterSpacing="0.04em"
          color={COLORS.black}
        >
          {title}
        </Text>
        <Box flex={1} h="2px" bg={COLORS.black} opacity={0.1} />
      </Flex>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap="24px"
      >
        {children}
      </Grid>
    </Box>
  );
}
