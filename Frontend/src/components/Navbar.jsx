import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { MessageSquare, Settings, User, LogOut , BellRing, UserPlus} from "lucide-react";
import InviteModal from "./InviteModal";



const Navbar = () =>{

    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const {authUser, logout , receivedInvites = []} = useAuthStore();
     // Count pending received invites
  const pendingInvitesCount = receivedInvites.filter(invite => 
    invite.status === 'pending'
  ).length;



  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <button
                  onClick={() => setInviteModalOpen(true)} 
                  className="btn btn-sm btn-outline gap-2 transition-colors"
                >
                  <UserPlus className="size-5" />
                  <span className="hidden sm:inline">Invite</span>
                </button>
                
                <Link
                  to="/notifications"
                  className="btn btn-sm gap-2 transition-colors relative"
                >
                  <BellRing className="size-5" />
                  <span className="hidden sm:inline">Notifications</span>
                  {pendingInvitesCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full 
                      flex items-center justify-center text-white text-xs">
                      {pendingInvitesCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <InviteModal 
        isOpen={inviteModalOpen} 
        onClose={() => setInviteModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;