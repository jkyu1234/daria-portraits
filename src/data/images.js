// Placeholder images — replace with actual Daria images
// avatar.jpg: Daria's portrait (square, recommended 400x400)
// cover.jpg: Cover banner (recommended 800x200)
// gallery/: Screenshots or fan art from the show
// daria_expression/: Expression variants named {score}_{variant}.png

import avatarImg from '../assets/avatar.jpg'
import coverImg from '../assets/cover.jpg'
export const avatarImage = avatarImg
export const coverImage = coverImg

// Gallery images
const galleryModules = import.meta.glob('../assets/gallery/*.(jpg|jpeg|png|webp|avif)', {
  eager: true,
  as: 'url'
})

export const galleryImages = Object.entries(galleryModules).map(([path, url], index) => {
  const filename = path.split('/').pop()
  return {
    id: index + 1,
    url: url,
    title: filename.replace(/\.(jpg|jpeg|png|webp|avif)$/, ''),
  }
})
