import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

export type UserRole = "admin" | "utente";

type Ctx = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const UserRoleContext = createContext<Ctx | undefined>(undefined);

export function UserRoleProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("userRole")) as UserRole | null;
    return stored === "admin" || stored === "utente" ? stored : "utente";
  });

  useEffect(() => {
    try {
      localStorage.setItem("userRole", role);
    } catch {}
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const ctx = useContext(UserRoleContext);
  if (!ctx)
    throw new Error("useUserRole must be used within a UserRoleProvider");
  return ctx;
}
