import { createContext, useContext, useCallback, type ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import type { AuthUser } from "../types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//convention : sert à définir et typer précisément les props que doit recevoir le composant <AuthProvider> (ici, uniquement son children)
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useLocalStorage<string | null>("auth_token", null);
  const [user, setUser] = useLocalStorage<AuthUser | null>("auth_user", null);
  const isAuthenticated = token !== null && token !== "";

  const login = useCallback( 
    (newToken: string, newUser: AuthUser) => {
      setToken(newToken);
      setUser(newUser);
      console.log("Connexion réussie pour:", newUser.emailAddress);
    },
    //regle pour eslint pour ne pas etre obligé de mettre des choses dans le tableau
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    console.log("Déconnexion effectuée");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = useCallback(
    (updatedUser: AuthUser) => {
      setUser(updatedUser);
      console.log("Profil mis à jour:", updatedUser.emailAddress);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth() doit être utilisé à l'intérieur d'un <AuthProvider>",
    );
  }

  return context;
};
