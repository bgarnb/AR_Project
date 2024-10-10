// Import helper functions to load models, audio, and videos
import {loadGLTF, loadAudio} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE; // Use THREE.js from the MindAR library

// Wait for the DOM content to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  let mindarThree = null; // Variable to hold the AR session instance
  let isStarted = false;  // Flag to track if the AR session is running

  // Function to start the AR experience
  const start = async () => {
    if (isStarted) return; // If already started, do nothing
    isStarted = true;      // Mark the session as started

    // Initialize MindAR with the container and image target configuration
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,                // Use the whole page as the AR view
      imageTargetSrc: './assets/targets/targets.mind' // Define the image target file
    });
    const {renderer, scene, camera} = mindarThree;

    // Add ambient light to the scene to illuminate 3D models
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load the raccoon 3D model
    const raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
    
    raccoon.scene.scale.set(0.1, 0.1, 0.1);  // Scale the model
    raccoon.scene.position.set(0, -0.4, 0);  // Set the model's position in the scene

    // Load the bear 3D model
    const bear = await loadGLTF('./assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    // Load a video texture for displaying video content on a plane
    //const video = await loadVideo("./assets/videos/sintel/sintel.mp4");
    //const texture = new THREE.VideoTexture(video);
    //const geometry = new THREE.PlaneGeometry(1, 204 / 480); // Geometry for video plane
    //const material = new THREE.MeshBasicMaterial({ map: texture });
    //const plane = new THREE.Mesh(geometry, material);

    // Create anchors for each target (raccoon, bear, video) in the AR experience
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    // Load and add audio to the raccoon target
    const audioClip1 = await loadAudio('./assets/sounds/musicband-background.mp3');
    const listener1 = new THREE.AudioListener();
    camera.add(listener1);
    const audio1 = new THREE.PositionalAudio(listener1);
    raccoonAnchor.group.add(audio1);
    audio1.setBuffer(audioClip1);
    audio1.setRefDistance(100);
    audio1.setLoop(true);

    // Play/pause audio when the raccoon target is found/lost
    raccoonAnchor.onTargetFound = () => {
      audio1.play();
    };
    raccoonAnchor.onTargetLost = () => {
      audio1.pause();
    };

    // Setup bear anchor with similar logic as the raccoon
    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    const audioClip2 = await loadAudio('./assets/sounds/musicband-background.mp3');
    const listener2 = new THREE.AudioListener();
    camera.add(listener2);
    const audio2 = new THREE.PositionalAudio(listener2);
    bearAnchor.group.add(audio2);
    audio2.setBuffer(audioClip2);
    audio2.setRefDistance(100);
    audio2.setLoop(true);

    bearAnchor.onTargetFound = () => {
      audio2.play();
    };
    bearAnchor.onTargetLost = () => {
      audio2.pause();
    };

    // Setup video anchor for the third target
    //const videoAnchor = mindarThree.addAnchor(2);
    //videoAnchor.group.add(plane);

    //videoAnchor.onTargetFound = () => {
      //video.play();
    //};
    //videoAnchor.onTargetLost = () => {
      //video.pause();
    //};

    // Set the starting point of the video when played
    //video.addEventListener('play', () => {
      //video.currentTime = 6; // Start video from 6 seconds
    //});

    // Start the AR experience and continuously render the scene
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Enable stop button, disable start button
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
  };

  // Function to stop the AR experience
  const stop = () => {
    if (!isStarted) return; // Prevent stopping if not started
    isStarted = false;

    // Stop the AR experience and animation loop
    mindarThree.stop();
    mindarThree.renderer.setAnimationLoop(null);
    mindarThree = null; // Reset the AR instance

    // Enable start button, disable stop button
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
  };

  // Add event listeners to the start and stop buttons
  document.getElementById('startButton').addEventListener('click', start);
  document.getElementById('stopButton').addEventListener('click', stop);
});
