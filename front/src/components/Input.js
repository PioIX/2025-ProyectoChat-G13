export default function Input(props) {
    return(
        <>
            <input placeholder={props.placeholder} id={props.id} className={props.className} type={props.type} onChange={props.onChange}></input>
        </>
    )
}