import { CloudDownloadFill, Trash3Fill, CartXFill } from 'react-bootstrap-icons';
import $ from 'jquery'
import store from "../store";
import { useDispatch } from 'react-redux';
import { setFiles } from '../slices/myDriveSlice';
import axios from 'axios';
import { refinePath } from '../utils/utils';
import { v4 as uuid } from 'uuid';
import { FileProps } from './File';
import Toasts from '../utils/toasts';

const DownloadButton = () => {
    const onClick = () => {
        let files: Array<FileProps> = []
        let isDir = false
        $('.selected').each((i, element) => {
            let type = `${element.getAttribute('data-type')}`
            if (type === "-")
                files.push({
                    name: `${element.getAttribute('data-name')}`,
                })
            else if (type === 'd') {
                isDir = true
            }
        })
        if (isDir)
            Toasts.warning('You cannot download folder yet!')
        const download = () => {
            if (files.length > 0) {
                let file = files.pop()
                let name = file?.name as string
                axios.get(
                    `/download/${refinePath(store.getState().myDrive.path)}/${name}`,
                    { responseType: "blob" }
                ).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    download()
                }).catch((error) => { })
            }
        }
        download()
    }
    return (
        <div className='selected-button rounded-circle p-3 bg-primary m-3' onClick={onClick}>
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
        <div className='selected-button rounded-circle p-3 bg-warning m-3' onClick={onClick}>
            <CartXFill color="white" width={"4rem"} height={"4rem"} />
        </div>)
}

const DeleteButton = () => {
    const dispatch = useDispatch()
    const onClick = () => {
        let names: Array<string> = []
        $('.selected').each((index, element) => {
            names.push(`${element.getAttribute('data-name')}`)
        })
        const del = () => {
            if (names.length) {
                let name = names.pop()
                axios.delete(
                    `/file/${store.getState().myDrive.path}/${name}`
                ).then((response) => {
                    dispatch(setFiles(response.data.files))
                    del()
                }).catch((error) => { })
            }
        }
        del()
    }
    return (
        <div className='selected-button rounded-circle p-3 bg-danger m-3' onClick={onClick}>
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