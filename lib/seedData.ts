export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  status: 'published' | 'draft';
  is_breaking: number;
  featured_image: string;
  seo_title: string;
  meta_description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

export interface ArticleReaction {
  id: number;
  article_id: number;
  reaction_type: string;
  count: number;
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Virat Kohli Smashes Historic 51st ODI Century Against Australia in Bengaluru",
    slug: "virat-kohli-historic-51st-odi-century-bengaluru",
    content: `
      <p><strong>Bengaluru:</strong> In an extraordinary display of skill, focus, and longevity, Virat Kohli smashed his historic 51st One-Day International (ODI) century today at the M. Chinnaswamy Stadium against a formidable Australian attack.</p>
      <p>Kohli, who walked in after the early dismissal of the openers, paced his innings to perfection. He combined caution with aggression, reaching the three-figure mark in just 92 balls, hitting 11 boundaries and 2 colossal sixes along the way.</p>
      <h2>The Record-Breaking Knock</h2>
      <p>With this century, Kohli further solidifies his position as the undisputed king of run-chases in ODI cricket. The Chinnaswamy crowd erupted into loud cheers as Kohli took a quick double off Mitchell Starc to complete his milestone, raising his bat and thanking the heavens.</p>
      <blockquote>"This is one of the most special knocks of my career. The pitch was challenging early on, but staying positive was the key," Kohli said in the post-match presentation.</blockquote>
      <p>India posted a mammoth total of 348 runs in their 50 overs, leaving Australia with a steep mountain to climb. Experts worldwide are calling this one of Kohli's most organized and technical centuries in recent years.</p>
    `,
    category: "Cricket",
    author: "Milan Sen",
    published_at: "2026-08-30 13:33:53",
    status: "published",
    is_breaking: 1,
    featured_image: "/uploads/virat-kohli-century.jpg",
    seo_title: "Virat Kohli 51st ODI Century vs Australia: Chinnaswamy Masterclass",
    meta_description: "Virat Kohli hits his record-breaking 51st ODI century against Australia at Bengaluru. Read match summaries, statements, and expert reactions."
  },
  {
    id: 2,
    title: "India Secures Thrilling Last-Ball Victory Against Pakistan in Asia Cup Opener",
    slug: "india-vs-pakistan-thriller-asia-cup-opener",
    content: `
      <p><strong>Colombo:</strong> It doesn't get bigger than this. In a nail-biting encounter that kept fans on the edge of their seats till the very last delivery, India secured a famous 4-wicket victory over arch-rivals Pakistan in the Asia Cup opener.</p>
      <p>Chasing a challenging target of 268 runs set by Pakistan's strong batting line-up, India needed 12 runs off the final over bowled by Shaheen Afridi. The tension was palpable in the stadium.</p>
      <h2>Final Over Drama</h2>
      <p>With 2 runs required off the final delivery, a clean straight drive over mid-off sealed the victory, sending the Indian dugout and fans worldwide into joyous celebration.</p>
      <p>The win gives India crucial points in the tournament standings, while Pakistan will look to bounce back in their next fixture.</p>
    `,
    category: "India",
    author: "Sanjay Sharma",
    published_at: "2026-08-30 13:33:53",
    status: "published",
    is_breaking: 1,
    featured_image: "/uploads/india-vs-pakistan.jpg",
    seo_title: "India vs Pakistan Asia Cup Result: India Wins in Last-Ball Thriller",
    meta_description: "India defeats Pakistan in a dramatic last-ball finish in the Asia Cup opening match. Get full scorecards and match highlights here."
  },
  {
    id: 3,
    title: "The Rise of Indian Cricket: How Small-Town Talents Are Dominating Global Arenas",
    slug: "rise-of-indian-cricket-small-town-talent",
    content: `
      <p>A quiet revolution is taking place in Indian cricket. Gone are the days when the national team was dominated solely by players from metro cities like Mumbai, Delhi, or Bengaluru.</p>
      <p>Today, the backbone of the Indian squad consists of youngsters coming from small towns, villages, and humble backgrounds. Players from states like Uttar Pradesh, Bihar, Jammu & Kashmir, and rural Punjab are making their mark on the international stage.</p>
      <h2>Breaking Barriers</h2>
      <p>This shift is largely credited to the deep penetration of local academies, state-level tournaments, and the platform provided by domestic cricket and franchise leagues. These setups scout talent from previously untouched regions, giving them world-class facilities and exposure.</p>
      <p>As these players dominate global cricket with their raw hunger and resilience, they inspire millions of children across India's heartlands to dream big.</p>
    `,
    category: "Stories",
    author: "Editor CricMilan",
    published_at: "2026-08-30 13:33:53",
    status: "published",
    is_breaking: 0,
    featured_image: "/uploads/rise-small-town-cricket.jpg",
    seo_title: "How Small-Town Talents are Dominating Indian Cricket",
    meta_description: "An in-depth look into the rise of small-town cricketers in India and their journey to the top of international cricket arenas."
  },
  {
    id: 4,
    title: "Global Cricket Expansion: USA and West Indies Set to Host Next Big ICC Event",
    slug: "global-cricket-expansion-usa-west-indies-host",
    content: `
      <p><strong>New York:</strong> Cricket is officially breaking into new frontiers. The International Cricket Council (ICC) has finalized plans for the co-hosting of the upcoming world tournament in the United States and the Caribbean.</p>
      <p>This historic move aims to popularize the sport in North America, tapping into a massive sports market and a passionate expatriate community.</p>
      <h2>New Stadiums and Infrastructure</h2>
      <p>Temporary and permanent state-of-the-art facilities are being built across Florida, Texas, and New York to host high-octane matches, including the highly anticipated clash between India and Pakistan.</p>
      <p>Local cricket authorities in the USA are optimistic that this tournament will serve as a catalyst for professionalizing cricket in the country and introducing it to local schools.</p>
    `,
    category: "World",
    author: "David Vance",
    published_at: "2026-08-30 13:33:53",
    status: "published",
    is_breaking: 0,
    featured_image: "/uploads/usa-west-indies-cricket.jpg",
    seo_title: "USA and West Indies Co-Hosting ICC World Event: Key Details",
    meta_description: "ICC announces USA and West Indies as hosts for the next cricket world tournament. Check tournament details, venues, and match dates."
  },
  {
    id: 5,
    title: "IPL Auction Breakout Stars: The Players Who Stunned Everyone with Massive Bids",
    slug: "ipl-auction-breakout-stars-record-bids",
    content: `
      <p>The annual player auction once again proved to be a life-changing event for cricketers around the globe, with records shattered and several unheralded stars earning multi-million rupee contracts.</p>
      <p>While established international names secured major paydays, it was the breakout performances of young domestic talent that sparked intense bidding wars among team owners.</p>
      <h2>Surprise Packages of the Year</h2>
      <p>An uncapped all-rounder from Madhya Pradesh was sold for a jaw-dropping 8 Crores, while a fast bowler from Vidarbha saw his base price multiply tenfold. These auction dynamics highlight the growing value of local talent in high-pressure leagues.</p>
    `,
    category: "Trending",
    author: "Milan Sen",
    published_at: "2026-08-30 13:33:53",
    status: "published",
    is_breaking: 0,
    featured_image: "/uploads/ipl-auction.jpg",
    seo_title: "IPL Player Auction Records: Surprise Big Bids and Stars",
    meta_description: "Discover the surprise big earners and record breakout stars from the latest player auctions. Check bids, teams, and stats."
  },
  {
    id: 6,
    title: "Indian Cricket Team Reaches Top Rank in All Formats",
    slug: "indian-cricket-team-reaches-top-rank-in-all-formats",
    content: "<p>In a historic achievement, the Indian Cricket Team has reached the top spot in all three formats of the game - Tests, ODIs, and T20Is. This rare milestone reflects the team's exceptional consistency and dominant performances across different conditions worldwide.</p>",
    category: "Cricket",
    author: "Staff Reporter",
    published_at: "2026-08-30T13:35:00.000Z",
    status: "published",
    is_breaking: 1,
    featured_image: "/uploads/india-top-rank.jpg",
    seo_title: "Indian Cricket Team Reaches Top Rank in All Formats",
    meta_description: "Indian Cricket Team Reaches Top Rank in All Formats"
  },
  {
    id: 7,
    title: "India Has 95% Chance of Reaching Champions Trophy Final",
    slug: "india-95-percent-champions-trophy-probability",
    content: "<p>Statistical analysis shows India has a 95% probability of advancing. Win rate is at 100% in home ODIs.</p>",
    category: "Cricket",
    author: "Chief Analyst",
    published_at: "2026-09-16T10:51:42.804Z",
    status: "published",
    is_breaking: 1,
    featured_image: "/uploads/cricket-stadium-lights.jpg",
    seo_title: "India Has 95% Chance of Reaching Champions Trophy Final",
    meta_description: "India Has 95% Chance of Reaching Champions Trophy Final"
  }
];

export const INITIAL_ADMINS: Admin[] = [
  {
    id: 1,
    username: "admin",
    // bcrypt hash of "cricmilanadmin"
    password_hash: "$2a$10$hE.17pSyHIj/RI7KAwhzTuEC9t29eEDM/Uou9t.kn7.Bla40d0Vci"
  }
];
