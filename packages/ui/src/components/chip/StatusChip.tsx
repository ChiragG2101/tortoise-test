import React from "react";
import { Chip } from "@nextui-org/react";
import { STATUS_COLORS } from "../constants";
import { ValueOf } from "next/dist/shared/lib/constants";

type StatusColor = ValueOf<typeof STATUS_COLORS>;

const statusColors: Record<StatusColor, string> = {
  [STATUS_COLORS.RED]: "text-highlight-red-dark bg-highlight-red-light-1",
  [STATUS_COLORS.GREEN]: "text-highlight-green-dark bg-highlight-green-light-1",
  [STATUS_COLORS.PURPLE]:
    "text-highlight-purple-dark bg-highlight-purple-light-1",
  [STATUS_COLORS.GREY]: "text-highlight-grey-dark bg-highlight-grey-light-1",
  [STATUS_COLORS.YELLOW]:
    "text-highlight-yellow-dark bg-highlight-yellow-light-1",
};

// Define the props interface
interface StatusChipProps {
  label: string;
  color?: StatusColor;
  chipProps?: React.ComponentProps<typeof Chip>;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  color = STATUS_COLORS.GREY,
  chipProps = {},
}) => {
  return (
    <Chip className={`${statusColors[color]}`} {...chipProps}>
      {label}
    </Chip>
  );
};
