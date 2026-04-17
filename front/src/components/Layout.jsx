import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {

  const location = useLocation();

  const hideFooterRoutes = [
    // '/profile',
    // '/orders',
    // '/addresses',
    // '/payments'
  ];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-black" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}
