import { User } from "@nextui-org/react";
import React from "react";

interface OrganizationCellItemProps {
  /** Name of the organization to be displayed */
  name: string;
  /** URL or source path for the organization's logo image */
  logo: string;
}

/**
 * `OrganizationCellItem` is a reusable component for displaying an organization with a name and logo.
 * It uses NextUI's `User` component to render the avatar and name in a compact, styled layout.
 *
 * Usage:
 * ```
 * <OrganizationCellItem name="OpenAI" logo="/path/to/logo.png" />
 * ```
 *
 * Props:
 * - `name`: string - The name of the organization.
 * - `logo`: string - The URL or path for the organization's logo image.
 */
export default function OrganizationCellItem({
  name,
  logo,
}: OrganizationCellItemProps): JSX.Element {
  return (
    <User
      name={name}
      avatarProps={{
        src: logo,
        radius: "md", // Medium border radius for the avatar
        className: "p-0.5 bg-black-2", // Custom styling for padding and background color
        imgProps: {
          className: "object-fill", // Ensures the image fills the avatar area without distortion
        },
      }}
    />
  );
}
