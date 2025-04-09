import React from "react";
import styled from "styled-components";
import LoginModal from "../components/LoginModal.js"

const Login = () => {
    return (
        <Content>
            <LoginModal />
        </Content>
    );
};

const Content = styled.div`
    background-color: #f6f6f6;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
`;

export default Login;
