document.addEventListener('DOMContentLoaded', () => {
  const tilesContainer = document.getElementById('tiles');
  if (!tilesContainer) {
    console.error('Tiles container not found!');
    return;
  }

  const tileSize = 100;
  const cols = Math.ceil(window.innerWidth / tileSize);
  const rows = Math.ceil(window.innerHeight / tileSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.left = `${x * tileSize}px`;
      tile.style.top = `${y * tileSize}px`;

      const variation = Math.random() * 20 - 10;
      const gray = 224 + variation;
      tile.style.background = `rgb(${Math.max(214, Math.min(234, gray))}, ${Math.max(214, Math.min(234, gray))}, ${Math.max(214, Math.min(234, gray))})`;

      const borderOpacity = Math.random() * 0.3 + 0.1;
      tile.style.borderColor = `rgba(160, 160, 160, ${borderOpacity})`;

      tilesContainer.appendChild(tile);
    }
  }

  const tiles = document.querySelectorAll('.tile');
  if (tiles.length === 0) {
    console.error('No tiles found!');
    return;
  }

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const tileCenterX = rect.left + rect.width / 2;
      const tileCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - tileCenterX, 2) + Math.pow(mouseY - tileCenterY, 2)
      );

      if (distance < 100) {
        tile.classList.add('hovered');
      } else {
        tile.classList.remove('hovered');
      }
    });
  });

  tiles.forEach((tile) => {
    tile.addEventListener('click', (e) => {
      const rect = tile.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      tiles.forEach((otherTile) => {
        const otherRect = otherTile.getBoundingClientRect();
        const otherCenterX = otherRect.left + otherRect.width / 2;
        const otherCenterY = otherRect.top + otherRect.height / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - otherCenterX, 2) + Math.pow(centerY - otherCenterY, 2)
        );

        const delay = distance * 0.5;
        setTimeout(() => {
          otherTile.classList.add('shake');
          setTimeout(() => {
            otherTile.classList.remove('shake');
          }, 300);
        }, delay);
      });
    });
  });
});