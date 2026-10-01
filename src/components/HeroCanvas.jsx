import { useEffect, useMemo, useRef, useState } from 'react';
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
uniform float uAmp;
attribute float aRandom;
varying float vNoise;
varying float vRandom;
${NOISE}
void main() {
  vec3 p = position;
  vec3 dir = normalize(p);
  float n = snoise(p * 0.85 + vec3(uTime * 0.16));
  float n2 = snoise(p * 2.4 - vec3(uTime * 0.11));
  p += dir * (n * uAmp + n2 * uAmp * 0.22);
  vNoise = n;
  vRandom = aRandom;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
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
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.08, d);
  vec3 col = mix(uColorB, uColorA, smoothstep(-0.15, 0.55, vNoise));
  gl_FragColor = vec4(col, alpha * uOpacity * (0.35 + vRandom * 0.65));
}
`;

function sphereCloud(count, radius) {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    randoms[i] = Math.random();
  }
  return { positions, randoms };
}

function ringCloud(count, inner, outer) {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = inner + Math.pow(Math.random(), 1.6) * (outer - inner);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    randoms[i] = Math.random();
  }
  return { positions, randoms };
}

function makeUniforms(size, amp, opacity) {
  return {
    uTime: { value: 0 },
    uSize: { value: size },
    uAmp: { value: amp },
    uOpacity: { value: opacity },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
  };
}

function Cloud({ data, uniforms, ...props }) {
  return (
    <points {...props}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[data.randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function Field({ colors, reduced }) {
  const group = useRef(null);
  const ring = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { viewport, size } = useThree();
  const compact = size.width < 768;

  const sphere = useMemo(() => sphereCloud(compact ? 3200 : 7000, 1.55), [compact]);
  const disc = useMemo(() => ringCloud(compact ? 700 : 1800, 2.15, 3.1), [compact]);
  const sphereUniforms = useMemo(() => makeUniforms(15, 0.4, 1), []);
  const ringUniforms = useMemo(() => makeUniforms(11, 0.12, 0.8), []);

  useEffect(() => {
    for (const u of [sphereUniforms, ringUniforms]) {
      u.uColorA.value.set(colors.a);
      u.uColorB.value.set(colors.b);
    }
  }, [colors, sphereUniforms, ringUniforms]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 0.05);
    sphereUniforms.uTime.value += dt;
    ringUniforms.uTime.value += dt;
    const g = group.current;
    g.rotation.y += dt * 0.07;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.3, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, pointer.current.x * -0.15, 0.04);
    ring.current.rotation.y -= dt * 0.12;
  });

  const wide = viewport.aspect > 1.1;
  return (
    <group
      ref={group}
      position={[wide ? viewport.width * 0.2 : 0, wide ? 0.25 : 0.9, 0]}
      scale={wide ? 1 : 0.78}
    >
      <Cloud data={sphere} uniforms={sphereUniforms} />
      <group rotation={[1.2, 0.15, 0.25]}>
        <Cloud ref={ring} data={disc} uniforms={ringUniforms} />
      </group>
    </group>
  );
}

const PALETTES = {
  dark: { a: '#ff5a1f', b: '#ece5d8' },
  light: { a: '#e2460f', b: '#15130f' },
};

export default function HeroCanvas() {
  const { theme } = useApp();
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
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible && !reduced ? 'always' : 'demand'}
      >
        <Field colors={PALETTES[theme]} reduced={reduced} />
      </Canvas>
    </div>
  );
}
