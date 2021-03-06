import React from "react"
import styled from "styled-components";
import LinearProgress from "@mui/material/LinearProgress";
import {useSelector} from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import {selectStatus} from "../app/selectors";
import {authSelectors} from "../features/login";
import {useActions} from "../store/redux-utils";
import {authActions} from "../state/auth-reducer";

export const Header = React.memo(() => {
    const status = useSelector(selectStatus);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
    const {logout} = useActions(authActions);
    const onLogout = () =>{
        logout();
    }
    return (
        <>
            <StyledHeaderContainer>
                <StyledLogo>To do App</StyledLogo>
                {isLoggedIn && <StyledLogout onClick={onLogout}><span>Logout</span> <AiOutlineLogout /></StyledLogout>}
            </StyledHeaderContainer>
            {status === 'loading' && <LinearProgress color='secondary'/>}
        </>

    )
})
const StyledHeaderContainer = styled.div`
  height: 60px;
  background: transparent;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const StyledLogout = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  margin: 0 15px;
  background: white;
  color: darkcyan;
  font-weight: bold;
  font-size: 14px;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
  transition: .3s ease-in-out;
  text-transform: uppercase;

  &:hover {
    box-shadow: 0 5px 10px 5px rgba(255, 255, 147, 0.25);
    transform: translateY(-1px);
  }
`
const StyledLogo = styled.h3`
  position: fixed;
  top: 15px;
  left: 15px;
`
