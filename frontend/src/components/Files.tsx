import { Row, Col } from "react-bootstrap"
import File from "./File"
import { useSelector, useDispatch } from 'react-redux';
import { setFiles, resetSelected, setEmptyFilesMessage } from "../slices/myDriveSlice";
import { RootState } from "../store";
import 'react-toastify/dist/ReactToastify.css'
import { uploadFilesSystemEntries } from "../utils/utils";
import axios from "axios";
import { useState } from "react";

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
    const emptyFilesMessage = useSelector((state: RootState) => state.myDrive.emptyFilesMessage)
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
        axios.get(
            "/file" + path,
        ).then((response) => {
            dispatch(setFiles(response.data.files))
        }).catch((error) => {
            if (error.response.status == 401) {
                dispatch(setFiles([]))
                dispatch(setEmptyFilesMessage("Login to use My Drive!"))
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
                {
                    files.length > 0 ?
                        files.map((file) => <Col className="p-0" key={path + file.name} xs="auto">
                            <File {...file} />
                        </Col>) :
                        <Col className="h1 my-5">{emptyFilesMessage}</Col>
                }
            </Row>
        </div>
    </>)
}