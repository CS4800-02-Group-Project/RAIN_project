import React from "react";
import styled from "styled-components";
import LoginModal from "../components/LoginModal.js";
import Navbar from "../components/Navbar.js";

const Login = () => {
    return (
        <Content>
            <Navbar/>
            <PageContainer>
                <LoginModal />
            </PageContainer>
        </Content>
    );
};

const Content = styled.div`
    background-color: #f6f6f6;
    min-height: 100vh;
`;

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export default Login;
