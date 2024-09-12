

import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    addBasePlugins,
    TonemapPlugin,
    ISceneObject,
    SSRPlugin,
    SSAOPlugin,
    mobileAndTabletCheck,
    DiamondPlugin,
    BloomPlugin,
    Vector3, GammaCorrectionPlugin, MeshBasicMaterial2, Color, AssetImporter, IAsset, IModel, Object3D
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    });

    const isMobile = mobileAndTabletCheck();
    const manager = await viewer.addPlugin(AssetManagerPlugin);
    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    await addBasePlugins(viewer);
    viewer.renderer.refreshPipeline();

    manager.addFromPath("./assets/ss-011.vjson");
    // const exitButton = document.querySelector('.button--exit') as HTMLElement;
    // const customizerInterface = document.querySelector('.customizer--container') as HTMLElement;
    // const customizerInterface2 = document.querySelector('.customizer--container--two') as HTMLElement;

    // await viewer.addPlugin(GBufferPlugin);
    // await viewer.addPlugin(new ProgressivePlugin(32));
   
    // await viewer.addPlugin(SSRPlugin);
    // await viewer.addPlugin(SSAOPlugin);
    // await viewer.addPlugin(BloomPlugin);
    // await viewer.addPlugin(DiamondPlugin);

    

    const importer = manager.importer as AssetImporter;
    // Load scene settings
    // manager.addFromPath("./assets/ss-011.vjson");

    let currentModel: any | null = null;
    let diamondMaterials: MeshBasicMaterial2[] = [];
    let metalMaterials: MeshBasicMaterial2[] = [];

    function unloadModel() {
        if (currentModel) {
            viewer.scene.removeSceneModels();
            currentModel = null; // Clear reference
        }
    }

   
 // Function to load a model and update the bottom bar content
 async function loadModel(path: string, modelId: string) {
    unloadModel(); // Unload previous model before loading a new one

    try {
        const assets = await manager.addFromPath(path);
        if (Array.isArray(assets) && assets.length > 0) {
            currentModel = assets;
            assets.forEach((asset: ISceneObject) => {
                if ('modelObject' in asset && asset.modelObject instanceof Object3D) {
                    viewer.scene.addModel(asset as IModel<Object3D>);
                }
            });

            // Update bottom bar content dynamically
            updateMaterialReferences();
            updateBottomBarContent(modelId);
            
        } else {
            console.error("Invalid asset type or asset could not be added:", assets);
        }
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Function to update the bottom bar content dynamically
function updateBottomBarContent(modelId: string) {
        const diamondItems = document.getElementById('diamond-toggle-bar') as HTMLElement;
        const metalItems = document.getElementById('metal-toggle-bar') as HTMLElement;

        if (!diamondItems || !metalItems) {
            console.error('Toggle bar items not found.');
            return;
        }

        // Clear existing content
        diamondItems.innerHTML = '';
        metalItems.innerHTML = '';

    const bottomBar = document.querySelector('.nav-links') as HTMLElement;

    if (!bottomBar) {
        console.error('Bottom bar not found.');
        return;
    }

    // Clear the existing content
    bottomBar.innerHTML = '';

    // Dynamically add content based on model ID
    if(modelId === 'model1'){
        bottomBar.innerHTML = `
        <a id="dia" href="#">Diamond</a>
        <a id="metal" href="#">Metal</a>
        <a href="src/mobile.html" class="contact-button">Contact Us</a>
    `;

        diamondItems.innerHTML = `
        <img src="./assets/d1-removebg-preview.png" id="d-1" alt="Model 2 Diamond" class="diamond-item" />
        <img src="./assets/dia2-removebg-preview.png" id="d-2" alt="Model 2 Diamond 2" class="diamond-item" />
        <img src="./assets/dia3-removebg-preview.png" id="d-3" alt="Model 2 Diamond 2" class="diamond-item" />
        `;
        metalItems.innerHTML = `
            <img src="./assets/br1-removebg-preview.png" id="m-1" alt="Model 2 Metal 1" class="metal-item" />
            <img src="./assets/br2-removebg-preview.png" id="m-2" alt="Model 2 Metal 2" class="metal-item" />
        `;

    }
    else if (modelId === 'model2') {
        bottomBar.innerHTML = `
            <a id="machine" href="#">Machine Color</a>
            <a id="bucket" href="#">Metal Bucket</a>
            <a href="src/mobile.html" class="contact-button">Contact Us</a>
        `;

        diamondItems.innerHTML = `
        <img src="./assets/d1-removebg-preview.png" id="d2-1" alt="Model 2 Diamond" class="diamond-item" />
        <img src="./assets/dia2-removebg-preview.png" id="d2-2" alt="Model 2 Diamond 2" class="diamond-item" />
        <img src="./assets/dia3-removebg-preview.png" id="d2-3" alt="Model 2 Diamond 2" class="diamond-item" />
        `;
        metalItems.innerHTML = `
            <img src="./assets/br1-removebg-preview.png" id="m2-1" alt="Model 2 Metal 1" class="metal-item" />
            <img src="./assets/br2-removebg-preview.png" id="m2-2" alt="Model 2 Metal 2" class="metal-item" />
        `;

    } 

    else if (modelId === 'model3') {
        bottomBar.innerHTML = `
            <a id="chair" href="#">Chair Color</a>
          
            <a href="src/mobile.html" class="contact-button">Contact Us</a>
        `;

        diamondItems.innerHTML = `
        <div id="d3-1" class="diamond-item" style="width: 50px; height: 50px; background-color: #FF5733;"></div>
        <div id="d3-2" class="diamond-item" style="width: 50px; height: 50px; background-color: #33FF57;"></div>
        <div id="d3-3" class="diamond-item" style="width: 50px; height: 50px; background-color: #3357FF;"></div>
    `;
        // metalItems.innerHTML = `
        //     <img src="./assets/br1-removebg-preview.png" id="m2-1" alt="Model 2 Metal 1" class="metal-item" />
        //     <img src="./assets/br2-removebg-preview.png" id="m2-2" alt="Model 2 Metal 2" class="metal-item" />
        // `;

    } 
    setModelListners(modelId)
}


function setModelListners(modelId: string)
{

    const diamondLink = document.getElementById('dia');
    const metalLink = document.getElementById('metal');
    const chairLink = document.getElementById('chair');
    const machineLink = document.getElementById('machine');
    const bucketLink = document.getElementById('bucket');
    const diamondToggleBar = document.getElementById('diamond-toggle-bar') as HTMLElement;
    const metalToggleBar = document.getElementById('metal-toggle-bar') as HTMLElement;


    // Show/hide the diamond toggle bar
    if (diamondLink) {
        diamondLink.addEventListener('click', (event) => {
            event.preventDefault();
            const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
            diamondToggleBar.style.left = `${buttonRect.left + (buttonRect.width / 2) - (diamondToggleBar.offsetWidth / 2)}px`;
            diamondToggleBar.style.top = `${buttonRect.top - diamondToggleBar.offsetHeight - 10}px`;
            diamondToggleBar.classList.toggle('show');
            metalToggleBar.classList.remove('show');  // Hide metal bar when diamond is shown

            // Disable camera controls while animating
            viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

            // Create GSAP timeline to animate the camera
            const tl = gsap.timeline({
                onUpdate: () => viewer.setDirty(),  // Ensure the viewer updates during the animation
                onComplete: () => {
                    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });  // Re-enable camera controls after animation
                }
            });

            // Define animation parameters (you can adjust these values)
            tl.to(viewer.scene.activeCamera.position, { 
                x: -4.40, 
                y: 2.07, 
                z: 8.73, 
                duration: 4, 
                ease: "sine.inOut" 
            }).to(viewer.scene.activeCamera.target, { 
                x: -0.2, 
                y: 0, 
                z: 0.12, 
                duration: 4, 
                ease: "sine.inOut" 
            }, 0);
        });
    }

    // Show/hide the metal toggle bar
    if (metalLink) {
        metalLink.addEventListener('click', (event) => {
            event.preventDefault();
            const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
            metalToggleBar.style.left = `${buttonRect.left + (buttonRect.width / 2) - (metalToggleBar.offsetWidth / 2)}px`;
            metalToggleBar.style.top = `${buttonRect.top - metalToggleBar.offsetHeight - 10}px`;
            metalToggleBar.classList.toggle('show');
            diamondToggleBar.classList.remove('show');  // Hide diamond bar when metal is shown

            // Disable camera controls while animating
            viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

            // Create GSAP timeline to animate the camera
            const tl = gsap.timeline({
                onUpdate: () => viewer.setDirty(),  // Ensure the viewer updates during the animation
                onComplete: () => {
                    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });  // Re-enable camera controls after animation
                }
            });

            // Define animation parameters (you can adjust these values)
            tl.to(viewer.scene.activeCamera.position, { 
                x: 9.66, 
                y: 2.54, 
                z: -0.03, 
                duration: 4, 
                ease: "sine.inOut" 
            }).to(viewer.scene.activeCamera.target, { 
                x: -0.2, 
                y: 0, 
                z: 0.12, 
                duration: 4, 
                ease: "sine.inOut" 
            }, 0); 
        });
        
    }


     // Show/hide the diamond toggle bar
     if (machineLink) {
        machineLink.addEventListener('click', (event) => {
            event.preventDefault();
            const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
            diamondToggleBar.style.left = `${buttonRect.left + (buttonRect.width / 2) - (diamondToggleBar.offsetWidth / 2)}px`;
            diamondToggleBar.style.top = `${buttonRect.top - diamondToggleBar.offsetHeight - 10}px`;
            diamondToggleBar.classList.toggle('show');
            metalToggleBar.classList.remove('show');  // Hide metal bar when diamond is shown

            // Disable camera controls while animating
            viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

            // Create GSAP timeline to animate the camera
            const tl = gsap.timeline({
                onUpdate: () => viewer.setDirty(),  // Ensure the viewer updates during the animation
                onComplete: () => {
                    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });  // Re-enable camera controls after animation
                }
            });

            // Define animation parameters (you can adjust these values)
            tl.to(viewer.scene.activeCamera.position, { 
                x: 9.66, 
                y: 2.54, 
                z: -0.03, 
                duration: 4, 
                ease: "sine.inOut" 
            }).to(viewer.scene.activeCamera.target, { 
                x: -0.2, 
                y: 0, 
                z: 0.12, 
                duration: 4, 
                ease: "sine.inOut" 
            }, 0);
        });
    }

    // Show/hide the metal toggle bar
    if (bucketLink) {
        bucketLink.addEventListener('click', (event) => {
            event.preventDefault();
            const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
            metalToggleBar.style.left = `${buttonRect.left + (buttonRect.width / 2) - (metalToggleBar.offsetWidth / 2)}px`;
            metalToggleBar.style.top = `${buttonRect.top - metalToggleBar.offsetHeight - 10}px`;
            metalToggleBar.classList.toggle('show');
            diamondToggleBar.classList.remove('show');  // Hide diamond bar when metal is shown

            // Disable camera controls while animating
            viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

            // Create GSAP timeline to animate the camera
            const tl = gsap.timeline({
                onUpdate: () => viewer.setDirty(),  // Ensure the viewer updates during the animation
                onComplete: () => {
                    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });  // Re-enable camera controls after animation
                }
            });

            // Define animation parameters (you can adjust these values)
            tl.to(viewer.scene.activeCamera.position, { 
                x: 6.65, 
                y: -1.67, 
                z: 7.26, 
                duration: 4, 
                ease: "sine.inOut" 
            }).to(viewer.scene.activeCamera.target, { 
                x: -0.2, 
                y: 0, 
                z: 0.12, 
                duration: 4, 
                ease: "sine.inOut" 
            }, 0); 
        });
        
    }

        // Show/hide the diamond toggle bar
        if (chairLink) {
            chairLink.addEventListener('click', (event) => {
                event.preventDefault();
                const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
                diamondToggleBar.style.left = `${buttonRect.left + (buttonRect.width / 2) - (diamondToggleBar.offsetWidth / 2)}px`;
                diamondToggleBar.style.top = `${buttonRect.top - diamondToggleBar.offsetHeight - 10}px`;
                diamondToggleBar.classList.toggle('show');
                metalToggleBar.classList.remove('show');  // Hide metal bar when diamond is shown
    
                // Disable camera controls while animating
                viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    
                // Create GSAP timeline to animate the camera
                const tl = gsap.timeline({
                    onUpdate: () => viewer.setDirty(),  // Ensure the viewer updates during the animation
                    onComplete: () => {
                        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });  // Re-enable camera controls after animation
                    }
                });
    
                // Define animation parameters (you can adjust these values)
                tl.to(viewer.scene.activeCamera.position, { 
                    x: -4.40, 
                    y: 2.07, 
                    z: 8.73, 
                    duration: 4, 
                    ease: "sine.inOut" 
                }).to(viewer.scene.activeCamera.target, { 
                    x: -0.2, 
                    y: 0, 
                    z: 0.12, 
                    duration: 4, 
                    ease: "sine.inOut" 
                }, 0);
            });
        }

    

    // Add custom event listeners for diamond items
    if (modelId === 'model1') {
        document.getElementById('d-1')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xffffff).convertSRGBToLinear());
        });

        document.getElementById('d-2')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0x87eef1).convertSRGBToLinear());
        });

       

        document.getElementById('d-3')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xe49eef).convertSRGBToLinear());
        });
    
        document.getElementById('m-1')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xffffff).convertSRGBToLinear());
        });

        document.getElementById('m-2')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xeaa2a2).convertSRGBToLinear());
        });

    } 
    // Add custom event listeners for diamond items
    if (modelId === 'model2') {
        document.getElementById('d2-1')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xdddddd).convertSRGBToLinear());
        });

        document.getElementById('d2-2')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0x81e1e1).convertSRGBToLinear());
        });

       

        document.getElementById('d2-3')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xebb550).convertSRGBToLinear());
        });
    
        document.getElementById('m2-1')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xfefefe).convertSRGBToLinear());
        });

        document.getElementById('m2-2')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xffd1b2).convertSRGBToLinear());
        });

    }


     // Add custom event listeners for diamond items
     if (modelId === 'model3') {
        document.getElementById('d-1')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xffffff).convertSRGBToLinear());
        });

        document.getElementById('d-2')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0x87eef1).convertSRGBToLinear());
        });

       

        document.getElementById('d-3')?.addEventListener('click', () => {
            changeDiamondColor(new Color(0xe49eef).convertSRGBToLinear());
        });
    
        document.getElementById('m-1')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xffffff).convertSRGBToLinear());
        });

        document.getElementById('m-2')?.addEventListener('click', () => {
            changeMetalColor(new Color(0xeaa2a2).convertSRGBToLinear());
        });

    } 

    // Close bars when close buttons are clicked
    const closeDiamondToggleBar = document.getElementById('close-toggle-bar');
    const closeMetalToggleBar = document.getElementById('close-toggle-bar-metal');

    if (closeDiamondToggleBar) {
        closeDiamondToggleBar.addEventListener('click', () => {
            diamondToggleBar.classList.remove('show');
        });
    }

    if (closeMetalToggleBar) {
        closeMetalToggleBar.addEventListener('click', () => {
            metalToggleBar.classList.remove('show');
        });
    }

}
// Example button click events to load different models
document.getElementById('model2')?.addEventListener('click', () => {
    loadModel("./assets/mixermachine-1.glb", 'model2');
});

// Example button click events to load different models
document.getElementById('model3')?.addEventListener('click', () => {
    loadModel("./assets/plastic-chair1.glb", 'model3');
});



function updateMaterialReferences() {
    // Clear previous material references
    diamondMaterials = [];
    metalMaterials = [];
  
    // Traverse all materials of the loaded model
    currentModel?.forEach((asset: ISceneObject) => {
        if ('modelObject' in asset && asset.modelObject instanceof Object3D) {
            asset.modelObject.traverse((object: Object3D) => {
                if ((object as any).material) {
                    const material = (object as any).material;

                    // Identify diamond, metal, and text materials
                    if (material.name.toLowerCase().includes("diamond") || material.name.toLowerCase().includes("SMEG_SMALL_APPLIANCES02_base")) {
                        diamondMaterials.push(material as MeshBasicMaterial2);
                    } else if (material.name.toLowerCase().includes("gold") || material.name.toLowerCase().includes("SMEG_SMALL_APPLIANCES02_Material #139") ) {
                        metalMaterials.push(material as MeshBasicMaterial2);
                    }
                    
                    

                    
                }
            });
        }
    });

    // Log the found materials for debugging purposes
    console.log("Diamond materials found:", diamondMaterials);
    console.log("Metal materials found:", metalMaterials);
  
    viewer.scene.setDirty(); // Ensure the scene is re-rendered
}


   function changeDiamondColor(_colorToBeChanged: Color) {
        diamondMaterials.forEach(material => {
            if (material) {
                material.color = _colorToBeChanged;
            }
        });
        viewer.scene.setDirty();
    }

    function changeMetalColor(_colorToBeChanged: Color) {
        metalMaterials.forEach(material => {
            if (material) {
                material.color = _colorToBeChanged;
            }
        });
        viewer.scene.setDirty();
    }

    // INITIAL MODEL LOADING
    await loadModel("./assets/ss-011-red.glb",'model1');
    

    //  setupColorChangeListeners();
    viewer.renderer.refreshPipeline();

    // viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true;
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    // if (isMobile) {
    //     position.set(-3.5, -1.1, 5.5);
    //     target.set(-0.8, 1.55, -0.7);
    //     camera.setCameraOptions({ fov: 40 });
    // } else {
    //     target.set(-1.4, 2, 1);
    // }

    window.scrollTo(0, 0);

    // WEBGI UPDATE
    viewer.addEventListener('preFrame', () => {
        camera.positionTargetUpdated();
    });

    

    // CUSTOMIZE
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement;
    mainContainer.style.pointerEvents = "all";
    document.body.style.cursor = "grab";

    gsap.to(position, { x: 0.06, y: 3.17, z: 9.48, duration: 2, ease: "power3.inOut", onUpdate: () => viewer.setDirty() });
    gsap.to(target, { x: 0, y: 0.000001, z: 0.12, duration: 2, ease: "power3.inOut", onUpdate: () => viewer.setDirty(), onComplete: enableControllers });

    function enableControllers() {
        // customizerInterface.style.display = "block";
        // customizerInterface2.style.display = "block";
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
    }

}

setupViewer();




