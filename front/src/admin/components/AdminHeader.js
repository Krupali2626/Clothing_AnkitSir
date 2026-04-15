import React from 'react';
import { FiSearch, FiBell, FiUser, FiMaximize, FiGlobe, FiSun } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-black transition-colors">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all text-sm h-11"
            placeholder="Search dashboard, orders, or categories..."
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link 
          to="/" 
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
        >
          <FiGlobe size={16} />
          Switch to User
        </Link>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <FiMaximize size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors relative">
            <FiBell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-black border-2 border-white rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <FiUser size={18} className="text-slate-400 mr-1" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
