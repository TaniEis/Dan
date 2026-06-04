const { Jimp } = require('jimp');

async function removeBackground() {
  try {
    const image = await Jimp.read('public/hand.png');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very dark (close to black), make it transparent
      if (red < 35 && green < 35 && blue < 35) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });
    
    await image.write('public/hand_transparent.png');
    console.log('Background removed successfully.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

removeBackground();
