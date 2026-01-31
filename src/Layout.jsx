import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Plane } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-red-600/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="bg-red-600 rounded p-1.5">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white text-xl font-black tracking-tight">URBAN ESCAPES</div>
              <div className="text-red-500 text-[10px] font-bold tracking-widest">NYC × ATL</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to={createPageUrl('Home')} 
              className={`text-sm font-bold tracking-wide transition-colors uppercase ${
                currentPageName === 'Home' ? 'text-red-500' : 'text-white hover:text-red-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to={createPageUrl('Packages')} 
              className={`text-sm font-bold tracking-wide transition-colors uppercase ${
                currentPageName === 'Packages' ? 'text-red-500' : 'text-white hover:text-red-500'
              }`}
            >
              Packages
            </Link>
            <Link 
              to={createPageUrl('Events')} 
              className={`text-sm font-bold tracking-wide transition-colors uppercase ${
                currentPageName === 'Events' ? 'text-red-500' : 'text-white hover:text-red-500'
              }`}
            >
              Events
            </Link>
            <Link 
              to={createPageUrl('Gallery')} 
              className={`text-sm font-bold tracking-wide transition-colors uppercase ${
                currentPageName === 'Gallery' ? 'text-red-500' : 'text-white hover:text-red-500'
              }`}
            >
              Gallery
            </Link>
            <Link 
              to={createPageUrl('Contact')} 
              className={`text-sm font-bold tracking-wide transition-colors uppercase ${
                currentPageName === 'Contact' ? 'text-red-500' : 'text-white hover:text-red-500'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Book Now Button */}
          <Link 
            to={createPageUrl('Contact')}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded transition-all shadow-lg hover:shadow-red-600/50 uppercase tracking-wide text-sm"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}