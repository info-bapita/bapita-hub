"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Physics, RigidBody, BallCollider, type RapierRigidBody } from "@react-three/rapier";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ORBS, BOWL_CENTER, BOWL_RADIUS } from "./orbs";

type OrbState = "drift" | "falling" | "caught";

const BOWL = new THREE.Vector3(...BOWL_CENTER);
const MAX_SPEED = 4.5;
const CATCH_DIST = BOWL_RADIUS + 0.35;
const IDLE_MS = 3000;

function Orb({
  index,
  color,
  label,
  home,
  apiRef,
  stateRef,
  onGrab,
  onHover,
  hovered,
}: {
  index: number;
  color: string;
  label: string;
  home: [number, number, number];
  apiRef: (b: RapierRigidBody | null) => void;
  stateRef: React.MutableRefObject<OrbState[]>;
  onGrab: (i: number) => void;
  onHover: (i: number | null) => void;
  hovered: boolean;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const flareRef = useRef(0);

  // decay the catch/hover flare each frame
  useFrame((_, dt) => {
    if (!matRef.current) return;
    const target = stateRef.current[index] === "caught" ? 1.4 : hovered ? 2.0 : 1.2;
    flareRef.current += (target - flareRef.current) * Math.min(1, dt * 6);
    matRef.current.emissiveIntensity = flareRef.current;
  });

  return (
    <RigidBody
      ref={apiRef}
      colliders={false}
      position={home}
      linearDamping={1.3}
      angularDamping={1.5}
      gravityScale={0}
      canSleep={false}
    >
      <BallCollider args={[0.45]} />
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
        scale={hovered ? 1.12 : 1}
      >
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      {/* soft glow shell */}
      <mesh scale={1.9}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={9} position={[0, 0.95, 0]} pointerEvents="none">
          <span
            style={{
              fontFamily: "var(--font-heebo), system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#f4f4f2",
              background: "rgba(11,11,12,0.7)",
              padding: "2px 8px",
              borderRadius: "9999px",
              whiteSpace: "nowrap",
              border: `1px solid ${color}`,
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </RigidBody>
  );
}

function Bowl({ pulseRef }: { pulseRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    pulseRef.current += (0 - pulseRef.current) * Math.min(1, dt * 4);
    const s = 1 + pulseRef.current * 0.18;
    group.current.scale.setScalar(s);
  });
  return (
    <group ref={group} position={BOWL_CENTER}>
      {/* bowl body — open-top hemisphere */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[BOWL_RADIUS, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4f4f2" side={THREE.DoubleSide} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[BOWL_RADIUS, 0.045, 16, 64]} />
        <meshStandardMaterial color="#f4f4f2" emissive="#f4f4f2" emissiveIntensity={0.15} />
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

  // pointer → world position on z=0 plane
  const ray = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const ptWorld = useRef(new THREE.Vector3());

  // drag-to-parallax
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
    const dt = Math.min(dtRaw, 1 / 30); // bound the step
    const now = performance.now();
    if (lastInteraction.current === 0) lastInteraction.current = now; // start idle clock on first frame

    // pointer world target
    ray.current.setFromCamera(pointer, camera);
    ray.current.ray.intersectPlane(plane.current, ptWorld.current);

    // parallax group ease toward drag offset
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
        const r = 0.45;
        b.setTranslation(
          {
            x: BOWL.x + Math.cos(angle) * r,
            y: BOWL.y + 0.1 + (slot % 2) * 0.12,
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
        } else {
          dir.normalize().multiplyScalar(0.9);
          b.applyImpulse({ x: dir.x, y: dir.y, z: dir.z }, true);
        }
      } else {
        // drift: gentle wander to home + soft attraction to cursor
        const toHome = new THREE.Vector3(orb.home[0] - t.x, orb.home[1] - t.y, orb.home[2] - t.z);
        b.applyImpulse(
          { x: toHome.x * 0.012, y: toHome.y * 0.012, z: toHome.z * 0.012 },
          true,
        );
        const toCursor = new THREE.Vector3(
          ptWorld.current.x - t.x,
          ptWorld.current.y - t.y,
          -t.z,
        );
        const cd = toCursor.length();
        if (cd < 4) {
          toCursor.normalize().multiplyScalar(0.02 * (1 - cd / 4));
          b.applyImpulse({ x: toCursor.x, y: toCursor.y, z: toCursor.z }, true);
        }
      }

      // clamp speed
      const v = b.linvel();
      const sp = Math.hypot(v.x, v.y, v.z);
      if (sp > MAX_SPEED) {
        const k = MAX_SPEED / sp;
        b.setLinvel({ x: v.x * k, y: v.y * k, z: v.z * k }, true);
      }
    });

    // collected all → pulse + respawn shortly after
    if (caughtCount === ORBS.length) {
      pulseRef.current = 1;
      lastInteraction.current = now;
      window.setTimeout(respawn, 900);
    }

    // auto-demo: drop one orb after idle
    if (!anyFalling && caughtCount < ORBS.length && now - lastInteraction.current > IDLE_MS) {
      const drifters = ORBS.map((_, i) => i).filter((i) => states.current[i] === "drift");
      if (drifters.length) {
        grab(drifters[Math.floor(Math.random() * drifters.length)]);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* invisible drag plane behind the field */}
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
            THREE.MathUtils.clamp((e.point.x - dragStart.current.x) * 0.25, -1.2, 1.2),
            THREE.MathUtils.clamp((e.point.y - dragStart.current.y) * 0.25, -0.8, 0.8),
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
          stateRef={states}
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
      dpr={[1, 1.6]}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0.2, 9], fov: 46 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 6]} intensity={40} />
      <pointLight position={[-6, -2, 4]} intensity={12} color="#9277ff" />
      <fog attach="fog" args={["#0b0b0c", 10, 20]} />
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Field />
      </Physics>
    </Canvas>
  );
}
