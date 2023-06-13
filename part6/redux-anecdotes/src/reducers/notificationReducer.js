import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {
      setNotification(state, action) {
        return action.payload;
      },
      removeNotification(state, action) {
        return null;
      }
    }
})
  
export const { setNotification, removeNotification } = notificationSlice.actions

let notificationTimeout

export const showNotification = (message) => (dispatch) => {
    dispatch(setNotification(message))

    if (notificationTimeout) {
        clearTimeout(notificationTimeout)
    }

    notificationTimeout = setTimeout(() => {
        dispatch(removeNotification())
    }, 5000)
}

export default notificationSlice.reducer