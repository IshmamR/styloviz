import {
  CameraControls,
  OrbitControls,
  Sphere,
  Stars,
} from "@react-three/drei";
import plotPoints from "../X_pca_tsne_coordinates.json";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BloomEffect, KernelSize } from "postprocessing";
import { PredictionResponse } from "../App";

const COLOR_MAP = {
  12: "#0000FF",
  2: "#00C850",
  8: "#00FF00",
  9: "#00FFFF",
  13: "#4169E1",
  11: "#87CEFA",
  7: "#ADFF2F",
  14: "#B600C6",
  15: "#C62E2E",
  5: "#F863FF",
  6: "#FD0101",
  10: "#FF007D",
  3: "#FF4BCD",
  4: "#FF7F50",
  1: "#FFA500",
  0: "#FFFF00",
  420: "#000000",
};

const totalLength = plotPoints.length;

type TProps = {
  prediction: PredictionResponse | null;
};

const Scatterplot: React.FC<TProps> = ({ prediction }) => {
  const cameraRef = useRef<CameraControls | null>(null);
  const bloomRef = useRef<BloomEffect | null>(null);

  const [coordinates, setCoordinates] = useState<
    [number, number, number, number][]
  >([]);
  const [xSum, setXSum] = useState(-1);
  const [ySum, setYSum] = useState(-1);
  const [zSum, setZSum] = useState(-1);

  useEffect(() => {
    let xsum = 0,
      ysum = 0,
      zsum = 0;
    const coords: [number, number, number, number][] = [];

    for (let i = 0; i < totalLength; i++) {
      const { x, y, z, label } = plotPoints[i];
      const mult = 5;
      xsum += x * mult;
      ysum += y * mult;
      zsum += z * mult;
      coords.push([x * mult, y * mult, z * mult, label]);
    }

    xsum = xsum / totalLength;
    ysum = ysum / totalLength;
    zsum = zsum / totalLength;

    setXSum(xsum);
    setYSum(ysum);
    setZSum(zsum);
    setCoordinates(coords);
  }, []);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (cameraRef.current) {
        cameraRef.current?.setLookAt(
          xSum - 300,
          ySum - 300,
          zSum - 300,
          xSum,
          ySum,
          zSum,
          true
        );
        cameraRef.current.maxZoom = 5;
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [xSum, ySum, zSum]);

  useLayoutEffect(() => {
    let handle: number;
    let i = 10;
    let sign = 1;

    function animate() {
      if (bloomRef.current) {
        bloomRef.current.intensity = i * 0.001;
        if (i > 1000) {
          sign = -1;
        } else if (i <= 500) {
          sign = 1;
        }
        i += sign;
      }
      handle = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(handle);
    };
  }, [prediction]);

  const onClickSphere = (position: number[]) => {
    cameraRef.current?.setLookAt(
      position[0] - 20,
      position[1],
      position[2],
      position[0],
      position[1],
      position[2],
      true
    );
  };

  const onDoubleClickSphere = () => {
    cameraRef.current?.setLookAt(
      xSum - 100,
      ySum - 100,
      zSum - 100,
      xSum,
      ySum,
      zSum,
      true
    );
  };

  return (
    <>
      <OrbitControls />
      <CameraControls ref={cameraRef} />

      <group position={[xSum, ySum, zSum]}>
        <Stars radius={400} fade />
      </group>

      <pointLight
        color="white"
        intensity={100}
        position={[1, 1, 1]}
        decay={1}
        distance={100}
      />
      <Sphere position={[1, 1, 1]} scale={0.05}>
        <meshStandardMaterial color="black" />
      </Sphere>

      <ambientLight intensity={1} position={[0, 0, 500]} />

      {prediction ? (
        <>
          <Sphere
            position={[
              prediction.coordinates.x * 5,
              prediction.coordinates.y * 5,
              prediction.coordinates.z * 5,
            ]}
            scale={2}
          >
            <meshStandardMaterial
              emissive={COLOR_MAP[prediction.pred as keyof typeof COLOR_MAP]}
              emissiveIntensity={20}
              color={COLOR_MAP[prediction.pred as keyof typeof COLOR_MAP]}
            />
            <EffectComposer>
              <Bloom
                ref={bloomRef as unknown as React.LegacyRef<typeof BloomEffect>}
                kernelSize={KernelSize.LARGE}
                intensity={1} // Bloom intensity
                luminanceThreshold={0.75} // Minimum luminance for bloom
                luminanceSmoothing={1} // Luminance smoothing
                radius={1} // Bloom radius
                mipmapBlur={false}
              />
            </EffectComposer>
          </Sphere>
        </>
      ) : null}

      {coordinates.map((point, index) => {
        const position: [number, number, number] = [
          point[0],
          point[1],
          point[2],
        ];
        const label = point[3] as keyof typeof COLOR_MAP;
        const color = COLOR_MAP[label];
        return (
          <group key={index.toString()}>
            <Sphere
              position={position}
              onClick={() => onClickSphere(point)}
              onDoubleClick={onDoubleClickSphere}
            >
              <meshStandardMaterial color={color} wireframe />
            </Sphere>
            <planeGeometry />
          </group>
        );
      })}
    </>
  );
};

export default Scatterplot;
