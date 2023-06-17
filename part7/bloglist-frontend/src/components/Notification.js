import { useNotificationValue } from './NotificationContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const { errorMessage, infoMessage } = useNotificationValue()

  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: '10px' }}>
          {errorMessage}
        </Alert>
      )}
      {infoMessage && (
        <Alert severity="success" sx={{ marginBottom: '10px' }}>
          {infoMessage}
        </Alert>
      )}
    </>
  )
}

export default Notification
