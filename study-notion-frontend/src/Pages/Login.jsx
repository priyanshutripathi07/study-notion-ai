import React from "react";
import Tempelate from "../ComponentsOne/Tempelate";
import LoginHero from "../assets/auth-login-hero.png";

export default function Login({ setIsLoggedIn }) {
  return (
    <Tempelate
      title="Welcome back"
      desc1="Log in to continue your study journey."
      desc2="Ask doubts, generate quizzes and track notes in one place."
      image={LoginHero}        // 👈 yahan new login hero image
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}
