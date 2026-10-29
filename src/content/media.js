// Видео и публикации Instagram (раньше были объявлены прямо в Video.vue).
// Чтобы добавить материал — допишите запись; заголовки видео — ключи переводов.

export const videos = [
  {
    id: 1,
    src: "/video/video-page/1.mp4",
    poster: "/video/video-page/thumbs/1.jpg",
    date: "2024-04-20",
    titleKey: "Another satisfied customer of “Ko'kcha eshiklari”",
  },
  {
    id: 2,
    src: "/video/video-page/2.mp4",
    poster: "/video/video-page/thumbs/2.jpg",
    date: "2023-08-26",
    titleKey: "Our doors at the Al Anvar hotel",
  },
  {
    id: 3,
    src: "/video/video-page/3.mp4",
    poster: "/video/video-page/thumbs/3.jpg",
    date: "2025-08-29",
    titleKey:
      "For us, every door is more than just wood — it's the beginning of a new story. We recently installed doors for the popular Novias Plaza bridal salon.",
  },
  {
    id: 4,
    src: "/video/video-page/4.mp4",
    poster: "/video/video-page/thumbs/4.jpg",
    date: "2024-09-03",
    titleKey: "The word “delay” is not in our vocabulary",
  },
  {
    id: 5,
    src: "/video/video-page/5.mp4",
    poster: "/video/video-page/thumbs/5.jpg",
    date: "2024-04-24",
    titleKey: "We are always working for your comfort",
  },
];

export const sortedVideos = [...videos].sort((a, b) => new Date(b.date) - new Date(a.date));

// Встраивание Instagram блокируется X-Frame-Options, поэтому показываем статичные карточки со ссылками.
export const instagramPosts = [
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/reel/DYFOx82oLYa/", type: "reel", image: "/instagram/1.jpg" },
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/reel/C_cZbaWKMpt/", type: "reel", image: "/instagram/2.jpg" },
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/reel/DYBqRPSopCu/", type: "reel", image: "/instagram/3.jpg" },
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/reel/DX6hVg4Ig9f/", type: "reel", image: "/instagram/4.jpg" },
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/p/DXmgByWCH5C/", type: "post", image: "/instagram/5.jpg" },
  { url: "https://www.instagram.com/kokcha.eshiklari.uz/reel/DXhKWSZCFT9/", type: "reel", image: "/instagram/6.jpg" },
];
