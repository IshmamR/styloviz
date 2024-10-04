import { Canvas } from "@react-three/fiber";
import Scatterplot from "./components/Scatterplot";
import styled from "styled-components";
import { Suspense, useCallback, useState } from "react";
import { useProgress } from "@react-three/drei";
import Form from "./components/Form";
import axios from "axios";

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

export type PredictionResponse = {
  field: [number, number, number, number][];
  pred: number;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
};

function Loader() {
  const { progress } = useProgress();
  return <div>{progress} % loaded</div>;
}

function App() {
  const [isredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const getPredictionApiAction = useCallback(async (text: string) => {
    try {
      setPrediction(null);
      setIsPredicting(true);
      const { data } = await axios.post<PredictionResponse>(
        "http://localhost:5000",
        { input_text: text }
      );
      setPrediction(data);
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  }, []);

  return (
    <CanvasContainer>
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Scatterplot prediction={prediction} />
        </Suspense>
      </Canvas>

      <Form
        loading={isredicting}
        prediction={prediction}
        getPredictionApiAction={getPredictionApiAction}
      />
    </CanvasContainer>
  );
}

export default App;
