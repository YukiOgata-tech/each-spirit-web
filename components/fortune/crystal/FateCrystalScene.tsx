"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LEVEL, type FortuneResult } from "@/lib/fortune";
import { classifyCrystal, type CrystalCore, type CrystalForm, type CrystalPoint } from "@/lib/crystal-form";

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;
const tmpColor = new THREE.Color();
const tmpQuat = new THREE.Quaternion();

// 結晶内部に封じるブランドマーク（背景透過版）。ローディング側と同じ URL なのでキャッシュ共有
const BRAND_MARK_URL = "/brand/each-spirit-mark-alpha.png";
useTexture.preload(BRAND_MARK_URL);

// ── 練成（形成）アニメーションのタイムライン（秒） ─────────────────────────────
// lib/crystal-form.ts の CRYSTAL_FORMATION_MS がこの合計をカバーする
const FORMATION_CORE_SEC = 1.5; // コア本体が育つ時間
const FORMATION_POINT_DELAY = 1.05; // カテゴリ結晶が生え始めるまで
const FORMATION_POINT_STAGGER = 0.13; // 1本ごとの遅延
const FORMATION_POINT_SEC = 0.7; // 1本が伸び切る時間

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// ── ジオメトリ生成 ────────────────────────────────────────────────────────────

function vertexNoise(x: number, y: number, z: number, seed: number): number {
  let h = seed >>> 0;
  h = Math.imul(h ^ (x | 0), 2654435761) >>> 0;
  h = Math.imul(h ^ (y | 0), 2246822519) >>> 0;
  h = Math.imul(h ^ (z | 0), 3266489917) >>> 0;
  h ^= h >>> 15;
  return ((h >>> 0) / 4294967296) * 2 - 1;
}

/** 多面ジェム: icosahedron + シードノイズによる歪み */
function buildGemGeometry(radius: number, detail: number, lumpiness: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail).toNonIndexed();
  const amp = lumpiness * radius;
  if (amp > 1e-4) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const len = v.length();
      const dx = len > 1e-4 ? v.x / len : 0;
      const dy = len > 1e-4 ? v.y / len : 1;
      const dz = len > 1e-4 ? v.z / len : 0;
      const nn = vertexNoise(Math.round(v.x * 1000), Math.round(v.y * 1000), Math.round(v.z * 1000), seed);
      const d = nn * amp;
      pos.setXYZ(i, v.x + dx * d, v.y + dy * d, v.z + dz * d);
    }
    pos.needsUpdate = true;
  }
  geo.computeVertexNormals();
  return geo;
}

/** コア形状（ファミリーごと）を 1 つの BufferGeometry に統合する（透過マテリアルを 1 枚で済ませる） */
function buildCoreGeometry(core: CrystalCore, seed: number): THREE.BufferGeometry {
  switch (core.kind) {
    case "gem":
      return buildGemGeometry(core.radius, core.detail, core.lumpiness, seed);
    case "orb":
      return new THREE.SphereGeometry(core.radius, 48, 32);
    case "prism": {
      const column = new THREE.CylinderGeometry(core.radius, core.radius, core.height, 6, 1).toNonIndexed();
      const top = new THREE.ConeGeometry(core.radius, core.capHeight, 6).toNonIndexed();
      top.translate(0, core.height / 2 + core.capHeight / 2, 0);
      const bottom = new THREE.ConeGeometry(core.radius, core.capHeight, 6).toNonIndexed();
      bottom.rotateX(Math.PI);
      bottom.translate(0, -(core.height / 2 + core.capHeight / 2), 0);
      const merged = mergeGeometries([column, top, bottom]);
      column.dispose();
      top.dispose();
      bottom.dispose();
      return merged ?? new THREE.IcosahedronGeometry(0.8, 1);
    }
    case "cluster": {
      const parts = core.nodes.map((nd, i) => {
        const g = buildGemGeometry(nd.radius, nd.detail, nd.lumpiness, seed + i * 101);
        g.translate(nd.pos[0], nd.pos[1], nd.pos[2]);
        return g;
      });
      const merged = mergeGeometries(parts);
      parts.forEach((p) => p.dispose());
      return merged ?? new THREE.IcosahedronGeometry(0.8, 1);
    }
  }
}

// ── コアシェル（ガラスの本体） ────────────────────────────────────────────────

function OrbRings({ rings, color }: { rings: { radius: number; tilt: number }[]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.25;
  });
  return (
    <group ref={ref}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + r.tilt, 0, i * 0.7]}>
          <torusGeometry args={[r.radius, 0.02, 12, 96]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function CoreShell({ core, color, seed }: { core: CrystalCore; color: string; seed: number }) {
  const geometry = useMemo(() => buildCoreGeometry(core, seed), [core, seed]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group>
      <mesh geometry={geometry}>
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
          color={color}
          background={new THREE.Color("#0a0820")}
        />
      </mesh>
      {core.kind === "orb" && <OrbRings rings={core.rings} color={color} />}
    </group>
  );
}

// ── 結晶内部に封じられたブランドマーク ──────────────────────────────────────────

/**
 * ガラスコアの内側に浮かぶ紋章。透過マテリアル越しに屈折して「かすかに」見える。
 * 親（結晶）の回転を打ち消して常にカメラへ正対し、練成完了に合わせてフェードイン。
 */
function EmbeddedMark({
  radius,
  core,
  formationRef,
}: {
  radius: number;
  core: CrystalCore;
  formationRef: MutableRefObject<number>;
}) {
  const tex = useTexture(BRAND_MARK_URL, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  // コア形状ごとにガラスへ収まるサイズ
  const size = core.kind === "prism" ? core.radius * 1.7 : core.kind === "orb" ? core.radius * 1.15 : radius * 0.95;

  useFrame((state) => {
    const g = ref.current;
    if (g && g.parent) {
      // 親の回転を打ち消してカメラへ正対（ガラス内のホログラムのように見せる）
      g.parent.getWorldQuaternion(tmpQuat);
      g.quaternion.copy(tmpQuat.invert()).multiply(state.camera.quaternion);
    }
    if (mat.current) {
      // 練成が仕上がる頃にゆっくり浮かび上がる
      mat.current.opacity = 0.98 * easeOutCubic(clamp01((formationRef.current - 1.2) / 1.0));
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0.25]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial ref={mat} map={tex} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── カテゴリ結晶要素（スタイル別に 6 つ） ───────────────────────────────────────

function CrystalPointMesh({
  point,
  baseRadius,
  hovered,
  onHover,
  formationRef,
  index,
}: {
  point: CrystalPoint;
  baseRadius: number;
  hovered: boolean;
  onHover?: (key: string | null) => void;
  formationRef: MutableRefObject<number>;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const hoverScale = useRef(1);
  const color = LEVEL[point.band].color;
  const L = point.length;
  const isSatellite = point.style === "satellite";

  const dir = useMemo(() => new THREE.Vector3(...point.dir).normalize(), [point.dir]);
  const quaternion = useMemo(
    () => (isSatellite ? new THREE.Quaternion() : new THREE.Quaternion().setFromUnitVectors(UP, dir)),
    [dir, isSatellite],
  );
  const anchor = point.style === "pillar" ? 0.3 : 0.62;
  const position = useMemo(
    () =>
      isSatellite
        ? new THREE.Vector3(dir.x * L, 0, dir.z * L)
        : dir.clone().multiplyScalar(baseRadius * anchor + L / 2),
    [dir, baseRadius, L, anchor, isSatellite],
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(matRef.current.emissiveIntensity, hovered ? 2.8 : 0.95, 6, delta);
    }
    const g = groupRef.current;
    if (!g) return;
    hoverScale.current = THREE.MathUtils.damp(hoverScale.current, hovered ? 1.12 : 1, 8, delta);
    // 練成: コアが育った後、1本ずつ順に生える
    const ft = formationRef.current;
    const grow = easeOutBack(clamp01((ft - FORMATION_POINT_DELAY - index * FORMATION_POINT_STAGGER) / FORMATION_POINT_SEC));
    g.scale.setScalar(Math.max(1e-4, grow * hoverScale.current));
    if (isSatellite) {
      const t = state.clock.elapsedTime;
      const ang = point.phase * TAU + t * 0.42;
      g.position.set(Math.cos(ang) * L, Math.sin(t * 0.7 + point.phase * TAU) * 0.16, Math.sin(ang) * L);
    }
  });

  const s = point.size;
  let body: React.ReactNode;
  switch (point.style) {
    case "pillar":
      // 太い六角柱＋尖り（一極・双晶の主塔）
      body = (
        <>
          <mesh position={[0, -L * 0.14, 0]}>
            <cylinderGeometry args={[0.15 * s, 0.19 * s, L * 0.72, 6]} />
            <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.18} flatShading />
          </mesh>
          <mesh position={[0, L * 0.36, 0]}>
            <coneGeometry args={[0.15 * s, L * 0.28, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3} metalness={0.1} roughness={0.16} flatShading />
          </mesh>
        </>
      );
      break;
    case "blade":
      // 平たい刃状の結晶（単晶柱の周囲）
      body = (
        <mesh scale={[0.16 * s, L * 0.5, 0.055]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.2} flatShading />
        </mesh>
      );
      break;
    case "petal":
      // 花弁状（晶洞の花）
      body = (
        <mesh scale={[1, 1, 0.42]}>
          <coneGeometry args={[0.2 * s, L, 5]} />
          <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.2} flatShading />
        </mesh>
      );
      break;
    case "shard":
      // 傾いた欠片（群晶・遺物）
      body = (
        <mesh rotation={[point.tilt * 0.5, 0, point.tilt]} scale={[0.13 * s, L * 0.5, 0.13 * s]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.24} flatShading />
        </mesh>
      );
      break;
    case "satellite":
      // 軌道を巡る小結晶（天環の宝珠）
      body = (
        <mesh>
          <icosahedronGeometry args={[s, 0]} />
          <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.2} flatShading />
        </mesh>
      );
      break;
    case "spike":
    default:
      // 六角の結晶ポイント（柱＋尖り）
      body = (
        <>
          <mesh position={[0, L * 0.28, 0]}>
            <coneGeometry args={[0.12 * s, L * 0.72, 6]} />
            <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={0.95} metalness={0.1} roughness={0.18} flatShading />
          </mesh>
          <mesh position={[0, -L * 0.18, 0]}>
            <cylinderGeometry args={[0.12 * s, 0.06 * s, L * 0.36, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.1} roughness={0.25} flatShading />
          </mesh>
        </>
      );
      break;
  }

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
      {body}
    </group>
  );
}

// ── 結晶本体 ──────────────────────────────────────────────────────────────────

function CrystalRig({
  result,
  form,
  hovered,
  onHover,
}: {
  result: FortuneResult;
  form: CrystalForm;
  hovered: string | null;
  onHover?: (key: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const formationStart = useRef<number | null>(null);
  const formationRef = useRef(0);

  const overallColor = LEVEL[result.overall.band].color;

  const focusColor = useMemo(() => {
    if (!hovered) return overallColor;
    const c = result.categories.find((cat) => cat.key === hovered);
    return c ? LEVEL[c.band].color : overallColor;
  }, [hovered, result, overallColor]);

  // マークを隠さないよう、魂の球体は小さめに（発光の主役は bloom）
  const soulRadius = Math.min(0.2, form.radius * 0.28);

  // 結晶ごとに位相を変えた「不規則な自転」パラメータ（非整数比の正弦を重ねて速度・軸が揺らぐ）
  const wobble = useMemo(() => {
    const r = ambientRng(form.seed);
    return { p1: r() * TAU, p2: r() * TAU, p3: r() * TAU, p4: r() * TAU };
  }, [form.seed]);

  // ファミリーによって全高が大きく違うため、最大到達半径からスケールを正規化して
  // どの形もフレームに収める（radius の大小は clamp 内で残る）
  const baseScale = useMemo(() => {
    let m = form.radius * 1.2;
    for (const p of form.points) {
      m = Math.max(m, p.style === "satellite" ? p.length + p.size : form.radius * (p.style === "pillar" ? 0.3 : 0.62) + p.length);
    }
    if (form.core.kind === "prism") m = Math.max(m, form.core.height / 2 + form.core.capHeight);
    if (form.core.kind === "orb") for (const r of form.core.rings) m = Math.max(m, r.radius);
    return Math.min(1.05, 2.35 / m);
  }, [form]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (formationStart.current === null) formationStart.current = t;
    const ft = t - formationStart.current;
    formationRef.current = ft;

    const g = group.current;
    if (g) {
      // 練成の勢い: 最初は速く回り、減速して定常回転へ
      const spinBoost = 3.6 * easeOutCubic(clamp01(ft / 2.4));
      // 不規則な自転（カーソル・スクロール非依存。PC/モバイル共通）:
      // 基本回転に周期の異なる正弦を重ね、速度と傾きが常にゆらぐ
      g.rotation.y = t * 0.32 + Math.sin(t * 0.23 + wobble.p1) * 0.85 + Math.sin(t * 0.117 + wobble.p2) * 0.55 + spinBoost;
      g.rotation.x = Math.sin(t * 0.19 + wobble.p3) * 0.24 + Math.sin(t * 0.307 + wobble.p2) * 0.12;
      g.rotation.z = Math.sin(t * 0.143 + wobble.p4) * 0.1;
      g.position.y = Math.sin(t * 0.8) * 0.05;
      // 練成: コアが弾みながら育つ
      g.scale.setScalar(baseScale * Math.max(1e-4, easeOutBack(clamp01(ft / FORMATION_CORE_SEC))));
    }
    if (coreLight.current) {
      // コア完成の瞬間に閃光
      const flash = 9 * Math.exp(-((ft - FORMATION_CORE_SEC) ** 2) * 10);
      coreLight.current.intensity = (form.isPerfect ? 5.4 : 4.4) + Math.sin(t * 2.2) * 1.1 + flash + form.glow * 1.2;
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
    <group ref={group}>
      {/* 内部の魂（強発光・bloom の光源） */}
      <pointLight ref={coreLight} color={overallColor} intensity={4.4} distance={6} />
      <mesh>
        <icosahedronGeometry args={[soulRadius, 0]} />
        <meshStandardMaterial ref={coreMat} color={overallColor} emissive={overallColor} emissiveIntensity={2.3} toneMapped={false} />
      </mesh>

      {/* ガラスの内側に封じられた紋章（かすかに透けて見える） */}
      <Suspense fallback={null}>
        <EmbeddedMark radius={form.radius} core={form.core} formationRef={formationRef} />
      </Suspense>

      {/* ファミリー別のガラスコア */}
      <CoreShell core={form.core} color={overallColor} seed={form.seed} />

      {/* 6つのカテゴリ結晶要素（スコアで長さ・band で色） */}
      {form.points.map((p, i) => (
        <CrystalPointMesh
          key={p.key}
          point={p}
          baseRadius={form.radius}
          hovered={hovered === p.key}
          onHover={onHover}
          formationRef={formationRef}
          index={i}
        />
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

/** 奥行きのある星粒。ゆっくり一定ドリフト（全デバイス共通）。 */
function StarField() {
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
      ref.current.rotation.x = t * 0.01;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} color="#ddd6fe" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** 漂う結晶片の群れ（instanced）。その場でゆっくり漂う（全デバイス共通）。 */
function AmbientShards({ count = 46 }: { count?: number }) {
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
    g.rotation.y = t * 0.03;
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.sin(t * 0.2) * 0.6, 3, delta);
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
}: {
  result: FortuneResult;
  hovered: string | null;
  onHover?: (key: string | null) => void;
}) {
  const form = useMemo(() => classifyCrystal(result), [result]);

  // カーソル追従・スクロール連動・端末の傾き連動は廃止。
  // 結晶は「不規則な自転」で常に自律的に動く（PC/モバイル共通挙動）。
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
      <StarField />
      <CosmicRing />
      <AmbientShards />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
        <CrystalRig result={result} form={form} hovered={hovered} onHover={onHover} />
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
