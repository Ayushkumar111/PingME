import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Check, X, Trash2, ArrowUpRight, UserPlus } from 'lucide-react';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const { 
    receivedInvites, 
    sentInvites, 
    getReceivedInvites, 
    getSentInvites,
    acceptInvite,
    rejectInvite,
    deleteInvite,
    isLoadingInvites
  } = useAuthStore();

  useEffect(() => {
    getReceivedInvites();
    getSentInvites();
  }, [getReceivedInvites, getSentInvites]);

  const handleAccept = async (inviteId) => {
    await acceptInvite(inviteId);
  };

  const handleReject = async (inviteId) => {
    await rejectInvite(inviteId);
  };

  const handleDelete = async (inviteId, type) => {
    await deleteInvite(inviteId, type);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning badge-sm">Pending</span>;
      case 'accepted':
        return <span className="badge badge-success badge-sm">Accepted</span>;
      case 'rejected':
        return <span className="badge badge-error badge-sm">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen pt-20 container mx-auto max-w-4xl px-4">
      <div className="bg-base-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 bg-base-300">
          <button
            className={`tab ${activeTab === 'received' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received Invites
          </button>
          <button
            className={`tab ${activeTab === 'sent' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent Invites
          </button>
        </div>

        {isLoadingInvites ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === 'received' ? (
              <>
                {receivedInvites.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <UserPlus className="size-12 mx-auto mb-4 opacity-20" />
                    <p>No received invites</p>
                  </div>
                ) : (
                  receivedInvites.map((invite) => (
                    <div
                      key={invite._id}
                      className="bg-base-100 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img
                              src={invite.sender.profilePic || "/assest.png"}
                              alt={invite.sender.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{invite.sender.fullName}</div>
                          <div className="text-sm text-base-content/60">@{invite.sender.username}</div>
                          <div className="mt-1">{getStatusBadge(invite.status)}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {invite.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(invite._id)}
                              className="btn btn-sm btn-success"
                            >
                              <Check className="size-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(invite._id)}
                              className="btn btn-sm btn-error"
                            >
                              <X className="size-4" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(invite._id, 'received')}
                          className="btn btn-sm btn-ghost"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                {sentInvites.length === 0 ? (
                  <div className="text-center py-8 text-base-content/60">
                    <ArrowUpRight className="size-12 mx-auto mb-4 opacity-20" />
                    <p>No sent invites</p>
                  </div>
                ) : (
                  sentInvites.map((invite) => (
                    <div
                      key={invite._id}
                      className="bg-base-100 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img
                              src={invite.receiver.profilePic || "/assest.png"}
                              alt={invite.receiver.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{invite.receiver.fullName}</div>
                          <div className="text-sm text-base-content/60">@{invite.receiver.username}</div>
                          <div className="mt-1">{getStatusBadge(invite.status)}</div>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => handleDelete(invite._id, 'sent')}
                          className="btn btn-sm btn-ghost"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
