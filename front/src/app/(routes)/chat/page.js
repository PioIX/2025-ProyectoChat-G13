"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Chat() {

    const router = useRouter()

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
            router.replace("./login")
        }
    }, [])

    return (
        <div className="screen-device">
            <h1>Bienvenido al chat</h1>
        </div>
    )
}