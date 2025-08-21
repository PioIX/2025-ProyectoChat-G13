

export default function Button(props) {
    return (
        <>
            <button text={props.text} onClick={props.onClick}></button>
        </>
    );
}
