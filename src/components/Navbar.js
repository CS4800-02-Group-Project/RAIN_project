import React from "react";
import styled from "styled-components";

export default function Navbar() {
  return (
    <Container>
      <Name>RAIN</Name>
      <div>
        <ul>
          <li>
            <Page>
                <a>Sign in</a>
            </Page>
          </li>
        </ul>
      </div>
    </Container>
  );
}

// Temporary navbar theme until further changes needed

const Name = styled.div`
  text-align: center;
  flex: 1;
  display: flex;
  font-size: 35px;
  align-items: center;
  font-style: italic;
  font-family: "Lobster", cursive;
`;

const Page = styled.div`
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-align: center;
`;

const Container = styled.nav`
  background-color: #353755;
  color: white;
  display: flex;
  justify-content: space-between;
  height: 5em;
  gap: 2rem;
  padding: 0 1rem;

  ul {
    padding: 0;
    padding-top: 15px;
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
