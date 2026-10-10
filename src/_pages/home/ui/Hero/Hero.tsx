import { Badge, Stack, Text, Title } from "@mantine/core";
import { BookingCta } from "../BookingCta";

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  cta: {
    label: string;
    href: string;
  };
};

export function Hero(props: Props) {
  const { badge, title, subtitle, cta } = props;

  return (
    <Stack gap="lg" align="flex-start">
      <Badge variant="light" color="gray" radius="xl" size="lg" tt="uppercase">
        {badge}
      </Badge>
      <Title order={1} fz={{ base: 40, md: 64 }}>
        {title}
      </Title>
      <Text size="xl" c="dimmed" maw={520}>
        {subtitle}
      </Text>
      <BookingCta label={cta.label} href={cta.href} />
    </Stack>
  );
}
