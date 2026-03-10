export const playSound = (type: 'trade' | 'win' | 'loss' | 'click') => {
  const sounds = {
    trade: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    loss: 'https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Reusing trade sound for click for now
  };

  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
