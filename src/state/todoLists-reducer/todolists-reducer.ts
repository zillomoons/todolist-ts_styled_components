import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {AnyAction, Dispatch} from "redux";
import {RequestStatusType, setAppError} from "../app-reducer/app-reducer";
import {getTasks, ResultCodes} from "../tasks-reducer/tasks-reducer";
import {handleServerAppError} from "../../utils/error-utils";
import {preloaderControl} from "../../utils/preloaderControl";
import {AppRootStateType} from "../../store/store";
import {ThunkDispatch} from "redux-thunk";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistEntityType[] = [];

const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        removeTodoListAC(state, action: PayloadAction<{todoID: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.todoID);
            if (index > -1) state.splice(index, 1);
        },
        editTodoTitleAC(state, action: PayloadAction<{todoID: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.todoID);
            if (index > -1) state[index].title = action.payload.title;
        },
        addNewTodoAC(state, action: PayloadAction<{todo: TodolistType}>){
            state.unshift({...action.payload.todo, filter: 'all', entityStatus: 'idle'})
        },
        changeFilterAC(state, action: PayloadAction<{todoID: string, value: FilterValuesType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todoID);
            if (index > -1) state[index].filter = action.payload.value;
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: TodolistType[]}>){
            return action.payload.todolists.map(tl=> ({...tl, filter: 'all', entityStatus: 'idle'}) )
        },
        changeEntityStatus(state, action: PayloadAction<{todoID: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todoID);
            if (index > -1) state[index].entityStatus = action.payload.status;
        },
    }
})

export const todolistsReducer = slice.reducer;
//Action creators
export const {
    removeTodoListAC,
    editTodoTitleAC,
    addNewTodoAC,
    changeFilterAC,
    setTodolistsAC,
    changeEntityStatus
} = slice.actions;


// Thunk creators
export const getTodolists = () => (dispatch: ThunkDispatch<void, AppRootStateType, AnyAction>) => {
    preloaderControl('loading', dispatch);
    todolistsAPI.getTodolists()
        .then((res) => {
        dispatch(setTodolistsAC( {todolists: res.data}));
        return res.data;
    }).then((todos)=>{
        todos.forEach((todo)=>{
            dispatch(getTasks(todo.id));
        })
    }).catch((error: any)=>{
        dispatch(setAppError({error: error.message}))
    }).finally(()=>{
        preloaderControl('idle', dispatch)
    })
}
export const createTodolist = (title: string) => async (dispatch: Dispatch) => {
    preloaderControl('loading', dispatch);
    try {
        const {data} = await todolistsAPI.createTodolist(title);
        data.resultCode === ResultCodes.success
            ? dispatch(addNewTodoAC({todo: data.data.item}))
            : handleServerAppError(dispatch, data);
    } catch (error: any) {
        dispatch(setAppError({error: error.message}));
    } finally {
        preloaderControl('idle', dispatch);
    }

}
export const deleteTodolist = (todoID: string) => async (dispatch: Dispatch) => {
    preloaderControl('loading', dispatch, todoID);
    try {
        const {data} = await todolistsAPI.deleteTodolist(todoID);
        data.resultCode === ResultCodes.success && dispatch(removeTodoListAC({todoID}));
    } catch (error: any) {
        dispatch(setAppError({error: error.message}));
    } finally {
        preloaderControl('idle', dispatch, todoID)
    }
}
export const updateTodoTitle = (todoID: string, title: string) => async (dispatch: Dispatch) => {
    preloaderControl('loading', dispatch);
    try {
        const {data} = await todolistsAPI.updateTodolist(todoID, title);
        data.resultCode === ResultCodes.success && dispatch(editTodoTitleAC({todoID, title}));
    } catch (error: any) {
        dispatch(setAppError({error: error.message}));
    } finally {
        preloaderControl('idle', dispatch);
    }
}

//Types
export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistEntityType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

//     (state = initialState, action: ActionsType): TodolistEntityType[] => {
//     switch (action.type) {
//         case ACTIONS_TYPE.REMOVE_TODOLIST:
//             return state.filter(tl => tl.id !== action.todoID)
//         case ACTIONS_TYPE.EDIT_TODOLIST:
//             return state.map(tl => tl.id === action.todoID
//                 ? {...tl, title: action.title} : tl)
//         case ACTIONS_TYPE.ADD_TODOLIST:
//             return [{...action.tl, filter: 'all', entityStatus: 'idle'}, ...state]
//         case ACTIONS_TYPE.CHANGE_FILTER:
//             return state.map(tl => tl.id === action.todoID
//                 ? {...tl, filter: action.value} : tl);
//         case ACTIONS_TYPE.SET_TODOLISTS:
//             return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
//         case ACTIONS_TYPE.CHANGE_ENTITY_STATUS:
//             return state.map(tl => tl.id === action.todoID ? {...tl, entityStatus: action.status} : tl)
//         default:
//             return state;
//     }
// }
// Action creators
// export const removeTodoListAC = (todoID: string) => ({type: ACTIONS_TYPE.REMOVE_TODOLIST, todoID} as const)
// export const editTodoTitleAC = (todoID: string, title: string) => ({
//     type: ACTIONS_TYPE.EDIT_TODOLIST, todoID, title
// } as const)
// export const addNewTodoAC = (tl: TodolistType) => ({type: ACTIONS_TYPE.ADD_TODOLIST, tl} as const)
// export const changeFilterAC = (todoID: string, value: FilterValuesType,) => ({
//     type: ACTIONS_TYPE.CHANGE_FILTER, todoID, value
// } as const)
// export const setTodolistsAC = (todolists: TodolistType[]) => ({type: ACTIONS_TYPE.SET_TODOLISTS, todolists} as const)
// export const changeEntityStatus = (todoID: string, status: RequestStatusType) => ({
//     type: ACTIONS_TYPE.CHANGE_ENTITY_STATUS, status, todoID
// } as const)