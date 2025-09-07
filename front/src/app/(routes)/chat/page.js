"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import  "./chat.styles.css"
import Contacto from "@/components/Contacto"
import Imagen from "@/components/Imagen"
import Mensaje from "@/components/Mensaje"

export default function Chat() {

    const router = useRouter()
    const [selectedContact, setSelectedContact] = useState(null)  // 👈 contacto elegido
    const [messages, setMessages] = useState([]) // 👈 historial de mensajes


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


    function handleSelectContact(contact){
        setSelectedContact(contact)

        // traer historial de mensajes
        fetch("http://localhost:4006/getMessages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_chat: contact.id_chat })
        })
            .then(res => res.json())
            .then(data => setMessages(data))
    }

    return (
        <div className="screen-device">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="title-chats">Chats</h1>
                    <div className="herramientas-user">
                        <Input type="text" placeholder="Buscar..." />
                        <Button className="new-chat" text="+"/>
                    </div>
                </div>
                <Contacto onSelectContact={handleSelectContact}/>
            </div>
            <div className="chat-device">
                {selectedContact ? (
                    <>
                        <div className="header-chat">
                            <div className="avatar">
                                <Imagen
                                    src={selectedContact.grupo ? selectedContact.foto : selectedContact.foto_perfil}
                                    alt={"Foto de: " + (selectedContact.grupo ? selectedContact.nom_grupo : selectedContact.nombre)}
                                />
                            </div>
                            <div className="contact-info">
                                <span>{selectedContact.grupo ? selectedContact.nom_grupo : selectedContact.nombre}</span>
                                {/* <span className="online-status">Status online- en desarrollo - </span>  lo oculto porque aun no esta desarrollado al 100%*/}
                            </div>
                        </div>

                        {/* HISTORIAL */}
                        <div className="historial">
                            {messages.map((msg, i) => (
                                <Mensaje
                                    key={i}
                                    contenido={msg.contenido}
                                    hora={msg.hora}
                                    esEnviado={String(msg.id_usuario) === String(sessionStorage.getItem("userId"))}
                                />
                            ))}
                        </div>

                        {/* INTERFAZ DE MENSAJE */}
                        <div className="user-interface">
                            <Input type="text" placeholder="Escribe un mensaje..." />
                            <Button className="send-message" text="Enviar"/>
                        </div>
                    </>
                    ) : (
                    <div className="no-chat">
                        <p>Selecciona un contacto para empezar a chatear</p>
                    </div>
                )}
            </div>
        </div>
    )
}