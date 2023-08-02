import { Container, Row, Col } from "react-bootstrap"
import File from "./File"
import $ from 'jquery';
import { ArrowClockwise } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap'
import { setPath, setFiles, resetSelected, reloadFiles } from "../slices/myDriveSlice";
import { motion } from "framer-motion"
import { RootState } from "../store";
import store from "../store";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { tsExpressionWithTypeArguments } from "@babel/types";
import { refinePath } from "../utils/utils";
import Toasts from "../utils/toasts";
import { uploadFilesSystemEntries } from "../utils/utils";

export type FilesProps = {
    path: string
}


const onDragEnter = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
}

const onDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
}

const onDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
}



export default function Files({ path }: FilesProps) {
    const files = useSelector((state: RootState) => state.myDrive.files)
    const isLoaded = useSelector((state: RootState) => state.myDrive.isLoaded)
    const dispatch = useDispatch()

    const onDrop = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault()
        event.stopPropagation()

        let entries: Array<FileSystemEntry> = new Array()

        for (let i = 0, item: DataTransferItem; item = event.dataTransfer.items[i]; i++) {
            let entry = item.webkitGetAsEntry()
            if (entry) {
                entries.push(entry)
            }
        }

        uploadFilesSystemEntries(path, entries, dispatch)
    }

    if (isLoaded === false) {
        $.ajax({
            url: process.env.REACT_APP_API_SERVER_URL + "/file" + path,
            dataType: "json",
            success: function (data) {
                dispatch(setFiles(data.files))
                dispatch(resetSelected())
            }
        })
    }

    return (<>
        <div
            key={path}
            className="files h-100 container-fluid"
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
        >
            <Row className="justify-content-start">
                {files.length > 0 ? files.map((file) => <Col className="p-0" key={path + file.name} xs="auto"><File {...file} /></Col>) : <></>}
            </Row>
        </div>
    </>)
}