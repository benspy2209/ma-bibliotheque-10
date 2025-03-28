
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

interface UserMenuProps {
  user: User;
  signOut: () => void;
  getUserDisplayName: () => string;
  getInitials: () => string;
}

export const UserMenu = ({ user, signOut, getUserDisplayName, getInitials }: UserMenuProps) => {
  const displayName = getUserDisplayName();
  const initials = getInitials();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline-block">
        {displayName}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9 border-2 border-primary transition-colors">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 z-50 mt-1">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile/settings?tab=profile" className="cursor-pointer flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile/settings?tab=display" className="cursor-pointer flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
