import { useNotificationValue } from '../reducers/notificationContext'

const Notification = () => {
  const { errorMessage, infoMessage } = useNotificationValue()

  return (
    <>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {infoMessage && <div className="info">{infoMessage}</div>}
    </>
  )
}

export default Notification
