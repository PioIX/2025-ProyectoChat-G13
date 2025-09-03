"use client"

import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

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
            <h1>Bienvenido al chat</h1>
        </div>
    )
}