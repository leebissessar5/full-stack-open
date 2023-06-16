import { createContext, useReducer, useContext, useEffect } from 'react'

const initialState = {
  errorMessage: null,
  infoMessage: null,
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload }
    case 'SET_INFO_MESSAGE':
      return { ...state, infoMessage: action.payload }
    case 'RESET_ERROR_MESSAGE':
      return { ...state, errorMessage: null }
    case 'RESET_INFO_MESSAGE':
      return { ...state, infoMessage: null }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialState
  )

  const showNotification = (message, action) => {
    if (message) {
      const timer = setTimeout(() => {
        notificationDispatch({ type: action })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }

  useEffect(() => {
    showNotification(notification.errorMessage, 'RESET_ERROR_MESSAGE')
    showNotification(notification.infoMessage, 'RESET_INFO_MESSAGE')
  }, [notification])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
