import Controller from "./Controller"
import { Disc } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store";
import { setPath } from "../slices/myDriveSlice";
import { Row, Col } from "react-bootstrap";
import { refinePath } from "../utils/utils";


type DirProps = {
    dirPath: string,
    dirName: string,
}

function Dir({ dirPath, dirName }: DirProps) {
    const dispatch = useDispatch()
    return (<span><span className="dir" onClick={() => { dispatch(setPath(dirPath)) }}>{dirName}</span> / </span>)
}

export default function Header() {
    const path = useSelector((state: RootState) => state.myDrive.path)
    const getDirs = (path: string): JSX.Element[] => {
        path = refinePath(path)
        let dirs = [<Dir key={-1} dirPath="/" dirName="root" />]
        if (path.length > 0) {
            dirs = dirs.concat(
                path.split("/").map(
                    (value, index, array) => <Dir key={index} dirPath={array.slice(0, index + 1).join('/')} dirName={value} />
                )
            )
        }
        return dirs
    }
    return (<header className="container-fluid">
        <Row className="justify-content-between">
            <Col className="d-inline-block p-3 col-auto">
                <div className="h1"><Disc /> My Drive</div>
                <div className="h3">
                    {getDirs(path)}
                </div>
            </Col>
            <Controller />

        </Row>
    </header>)
}