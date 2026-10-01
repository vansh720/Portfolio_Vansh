import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { prefersReducedMotion } from '../lib/gsap';

// Ashima Arts 3D simplex noise (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uT;
uniform float uFrom;
uniform float uTo;
uniform float uAmpFrom;
uniform float uAmpTo;
uniform vec3 uMouse;
uniform float uMouseStrength;
attribute vec3 aShape0;
attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute vec3 aShape4;
attribute float aRandom;
varying float vNoise;
varying float vRandom;
varying float vDepth;
${NOISE}

vec3 shapeAt(float i) {
  if (i < 0.5) return aShape0;
  if (i < 1.5) return aShape1;
  if (i < 2.5) return aShape2;
  if (i < 3.5) return aShape3;
  return aShape4;
}

void main() {
  // Each particle starts its journey at a slightly different moment.
  float t = clamp((uT - aRandom * 0.35) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(shapeAt(uFrom), shapeAt(uTo), t);

  // Idle breathing, stronger on organic shapes.
  float amp = mix(uAmpFrom, uAmpTo, t);
  float n = snoise(p * 0.9 + vec3(uTime * 0.18));
  p += normalize(p + 1e-4) * n * amp;

  // Particles scatter mid-flight, then settle into the new formation.
  float burst = sin(t * 3.14159);
  p += vec3(snoise(p * 1.6 + 3.1), snoise(p * 1.6 + 7.4), snoise(p * 1.6 + 11.2)) * burst * 0.6;

  // Push away from the cursor.
  vec3 away = p - uMouse;
  float d = length(away);
  p += normalize(away + 1e-4) * smoothstep(1.15, 0.0, d) * 0.6 * uMouseStrength;

  vNoise = n;
  vRandom = aRandom;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = smoothstep(-8.6, -4.6, mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + aRandom) * uPixelRatio * (1.0 / -mv.z);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vNoise;
varying float vRandom;
varying float vDepth;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.08, d);
  vec3 col = mix(uColorB, uColorA, smoothstep(-0.2, 0.6, vNoise + (vRandom - 0.5) * 0.4));
  gl_FragColor = vec4(col, alpha * uOpacity * (0.3 + vRandom * 0.7) * mix(0.3, 1.0, vDepth));
}
`;

/** Shape order matches the hero's formations; index 4 is the idle sphere. */
const SPHERE = 4;
const AMPS = [0.08, 0.04, 0.07, 0.035, 0.36];
const MORPH_SECONDS = 2;
const TAU = Math.PI * 2;

function rotateAll(arr, x, y, z) {
  const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(x, y, z));
  const v = new THREE.Vector3();
  for (let i = 0; i < arr.length; i += 3) v.fromArray(arr, i).applyMatrix4(m).toArray(arr, i);
}

function buildShapes(n) {
  const torus = new Float32Array(n * 3);
  const tiers = new Float32Array(n * 3);
  const helix = new Float32Array(n * 3);
  const cube = new Float32Array(n * 3);
  const sphere = new Float32Array(n * 3);
  const randoms = new Float32Array(n);
  const set = (arr, i, x, y, z) => {
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  };
  const golden = Math.PI * (3 - Math.sqrt(5));
  const r = Math.random;

  for (let i = 0; i < n; i++) {
    randoms[i] = r();

    // Idle: fibonacci sphere.
    const sy = 1 - (i / (n - 1)) * 2;
    const sr = Math.sqrt(1 - sy * sy);
    set(sphere, i, Math.cos(golden * i) * sr * 1.55, sy * 1.55, Math.sin(golden * i) * sr * 1.55);

    // Payments: a coin-like ring.
    const u = r() * TAU;
    const v = r() * TAU;
    set(torus, i, (1.3 + 0.34 * Math.cos(v)) * Math.cos(u), 0.34 * Math.sin(v), (1.3 + 0.34 * Math.cos(v)) * Math.sin(u));

    // Roles: three stacked tiers joined by links — Super Admin, Institute, Student.
    const k = r();
    if (k < 0.12) {
      const angle = (Math.floor(r() * 8) / 8) * TAU;
      const s = r();
      const radius = 0.48 + s * 1.02;
      set(tiers, i, Math.cos(angle) * radius, 1.05 - s * 2.1, Math.sin(angle) * radius);
    } else {
      const tier = k < 0.3 ? 0 : k < 0.6 ? 1 : 2;
      const max = [0.48, 1.0, 1.5][tier];
      const y = [1.05, 0, -1.05][tier];
      const rr = r() < 0.6 ? max * (0.95 + r() * 0.05) : max * Math.sqrt(r());
      const angle = r() * TAU;
      set(tiers, i, Math.cos(angle) * rr, y + (r() - 0.5) * 0.04, Math.sin(angle) * rr);
    }

    // Real-time: a double helix of streams with rungs.
    if (r() < 0.86) {
      const h = r();
      const a = h * TAU * 2.2 + (i % 2) * Math.PI;
      set(helix, i, Math.cos(a) * 0.82 + (r() - 0.5) * 0.06, (h - 0.5) * 3.4, Math.sin(a) * 0.82 + (r() - 0.5) * 0.06);
    } else {
      const h = Math.round(r() * 22) / 22;
      const a = h * TAU * 2.2;
      const s = r() * 2 - 1;
      set(helix, i, Math.cos(a) * 0.82 * s, (h - 0.5) * 3.4, Math.sin(a) * 0.82 * s);
    }

    // Cloud: a server-lattice cube with grid lines on every face.
    const half = 1.08;
    const snap = (val) => (r() < 0.55 ? (Math.round((val / half) * 3) / 3) * half : val);
    const a1 = snap((r() * 2 - 1) * half);
    const a2 = snap((r() * 2 - 1) * half);
    const face = Math.floor(r() * 6);
    const sign = face % 2 ? half : -half;
    if (face < 2) set(cube, i, sign, a1, a2);
    else if (face < 4) set(cube, i, a1, sign, a2);
    else set(cube, i, a1, a2, sign);
  }

  rotateAll(torus, Math.PI / 2, 0, 0.18);
  rotateAll(helix, 0, 0, 0.32);
  rotateAll(cube, 0.62, 0, 0.62);
  return { shapes: [torus, tiers, helix, cube, sphere], randoms };
}

function makeUniforms(compact) {
  return {
    uTime: { value: 0 },
    uSize: { value: compact ? 13 : 15 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uT: { value: 1 },
    uFrom: { value: SPHERE },
    uTo: { value: SPHERE },
    uAmpFrom: { value: AMPS[SPHERE] },
    uAmpTo: { value: AMPS[SPHERE] },
    uMouse: { value: new THREE.Vector3(99, 99, 99) },
    uMouseStrength: { value: 0 },
    uOpacity: { value: compact ? 0.55 : 1 },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
  };
}

function Formation({ colors, reduced, formation, awake }) {
  const tilt = useRef(null);
  const spin = useRef(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const { viewport, camera, invalidate } = useThree();

  const [compact] = useState(() => window.innerWidth < 768);
  const { shapes, randoms } = useMemo(() => buildShapes(compact ? 3600 : 7500), [compact]);

  // Built by hand: passing `uniforms` as a JSX prop makes R3F copy each uniform into
  // the material, so later `.value` writes from here would never reach the shader.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: makeUniforms(compact),
        transparent: true,
        depthWrite: false,
      }),
    [compact],
  );
  const uniforms = material.uniforms;
  useEffect(() => () => material.dispose(), [material]);
  // Morph progress is advanced in the render loop, so it can't be orphaned by remounts.
  const morph = useRef({ target: SPHERE, pending: null, raw: 1 });

  useEffect(() => {
    uniforms.uColorA.value.set(colors.a);
    uniforms.uColorB.value.set(colors.b);
    invalidate();
  }, [colors, uniforms, invalidate]);

  const start = useCallback(
    (index) => {
      const state = morph.current;
      uniforms.uFrom.value = state.target;
      uniforms.uTo.value = index;
      uniforms.uAmpFrom.value = AMPS[state.target];
      uniforms.uAmpTo.value = AMPS[index];
      state.target = index;
      state.raw = reduced ? 1 : 0;
      uniforms.uT.value = state.raw;
      invalidate();
    },
    [uniforms, reduced, invalidate],
  );

  useEffect(() => {
    const index = formation < 0 ? SPHERE : formation;
    const state = morph.current;
    if (state.raw < 1) state.pending = index;
    else if (index !== state.target) start(index);
  }, [formation, start]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.active = e.pointerType === 'mouse';
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const ray = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3(), hit: new THREE.Vector3() }), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { x, y, active } = pointer.current;

    const state = morph.current;
    if (state.raw < 1) {
      state.raw = Math.min(1, state.raw + Math.min(delta, 0.25) / MORPH_SECONDS);
      const e = state.raw;
      uniforms.uT.value = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
    } else if (state.pending !== null) {
      const next = state.pending;
      state.pending = null;
      if (next !== state.target) start(next);
    }

    if (!reduced) {
      const s = THREE.MathUtils.damp(tilt.current.scale.x, awake ? baseScale : baseScale * 0.35, 1.8, dt);
      tilt.current.scale.setScalar(s);
      uniforms.uTime.value += dt;
      spin.current.rotation.y += dt * 0.22;
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, 0.28 - y * 0.25, 0.05);
      tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, -x * 0.12, 0.05);
    }

    // Cursor → point on the z=0 plane → the formation's local space.
    ray.v.set(x, y, 0.5).unproject(camera);
    ray.dir.copy(ray.v).sub(camera.position).normalize();
    ray.hit.copy(camera.position).addScaledVector(ray.dir, -camera.position.z / ray.dir.z);
    spin.current.worldToLocal(uniforms.uMouse.value.copy(ray.hit));
    uniforms.uMouseStrength.value = THREE.MathUtils.lerp(uniforms.uMouseStrength.value, active && !reduced ? 1 : 0, 0.06);
  });

  const wide = viewport.aspect > 1.1;
  const baseScale = wide ? 0.98 : 0.72;
  return (
    <group
      ref={tilt}
      position={[wide ? viewport.width * 0.22 : 0, wide ? 0.32 : 1.15, 0]}
      scale={reduced ? baseScale : baseScale * 0.35}
      rotation={[0.28, 0, 0]}
    >
      <points ref={spin} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shapes[SPHERE], 3]} />
          <bufferAttribute attach="attributes-aShape0" args={[shapes[0], 3]} />
          <bufferAttribute attach="attributes-aShape1" args={[shapes[1], 3]} />
          <bufferAttribute attach="attributes-aShape2" args={[shapes[2], 3]} />
          <bufferAttribute attach="attributes-aShape3" args={[shapes[3], 3]} />
          <bufferAttribute attach="attributes-aShape4" args={[shapes[4], 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>
    </group>
  );
}

const PALETTES = {
  dark: { a: '#ff5a1f', b: '#ece5d8' },
  light: { a: '#e2460f', b: '#15130f' },
};

/** Particle field that morphs between formations; `formation` -1 is the idle sphere. */
export default function HeroCanvas({ formation = -1 }) {
  const { theme, ready } = useApp();
  const wrap = useRef(null);
  const [visible, setVisible] = useState(true);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    observer.observe(wrap.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible && !reduced ? 'always' : 'demand'}
        resize={{ scroll: false, offsetSize: true }}
      >
        <Formation colors={PALETTES[theme]} reduced={reduced} formation={formation} awake={ready} />
      </Canvas>
    </div>
  );
}
