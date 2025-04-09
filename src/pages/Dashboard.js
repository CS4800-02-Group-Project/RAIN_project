import React from "react"
import styled from "styled-components"

import PromptMenu from "../components/PromptMenu.js"
import Calendar from "../components/Calendar.js"

// to keep it organized, components could be assigned to this page rather than adding it all here

const Dashboard = () => {
    return (
        <Content>
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
    background-color: #f6f6f6;
    min-height: 100vh;
    padding-top: 20px;
`;

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const Section = styled.div`
    flex: 1;
    min-width: 300px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default Dashboard;