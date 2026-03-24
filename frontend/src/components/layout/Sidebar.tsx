import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, DollarSign, LayoutDashboard, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Items', path: '/items', icon: Package },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
    { name: 'Sales', path: '/sales', icon: DollarSign },
  ];

  return (
    <motion.div 
      initial={{ x: -200 }} 
      animate={{ x: 0 }} 
      className="w-64 bg-card border-r border-border glass hidden md:flex flex-col h-full z-20"
    >
      <div className="p-6 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-foreground leading-tight text-center">
          Aura<br/>
          <span className="text-sm font-black text-primary tracking-widest uppercase">Brightness</span>
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon size={20} />
              <span className="font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
