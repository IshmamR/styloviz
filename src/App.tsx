import { Canvas } from "@react-three/fiber";
import Scatterplot from "./components/Scatterplot";
import styled from "styled-components";
import { Suspense } from "react";
import { useProgress } from "@react-three/drei";
import Form from "./components/Form";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 0.652);
  /* background-image: url("https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2008/03/03/hitler276.jpg?width=465&dpr=1&s=none"); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

function Loader() {
  const { progress } = useProgress();
  return <div>{progress} % loaded</div>;
}

function App() {
  return (
    <CanvasContainer>
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Scatterplot />
        </Suspense>
      </Canvas>

      <Form />
    </CanvasContainer>
  );
}

export default App;
