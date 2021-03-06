import {useFormik} from "formik";
import styled from "styled-components";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "./selectors";
import {authActions} from "../../state/auth-reducer";
import {useAppDispatch} from "../../store/redux-utils";

export const Login = () => {
    const dispatch = useAppDispatch();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikValuesType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (values.password.length < 3) {
                errors.password = 'Too short. Password should be minimum 3 symbols.'
            }
            return errors;
        },
        onSubmit: async (values, formikHelpers) => {
            const action = await dispatch(authActions.login(values));
            if (authActions.login.rejected.match(action)){
                if(action.payload?.fieldsErrors?.length){
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
            // formik.resetForm();
        },
    })
    const isLoggedIn = useSelector(selectIsLoggedIn);
    if (isLoggedIn) {
        return <Navigate to='/'/>
    }
    return (
        <StyledFormContainer>
            <StyledInfo>
                <p>To log in get registered
                    <a href={'https://social-network.samuraijs.com/'}
                       target={'_blank'} rel={'noreferrer'}> here
                    </a> or use
                    common test account credentials:
                </p>
                <p>Email: free@samuraijs.com</p>
                <p>Password: free</p>
            </StyledInfo>
            <StyledForm onSubmit={formik.handleSubmit}>
                <StyledLabel htmlFor="email">
                    Email
                    <input type="email" {...formik.getFieldProps('email')}/>
                </StyledLabel>
                {formik.touched.email && formik.errors.email
                    ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                <StyledLabel htmlFor="password">
                    Password
                    <input type="password" {...formik.getFieldProps('password')}/>
                </StyledLabel>
                {formik.touched.password && formik.errors.password
                    ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                <StyledCheckboxLabel htmlFor="rememberMe">
                    <input type="checkbox" {...formik.getFieldProps('rememberMe')}/>
                    remember me
                </StyledCheckboxLabel>
                <StyledLoginBtn type='submit'>LOGIN</StyledLoginBtn>
            </StyledForm>
        </StyledFormContainer>
    )
}

export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  margin: 50px auto;
  gap: 10px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
  padding: 10px;
  background: white;
`
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
  justify-content: center;
`
const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`
const StyledInfo = styled.div`
  background: #00BF72FF;
  border-radius: 5px;
  padding: 10px;
  color: white;
  font-size: 14px;
`
const StyledLoginBtn = styled.button`
  margin: 15px;
  background: #00BF72FF;;
  color: white;
  font-weight: bold;
  border: none;
  padding: 8px 25px;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
  transition: .3s ease-in-out;
  text-transform: uppercase;

  &:hover {
    box-shadow: 0 5px 10px 5px rgba(0, 139, 139, 0.25);
    transform: translateY(-1px);
`

type FormikValuesType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

// export const Login2 = () => {
//     return <Grid container justifyContent='center'>
//         <Grid item justifyContent={'center'}>
//             <FormControl>
//                 <FormLabel>
//                     <p>To log in get registered
//                         <a href={'https://social-network.samuraijs.com/'}
//                            target={'_blank'} rel={'noreferrer'}> here
//                         </a>
//                     </p>
//                     <p>or use common test account credentials:</p>
//                     <p>Email: free@samuraijs.com</p>
//                     <p>Password: free</p>
//                 </FormLabel>
//                 <FormGroup>
//                     <TextField label="Email" margin="normal"/>
//                     <TextField type="password" label="Password"
//                                margin="normal"
//                     />
//                     <FormControlLabel label={'Remember me'} control={<Checkbox/>}/>
//                     <Button type={'submit'} variant={'contained'} color={'primary'}>
//                         Login
//                     </Button>
//                 </FormGroup>
//             </FormControl>
//         </Grid>
//     </Grid>
// }
