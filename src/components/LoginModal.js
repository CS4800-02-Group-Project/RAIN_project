import React, { useState } from "react";
import styled from "styled-components";

const LoginModal = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
      accountName: "",
      email: "",
      password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    };

    // Handle form submission
    const handleSubmit = async(e) => {
      e.preventDefault();

      const endpoint = isSignUp ? "/api/signup" : "/api/signin";

      const requestData = isSignUp ? { accountName: formData.accountName, email: formData.email, password: formData.password } : { email: formData.email, password: formData.password };

      console.log("Data sent: ", requestData);

      // backend waiting

    };
  
    return (
      <FormContainer>
      <FormBox>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <Label>Account Name</Label>
              <Input type="text" name="accountName" placeholder="Enter your account name" value={formData.accountName} onChange={handleChange} />
            </>
          )}

          <Label>School Email</Label>
          <Input type="email" name="email" placeholder="Enter your school email" value={formData.email} onChange={handleChange} />

          <Label>Password</Label>
          <Input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

          <SubmitButton type="submit">{isSignUp ? "Sign Up" : "Sign In"}</SubmitButton>
        </Form>

        <ToggleText onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Would You Like To Sign In?" : "Would You Like To Sign Up?"}
        </ToggleText>
      </FormBox>
    </FormContainer>
    );
  };
  
  const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
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
