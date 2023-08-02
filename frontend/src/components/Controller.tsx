import { Container, Row, Col } from "react-bootstrap"
import { ListUl, SortAlphaDown, SortAlphaUp, BorderAll, Grid, ArrowClockwise, CloudArrowUp, FileEarmarkZip, List } from "react-bootstrap-icons"
import { useDispatch, } from "react-redux"
import { reloadFiles, setDisplay, setSort } from "../slices/myDriveSlice"
import Toasts from "../utils/toasts"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useRef } from "react"
import { uploadFilesMap } from "../utils/utils"

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

export default function Controller() {
    // setInterval(() => {
    //     console.log("i am interval!")
    // }, 1000)
    return (<Col className="my-auto mx-3 col-auto ">
        {/* <Row>
            <Col>
                <FileEarmarkZip className="h1" /><List className="h1" />
            </Col>
        </Row> */}
        <Row>
            <Col className="controller-button p-2 mx-3 rounded-circle"><RefreshButton /></Col>
            {/* <Col className="controller-button p-2 mx-3 rounded-circle"><DisplayButton /></Col>
            <Col className="controller-button p-2 mx-3 rounded-circle"><SortAlphaDown width="2rem" height="2rem" /></Col> */}
            <Col className="controller-button p-2 mx-3 rounded-circle"><UploadButton /></Col>
        </Row>
    </Col>)
}

export { DisplayEnum, SortEnum }