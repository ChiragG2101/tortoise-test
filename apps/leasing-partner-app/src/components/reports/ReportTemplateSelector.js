import React, { useCallback, useMemo, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input, Radio, RadioGroup } from '@nextui-org/react';
import { useGetReportTemplatesQuery } from '@/features/reports/api';

export const ReportTemplateSelector = ({
  value,
  onChange,
  setSelectedTemplate,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState(null);
  const { data: reportTemplates, isLoading: isReportTemplateLoading } =
    useGetReportTemplatesQuery();

  const filteredTemplates = useMemo(
    () =>
      reportTemplates?.filter((template) =>
        template.display_name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [reportTemplates, searchText]
  );

  const onSearchTextChange = useCallback(() => {
    onChange(null);
    setSelectedTemplate(null);
  }, [onChange, setSelectedTemplate]);

  if (isReportTemplateLoading) {
    return null;
  }

  return (
    <div className='flex flex-col gap-8'>
      <Input
        placeholder='Search by template name'
        prefix={<MagnifyingGlass size={16} color='#CBCBCB' weight='bold' />}
        className='bg-black-1 border border-black-3 text-black-6'
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          onSearchTextChange();
        }}
      />

      <RadioGroup
        onValueChange={(e) => {
          onChange(e);
          setSelectedTemplate(filteredTemplates.find((t) => t.id === e));
        }}
        className='flex flex-col gap-4'
        value={value}
        color='success'
      >
        {filteredTemplates?.map((template) => (
          <div
            key={`template_${template.id}`}
            className='flex flex-row justify-between text-sm'
          >
            <Radio value={template?.id}>{template.display_name}</Radio>
            <div className='text-black-5 underline underline-offset-4'>
              {template.columns.length} columns
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
