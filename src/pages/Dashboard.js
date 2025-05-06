import React from "react"
import styled from "styled-components"

import PromptMenu from "../components/PromptMenu.js"
import Calendar from "../components/Calendar.js"
import Navbar from "../components/Navbar.js"

// to keep it organized, components could be assigned to this page rather than adding it all here

const Dashboard = () => {
    return (        
        <Content>
            <Navbar/>
            <PageContainer>
                <Section>
                    <Calendar />
                </Section>
                <Section>
                    <PromptMenu />
                </Section>
            </PageContainer>
        </Content>
    )
}

const Content = styled.div`
  background-color:rgb(246, 246, 246);
  /* background-color:rgb(15, 22, 53); */
  min-height: 100vh;
`;

const PageContainer = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  flex-grow: 1;
  padding: 50px;
  gap: 20px; 
  max-width: 1200px; 
  margin: 0 auto; 
  padding-top: 100px;

  @media (max-width: 1150px) {
    flex-direction: column; 
    align-items: center; /
  }
`;

const Section = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  flex: 1; 
  min-width: 400px; 
  min-height: 500px;
  height: 550px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color:rgb(82, 84, 119);


  @media (max-width: 750px) {
    width: 100%; 
    max-width: 500px; 
  }
`;

export default Dashboard;