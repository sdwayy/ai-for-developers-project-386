import { SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { EventType } from "@/shared/api";
import { bookContent } from "../../model/book-content";
import { EventTypeCard } from "../EventTypeCard";
import { HostSummary } from "../HostSummary";

type Props = {
  eventTypes: EventType[];
  host: {
    name: string;
  };
};

export function BookView(props: Props) {
  const { eventTypes, host } = props;
  const { title, subtitle, empty } = bookContent;

  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>{title}</Title>
        <Text c="dimmed" mt="xs">
          {subtitle}
        </Text>
      </div>

      <HostSummary name={host.name} />

      {eventTypes.length === 0 ? (
        <Text>{empty}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {eventTypes.map((eventType) => (
            <EventTypeCard key={eventType.id} eventType={eventType} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
