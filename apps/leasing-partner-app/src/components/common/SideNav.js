/* eslint-disable @next/next/no-img-element */
'use client';

import { Avatar, Divider, useDisclosure } from '@nextui-org/react';
import {
  Devices,
  File,
  Package,
  SignOut,
  Stamp,
  Ticket,
  UsersThree,
} from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import LogoutModal from '../auth/LogoutModal';
import Link from 'next/link';

const menuItems = Object.freeze([
  {
    title: 'Customers',
    icon: <UsersThree weight='duotone' size={24} />,
    links: [
      { href: '/customers/purchase-order', label: 'Purchase order' },
      { href: '/customers/active-customers', label: 'Active customers' },
      { href: '/customers/rental-schedule', label: 'Rental schedules' },
      { href: '/customers/leads', label: 'Leads' },
      { href: '/customers/billing', label: 'Billing' },
    ],
  },
  {
    title: 'Vendors',
    icon: <Package weight='duotone' size={24} />,
    links: [
      { href: '/vendors/info', label: 'Info' },
      { href: '/vendors/orders', label: 'Orders' },
      { href: '/vendors/billing', label: 'Billing' },
    ],
  },
  {
    title: 'Vouchers',
    icon: <Ticket weight='duotone' size={24} className='mr-3 -ml-2' />,
    href: '/vouchers',
  },
  {
    title: 'Reports',
    icon: <File weight='duotone' size={24} className='mr-3 -ml-2' />,
    href: '/reports',
  },
  {
    title: 'Assets',
    icon: <Devices weight='duotone' size={24} className='mr-3 -ml-2' />,
    href: '/assets',
  },
  {
    title: 'Stamp Papers',
    icon: <Stamp weight='duotone' size={24} className='mr-3 -ml-2' />,
    href: '/stamp-papers',
  },
]);

export default function SideNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.auth.user);
  const pathname = usePathname();

  const isActive = useCallback(
    (href) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.includes(href);
    },
    [pathname]
  );

  return (
    <div className='justify-between h-screen'>
      <div>
        <img src='/assets/lessor-dashboard-logo.svg' alt='Logo' />
        <Divider className='my-5 bg-grey' />
        <div className='-ml-3 flex flex-col justify-between'>
          <div className='flex flex-col gap-1'>
            {menuItems.map((item, index) => (
              <div key={index} className='flex flex-col'>
                {item.links ? (
                  <>
                    <div className='flex text-primary-dark gap-3 items-center px-4 py-2 body-xsmall'>
                      {item.icon}
                      {item.title}
                    </div>
                    <div className='pl-9 flex flex-col gap-1 body-xsmall'>
                      {item.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className={
                            isActive(link.href)
                              ? 'navbar-item-active'
                              : 'navbar-item'
                          }
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={
                      isActive(item.href)
                        ? 'flex items-center navbar-item-active gap-1 body-xsmall ml-1'
                        : 'flex items-center navbar-item gap-1 body-xsmall ml-1'
                    }
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex py-4 items-center fixed bottom-4'>
        <Avatar
          radius='lg'
          name={user?.first_name[0]}
          className='mr-2 bg-primary-main text-white w-8 h-8'
        />
        {user?.first_name} {user?.last_name}
        <div
          className='ml-4 p-2 hover:rounded-md hover:bg-black hover:bg-opacity-5 cursor-pointer'
          onClick={() => onOpen()}
        >
          <SignOut className='text-primary-dark' size={20} weight='bold' />
        </div>
        <LogoutModal isOpen={isOpen} onOpenChange={onOpen} onClose={onClose} />
      </div>
    </div>
  );
}
