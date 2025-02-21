import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import styled from "styled-components";
import ImageSelector from './ImageSelector';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  width: 100%;
  background-color: bisque;
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-image: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: ${({ imageUrl }) => imageUrl ? 'transparent' : 'grey'};
  cursor: grab;
  transition: transform 0.1s ease-out;
  transform: ${({ x, y, scale }) => `translate(${x}px, ${y}px) scale(${scale})`};
  user-select: none;

  &:active {
    cursor: grabbing;
  }
  &:hover {
    outline: 2px dashed #13b47c;
  }
`;

// State and controls for moving and scaling the box
const MoveBox = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [selectedImage, setSelectedImage] = useState(null);
  const moveStep = 20;
  const zoomStep = 0.1;

// References to track dragging state and mouse offset positions
  const isDragging = useRef(false);

  const offset = useRef({ x: 0, y: 0 });

  const handleKeyboard = useCallback((event) => {
    let { x, y, scale } = position;

    switch (event.key) {
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
  }, [position]);

  const handleBoxMouseDown = useCallback((event) => {
    const {clientX, clientY} = event;

    event.stopPropagation();
    
    isDragging.current = true;
        
    offset.current = { x: clientX - position.x, y: clientY - position.y };
  }, [position]);

  const handleMouseMove = useCallback((event) => {
    const {clientX, clientY} = event;

    if (!isDragging.current) {
      return;
    }
    
    setPosition((prev) => ({
      x: clientX - offset.current.x,
      y: clientY - offset.current.y,
      scale: prev.scale,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleImageSelect = useCallback((file) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  }, []);

  useLayoutEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleKeyboard, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
    <>
      <ImageSelector onImageSelect={handleImageSelect} />

      <Container
        tabIndex={0}
      >
        <Box
          x={position.x}
          y={position.y}
          scale={position.scale}
          imageUrl={selectedImage}
          onMouseDown={handleBoxMouseDown}
        />
      </Container>
    </>
  );
};

export default MoveBox;
