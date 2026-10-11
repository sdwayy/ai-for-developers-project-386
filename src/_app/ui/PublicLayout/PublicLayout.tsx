import { Box, Container } from "@mantine/core";
import type { ReactNode } from "react";
import { PublicHeader } from "../PublicHeader";

const BACKGROUND = "linear-gradient(135deg, #dbe7fb 0%, #f7e7dc 100%)";

type Props = {
  children: ReactNode;
};

export function PublicLayout(props: Props) {
  const { children } = props;

  return (
    <Box mih="100vh" style={{ background: BACKGROUND }}>
      <Container size="lg" pt="lg">
        <PublicHeader />
      </Container>
      <Container size="lg" py="xl">
        {children}
      </Container>
    </Box>
  );
}
