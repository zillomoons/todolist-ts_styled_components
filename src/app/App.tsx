import React, {useEffect} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

import './App.css';
import {TodolistList} from "../features/todolist";
import {Login} from "../features/login";
import {Header} from "../components";

import {ErrorSnackBar} from "../common";
import {selectIsInitialized} from "./selectors";
import {useActions} from "../store/redux-utils";
import {appAsyncAction} from "../state/app-reducer";

const App = () => {
    const isInitialized = useSelector(selectIsInitialized);
    const {initializeApp} = useActions(appAsyncAction);
    useEffect(() => {
        initializeApp();
    }, [])

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: "center", width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <BrowserRouter>
            <ErrorSnackBar/>
            <Header/>
            <Routes>
                <Route path='/' element={<TodolistList/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                <Route path='*' element={<Navigate to='/404'/>}/>
            </Routes>
        </BrowserRouter>

    );
};

export default App;


