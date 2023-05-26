const Filter = ({filterName, filterChange}) => (
    <div>
      filter shown with <input value={filterName} onChange={filterChange}/>
    </div>
)

export default Filter
