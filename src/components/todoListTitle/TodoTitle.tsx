import {SpanWithEditMode} from "../spanWithEditMode/SpanWithEditMode";
import React from "react";
import {DeleteButton} from "../DeleteButton";
import styled from "styled-components";

type PropsType = {
    title: string
    editTodoTitle: (title: string) => void
    removeTodoList: () => void
}

export const TodoTitle = React.memo(({title, editTodoTitle, removeTodoList}: PropsType) => {
    return <TodoTitleStyled>
        <SpanWithEditMode title={title} editTitle={editTodoTitle}/>
        <DeleteButton callback={removeTodoList}/>
    </TodoTitleStyled>
})

const TodoTitleStyled = styled.h3`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
`