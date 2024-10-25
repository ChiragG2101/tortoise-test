"use client";

import React, { type ReactNode } from "react";
import BasePageSubheading from "../page-subheading/BasePageSubheading";
import { STATUS_COLORS } from "../../constants";

// Define an interface for the component props
interface TitleSubtitlePageSubheadingProps {
  /** The main title text displayed prominently */
  title: string;
  /** The subtitle text displayed below the title */
  subtitle: string;
  /** Background color for the subheading, default is grey */
  color?: keyof typeof STATUS_COLORS; // Assuming STATUS_COLORS is an object with color keys
  /** Optional content displayed on the right side of the subheading */
  rightSlot?: ReactNode;
}

/**
 * `TitleSubtitlePageSubheading` is a component that displays a title and subtitle
 * within a subheading, allowing customization of the background color and
 * optional right-side content.
 *
 * Usage:
 * ```
 * <TitleSubtitlePageSubheading
 *   title="Main Title"
 *   subtitle="Subtitle text"
 *   color="green"
 *   rightSlot={<Button>Action</Button>}
 * />
 * ```
 *
 * Props:
 * - `title`: string - The title text to be displayed.
 * - `subtitle`: string - The subtitle text to be displayed below the title.
 * - `color`: string (optional) - Background color variant for the subheading. Default is `STATUS_COLORS.GREY`.
 * - `rightSlot`: ReactNode (optional) - Content to be displayed on the right side of the subheading.
 */
const TitleSubtitlePageSubheading: React.FC<
  TitleSubtitlePageSubheadingProps
> = ({ title, subtitle, color = STATUS_COLORS.GREY, rightSlot }) => {
  // Mapping of colors to corresponding CSS class names
  const textColorVariants = Object.freeze({
    red: "text-highlight-red-dark",
    green: "text-highlight-green-dark",
    grey: "text-highlight-grey-dark",
    yellow: "text-highlight-yellow-dark",
    purple: "text-highlight-purple-dark",
  });

  return (
    <BasePageSubheading
      leftSlot={
        <div className="max-w-4/5">
          <p
            className={`${textColorVariants[color as keyof typeof textColorVariants]} text-lg font-semibold mb-1`}
          >
            {title}
          </p>
          <p
            className={`${textColorVariants[color as keyof typeof textColorVariants]} text-md`}
          >
            {subtitle}
          </p>
        </div>
      }
      rightSlot={rightSlot}
      // @ts-expect-error:  TypeScript does not recognize the `color` prop
      color={color}
    />
  );
};

export default TitleSubtitlePageSubheading;
