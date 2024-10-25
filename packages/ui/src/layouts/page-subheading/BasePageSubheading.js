'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS } from '../../constants';

const BasePageSubheading = ({
  leftSlot,
  rightSlot,
  color = STATUS_COLORS.GREY,
}) => {
  const backgroundColorVariants = Object.freeze({
    red: 'bg-highlight-red-light-1',
    green: 'bg-highlight-green-light-1',
    grey: 'bg-highlight-grey-light-1',
    yellow: 'bg-highlight-yellow-light-1',
    purple: 'bg-highlight-purple-light-1',
  });

  return (
    <div
      className={`${backgroundColorVariants[color]} px-5 py-5 flex items-center justify-between`}
    >
      {leftSlot}
      {rightSlot}
    </div>
  );
};

BasePageSubheading.propTypes = {
  leftSlot:
    PropTypes.oneOfType[(PropTypes.node, PropTypes.oneOf([null, undefined]))],
  rightSlot:
    PropTypes.oneOfType[(PropTypes.node, PropTypes.oneOf([null, undefined]))],
  color: PropTypes.oneOf(Object.values(STATUS_COLORS)),
};

export default BasePageSubheading;
