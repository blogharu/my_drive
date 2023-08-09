import { createSlice } from '@reduxjs/toolkit'
import { FileProps } from '../components/File'
import { DisplayEnum, SortEnum } from '../components/Controller'
import { refinePath } from '../utils/utils'
import $ from 'jquery'

export const myDriveSlice = createSlice({
    name: "myDrive",
    initialState: {
        path: '/' + refinePath(window.location.pathname),
        isLoaded: false,
        files: new Array<FileProps>,
        selected: 0,
        display: DisplayEnum.icon,
        sort: SortEnum.a_z,
        emptyFilesMessage: "",
    },
    reducers: {
        setPath: (state, action) => {
            let newPath = '/' + refinePath(action.payload)
            if (state.path !== newPath) {
                state.path = newPath
                state.isLoaded = false
                window.history.pushState(null, "", newPath)
                $("#new-folder-name").val('')
            }
        },
        addPath: (state, action) => {
            let refinedOldPath = refinePath(state.path)
            let newPath = refinedOldPath.length > 0 ? '/' + refinedOldPath + '/' + refinePath(action.payload) : '/' + refinePath(action.payload)
            state.path = newPath
            state.isLoaded = false
            window.history.pushState(null, "", newPath)
            $("#new-folder-name").val('')
        },
        setFiles: (state, action) => {
            action.payload.sort((file1, file2) => {
                if (file1.type === file2.type) {
                    if (file1.name < file2.name) return -1;
                    else if (file1.name > file2.name) return 1;
                    return 0
                }
                return file1.type === "d" ? -1 : 1
            })
            state.files = action.payload
            state.isLoaded = true
            if (action.payload.length === 0) {
                state.emptyFilesMessage = "Folder is empty!"
            }
        },
        increaseSelected: (state) => {
            state.selected = state.selected + 1
        },
        decreaseSelected: (state) => {
            state.selected = state.selected - 1
        },
        resetSelected: (state) => {
            state.selected = 0
        },
        reloadFiles: (state) => {
            state.isLoaded = false
        },
        setDisplay: (state, action) => {
            if (state.display !== action.payload)
                state.display = action.payload
        },
        setSort: (state, action) => {
            if (state.sort !== action.payload)
                state.sort = action.payload
        },
        setEmptyFilesMessage: (state, action) => {
            if (state.emptyFilesMessage !== action.payload)
                state.emptyFilesMessage = action.payload
        }
    }
})

export const {
    setPath, setFiles, addPath, increaseSelected, decreaseSelected,
    resetSelected, reloadFiles, setDisplay, setSort, setEmptyFilesMessage } = myDriveSlice.actions
export default myDriveSlice.reducer


