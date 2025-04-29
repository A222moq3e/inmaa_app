import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MenuItem } from '@/components/NavMenu';

interface DrawerState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
}

interface NavContextType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  drawer: DrawerState;
  openDrawer: (title: string, content: ReactNode) => void;
  closeDrawer: () => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState>({
    isOpen: false,
    title: '',
    content: null,
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Memoize the menu actions to prevent unnecessary re-renders
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const openDrawer = useCallback((title: string, content: ReactNode) => {
    setDrawer({
      isOpen: true,
      title,
      content,
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Memoize setMenuItems to avoid unnecessary re-renders
  const handleSetMenuItems = useCallback((items: MenuItem[]) => {
    setMenuItems(items);
  }, []);

  // Create a stable value object for the context
  const value = React.useMemo(() => ({
    isMenuOpen,
    openMenu,
    closeMenu,
    drawer,
    openDrawer,
    closeDrawer,
    menuItems,
    setMenuItems: handleSetMenuItems,
  }), [
    isMenuOpen, 
    openMenu, 
    closeMenu, 
    drawer, 
    openDrawer, 
    closeDrawer, 
    menuItems, 
    handleSetMenuItems
  ]);

  return (
    <NavContext.Provider value={value}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav(): NavContextType {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
} 