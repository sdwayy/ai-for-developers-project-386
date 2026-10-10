import { Card, List, ListItem, Title } from "@mantine/core";

type Props = {
  title: string;
  features: readonly string[];
};

export function FeaturesCard(props: Props) {
  const { title, features } = props;

  return (
    <Card withBorder radius="lg" padding="xl" bg="white">
      <Title order={3} mb="md">
        {title}
      </Title>
      <List spacing="sm" size="md">
        {features.map((feature) => (
          <ListItem key={feature}>{feature}</ListItem>
        ))}
      </List>
    </Card>
  );
}
