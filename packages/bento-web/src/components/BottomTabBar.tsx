import { Icon } from '@iconify/react';
import Link from 'next/link';
import React from 'react';

export const BottomTabBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] w-full">
      <div className="w-full h-full max-w-2xl mx-auto flex relative bg-slate-900/50 backdrop-blur-md drop-shadow-2xl border-t border-t-slate-800">
        <Link href="/" passHref>
          <a className="w-[50%] h-full flex flex-col justify-center items-center text-white">
            <Icon className="text-2xl" icon="ic:round-space-dashboard" />
            <button className="mt-1 text-sm font-medium">Dashboard</button>
          </a>
        </Link>
        <Link href="/profile" passHref>
          <a className="w-[50%] h-full flex flex-col justify-center items-center text-white">
            <Icon className="text-2xl" icon="carbon:user-avatar-filled" />
            <button className="mt-1 text-sm font-medium">Profile</button>
          </a>
        </Link>
        <Link href="/settings" passHref>
          <a className="w-[50%] h-full flex flex-col justify-center items-center text-white">
            <Icon className="text-2xl" icon="akar-icons:settings-horizontal" />
            <button className="mt-1 text-sm font-medium">Settings</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
