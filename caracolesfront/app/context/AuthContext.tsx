"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * THE DATA CONTRACT (AuthContextType)
 * 
 * This interface defines EXACTLY what information and what powers (methods) 
 * will be shared with the rest of the application.
 */
interface AuthContextType {
  isAuthenticated: boolean; // Is the user logged in?
  role: string | null;      // What type of user are they (Admin, User)?
  loading: boolean;         // Are we still checking their session?
  login: (token: string) => void;
  logout: () => void;
}

/**
 * THE DATA BUCKET (AuthContext)
 * 
 * This creates the React Context. Think of it as an empty bucket that 
 * will eventually hold the authentication data for the entire app.
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);
/*
So all the elements that are in the interface is the used for the 
entire application but other features like useeffect  dont.
So in authprovider are the elements of the inferface that have 
relation with the all the application and the internal features 
like usereffect and maybe other kindof internal features and hooks.
*/

/**
 * THE STATE HEADQUARTERS (AuthProvider)
 * 
 * This component "guards" the entire application by managing the logged-in 
 * status and providing it to all its children (all routes in layout.tsx).
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // THE REACTIVE DATA: These states change over time and update the screen.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * INITIALIZATION: This runs EXACTLY ONCE when the app first loads.
   * It checks "localStorage" (the browser's memory) to see if the user 
   * was already logged in before they refreshed the page.
   */
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);
        const decodedRole = getRoleFromToken(token);
        setRole(decodedRole);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
      // Once we check (success or fail), we stop showing the loader.
      setLoading(false);
    }
  }, []);

  /**
   * THE DECODER (getRoleFromToken)
   * 
   * A JWT token is just a encoded piece of text. This function splits 
   * the token to find the "Payload" (the middle part) and decodes it 
   * from Base64 to a JSON object so we can read the user's role.
   */
  const getRoleFromToken = (token: string): string | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return payload.role || null;
    } catch {
      return null;
    }
  };

  /**
   * LOGIN (The Controller)
   * 
   * When the user submits the LoginForm, we call this to:
   * 1. Save their token in the browser's memory (localStorage).
   * 2. Update the "isAuthenticated" state so the screen refreshes.
   * 3. Decode their role so we know what they can access.
   */
  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    const decodedRole = getRoleFromToken(token);
    setRole(decodedRole);
  };

  /**
   * LOGOUT (The Reset)
   * 
   * Clears everything: removes the token from the browser and resets 
   * the state so the user is directed back to the Login page.
   */
  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setRole(null);
  };

  /**
   * THE PACKAGE (value)
   * 
   * We bundle all the variables and functions into ONE single object 
   * to broadcast it through the context.
   * so. This value variable serves to feed the   
   * authcontext.provider so this values declarations 
   * are sending to the ayout in children for ewvery 
   * page that is called

   */

  const value = { isAuthenticated, role, loading, login, logout };

  /**
   * THE BROADCAST (Provider)
   * 
   * This is like a building-wide loudspeaker. It sends the "value" object 
   * to every component (children) nested inside it.
   */
  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
};

/**
 * THE HANDSHAKE (useAuth)
 * 
 * This custom Hook is used by OTHER components (like your pages) to 
 * "listen" to the authentication state and use the login/logout powers.
 */
/*
const context = useContext(AuthContext);
return context 
this tells that the all  the things 
putting in authcontext can be accesed trought 
useAuth. Isnt?
Yes, exactly
*/
//so throught useAuth this variables in values are used?

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // Safety check: Throw an error if a developer tries to use this 
  // outside of the AuthProvider.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};