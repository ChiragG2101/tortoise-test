import React, { ReactNode } from "react";

const normalTextProps = "text-sm font-medium text-black-10";
const opacityTextProps = "text-xs font-medium text-black-8 opacity-60";

interface DescriptorItemProps {
  /** The main title text displayed prominently */
  title: string;
  /** The subtitle text displayed under the title */
  subtitle: string;
  /** Optional additional props to apply to the title */
  titleProps?: React.HTMLAttributes<HTMLParagraphElement>;
  /** Optional additional props to apply to the subtitle */
  subtitleProps?: React.HTMLAttributes<HTMLParagraphElement>;
  /** If true, applies a faded style to the title text */
  isTitleHasOpacity?: boolean;
  /** An optional icon or element to display next to the subtitle */
  copyIcon?: ReactNode;
}

/**
 * `DescriptorItem` is a component that displays a title and subtitle with customizable styles and an optional icon.
 * It can apply opacity to the title text and includes flexibility for additional props on the title and subtitle.
 *
 * Usage:
 * ```
 * <DescriptorItem
 *   title="Main Title"
 *   subtitle="Subtitle text"
 *   isTitleHasOpacity={true}
 *   copyIcon={<IconComponent />}
 * />
 * ```
 *
 * Props:
 * - `title`: string - The main title text.
 * - `subtitle`: string - The subtitle text.
 * - `titleProps`: object - Additional props for the title element.
 * - `subtitleProps`: object - Additional props for the subtitle element.
 * - `isTitleHasOpacity`: boolean - Controls whether the title has opacity styling.
 * - `copyIcon`: ReactNode - An optional icon or element to display next to the subtitle.
 */
const DescriptorItem: React.FC<DescriptorItemProps> = ({
  title,
  subtitle,
  titleProps,
  subtitleProps,
  isTitleHasOpacity = false,
  copyIcon,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p
        className={`${isTitleHasOpacity ? opacityTextProps : normalTextProps}`}
        {...titleProps}
      >
        {title}
      </p>
      <div className="flex items-center gap-1">
        <p
          className={`${isTitleHasOpacity ? normalTextProps : opacityTextProps}`}
          {...subtitleProps}
        >
          {subtitle}
        </p>
        {copyIcon}
      </div>
    </div>
  );
};

export default DescriptorItem;
