"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { LEVEL, type FortuneResult } from "@/lib/fortune";
import { classifyCrystal, type CrystalForm, type CrystalPoint } from "@/lib/crystal-form";

const UP = new THREE.Vector3(0, 1, 0);
const tmpColor = new THREE.Color();

// ── 中心ジェムのジオメトリ（揃い具合で面数、ばらつきで歪み） ──────────────────────

function vertexNoise(x: number, y: number, z: number, seed: number): number {
  let h = seed >>> 0;
  h = Math.imul(h ^ (x | 0), 2654435761) >>> 0;
  h = Math.imul(h ^ (y | 0), 2246822519) >>> 0;
  h = Math.imul(h ^ (z | 0), 3266489917) >>> 0;
  h ^= h >>> 15;
  return ((h >>> 0) / 4294967296) * 2 - 1;
}

function buildGemGeometry(form: CrystalForm): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(form.radius, form.coreDetail).toNonIndexed();
  const amp = form.lumpiness * form.radius;
  if (amp > 1e-4) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const len = v.length();
      const dx = len > 1e-4 ? v.x / len : 0;
      const dy = len > 1e-4 ? v.y / len : 1;
      const dz = len > 1e-4 ? v.z / len : 0;
      const nn = vertexNoise(Math.round(v.x * 1000), Math.round(v.y * 1000), Math.round(v.z * 1000), form.seed);
      const d = nn * amp;
      pos.setXYZ(i, v.x + dx * d, v.y + dy * d, v.z + dz * d);
    }
    pos.needsUpdate = true;
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 結晶ポイント（カテゴリごとの色付きトゲ） ──────────────────────────────────────

function CrystalPointMesh({
  point,
  baseRadius,
  hovered,
  onHover,
}: {
  point: CrystalPoint;
  baseRadius: number;
  hovered: boolean;
  onHover?: (key: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const color = LEVEL[point.band].color;

  const dir = useMemo(() => new THREE.Vector3(...point.dir).normalize(), [point.dir]);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(UP, dir), [dir]);
  const position = useMemo(
    () => dir.clone().multiplyScalar(baseRadius * 0.62 + point.length / 2),
    [dir, baseRadius, point.length],
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(matRef.current.emissiveIntensity, hovered ? 2.8 : 0.95, 6, delta);
    }
    if (groupRef.current) {
      const s = THREE.MathUtils.damp(groupRef.current.scale.x, hovered ? 1.12 : 1, 8, delta);
      groupRef.current.scale.setScalar(s);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      quaternion={quaternion}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover?.(point.key);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover?.(null);
        document.body.style.cursor = "auto";
      }}
    >
      {/* 六角の結晶ポイント（柱＋尖り） */}
      <mesh position={[0, point.length * 0.28, 0]}>
        <coneGeometry args={[0.12, point.length * 0.72, 6]} />
        <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.18} flatShading />
      </mesh>
      <mesh position={[0, -point.length * 0.18, 0]}>
        <cylinderGeometry args={[0.12, 0.06, point.length * 0.36, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.1} roughness={0.25} flatShading />
      </mesh>
    </group>
  );
}

// ── 結晶本体 ──────────────────────────────────────────────────────────────────

function CrystalRig({
  result,
  form,
  hovered,
  onHover,
  scrollProgress,
  pointer,
  spinOnly,
}: {
  result: FortuneResult;
  form: CrystalForm;
  hovered: string | null;
  onHover?: (key: string | null) => void;
  scrollProgress?: MutableRefObject<number>;
  pointer?: MutableRefObject<{ x: number; y: number }>;
  spinOnly?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);

  const overallColor = LEVEL[result.overall.band].color;

  const gemGeometry = useMemo(() => buildGemGeometry(form), [form]);
  useEffect(() => () => gemGeometry.dispose(), [gemGeometry]);

  const focusColor = useMemo(() => {
    if (!hovered) return overallColor;
    const c = result.categories.find((cat) => cat.key === hovered);
    return c ? LEVEL[c.band].color : overallColor;
  }, [hovered, result, overallColor]);

  const coreRadius = Math.min(0.34, form.radius * 0.45);

  useFrame((state, delta) => {
    const g = group.current;
    if (g) {
      const t = state.clock.elapsedTime;
      if (spinOnly) {
        // モバイル: スクロール/傾き非依存で、設計した一定速度でその場回転
        g.rotation.y = t * 0.35;
        g.rotation.x = Math.sin(t * 0.32) * 0.12;
      } else {
        const px = pointer?.current.x ?? state.pointer.x;
        const py = pointer?.current.y ?? state.pointer.y;
        const scroll = scrollProgress?.current ?? 0;
        g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t * 0.1 + scroll * Math.PI * 1.4 + px * 0.95, 5, delta);
        g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.55 + scroll * 0.3, 5, delta);
      }
      g.position.y = Math.sin(t * 0.8) * 0.05;
    }
    if (coreLight.current) {
      coreLight.current.intensity = (form.isPerfect ? 5.4 : 4.4) + Math.sin(state.clock.elapsedTime * 2.2) * 1.1;
    }
    if (coreMat.current) {
      tmpColor.set(focusColor);
      const k = 1 - Math.exp(-6 * delta);
      coreMat.current.emissive.lerp(tmpColor, k);
      coreMat.current.color.lerp(tmpColor, k);
      coreMat.current.emissiveIntensity = THREE.MathUtils.damp(coreMat.current.emissiveIntensity, hovered ? 3.1 : 2.3, 6, delta);
    }
  });

  return (
    <group ref={group} scale={1.05}>
      {/* 内部の魂（強発光・bloom の光源） */}
      <pointLight ref={coreLight} color={overallColor} intensity={4.4} distance={6} />
      <mesh>
        <icosahedronGeometry args={[coreRadius, 0]} />
        <meshStandardMaterial ref={coreMat} color={overallColor} emissive={overallColor} emissiveIntensity={2.3} toneMapped={false} />
      </mesh>

      {/* ガラスの多面ジェム（揃い具合で面数、ばらつきで歪み） */}
      <mesh geometry={gemGeometry}>
        <MeshTransmissionMaterial
          thickness={0.85}
          roughness={0.08}
          transmission={1}
          ior={1.7}
          chromaticAberration={0.55}
          anisotropy={0.3}
          distortion={0.32}
          distortionScale={0.4}
          temporalDistortion={0.2}
          color={overallColor}
          background={new THREE.Color("#0a0820")}
        />
      </mesh>

      {/* 6本の結晶ポイント（カテゴリごとに長さ・色） */}
      {form.points.map((p) => (
        <CrystalPointMesh key={p.key} point={p} baseRadius={form.radius} hovered={hovered === p.key} onHover={onHover} />
      ))}
    </group>
  );
}

// ── アンビエント3D層（ページ全体を包む背景の動き） ──────────────────────────────

function ambientRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 奥行きのある星粒。ゆっくり回転＋スクロールで視差。 */
function StarField({ scrollProgress, spinOnly }: { scrollProgress?: MutableRefObject<number>; spinOnly?: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const r = ambientRng(7);
    const N = 460;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const rad = 7 + r() * 9;
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      arr[i * 3] = rad * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = rad * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.012;
      // モバイル(spinOnly)はスクロール非依存の一定ドリフト
      ref.current.rotation.x = spinOnly ? t * 0.01 : (scrollProgress?.current ?? 0) * 0.4;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} color="#ddd6fe" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** 漂う結晶片の群れ（instanced）。スクロールで視差移動・全体回転。 */
function AmbientShards({
  scrollProgress,
  pointer,
  spinOnly,
  count = 46,
}: {
  scrollProgress?: MutableRefObject<number>;
  pointer?: MutableRefObject<{ x: number; y: number }>;
  spinOnly?: boolean;
  count?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  const geo = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.25, transparent: true, opacity: 0.82, flatShading: true }),
    [],
  );
  const instances = useMemo(() => {
    const r = ambientRng(99);
    const palette = ["#c4b5fd", "#f4c25b", "#e9d5ff", "#a78bfa"];
    return Array.from({ length: count }, (_, i) => ({
      x: (r() * 2 - 1) * 6,
      y: (r() * 2 - 1) * 8,
      z: -1.5 - r() * 4.5,
      s: 0.03 + r() * 0.11,
      rx: r() * Math.PI,
      ry: r() * Math.PI,
      color: palette[i % palette.length],
    }));
  }, [count]);

  useEffect(() => {
    if (!mesh.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    instances.forEach((it, i) => {
      e.set(it.rx, it.ry, 0);
      q.setFromEuler(e);
      v.set(it.x, it.y, it.z);
      sc.setScalar(it.s);
      m.compose(v, q, sc);
      mesh.current!.setMatrixAt(i, m);
      mesh.current!.setColorAt(i, tmpColor.set(it.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [instances]);

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (spinOnly) {
      // モバイル: スクロール/ポインタに依存せず、その場でゆっくり漂う
      g.rotation.y = t * 0.03;
      g.position.y = THREE.MathUtils.damp(g.position.y, Math.sin(t * 0.2) * 0.6, 3, delta);
      return;
    }
    const scroll = scrollProgress?.current ?? 0;
    const px = pointer?.current.x ?? 0;
    g.rotation.y = t * 0.03 + px * 0.18;
    g.position.y = THREE.MathUtils.damp(g.position.y, scroll * 3.2, 3, delta); // スクロール視差
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geo, mat, count]} />
    </group>
  );
}

/** 背後でゆっくり回る星座環（ブランドの占星盤を想起）。 */
function CosmicRing() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.035;
  });
  return (
    <group ref={ref} position={[0, 0, -2.8]} rotation={[Math.PI / 2.6, 0, 0]}>
      <mesh>
        <torusGeometry args={[3.5, 0.012, 8, 140]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.28} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.9, 0.008, 8, 120]} />
        <meshBasicMaterial color="#f4c25b" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function FateCrystalScene({
  result,
  hovered,
  onHover,
  scrollProgress,
  spinOnly,
}: {
  result: FortuneResult;
  hovered: string | null;
  onHover?: (key: string | null) => void;
  scrollProgress?: MutableRefObject<number>;
  /** モバイル等: スクロール/ポインタ/端末の傾きに依存せず一定速度で回転させる */
  spinOnly?: boolean;
}) {
  const form = useMemo(() => classifyCrystal(result), [result]);
  const pointer = useRef({ x: 0, y: 0 });

  // PC のみ: カーソル位置に追従。spinOnly（モバイル）では追従しない。
  // 端末の傾き（deviceorientation）連動は不安定なため廃止。
  useEffect(() => {
    if (spinOnly) return;
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, [spinOnly]);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // touchAction: pan-y で、モバイルでもキャンバス上から縦スクロールできるようにする
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      {/* ページ全体を包むアンビエント3D層 */}
      <StarField scrollProgress={scrollProgress} spinOnly={spinOnly} />
      <CosmicRing />
      <AmbientShards scrollProgress={scrollProgress} pointer={pointer} spinOnly={spinOnly} />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
        <CrystalRig result={result} form={form} hovered={hovered} onHover={onHover} scrollProgress={scrollProgress} pointer={pointer} spinOnly={spinOnly} />
      </Float>
      <Environment preset="night" />
      <EffectComposer>
        <Bloom mipmapBlur intensity={form.isPerfect ? 1.1 : 0.92} luminanceThreshold={0.7} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}

export default FateCrystalScene;
