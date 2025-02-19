import { useState, useRef } from "react";
import styled from "styled-components";

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  cursor: grab;
  transition: transform 0.1s ease-out;
  transform: ${({ x, y }) => `translate(${x}px, ${y}px)`};
`;

const MoveBox = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const moveStep = 20;

  const isDragging = useRef(false);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    let { x, y } = position;
    switch (e.key) {
      case "ArrowUp":
        y -= moveStep;
        break;
      case "ArrowDown":
        y += moveStep;
        break;
      case "ArrowLeft":
        x -= moveStep;
        break;
      case "ArrowRight":
        x += moveStep;
        break;
      default:
        return;
    }
    setPosition({ x, y });
  };

  // Handle mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    offsetX.current = e.clientX - position.x;
    offsetY.current = e.clientY - position.y;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - offsetX.current,
      y: e.clientY - offsetY.current,
    });
  };

  // Handle mouse release
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      <Box x={position.x} y={position.y} onMouseDown={handleMouseDown} />
    </div>
  );
};

export default MoveBox;
