import avatarImg from '../assets/avatar.jpg'
import coverImg from '../assets/cover.jpg'

export const dariaProfile = {
  name: 'Daria Morgendorffer',
  handle: '@daria',
  avatar: avatarImg,
  cover: coverImg,
  joined: 'Since 1997',
  following: '42',
  followers: '1.2M',
  bio: 'I don\'t have low self-esteem. I have low esteem for everyone else.',
  posts: '1,024 notes',
  followedBy: 'Followed by Jane Lane, Trent Lane, and 42 others',
}

export const initialNotes = [
  {
    id: 1,
    text: 'Note to self: people will believe anything if you put it in a pie chart. I should test this theory at the next Lawndale High assembly.',
    likes: 1200,
    liked: false,
    time: '2h',
    category: 'Notes',
    tags: ['society', 'school'],
  },
  {
    id: 2,
    text: 'Today I learned that enthusiasm is inversely proportional to intelligence. The evidence continues to mount. Exhibit A: the pep rally.',
    likes: 860,
    liked: false,
    time: '4h',
    category: 'Notes',
    tags: ['observations'],
  },
  {
    id: 3,
    text: 'Quinn asked me for homework help today. She actually said "please." I checked outside for flying pigs. None spotted, but I\'ll remain vigilant.',
    likes: 2300,
    liked: false,
    time: '1d',
    category: 'Notes',
    tags: ['family', 'quinn'],
  },
  {
    id: 4,
    text: 'Jane and I watched Sick, Sad World last night. A man married his pet iguana. For once, the iguana seemed like the more reasonable party in the relationship.',
    likes: 1800,
    liked: false,
    time: '2d',
    category: 'Notes',
    tags: ['jane', 'tv'],
  },
  {
    id: 5,
    text: 'The Lawndale High cafeteria is serving something they call "pizza." I use quotation marks because I refuse to acknowledge it as actual food. It\'s more of a science experiment with cheese.',
    likes: 950,
    liked: false,
    time: '3d',
    category: 'Notes',
    tags: ['school', 'food'],
  },
]

export const AFFECTION_LEVELS = [
  { min: 0,  max: 20,  level: 1, name: 'Stranger',       label: '陌生人',      description: "Daria doesn't know who you are yet. Give her time—or a clever opinion." },
  { min: 21, max: 40,  level: 2, name: 'Barely Tolerable', label: '勉强可以忍受', description: "Daria can barely stand your presence. This is progress, believe it or not." },
  { min: 41, max: 60,  level: 3, name: 'Moderately Interesting', label: '还算有趣', description: "Daria is starting to find you 'moderately interesting.' This is a bigger compliment than it sounds." },
  { min: 61, max: 80,  level: 4, name: 'Worth Talking To', label: '值得聊聊', description: "Daria will actually talk to you. She doesn't do that with most people." },
  { min: 81, max: 100, level: 5, name: 'Second Only to Jane', label: '仅次于 Jane', description: "Daria almost considers you a friend. Second only to Jane. Seriously, this is the highest honor." },
]

export function getAffectionLevel(score) {
  return AFFECTION_LEVELS.find(l => score >= l.min && score <= l.max) || AFFECTION_LEVELS[0]
}

export const mediaImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1518895949257-7621c3fb1bf3?q=80&w=400&auto=format&fit=crop', type: 'image' },
  { id: 2, url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop', type: 'image' },
  { id: 3, url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=400&auto=format&fit=crop', type: 'image' },
  { id: 4, url: 'https://images.unsplash.com/photo-1571265639345-5b23f7c14c3a?q=80&w=400&auto=format&fit=crop', type: 'image' },
  { id: 5, url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop', type: 'image' },
  { id: 6, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop', type: 'image' },
]
