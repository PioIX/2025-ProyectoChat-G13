import { useEffect, useState } from "react";
import Imagen from "@/components/Imagen"
import styles from "./Contacto.module.css"

export default function Contacto({ onSelectContact = () => {} }) {
    const [contactos, setContactos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4006/bringContacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: sessionStorage.getItem("userId") })
        })
            .then(response => response.json())
            .then(contact => {
                setContactos(contact)
            })
    }, [])


    function handleClick(contacto) {
        console.log("Contacto clickeado:", contacto)
        onSelectContact(contacto) 
    }

    return (
        <div className={styles.contactList}>
            {contactos.length != 0 && contactos.map((contacto) => {
                return(
                    
                    <div 
                        key={contacto.id_chat} 
                        className={styles.contactItem} 
                        onClick={() => handleClick(contacto)}>

                        


                            <Imagen 
                                src={contacto.grupo == false ? contacto.foto: contacto.foto_perfil}
                                alt={"Foto de: " + (contacto.grupo ? contacto.nom_grupo : contacto.nombre)}
                                className={styles.contactImg}
                            />  
                            <span className={styles.contactName}>
                                {contacto.grupo ? contacto.nom_grupo : contacto.nombre}
                            </span>
                    </div>
                );  
            })}
        </div>
    )
} 