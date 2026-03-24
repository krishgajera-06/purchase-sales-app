
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/50 glass flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-xl font-bold text-foreground">
          Aura <span className="text-primary font-black">BRIGHTNESS</span>
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <span className="hidden md:inline-block">{user?.username} ({user?.role})</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="rounded-full">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
