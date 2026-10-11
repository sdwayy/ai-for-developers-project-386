import { Grid, GridCol } from "@mantine/core";
import { homeContent } from "../../model/home-content";
import { FeaturesCard } from "../FeaturesCard";
import { Hero } from "../Hero";

export function HomePage() {
  const { badge, title, subtitle, cta, featuresTitle, features } = homeContent;

  return (
    <Grid gap="xl" align="flex-start">
      <GridCol span={{ base: 12, md: 7 }}>
        <Hero badge={badge} title={title} subtitle={subtitle} cta={cta} />
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <FeaturesCard title={featuresTitle} features={features} />
      </GridCol>
    </Grid>
  );
}
