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
                    <PromptMenu />
                </Section>
                <Section>
                    <Calendar />
                </Section>
            </PageContainer>
        </Content>
    )
}

const Content = styled.div`
  background-color: #f6f6f6;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-grow: 1;
  overflow: hidden;
`;

const Section = styled.div`
  width: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
;


  @media (max-width: 750px) {
    width: 100%; 
    max-width: 500px; 
  }
`;

export default Dashboard;