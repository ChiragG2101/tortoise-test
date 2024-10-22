/* eslint-disable @next/next/no-img-element */
'use client';

import { Avatar, Divider, useDisclosure } from '@nextui-org/react';
import {
  Bag,
  ChartLine,
  Devices,
  Lifebuoy,
  Notepad,
  SignOut,
  UsersThree,
  File,
} from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import LogoutModal from '../auth/LogoutModal';

const menuItems = Object.freeze([
  {
    title: 'Overview',
    icon: <ChartLine size={24} weight='duotone' />,
    href: '/overview',
    disabled: true,
  },
  {
    title: 'Orders',
    icon: <Bag size={24} weight='duotone' />,
    href: '/orders',
  },
  {
    title: 'Customers',
    icon: <UsersThree size={24} weight='duotone' />,
    href: '/customers',
    disabled: true,
  },
  {
    title: 'Devices',
    icon: <Devices size={24} weight='duotone' />,
    links: [
      {
        href: '/devices/available-devices',
        label: 'Available devices',
      },
      {
        href: '/devices/pricing-channels',
        label: 'Pricing channels',
      },
    ],
  },
  {
    title: 'Billing',
    icon: <Notepad size={24} weight='duotone' />,
    href: '/billing',
  },
  {
    title: 'Reports',
    icon: <File weight='duotone' size={24} />,
    href: '/reports',
  },
  {
    title: 'Support',
    icon: <Lifebuoy size={24} weight='duotone' />,
    href: '/support',
    disabled: true,
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
    <div className='flex flex-col justify-between h-screen'>
      <div>
        <img src='/assets/seller-dashboard-logo.svg' alt='Logo' />
        <Divider className='my-5 bg-grey' />
        <div className='-ml-3 flex flex-col justify-between'>
          <div className='flex flex-col gap-2'>
            {menuItems.map((item, index) => (
              <div key={index} className='flex flex-col'>
                {item.links ? (
                  <>
                    <div className='flex text-primary-dark gap-3 items-center px-4 py-2 body-xsmall'>
                      {item.icon}
                      {item.title}
                    </div>
                    <div className='pl-9 flex flex-col gap-1 body-xsmall py-1'>
                      {item.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className={
                            isActive(link.href)
                              ? 'navbar-item-active'
                              : 'navbar-item'
                          }
                          style={{
                            pointerEvents: link.disabled ? 'none' : '',
                          }}
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
                        ? 'flex items-center navbar-item-active gap-3 body-xsmall'
                        : 'flex items-center navbar-item gap-3 body-xsmall'
                    }
                    style={{
                      pointerEvents: item.disabled ? 'none' : '',
                    }}
                  >
                    {item.disabled ? (
                      <>
                        {item.icon}
                        {item.title}
                        <span className='text-[0.6rem] font-bold mb-1 -ml-2'>
                          {' '}
                          Coming soon
                        </span>
                      </>
                    ) : (
                      <>
                        {item.icon}
                        {item.title}
                      </>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between pl-2'>
        <div className='flex items-center'>
          <Avatar
            radius='lg'
            name={user?.first_name[0]}
            className='mr-2 bg-primary-main text-white w-8 h-8'
          />
          {user?.first_name} {user?.last_name}
        </div>
        <div
          className='pr-10 hover:rounded-md hover:bg-black hover:bg-opacity-5 cursor-pointer'
          onClick={() => onOpen()}
        >
          <SignOut className='text-primary-dark' size={20} weight='bold' />
        </div>
      </div>
      <LogoutModal isOpen={isOpen} onOpenChange={onOpen} onClose={onClose} />
    </div>
  );
}
