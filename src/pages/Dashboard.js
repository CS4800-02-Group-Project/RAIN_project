import React from "react"
import styled from "styled-components"

import Navbar from "../components/Navbar.js"
import PromptMenu from "../components/PromptMenu.js"

const Dashboard = () => {
    return (
        <Content>
            <Navbar/>
            <PageContainer>
                <PromptMenu/>
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
  padding: 20px;
`;

export default Dashboard;