import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import styled from "styled-components";
import ImageSelector from "./ImageSelector";
import { keepImageInside } from "../utils/keepImageInside";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  width: 50%;
  background-color: bisque;
  position: relative;
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  background: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl}) center/cover` : "grey")};
  cursor: grab;
  transition: transform 0.1s ease-out;
  transform: ${({ x, y, scale, rotation }) =>
  `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`};
  transform-origin: center;
  position: absolute;
  user-select: none;

  &:active { cursor: grabbing; }
  &:hover { outline: 2px dashed #13b47c; }
`;

const moveStep = 20;
const zoomStep = 0.1;
const minZoom = 0.5;
const rotationStep = 10;

// State and controls for moving and scaling the box
const MoveBox = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [selectedImage, setSelectedImage] = useState(null);

  // References to track dragging state and mouse offset positions
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const boxRef = useRef(null);

  const updatePosition = (newPosition) => {
    setPosition(keepImageInside(newPosition, containerRef.current, boxRef.current));
  };

  const handleKeyboard = useCallback((event) => {
    event.preventDefault();
    let { x, y, scale, rotation } = position;
  
    switch (event.key) {
      case "ArrowUp": y -= moveStep; break;
      case "ArrowDown": y += moveStep; break;
      case "ArrowLeft": x -= moveStep; break;
      case "ArrowRight": x += moveStep; break;
      case "+": case "=": scale += zoomStep; break;
      case "-": scale = Math.max(minZoom, scale - zoomStep); break;
      case "q": rotation -= rotationStep; break;
      case "e": rotation += rotationStep; break;
      default: return;
    }
  
    setPosition(() =>
      keepImageInside({ x, y, scale, rotation }, containerRef.current, boxRef.current)
    );
  }, [position]);

  // Event handlers for mouse events
  const handleBoxMouseDown = useCallback(({ clientX, clientY }) => {
    isDragging.current = true;
    offset.current = {
      x: (clientX - position.x) / position.scale,
      y: (clientY - position.y) / position.scale,
    };
  }, [position]);

  const handleMouseMove = useCallback(({ clientX, clientY }) => {
    if (!isDragging.current) return;
    updatePosition({
      x: clientX - offset.current.x * position.scale,
      y: clientY - offset.current.y * position.scale,
      scale: position.scale,
    });
  }, [position]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Event handler for image selection
  const handleImageSelect = useCallback((file) => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    },[selectedImage]);

  // Attach event listeners
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
    if (containerRef.current && boxRef.current) {
      setPosition((prev) =>
        keepImageInside(prev, containerRef.current, boxRef.current)
      );
    }
    return () => selectedImage && URL.revokeObjectURL(selectedImage);
  }, [selectedImage]);

  return (
    <>
      <ImageSelector onImageSelect={handleImageSelect} />

      <Container ref={containerRef} tabIndex={0}>
        <Box
          ref={boxRef}
          x={position.x}
          y={position.y}
          scale={position.scale}
          $rotation={position.rotation}
          $imageUrl={selectedImage}
          onMouseDown={handleBoxMouseDown}
        />
      </Container>
    </>
  );
};

export default MoveBox;