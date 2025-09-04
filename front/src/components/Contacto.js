import { useEffect, useState } from "react";
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
            <img src="@/front/public/vercel.svg" alt="foto"/>
            {contactos.map((contacto) => {
                console.log(contacto.id_chat, contacto.grupo, contacto.nom_grupo);
                <div key={contacto.id_chat} className={styles.contactItem}>
                    <img
                        src={contacto.grupo ? contacto.foto : contacto.foto_perfil}
                        alt={"Foto de: " + contacto.nom_grupo}
                        className={styles.contactImg}
                    />
                    <span className={styles.contactName}>{contacto.nom_grupo}</span>
                </div>
            })}
        </div>
    )
} 