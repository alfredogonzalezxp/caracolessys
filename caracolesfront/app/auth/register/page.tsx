import React from "react";
import LoginForm from "../LoginForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-20 bg-[url('/snail_racing_hero.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0"></div>
      <LoginForm initialIsLogin={false} />
    </div>
  );
};

export default RegisterPage;
