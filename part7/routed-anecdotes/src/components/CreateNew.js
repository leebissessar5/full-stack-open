import { useField } from "../hooks"

const CreateNew = (props) => {
    const content = useField('')
    const author = useField('')
    const info = useField('')

    const handleSubmit = (e) => {
      e.preventDefault()
      props.addNew({
        content: content.value,
        author: author.vaue,
        info: info.value,
        votes: 0
      })
    }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit}>
          <div>
            content
            <input {...content} />
          </div>
          <div>
            author
            <input {...author} />
          </div>
          <div>
            url for more info
            <input {...info} />
          </div>
          <button>create</button>
        </form>
      </div>
    )
}

export default CreateNew