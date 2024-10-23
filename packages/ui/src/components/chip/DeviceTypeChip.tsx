import React from "react";
import { Chip } from "@nextui-org/react";
import { DEVICE_TYPES } from "../constants";
import type { IconProps } from "@phosphor-icons/react";
import {
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Headphones,
  Keyboard,
  Laptop,
  PencilSimple,
  PlugCharging,
  Watch,
} from "@phosphor-icons/react";

type ValueOf<T> = T[keyof T];
export type DeviceType = ValueOf<typeof DEVICE_TYPES>;

export interface DeviceTypeChipProps {
  /** The type of device to display */
  deviceType: DeviceType;
  /** Optional className for additional styling */
  className?: string;
  /** Optional size for the icon */
  iconSize?: number;
}

const defaultColors = "text-highlight-green-dark bg-highlight-green-light-1";

const deviceTypeChipColors = {
  [DEVICE_TYPES.MOBILE]: "text-blue-600 bg-blue-50",
  [DEVICE_TYPES.LAPTOP]: "text-sky-600 bg-sky-50",
  [DEVICE_TYPES.TABLET]: "text-violet-600 bg-violet-50",
  [DEVICE_TYPES.AUDIO]: defaultColors,
  [DEVICE_TYPES.CHARGER]: defaultColors,
  [DEVICE_TYPES.PENCIL]: defaultColors,
  [DEVICE_TYPES.WATCH]: defaultColors,
  [DEVICE_TYPES.KEYBOARD]: defaultColors,
  [DEVICE_TYPES.DESKTOP]: defaultColors,
  [DEVICE_TYPES.INSURANCE]: defaultColors,
  [DEVICE_TYPES.OTHER]: defaultColors,
};

const deviceTypeIcon: Record<DeviceType, React.ComponentType<IconProps>> = {
  [DEVICE_TYPES.MOBILE]: DeviceMobile,
  [DEVICE_TYPES.LAPTOP]: Laptop,
  [DEVICE_TYPES.TABLET]: DeviceTablet,
  [DEVICE_TYPES.AUDIO]: Headphones,
  [DEVICE_TYPES.CHARGER]: PlugCharging,
  [DEVICE_TYPES.PENCIL]: PencilSimple,
  [DEVICE_TYPES.WATCH]: Watch,
  [DEVICE_TYPES.KEYBOARD]: Keyboard,
  [DEVICE_TYPES.DESKTOP]: Desktop,
  [DEVICE_TYPES.INSURANCE]: PencilSimple,
  [DEVICE_TYPES.OTHER]: PencilSimple,
};

export const DeviceTypeChip: React.FC<DeviceTypeChipProps> = ({
  deviceType,
  className = "",
  iconSize = 20,
}) => {
  const Icon = deviceTypeIcon[deviceType] as React.ElementType;
  const colorClass = deviceTypeChipColors[deviceType];

  return (
    <Chip className={`${colorClass} flex items-center`}>
      <div className="flex items-center gap-1 capitalize">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {Icon && <Icon size={iconSize} weight="fill" className={className} />}
        {deviceType}
      </div>
    </Chip>
  );
};
