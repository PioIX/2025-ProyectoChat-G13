import styles from "@/components/Mensajes.module.css"

export default function Mensaje({ contenido, hora, esEnviado }) {
    return (
    <div className={`message ${esEnviado ? "sent" : "received"}`}>
        <p>{contenido}</p>
        <span className={styles.span}>
            {new Date(hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
        </span>
    </div>
    )
}

// aclarar fechas en la date pq devuelve mal al pasasr 24 hraas
