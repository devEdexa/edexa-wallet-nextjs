'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className={`h-screen ${sidebarOpen ? 'grid grid-cols-[260px_1fr]' : 'flex'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4 flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">E</span>
                <h1 className="text-xl font-bold text-yellow-400">edeXa Wallet</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 py-4 w-full">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} edeXa. All rights reserved.
              </div>
              <div className="flex space-x-6">
                {/* <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link> */}
                <a href="https://developer.edexa.network/docs/intro/" className="text-gray-400 hover:text-white text-sm">Documentation</a>
                <a href="mailto:support@edexa.io" className="text-gray-400 hover:text-white text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}