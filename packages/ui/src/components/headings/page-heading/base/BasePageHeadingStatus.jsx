import { STATUS_COLORS } from "../../../constants";
import React from "react";

export default function BasePageHeadingStatus({ color, content }) {
  const textColorVariants = Object.freeze({
    [STATUS_COLORS.RED]: "text-highlight-red-dark",
    [STATUS_COLORS.GREEN]: "text-highlight-green-dark",
    [STATUS_COLORS.GREY]: "text-highlight-grey-dark",
    [STATUS_COLORS.YELLOW]: "text-highlight-yellow-dark",
    [STATUS_COLORS.PURPLE]: "text-highlight-purple-dark",
  });

  const backgroundColorVariants = Object.freeze({
    [STATUS_COLORS.RED]: "bg-highlight-red-light-1",
    [STATUS_COLORS.GREEN]: "bg-highlight-green-light-1",
    [STATUS_COLORS.GREY]: "bg-highlight-grey-light-2",
    [STATUS_COLORS.YELLOW]: "bg-highlight-yellow-light-1",
    [STATUS_COLORS.PURPLE]: "bg-highlight-purple-light-1",
  });
  return (
    <div
      className={`${backgroundColorVariants[color]} ${textColorVariants[color]} text-sm py-2 px-4 rounded-lg font-medium`}
    >
      {content}
    </div>
  );
}
