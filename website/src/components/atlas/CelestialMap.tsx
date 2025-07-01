import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CelestialBody {
  id: string;
  name: string;
  type: "star" | "planet" | "moon" | "asteroid-cluster";
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  data: any;
}

interface CelestialMapProps {
  celestialBodies: CelestialBody[];
  onBodySelect: (body: CelestialBody | null) => void;
  selectedBody: CelestialBody | null;
}

export default function CelestialMap({
  celestialBodies,
  onBodySelect,
  selectedBody,
}: CelestialMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 50, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 2000;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Create celestial bodies
    celestialBodies.forEach((body) => {
      const geometry =
        body.type === "asteroid-cluster"
          ? new THREE.BoxGeometry(body.size, body.size, body.size)
          : new THREE.SphereGeometry(body.size, 32, 32);

      const material = new THREE.MeshPhongMaterial({
        color: body.color,
        emissive: body.type === "star" ? body.color : 0x000000,
        emissiveIntensity: body.type === "star" ? 0.3 : 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(body.position.x, body.position.y, body.position.z);
      mesh.userData = body;

      // Add glow effect for stars
      if (body.type === "star") {
        const glowGeometry = new THREE.SphereGeometry(body.size * 2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: body.color,
          transparent: true,
          opacity: 0.1,
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.copy(mesh.position);
        scene.add(glowMesh);

        // Add point light for stars
        const light = new THREE.PointLight(body.color, 1, 200);
        light.position.copy(mesh.position);
        scene.add(light);
      }

      scene.add(mesh);
      meshesRef.current.set(body.id, mesh);
    });

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(
        Array.from(meshesRef.current.values())
      );

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object as THREE.Mesh;
        onBodySelect(selectedObject.userData as CelestialBody);
      } else {
        onBodySelect(null);
      }
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Rotate celestial bodies
      meshesRef.current.forEach((mesh, id) => {
        if (mesh.userData.type !== "star") {
          mesh.rotation.y += 0.01;
        } else {
          mesh.rotation.y += 0.005;
        }
      });

      // Highlight selected body
      meshesRef.current.forEach((mesh, id) => {
        const material = mesh.material as THREE.MeshPhongMaterial;
        if (selectedBody && mesh.userData.id === selectedBody.id) {
          material.emissive.setHex(0x444444);
        } else {
          material.emissive.setHex(
            mesh.userData.type === "star" ? mesh.userData.color : 0x000000
          );
        }
      });

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Basic camera controls (mouse drag to rotate)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUpOrLeave = () => {
      isDragging = false;
    };

    const handleMouseDrag = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          toRadians(deltaMove.y * 1),
          toRadians(deltaMove.x * 1),
          0,
          "XYZ"
        )
      );

      camera.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        camera.quaternion
      );
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      camera.position.multiplyScalar(1 + delta);
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mouseup", handleMouseUpOrLeave);
    renderer.domElement.addEventListener("mouseleave", handleMouseUpOrLeave);
    renderer.domElement.addEventListener("mousemove", handleMouseDrag);
    renderer.domElement.addEventListener("wheel", handleWheel);

    animate();
    setIsLoading(false);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mouseup", handleMouseUpOrLeave);
      renderer.domElement.removeEventListener(
        "mouseleave",
        handleMouseUpOrLeave
      );
      renderer.domElement.removeEventListener("mousemove", handleMouseDrag);
      renderer.domElement.removeEventListener("wheel", handleWheel);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [celestialBodies]);

  useEffect(() => {
    // Update selection highlighting
    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [selectedBody]);

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: "500px" }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-secondary bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
            <p className="text-secondary">Loading Realmspace...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-xs text-muted">
        <p>
          Click and drag to rotate • Scroll to zoom • Click celestial bodies for
          details
        </p>
      </div>
    </div>
  );
}
