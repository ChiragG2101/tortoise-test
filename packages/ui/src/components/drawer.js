import { CaretLeft, CaretRight, XCircle } from '@phosphor-icons/react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

export function CustomTortoiseDrawerBody({ children }) {
  return <div className='flex flex-col p-4 md:p-5 lg:p-6'>{children}</div>;
}

export default function CustomTortoiseDrawer({
  isDrawerOpen,
  hasNavigationControls,
  title,
  onClose,
  children,
  footer,
}) {
  return (
    <Drawer
      open={isDrawerOpen}
      onClose={onClose}
      direction='right'
      lockBackgroundScroll
      style={{ minWidth: '27.5rem', width: '40%' }}
    >
      <div className='flex flex-col overflow-y-auto h-full'>
        <div className='flex h-12 bg-grey px-8 py-6 items-center justify-between border-b-1 bg-black-1'>
          {hasNavigationControls ? (
            <div className='flex'>
              <div className='p-1 border border-r-0 border-b-2 rounded-lg rounded-r-none bg-white'>
                <CaretLeft size={16} weight='bold' className='text-black-4' />
              </div>
              <div className='p-1 border border-b-2  rounded-lg rounded-l-none bg-white'>
                <CaretRight size={16} weight='bold' className='text-black-4' />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className='text-black-10 font-semibold body-small'>{`${title}`}</div>
          <div
            className='p-1 border border-b-2 rounded-lg bg-white cursor-pointer'
            onClick={onClose}
          >
            <XCircle weight='fill' size={16} className='text-black-4' />
          </div>
        </div>
        <div className='flex-grow overflow-y-auto'>{children}</div>
        {footer && (
          <div className='w-full p-4 border-t border-black-3'>{footer}</div>
        )}
      </div>
    </Drawer>
  );
}
