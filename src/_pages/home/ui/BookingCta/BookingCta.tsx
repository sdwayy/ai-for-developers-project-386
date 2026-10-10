"use client";

import { Button } from "@mantine/core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  label: string;
  href: string;
};

export function BookingCta(props: Props) {
  const { label, href } = props;

  return (
    <Button
      component={Link}
      href={href}
      size="md"
      rightSection={<ArrowRight size={18} aria-hidden />}
    >
      {label}
    </Button>
  );
}
