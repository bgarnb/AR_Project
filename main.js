import {loadGLTF, loadAudio, loadVideo} from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    //initiate the AR 3 object
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/Alltargets.mind'
    });
    const {renderer, scene, camera} = mindarThree;


    const video1 = await loadVideo("./assets/videos/FirstVideo.mp4");
    const texture1 = new THREE.VideoTexture(video1);
    const geometry1 = new THREE.PlaneGeometry(1, 204/480);
    const material1 = new THREE.MeshBasicMaterial({map: texture1});
    const plane1 = new THREE.Mesh(geometry1, material1);
    
    const anchor1 = mindarThree.addAnchor(0);
    anchor1.group.add(plane1);

    anchor1.onTargetFound = () => {
      video1.play();
    }
    anchor1.onTargetLost = () => {
      video1.pause();
    }
    video1.addEventListener( 'play', () => {
      video1.currentTime = 6;
    });
      
    const video2 = await loadVideo("./assets/videos/SoftboxInfo.mp4");
    const texture2 = new THREE.VideoTexture(video2);
    const geometry2 = new THREE.PlaneGeometry(1, 204/480);
    const material2 = new THREE.MeshBasicMaterial({map: texture2});
    const plane2 = new THREE.Mesh(geometry2, material2);
    
    const anchor2 = mindarThree.addAnchor(1);
    
    anchor2.group.add(plane2);
    anchor2.onTargetFound = () => {
      video2.play();
    }
    anchor2.onTargetLost = () => {
      video2.pause();
    }
    video2.addEventListener( 'play', () => {
      video2.currentTime = 6;
    });
      
    const video3 = await loadVideo("./assets/videos/BackdropInfo.mp4");
    const texture3 = new THREE.VideoTexture(video);
    const geometry3 = new THREE.PlaneGeometry(1, 204/480);
    const material3 = new THREE.MeshBasicMaterial({map: texture});
    const plane3 = new THREE.Mesh(geometry, material);
      
      
          
    const anchor3 = mindarThree.addAnchor(2);
    anchor3.group.add(plane3);

    anchor3.onTargetFound = () => {
      video3.play();
    }
    anchor3.onTargetLost = () => {
      video3.pause();
    }
    video3.addEventListener( 'play', () => {
     video3.currentTime = 6;
    });
      
//start the experience
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  //to πλήκτρο start δουλεύει για μια φορά μόνο
  //const startButton = document.createElement("button");
  //startButton.textContent = "Start";
  //startButton.addEventListener("click", start);
  //document.body.appendChild(startButton);
  start();
});

