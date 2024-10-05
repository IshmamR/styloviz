import { useRef, useState } from "react";
import styled from "styled-components";
import { PredictionResponse } from "../App";
import { COLOR_MAP } from "../assets/data";

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

const AUTHOR_MAP = {
  shunil_gongopaddhay: 12,
  humayun_ahmed: 2,
  shomresh: 8,
  shordindu: 9,
  tarashonkor: 13,
  shottojit_roy: 11,
  shirshendu: 7,
  toslima_nasrin: 14,
  zahir_rayhan: 15,
  nihar_ronjon_gupta: 5,
  robindronath: 6,
  shorotchandra: 10,
  manik_bandhopaddhay: 3,
  nazrul: 4,
  bongkim: 1,
  MZI: 0,
};

const AUTHOR_ARRAY = Object.keys(AUTHOR_MAP).reduce((arr: string[], key) => {
  arr[AUTHOR_MAP[key as keyof typeof AUTHOR_MAP]] = key;
  return arr;
}, []);

type TProps = {
  prediction: PredictionResponse | null;
  loading: boolean;
  getPredictionApiAction: (text: string) => void;
};

const Form: React.FC<TProps> = ({
  getPredictionApiAction,
  prediction,
  loading,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const textRef = useRef<HTMLTextAreaElement | null>(null);

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

  const onClickPredict = () => {
    if (!textRef.current) return;
    const value = textRef.current.value;
    getPredictionApiAction(value);
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
            onChange={() => setMode("text")}
          />
          <label htmlFor="text">Text</label>
          {/* <input
            type="radio"
            name="mode"
            id="file"
            value="file"
            checked={mode === "file"}
            onChange={() => setMode("file")}
          />
          <label htmlFor="file">PDF</label> */}
          <br />
          <br />

          {mode === "text" ? (
            <>
              <label htmlFor="text_value">Text</label>
              <br />
              <textarea
                id="text_value"
                style={{ width: "100%", height: "400px" }}
                ref={textRef}
              ></textarea>
            </>
          ) : (
            <>
              <label htmlFor="file_input">File</label>
              <br />
              <input type="file" id="file_input" />
            </>
          )}

          <NeonButton disabled={loading} onClick={onClickPredict}>
            <span>PREDICT</span>
          </NeonButton>
          <br />
          <br />
          {prediction ? (
            <>
              <p>
                Predicted author:&nbsp;
                <b>{AUTHOR_ARRAY[prediction.pred]}</b>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    marginLeft: 4,
                    background:
                      COLOR_MAP[prediction.pred as keyof typeof COLOR_MAP],
                  }}
                ></span>
              </p>
            </>
          ) : null}
        </FormContainer>
      </InnerComponent>
    </DrawerContainer>
  );
};

export default Form;
