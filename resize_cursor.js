const { Jimp } = require('jimp');

async function resizeCursor() {
  try {
    const image = await Jimp.read('public/hand_transparent.png');
    // Resize to width 48px, maintaining aspect ratio
    image.resize({ w: 64 });
    await image.write('public/cursor.png');
    console.log('Cursor resized successfully.');
  } catch (err) {
    console.error('Error resizing cursor:', err);
  }
}

resizeCursor();
