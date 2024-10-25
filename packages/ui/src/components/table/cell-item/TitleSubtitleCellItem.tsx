import React from "react";

interface TitleSubtitleItemProps {
  /** The main title text to be displayed */
  title: string;
  /** The subtitle text displayed below the title */
  subtitle: string;
}

/**
 * `TitleSubtitleItem` is a simple layout component for displaying a title with a subtitle underneath.
 * The subtitle is styled for subtlety to distinguish it from the title.
 *
 * Usage:
 * ```
 * <TitleSubtitleItem title="Main Title" subtitle="Subtitle text here" />
 * ```
 *
 * Props:
 * - `title`: string - The primary title text.
 * - `subtitle`: string - The subtitle text displayed in a smaller, subdued style.
 */
export default function TitleSubtitleItem({
  title,
  subtitle,
}: TitleSubtitleItemProps): JSX.Element {
  return (
    <div className="flex flex-col">
      <p>{title}</p>
      <p className="text-xs text-black-5">{subtitle}</p>
    </div>
  );
}
