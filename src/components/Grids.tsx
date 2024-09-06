import { Plane, Text } from "@react-three/drei";

type TSize = { size: number };

const XZPlane = ({ size }: TSize) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[1.5 * Math.PI, 0, 0]}
    position={[size / 2, 0, size / 2]}
  >
    {/* <meshStandardMaterial attach="material" color="#f9c74f" wireframe /> */}
    <meshStandardMaterial attach="material" color="#BABABA" wireframe />
  </Plane>
);

const XYPlane = ({ size }: TSize) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, 0, 0]}
    position={[size / 2, size / 2, 0]}
  >
    <meshStandardMaterial attach="material" color="#BABABA" wireframe />
  </Plane>
);

const YZPlane = ({ size }: TSize) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, Math.PI / 2, 0]}
    position={[0, size / 2, size / 2]}
  >
    {/* <meshStandardMaterial attach="material" color="#80ffdb" wireframe /> */}
    <meshStandardMaterial attach="material" color="#BABABA" wireframe />
  </Plane>
);

export default function Grids({ size }: TSize) {
  return (
    <group>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[size / 2 + 1, 0, 0]}
        scale={[2, 2, 2]}
      >
        X+
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[-size / 2 - 1, 0, 0]}
        scale={[2, 2, 2]}
      >
        X-
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, size / 2 + 1, 0]}
        scale={[2, 2, 2]}
      >
        Y+
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, -size / 2 - 1, 0]}
        scale={[2, 2, 2]}
      >
        Y-
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, 0, size / 2 + 1]}
        scale={[2, 2, 2]}
      >
        Z+
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, 0, -size / 2 - 1]}
        scale={[2, 2, 2]}
      >
        Z-
      </Text>
      <XZPlane size={size} />
      <XYPlane size={size} />
      <YZPlane size={size} />
    </group>
  );
}
