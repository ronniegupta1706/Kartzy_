import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-yellow-50">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
