import React, { useMemo, useState } from 'react';
import TemplatesHelperCard from './TemplatesHelperCard';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Divider, Input } from '@nextui-org/react';
import { useGetReportTemplatesQuery } from '@/features/reports/api';

export default function ReportTemplates() {
  const [searchText, setSearchText] = useState('');
  const { data: reportTemplates, isLoading: isReportTemplateLoading } =
    useGetReportTemplatesQuery();

  const filteredTemplates = useMemo(
    () =>
      reportTemplates?.filter((template) =>
        template.display_name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [reportTemplates, searchText]
  );

  if (isReportTemplateLoading) {
    return <></>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <Input
        placeholder='Search by template name'
        className='bg-black-1 border border-black-3 text-black-6'
        startContent={
          <MagnifyingGlass size={16} color='#CBCBCB' weight='bold' />
        }
        // className='bg-black-1 border border-black-3 text-black-6'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Divider />
      <div className='flex flex-col gap-6'>
        {filteredTemplates?.map((template) => (
          <TemplatesHelperCard key={template.title} {...template} />
        ))}
      </div>
    </div>
  );
}
