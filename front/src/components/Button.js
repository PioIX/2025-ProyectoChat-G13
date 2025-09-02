import styles from "@/components/Button.module.css"
import clsx from "clsx";


export default function Button(props) {
    return (
        <>
            <button className={
                clsx(
                    {
                        [styles.buttonhome] : props.className == "buttonhome", 
                    }
                )
            } onClick={props.onClick}>{props.text}</button>
        </>
    );
}
