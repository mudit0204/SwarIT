import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, User, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';

interface DashboardNavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onDatabaseClick: () => void;
  isConnected: boolean;
}

export function DashboardNavbar({ 
  searchValue, 
  onSearchChange, 
  onDatabaseClick,
  isConnected 
}: DashboardNavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Database className={`h-5 w-5 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
            <h1 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Complaint Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-9"
            />
          </div>

          {/* Database Connection Button 
          <Button
            variant={isConnected ? "secondary" : "destructive"}
            size="sm"
            onClick={onDatabaseClick}
            className="hidden sm:flex"
          >
            <Database className="mr-2 h-4 w-4" />
            {isConnected ? 'Connected' : 'Connect DB'}
          </Button>*/}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.png" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Dashboard User</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    admin@dashboard.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuItem className="sm:hidden" onClick={onDatabaseClick}>
                <Database className="mr-2 h-4 w-4" />
                {isConnected ? 'DB Connected' : 'Connect DB'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}