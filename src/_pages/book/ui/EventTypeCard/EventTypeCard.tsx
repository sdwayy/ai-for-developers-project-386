"use client";

import { Badge, Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import type { EventType } from "@/shared/api";

type Props = {
  eventType: EventType;
};

export function EventTypeCard(props: Props) {
  const { eventType } = props;

  return (
    <Card
      component={Link}
      href={`/book/${eventType.id}`}
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Text fw={600}>{eventType.title}</Text>
        <Badge variant="light" style={{ flexShrink: 0 }}>
          {eventType.durationMinutes} мин
        </Badge>
      </Group>

      {eventType.description ? (
        <Text c="dimmed" size="sm" mt="sm">
          {eventType.description}
        </Text>
      ) : null}
    </Card>
  );
}
