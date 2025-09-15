"use client"

import styles from "@/app/(auth)/register/register.module.css"
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {

    const [nombre, SetNombre] = useState("")
    const [apellido, SetApellido] = useState("")
    const [contraseña, SetContraseña] = useState("")
    const [confirmContraseña, setConfirmContraseña] = useState("")
    const [description, SetDescription] = useState("")
    const [correo, SetCorreo] = useState("")
    const [fotoPerfil, SetFotoPerfil] = useState(null)
    const [usuario, setUsuario] = useState([])

    const router = useRouter()
    
    useEffect(() => {
        if (usuario.existe == false) {
            SignUp()
        }
    }, [usuario])

    function saveName(event) {
        SetNombre(event.target.value)
    }
    function saveLastName(event) {
        SetApellido(event.target.value)
    }
    function savePassowrd(event) {
        SetContraseña(event.target.value)
    }
    function savePassowrdSecure(event) {
        setConfirmContraseña(event.target.value)
    }
    function saveDescription(event) {
        SetDescription(event.target.value)
    }
    function saveMail(event) {
        SetCorreo(event.target.value)
    }
    function saveImage(event) {
        SetFotoPerfil(event.target.value)
    }

    function UserExists() {
            fetch("http://localhost:4006/findUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mail: correo,
                })
            })
            .then(response => response.json())
            .then(result => {
                setUsuario(result)
            })
    }

    function SignUp() {

        const userData = {
            nombre: nombre,
            apellido: apellido,
            mail: correo,
            contraseña: contraseña,
            desc_personal: description,
            foto_perfil: fotoPerfil,
            en_linea: false
        }

        if (contraseña === confirmContraseña) {
            fetch("http://localhost:4006/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(result => {
                console.log("Usuario creado");
                sessionStorage.setItem("isLoggedIn", "true"); 
                fetch('http://localhost:4006/findUserId', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mail: correo })
                    })
                        .then(response => response.json())
                        .then(data => {
                            sessionStorage.setItem("userId", data[0].id_usuario); // guardar userId 
                            console.log("userId guardado en sessionStorage:", data[0].id_usuario);
                            router.replace("./../chat")
                        })
        })
        }
    }
            
    return (
        <div className={styles.contenedorRegister}>
            <div className={styles.registerForm}>
                <h1>Registro</h1>
                <br></br>
                <p>Complete los siguientes datos para el registro</p>

                <Input text="Nombre" placeholder="Escriba su nombre" page="register" type="text" onChange={saveName} required={true}/>
                <Input text="Apellido" placeholder="Escriba su Apellido" page="register" type="text" onChange={saveLastName} required={true}/>
                <Input text="Contraseña" placeholder="Escriba su nombre" page="register" type="password" onChange={savePassowrd} required={true}/>
                <Input text="Confirmar Contraseña" placeholder="Escriba de vuelta su contraseña" page="register" type="password" onChange={savePassowrdSecure} required={true}/>
                <Input text="Descripcion Personal" placeholder="Escriba la Descripcion Personal" page="register" type="text" onChange={saveDescription} required={true}/>
                <Input text="Correo Electronico" placeholder="Escriba su email" page="register" type="email" onChange={saveMail} required={true}/>

                <Input text="Foto de perfil (enlace público)" placeholder="Agregue su foto de perfil" page="register" type="text" onChange={saveImage} required={false}/>

                <Button onClick={UserExists} text="Sign Up" page="register"></Button>
                <Link href={"./login"} className={styles.linkRegister}>¿Ya tenes cuenta? Login </Link>
            </div>
        </div>
        
    );
}   