document.addEventListener("DOMContentLoaded", () => {
    // Check if Three.js loaded successfully
    if (typeof THREE === 'undefined') return;

    // Only run if the hero section exists
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Behind text but above the background
    canvas.style.pointerEvents = 'none'; // Ensure it doesn't block clicks
    
    // Ensure hero content stays above canvas
    const container = hero.querySelector('.container');
    if (container) {
        container.style.position = 'relative';
        container.style.zIndex = '2';
    }
    
    hero.insertBefore(canvas, hero.firstChild);

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 150;

    // Particles/Nodes
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 500; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 500; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 500; // z
        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material matching the cyan theme
    const material = new THREE.PointsMaterial({
        size: 2,
        color: 0x06b6d4, // Cyan
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Subtle rotation responsive to mouse
        scene.rotation.y += 0.001 + (mouseX * 0.0005 - scene.rotation.y) * 0.05;
        scene.rotation.x += 0.0005 + (mouseY * 0.0005 - scene.rotation.x) * 0.05;

        const positionsAttribute = geometry.getAttribute('position');
        const posArray = positionsAttribute.array;

        // Move particles slightly
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i].x;
            posArray[i * 3 + 1] += velocities[i].y;
            posArray[i * 3 + 2] += velocities[i].z;

            // Bounds check
            if (posArray[i * 3] < -250 || posArray[i * 3] > 250) velocities[i].x *= -1;
            if (posArray[i * 3 + 1] < -250 || posArray[i * 3 + 1] > 250) velocities[i].y *= -1;
            if (posArray[i * 3 + 2] < -250 || posArray[i * 3 + 2] > 250) velocities[i].z *= -1;
        }

        positionsAttribute.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
