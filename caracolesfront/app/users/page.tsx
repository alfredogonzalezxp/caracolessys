"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManageUsers from '@/app/users/manage_usr';
import { useAuth } from '@/app/context/AuthContext';


// we can use this notacion function UsersPage() {
// code...
// }
//Or the delcaration below
const UsersPage = () => {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (!loading && role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [role, loading, router]);

  if (loading || role !== 'ADMIN') {
    return null; // Or a spinner/loading state
  }

  const handleClose = () => {
    router.push('/dashboard');
  };

  /*
You are passing the functionality down.
We call it Passing Props.handleClose to manage_user.tsx
  */
  return (
    <ManageUsers onClose={handleClose} />
  );
};

export default UsersPage;