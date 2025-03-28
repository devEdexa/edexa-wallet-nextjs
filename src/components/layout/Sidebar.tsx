'use client';

import { useAppKitNetworkCore } from '@reown/appkit/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [isNetworkActive, setIsNetworkActive] = useState(false);
  const { chainId } = useAppKitNetworkCore();

  useEffect(() => {
    setIsNetworkActive(chainId === 137);
  }, [chainId]);
  
  const pathname = usePathname();
   
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    // { name: 'Transactions', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    // { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const networkItems = [
    // { name: 'edeXa Mainnet', active: chainId === 5424 },
    { name: 'polygon', active: chainId === 137 },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
     <div 
     className={`
        bg-gray-800 border-r border-gray-700 
        ${isOpen ? 'block' : 'hidden'} 
        md:transition-none
        ${isOpen ? 'md:relative md:block' : 'md:hidden'} 
        ${isOpen ? 'fixed md:static inset-y-0 left-0 z-30 w-64 md:w-auto' : ''}
      `}
      >
       {/* Close Icon - Only visible on mobile */}
       <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">E</span>
              <h2 className="text-lg font-bold text-yellow-400">edeXa</h2>
            </div>
          </div>
          
          {/* Networks */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Networks</h3>
            <ul>
              {networkItems.map((network, index) => (
                <li key={index} className="mb-1">
                  <button 
                    className={`w-full flex items-center px-2 py-2 text-sm rounded-md ${isNetworkActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                  >
                    <span className={`mr-2 h-2 w-2 rounded-full ${isNetworkActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    {network.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Navigation */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Navigation</h3>
            <nav>
              <ul>
              {navigation.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <li key={index} className="mb-1">
                    <Link
                      href={item.path}
                      className={`flex items-center px-2 py-2 text-sm rounded-md ${
                        isActive ? 'bg-blue-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              </ul>
            </nav>
          </div>
          
          {/* Sidebar footer - wallet info */}
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white truncate">Web Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}