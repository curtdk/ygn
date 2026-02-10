import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Film, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      id: 'home',
      label: '首页',
      icon: Home,
      path: '/home'
    },
    {
      id: 'memories',
      label: '我的回忆',
      icon: Film,
      path: '/memories'
    },
    {
      id: 'settings',
      label: '设置',
      icon: Settings,
      path: '/settings'
    }
  ];
  
  const currentPath = location.pathname;
  console.log('BottomNavigation rendered, current path:', currentPath);
  
  return (
    <div data-cmp="BottomNavigation" className="bottom-navigation bg-card/95 backdrop-blur-md border-t border-border">
      <div className="mobile-container">
        <div className="flex items-center justify-around py-3 px-4">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  console.log('Bottom nav clicked:', item.label, item.path);
                  navigate(item.path);
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 transition-all rounded-lg ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <IconComponent 
                  className={`w-6 h-6 mb-1 transition-all ${
                    isActive ? 'scale-110' : ''
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;