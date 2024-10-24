import * as THREE from 'three';
import Experience from '../Experience.js';
import AudioManager from './AudioManager.js';
export default class GroundManager {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.groundTiles = [];
        this.tileLength = 20;
        this.nbTilesGenerated = 0;
        this.changeBiomEach = 10;

        this.AudioManager = new AudioManager();

        // Use an array to store both models
        this.models = [
            this.experience.resources.items['corridorMesh'],
            this.experience.resources.items['strecherMesh'],
            this.experience.resources.items['chairMesh'],
            this.experience.resources.items['slideMesh'],
        ];

        // Store references to the models individually
        this.corridorMesh = this.experience.resources.items['corridorMesh'];
        this.stretcherMesh = this.experience.resources.items['strecherMesh'];
        this.chairMesh = this.experience.resources.items['chairMesh'];
        this.pizzaMesh = this.experience.resources.items['pizzaMesh'];
        this.slideMesh = this.experience.resources.items['slideMesh'];
        this.corridor1_1 = this.experience.resources.items['corridor1_1'];
        this.corridor1_2 = this.experience.resources.items['corridor1_2'];
        this.corridor2_1 = this.experience.resources.items['corridor2_1'];
        this.corridor2_2 = this.experience.resources.items['corridor2_2'];
        this.corridor3_1 = this.experience.resources.items['corridor3_1'];
        this.corridor3_2 = this.experience.resources.items['corridor3_2'];
        this.corridor4_1 = this.experience.resources.items['corridor4_1'];
        this.corridor4_2 = this.experience.resources.items['corridor4_2'];

    }

    initializeGround() {
        for (let i = 0; i < 5; i++) {
            const floor = this.createTile(i * this.tileLength - this.tileLength);
            this.scene.add(floor);
            this.groundTiles.push(floor);
        }
    }

    createTile(positionZ) {
        // Randomly select a model from the models array
        const randomIndex = Math.floor(Math.random() * this.models.length);
        const selectedModel = this.models[randomIndex];

        let floor;

        switch (selectedModel) {
            case this.stretcherMesh:
                if (this.nbTilesGenerated > this.changeBiomEach * 2) {
                    floor = this.prepareCorridor3_2Mesh(positionZ);
                } else if (this.nbTilesGenerated > this.changeBiomEach) {
                    floor = this.prepareCorridor3_1Mesh(positionZ);
                } else {
                    floor = this.prepareStretcherMesh(positionZ);
                }

                break;
            case this.chairMesh:
                if (this.nbTilesGenerated > this.changeBiomEach * 2) {
                    floor = this.prepareCorridor4_2Mesh(positionZ);
                } else if (this.nbTilesGenerated > this.changeBiomEach) {
                    floor = this.prepareCorridor4_1Mesh(positionZ);
                } else {
                    floor = this.prepareChairMesh(positionZ);
                }
                break;
            case this.slideMesh:
                floor = this.prepareSlideMesh(positionZ);
                break;
            default:
                if (this.nbTilesGenerated > this.changeBiomEach) {
                    floor = this.prepareCorridor1_2Mesh(positionZ);
                } else {
                    floor = this.prepareFloorMesh(positionZ);
                }
                break;
        }

        this.nbTilesGenerated++;

        if (this.nbTilesGenerated > this.changeBiomEach * 3) {
            this.nbTilesGenerated = 0;
        }

        return floor;
    }

    prepareCorridor1_2Mesh(positionZ) {

        let meshClone

        if (this.nbTilesGenerated > this.changeBiomEach * 2) {
            meshClone = this.corridor2_2.scene.clone(true);
        } else {
            meshClone = this.corridor1_2.scene.clone(true);
        }

        meshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1, y: 1.5, z: 2.5, width: 2, height: 0.8, depth: 0.1 },
            { x: -1, y: 1.5, z: -1, width: 2, height: 0.8, depth: 0.2 },
            { x: 0, y: 1, z: -3.2, width: 1, height: 0.8, depth: 2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            meshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(-1.5, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        meshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        meshClone.userData.colliders = colliders;

        return meshClone;
    }

    prepareCorridor3_1Mesh(positionZ) {

        let meshClone = this.corridor3_1.scene.clone(true);
        meshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1.5, z: 2, width: 2, height: 0.8, depth: 0.1 },
            { x: 1.5, y: 1, z: 2, width: 2, height: 2, depth: 0.1 },
            { x: -1, y: 1, z: -6.5, width: 2, height: 2, depth: 0.2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            meshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(-1.5, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        meshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        meshClone.userData.colliders = colliders;

        return meshClone;
    }

    prepareCorridor3_2Mesh(positionZ) {

        let meshClone = this.corridor3_2.scene.clone(true);
        meshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1.2, z: 5.5, width: 2, height: 0.1, depth: 0.1 },
            { x: -1.5, y: 1.5, z: -4.5, width: 2, height: 0.8, depth: 0.1 },
            { x: 1.5, y: 1, z: -.5, width: 2, height: 2, depth: 0.1 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            meshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(-1.5, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        meshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        meshClone.userData.colliders = colliders;

        return meshClone;
    }

    prepareCorridor4_1Mesh(positionZ) {

        let meshClone = this.corridor4_1.scene.clone(true);
        meshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 0, y: 1.5, z: -8.5, width: 2, height: 0.8, depth: 0.1 },
            { x: 1, y: 1, z: -0.5, width: 2, height: 2, depth: 0.1 },
            { x: -1.5, y: 1, z: 7.5, width: 1, height: 2, depth: 2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            meshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(0, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(1.5, 0.1, 7);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        meshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        meshClone.userData.colliders = colliders;

        return meshClone;
    }

    prepareCorridor4_2Mesh(positionZ) {

        let meshClone = this.corridor4_2.scene.clone(true);
        meshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1.25, y: 1.5, z: 2, width: 2, height: 0.8, depth: 0.1 },
            { x: -1.25, y: 1, z: 2, width: 2, height: 2, depth: 0.1 },
            { x: 0, y: 1, z: -7, width: 2, height: 2, depth: 0.1 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            meshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(-1.5, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        meshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        meshClone.userData.colliders = colliders;

        return meshClone;
    }

    prepareStretcherMesh(positionZ) {
        const stretcherMeshClone = this.stretcherMesh.scene.clone(true);
        stretcherMeshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1, y: 1, z: 3, width: 3, height: 2, depth: 1 },
            { x: -1, y: 0.75, z: -5, width: 3, height: 0.8, depth: 0.2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            stretcherMeshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(0, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        stretcherMeshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        stretcherMeshClone.userData.colliders = colliders;

        return stretcherMeshClone;
    }

    prepareChairMesh(positionZ) {
        const chairMeshClone = this.chairMesh.scene.clone(true);
        chairMeshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1, z: 3.9, width: 1, height: 2, depth: 1.5 },
            { x: 1.5, y: 0.75, z: -4, width: 1, height: 1.5, depth: 2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xffff00 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            chairMeshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        chairMeshClone.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        chairMeshClone.userData.colliders = colliders;

        return chairMeshClone;
    }

    prepareFloorMesh(positionZ) {
        const corridorMesh = this.corridorMesh.scene.clone(true);
        corridorMesh.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xffff00 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            corridorMesh.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, -6);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        corridorMesh.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        corridorMesh.userData.colliders = colliders;

        return corridorMesh;
    }

    prepareSlideMesh(positionZ) {
        let slideMesh;
        if (this.nbTilesGenerated > this.changeBiomEach * 2) {
            slideMesh = this.corridor2_1.scene.clone(true);
        } else if (this.nbTilesGenerated > this.changeBiomEach) {
            slideMesh = this.corridor1_1.scene.clone(true);
        } else {
            slideMesh = this.slideMesh.scene.clone(true);
        }

        slideMesh.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1.5, y: 0.5, z: -7, width: 3, height: 0.5, depth: 0.3 },
            { x: -1.5, y: 1.8, z: -1, width: 3, height: 1, depth: 0.5 },
            { x: 1.5, y: 0.75, z: 5.5, width: 1, height: 1.5, depth: 2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xffff00 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            slideMesh.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, -6);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        slideMesh.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        slideMesh.userData.colliders = colliders;

        return slideMesh;
    }



    createPizzaWithCollider(x, y, z) {
        const pizza = this.pizzaMesh.scene.clone(true);
        pizza.scale.set(0.2, 0.2, 0.2);
        pizza.position.set(x, y + .5, z);

        const collider = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.3),
            new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
        );
        collider.position.set(0, 0, 0);
        collider.userData.isCollider = true;
        collider.name = 'pizza';

        return { mesh: pizza, collider: collider };
    }

    update(playerManager, deltaTime) {
        const playerZ = playerManager.getLeadPlayerPosition().z;

        if (playerZ > this.groundTiles[1].position.z + this.tileLength / 2) {
            const oldTile = this.groundTiles.shift();
            this.scene.remove(oldTile);

            const lastTile = this.groundTiles[this.groundTiles.length - 1];
            const newTilePositionZ = lastTile.position.z + this.tileLength;
            const newTile = this.createTile(newTilePositionZ);

            this.scene.add(newTile);
            this.groundTiles.push(newTile);
        }

        for (const tile of this.groundTiles) {
            // Rotate pizzas
            this.rotatePizzas(tile, deltaTime);
        }

        // Collision detection
        this.checkCollisions(playerManager);
    }

    rotatePizzas(tile, deltaTime) {
        // Find all pizza meshes and rotate them
        tile.traverse((child) => {
            if (child.isMesh && child.name === 'pizza') {
                child.parent.rotation.y += deltaTime * 0.001;
            }
        });
    }

    checkCollisions(playerManager) {
        for (const tile of this.groundTiles) {
            // Check if the tile has colliders
            if (tile.userData.colliders) {
                for (const collider of tile.userData.colliders) {
                    // Skip this collider if it has already been collected
                    if (collider.userData.collected) continue;

                    const colliderBox = new THREE.Box3().setFromObject(collider);

                    for (const player of playerManager.players) {
                        const playerPosition = player.model.position.clone();
                        // playerPosition.y = 1;
                        const playerBox = new THREE.Box3().setFromCenterAndSize(playerPosition, new THREE.Vector3(1, 2, 1));
                        if (colliderBox.intersectsBox(playerBox)) {
                            // console.log('Collision detected with collider and player ' + player.id);
                            if (collider.name === 'pizza') {
                                if (player.id === 1) {
                                    player.updateFood(1);
                                    const pizzaMesh = collider.parent;
                                    this.AudioManager.playEating();
                                    tile.remove(pizzaMesh);
                                    // Mark the pizza as collected
                                    collider.userData.collected = true;
                                }
                            } else if (!player.isImmune) {
                                this.AudioManager.playCollision();
                                player.collide();
                            }
                        }
                    }
                }
            }
        }
    }
}
