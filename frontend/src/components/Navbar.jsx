import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 w-96 group focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
        <Search size={18} className="text-gray-500 group-focus-within:text-primary" />
        <input 
          type="text" 
          placeholder="Search memories..." 
          className="bg-transparent border-none outline-none text-white placeholder:text-gray-500 w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <div className="h-8 w-[1px] bg-white/10"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
            <User size={20} className="text-white" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Premium User</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Pro Plan</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
