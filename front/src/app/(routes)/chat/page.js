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
    const [newMessage,setNewMessage] = useState("")

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

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendNewMessage(); // Llamar a la función para enviar el mensaje
        }
    }

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


    function handleNewMessageChange(event) {
        setNewMessage(event.target.value);
    }

    function sendNewMessage(){
        if (newMessage.trim() === "" || !selectedContact) return;
        
        const now = new Date();
        // Formatear la fecha y hora manualmente
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes (0-indexado, por eso +1)
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const messageData = {
            id_usuario: sessionStorage.getItem("userId"),
            id_chat: selectedContact.id_chat,
            contenido: newMessage,
            hora: formattedDate
        };

        setNewMessage(""); // Limpiar el campo de entrada inmediatamente

        // Enviar el mensaje al servidor
        fetch("http://localhost:4006/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Mensaje enviado:", data);
                // Actualizar el historial de mensajes en la interfaz
                // setMessages(prevMessages => [...prevMessages, data.info]);
            })
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
                                    src={selectedContact.grupo == false ? selectedContact.foto : selectedContact.foto_perfil}
                                    alt={"Foto de: " + (selectedContact.grupo ? selectedContact.nom_grupo : selectedContact.nombre)}
                                    className={styles}
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
                            <Input type="text" placeholder="Escribe un mensaje..." onChange={handleNewMessageChange} onKeyDown={handleKeyDown}/>
                            <Button className="send-message" text="Enviar" onClick={sendNewMessage}/>
                        </div>
                    </>
                    ) : (
                    <div className="noChat">
                        <p>Selecciona un contacto para empezar a chatear</p>
                    </div>
                )}
            </div>
        </div>
    )
}