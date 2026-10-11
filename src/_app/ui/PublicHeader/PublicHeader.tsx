"use client";

import { Group, Text } from "@mantine/core";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkStyle = { color: "inherit", textDecoration: "none" } as const;

const navLinks = [
  { href: "/book", label: "Записаться" },
  { href: "/admin", label: "Админка" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <Group justify="space-between" wrap="nowrap">
      <Link
        href="/"
        style={{
          ...linkStyle,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
        aria-current={isActive(pathname, "/") ? "page" : undefined}
      >
        <CalendarDays size={24} aria-hidden />
        <Text component="span" fw={700} size="lg">
          Calendar
        </Text>
      </Link>

      <Group gap="lg">
        {navLinks.map(({ href, label }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              style={linkStyle}
              aria-current={active ? "page" : undefined}
            >
              <Text
                component="span"
                fw={active ? 700 : 400}
                c={active ? undefined : "dimmed"}
              >
                {label}
              </Text>
            </Link>
          );
        })}
      </Group>
    </Group>
  );
}
