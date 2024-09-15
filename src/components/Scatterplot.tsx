import {
  CameraControls,
  OrbitControls,
  Sphere,
  Stars,
} from "@react-three/drei";
// import coordsJson from "../coords.json";
import plotPoints from "../X_pca_tsne_coordinates.json";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BloomEffect, KernelSize } from "postprocessing";
import { PredictionResponse } from "../App";

// const x = coordsJson["X"];
// const y = coordsJson["Y"];
// const z = coordsJson["Z"];

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
      const mult = 10;
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

  useEffect(() => {
    if (prediction) {
      let xsum = 0,
        ysum = 0,
        zsum = 0;

      const field = prediction.field.map(
        (v) => v.map((n) => n * 10) as [number, number, number, number]
      );
      field.shift();

      console.log(field.length);

      const predX = prediction.coordinates.x.toFixed(6);
      const predY = prediction.coordinates.y.toFixed(6);
      const predZ = prediction.coordinates.z.toFixed(6);
      console.log(predX, predY, predZ);

      const pointsToPlot: [number, number, number, number][] = [];
      for (let i = 0; i < field.length; i++) {
        const xMatch = field[i][0].toFixed(4) === predX;
        const yMatch = field[i][1].toFixed(4) === predY;
        const zMatch = field[i][2].toFixed(4) === predZ;

        const mult = 10;
        xsum += field[i][0] * mult;
        ysum += field[i][1] * mult;
        zsum += field[i][2] * mult;
        // if (xMatch || yMatch || zMatch) {
        //   console.log(xMatch, yMatch, zMatch);
        // }
        if (xMatch && yMatch && zMatch) {
          pointsToPlot.push([0, 0, 0, 420]);
        } else {
          pointsToPlot.push(field[i]);
        }
      }

      setXSum(xsum / field.length);
      setXSum(ysum / field.length);
      setXSum(zsum / field.length);

      setCoordinates(pointsToPlot);
    }
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
      {/* <Grids size={50} /> */}
      {/* <axesHelper scale={50} /> */}

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
              prediction.coordinates.x * 10,
              prediction.coordinates.y * 10,
              prediction.coordinates.z * 10,
            ]}
            scale={2}
          >
            <meshStandardMaterial
              emissive={COLOR_MAP[prediction.kmeans as keyof typeof COLOR_MAP]}
              emissiveIntensity={20}
              // toneMapped={false}
              color={COLOR_MAP[prediction.kmeans as keyof typeof COLOR_MAP]}
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
