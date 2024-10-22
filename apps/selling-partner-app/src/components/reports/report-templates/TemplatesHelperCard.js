import React, { useState } from 'react';

export default function TemplatesHelperCard({ icon, display_name, columns }) {
  const description = columns.map((column) => column.display_name).join(', ');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex justify-between gap-5'>
        {icon && (
          <div className='p-4 rounded-lg bg-green-1 flex h-1/2'>{icon}</div>
        )}
        <div>
          <p className='font-semibold text-sm'>{display_name}</p>
          <div className='flex flex-col gap-2'>
            <p
              className={`text-black-5 font-medium text-xs ${isExpanded ? '' : 'line-clamp-2'}`}
            >
              {description}
            </p>
            {description.split(', ').length > 2 && (
              <p
                onClick={toggleDescription}
                className=' text-xs cursor-pointer text-green-7'
              >
                {isExpanded ? 'Hide columns' : 'Show more columns'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
