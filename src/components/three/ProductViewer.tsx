"use client";

import { useEffect } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface ViewerProps {
  modelUrl: string;
  userImage?: string;
  targetMaterial?: string;
  color?: string;
  onMaterialsDetected?: (list: string[]) => void;
}

function Model({
  modelUrl,
  userImage,
  targetMaterial,
  color,
  onMaterialsDetected,
}: ViewerProps) {
  const { scene, materials } = useGLTF(modelUrl);

  // Detect materials (send list to parent)
  useEffect(() => {
    const list = Object.keys(materials);
    onMaterialsDetected?.(list);
  }, [materials, onMaterialsDetected]);

  // Apply uploaded image texture
  useEffect(() => {
    if (userImage && targetMaterial) {
      const mat = materials[targetMaterial] as THREE.MeshStandardMaterial;

      if (mat) {
        const texture = new THREE.TextureLoader().load(userImage);
        mat.map = texture;
        mat.needsUpdate = true;
      }
    }
  }, [userImage, targetMaterial, materials]);

  // Apply color
  useEffect(() => {
    if (color && targetMaterial) {
      const mat = materials[targetMaterial] as THREE.MeshStandardMaterial;

      if (mat) {
        mat.color = new THREE.Color(color);
        mat.needsUpdate = true;
      }
    }
  }, [color, targetMaterial, materials]);

  return <primitive object={scene} scale={1.5} />;
}

export default function ProductViewer(props: ViewerProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Model {...props} />
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
}
