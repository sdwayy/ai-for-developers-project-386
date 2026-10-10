import { Box, Container, Grid, GridCol, Group, Text } from "@mantine/core";
import { CalendarDays } from "lucide-react";
import { homeContent } from "../../model/home-content";
import { FeaturesCard } from "../FeaturesCard";
import { Hero } from "../Hero";

const BACKGROUND = "linear-gradient(135deg, #dbe7fb 0%, #f7e7dc 100%)";

export function HomePage() {
  const { badge, title, subtitle, cta, featuresTitle, features } = homeContent;

  return (
    <Box mih="100vh" style={{ background: BACKGROUND }}>
      <Container size="lg" py="lg">
        <Group gap="xs">
          <CalendarDays size={24} aria-hidden />
          <Text fw={700} size="lg">
            {title}
          </Text>
        </Group>
      </Container>

      <Container size="lg" pt={{ base: "xl", md: 80 }}>
        <Grid gap="xl" align="flex-start">
          <GridCol span={{ base: 12, md: 7 }}>
            <Hero badge={badge} title={title} subtitle={subtitle} cta={cta} />
          </GridCol>
          <GridCol span={{ base: 12, md: 5 }}>
            <FeaturesCard title={featuresTitle} features={features} />
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
