/* viewer.js  – dumb wrap around Three.js */
import { addLine } from './utils.js';

export function initViewer() {
  // scene, camera, renderer
  const scene = new THREE.Scene();
  const cam   = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  cam.position.set(0, -150, 100);
  cam.lookAt(scene.position);
  const canvas = document.getElementById('glCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // simple light + stock block (wireframe cube)
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const stockGeo = new THREE.BoxGeometry(100,100,10); // mm scale placeholder
  const stockMat = new THREE.MeshBasicMaterial({ color:0xaaaaaa, wireframe:true });
  const stock = new THREE.Mesh(stockGeo, stockMat);
  scene.add(stock);

  return { scene, cam, renderer };
}

export function drawToolpath(viewCtx, segments) {
  // segments: [{p1:{x,y,z}, p2:{x,y,z}, type:'cut'|'rapid'}]
  const colors = { cut:0x0077ff, rapid:0xffff00, link:0x00ff00 };
  segments.forEach(seg => addLine(viewCtx.scene,
      new THREE.Vector3(seg.p1.x, seg.p1.y, seg.p1.z),
      new THREE.Vector3(seg.p2.x, seg.p2.y, seg.p2.z),
      colors[seg.type] || 0xffffff));
  viewCtx.renderer.render(viewCtx.scene, viewCtx.cam);
}
