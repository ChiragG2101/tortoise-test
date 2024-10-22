import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectItem } from '@nextui-org/react';
import { useGetLessorSupplierConfigurationQuery } from '@/features/billing/api';

const LessorSelect = ({ label, selectProps, setSelectedConfig }) => {
  const { data, isLoading } = useGetLessorSupplierConfigurationQuery();

  const activeLessors =
    data?.map((item) => ({
      key: item?.lessor?.id,
      display_name: item?.lessor?.name,
    })) || [];

  const handleLessorChange = (e) => {
    const selectedConfig = data?.find(
      (item) => String(item?.lessor?.id) === String(e.target.value)
    );
    setSelectedConfig(selectedConfig);
  };

  return (
    <Select
      label={label}
      aria-label='Lessor Selector'
      placeholder='Select a client'
      size='sm'
      className='bg-white rounded-lg border-2 border-gray-200 text-gray-600'
      isLoading={isLoading}
      items={activeLessors}
      onChange={handleLessorChange}
      {...selectProps}
    >
      {(lessor) => (
        <SelectItem key={lessor?.key}>{lessor?.display_name}</SelectItem>
      )}
    </Select>
  );
};

LessorSelect.propTypes = {
  label: PropTypes.any,
  selectProps: PropTypes.any,
  setSelectedConfig: PropTypes.func,
};

export default LessorSelect;
