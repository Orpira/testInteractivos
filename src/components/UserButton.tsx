import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";

export default function UserButton() {
  const { user, isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow transition"
      >
        {user.picture && (
          <img
            src={user.picture}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="text-sm font-semibold">{user?.name}</span>
      </button>
      <UserProfileModal
        open={open}
        setOpen={setOpen}
        user={{
          ...user,
          name: user.name ?? "",
          email: user.email ?? "",
        }}
      />
    </>
  );
}
