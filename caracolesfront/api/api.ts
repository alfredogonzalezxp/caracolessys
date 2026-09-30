import axios from "axios";
/*
Automatic JSON Transformation: You can send a JavaScript 
object in your request, and axios will automatically convert 
it to a JSON string. When it receives a JSON response from 
the server, it automatically parses it back into a JavaScript 
object for you.
*/


const api = axios.create({
  //This is the most important configuration being set. It 
  //defines the base URL for all requests made using this 
  //api instance.

  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
});

/*
This function takes a user's email and password, sends them 
to your backend's /api/signin endpoint for authentication, 
and returns the data it gets back from the server (which will 
be the JWT token upon successful login).
*/
/*
export: This keyword makes the login function available to be 
imported and used in other files, such as your LoginForm.tsx 
component.

async: This marks the function as asynchronous. It means the 
function will perform an operation that takes time (like an 
API call) and will return a Promise. This allows you to use 
the await keyword inside it.

(credentials: { email: string; password: string })
This defines the function's single parameter, credentials.
The TypeScript type { name?: string; email: string; password: string; confirm_password?: string } 
ensures that any code calling this function provides an 
object with at least the email and password properties. This prevents common bugs by enforcing a 
strict contract.

When the backend server responds, axios wraps the entire 
response (status code, headers, etc.) in an object, which 
is stored in res.
The actual data from the response body (the JSON sent by the 
server) is located in the res.data property.
*/
export async function login(credentials: { name?: string; email: string; password: string; confirm_password?: string }) {
  const res = await api.post("/auth/login", credentials);
  return res.data;
}

/*
This function takes the user's registration data (name, email, 
password, confirm_password) and sends it to the backend's /auth/register endpoint.
It returns the created user object or response from the server.
*/
export async function signup(userData: { name: string; email: string; password: string; confirm_password?: string }) {
  const res = await api.post("/auth/register", userData);
  return res.data;
}

/*

I change token to accessToken here in apis.ts
Here is why.
Saving the Item (
AuthContext.tsx
): When you logged in, your code put the key in a box and labeled it "accessToken".
typescript
// AuthContext.tsx, Line 150
localStorage.setItem('accessToken', token);

Simple Summary: You saved it as "accessToken", so you must 
look for it as "accessToken". If the names don't match 
exactly, the computer can't find it.


*/
export async function getAllUsers() {
  const token = localStorage.getItem('accessToken');
  const res = await api.get("/users", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getUser(id: number) {
  const token = localStorage.getItem('accessToken');
  const res = await api.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteUser(id: number) {
  const token = localStorage.getItem('accessToken');
  const res = await api.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateUser(id: number, userData: { name?: string; email?: string; password?: string; confirm_password?: string }) {
  const token = localStorage.getItem('accessToken');
  const res = await api.put(`/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function depositSnailPay(paymentData: { cardNumber: string; expirationDate: string; cvv: string; fullName: string; amount: number; userId: number; payerEmail?: string }) {
  const token = localStorage.getItem('accessToken');
  const res = await api.post("/payment/deposit", paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getPaymentHistory(userId: number) {
  const token = localStorage.getItem('accessToken');
  const res = await api.get(`/payment/history/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteSnailPayTransaction(transactionId: number) {
  const token = localStorage.getItem('accessToken');
  const res = await api.delete(`/payment/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
