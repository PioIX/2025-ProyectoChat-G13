import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Register() {

    const [nombre, SetNombre] = useState("")
    const [apellido, SetApellido] = useState("")
    const [contraseña, SetContraseña] = useState("")
    const [description, SetDescription] = useState("")
    const [correo, SetCorreo] = useState("")

    

    function SignUp() {

    }

    return (
        <div>
            <h1>Registro</h1>
            <br></br>
            <p>Complete los siguientes datos para el registro</p>

            <Input text="Nombre"></Input>
            <Input text="Apellido"></Input>
            <Input text="Contraseña"></Input>
            <Input text="Descripción Personal"></Input>
            <Input text="Correo Electrónico"></Input>

            <Button onClick={SignUp}></Button>
        </div>
    ) 
}