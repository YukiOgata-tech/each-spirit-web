"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const BRAND_MARK_URL = "/brand/each-spirit-mark-alpha.png";
useTexture.preload(BRAND_MARK_URL);

/**
 * 占い中の 3D ローディング「星詠みの天球儀」。
 * 外周から星屑が渦を巻いて中心の光球へ収束し、天球儀のリングが歳差運動する。
 * Lottie（ラスタ画質）を置き換えるベクター品質のアニメーション。
 * ループ再生。表示時間は呼び出し側（FortuneReveal）が制御する。
 */

const TAU = Math.PI * 2;

function rngFrom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 中心の光球（脈動する魂）。ブランドマークの背後でバックライトになる */
function AstroCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.4) * 0.12;
    if (meshRef.current) meshRef.current.scale.setScalar(pulse);
    if (lightRef.current) lightRef.current.intensity = 5 + Math.sin(t * 2.4) * 1.6;
  });
  return (
    <group>
      <pointLight ref={lightRef} color="#c4b5fd" intensity={5} distance={10} />
      {/* マークの背後に置き、bloom で柔らかい後光にする */}
      <mesh ref={meshRef} position={[0, 0, -0.55]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#e9d5ff" emissive="#a78bfa" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 中心のブランドマーク（背景透過版）。脈動しながらゆらぐ */
function BrandMark() {
  const tex = useTexture(BRAND_MARK_URL, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  const inner = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = inner.current;
    if (!g) return;
    g.scale.setScalar(1 + Math.sin(t * 2.4) * 0.045); // 光球と同期した鼓動
    g.rotation.z = Math.sin(t * 0.4) * 0.05; // ゆっくり左右に傾ぐ
    g.position.y = Math.sin(t * 0.9) * 0.06; // 浮遊
  });
  return (
    <Billboard follow>
      <group ref={inner}>
        <mesh>
          <planeGeometry args={[1.7, 1.7]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </Billboard>
  );
}

/** 歳差運動する天球儀リング（各リングに周回する小さな星） */
function GyroRings() {
  const specs = useMemo(
    () => [
      { r: 1.15, color: "#c4b5fd", speed: 0.9, tilt: 0.4 },
      { r: 1.55, color: "#f4c25b", speed: -0.62, tilt: 1.0 },
      { r: 1.95, color: "#a78bfa", speed: 0.45, tilt: 1.7 },
    ],
    [],
  );
  return (
    <group>
      {specs.map((s, i) => (
        <GyroRing key={i} {...s} />
      ))}
    </group>
  );
}

function GyroRing({ r, color, speed, tilt }: { r: number; color: string; speed: number; tilt: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    g.rotation.y = t * speed;
    g.rotation.x = tilt + Math.sin(t * speed * 0.5) * 0.35; // 歳差
  });
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.014, 10, 128]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      {/* リング上を巡る星 */}
      <mesh position={[r, 0, 0]}>
        <icosahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** 外周から中心へ渦を巻いて収束する星屑 */
function StarVortex({ count = 650 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const r = rngFrom(20260703);
    return Array.from({ length: count }, () => ({
      r0: 3.2 + r() * 4.8, // 出現半径
      a0: r() * TAU, // 初期角
      speed: 0.55 + r() * 0.75, // 収束速度
      y0: (r() * 2 - 1) * 2.4, // 初期高さ（中心に向けて平面へ潰れる）
      phase: r(), // 周回位相ずらし
    }));
  }, [count]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const span = d.r0 - 0.3;
      const p = (t * d.speed + d.phase * span) % span;
      const rr = d.r0 - p; // r0 → 0.3 に収束して外周へ戻る
      const ang = d.a0 + Math.log(d.r0 / rr) * 2.2 + t * 0.1; // 中心ほど角速度が上がる渦
      pos.setXYZ(i, Math.cos(ang) * rr, d.y0 * (rr / d.r0) * 0.55, Math.sin(ang) * rr);
    }
    pos.needsUpdate = true;
    if (pointsRef.current) pointsRef.current.rotation.z = Math.sin(t * 0.12) * 0.14;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial size={0.045} color="#e9d5ff" transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** カメラのゆらぎ（手持ち感のない、ゆっくりした揺蕩い） */
function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.3) * 0.28;
    state.camera.position.y = 1.1 + Math.sin(t * 0.22) * 0.18;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function FortuneLoading3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 6.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 全画面テイクオーバー前提の不透明ダーク背景。
          透過キャンバス＋EffectComposer の合成で背景が白っぽく飛ぶのを根本回避する */}
      <color attach="background" args={["#0b0722"]} />
      <ambientLight intensity={0.35} />
      <CameraDrift />
      <AstroCore />
      <Suspense fallback={null}>
        <BrandMark />
      </Suspense>
      <GyroRings />
      <StarVortex />
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}

export default FortuneLoading3D;
