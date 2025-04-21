import React, { useState } from "react";
import styled from "styled-components";
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


const LoginModal = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [uid, setUid] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "email"){
      setEmail(e.target.value);
    } else if (e.target.name === "password"){
      setPassword(e.target.value);
    }
    
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    console.log("handleSignUp called");

    try {
        console.log("Trying to create user with email:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created successfully:", user);

        const userDoc = doc(db, 'users', user.uid);
        console.log("User doc reference created:", userDoc);

        const docSnap = await getDoc(userDoc);
        console.log("Document snapshot:", docSnap);

        if (!docSnap.exists()) {
            console.log("Document does not exist, creating...");
            await setDoc(userDoc, { email: user.email });
            console.log("Document created with email:", user.email);
        } else {
            console.log("Document already exists.");
        }

        console.log('User signed up:', user);
        navigate('/dashboard');
    } catch (error) {
        console.error("Error during sign-up:", error);
        setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
      e.preventDefault();
      setError('');
      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log('User signed in:', user);
          navigate('/dashboard');
      } catch (error) {
          setError(error.message);
      }
  };


  return (
    <FormContainer>
    <FormBox>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <Form onSubmit={isSignUp?handleSignUp:handleSignIn}>

        <Label>School Email</Label>
        <Input type="email" name="email" placeholder="Enter your school email" value={email} onChange={handleChange} required/>

        <Label>Password</Label>
        <Input type="password" name="password" placeholder="Enter your password" value={password} onChange={handleChange} required/>

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
    min-height: 100vh;
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
