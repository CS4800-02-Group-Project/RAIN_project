import React, { useState } from "react";
import styled from "styled-components";

import Navbar from "../components/Navbar.js"
import LoginModal from "../components/LoginModal.js"

const Login = () => {
    return (
      <Content>
        <Navbar />
        <LoginModal />
      </Content>
    );
  };
  
const Content = styled.div`
background-color: #f6f6f6;
min-height: 100vh;
`;
  
export default Login;
