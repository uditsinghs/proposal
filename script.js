let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  initialAngle = 0;
  lastRotation = 0;

  init(paper) {
    // Handle touch move
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (this.rotating) {
        const currentAngle = this.calculateAngle(e);
        this.rotation = this.lastRotation + (currentAngle - this.initialAngle);
      } else {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
      }

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    // Handle touch start
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      if (e.touches.length === 2) {
        this.rotating = true;
        this.initialAngle = this.calculateAngle(e);
      }
    });

    // Handle touch end
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
      this.lastRotation = this.rotation;
    });

    // Handle touch cancel (in case of interruptions like notifications)
    paper.addEventListener('touchcancel', () => {
      this.holdingPaper = false;
      this.rotating = false;
      this.lastRotation = this.rotation;
    });
  }

  calculateAngle(e) {
    const dx = e.touches[1].clientX - e.touches[0].clientX;
    const dy = e.touches[1].clientY - e.touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
