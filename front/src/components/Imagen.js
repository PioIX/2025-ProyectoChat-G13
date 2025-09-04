export default function Imagen(props){
    return(
        <img src={props.src} alt={props.alt} className={props.className}/>
    )
}