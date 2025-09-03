import { useEffect } from "react";


export default function Contacto() {
    const [contactos, setContactos] = useState([]);

    // Traer contactos desde el backend
    useEffect(() => {
        fetch('http://localhost:4006/bringContacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: sessionStorage.getItem("userId")})
        })
            .then(response => response.json())
            .then(data => { 
                console.log("userId guardado en sessionStorage:", data[0].id_usuario);
            })
    })








    return (
        <div className="contact-list">
            <div className="contact"></div>
        </div>
    )
}