import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: "this is a notification",
    reducers: {
        notificationChange(state, action) {
            return action.payload
        }
    }
})

export const { notificationSliceChange } = notificationSlice.actions
export default notificationSlice.reducer