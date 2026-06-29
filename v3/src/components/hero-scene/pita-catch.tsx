"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Physics, RigidBody, BallCollider, type RapierRigidBody } from "@react-three/rapier";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ORBS, BOWL_CENTER, BOWL_RADIUS } from "./orbs";

type OrbState = "drift" | "falling" | "caught";

const BOWL = new THREE.Vector3(...BOWL_CENTER);
const ORB_R = 0.55;
const MAX_SPEED = 3.0;
const CATCH_DIST = BOWL_RADIUS + 0.3;
const IDLE_MS = 3500;

function Orb({
  index,
  color,
  label,
  home,
  apiRef,
  onGrab,
  onHover,
  hovered,
}: {
  index: number;
  color: string;
  label: string;
  home: [number, number, number];
  apiRef: (b: RapierRigidBody | null) => void;
  onGrab: (i: number) => void;
  onHover: (i: number | null) => void;
  hovered: boolean;
}) {
  return (
    <RigidBody
      ref={apiRef}
      colliders={false}
      position={home}
      linearDamping={1.9}
      angularDamping={1.6}
      gravityScale={0}
      canSleep={false}
    >
      <BallCollider args={[ORB_R]} />
      <mesh
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onGrab(index);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onHover(null)}
        scale={hovered ? 1.08 : 1}
      >
        <sphereGeometry args={[ORB_R, 48, 48]} />
        {/* CLAY: matte, soft, no gloss, no emissive */}
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>
      {/* product name INSIDE the orb */}
      <Html center distanceFactor={8} position={[0, 0, ORB_R]} pointerEvents="none">
        <span
          style={{
            fontFamily: "var(--font-heebo), system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: "center",
            color: "#ffffff",
            textShadow: "0 1px 3px rgba(60,30,10,0.55)",
            width: "84px",
            display: "inline-block",
            whiteSpace: "normal",
          }}
        >
          {label}
        </span>
      </Html>
    </RigidBody>
  );
}

function Bowl({ pulseRef }: { pulseRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    pulseRef.current += (0 - pulseRef.current) * Math.min(1, dt * 4);
    const s = 1 + pulseRef.current * 0.12;
    group.current.scale.setScalar(s);
  });
  return (
    <group ref={group} position={BOWL_CENTER}>
      {/* bowl body — toasted clay hemisphere, concave up */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[BOWL_RADIUS, 64, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c8893f" side={THREE.DoubleSide} roughness={0.95} metalness={0} />
      </mesh>
      {/* dark inner pocket (the opening you see into) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <circleGeometry args={[BOWL_RADIUS * 0.82, 48]} />
        <meshStandardMaterial color="#6e3f17" roughness={1} metalness={0} />
      </mesh>
      {/* rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[BOWL_RADIUS, 0.11, 20, 96]} />
        <meshStandardMaterial color="#b9772f" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

function Field() {
  const { camera, pointer } = useThree();
  const bodies = useRef<(RapierRigidBody | null)[]>(Array(ORBS.length).fill(null));
  const states = useRef<OrbState[]>(ORBS.map(() => "drift"));
  const caughtSlots = useRef<number[]>([]);
  const lastInteraction = useRef(0);
  const pulseRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState<number | null>(null);

  const ray = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const ptWorld = useRef(new THREE.Vector3());

  const dragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector2(0, 0));
  const dragStart = useRef(new THREE.Vector2(0, 0));

  const respawn = useCallback(() => {
    ORBS.forEach((orb, i) => {
      const b = bodies.current[i];
      states.current[i] = "drift";
      if (b) {
        b.setTranslation({ x: orb.home[0], y: orb.home[1], z: orb.home[2] }, true);
        b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    });
    caughtSlots.current = [];
  }, []);

  const grab = useCallback((i: number) => {
    if (states.current[i] === "caught") return;
    states.current[i] = "falling";
    lastInteraction.current = performance.now();
  }, []);

  const noteInteraction = useCallback(() => {
    lastInteraction.current = performance.now();
  }, []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const now = performance.now();
    if (lastInteraction.current === 0) lastInteraction.current = now;

    ray.current.setFromCamera(pointer, camera);
    ray.current.ray.intersectPlane(plane.current, ptWorld.current);

    if (groupRef.current) {
      const tx = dragOffset.current.x;
      const ty = dragOffset.current.y;
      groupRef.current.position.x += (tx - groupRef.current.position.x) * Math.min(1, dt * 5);
      groupRef.current.position.y += (ty - groupRef.current.position.y) * Math.min(1, dt * 5);
    }

    let caughtCount = 0;
    let anyFalling = false;

    ORBS.forEach((orb, i) => {
      const b = bodies.current[i];
      if (!b) return;
      const st = states.current[i];
      const t = b.translation();

      if (st === "caught") {
        caughtCount++;
        const slot = caughtSlots.current.indexOf(i);
        const angle = (slot / Math.max(1, ORBS.length)) * Math.PI * 2;
        const r = BOWL_RADIUS * 0.4;
        b.setTranslation(
          {
            x: BOWL.x + Math.cos(angle) * r,
            y: BOWL.y + 0.2 + (slot % 2) * 0.18,
            z: BOWL.z + Math.sin(angle) * r,
          },
          true,
        );
        b.setLinvel({ x: 0, y: 0, z: 0 }, true);
        return;
      }

      if (st === "falling") {
        anyFalling = true;
        const dir = new THREE.Vector3(BOWL.x - t.x, BOWL.y - t.y, BOWL.z - t.z);
        const dist = dir.length();
        if (dist < CATCH_DIST) {
          states.current[i] = "caught";
          caughtSlots.current.push(i);
          pulseRef.current = Math.min(1, pulseRef.current + 0.5); // GROW on each landing
        } else {
          dir.normalize().multiplyScalar(0.9);
          b.applyImpulse({ x: dir.x, y: dir.y, z: dir.z }, true);
        }
      } else {
        // drift: SLOW gentle wander to home + soft cursor attraction
        const toHome = new THREE.Vector3(orb.home[0] - t.x, orb.home[1] - t.y, orb.home[2] - t.z);
        b.applyImpulse(
          { x: toHome.x * 0.006, y: toHome.y * 0.006, z: toHome.z * 0.006 },
          true,
        );
        const toCursor = new THREE.Vector3(
          ptWorld.current.x - t.x,
          ptWorld.current.y - t.y,
          -t.z,
        );
        const cd = toCursor.length();
        if (cd < 4) {
          toCursor.normalize().multiplyScalar(0.012 * (1 - cd / 4));
          b.applyImpulse({ x: toCursor.x, y: toCursor.y, z: toCursor.z }, true);
        }
      }

      const v = b.linvel();
      const sp = Math.hypot(v.x, v.y, v.z);
      if (sp > MAX_SPEED) {
        const k = MAX_SPEED / sp;
        b.setLinvel({ x: v.x * k, y: v.y * k, z: v.z * k }, true);
      }
    });

    if (caughtCount === ORBS.length) {
      pulseRef.current = 1;
      lastInteraction.current = now;
      window.setTimeout(respawn, 900);
    }

    if (!anyFalling && caughtCount < ORBS.length && now - lastInteraction.current > IDLE_MS) {
      const drifters = ORBS.map((_, i) => i).filter((i) => states.current[i] === "drift");
      if (drifters.length) {
        grab(drifters[Math.floor(Math.random() * drifters.length)]);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        position={[0, 0, -2]}
        onPointerDown={(e) => {
          dragging.current = true;
          dragStart.current.set(e.point.x, e.point.y);
          noteInteraction();
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          dragOffset.current.set(
            THREE.MathUtils.clamp((e.point.x - dragStart.current.x) * 0.2, -1.0, 1.0),
            THREE.MathUtils.clamp((e.point.y - dragStart.current.y) * 0.2, -0.7, 0.7),
          );
        }}
        onPointerUp={() => {
          dragging.current = false;
          dragOffset.current.set(0, 0);
        }}
        onPointerLeave={() => {
          dragging.current = false;
          dragOffset.current.set(0, 0);
        }}
      >
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Bowl pulseRef={pulseRef} />

      {ORBS.map((orb, i) => (
        <Orb
          key={orb.id}
          index={i}
          color={orb.color}
          label={orb.label}
          home={orb.home}
          apiRef={(b) => (bodies.current[i] = b)}
          onGrab={grab}
          onHover={setHovered}
          hovered={hovered === i}
        />
      ))}
    </group>
  );
}

export default function PitaCatch({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 1.7, 9.5], fov: 44 }}
      onCreated={({ camera }) => camera.lookAt(0, -1.5, 0)}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* light, warm studio lighting for rounded clay (no dark fog) */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fff3e0", "#c98a55", 0.95]} />
      <directionalLight position={[5, 8, 6]} intensity={2.0} />
      <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#ffe6c4" />
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Field />
      </Physics>
    </Canvas>
  );
}