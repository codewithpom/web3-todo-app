import { useState, useEffect } from 'react';
import { getTodos, addTodo, getName, editTodoCompletion, editProjectName } from "../../utils/Todo"

export function getServerSideProps(context) {
    return {
        props: { params: context.params }
    };
}


function Todo({ params }) {
    const addr = params.addr;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [TodoName, setTodoName] = useState("");
    const [NewTodoLoading, setNewTodoLoading] = useState(false);
    const [NameWithoutEdit, setNameWithoutEdit] = useState("");
    const [filterOnlyIncomplete, setFilterOnlyIncomplete] = useState(false);

    useEffect(() => {
        getName(addr).then(res => {
            setName(res.name);
            setNameWithoutEdit(res.name);
            console.log(NameWithoutEdit);
            document.title = res.name;
            const interval = setInterval(() => {
                try {
                    document.getElementById("name").innerHTML = res.name;

                    clearInterval(interval);
                } catch (e) {
                    console.log(e);
                }
            }, 100);


        });
        getData();
        window.getTodos = getTodos;
        window.addTodo = addTodo;
    }, []);

    async function getData() {
        const todos = await getTodos(addr);
        console.log(todos)
        setData(todos);
        setLoading(false);
        document.getElementById("name").innerHTML = name;
    }

    async function CreateTodo(event) {
        event.preventDefault();
        setNewTodoLoading(true);
        try {
            await addTodo(TodoName, false, addr);
            setNewTodoLoading(false);
            setTodoName("");
            setLoading(true);
            getData();
        } catch (e) {
            console.log(e);
            setNewTodoLoading(false);
        }
    }

    async function ChangeTodoCompletion(index, done) {
        console.log(index);
        console.log(done);
        try {
            await editTodoCompletion(addr, index, done);
            setLoading(true);
            getData();
        } catch (e) {
            console.log(e);
        }
    }

    async function ChangeProjectName(newName) {
        console.log(newName);
        await editProjectName(addr, newName);
        setName(newName);
        setNameWithoutEdit(newName);
        document.title = newName;
        getData();
    }

    return (
        <div className='container'>
            {
                loading ?
                    <>
                        <br />
                        <div className="text-center">
                            <div className='spinner-border text-primary' role='status'>
                                <span className='sr-only'>Loading...</span>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="text-center">
                            <div>

                                <h1
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    id="name"
                                    onInput={(e) => {
                                        setName(e.target.innerHTML);
                                    }}

                                >

                                </h1>
                            </div>

                        </div>
                        {
                            name !== NameWithoutEdit && name !== "" ?
                                <>
                                    {
                                        console.log(name + "\n" + NameWithoutEdit)

                                    }
                                    <button type="button" className='btn btn-success float-right' onClick={
                                        () => {
                                            ChangeProjectName(name);
                                        }
                                    }>
                                        Save
                                    </button>
                                </>
                                :
                                <></>
                        }

                        <div className="btn-group">
                            <button type="button" className="btn btn-danger dropdown-toggle float-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Create New Task
                            </button>

                            <div className="dropdown-menu mt-3" onClick={
                                (e) => {
                                    e.stopPropagation()
                                }
                            }>
                                <form className="px-4 py-3" onSubmit={CreateTodo}>
                                    <div className="mb-3">
                                        <label className="form-label">Project Name</label>
                                        <input
                                            type={"text"}
                                            className={"form-control"}
                                            placeholder={"Project Name"}
                                            value={TodoName}
                                            onChange={(e) => setTodoName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {
                                        NewTodoLoading ?
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Crearing...</span>
                                            </div>
                                            :
                                            <button type={"submit"} className={"btn btn-primary"}>
                                                Create
                                            </button>
                                    }
                                </form>

                            </div>
                        </div>
                        <br />
                        {
                            data.length > 0 ?
                                <>
                                    <br />
                                    {data.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                {
                                                    filterOnlyIncomplete ?
                                                        <>
                                                            {
                                                                !item.done ?
                                                                    <div>
                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                {/*Add a checkbox to show if the task is done using the {item.done} variable*/}
                                                                                <div class="form-group form-check float-right">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        class="form-check-input"
                                                                                        id="exampleCheck1"
                                                                                        checked={item.done}
                                                                                        onChange={(e) => {
                                                                                            ChangeTodoCompletion(index, e.target.checked);
                                                                                        }}
                                                                                    />

                                                                                </div>
                                                                                <h5 className="card-title">
                                                                                    {
                                                                                        item.done ?
                                                                                            <strike>{item.name}</strike>
                                                                                            :
                                                                                            <>{item.name}</>
                                                                                    }
                                                                                </h5>
                                                                            </div>

                                                                        </div>
                                                                        <br />
                                                                    </div>
                                                                    :
                                                                    <>    </>
                                                            }
                                                        </>

                                                        :
                                                        <div>
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    {/*Add a checkbox to show if the task is done using the {item.done} variable*/}
                                                                    <div class="form-group form-check float-right">
                                                                        <input
                                                                            type="checkbox"
                                                                            class="form-check-input"
                                                                            id="exampleCheck1"
                                                                            checked={item.done}
                                                                            onChange={(e) => {
                                                                                ChangeTodoCompletion(index, e.target.checked);
                                                                            }}
                                                                        />

                                                                    </div>
                                                                    <h5 className="card-title">
                                                                        {
                                                                            item.done ?
                                                                                <strike>{item.name}</strike>
                                                                                :
                                                                                <>{item.name}</>
                                                                        }
                                                                    </h5>
                                                                </div>

                                                            </div>
                                                            <br />
                                                        </div>

                                                }
                                            </div>

                                        )
                                    })}
                                </>
                                :
                                <div className="text-center">
                                    <br />
                                    <br />
                                    <h4>
                                        No Task Created
                                    </h4>
                                </div>
                        }
                    </>


            }
        </div >
    );
}

export default Todo;