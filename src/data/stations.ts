export interface Station {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    genre: string; // Genre tag for filtering
}

export const stations: Station[] = [
    {
        id: 'rocker-radio-hindi-gold',
        name: 'Rocker Radio Gold',
        slug: 'fdgs82xkzhhvv',
        description: 'Bollywood superhits from the 70s, 80s, and 90s.',
        imageUrl: '/assets/rocker_radio.png',
        genre: 'Classic'
    },
    {
        id: 'radio-hindi-saudi',
        name: 'Radio Hindi',
        slug: 'iuktcl7nxuptv',
        description: 'Hindi General Radio (Saudi Arabia).',
        imageUrl: '/assets/radio_hindi.png',
        genre: 'News'
    },
    {
        id: 'radio-bolly-fm',
        name: 'Radio Bolly FM',
        slug: 'zu59ykebs2zuv',
        description: '24/7 Hindi and Bollywood hits.',
        imageUrl: '/assets/radio_bolly_fm.png',
        genre: 'Pop'
    },
    {
        id: 'hits-of-bollywood',
        name: 'Hits of Bollywood',
        slug: 'a2gyqzwpwfeuv',
        description: 'Trendiest Bollywood beats.',
        imageUrl: '/assets/hits_of_bollywood.png',
        genre: 'Pop'
    },
    {
        id: 'radio-bolly-90',
        name: 'Radio Bollywood 90',
        slug: 'rm4i9pdex3cuv',
        description: '90s Melodies and Memories.',
        imageUrl: '/assets/radio_bolly_90.png',
        genre: 'Classic'
    },
    {
        id: 'red-fm-93-5',
        name: 'Red FM 93.5',
        slug: '9phrkb1e3v8uv',
        description: 'Bajaate Raho! Superhits.',
        imageUrl: '/assets/red_fm_93_5.png',
        genre: 'Hip-Hop'
    },
    {
        id: 'radio-mirchi-98-3',
        name: 'Radio Mirchi 98.3',
        slug: 'f4ppurqe3v8uv',
        description: 'Radio Mirchi 98.3',
        imageUrl: '/assets/radio_mirchi_98_3.png',
        genre: 'Pop'
    },
    {
        id: 'bhakti-sangeet',
        name: 'Bhakti Sangeet',
        slug: 'r51n9k1vsa0uv',
        description: 'Bhakti Sangeet',
        imageUrl: '/assets/bhakti_sangeet.png',
        genre: 'Bhakti'
    },
    {
        id: 'bhakti-sagar',
        name: 'Bhakti Sagar',
        slug: 'syu0rdutvxhvv',
        description: 'Bhakti Sagar',
        imageUrl: '/assets/bhakti_sagar.png',
        genre: 'Bhakti'
    }
];
