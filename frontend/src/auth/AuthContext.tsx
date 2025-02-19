import  { useContext, useState } from 'preact/hooks'
import { createContext} from 'preact';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
  }


export const AuthProvider = ({children}:any) => {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true'
    })

    const login = () => {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
    }   

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('isAuthenticated')
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };