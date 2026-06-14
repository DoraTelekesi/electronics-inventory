import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  animationId!: number;
  sphere!: THREE.Mesh;

  constructor(private ngZone: NgZone) {}

  init(canvas: HTMLCanvasElement) {
    //add texture to sphere
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load('assets/img/8k_venus_surface.jpg');
    planetTexture.colorSpace = THREE.SRGBColorSpace;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      400,
    );
    this.camera.position.z = 2.5;
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: planetTexture });
    this.sphere = new THREE.Mesh(sphereGeometry, material);

    this.sphere.position.x = 0;
    this.sphere.position.y = -1;
    this.scene.add(this.sphere);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 50);
    pointLight.position.set(2, 2, 2);
    this.scene.add(pointLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.sphere.rotation.y += 0.00008;
    this.sphere.rotation.x -= 0.00008;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.clear();
    }
  }
}
