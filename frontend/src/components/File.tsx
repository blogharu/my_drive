import { Folder, FileEarmark } from 'react-bootstrap-icons';
import { Card, Button } from 'react-bootstrap';
import $ from 'jquery';
import './File.css'
import { useSelector, useDispatch } from 'react-redux';
import { addPath, increaseSelected, decreaseSelected } from '../slices/myDriveSlice';
import store from "../store";
export type FileProps = {
    name?: string,
    size?: number,
    type?: string
};

function typeToIcon(type: string, className: string = "") {
    if (type === "-") {
        return <FileEarmark className={className} />
    }
    else if (type === "d") {
        return <Folder className={className} />
    }
}


export default function File({ name = "a", size = 0, type = "-" }: FileProps) {
    const dispatch = useDispatch()
    const onDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (type === "d") {
            dispatch(addPath(name))
        }
    }
    const onClick = (event: React.MouseEvent) => {
        dispatch(event.currentTarget.classList.toggle("selected") ? increaseSelected() : decreaseSelected())
    }
    return (<Card
        className="file m-2"
        style={{ width: "12rem", height: "16rem" }}
        data-name={name}
        data-type={type}
        data-size={size}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
    >
        <Card.Header className="h-100">
            <div className="text-start text-overflow-dots">{typeToIcon(type)} {name}</div>
            <div className="my-3">
                {typeToIcon(type, "w-100 h-100")}
            </div>
        </Card.Header>
    </Card>);
}