"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";



export default function Login() {
  let entrar = false
  const [usuarios, setUsuarios] = useState([])
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()
  
  useEffect(() => {
    fetch("http://localhost:4006/usuarios")
      .then(response => response.json())
      .then(result => {
        setUsuarios(result) 
      })
  }, [])



  useEffect(() => {
    console.log(usuarios)
  }, [usuarios])

  function SignIn() {
      for (let i=0; i < usuarios.length; i++) {
      if (usuarios[i].usuario == user) {
        if (usuarios[i].contraseña == password) {
          entrar = true
          console.log("entramos")
          // router.push("./chat")
        } 
      }

    } 
    if (entrar == false) {
      console.log("Usuario o Contraseña Incorrectos")
    }
  }

  function SignUp() {
  }

  function savePassword(event) {
    setPassword(event.target.value)
  }
  
  function saveUser(event) {
    console.log(user)
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
