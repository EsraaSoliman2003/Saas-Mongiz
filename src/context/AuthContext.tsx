"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  emailConfirmed: boolean;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  setEmailConfirmed: (emailConfirm: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  emailConfirmed: false,
  role: null,
  setToken: () => { },
  setRole: () => { },
  setEmailConfirmed: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
  initialToken,
  initialRole,
  initialEmailConfirmed,
}: {
  children: React.ReactNode;
  initialToken: string | null;
  initialRole: string | null;
  initialEmailConfirmed: boolean;
}) => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [role, setRole] = useState<string | null>(initialRole);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(initialEmailConfirmed);

  return (
    <AuthContext.Provider value={{ token, role, emailConfirmed, setToken, setRole, setEmailConfirmed }}>
      {children}
    </AuthContext.Provider>
  );
};
