/** @format */

const getDino = () => {
  const regularDino =
    'https://cloud-ppapjvtsa-hack-club-bot.vercel.app/0club_dinosaur.png';
  const specialDinos = [
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/0nervous_dino.gif',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/1dinosaur_holding_rubber_duck.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/2dino_in_a_box_v2.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/3confused_dinosaur.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/4dino_winning.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/5party_orpheus.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/6cake_dino.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/7dino_smirk.png',
    'https://cloud-d8b6vbwjs-hack-club-bot.vercel.app/8club_dinosaur.png',
  ];

  if (Math.random() > 0.05) {
    return regularDino;
  } else {
    return specialDinos[Math.floor(Math.random() * specialDinos.length)];
  }
};
const NotFound = () => (
  <>
    <h1>404, club not found</h1>
    <img src={getDino()} />
  </>
);

export default NotFound;
