import React, {Component} from "react";
import {TextField, Button} from "material-ui";
import styled from "styled-components";
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

import FormValidator from "./../../utils/Validator/FormValidator";
import Validate from "./../../utils/Validator/Validate";

const formConfiguration = {
    email: {
        types: "email, required"
    },
    username: {
        types: "required",
        min: 5,
        max: 8
    },
    password: {
        types: "required",
        min: 10,
        max: 60
    }
};

const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            id
        }
    }
`;

const StyledDiv = styled.div`
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    padding: 3rem 0;
    justify-content: flex-start;
    align-items: center;
    h1 {
        text-align: center;
        font-size: 3rem;

        @media only screen and (min-width: ${props => props.theme.desktop}) {
            font-size: 4.5rem;
        }
    }
    form {
        display: flex;
        flex-flow: column;
        padding: 0 1rem;
        width: 80%;
        max-width: 80rem;
        justify-content: space-between;
        align-items: center;  
        label {
            font-size: 2rem;
        }
        input { 
            font-size: 1.6rem;

             @media only screen and (min-width: ${props => props.theme.desktop}) {
                font-size: 3rem;
            }
        }
        button {
            margin: 0;
            margin-top: 2rem;
            font-size: 1.6rem;

             @media only screen and (min-width: ${props => props.theme.desktop}) {
                font-size: 2rem;
            }
        }

        > *:not(:last-child){
            margin-bottom: 2rem;
        }

        p {
            font-size: 2rem;
            text-align: center;
        }
    }
`;

export default class SignUp extends Component {
    state = {
        form: {
            validation: {
                fields: {
                    email: false,
                    username: false,
                    password: false
                },
                valid: false
            },
            email: "",
            username: "",
            password: ""
        }
    }

    setInputValue = (name, value) => {
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                [name]: value
            }
        }));
    }

    setFormValidation = state => {
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                validation: state
            }
        }));
    }

    sendForm = (createUser, e) => {
        e.preventDefault();

        if (!this.state.form.validation.valid){
            return;
        }

        const {email, username, password} = this.state.form;

        createUser({
            variables: {
                username,
                email,
                password
            }
        })
    }

	render() {
        const {email, username, password} = this.state.form;
        const emailIsNotValid = !this.state.form.validation.fields.email && Boolean(email);
        const usernameIsNotValid = !this.state.form.validation.fields.username && Boolean(username);
        const passwordIsNotValid = !this.state.form.validation.fields.password && Boolean(password);
        const {setFormValidation, sendForm, setInputValue} = this;
		return (
            <Mutation mutation={CREATE_USER}>
                {(createUser, {loading, error, data}) => (
                    <StyledDiv>
                        <FormValidator configuration={formConfiguration} getState={setFormValidation}>
                            <h1>Inscrivez-vous, parce que c'est cool !</h1>
                            <form onSubmit={e => sendForm(createUser, e)}>
                                <Validate name="email">
                                    <TextField 
                                        label="Email"
                                        placeholder="Entrez votre adresse mail"
                                        inputProps={{
                                            type: "email"
                                        }}
                                        onChange={e => setInputValue("email", e.target.value)}
                                        value={email}
                                        error={emailIsNotValid}
                                        fullWidth
                                        required/>
                                </Validate>
                                <Validate name="username">
                                    <TextField 
                                        label="Nom d'utilisateur"
                                        placeholder="Choisissez un nom d'utilisateur"
                                        onChange={e => setInputValue("username", e.target.value)}
                                        value={username}
                                        error={usernameIsNotValid}
                                        fullWidth
                                        required />
                                </Validate>
                                <Validate name="password">
                                    <TextField 
                                        label="Mot de passe"
                                        placeholder="Imaginez un mot de passe"
                                        inputProps={{
                                            type: "password"
                                        }}
                                        onChange={e => setInputValue("password", e.target.value)}
                                        value={password}
                                        error={passwordIsNotValid}
                                        
                                        fullWidth
                                        required />
                                </Validate>
                                {!data && <Button variant="raised" size="large" color="primary" type="submit">S'inscrire</Button>}
                                {data && <p>Bienvenue dans la confrérie, connectes-toi et on te trouvera des amis !</p>}
                                {loading && <p>Chuuuuut, ça charge...</p>}
                                {error && <p>Oups, tu as essayé d'usurper l'identité d'un autre utilisateur, essaie encore...</p>}
                            </form>
                        </FormValidator>
                    </StyledDiv>
                )}
            </Mutation>
		);
	}
}
