"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Register() {

    const [nombre, SetNombre] = useState("")
    const [apellido, SetApellido] = useState("")
    const [contraseña, SetContraseña] = useState("")
    const [confirmContraseña, setConfirmContraseña] = useState("")
    const [description, SetDescription] = useState("")
    const [correo, SetCorreo] = useState("")

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

    function look() {
        console.log(nombre, apellido, confirmContraseña, contraseña, correo, description)
    }

    function UserExists(correo) {
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
                console.log(result);
                console.log(result.length)
                return result.length > 0
            })
        }   

    async function SignUp() {
        if (contraseña === confirmContraseña) {
            let existe = UserExists(correo)
            if (existe == true) {
                console.log("usuario existe")
            } else {
                console.log("Usuario no existe")
                //     fetch("http://localhost:4006/register", {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json"
                //         },
                //         body: JSON.stringify({
                //             nombre: nombre,
                //             apellido: apellido,
                //             mail: correo,
                //             contraseña: contraseña,
                //             desc_personal: description,
                //             foto_perfil: null,
                //             en_linea: false
                //         })
                //     })
                // .then(response => response.json())
                // .then(result => {
                //     console.log("Usuario creado");
                // })
                }
            }
            
            
        } 

    return (
        <div>
            <h1>Registro</h1>
            <br></br>
            <p>Complete los siguientes datos para el registro</p>

            <Input text="Nombre" placeholder="Escriba su nombre" className="register-inputs" type="text" onChange={saveName} required={true}/>
            <Input text="Apellido" placeholder="Escriba su Apellido" className="register-inputs" type="text" onChange={saveLastName} required={true}/>
            <Input text="Contraseña" placeholder="Escriba su nombre" className="register-inputs" type="password" onChange={savePassowrd} required={true}/>
            <Input text="Confirmar Contraseña" placeholder="Escriba de vuelta su contraseña" className="register-inputs" type="password" onChange={savePassowrdSecure} required={true}/>
            <Input text="Descripcion Personal" placeholder="Escriba la Descripcion Personal" className="register-inputs" type="text" onChange={saveDescription} required={true}/>
            <Input text="Correo Electronico" placeholder="Escriba su email" className="register-inputs" type="email" onChange={saveMail} required={true}/>

            <Button onClick={SignUp} text="Sign Up"></Button>
            <Button onClick={look} text="LOOK"></Button>
        </div>
    ) 
}