import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectItem } from '@nextui-org/react';
import { useGetLessorSupplierConfigurationQuery } from '@/features/vendor/api';

const SupplierSelect = ({ label, selectProps, setSelectedConfig }) => {
  const { data, isLoading } = useGetLessorSupplierConfigurationQuery();

  const supplierList =
    data?.map((item) => ({
      key: item?.supplier?.id,
      display_name: item?.supplier?.name,
    })) || [];

  const handleSelectChange = (e) => {
    const selectedConfig = data?.find(
      (item) => String(item?.supplier?.id) === String(e.target.value)
    );

    setSelectedConfig(selectedConfig);
  };

  return (
    <div>
      <Select
        label={label}
        size='sm'
        aria-label='Supplier Selector'
        placeholder='Select a supplier'
        style={{
          border: '2px solid #E1E1E1',
          borderRadius: '8px',
        }}
        isLoading={isLoading}
        items={supplierList}
        onChange={handleSelectChange}
        {...selectProps}
      >
        {(supplier) => (
          <SelectItem key={supplier?.key}>{supplier?.display_name}</SelectItem>
        )}
      </Select>
    </div>
  );
};

SupplierSelect.PropTypes = {
  label: PropTypes.any,
  selectProps: PropTypes.any,
  setSelectedConfig: PropTypes.func,
};

export default SupplierSelect;
