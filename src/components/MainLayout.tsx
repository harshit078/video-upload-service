
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from '@/components/Navbar';
import MainSidebar from '@/components/MainSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
