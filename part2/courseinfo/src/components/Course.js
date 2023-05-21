const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Total = ({parts}) => {
    const sumOfExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

    return <b>total of {sumOfExercises} exercises</b>;
}

const Part = (props) => {
    return (
        <p>
            {props.part} {props.exercises}
        </p>
    )
}

const Content = ({parts}) => {
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises}/>)}
        </div>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
        </div>
        
    )
}

export default Course