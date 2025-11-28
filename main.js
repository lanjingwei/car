import * as THREE from 'three';

// ============================================
// Scene Setup
// ============================================
const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8e8e8);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// ============================================
// Camera - Isometric-like perspective
// ============================================
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(40, 40, 40);
camera.lookAt(0, 0, 0);

// ============================================
// Renderer
// ============================================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ============================================
// Lights - Soft diffused lighting
// ============================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(15, 30, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.normalBias = 0.02;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-10, 10, -10);
scene.add(fillLight);

// ============================================
// Materials - Matte plastic look
// ============================================
const matteGray = new THREE.MeshStandardMaterial({
    color: 0xc8c8c8,
    roughness: 0.9,
    metalness: 0.0
});

const matteWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.0
});

const matteRed = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    roughness: 0.85,
    metalness: 0.0
});

const matteDarkRed = new THREE.MeshStandardMaterial({
    color: 0xc0392b,
    roughness: 0.85,
    metalness: 0.0
});

const matteDarkGray = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.9,
    metalness: 0.0
});

const matteBlack = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.95,
    metalness: 0.0
});

const matteYellow = new THREE.MeshStandardMaterial({
    color: 0xf1c40f,
    roughness: 0.85,
    metalness: 0.0
});

const matteCream = new THREE.MeshStandardMaterial({
    color: 0xf5f5dc,
    roughness: 0.85,
    metalness: 0.0
});

const chromeMatl = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.3,
    metalness: 0.8
});

const glassMatl = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.6
});

// Menu colors
const menuColors = [
    new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.85, metalness: 0.0 }), // 蓝色 - 诗集
    new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.85, metalness: 0.0 }), // 红色 - 游戏
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.85, metalness: 0.0 }), // 绿色 - 书单
    new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.85, metalness: 0.0 })  // 紫色 - 音乐
];

// ============================================
// Ground - Large soft gray tiles
// ============================================
function createGround() {
    const tileSize = 4;
    const gridSize = 15;
    const gap = 0.1;
    
    const groundGroup = new THREE.Group();
    
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const tileGeometry = new THREE.BoxGeometry(tileSize - gap, 0.3, tileSize - gap);
            const shade = 0.75 + Math.random() * 0.1;
            const tileMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(shade, shade, shade),
                roughness: 0.9,
                metalness: 0.0
            });
            const tile = new THREE.Mesh(tileGeometry, tileMaterial);
            tile.position.set(x * tileSize, -0.15, z * tileSize);
            tile.receiveShadow = true;
            groundGroup.add(tile);
        }
    }
    
    return groundGroup;
}

const ground = createGround();
scene.add(ground);

// ============================================
// Refined Low-poly Jeep Car - More detailed
// ============================================
function createJeep() {
    const jeep = new THREE.Group();
    
    // Main chassis - lower body
    const chassisGeo = new THREE.BoxGeometry(2.8, 0.35, 1.6);
    const chassis = new THREE.Mesh(chassisGeo, matteDarkGray);
    chassis.position.y = 0.25;
    chassis.castShadow = true;
    jeep.add(chassis);
    
    // Body base
    const bodyBaseGeo = new THREE.BoxGeometry(2.6, 0.5, 1.5);
    const bodyBase = new THREE.Mesh(bodyBaseGeo, matteRed);
    bodyBase.position.set(0, 0.55, 0);
    bodyBase.castShadow = true;
    jeep.add(bodyBase);
    
    // Hood - front engine area (车头在 +X 方向)
    const hoodGeo = new THREE.BoxGeometry(1.0, 0.35, 1.4);
    const hood = new THREE.Mesh(hoodGeo, matteRed);
    hood.position.set(1.0, 0.7, 0);
    hood.castShadow = true;
    jeep.add(hood);
    
    // Hood detail lines
    const hoodLineGeo = new THREE.BoxGeometry(0.8, 0.05, 0.05);
    for (let i = -2; i <= 2; i++) {
        const hoodLine = new THREE.Mesh(hoodLineGeo, matteDarkRed);
        hoodLine.position.set(1.0, 0.9, i * 0.2);
        jeep.add(hoodLine);
    }
    
    // Front fenders
    const fenderGeo = new THREE.BoxGeometry(0.6, 0.25, 0.35);
    const fenderFL = new THREE.Mesh(fenderGeo, matteRed);
    fenderFL.position.set(0.9, 0.45, 0.65);
    fenderFL.castShadow = true;
    jeep.add(fenderFL);
    
    const fenderFR = fenderFL.clone();
    fenderFR.position.z = -0.65;
    jeep.add(fenderFR);
    
    // Rear fenders
    const fenderRL = new THREE.Mesh(fenderGeo, matteRed);
    fenderRL.position.set(-0.9, 0.45, 0.65);
    fenderRL.castShadow = true;
    jeep.add(fenderRL);
    
    const fenderRR = fenderRL.clone();
    fenderRR.position.z = -0.65;
    jeep.add(fenderRR);
    
    // Cabin - main structure
    const cabinGeo = new THREE.BoxGeometry(1.3, 0.75, 1.4);
    const cabin = new THREE.Mesh(cabinGeo, matteRed);
    cabin.position.set(-0.3, 1.15, 0);
    cabin.castShadow = true;
    jeep.add(cabin);
    
    // Windshield frame - A pillars
    const aPillarGeo = new THREE.BoxGeometry(0.08, 0.65, 0.08);
    const aPillarL = new THREE.Mesh(aPillarGeo, matteDarkGray);
    aPillarL.position.set(0.45, 1.1, 0.6);
    aPillarL.rotation.z = -0.2;
    jeep.add(aPillarL);
    
    const aPillarR = aPillarL.clone();
    aPillarR.position.z = -0.6;
    jeep.add(aPillarR);
    
    // Windshield (前挡风玻璃)
    const windshieldGeo = new THREE.BoxGeometry(0.05, 0.5, 1.1);
    const windshield = new THREE.Mesh(windshieldGeo, glassMatl);
    windshield.position.set(0.45, 1.15, 0);
    windshield.rotation.z = -0.2;
    jeep.add(windshield);
    
    // Side windows (左右侧窗玻璃)
    const sideWindowGeo = new THREE.BoxGeometry(0.6, 0.4, 0.04);
    
    // 左侧窗
    const sideWindowL = new THREE.Mesh(sideWindowGeo, glassMatl);
    sideWindowL.position.set(-0.05, 1.2, 0.72);
    jeep.add(sideWindowL);
    
    // 右侧窗
    const sideWindowR = new THREE.Mesh(sideWindowGeo, glassMatl);
    sideWindowR.position.set(-0.05, 1.2, -0.72);
    jeep.add(sideWindowR);
    
    // Rear window (后窗玻璃)
    const rearWindowGeo = new THREE.BoxGeometry(0.04, 0.35, 0.9);
    const rearWindow = new THREE.Mesh(rearWindowGeo, glassMatl);
    rearWindow.position.set(-0.82, 1.18, 0);
    jeep.add(rearWindow);
    
    // Window frames (窗框)
    const windowFrameMat = matteDarkGray;
    
    // 左窗框
    const frameTopGeoL = new THREE.BoxGeometry(0.65, 0.04, 0.04);
    const frameTopL = new THREE.Mesh(frameTopGeoL, windowFrameMat);
    frameTopL.position.set(-0.05, 1.42, 0.72);
    jeep.add(frameTopL);
    
    const frameBottomL = new THREE.Mesh(frameTopGeoL, windowFrameMat);
    frameBottomL.position.set(-0.05, 0.98, 0.72);
    jeep.add(frameBottomL);
    
    // 右窗框
    const frameTopR = frameTopL.clone();
    frameTopR.position.z = -0.72;
    jeep.add(frameTopR);
    
    const frameBottomR = frameBottomL.clone();
    frameBottomR.position.z = -0.72;
    jeep.add(frameBottomR);
    
    // 前窗三角窗 (小三角玻璃)
    const triangleWindowGeo = new THREE.BoxGeometry(0.2, 0.3, 0.03);
    const triangleWindowL = new THREE.Mesh(triangleWindowGeo, glassMatl);
    triangleWindowL.position.set(0.28, 1.15, 0.72);
    triangleWindowL.rotation.z = -0.15;
    jeep.add(triangleWindowL);
    
    const triangleWindowR = new THREE.Mesh(triangleWindowGeo, glassMatl);
    triangleWindowR.position.set(0.28, 1.15, -0.72);
    triangleWindowR.rotation.z = -0.15;
    jeep.add(triangleWindowR);
    
    // Top frame - roll cage
    const rollCageGeo = new THREE.BoxGeometry(1.1, 0.06, 0.06);
    const rollCageTop1 = new THREE.Mesh(rollCageGeo, matteDarkGray);
    rollCageTop1.position.set(-0.3, 1.55, 0.65);
    jeep.add(rollCageTop1);
    
    const rollCageTop2 = rollCageTop1.clone();
    rollCageTop2.position.z = -0.65;
    jeep.add(rollCageTop2);
    
    const rollCageSideGeo = new THREE.BoxGeometry(0.06, 0.06, 1.2);
    const rollCageFront = new THREE.Mesh(rollCageSideGeo, matteDarkGray);
    rollCageFront.position.set(0.2, 1.55, 0);
    jeep.add(rollCageFront);
    
    const rollCageBack = rollCageFront.clone();
    rollCageBack.position.x = -0.8;
    jeep.add(rollCageBack);
    
    // Vertical roll cage supports
    const rollVertGeo = new THREE.BoxGeometry(0.06, 0.4, 0.06);
    const rollVerts = [
        [0.2, 1.35, 0.65], [0.2, 1.35, -0.65],
        [-0.8, 1.35, 0.65], [-0.8, 1.35, -0.65]
    ];
    rollVerts.forEach(pos => {
        const vert = new THREE.Mesh(rollVertGeo, matteDarkGray);
        vert.position.set(...pos);
        jeep.add(vert);
    });
    
    // Grille - front (在 +X 方向)
    const grilleBaseGeo = new THREE.BoxGeometry(0.08, 0.4, 1.0);
    const grilleBase = new THREE.Mesh(grilleBaseGeo, matteDarkGray);
    grilleBase.position.set(1.5, 0.55, 0);
    jeep.add(grilleBase);
    
    // Grille slats
    const slatGeo = new THREE.BoxGeometry(0.1, 0.06, 0.12);
    for (let i = -3; i <= 3; i++) {
        const slat = new THREE.Mesh(slatGeo, chromeMatl);
        slat.position.set(1.52, 0.55, i * 0.13);
        jeep.add(slat);
    }
    
    // Headlights (圆形)
    const headlightGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const headlightRingGeo = new THREE.TorusGeometry(0.16, 0.02, 8, 16);
    const headlightMat = new THREE.MeshStandardMaterial({
        color: 0xffffee,
        roughness: 0.2,
        metalness: 0.5,
        emissive: 0xffffaa,
        emissiveIntensity: 0.3
    });
    
    const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
    headlightL.rotation.z = Math.PI / 2;
    headlightL.position.set(1.52, 0.6, 0.5);
    jeep.add(headlightL);
    
    const headlightRingL = new THREE.Mesh(headlightRingGeo, chromeMatl);
    headlightRingL.rotation.y = Math.PI / 2;
    headlightRingL.position.set(1.54, 0.6, 0.5);
    jeep.add(headlightRingL);
    
    const headlightR = headlightL.clone();
    headlightR.position.z = -0.5;
    jeep.add(headlightR);
    
    const headlightRingR = headlightRingL.clone();
    headlightRingR.position.z = -0.5;
    jeep.add(headlightRingR);
    
    // Turn signals
    const turnSignalGeo = new THREE.BoxGeometry(0.06, 0.1, 0.15);
    const turnSignalMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0xffaa00,
        emissiveIntensity: 0.2
    });
    
    const turnL = new THREE.Mesh(turnSignalGeo, turnSignalMat);
    turnL.position.set(1.52, 0.4, 0.55);
    jeep.add(turnL);
    
    const turnR = turnL.clone();
    turnR.position.z = -0.55;
    jeep.add(turnR);
    
    // Front bumper
    const frontBumperGeo = new THREE.BoxGeometry(0.15, 0.2, 1.7);
    const frontBumper = new THREE.Mesh(frontBumperGeo, chromeMatl);
    frontBumper.position.set(1.55, 0.25, 0);
    frontBumper.castShadow = true;
    jeep.add(frontBumper);
    
    // Rear bumper
    const rearBumper = new THREE.Mesh(frontBumperGeo, chromeMatl);
    rearBumper.position.set(-1.55, 0.25, 0);
    rearBumper.castShadow = true;
    jeep.add(rearBumper);
    
    // Tail lights
    const tailLightGeo = new THREE.BoxGeometry(0.06, 0.15, 0.2);
    const tailLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
    });
    
    const tailL = new THREE.Mesh(tailLightGeo, tailLightMat);
    tailL.position.set(-1.52, 0.55, 0.55);
    jeep.add(tailL);
    
    const tailR = tailL.clone();
    tailR.position.z = -0.55;
    jeep.add(tailR);
    
    // Side mirrors
    const mirrorArmGeo = new THREE.BoxGeometry(0.25, 0.04, 0.04);
    const mirrorGeo = new THREE.BoxGeometry(0.04, 0.12, 0.18);
    
    const mirrorArmL = new THREE.Mesh(mirrorArmGeo, matteDarkGray);
    mirrorArmL.position.set(0.3, 1.0, 0.8);
    jeep.add(mirrorArmL);
    
    const mirrorL = new THREE.Mesh(mirrorGeo, glassMatl);
    mirrorL.position.set(0.3, 1.0, 0.95);
    jeep.add(mirrorL);
    
    const mirrorArmR = mirrorArmL.clone();
    mirrorArmR.position.z = -0.8;
    jeep.add(mirrorArmR);
    
    const mirrorR = mirrorL.clone();
    mirrorR.position.z = -0.95;
    jeep.add(mirrorR);
    
    // Door handles
    const handleGeo = new THREE.BoxGeometry(0.15, 0.04, 0.04);
    const handleL = new THREE.Mesh(handleGeo, chromeMatl);
    handleL.position.set(-0.1, 0.9, 0.76);
    jeep.add(handleL);
    
    const handleR = handleL.clone();
    handleR.position.z = -0.76;
    jeep.add(handleR);
    
    // Wheels - more detailed
    const wheels = [];
    const wheelPositions = [
        [0.85, 0.35, 0.85],   // Front left
        [0.85, 0.35, -0.85],  // Front right
        [-0.85, 0.35, 0.85],  // Rear left
        [-0.85, 0.35, -0.85]  // Rear right
    ];
    
    wheelPositions.forEach((pos, index) => {
        const wheelGroup = new THREE.Group();
        
        // Tire
        const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 24);
        const tire = new THREE.Mesh(tireGeo, matteBlack);
        tire.rotation.x = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        // Tire treads
        const treadGeo = new THREE.BoxGeometry(0.4, 0.03, 0.3);
        for (let i = 0; i < 12; i++) {
            const tread = new THREE.Mesh(treadGeo, matteDarkGray);
            const angle = (i / 12) * Math.PI * 2;
            tread.position.x = Math.cos(angle) * 0.37;
            tread.position.y = Math.sin(angle) * 0.37;
            tread.rotation.z = angle;
            wheelGroup.add(tread);
        }
        
        // Rim
        const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 16);
        const rim = new THREE.Mesh(rimGeo, chromeMatl);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Hub cap
        const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.32, 8);
        const hub = new THREE.Mesh(hubGeo, matteDarkGray);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        // Lug nuts
        const lugGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.33, 6);
        for (let i = 0; i < 5; i++) {
            const lug = new THREE.Mesh(lugGeo, chromeMatl);
            const angle = (i / 5) * Math.PI * 2;
            lug.position.x = Math.cos(angle) * 0.08;
            lug.position.y = Math.sin(angle) * 0.08;
            lug.rotation.x = Math.PI / 2;
            wheelGroup.add(lug);
        }
        
        wheelGroup.position.set(...pos);
        wheels.push(wheelGroup);
        jeep.add(wheelGroup);
    });
    
    // Steering wheel inside
    const steeringGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 16);
    const steering = new THREE.Mesh(steeringGeo, matteDarkGray);
    steering.rotation.x = Math.PI / 2.5;
    steering.position.set(0.15, 1.0, 0.35);
    jeep.add(steering);
    
    // Dashboard
    const dashGeo = new THREE.BoxGeometry(0.8, 0.15, 1.2);
    const dash = new THREE.Mesh(dashGeo, matteDarkGray);
    dash.position.set(0.3, 0.9, 0);
    jeep.add(dash);
    
    // Seats
    const seatBaseGeo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const seatBackGeo = new THREE.BoxGeometry(0.08, 0.4, 0.38);
    const seatMat = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        roughness: 0.9,
        metalness: 0.0
    });
    
    // Driver seat
    const seatBaseL = new THREE.Mesh(seatBaseGeo, seatMat);
    seatBaseL.position.set(-0.15, 0.85, 0.35);
    jeep.add(seatBaseL);
    
    const seatBackL = new THREE.Mesh(seatBackGeo, seatMat);
    seatBackL.position.set(-0.35, 1.05, 0.35);
    jeep.add(seatBackL);
    
    // Passenger seat
    const seatBaseR = seatBaseL.clone();
    seatBaseR.position.z = -0.35;
    jeep.add(seatBaseR);
    
    const seatBackR = seatBackL.clone();
    seatBackR.position.z = -0.35;
    jeep.add(seatBackR);
    
    // Spare tire on back
    const spareTireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 20);
    const spareTire = new THREE.Mesh(spareTireGeo, matteBlack);
    spareTire.rotation.z = Math.PI / 2;
    spareTire.position.set(-1.6, 0.7, 0);
    spareTire.castShadow = true;
    jeep.add(spareTire);
    
    const spareRimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 12);
    const spareRim = new THREE.Mesh(spareRimGeo, chromeMatl);
    spareRim.rotation.z = Math.PI / 2;
    spareRim.position.set(-1.6, 0.7, 0);
    jeep.add(spareRim);
    
    // License plate
    const plateGeo = new THREE.BoxGeometry(0.04, 0.15, 0.4);
    const plateMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1
    });
    const plateFront = new THREE.Mesh(plateGeo, plateMat);
    plateFront.position.set(1.58, 0.35, 0);
    jeep.add(plateFront);
    
    const plateRear = plateFront.clone();
    plateRear.position.x = -1.58;
    jeep.add(plateRear);
    
    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.8, 8);
    const antenna = new THREE.Mesh(antennaGeo, matteDarkGray);
    antenna.position.set(-0.6, 1.9, 0.6);
    jeep.add(antenna);
    
    jeep.wheels = wheels;
    
    return jeep;
}

const jeep = createJeep();
jeep.position.set(0, 0, 5);
scene.add(jeep);

// ============================================
// Chinese Menu Items - 3D Blocks
// ============================================
const chinesePatterns = {
    // 诗 (shī) - 简化像素图案
    '诗': [
        [1,0,1,1,1,0,1],
        [1,0,0,1,0,0,1],
        [1,1,1,1,1,1,1],
        [1,0,0,1,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,1,0,0,0],
        [1,0,0,1,0,0,0]
    ],
    // 集
    '集': [
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1],
        [0,0,1,1,1,0,0],
        [0,1,1,1,1,1,0],
        [1,1,0,1,0,1,1],
        [0,0,1,1,1,0,0],
        [0,1,0,1,0,1,0]
    ],
    // 游
    '游': [
        [0,1,0,0,0,1,0],
        [1,1,1,0,1,1,1],
        [0,1,0,0,1,0,1],
        [1,1,1,0,1,1,1],
        [0,1,0,0,1,0,1],
        [0,1,0,0,1,1,1],
        [0,1,0,0,1,0,1]
    ],
    // 戏
    '戏': [
        [0,0,1,1,0,1,0],
        [0,1,0,0,1,0,1],
        [1,1,1,0,1,1,1],
        [0,1,0,0,0,1,0],
        [0,1,1,0,1,1,0],
        [0,1,0,1,0,1,0],
        [1,0,0,1,0,0,1]
    ],
    // 书
    '书': [
        [0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1],
        [0,0,0,1,0,0,0],
        [0,0,0,1,0,0,0]
    ],
    // 单
    '单': [
        [0,0,1,1,1,0,0],
        [0,1,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,1,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1]
    ],
    // 音
    '音': [
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,1,0,0,0,1,0],
        [0,1,1,1,1,1,0]
    ],
    // 乐
    '乐': [
        [0,0,0,1,0,0,0],
        [1,1,1,1,1,1,1],
        [0,0,1,0,1,0,0],
        [0,1,0,1,0,1,0],
        [1,0,0,1,0,0,1],
        [0,0,0,1,0,0,0],
        [0,0,1,0,1,0,0]
    ]
};

function createChineseBlock(chars, blockSize, height, material, position) {
    const group = new THREE.Group();
    let offsetX = 0;
    
    for (let char of chars) {
        const pattern = chinesePatterns[char];
        if (!pattern) continue;
        
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col]) {
                    const geometry = new THREE.BoxGeometry(blockSize, blockSize, height);
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(
                        offsetX + col * blockSize,
                        (pattern.length - 1 - row) * blockSize,
                        0
                    );
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    group.add(mesh);
                }
            }
        }
        offsetX += (pattern[0].length + 1) * blockSize;
    }
    
    // Center
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.children.forEach(child => {
        child.position.x -= center.x;
        child.position.y -= center.y;
    });
    
    group.position.set(...position);
    return group;
}

// Create menu items at different positions
const menuItems = [
    { chars: '诗集', position: [-12, 1.5, -10], color: menuColors[0] },
    { chars: '游戏', position: [12, 1.5, -10], color: menuColors[1] },
    { chars: '书单', position: [-12, 1.5, 10], color: menuColors[2] },
    { chars: '音乐', position: [12, 1.5, 10], color: menuColors[3] }
];

const menuGroups = [];
menuItems.forEach(item => {
    const menuBlock = createChineseBlock(item.chars, 0.3, 0.6, item.color, item.position);
    scene.add(menuBlock);
    menuGroups.push({ group: menuBlock, position: item.position, chars: item.chars });
    
    // Add platform under menu
    const platformGeo = new THREE.CylinderGeometry(2.5, 2.8, 0.3, 6);
    const platform = new THREE.Mesh(platformGeo, matteGray);
    platform.position.set(item.position[0], 0.15, item.position[2]);
    platform.receiveShadow = true;
    platform.castShadow = true;
    scene.add(platform);
});

// Hide loading
document.getElementById('loading').classList.add('hidden');

// ============================================
// Obstacles - Minimalist low-poly
// ============================================
function createObstacles() {
    const obstacles = new THREE.Group();
    
    // Ramps
    const rampGeometry = new THREE.BoxGeometry(3, 0.8, 2);
    
    const ramp1 = new THREE.Mesh(rampGeometry, matteGray);
    ramp1.position.set(0, 0.2, -8);
    ramp1.rotation.z = -0.15;
    ramp1.castShadow = true;
    ramp1.receiveShadow = true;
    obstacles.add(ramp1);
    
    // Cylindrical bollards
    const bollardGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8);
    const bollardPositions = [
        [5, 0.75, 0],
        [-5, 0.75, 0],
        [0, 0.75, -15],
        [8, 0.75, 8],
        [-8, 0.75, -8]
    ];
    
    bollardPositions.forEach(pos => {
        const bollard = new THREE.Mesh(bollardGeometry, matteGray);
        bollard.position.set(...pos);
        bollard.castShadow = true;
        bollard.receiveShadow = true;
        obstacles.add(bollard);
    });
    
    // Traffic cones
    const coneGeometry = new THREE.ConeGeometry(0.3, 0.8, 6);
    const conePositions = [
        [3, 0.4, 3], [-3, 0.4, 3], [3, 0.4, -3], [-3, 0.4, -3]
    ];
    
    conePositions.forEach(pos => {
        const cone = new THREE.Mesh(coneGeometry, matteYellow);
        cone.position.set(...pos);
        cone.castShadow = true;
        obstacles.add(cone);
    });
    
    return obstacles;
}

const obstacles = createObstacles();
scene.add(obstacles);

// ============================================
// Car Controls - Fixed direction system
// ============================================
const carState = {
    speed: 0,
    maxSpeed: 0.25,
    acceleration: 0.012,
    deceleration: 0.006,
    turnSpeed: 0.035,
    friction: 0.96
};

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
    }
});

function updateCar() {
    // Acceleration / Deceleration
    if (keys.forward) {
        carState.speed = Math.min(carState.speed + carState.acceleration, carState.maxSpeed);
    } else if (keys.backward) {
        carState.speed = Math.max(carState.speed - carState.acceleration, -carState.maxSpeed * 0.6);
    } else {
        // Apply friction
        carState.speed *= carState.friction;
        if (Math.abs(carState.speed) < 0.002) carState.speed = 0;
    }
    
    // Turning - only when moving
    if (Math.abs(carState.speed) > 0.01) {
        const turnDirection = carState.speed > 0 ? 1 : -1;
        const speedFactor = Math.min(Math.abs(carState.speed) / carState.maxSpeed, 1);
        
        if (keys.left) {
            jeep.rotation.y += carState.turnSpeed * turnDirection * speedFactor;
        }
        if (keys.right) {
            jeep.rotation.y -= carState.turnSpeed * turnDirection * speedFactor;
        }
    }
    
    // Move car in direction it's facing
    // 车头在模型中朝向 +X，经过 rotation.y 旋转后的世界坐标方向
    const moveX = Math.cos(jeep.rotation.y) * carState.speed;
    const moveZ = -Math.sin(jeep.rotation.y) * carState.speed;
    
    jeep.position.x += moveX;
    jeep.position.z += moveZ;
    
    // Rotate wheels based on speed
    if (jeep.wheels) {
        jeep.wheels.forEach(wheelGroup => {
            // 找到轮胎并旋转
            wheelGroup.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                    // 绕轮轴旋转
                }
            });
            wheelGroup.rotation.z -= carState.speed * 3;
        });
    }
    
    // Keep car in bounds
    const bounds = 55;
    jeep.position.x = Math.max(-bounds, Math.min(bounds, jeep.position.x));
    jeep.position.z = Math.max(-bounds, Math.min(bounds, jeep.position.z));
}

// ============================================
// Camera Follow
// ============================================
function updateCamera() {
    // Camera follows behind the car - higher and further
    const cameraDistance = 35;
    const cameraHeight = 28;
    
    // 相机在车后方 (车头 +X 方向的反方向)
    const targetX = jeep.position.x - Math.cos(jeep.rotation.y) * cameraDistance;
    const targetZ = jeep.position.z + Math.sin(jeep.rotation.y) * cameraDistance;
    
    const targetPosition = new THREE.Vector3(targetX, cameraHeight, targetZ);
    camera.position.lerp(targetPosition, 0.03);
    
    camera.lookAt(jeep.position.x, 0, jeep.position.z);
}

// ============================================
// Raycaster for menu interaction
// ============================================
const raycaster = new THREE.Raycaster();

function checkMenuProximity() {
    menuGroups.forEach(item => {
        const distance = jeep.position.distanceTo(new THREE.Vector3(item.position[0], 0, item.position[2]));
        if (distance < 4) {
            // Animate menu when car is near
            item.group.rotation.y += 0.02;
            item.group.position.y = 1.5 + Math.sin(Date.now() * 0.003) * 0.2;
        } else {
            item.group.rotation.y *= 0.95;
            item.group.position.y = 1.5;
        }
    });
}

// ============================================
// Resize Handler
// ============================================
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================
// Animation Loop
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    updateCar();
    updateCamera();
    checkMenuProximity();
    
    renderer.render(scene, camera);
}

animate();

// ============================================
// Virtual Steering Wheel Controls (Mobile)
// ============================================
function setupVirtualControls() {
    const wheelOuter = document.getElementById('wheel-outer');
    const wheelInner = document.getElementById('wheel-inner');
    const pedalGas = document.getElementById('pedal-gas');
    const pedalBrake = document.getElementById('pedal-brake');
    
    if (!wheelOuter) return;
    
    let steeringAngle = 0;
    let isDragging = false;
    let startAngle = 0;
    let currentAngle = 0;
    const maxAngle = 60; // 最大转向角度
    
    // 计算触摸点相对于方向盘中心的角度
    function getAngle(touch, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = touch.clientX - centerX;
        const y = touch.clientY - centerY;
        return Math.atan2(y, x) * (180 / Math.PI);
    }
    
    // 方向盘触摸开始
    wheelOuter.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        startAngle = getAngle(touch, wheelOuter) - currentAngle;
    }, { passive: false });
    
    // 方向盘触摸移动
    wheelOuter.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        let angle = getAngle(touch, wheelOuter) - startAngle;
        
        // 限制角度范围
        angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
        currentAngle = angle;
        
        // 更新方向盘视觉旋转
        wheelInner.style.transform = `rotate(${angle}deg)`;
        
        // 根据角度设置转向
        const threshold = 10;
        if (angle < -threshold) {
            keys.left = true;
            keys.right = false;
        } else if (angle > threshold) {
            keys.right = true;
            keys.left = false;
        } else {
            keys.left = false;
            keys.right = false;
        }
    }, { passive: false });
    
    // 方向盘触摸结束
    function endSteering() {
        isDragging = false;
        // 方向盘回正动画
        currentAngle = 0;
        wheelInner.style.transform = 'rotate(0deg)';
        keys.left = false;
        keys.right = false;
    }
    
    wheelOuter.addEventListener('touchend', endSteering);
    wheelOuter.addEventListener('touchcancel', endSteering);
    
    // 鼠标支持（桌面测试）
    let isMouseDragging = false;
    
    wheelOuter.addEventListener('mousedown', (e) => {
        isMouseDragging = true;
        const rect = wheelOuter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) - currentAngle;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
        
        const rect = wheelOuter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) - startAngle;
        
        angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
        currentAngle = angle;
        wheelInner.style.transform = `rotate(${angle}deg)`;
        
        const threshold = 10;
        if (angle < -threshold) {
            keys.left = true;
            keys.right = false;
        } else if (angle > threshold) {
            keys.right = true;
            keys.left = false;
        } else {
            keys.left = false;
            keys.right = false;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isMouseDragging) {
            isMouseDragging = false;
            currentAngle = 0;
            wheelInner.style.transform = 'rotate(0deg)';
            keys.left = false;
            keys.right = false;
        }
    });
    
    // 油门踏板
    function setupPedal(pedal, keyType) {
        pedal.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys[keyType] = true;
            pedal.classList.add('active');
        }, { passive: false });
        
        pedal.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys[keyType] = false;
            pedal.classList.remove('active');
        }, { passive: false });
        
        pedal.addEventListener('touchcancel', () => {
            keys[keyType] = false;
            pedal.classList.remove('active');
        });
        
        // 鼠标支持
        pedal.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keys[keyType] = true;
            pedal.classList.add('active');
        });
        
        pedal.addEventListener('mouseup', () => {
            keys[keyType] = false;
            pedal.classList.remove('active');
        });
        
        pedal.addEventListener('mouseleave', () => {
            keys[keyType] = false;
            pedal.classList.remove('active');
        });
    }
    
    setupPedal(pedalGas, 'forward');
    setupPedal(pedalBrake, 'backward');
    
    // 阻止默认触摸行为
    const virtualControls = document.getElementById('virtual-controls');
    virtualControls.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// Initialize virtual controls when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVirtualControls);
} else {
    setupVirtualControls();
}

console.log('3D 场景已初始化 - 使用方向键或 WASD 驾驶小车！');
