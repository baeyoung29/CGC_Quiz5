import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080b18);
scene.fog = new THREE.Fog(0x080b18, 12, 30);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 4, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 8, 6);
mainLight.castShadow = true;
scene.add(mainLight);

const blueLight = new THREE.PointLight(0x3867ff, 35, 15);
blueLight.position.set(-5, 3, 2);
scene.add(blueLight);

const pinkLight = new THREE.PointLight(0xff3296, 30, 15);
pinkLight.position.set(5, 2, -3);
scene.add(pinkLight);

const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x10162c,
    roughness: 0.8,
    metalness: 0.2
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.8;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(200, 80, 0x334477, 0x202b49);
grid.position.y = -1.78;
scene.add(grid);

const shapes = [];

function createShape(geometry, color, position, name) {
    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.35,
        roughness: 0.25
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.name = name;

    scene.add(mesh);

    shapes.push({
        mesh,
        initialY: position.y,
        rotationSpeed: {
            x: 0.25 + Math.random() * 0.5,
            y: 0.4 + Math.random() * 0.7,
            z: 0.2 + Math.random() * 0.3
        },
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatAmount: 0.25 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2
    });

    return mesh;
}

createShape(
    new THREE.BoxGeometry(1.6, 1.6, 1.6),
    0x00d9ff,
    { x: -4.2, y: 0, z: 0 },
    'Box'
);

createShape(
    new THREE.ConeGeometry(1, 2, 48),
    0xff4f81,
    { x: -2.1, y: 0.2, z: -1 },
    'Cone'
);

createShape(
    new THREE.CylinderGeometry(0.8, 0.8, 1.8, 48),
    0xffc857,
    { x: 0, y: 0, z: 0 },
    'Cylinder'
);

createShape(
    new THREE.SphereGeometry(1, 48, 32),
    0x8b5cf6,
    { x: 2.1, y: 0.2, z: -1 },
    'Sphere'
);

createShape(
    new THREE.TorusGeometry(0.85, 0.3, 24, 80),
    0x35f2a0,
    { x: 4.2, y: 0, z: 0 },
    'Torus'
);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    shapes.forEach((shape) => {
        const { mesh, rotationSpeed, initialY, floatSpeed, floatAmount, phase } = shape;

        mesh.rotation.x += rotationSpeed.x * 0.01;
        mesh.rotation.y += rotationSpeed.y * 0.01;
        mesh.rotation.z += rotationSpeed.z * 0.01;

        mesh.position.y =
            initialY +
            Math.sin(elapsedTime * floatSpeed + phase) * floatAmount;
    });

    blueLight.position.y = 3 + Math.sin(elapsedTime) * 0.8;
    pinkLight.position.y = 2 + Math.cos(elapsedTime * 0.8) * 0.8;

    camera.position.x = Math.sin(elapsedTime * 0.15) * 0.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
