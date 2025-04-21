import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import LoginModal from "../components/LoginModal.js";

export default function Login() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                navigate('/dashboard');
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <FormContainer>            
                <LoginModal />
        </FormContainer>        
    );
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;  
  min-height: 100vh;
  width: 100vw;
  background-color: #f4f4f4;
`;
