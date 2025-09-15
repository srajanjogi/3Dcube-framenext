(() => {
  const API_BASE = '/api/cubes';
  const CUBE_ID = 'cube_1';

  const speedSlider = document.getElementById('speedSlider');
  const speedVal = document.getElementById('speedVal');
  const upBtn = document.getElementById('up');
  const downBtn = document.getElementById('down');
  const leftBtn = document.getElementById('left');
  const rightBtn = document.getElementById('right');
  const resetBtn = document.getElementById('resetBtn');
  const saveBtn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('status');
  const viewport = document.getElementById('viewport');

  let scene, camera, renderer, cube, clock;
  let rotationSpeed = parseFloat(speedSlider.value);
  speedVal.textContent = rotationSpeed.toFixed(1);

  function showStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? 'red' : 'black';
  }

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, viewport.clientWidth / viewport.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    viewport.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(ambient, dir);

    clock = new THREE.Clock();

    // fallback cube
    const geom = new THREE.BoxGeometry(1,1,1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x156289 });
    cube = new THREE.Mesh(geom, mat);
    scene.add(cube);

    window.addEventListener('resize', onResize);
    animate();
  }

  function onResize() {
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (cube) {
      cube.rotation.x += rotationSpeed * delta;
      cube.rotation.y += rotationSpeed * delta * 0.9;
    }
    renderer.render(scene, camera);
  }

  // UI
  speedSlider.addEventListener('input', e => {
    rotationSpeed = parseFloat(e.target.value);
    speedVal.textContent = rotationSpeed.toFixed(1);
  });

  const step = 0.25;
  upBtn.addEventListener('click', () => { cube.position.y += step; });
  downBtn.addEventListener('click', () => { cube.position.y -= step; });
  leftBtn.addEventListener('click', () => { cube.position.x -= step; });
  rightBtn.addEventListener('click', () => { cube.position.x += step; });

  resetBtn.addEventListener('click', async () => {
    const res = await fetch(`${API_BASE}/${CUBE_ID}/reset`, { method: 'POST' });
    const data = await res.json();
    cube.position.set(data.cube.position.x, data.cube.position.y, data.cube.position.z);
    rotationSpeed = data.cube.rotationSpeed;
    speedSlider.value = rotationSpeed;
    speedVal.textContent = rotationSpeed.toFixed(1);
    showStatus('Reset done');
  });

  saveBtn.addEventListener('click', async () => {
    const payload = {
      position: { x: cube.position.x, y: cube.position.y, z: cube.position.z },
      rotationSpeed
    };
    const res = await fetch(`${API_BASE}/${CUBE_ID}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      showStatus('Saved successfully');
    } else {
      showStatus(data.error || 'Save failed', true);
    }
  });

  async function loadState() {
    try {
      const res = await fetch(`${API_BASE}/${CUBE_ID}`);
      if (!res.ok) return;
      const data = await res.json();
      cube.position.set(data.position.x, data.position.y, data.position.z);
      rotationSpeed = data.rotationSpeed;
      speedSlider.value = rotationSpeed;
      speedVal.textContent = rotationSpeed.toFixed(1);
      showStatus('State loaded');
    } catch (e) {
      showStatus('Could not load saved state', true);
    }
  }

  initScene();
  loadState();
})();
