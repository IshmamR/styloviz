import {
  CameraControls,
  OrbitControls,
  Sphere,
  Stars,
} from "@react-three/drei";
import coordsJson from "../coords.json";
import { useEffect, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const x = coordsJson["X"];
const y = coordsJson["Y"];
const z = coordsJson["Z"];

const coords: [number, number, number][] = [];

let xsum = 0,
  ysum = 0,
  zsum = 0;
for (let i = 0; i < 160; i++) {
  const index = i.toString() as keyof typeof x;
  const mult = 60;
  xsum += x[index] * (mult - 20);
  ysum += y[index] * mult;
  zsum += z[index] * mult;
  coords.push([x[index] * (mult - 20), y[index] * mult, z[index] * mult]);
}

xsum = xsum / 160;
ysum = ysum / 160;
zsum = zsum / 160;

const Scatterplot: React.FC = () => {
  const cameraRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cameraRef.current) {
        cameraRef.current?.setLookAt(
          xsum - 100,
          ysum - 100,
          zsum - 100,
          xsum,
          ysum,
          zsum,
          true
        );
        cameraRef.current.maxZoom = 5;
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
      xsum - 100,
      ysum - 100,
      zsum - 100,
      xsum,
      ysum,
      zsum,
      true
    );
  };

  return (
    <>
      <OrbitControls />
      <CameraControls ref={cameraRef} />
      {/* <Grids size={50} /> */}
      {/* <axesHelper scale={50} /> */}

      <group position={[xsum, ysum, zsum]}>
        <Stars radius={200} fade />
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

      <Sphere position={[xsum, ysum, zsum]}>
        <EffectComposer>
          <Bloom
            intensity={1.5} // Bloom intensity
            luminanceThreshold={0.5} // Minimum luminance for bloom
            luminanceSmoothing={0.9} // Luminance smoothing
            radius={9} // Bloom radius
          />
        </EffectComposer>
        <meshBasicMaterial color="white" />
      </Sphere>

      {coords.map((point, index) => (
        <group key={index.toString()}>
          <Sphere
            position={point}
            onClick={() => onClickSphere(point)}
            onDoubleClick={onDoubleClickSphere}
          >
            <meshStandardMaterial color="cyan" wireframe />
          </Sphere>
          <planeGeometry />
        </group>
      ))}
    </>
  );
};

export default Scatterplot;
