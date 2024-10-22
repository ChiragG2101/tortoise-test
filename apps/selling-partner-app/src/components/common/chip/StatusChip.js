import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@nextui-org/react';
import { STATUS_COLORS } from '../constants';

const statusColors = {
  [STATUS_COLORS.RED]: 'text-highlight-red-dark bg-highlight-red-light-1',
  [STATUS_COLORS.GREEN]: 'text-highlight-green-dark bg-highlight-green-light-1',
  [STATUS_COLORS.PURPLE]:
    'text-highlight-purple-dark bg-highlight-purple-light-1',
  [STATUS_COLORS.GREY]: 'text-highlight-grey-dark bg-highlight-grey-light-1',
  [STATUS_COLORS.YELLOW]:
    'text-highlight-yellow-dark bg-highlight-yellow-light-1',
};

function StatusChip({ label, color = STATUS_COLORS.GREY, chipProps = {} }) {
  return (
    <Chip className={`${statusColors[color]}`} {...chipProps}>
      {label}
    </Chip>
  );
}

StatusChip.propTypes = {
  color: PropTypes.oneOf(Object.values(STATUS_COLORS)).isRequired,
  label: PropTypes.string.isRequired,
  chipProps: PropTypes.object,
};

export default StatusChip;
