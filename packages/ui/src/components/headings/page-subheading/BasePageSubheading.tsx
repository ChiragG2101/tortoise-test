"use client";

import React, { ReactNode } from "react";
import { STATUS_COLORS } from "../../constants";

// Define an interface for the component props
interface BasePageSubheadingProps {
  /** Optional content to display on the left side of the subheading */
  leftSlot?: ReactNode;
  /** Optional content to display on the right side of the subheading */
  rightSlot?: ReactNode;
  /** Background color for the subheading, default is grey */
  color?: keyof typeof STATUS_COLORS; // Assuming STATUS_COLORS is an object with color keys
}

/**
 * `BasePageSubheading` is a component that displays a flexible subheading area
 * with customizable left and right slots and background color.
 *
 * Usage:
 * ```
 * <BasePageSubheading
 *   leftSlot={<span>Left Content</span>}
 *   rightSlot={<span>Right Content</span>}
 *   color="green"
 * />
 * ```
 *
 * Props:
 * - `leftSlot`: ReactNode (optional) - Content to be displayed on the left side.
 * - `rightSlot`: ReactNode (optional) - Content to be displayed on the right side.
 * - `color`: string (optional) - Background color variant for the subheading.
 * Default is `STATUS_COLORS.GREY`.
 */
const BasePageSubheading: React.FC<BasePageSubheadingProps> = ({
  leftSlot,
  rightSlot,
  color = STATUS_COLORS.GREY,
}) => {
  // Mapping of colors to corresponding CSS class names
  const backgroundColorVariants = Object.freeze({
    red: "bg-highlight-red-light-1",
    green: "bg-highlight-green-light-1",
    grey: "bg-highlight-grey-light-1",
    yellow: "bg-highlight-yellow-light-1",
    purple: "bg-highlight-purple-light-1",
  });

  return (
    <div
      className={`${backgroundColorVariants[color as keyof typeof backgroundColorVariants]} px-5 py-5 flex items-center justify-between`}
    >
      {leftSlot}
      {rightSlot}
    </div>
  );
};

export default BasePageSubheading;
