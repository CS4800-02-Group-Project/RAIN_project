import React, { useState } from "react";
import styled from "styled-components";

const LoginModal = () => {
    const [isSignUp, setIsSignUp] = useState(false);
  
    return (
      <FormContainer>
        <FormBox>
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
  
          <Form>
            {isSignUp && (
              <>
                <Label>Account Name</Label>
                <Input type="text" placeholder="Enter your account name" />
              </>
            )}
  
            <Label>School Email</Label>
            <Input type="email" placeholder="Enter your school email" />
  
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" />
  
            <SubmitButton>{isSignUp ? "Sign Up" : "Sign In"}</SubmitButton>
          </Form>
  
          <ToggleText onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "New here? Sign Up"}
          </ToggleText>
        </FormBox>
      </FormContainer>
    );
  };
  
  const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f6f6f6;
  `;
  
  const FormBox = styled.div`
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 350px;
    text-align: center;
  `;
  
  const Form = styled.form`
    display: flex;
    flex-direction: column;
  `;
  
  const Label = styled.label`
    text-align: left;
    margin: 8px 0 4px;
    font-size: 14px;
    font-weight: bold;
  `;
  
  const Input = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
    outline: none;
  `;
  
  const SubmitButton = styled.button`
    padding: 12px;
    font-size: 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  
    &:hover {
      background-color: #218838;
    }
  `;
  
  const ToggleText = styled.p`
    margin-top: 15px;
    font-size: 14px;
    color: #007bff;
    cursor: pointer;
  
    &:hover {
      text-decoration: underline;
    }
  `;

export default LoginModal;
