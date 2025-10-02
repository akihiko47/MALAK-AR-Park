class ARPhotoCapture 
{
  constructor() 
  {
    this.photoBtn = document.getElementById('photoBtn');
    this.photoModal = document.getElementById('photoModal');
    this.capturedPhoto = document.getElementById('capturedPhoto');
    this.saveBtn = document.getElementById('saveBtn');
    this.backBtn = document.getElementById('backBtn');
    this.ticketBtn = document.getElementById('ticketBtn');
    this.scanOverlay = document.getElementById('custom-scanning-overlay');
    
    this.arCanvas = null;
    this.video = null;
    this.sceneEl = document.querySelector('a-scene');
    this.isModalOpen = false;
    this.targetEntity = null;
    this.isTargetFound = false;

    this.initElements();
    this.initEvents();
  }

  initElements() 
  {
    if (!this.sceneEl) 
    {
      console.error("A-Frame scene not found!");
      return;
    }

    this.sceneEl.addEventListener("loaded", () => {
      this.arCanvas = this.sceneEl.querySelector("canvas");
      this.video = document.querySelector("video");
      this.targetEntity = this.sceneEl.querySelector("a-entity[mindar-image-target]");

      console.log("Elements initialized:", {
        video: this.video,
        arCanvas: this.arCanvas,
        sceneEl: this.sceneEl,
        videoWidth: this.video?.videoWidth,
        videoHeight: this.video?.videoHeight
      });

      if (this.targetEntity) 
      {
        this.targetEntity.addEventListener("targetFound", () => {
          this.isTargetFound = true;
          if (!this.isModalOpen) this.scanOverlay?.classList.add("hidden");
        });
        this.targetEntity.addEventListener("targetLost", () => {
          this.isTargetFound = false;
          if (!this.isModalOpen) this.scanOverlay?.classList.remove("hidden");
        });
      }
    });
  }

  initEvents() 
  {
    this.photoBtn.addEventListener('click', () => this.capturePhoto());
    this.saveBtn.addEventListener('click', () => this.savePhoto());
    this.backBtn.addEventListener('click', () => this.goBack());
    this.ticketBtn.addEventListener('click', () => this.goTicket());
  }

  async capturePhoto() 
  {
    try 
    {
      if (!this.video || !this.arCanvas || !this.sceneEl) 
      {
        this.sceneEl = document.querySelector('a-scene');
        this.arCanvas = this.sceneEl.querySelector('canvas');
        this.video = document.querySelector('video');
        console.log('Re-checked elements:', {
          video: this.video,
          arCanvas: this.arCanvas,
          sceneEl: this.sceneEl
        });
      }

      if (!this.video || !this.arCanvas || !this.sceneEl) {
        console.error('Required elements not found:', { 
          video: this.video, 
          arCanvas: this.arCanvas,
          sceneEl: this.sceneEl 
        });
        alert('Error: Required camera elements not found. Please try again in a few seconds.');
        return;
      }

      if (!this.video.videoWidth || !this.video.videoHeight) 
      {
        console.error('Video dimensions not available:', { 
          width: this.video.videoWidth, 
          height: this.video.videoHeight 
        });
        alert('Error: Camera not initialized. Please ensure camera access is allowed.');
        return;
      }

      if (this.sceneEl.renderer) 
      {
        this.sceneEl.renderer.render(this.sceneEl.object3D, this.sceneEl.camera);
        console.log('A-Frame scene rendered');
      }

      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');

      const isPortrait = window.innerHeight > window.innerWidth;
      const screenAspect = window.innerWidth / window.innerHeight;

      combinedCanvas.width = 1080;
      combinedCanvas.height = 1920;

      console.log('Canvas dimensions set to screen:', combinedCanvas.width, combinedCanvas.height, 'Is portrait:', isPortrait);

      const videoAspect = this.video.videoWidth / this.video.videoHeight;
      let videoDrawWidth = combinedCanvas.width;
      let videoDrawHeight = combinedCanvas.width / videoAspect;
      let videoOffsetX = 0;
      let videoOffsetY = 0;

      if (videoDrawHeight < combinedCanvas.height) 
      {
        videoDrawHeight = combinedCanvas.height;
        videoDrawWidth = combinedCanvas.height * videoAspect;
        videoOffsetX = (combinedCanvas.width - videoDrawWidth) / 2;
      } 
      else 
      {
        videoOffsetY = (combinedCanvas.height - videoDrawHeight) / 2;
      }

      ctx.drawImage(this.video, videoOffsetX, videoOffsetY, videoDrawWidth, videoDrawHeight);
      console.log('Video frame drawn with fit');

      const arAspect = this.arCanvas.width / this.arCanvas.height;
      let arDrawWidth = combinedCanvas.width;
      let arDrawHeight = combinedCanvas.width / arAspect;
      let arOffsetX = 0;
      let arOffsetY = 0;

      if (arDrawHeight < combinedCanvas.height) 
      {
        arDrawHeight = combinedCanvas.height;
        arDrawWidth = combinedCanvas.height * arAspect;
        arOffsetX = (combinedCanvas.width - arDrawWidth) / 2;
      } 
      else 
      {
        arOffsetY = (combinedCanvas.height - arDrawHeight) / 2;
      }

      ctx.drawImage(this.arCanvas, arOffsetX, arOffsetY, arDrawWidth, arDrawHeight);
      console.log('AR content drawn with fit');

      const dataURL = combinedCanvas.toDataURL('image/jpg');
      this.capturedPhoto.src = dataURL;
      console.log('Photo captured successfully');
      
      this.showPhotoModal();
    } 
    catch (error) 
    {
      console.error('Error capturing photo:', error);
      alert('Error capturing photo: ' + error.message);
    }
  }

  showPhotoModal() 
  {
    this.isModalOpen = true;
    this.photoModal.style.display = 'flex';
    this.photoBtn.style.display = 'none';
    if (this.scanOverlay) {
      this.scanOverlay.classList.add('hidden');
    }
  }

  savePhoto() {
    try 
    {
      if (!this.capturedPhoto.src) 
      {
        alert('No photo to save!');
        return;
      }

      const link = document.createElement('a');
      link.href = this.capturedPhoto.src;
      link.download = `ar-photo-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Photo saved');
    } 
    catch (error) 
    {
      console.error('Error saving photo:', error);
      alert('Error saving photo: ' + error.message);
    }
  }

  goBack() {
    this.photoModal.style.display = 'none';
    this.capturedPhoto.src = '';
    this.photoBtn.style.display = 'block';
    this.isModalOpen = false;
    if (this.scanOverlay && this.targetEntity) 
    {
      const isTargetFound = this.targetEntity.components['mindar-image-target'].isFound;
      if (!isTargetFound) 
      {
        this.scanOverlay.classList.remove('hidden');
      }
    }
    console.log('Returned to camera view');
  }

  goTicket() {
    const newWindow = window.open('', '_blank');
    if (newWindow) 
    {
      newWindow.location.href = 'https://afisha.yandex.ru/moscow/excursions/places/soiuzmultpark';
    } 
    else 
    {
      window.location.href = 'https://afisha.yandex.ru/moscow/excursions/places/soiuzmultpark';
      return;
    }
    this.goBack();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing ARPhotoCapture');
  window.photoCapture = new ARPhotoCapture();
});

window.addEventListener("DOMContentLoaded", () => {
  const hour = new Date().getHours();
  
  const isNight = (hour >= 18 || hour < 6);
  const targetFile = isNight ? "targets-night.mind" : "targets-day.mind";

  const scene = document.querySelector('a-scene');
  
  if (scene) {  
    scene.setAttribute(
      "mindar-image",
      `imageTargetSrc: ./${targetFile}; filterMinCF:0.0001; filterBeta:0.001; warmupTolerance:3; missTolerance:1; uiScanning:#custom-scanning-overlay; resolution: 1920; video: {width: {ideal: 4096, min: 1920}, height: {ideal: 2160, min: 1920}}`
    );
    console.log("Выбран файл:", targetFile);
  }
});