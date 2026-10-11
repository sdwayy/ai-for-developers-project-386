import { Avatar, Group, Text } from "@mantine/core";
import { User } from "lucide-react";

type Props = {
  name: string;
};

export function HostSummary(props: Props) {
  const { name } = props;

  return (
    <Group gap="sm">
      <Avatar radius="xl" color="gray">
        <User size={18} aria-hidden />
      </Avatar>
      <Text fw={500}>{name}</Text>
    </Group>
  );
}
