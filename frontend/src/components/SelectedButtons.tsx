import { CloudDownloadFill, Trash3Fill, CartXFill } from 'react-bootstrap-icons';
import $ from 'jquery'
import store from "../store";
import { useDispatch } from 'react-redux';
import { setFiles } from '../slices/myDriveSlice';

const downloadURI = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const DownloadButton = () => {
    const onClick = () => {
        $('.selected').each((index, element) => {
            let name = element.getAttribute('data-name')
            let uri = process.env.REACT_APP_API_SERVER_URL + `/download/${store.getState().myDrive.path}/${name}`
            downloadURI(
                uri, name ? name : ""
            )
        })
    }
    return (
        <div className='rounded-circle p-3 bg-primary m-3' onClick={onClick}>
            <CloudDownloadFill color="white" width={"4rem"} height={"4rem"} />
        </div>)
}

const UnselectButton = () => {
    const onClick = () => {
        $('.selected').each((index, element) => {
            element.classList.toggle("selected")
        })
    }
    return (
        <div className='rounded-circle p-3 bg-warning m-3' onClick={onClick}>
            <CartXFill color="white" width={"4rem"} height={"4rem"} />
        </div>)
}

const DeleteButton = () => {
    const dispatch = useDispatch()
    const onClick = () => {
        $('.selected').each((index, element) => {
            let name = element.getAttribute('data-name')
            let uri = process.env.REACT_APP_API_SERVER_URL + `/file/${store.getState().myDrive.path}/${name}`
            $.ajax({
                method: "DELETE",
                url: uri,
                success: (data) => {
                    dispatch(setFiles(data.files))
                }
            })
        })
    }
    return (
        <div className='rounded-circle p-3 bg-danger m-3' onClick={onClick}>
            <Trash3Fill color="white" width={"4rem"} height={"4rem"} />
        </div>)
}

export default function SelectedButtons() {
    return (
        <div className="selected-buttons">
            <UnselectButton />
            <DeleteButton />
            <DownloadButton />
        </div >
    )
}