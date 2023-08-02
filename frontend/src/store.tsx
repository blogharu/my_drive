import { configureStore } from '@reduxjs/toolkit';
import myDriveSlice from './slices/myDriveSlice';

const store = configureStore({
    reducer: {
        myDrive: myDriveSlice,
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>