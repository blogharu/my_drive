import { createSlice } from '@reduxjs/toolkit'
import { FileProps } from '../components/File'
import { DisplayEnum, SortEnum } from '../components/Controller'
import { refinePath } from '../utils/utils'

export const myDriveSlice = createSlice({
    name: "myDrive",
    initialState: {
        path: '/' + refinePath(window.location.pathname),
        isLoaded: false,
        files: new Array<FileProps>,
        selected: 0,
        display: DisplayEnum.icon,
        sort: SortEnum.a_z,
    },
    reducers: {
        setPath: (state, action) => {
            let newPath = '/' + refinePath(action.payload)
            if (state.path !== newPath) {
                state.path = newPath
                state.isLoaded = false
                window.history.pushState(null, "", newPath)
            }
        },
        addPath: (state, action) => {
            let refinedOldPath = refinePath(state.path)
            let newPath = refinedOldPath.length > 0 ? '/' + refinedOldPath + '/' + refinePath(action.payload) : '/' + refinePath(action.payload)
            state.path = newPath
            state.isLoaded = false
            window.history.pushState(null, "", newPath)

        },
        setFiles: (state, action) => {
            state.files = action.payload
            state.isLoaded = true
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
        }
    }
})

export const {
    setPath, setFiles, addPath, increaseSelected, decreaseSelected,
    resetSelected, reloadFiles, setDisplay, setSort } = myDriveSlice.actions
export default myDriveSlice.reducer


