import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { X, Loader2 } from 'lucide-react';

const InviteModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const { sendInvite, isSendingInvite } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    const success = await sendInvite(username);
    if (success) {
      setUsername('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 rounded-lg max-w-md w-full shadow-xl animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="text-lg font-medium">Invite User</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter username to invite"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSendingInvite}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter the exact username of the person you want to invite
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSendingInvite}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!username.trim() || isSendingInvite}
            >
              {isSendingInvite ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;