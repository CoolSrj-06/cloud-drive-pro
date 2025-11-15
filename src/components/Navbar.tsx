import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { username, isAdmin, logout } = useAuth();

  return (
    <nav className="border-b bg-card">
      <div className="flex h-16 items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <HardDrive className="h-6 w-6 text-primary" />
          <span>FileStore</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, <span className="font-medium text-foreground">{username}</span>
          </span>
          
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
