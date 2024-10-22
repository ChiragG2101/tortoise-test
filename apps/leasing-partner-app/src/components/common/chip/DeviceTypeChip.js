import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@nextui-org/react';
import { DEVICE_TYPES } from '../constants';
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
} from '@phosphor-icons/react';

const deviceTypeChipColors = {
  [DEVICE_TYPES.MOBILE]: 'text-blue-600 bg-blue-50',
  [DEVICE_TYPES.LAPTOP]: 'text-sky-600 bg-sky-50',
  [DEVICE_TYPES.TABLET]: 'text-violet-600 bg-violet-50',
};

const deviceTypeIcon = {
  [DEVICE_TYPES.MOBILE]: DeviceMobile,
  [DEVICE_TYPES.LAPTOP]: Laptop,
  [DEVICE_TYPES.TABLET]: DeviceTablet,
  [DEVICE_TYPES.AUDIO]: Headphones,
  [DEVICE_TYPES.CHARGER]: PlugCharging,
  [DEVICE_TYPES.PENCIL]: PencilSimple,
  [DEVICE_TYPES.WATCH]: Watch,
  [DEVICE_TYPES.KEYBOARD]: Keyboard,
  [DEVICE_TYPES.DESKTOP]: Desktop,
};

function DeviceTypeChip({ deviceType }) {
  const Icon = deviceTypeIcon[deviceType];
  return (
    <Chip
      className={`${deviceTypeChipColors[deviceType] ?? 'text-highlight-green-dark bg-highlight-green-light-1'} flex items-center`}
    >
      <div className='flex items-center gap-1 capitalize'>
        {Icon && <Icon size={20} weight='fill' />}
        {deviceType}
      </div>
    </Chip>
  );
}

DeviceTypeChip.propTypes = {
  deviceType: PropTypes.oneOf(Object.values(DEVICE_TYPES)).isRequired,
};

export default DeviceTypeChip;
