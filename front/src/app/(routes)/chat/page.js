"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"
import  "./chat.styles.css"

export default function Chat() {

    const router = useRouter()

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.replace("./login")
        }
    }, [])

    useEffect(() => { 
        fetch("http://localhost:4006/putOnline", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: sessionStorage.getItem("userId"),
                    en_linea: true
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log("Se ha puesto en línea");    
        })
    })

    return (
        <div className="screen-device">
            <div className="sidebar">
                {/* aca deberia ir el buscar, el nuevo chat, y esas cosas y abajo una lista de todos los contactos (otro div claramente) */}
                <div className="sidebar-header">
                    <Input type="text" placeholder="Buscar..." />
                    <Button className="new-chat" text="+"/>
                    
                </div>
                <div className="contact-list">
                    {/* componente contacto */}  aaa soy un contacto (UsuariosxChat id)
                </div>
            </div>
            <div className="chat-device">
                <div className="header-chat">
                    <div className="avatar">
                        {/* aca va componente contacto  FOTO*/}
                    </div>
                    {/* COMPONENTE NAME ACA */} NOMBRE
                </div>
                <div className="historial">
                    {/* aca va chat / historial */}
                    <div className="message-received">{ /* aca va componente mensaje */} HOLA SOY UN MENSAJE</div>
                    <div className="message-sent">{ /* aca va componente mensaje */} HOLA SOY UN MENSAJE</div>
                </div>
                <div className="user-interface">
                    {/* // aca va input de mensajes  */}
                    <Input type="text" placeholder="Escribe un mensaje..." />
                    <Button className="send-message" text="Enviar Mensaje"/>
                </div>                
            </div>
        </div>
    )
}