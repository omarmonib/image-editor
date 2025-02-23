import PropTypes from "prop-types";
import { useCallback, useRef } from "react";
import styled from "styled-components";

const Button = styled.button`
  padding: 10px 20px;
  background-color: #13b47c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0f9665;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageSelector = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    onImageSelect(file);
    event.target.value = "";
  }, [onImageSelect]);

  return (
    <>
      <Button onClick={handleClick}>Select Image</Button>
      <HiddenInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
    </>
  );
};

ImageSelector.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
};

export default ImageSelector;
