import styled from "styled-components";
import MoveBox from "./components/MoveBox";

const Title = styled.h1`
    color: #333;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  `;
    
    const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100%;
  `;

function UIContainer() {
    
  return (
    <Container>
        <Title>UI Container</Title>
        <MoveBox />
    </Container>
  )
};

export default UIContainer;
