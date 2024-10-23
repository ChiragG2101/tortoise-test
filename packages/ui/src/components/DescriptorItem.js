import React from 'react';
import PropTypes from 'prop-types';

const normalTextProps = 'text-sm font-medium text-black-10';
const opacityTextProps = 'text-xs font-medium text-black-8 opacity-60';

const DescriptorItem = ({
  title,
  subtitle,
  titleProps,
  subtitleProps,
  isTitleHasOpacity,
  copyIcon,
}) => {
  return (
    <div className='flex flex-col gap-1'>
      <p
        className={`${isTitleHasOpacity ? opacityTextProps : normalTextProps}`}
        {...titleProps}
      >
        {title}
      </p>
      <div className='flex items-center gap-1'>
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

DescriptorItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  titleProps: PropTypes.object,
  subtitleProps: PropTypes.object,
  isTitleHasOpacity: PropTypes.bool,
  copyIcon: PropTypes.any,
};
export default DescriptorItem;
