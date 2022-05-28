import Link from 'next/link';
import React from 'react';

export const BottomTabBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] w-full">
      <div className="w-full h-full max-w-2xl mx-auto flex relative bg-slate-900/50 backdrop-blur-md drop-shadow-2xl border-t border-t-slate-800">
        <Link href="/" passHref>
          <a className="w-[50%]">
            <button className="text-white">Dashboard</button>
          </a>
        </Link>
        <Link href="/profile" passHref>
          <a className="w-[50%]">
            <button className="text-white">Profile</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
