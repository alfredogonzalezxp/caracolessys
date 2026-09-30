"use client";

import React, { useState, useEffect } from 'react';
import { signup, getAllUsers, deleteUser, updateUser } from '@/api/api';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
}
/*
The Variable (const ManageUsers =)
What it does: Creates a constant named 
ManageUsers
.
Context: This will be the name of your tag, e.g., 
<ManageUsers />

The Input Extraction (
({ onClose })
)
What it does (Destructuring): It looks at the "Props Object" 
(the data passed to this component) and immediately pulls out 
the onClose property so you can use it.
Without this: You would have to write props and then use 
props.onClose everywhere. This is a shortcut

The Rules (: { onClose: () => void })
What it does (TypeScript): This part DOES NOT RUN. It is just 
a label for the code editor to check for errors.
It says: "Whoever uses this component MUST pass an object 
with a property named onClose. That property MUST be a 
function that takes 0 arguments and returns nothing."
Why use it? If you try to write <ManageUsers /> without 
passing the function, the editor will underline it in red 
before you even run the code.
 The Function Body (=> {)

What it does: This is the standard "Arrow" that starts the 
actual code of the function.

summary
so thiis const ManageUsers = ({ onClose }: { onClose: () 
=> void }) => {

tell me that when ManageUsers is used it will 
have onClose value like 

<ManageUsers onClose={handleClose} />
*/
const ManageUsers = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  /*
  Handle Input Change summary:
  WHAT IT DOES:
  - ...formData: Copies all existing values from state so we don't lose other fields.
  - [e.target.name]: Evaluates the 'name' attribute of the input to use as the object key.
  - e.target.value: The new value the user just typed.

  WHY WE USE IT:
  - In React, forms use "Controlled Components". We must update React state (formData) 
    on every keystroke (onChange) so the input reflects the new value.
  - Using ...formData prevents React from deleting the other fields (like username, password) 
    when we only update one field (like email). This lets us use a single function 
    for the entire form!
    is a react that use nextjs to manahe the information on the inputs i mean the form input.
  */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchUsers = async () => {
    setIsFetching(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to fetch users", error);
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        setMessage('Error: Unauthorized. Please log in again.');
      } else {
        setMessage('Error: Failed to load users.');
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Submit Handler (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!editingId && formData.password !== formData.confirm_password) {
        throw new Error('Passwords do not match');
      }

      if (editingId) {
        // Update
        const updateData = {
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {})
        };
        await updateUser(editingId, updateData);
        setMessage(`Snail user updated successfully!`);
      } else {
        // Register
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password
        });
        setMessage(`New snail user registered successfully!`);
      }

      // Reset Form
      setFormData({ name: '', email: '', password: '', confirm_password: '' });
      setEditingId(null);
      fetchUsers();

    } catch (error) {
      console.error(error);
      setMessage(editingId ? 'Error updating user.' : 'Error registering user.');
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };


  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirm_password: ''
    });
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', confirm_password: '' });
    setMessage('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setMessage('User deleted successfully.');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error(error);
        setMessage('Error deleting user.');
      }
    }
  };

  /*
  Use the Button called Cancel Edit ONLY IF.
   {editingId && (
         <button
         type="button"
         onClick={handleCancelEdit}
         className="w-full py-2 px-4 rounded-lg text-slate-600 
         bg-slate-100 hover:bg-slate-200 font-medium transition-all"
       >
         Cancel Edit
       </button>
     )}
  
  
                     
  */

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">

        {/* Header */}
        <div className="px-8 py-6 border-b border-amber-100 flex justify-between items-center bg-green-50 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
              🐌 Snail User Management
            </h1>
            <p className="text-sm text-green-600 mt-1">Manage all the snails in your garden</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            {/* You are using this SVG inside a Button, specifically 
            the "Close" button for your modal (popup) window.
            Professional Icon: It draws a perfectly geometrical 
            "Cross" symbol used in modern interfaces.            
            */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 sticky top-0">
                <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  {editingId ? (
                    <span role="img" aria-label="edit">📝</span>
                  ) : (
                    <span role="img" aria-label="add">🌱</span>
                  )}
                  {editingId ? 'Edit Snail' : 'Add New Snail'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-green-50/50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                      required={!editingId}
                      placeholder="Speedy Snail"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-green-50/50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                      required
                      placeholder="snail@garden.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-green-50/50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                      required={!editingId}
                      placeholder={editingId ? 'Leave blank to keep current' : '••••••••'}
                    />
                  </div>
                  {!editingId && (
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-green-50/50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-2 px-4 rounded-lg text-white font-medium shadow-md transition-all ${loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
                    >
                      {loading ? 'Processing...' : (editingId ? 'Save Snail' : 'Create Snail')}
                    </button>
                    {/*It reads like: "IF editingId exists, THEN show the hidden part."*/}
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full py-2 px-4 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  {message && (
                    <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Table Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                  <h3 className="font-semibold text-amber-900">All Snails</h3>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white border border-amber-200 text-amber-700 rounded-full">{users.length} Snails</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-amber-100 text-xs uppercase text-amber-600 font-semibold tracking-wider">
                        <th className="px-6 py-4">Snail Details</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isFetching ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                            <div className="flex justify-center items-center gap-2">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No users found. Start by adding one.</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-300">
                                  🐌
                                </div>
                                <div>
                                  <div className="font-medium text-green-900">{user.name}</div>
                                  <div className="text-sm text-green-600">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="Edit User"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete User"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;