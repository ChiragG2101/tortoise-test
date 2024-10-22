import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { Select, SelectItem, Avatar } from '@nextui-org/react';
import { useGetLessorActiveOrganisationsQuery } from '@/features/lessor/api';

const OrganizationSelect = ({
  label,
  selectProps,
  setSelectedOrganization,
}) => {
  const user = useSelector((state) => state.auth.user);
  const { data: activeOrganizations, isLoading: isActiveOrganizationLoading } =
    useGetLessorActiveOrganisationsQuery(user?.lessor ?? skipToken);

  const updatedOrganizations = useMemo(
    () =>
      activeOrganizations?.map((org) => ({
        key: org?.organization?.display_name,
        display_name: org?.organization?.display_name,
        id: org?.organization?.id,
        logo: org?.organization?.logo,
        name: org?.organization?.name,
      })) || [],
    [activeOrganizations]
  );

  const handleOrganizationChange = (e) => {
    const selectedOrg = activeOrganizations.find(
      (org) => org?.organization?.display_name === e.target.value
    );
    setSelectedOrganization(selectedOrg);
  };

  return (
    <Select
      label={label}
      aria-label='Organization'
      size='sm'
      className='bg-white rounded-lg border-2 border-gray-200 text-gray-600'
      isLoading={isActiveOrganizationLoading}
      items={updatedOrganizations}
      placeholder='Select an organization'
      onChange={handleOrganizationChange}
      {...selectProps}
    >
      {(organization) => (
        <SelectItem
          key={organization?.key}
          startContent={
            <Avatar
              alt={organization?.display_name}
              className='w-7 h-7'
              src={organization?.logo}
            />
          }
        >
          {organization?.display_name}
        </SelectItem>
      )}
    </Select>
  );
};

OrganizationSelect.propTypes = {
  label: PropTypes.any,
  selectProps: PropTypes.any,
  setSelectedOrganization: PropTypes.func,
};

export default OrganizationSelect;
