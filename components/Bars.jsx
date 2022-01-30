import Link from "next/link"
import { DeleteProject } from "../utils/Todo"
import { useState, useEffect } from "react"


function EachBar(props) {
    const [deletingProjectInProgress, setDeletingProjectInProgress] = useState(false);
    const contractAddr = "0xE032E7d6fe58f1f57dA6b8a36f06749A2C5f3b95";
    function DeleteProject_WithStates(index) {
        setDeletingProjectInProgress(true);
        DeleteProject(contractAddr, index).then(() => {
            const todos_clone = [...todos];
            todos_clone.splice(index, 1);
            setTodoFunction(todos_clone);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setDeletingProjectInProgress(false);
        });
    }
    const { name, addr, index, todos, setTodoFunction } = props;
    return (
        <div key={index}>
            <div className="card">
                <div className="card-body">
                    <div className="float-right">
                        <Link href={`/todo/${addr}`}>
                            <a className="btn btn-primary">
                                View
                            </a>
                        </Link>
                        {
                            deletingProjectInProgress ?
                                <>

                                    <div className="spinner-border text-primary ml-4" role="status">
                                        <span className="sr-only">Deleting...</span>
                                    </div>
                                </>
                                :
                                <button className="btn btn-danger ml-4" onClick={() => DeleteProject_WithStates(index)}>
                                    Delete
                                </button>
                        }

                    </div>
                    <div>
                        <h5 className="card-title">{name}</h5>
                    </div>
                </div>
            </div>
            <br />
        </div >
    )
}
function Bars(props) {
    const contractAddr = "0xAB449c6d1f44E73687310283786Ec94c413a26A0";
    return (
        <>
            {
                props.data.length > 0 ?
                    props.data.map((item, index) => {
                        return (
                            <EachBar
                                key={index}
                                name={item.name}
                                addr={item.addr}
                                index={index}
                                todos={props.data}
                                setTodoFunction={props.setTodoFunction}
                            />
                        )
                    })
                    :
                    <div className="text-center">
                        <h1>
                            No Project Created
                        </h1>
                    </div>
            }
        </>
    );
}

export default Bars;
