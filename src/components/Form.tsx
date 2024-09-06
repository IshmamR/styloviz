import { useRef, useState } from "react";
import styled from "styled-components";

const DrawerContainer = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: calc(100vw);
  right: -25vw;
  height: 100vh;
  transition: all 0.3s ease;

  font-family: "Noto Serif Bengali", serif;
  font-optical-sizing: auto;

  &.open {
    left: 75vw;
    right: 0px;
  }
`;

const InnerComponent = styled.div`
  height: 100%;
  background-color: #002933;
  width: calc(100vw+ 40px);
  margin-left: -40px;

  display: flex;
`;

const OpenHandle = styled.div`
  width: 40px;
  height: 100%;
  background-color: cyan;
`;

const FormContainer = styled.div`
  flex: 1;
  padding: 1.5rem 1rem;
`;

const NeonButton = styled.button`
  width: 130px;
  height: 40px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  color: cyan;
  padding: 0px;
  line-height: 40px;
  border: none;
  margin-top: 2rem;

  & span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  &::before,
  &::after {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    background: cyan;
    box-shadow: 0 0 5px cyan;
    transition: all 0.3s ease;
  }

  &::before {
    height: 50%;
    width: 2px;
  }
  &::after {
    width: 20%;
    height: 2px;
  }
  &:hover:before {
    height: 100%;
  }
  &:hover:after {
    width: 100%;
  }

  & span:before,
  & span:after {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background: cyan;
    box-shadow: 0 0 5px cyan;
    transition: all 0.3s ease;
  }
  & span:before {
    width: 2px;
    height: 50%;
  }
  & span:after {
    height: 2px;
    width: 20%;
  }
  & span:hover:before {
    height: 100%;
  }
  & span:hover:after {
    width: 100%;
  }
`;

const Form: React.FC = () => {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"text" | "file">("text");

  const onClickOpenHandle = () => {
    if (!drawerRef.current) return;

    const isOpen = drawerRef.current.classList.contains("open");
    if (isOpen) {
      drawerRef.current.classList.remove("open");
    } else {
      drawerRef.current.classList.add("open");
    }
  };

  return (
    <DrawerContainer ref={drawerRef}>
      <InnerComponent>
        <OpenHandle onClick={onClickOpenHandle}></OpenHandle>
        <FormContainer>
          <h2>Author prediction</h2>
          <br />

          <p>Mode:</p>
          <input
            type="radio"
            name="mode"
            id="text"
            value="text"
            checked={mode === "text"}
            onClick={() => setMode("text")}
          />
          <label htmlFor="text">Text</label>
          <input
            type="radio"
            name="mode"
            id="file"
            value="file"
            checked={mode === "file"}
            onClick={() => setMode("file")}
          />
          <label htmlFor="file">PDF</label>
          <br />
          <br />

          {mode === "text" ? (
            <>
              <label htmlFor="text_value">Text</label>
              <br />
              <textarea
                id="text_value"
                style={{ width: "100%", height: "600px" }}
              ></textarea>
            </>
          ) : (
            <>
              <label htmlFor="file_input">File</label>
              <br />
              <input type="file" id="file_input" />
            </>
          )}
          <br />

          <NeonButton>
            <span>PREDICT</span>
          </NeonButton>
        </FormContainer>
      </InnerComponent>
    </DrawerContainer>
  );
};

export default Form;
