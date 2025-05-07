import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import styled from "styled-components";

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('userEmail');
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <Container>
      <Name>RAIN</Name>
      <div>
        <ul>
          <li>
            <Page>
              <Link to="/login" onClick={handleSignOut}>Sign Out</Link>
            </Page>
          </li>
          {/* <li>
            <Page>
              <Link to="/login">Sign-In</Link>
            </Page>
          </li> */}
          <li>
            <Page>
              <Link to="/dashboard">Dashboard</Link>
            </Page>
          </li>
        </ul>
      </div>
    </Container>
  );
}

// Temporary navbar theme until further changes needed

const Name = styled.div`
  flex: 1;
  display: flex;
  font-size: 35px;
  align-items: center;
  font-style: italic;
  font-family: "Helvetica";
`;

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-align: center;
`;

const Container = styled.nav`
  align-items: center;
  flex-shrink: 0;
  background-color: #353755;
  color: white;
  display: flex;
  justify-content: space-between;
  height: 4em;
  gap: 2rem;
  padding: 0 1rem;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    height: 100%;
    display: block;
    align-items: center;
    padding: 0.5rem; 
    border: 1px solid white;
    border-radius: 4px;
    text-align: center; 
    min-width: 100px; 
  }

  li {
    &:active {
      background-color: #555;
    }
    &:hover {
      background-color: #777;
    }
  }
`;
