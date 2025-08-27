"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";
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
        if (usuarios[i].mail == user) {
          if (usuarios[i].contraseña == password) {
            entrar = true
            console.log("entramos")
            router.push("./../chat")
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
    setUser(event.target.value)

  }

  return (
    <>
        <h1>Este va a ser el Login</h1>
        <div className="contenedor-login">
          <div className="inputs-login">
            <Input placeholder="Escriba su email" id="email" className="inputs-login" type="email" onChange={saveUser} name="mail" text="Correo electrónico"/>
            <Input placeholder="Escriba su contraseña" id="password" className="inputs-login" type="password" onChange={savePassword} name="contraseña" text="Contraseña"/>
            <Button text="Sign In" onClick={SignIn}></Button>
            <h3>¿Es la primera vez que ingresas? ¡Registrate!</h3>
            <Link href="./register">Registrarse</Link>
          </div>
        </div>
    </>
  );
}
