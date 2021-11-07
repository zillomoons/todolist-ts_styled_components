import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import styled from "styled-components";
import {StyledIconButton} from "./DeleteButton";
import {IoAddCircleOutline} from "react-icons/all";

type PropsType = {
    addNewItemTitle: (title: string) => void
}

export const AddItemInput = ({addNewItemTitle}: PropsType) => {
    const [newTitle, setNewTitle] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onNewTaskChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(false);
        e.key === 'Enter' && addNewTitle()
    }
    const addNewTitle = () => {
        const trimmedTitle = newTitle.trim();
        if (trimmedTitle) {
            addNewItemTitle(trimmedTitle);
            setNewTitle('')
        } else {
            setError(true)
        }
    }
    return (
        <StyledInputContainer>
            <div>
                <StyledInput value={newTitle} onChange={onNewTaskChanged} onKeyPress={onKeyPressHandler} error={error}/>
                {error && <div className={'error-message'}>Title is required</div>}
            </div>
            <StyledIconButton size={28} onClick={addNewTitle}>
                <IoAddCircleOutline/>
            </StyledIconButton>
        </StyledInputContainer>
    )
}
const StyledInputContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  margin: 10px 0;
`
const StyledInput = styled.input<{ error: boolean }>`
  width: 220px;
  outline: none;
  border: 1px solid ${props => props.error ? 'red' : 'lightgrey'};
  padding: 5px 5px;
  border-radius: 8px;
`