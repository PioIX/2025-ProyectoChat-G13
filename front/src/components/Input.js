export default function Input(props) {
    return(
        <>
            <label htmlFor={props.name}>{props.text}</label>
            <input placeholder={props.placeholder} id={props.id} className={props.className} type={props.type} onChange={props.onChange} required={props.required} onKeyDown={props.onKeyDown}></input>
        </>
    )
}