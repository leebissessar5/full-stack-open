import { useField } from "../hooks"

const CreateNew = (props) => {
    const contentField = useField('')
    const authorField = useField('')
    const infoField = useField('')

    const handleSubmit = (e) => {
      e.preventDefault()
      const content = contentField.input.value
      const author = authorField.input.value
      const info = infoField.input.value
      if (content && author && info) {
        props.addNew({
          content,
          author,
          info,
          votes: 0
        })
      }
    }

    const handleReset = (e) => {
      e.preventDefault()
      contentField.onReset(e)
      authorField.onReset(e)
      infoField.onReset(e)
    }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input {...contentField.input} required />
          </div>
          <div>
            author
            <input {...authorField.input} required />
          </div>
          <div>
            url for more info
            <input {...infoField.input} required />
          </div>
          <button>create</button>
          <button onClick={handleReset}>reset</button>
        </form>
      </div>
    )
}

export default CreateNew