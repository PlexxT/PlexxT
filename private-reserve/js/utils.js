// utils.js  (pseudocode)
export const $ = sel => document.querySelector(sel);

// convert inches ⇄ mm
export const in2mm = x => x * 25.4;
export const mm2in = x => x / 25.4;

// simple line helper for Three.js
export function addLine(scene, p1, p2, colorHex) {
  const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const mat = new THREE.LineBasicMaterial({ color: colorHex });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
}
