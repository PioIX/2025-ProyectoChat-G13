"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import  styles from "@/app/(routes)/chat/chat.module.css"
import Contacto from "@/components/Contacto"
import Imagen from "@/components/Imagen"
import Mensaje from "@/components/Mensaje"
import Popup from "reactjs-popup"
import { useSocket } from "@/hooks/useSocket"


export default function Chat() {

    const router = useRouter()
    const [selectedContact, setSelectedContact] = useState(null)  // 👈 contacto elegido
    const [messages, setMessages] = useState([]) // 👈 historial de mensajes
    const [newMessage,setNewMessage] = useState("")

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [mailInput, setMailInput] = useState("");
    const [contactos, setContactos] = useState([])

    const { socket, isConnected } = useSocket({withCredentials: true}, "http://localhost:4006") 
 

    // ----------------------------
    // 🔌 Conexión de sockets
    // ----------------------------

    useEffect(() => {
        if (!socket) return;

        // Recibir mensajes en tiempo real
        socket.on("newMessage", (data) => {
            setMessages((prev) => [...prev, {
                id_usuario: data.message.id_usuario || "otro",
                contenido: data.message,
                hora: new Date().toLocaleTimeString()
            }]);
        });

        // Ping de prueba
        socket.on("pingAll", (data) => {
            console.log("📢 Ping recibido:", data);
        });

        return () => {
            socket.off("newMessage");
            socket.off("pingAll");
        }
    }, [socket]);

    //Abrir el popup
    const openPopup = () => {
        setPopupOpen(true)
    }

    //Cerrar el popup
    const closePopup = () => {
        setPopupOpen(false)
        setMailInput("") //Limpia el input al cerrar el popup
    }

    useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem("isLoggedIn");
            if (isLoggedIn !== "true") {
                router.replace("./login")
            }
        } catch (error) {
            console.log(error)
        }
    }, [])


    useEffect(() => {
        fetch('http://localhost:4006/bringContacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: sessionStorage.getItem("userId") })
        })
            .then(response => response.json())
            .then(contact => {
                setContactos(contact)
                console.log(contactos)
        })
        
    }, [])


    useEffect(() => { 
        try {
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
        } catch (error) {
            console.log(error)
        }
    }, [])

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendNewMessage(); // Llamar a la función para enviar el mensaje
        }
    }

    function handleSelectContact(contact){
        setSelectedContact(contact)

        try {
            // traer historial de mensajes
            fetch("http://localhost:4006/getMessages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_chat: contact.id_chat })
            })
                .then(res => res.json())
                .then(data => setMessages(data))

                if (socket) {
                    socket.emit("joinRoom", {room: contact.id_chat})
                }
        } catch (error) {
            console.log(error)   
        }

    }


    function handleNewMessageChange(event) {
        setNewMessage(event.target.value);
    }

    function sendNewMessage(){
        try {
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
            if (socket) {
                socket.emit("sendMessage", newMessage);
            }
        } catch (error) {
            console.log(error)
        }
    }

    function newChat(){
        const userId = sessionStorage.getItem("userId")
        console.log(userId)
        try {
            // 1. compruebo que el mail sea valido
            if(!mailInput.trim()) {
                alert("Por favor, ingresa un mail")
                return
            }
            
            //2. Creo la constante de los datos del Nuevo Chat
            const datosNewChat = {
                mail: mailInput.trim(),
                nombre: "",
                id_usuarioAjeno: 0
            }

            console.log("Datos del nuevo Chat: ", datosNewChat)
    
            // 3. Realizo el fetch que busca al usuario con ese mail.
            fetch('http://localhost:4006/findUser', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({mail: datosNewChat.mail})
            })
            .then(res => res.json())
            .then(dataUser => {
                console.log("Datos del usuario: ", dataUser)
                if (dataUser.vector.length === 1) {
                    console.log("Se ha encontrado al usuario")
                    datosNewChat.nombre = dataUser.vector[0].nombre
                    datosNewChat.id_usuarioAjeno = dataUser.vector[0].id_usuario
                    console.log("COMPARO", dataUser.vector, contactos[0]) 
                    console.log(datosNewChat.id_usuarioAjeno, userId)
                    setContactos([...contactos, dataUser.vector[0]])
                    fetch('http://localhost:4006/newChat', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({id_usuarioAjeno: datosNewChat.id_usuarioAjeno, id_usuarioPropio: userId, grupo: false})
                    })
                    .then(res => res.json())
                    .then(chat => {
                        console.log(chat)
                        closePopup()
                        
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    function buscarContacto() {
        console.log("aca el usuario busca un contacto y la lista de selected contactos se actualiza en base a lo que vaya buscando el usuario")
    }
    return (
        <div className={styles.screenDevice}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.titleChats}>Chats</h1>
                    <div className={styles.herramientasUser}>
                        <Input type="text" placeholder="Buscar..." use="buscarContacto" onChange={buscarContacto}/>
                        <Button use="nuevoChat" text="Nuevo Chat" onClick={openPopup}/>
                    </div>
                </div>
                <Contacto onSelectContact={handleSelectContact} contactos={contactos}/>
            </div>
            <div className={styles.chatDevice}>
                {selectedContact ? (
                    <>
                        <div className={styles.headerChat}>
                            <div className={styles.avatar}>
                                <Imagen
                                    src={selectedContact.grupo == false ? selectedContact.foto_perfil : selectedContact.foto}
                                    alt={"Foto de: " + (selectedContact.grupo ? selectedContact.nom_grupo : selectedContact.nombre)}
                                    where="perfil"
                                />
                            </div>
                            <div className={styles.contactInfo}>
                                <span>{selectedContact.grupo ? selectedContact.nom_grupo : selectedContact.nombre}</span>
                                {/* <span className="online-status">Status online- en desarrollo - </span>  lo oculto porque aun no esta desarrollado al 100%*/}
                            </div>
                        </div>

                        {/* HISTORIAL */}
                        <div className={styles.historial}>
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
                        <div className={styles.userInterface}>
                            <Input value={newMessage} type="text" placeholder="Escribe un mensaje..." onChange={handleNewMessageChange} onKeyDown={handleKeyDown} use="EscribirMensaje" />
                            <Button text="Enviar" onClick={sendNewMessage} use="mandarMensaje"/>
                        </div>
                    </>
                    ) : (
                    <div className={styles.noChat}>
                        <h3>Selecciona un chat para comenzar</h3>
                        <p>Selecciona un contacto para empezar a chatear</p>
                    </div>
                )}
            </div>

            <Popup
                open={isPopupOpen}
                onClose={closePopup}
                modal
                nested
                closeOnDocumentClick={false}
                >
                    <div className={styles.modal}>
                        <div className={styles.header}>
                            <h2>Nuevo Chat</h2>
                        </div>
                        <div className={styles.content}>
                            <p>Ingresa el mail del usuario con quien quieres chatear</p>
                            <Input type="mail" placeholder="ejemplo@mail.com" value={mailInput} onChange={(e) =>setMailInput(e.target.value)} use="mailNewChat"/>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={closePopup} className={styles.cancelBtn}>Cancelar</button>
                            <button onClick={newChat} className={styles.createBtn}>Crear chat</button>
                        </div>
                    </div>
            </Popup>
        </div>

        
    )
}