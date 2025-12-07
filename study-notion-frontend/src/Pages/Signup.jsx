import React from "react";
import Tempelate from "../ComponentsOne/Tempelate";
import SignupHero from "../assets/auth-signup-hero.png";

export default function Signup({ setIsLoggedIn }) {
  return (
    <Tempelate
      title="Create your free account"
      desc1="Set up your study workspace in under a minute."
      desc2="Perfect for students preparing for exams or interviews."
      image={SignupHero} // 👈 yahan new signup hero image
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}
