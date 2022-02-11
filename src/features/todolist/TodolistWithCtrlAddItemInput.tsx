import React, { useCallback, useState} from "react";
import styled from "styled-components";

import {
    TodoTitle,
    FilterBlock
} from "../../components";
import {FilterValuesType} from "../../state/todoLists-reducer/todolists-reducer";
import {Task} from "./task/Task";
import {TaskEntityType} from "../../state/tasks-reducer/tasks-reducer";
import {RequestStatusType} from "../../state/app-reducer/app-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {tasksActions} from "../../state/tasks-reducer";
import {useAppDispatch} from "../../store/store";
import {AddItemInputControlled} from "../../components/addItemInput/AddItemInputControlled";


export const TodolistWithCtrlAddItemInput = React.memo(({tasks, title, todoID, filter, todoEntityStatus}: ToDoListPropsType) => {
    const dispatch = useAppDispatch();
    let tasksForToDoList = tasks;

    if (filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.Completed)
    }

    //AddItemInput control
    const addTask = useCallback(async (title: string) => {
        const action = await dispatch(tasksActions.createTask({todoID, title}));
        if (tasksActions.createTask.rejected.match(action)) {
            if (action.payload?.errors?.length) {
                const errorMessage = action.payload?.errors[0];
                setError(errorMessage);
            } else {
                setError('Some error occured')
            }
        } else {
            setNewTitle('');
        }
    }, []);
    const [newTitle, setNewTitle] = useState('');
    const [error, setError] = useState('');

    const mappedTasks = tasksForToDoList.map((t) => <Task key={t.id} todoID={todoID} task={t}/>)
    return (
        <StyledTodolist>
            <TodoTitle todoID={todoID} title={title} disabled={todoEntityStatus === 'loading'}/>
            <AddItemInputControlled
                addNewItemTitle={addTask}
                error={error}
                newTitle={newTitle}
                setError={setError}
                setNewTitle={setNewTitle}
                disabled={todoEntityStatus === 'loading'}/>
            {mappedTasks}
            {!mappedTasks.length && <div style={{color: "lightgray"}}>No tasks added</div>}
            <FilterBlock filter={filter} todoID={todoID}/>
        </StyledTodolist>
    )
})

const StyledTodolist = styled.div`
  width: 320px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
  padding: 20px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  background: white;

`
type ToDoListPropsType = {
    tasks: TaskEntityType[]
    todoID: string
    title: string
    filter: FilterValuesType
    todoEntityStatus: RequestStatusType
}