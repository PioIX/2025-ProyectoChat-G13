"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function Login() {

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()
  

  function SignUp() {
    console.log(user)
    console.log(password)
  }

  function SignIn() {
  }

  function savePassword(event) {
    setPassword(event.target.value)
  }
  
  function saveUser(event) {
    setUser(event.target.value)
  }

  return (
    <>
        <h1>Este va a ser el Login</h1>
        <div className="contenedor-login">
          <div className="inputs-login">
            <Input placeholder="Escriba su email" id="email" className="inputs-login" type="text" onChange={saveUser}/>
            <Input placeholder="Escriba su contraseña" id="password" className="inputs-login" type="password" onChange={savePassword}/>
            <Button text="Sign In" onClick={SignIn}></Button>
            <Button text="Sign Up" onClick={SignUp}></Button>
          </div>
        </div>
    </>
  );
}