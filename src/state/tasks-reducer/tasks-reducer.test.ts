import {
    addTaskAC,
    updateTaskAC,
    removeTaskAC,
    tasksReducer,
    TaskStateType
} from "./tasks-reducer";
import {todoListId_1, todoListId_2} from "../todoLists-reducer/todolists-reducer.test";
import { TaskStatuses } from "../../api/todolists-api";

let startState: TaskStateType;
beforeEach(()=>{
    startState = {
        [todoListId_1]: [
            {
                id: '1',
                title: "HTML&CSS",
                entityStatus: 'idle',
                description: 'string',
                status: TaskStatuses.Completed,
                priority: 1,
                startDate: '',
                deadline: '',
                todoListId: todoListId_1,
                order: 1,
                addedDate: ''
            },
            {
                id: '2',
                title: "JS",
                entityStatus: 'idle',
                description: 'string',
                status: TaskStatuses.New,
                priority: 1,
                startDate: '',
                deadline: '',
                todoListId: todoListId_1,
                order: 1,
                addedDate: ''
            },
        ],
        [todoListId_2]: [
            {
                id: '1',
                title: "Milk",
                entityStatus: 'idle',
                description: 'string',
                status: TaskStatuses.Completed,
                priority: 1,
                startDate: '',
                deadline: '',
                todoListId: todoListId_2,
                order: 1,
                addedDate: ''},
        ]
    }
})
test('tasksReducer should remove task from correct todolist', ()=> {
    let changedState = tasksReducer(startState, removeTaskAC({todoID: todoListId_1, taskID: '2'} ))

    expect(changedState[todoListId_1].length).toBe(1);
    expect(changedState[todoListId_2].length).toBe(1);
})
test('tasksReducer should add task with correct title in correct todolist', ()=> {
    const task = {
        id: '10',
        title: "NodeJS",
        description: 'string',
        status: TaskStatuses.New,
        priority: 1,
        startDate: '',
        deadline: '',
        todoListId: todoListId_1,
        order: 1,
        addedDate: ''
    }
    let changedState = tasksReducer(startState, addTaskAC({task}))

    expect(changedState[todoListId_1].length).toBe(3);
    expect(changedState[todoListId_1][0].title).toBe('NodeJS')
    expect(changedState[todoListId_2].length).toBe(1);
})
test('tasksReducer should edit title of correct task', ()=> {
    let updateModel = {title: 'Ice Cream'}
    let changedState = tasksReducer(startState, updateTaskAC({todoID: todoListId_2, taskID: '1', model: updateModel}))

    expect(changedState[todoListId_1].length).toBe(2);
    expect(changedState[todoListId_2][0].title).toBe('Ice Cream')
    expect(changedState[todoListId_2].length).toBe(1);
})
test('tasksReducer should change status in correct task', ()=> {
    let updateModel = {status: TaskStatuses.New }
    let changedState = tasksReducer(startState, updateTaskAC({todoID:todoListId_2, taskID: '1', model: updateModel}))

    expect(changedState[todoListId_1].length).toBe(2);
    expect(changedState[todoListId_2][0].status).toBe(TaskStatuses.New)
})