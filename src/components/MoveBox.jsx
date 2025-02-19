import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  cursor: grab;
  transition: transform 0.1s ease-out;
  transform: ${({ x, y, scale }) => `translate(${x}px, ${y}px) scale(${scale})`};
  user-select: none;
`;

// State and controls for moving and scaling the box
const MoveBox = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const moveStep = 20;
  const zoomStep = 0.1;
  const containerRef = useRef(null);

// References to track dragging state and mouse offset positions
  const isDragging = useRef(false);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

// Auto-focus the container when the component mounts to capture keyboard events
useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeybord = (e) => {
      let { x, y, scale } = position;
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
        case "+":
        case "=":
          scale += zoomStep;
          break;
        case "-":
          scale = Math.max(0.5, scale - zoomStep);
          break;
        default:
          return;
      }
      setPosition({ x, y, scale });
    };

    document.addEventListener("keydown", handleKeybord);
    return () => document.removeEventListener("keydown", handleKeybord);
  }, [position]);

  // Handle mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    offsetX.current = e.clientX - position.x;
    offsetY.current = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition((prev) => ({
      x: e.clientX - offsetX.current,
      y: e.clientY - offsetY.current,
      scale: prev.scale,
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Add event listeners for mouse events
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      tabIndex={0}
      style={{ outline: "none", width: "100%", height: "100vh" }}
    >
      <Box
        x={position.x}
        y={position.y}
        scale={position.scale}
        onMouseDown={handleMouseDown}
      />
    </Container>
  );
};

export default MoveBox;
