import React from "react"
import styled from "styled-components"

import Navbar from "../components/Navbar.js"
import PromptMenu from "../components/PromptMenu.js"
import Calendar from "../components/Calendar.js"

// to keep it organized, components could be assigned to this page rather than adding it all here

const Dashboard = () => {
    return (
        <Content>
            <Navbar/>
            <PageContainer>
              <Section>
                <Calendar/>
              </Section>
              <Section>
                <PromptMenu/>
              </Section>
            </PageContainer>
        </Content>
    )
}

const Content = styled.div`
  background-color: #f6f6f6;
  min-height: 100vh;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 50px;
`;

const Section = styled.div`
  padding: 70px 30px; 
  border: 5px;
`;


export default Dashboard;