import Toasts from "./toasts"
import { reloadFiles } from "../slices/myDriveSlice"
import { Dispatch } from "redux"
import axios from "axios"

const refinePath = (path: string) => {
    return path.replace(/^\/+|\/+$/, '').replace(/\/{2,}/, "/")
}

const uploadFile = (path: string, file: File, dispatch: Dispatch) => {
    let formData = new FormData()
    let request = new XMLHttpRequest()
    let fileSize = file.size
    let toastId = Toasts.createUploadFile(file.name)

    formData.append(file.name, file)
    request.upload.addEventListener(
        'progress',
        function (e: ProgressEvent) {
            if (e.loaded <= fileSize) {
                var percent = Math.round(e.loaded / fileSize * 100);
                Toasts.updateUploadFile(toastId, file.name, percent)
            }
            if (e.loaded === e.total) {
                Toasts.updateUploadFile(toastId, file.name, 100)
            }
        }
    )
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            dispatch(reloadFiles())
            Toasts.updateUploadFile(toastId, file.name, 200)
        }
    }
    request.open('post', process.env.REACT_APP_API_SERVER_URL + `/file/${refinePath(path)}`);
    request.timeout = 45000;
    request.send(formData);

}

const uploadFilesSystemEntries = (path: string, entries: Array<FileSystemEntry>, dispatch: Dispatch) => {
    let files: Map<string, File> = new Map()
    let dirs: Set<string> = new Set()
    let numFiles = 0
    let numDirs = 0
    const process = (entries: Array<FileSystemEntry>, dirPath: string = "") => {
        for (let entry of entries) {
            if (entry.isFile) {
                (entry as FileSystemFileEntry).file(
                    (file) => {
                        files.set(refinePath(`${dirPath}/${file.name}`), file)
                        if (numFiles === files.size && numDirs === dirs.size) {
                            uploadFilesMap(path, files, dispatch)
                        }
                    }
                )
                numFiles += 1
            }
            else if (entry.isDirectory) {
                let directoryReader = (entry as FileSystemDirectoryEntry).createReader()
                directoryReader.readEntries(
                    (childEntries) => {
                        process(childEntries, `${dirPath}/${entry.name}`)
                        dirs.add(`${dirPath}/${entry.name}`)
                    }
                )
                numDirs += 1
            }
        }
    }
    process(entries)
}

const uploadFilesMap = (path: string, files: Map<string, File>, dispatch: Dispatch) => {
    let formData = new FormData()
    let fileSize = 0
    let toastName = `${files.size} files`
    for (var [fileName, file] of files) {
        formData.append(fileName, file)
        fileSize += file.size
        if (files.size === 1) {
            toastName = fileName
        }
    }
    let toastId = Toasts.createUploadFile(toastName)

    axios.post(`/file/${refinePath(path)}`, formData, {
        onUploadProgress: (event) => {
            if (event.loaded <= fileSize) {
                var percent = Math.round(event.loaded / fileSize * 100);
                Toasts.updateUploadFile(toastId, toastName, percent)
            }
            if (event.loaded === event.total) {
                Toasts.updateUploadFile(toastId, toastName, 100)
            }
        },
        timeout: 45000,
    }).then(() => {
        dispatch(reloadFiles())
        Toasts.updateUploadFile(toastId, toastName, 200)
    }).catch(() => {
        // Toasts.updateUploadFile(toastId, toastName, 300)
        Toasts.dismiss(toastId)
    })
}

export { refinePath, uploadFile, uploadFilesMap, uploadFilesSystemEntries }