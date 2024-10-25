'use client';

import React from 'react';
import PropTypes from 'prop-types';
import BasePageSubheading from '../page-subheading/BasePageSubheading';
import { STATUS_COLORS } from '../../constants';

const TitleSubtitlePageSubheading = ({
  title,
  subtitle,
  color = STATUS_COLORS.GREY,
  rightSlot,
}) => {
  const textColorVariants = Object.freeze({
    red: 'text-highlight-red-dark',
    green: 'text-highlight-green-dark',
    grey: 'text-highlight-grey-dark',
    yellow: 'text-highlight-yellow-dark',
    purple: 'text-highlight-purple-dark',
  });
  return (
    <BasePageSubheading
      leftSlot={
        <div className='max-w-4/5'>
          <p
            className={`${textColorVariants[color]} text-lg font-semibold mb-1`}
          >
            {title}
          </p>
          <p className={`${textColorVariants[color]} text-md`}>{subtitle}</p>
        </div>
      }
      rightSlot={rightSlot}
      color={color}
    />
  );
};

TitleSubtitlePageSubheading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  color: PropTypes.oneOf(Object.values(STATUS_COLORS)),
};

export default TitleSubtitlePageSubheading;
