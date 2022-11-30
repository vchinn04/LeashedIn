import styled from "styled-components";

export const ProfileCorner = styled.div`
  border-left: ${(props) => `1px solid ${props.border}`};
  border-right: ${(props) => `1px solid ${props.border}`};
  min-height: 100vh;
  padding-bottom: 20%;
`;

export const Button = styled.button`
  background: ${(props) => props.bg};
  border: ${(props) => props.border || "none"};
  border-radius: 50px;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  color: ${(props) => props.color};
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.padding};
  &:hover {
    background: ${(props) => props.hoverBg};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;