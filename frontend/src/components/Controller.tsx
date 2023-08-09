import { Row, Col, Button } from "react-bootstrap"
import { ListUl, SortAlphaDown, SortAlphaUp, BorderAll, Grid, ArrowClockwise, CloudArrowUp, FileEarmarkZip, List, Google, FolderPlus, FolderCheck } from "react-bootstrap-icons"
import { useDispatch, } from "react-redux"
import { reloadFiles, setDisplay, setPath, setFiles } from "../slices/myDriveSlice"
import Toasts from "../utils/toasts"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useRef, useState } from "react"
import { uploadFilesMap } from "../utils/utils"
import { useGoogleLogin } from '@react-oauth/google';
import { useCookies } from "react-cookie"
import axios from "axios"
import { axiosLogin, axiosLogout } from "../utils/axios"
import $ from "jquery"

function RefreshButton() {
    const dispatch = useDispatch()
    const onClick = () => {
        dispatch(reloadFiles())
        Toasts.createReloadFiles()
    }
    return <ArrowClockwise onClick={onClick} width="2rem" height="2rem" />
}

const DisplayEnum = {
    icon: "icon",
    list: "list",
}
function DisplayButton() {
    const dispatch = useDispatch()
    const display = useSelector((state: RootState) => state.myDrive.display)
    const onClick = () => {
        dispatch(setDisplay(display === DisplayEnum.list ? DisplayEnum.icon : DisplayEnum.list))
    }
    return (
        <div onClick={onClick}>
            {display === DisplayEnum.list ? <ListUl width="2rem" height="2rem" /> : <Grid width="2rem" height="2rem" />}
        </div>
    )
}

const SortEnum = {
    a_z: "a-z",
    z_a: "z_a",
}

const UploadButton = () => {
    const path = useSelector((state: RootState) => state.myDrive.path)
    const dispatch = useDispatch()
    const filesInput = useRef<HTMLInputElement | null>(null)
    const onClick = () => {
        filesInput.current?.click()
    }
    const onChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (target.files) {
            let files: Map<string, File> = new Map()
            for (let i = 0, file: File; file = target.files[i]; i++) {
                files.set(file.name, file)
            }
            uploadFilesMap(path, files, dispatch)
            target.value = ""
        }
    }
    return (<div onClick={(onClick)}>
        {/* @ts-expect-error */}
        <input onChange={onChange} ref={filesInput} className="d-none" multiple type="file" />
        <CloudArrowUp width="2rem" height="2rem" />
    </div>)
}

function AuthButton() {
    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies(["access_token", "email"])
    const login = (access_token: string) => {
        let authorization = `Bearer my_drive ${access_token}`
        axios.get(
            "/oauth",
            {
                headers: {
                    Authorization: authorization
                }
            }
        ).then((response) => {
            axiosLogin(access_token)
            setCookie("access_token", access_token)
            setCookie("email", response.data.email)
            dispatch(reloadFiles())
        })
    }

    const logout = () => {
        axiosLogout()
        removeCookie("email")
        removeCookie("access_token")
        dispatch(setPath("/"))
        dispatch(reloadFiles())
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (response) => {
            axios.post(
                "/auth/convert-token",
                {
                    grant_type: "convert_token",
                    client_id: process.env.REACT_APP_MY_DRIVE_OAUTH2_KEY,
                    client_secret: process.env.REACT_APP_MY_DRIVE_OAUTH2_SECRET,
                    backend: "google-oauth2",
                    token: response.access_token,
                },
            ).then((response) => {
                login(response.data.access_token)
            })
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    let authButton = cookies.email ? <div className="h3" onClick={logout}>{cookies.email} <Button>Logout</Button></div> : <div
        onClick={() => googleLogin()}
    >
        <Button>
            <Google width="2rem" height="2rem" /> Login
        </Button>
    </div>

    return authButton
}

function AddFolderButton() {
    const path = useSelector((state: RootState) => state.myDrive.path)
    let dispatch = useDispatch()
    const onClick = () => {
        let dirName = $("#new-folder-name").val()
        if (typeof dirName === "string" && dirName.length > 0) {
            axios.post(
                `/file/${path}?dir=${dirName}`
            ).then((response) => {
                dispatch(setFiles(response.data.files))
                $("#new-folder-name").val('')
            }).catch((error) => {
            })

        }
    }
    return (<div onClick={onClick}>
        {<FolderPlus width="2rem" height="2rem" />}
    </div>)
}

export default function Controller() {
    return (<Col className="my-auto mx-3 col-auto ">
        <Row className="justify-content-end">
            <Col className="p-0 mx-3 rounded-circle col-auto"><AuthButton /></Col>
        </Row>
        <Row className="justify-content-end">
            <Col><input placeholder="new folder name" id="new-folder-name" className="h-100" type="text" /></Col>
            <Col className="col-auto controller-button p-2 mx-3 rounded-circle"><AddFolderButton /></Col>
            <Col className="col-auto controller-button p-2 mx-3 rounded-circle"><RefreshButton /></Col>
            {/* <Col className="col-auto controller-button p-2 mx-3 rounded-circle"><DisplayButton /></Col>
            <Col className="col-auto controller-button p-2 mx-3 rounded-circle"><SortAlphaDown width="2rem" height="2rem" /></Col> */}
            <Col className="col-auto controller-button p-2 mx-3 rounded-circle"><UploadButton /></Col>
        </Row>
    </Col>)
}

export { DisplayEnum, SortEnum }