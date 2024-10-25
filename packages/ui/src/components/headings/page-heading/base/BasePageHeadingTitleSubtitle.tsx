import React from "react";

interface BasePageHeadingTitleSubtitleProps {
  /** The main title text to be displayed */
  title: string;
  /** Optional subtitle text displayed above the title */
  subtitle?: string;
}

/**
 * `BasePageHeadingTitleSubtitle` displays a main title and an optional subtitle.
 * The subtitle, if provided, appears in a lighter style above the title.
 *
 * Usage:
 * ```
 * <BasePageHeadingTitleSubtitle
 *   title="Main Title"
 *   subtitle="Subtitle text"
 * />
 * ```
 *
 * Props:
 * - `title`: string - The primary title text.
 * - `subtitle`: string (optional) - The subtitle text, displayed in a smaller, lighter font above the title.
 */
export default function BasePageHeadingTitleSubtitle({
  title,
  subtitle,
}: BasePageHeadingTitleSubtitleProps): JSX.Element {
  if (subtitle) {
    return (
      <div className="flex flex-col">
        <div className="flex gap-1 items-center text-xs font-light text-black-5 leading-tight">
          {subtitle}
        </div>
        <div className="flex gap-1 items-center font-medium text-sm text-black-9 leading-tight">
          {title}
        </div>
      </div>
    );
  }
  return <div className="font-semibold body-xlarge">{title}</div>;
}
