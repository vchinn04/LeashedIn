import styled from "styled-components";

export const PeopleFlex = styled.div`
  display: flex;
  padding: ${(props) => (props.padding ? props.padding : "10px 15px")};
  color: rgb(0, 0, 0);
  border-bottom: ${(props) => `1px solid ${props.border}`};
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const PeopleDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 15px;
    font-weight: 700;
  }
  h3:hover {
    text-decoration: underline;
  }
  p {
    color: rgb(101, 119, 134);
    font-weight: 400;
    font-size: 15px;
  }
  h3,
  p {
    margin: 0;
    line-height: 1.23;
  }
`;

export const EmptyMsg = styled.div`
  text-align: center;
  color: rgb(101, 119, 134);
  margin-top: 4px;
`;

export const UserImage = styled.img`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  margin-right: 10px;
`;