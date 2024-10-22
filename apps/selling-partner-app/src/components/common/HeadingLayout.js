'use client';

export default function HeadingLayout({ title, tabs, icon }) {
  return (
    <div className='px-5 pb-5 border-b-1 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {icon}
        <div className='font-semibold body-large'>{title}</div>
      </div>
      {tabs}
    </div>
  );
}
