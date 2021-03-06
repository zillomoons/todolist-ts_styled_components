import {TodolistEntityType} from "./todolists-reducer";
import {TodolistType} from "../../api/todolists-api";
import {v1} from "uuid";
import {todolistsActions} from "./index";
import {todolistsReducer} from './todolists-reducer'


let state: TodolistEntityType[];
const {changeEntityStatus, changeFilter, deleteTodolist, updateTodoTitle, getTodolists, createTodolist} = todolistsActions;
export const todoListId_1 = v1();
export const todoListId_2 = v1();

beforeEach(()=> {
    state = [
        {id: todoListId_1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todoListId_2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    ]
})

test('todolist reducer should remove correct todolist', ()=> {

    // let changedState = tlSlice.reducer(state, asyncActions.deleteTodolist.fulfilled( todoListId_1, '', todoListId_1))
    const action = deleteTodolist.fulfilled(todoListId_1, '', todoListId_1);
    const changedState = todolistsReducer(state, action);

    expect(changedState.length).toBe(1)
    expect(changedState[0].id).toBe(todoListId_2)

})
test('todolist reducer should edit correct todolist title', ()=> {
    const update = {todoID: todoListId_2, title: 'What to search'};
    const action = updateTodoTitle.fulfilled(update, '', update);
    let changedState = todolistsReducer(state, action);

    expect(changedState.length).toBe(2)
    expect(changedState[0].title).toBe('What to learn')
    expect(changedState[1].title).toBe('What to search')
})
test('todolist reducer should add new todo with correct title', ()=> {

    let newTodo = {id:"dc67d646-68bd-4ec5-94d3-93bad218c53a",title:"What to watch",addedDate:"2021-12-16T19:30:45.9613775Z",order:-7};
    const action = createTodolist.fulfilled(newTodo, '', newTodo.title);
    let changedState = todolistsReducer(state, action);

    expect(changedState.length).toBe(3)
    expect(changedState[1].title).toBe('What to learn')
    expect(changedState[0].title).toBe('What to watch')
})
test('todolist reducer should change filter correctly', ()=> {
    const action = changeFilter({todoID: todoListId_2, value: "completed" })
    let changedState = todolistsReducer(state, action);

    expect(changedState.length).toBe(2)
    expect(changedState[1].filter).toBe('completed')
    expect(changedState[0].filter).toBe('all')
})
test('todolist reducer should set todolists with filter to the state ', () => {
    let state: TodolistEntityType[] = [];
    let todolists: TodolistType[] = [
        {id: '2', title: 'What to knit', addedDate: '', order: 0},
        {id: '1', title: 'What to read', addedDate: '', order: 0},
        {id: '3', title: 'What to watch', addedDate: '', order: 0},
    ]
    const action = getTodolists.fulfilled(todolists, '');
    const endState = todolistsReducer(state, action);

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe('2')
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('all')
})
test('todolist entity status should be changed', ()=> {
    const action = changeEntityStatus({todoID: todoListId_1, status: 'loading'});
    const endState = todolistsReducer(state, action);

    expect(endState[0].entityStatus).toBe('loading')
    expect(endState[1].entityStatus).toBe('idle')
})
