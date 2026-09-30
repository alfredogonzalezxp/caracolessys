"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import MainDashboard from "@/app/dashboard/dashboard"; // <- ajusta el nombre si es distinto

const DashboardPage = () => {

  /*
The line const { isAuthenticated, loading } = useAuth(); 
uses a JavaScript feature called Object Destructuring.

Here is how it extracts those values, step-by-step:
1. 
useAuth()
 returns an Object
In your 
AuthContext.tsx
 file (line 158), the 
useAuth
 function returns the context object. This object was 
 created earlier (line 103) and looks like this:

typescript
const value = { isAuthenticated, loading, login, logout };
So essentially, 
useAuth()
 gives you back this whole box:

javascript
{
  isAuthenticated: true,  // or false
  loading: false,         // or true
  login: (token) => { ... },
  logout: () => { ... }
}    

You are telling JavaScript:

"I know 
useAuth()
 returns a big object. I don't want the whole thing. I only 
 want to pick out the isAuthenticated and loading 
 properties from inside it and turn them into standalone 
 variables."

It is a shortcut for writing this:

typescript
const authObj = useAuth();
const isAuthenticated = authObj.isAuthenticated;
const loading = authObj.loading;

these variables isAuthenticated, loading
are using in all the project because they are part 
of authContext.tsx

<AuthProvider>
   {children}   <-- All your pages/components live here }
</AuthProvider>
*/
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  /*
  useRouter(): This Next.js hook gives access to the router 
  object, allowing you to programmatically navigate (redirect) 
  users.
  
This effect runs whenever loading or isAuthenticated 
changes.
Logic: If the auth check is finished (!loading) AND the 
user is NOT authenticated (!isAuthenticated), they are 
immediately kicked back to the home page (router.push("/")).
*/

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/");
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto pt-32 px-8 pb-8">
      <MainDashboard />
    </div>
  );
};

export default DashboardPage;