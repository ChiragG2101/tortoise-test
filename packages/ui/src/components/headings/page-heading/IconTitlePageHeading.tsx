"use client";
import React, { ReactNode } from "react";
import {
  BasePageHeading,
  BasePageHeadingIcon,
  BasePageHeadingTitleSubtitle,
} from "./base";

interface IconTitlePageHeadingProps {
  /** The main title text displayed next to the icon */
  title: string;
  /** The icon component to display on the left side */
  Icon: React.ComponentType<any>;
  /** Optional props to pass to the icon component */
  iconProps?: React.SVGProps<SVGSVGElement>;
  /** Content displayed on the right side of the heading */
  rightSlot?: ReactNode;
}

/**
 * `IconTitlePageHeading` is a header component that displays an icon, a title, and optional content on the right.
 *
 * Usage:
 * ```
 * <IconTitlePageHeading
 *   title="Dashboard"
 *   Icon={DashboardIcon}
 *   iconProps={{ size: 24 }}
 *   rightSlot={<Button>Settings</Button>}
 * />
 * ```
 *
 * Props:
 * - `title`: string - The title text displayed next to the icon.
 * - `Icon`: ComponentType - The icon component to render.
 * - `iconProps`: SVGProps - Optional properties for the icon component.
 * - `rightSlot`: ReactNode - Optional content displayed to the right of the heading.
 */
export default function IconTitlePageHeading({
  title,
  Icon,
  iconProps,
  rightSlot,
}: IconTitlePageHeadingProps): JSX.Element {
  return (
    <BasePageHeading
      leftSlot={
        <div className="flex items-center gap-2">
          <BasePageHeadingIcon Icon={Icon} iconProps={iconProps} />
          <BasePageHeadingTitleSubtitle title={title} />
        </div>
      }
      rightSlot={rightSlot}
    />
  );
}
