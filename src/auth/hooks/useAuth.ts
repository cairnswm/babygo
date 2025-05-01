import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import type { User } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthenticationContext);

  const user = context?.user as User | null;

  let isAdmin = false;
  if (user?.permissions) {
    isAdmin = user?.permissions.find(
      (a) => a.name === "Admin" && a.permission === "YES"
    )
      ? true
      : false;
  }

  const displayName = user?.username 
    ? user.username 
    : user?.firstname && user?.lastname 
    ? `${user.firstname} ${user.lastname}` 
    : user?.id 
    ? `User${user.id}` 
    : "Unknown";

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthenticationProvider");
  }
  return { ...context, isAdmin: isAdmin ? true : false, displayName };
};

export type { User };
