import { useEffect, useState } from "react";
import Imagen from "@/components/Imagen"
import styles from "./Contacto.module.css"

export default function Contacto() {
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
                console.log("Contacto guardado en contactos: ", contact);
            })
    }, [])

    return (
        <div className={styles.contactList}>
            {contactos.length != 0 && contactos.map((contacto) => {
                console.log("ASDA",contacto.id_chat, contacto.grupo, contacto.nom_grupo, contacto.foto)
                return(
                    <div key={contacto.id_chat} className={styles.contactItem} onClick={(e) => console.log(e.currentTarget)}>
                        <Imagen src={contacto.grupo ? contacto.foto : contacto.foto_perfil}
                            alt={"Foto de: " + contacto.nom_grupo}
                            className={styles.contactImg}
                    />  
                    <span className={styles.contactName}>{contacto.nom_grupo}</span>
                    </div>
                );  
            })}
        </div>
    )
} 