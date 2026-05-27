// One-off seed: writes the Featured Appearances collection from the live WP
// /featured-in/ inventory. Run: node scripts/seed-featured-appearances.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/content/featured-appearances');
mkdirSync(outDir, { recursive: true });

const LOGO = '/images/featured-in/logos/';

// source, title, type, url, opts
const items = [
  ['Read Write Web', 'Named a 2020 top virtual speaker', 'Award', '', { desc: 'Recognized as a 2020 top virtual speaker alongside WSJ best-selling author Nir Eyal.', featured: true, review: true, date: '2020' }],
  ['AARP', 'Should You Pay for Help With Your Job Search?', 'Article', 'https://www.aarp.org/work/job-search/paid-job-search-help.html', {}],
  ['CNBC Make It', "Highly likable people do these 4 things when talking to others, say communication experts", 'Article', 'https://www.cnbc.com/2025/11/21/likable-people-do-these-things-when-talking-to-others-communication-experts.html', { logo: 'cnbc.png', featured: true, date: 'November 2025' }],
  ['PR Daily', "Top takeaways from Ragan's Future of Communications Conference 2025", 'Article', 'https://www.prdaily.com/top-takeaways-from-ragans-future-of-communications-conference-2025/', {}],
  ['Upworthy', 'The most likable people share a trait that is nearly impossible to fake', 'Article', 'https://www.upworthy.com/the-most-likable-people-share-a-trait-that-is-nearly-impossible-to-fake', {}],
  ['Forbes', 'Want To Get Ahead? How To Share Your Achievements Without Bragging', 'Article', 'https://www.forbes.com/sites/markmurphy/2025/09/09/want-to-get-ahead-how-to-share-your-achievements-without-bragging/', { logo: 'forbes.png', desc: 'Quoted alongside personal branding expert Dorie Clark.' }],
  ['PR Daily', 'Growing a personal brand through the EPIC framework', 'Article', 'https://www.prdaily.com/growing-a-personal-brand-through-the-epic-framework/', {}],
  ['Inc.', 'Do 1 Small Thing in Every Conversation to Be Instantly Likable, Says Communications Expert', 'Article', 'https://www.inc.com/minda-zetlin/do-1-small-thing-in-every-conversation-to-be-instantly-likable-says-communications-expert/91248826', { logo: 'inc.svg' }],
  ['Indeed', '"Dream Job" Redefined: How to Build a Career That Shifts With You', 'Article', 'https://www.indeed.com/career-advice/news/dream-job-flexible-strategy', {}],
  ['Forbes', "How 'Presence' Is Changing In The Digital Era", 'Article', 'https://www.forbes.com/sites/kevinkruse/2025/09/29/how-presence-is-changing-in-the-digital-era/', { logo: 'forbes.png' }],
  ['HubSpot', 'The Presentation Attention Toolbox: 7 Tips to Build Captivating and Persuasive Presentations', 'Resource', 'https://offers.hubspot.com/presentation-attention-toolbox', {}],
  ['CNBC Make It', 'Highly likable people follow one simple rule, says communication expert', 'Article', 'https://www.cnbc.com/2025/09/08/the-most-likable-people-follow-simple-rule-its-not-about-being-fake-nice.html', { logo: 'cnbc.png' }],
  ['Forbes', 'Why Your Online Presence Matters More Than Your Resume', 'Article', 'https://www.forbes.com/sites/niritcohen/2025/08/03/why-your-online-presence-matters-more-than-your-resume/', { logo: 'forbes.png' }],
  ['NBC Los Angeles', 'Want to sound more assertive? Ditch this 2-word phrase, says communication expert', 'Article', 'https://www.nbclosangeles.com/news/business/money-report/want-to-sound-more-assertive-ditch-this-2-word-phrase-says-trial-lawyer-and-communication-expert/3752366/', { logo: 'nbc4.svg' }],
  ['Inc.', '5 Phrases That Make You Look Weak, and What to Say Instead', 'Article', 'https://www.inc.com/minda-zetlin/5-phrases-that-make-you-look-weak-and-what-to-say-instead/91226797', { logo: 'inc.svg' }],
  ['Inc.', 'Why You Should Drop This 1 Phrase From Your Business Emails', 'Article', 'https://www.inc.com/minda-zetlin/why-you-should-drop-this-1-phrase-from-your-business-emails/91206893', { logo: 'inc.svg' }],
  ['Forbes Australia', 'How to become the CEO of your own career', 'Article', 'https://www.forbes.com.au/news/leadership/how-to-become-the-ceo-of-your-own-career/', { logo: 'forbes.png' }],
  ['Forbes', 'Unforgettable: How To Create An EPIC Career Brand', 'Article', 'https://www.forbes.com/sites/robertamatuson/2025/04/09/how-to-create-epic-career-brand/', { logo: 'forbes.png' }],
  ['GoBankingRates', '5 Ways To Avoid Burnout as You Climb the Career Ladder', 'Article', 'https://www.gobankingrates.com/money/making-money/ways-avoid-burnout-as-you-climb-career-ladder/', {}],
  ['AARP', 'How to find freelance work between jobs', 'Article', 'https://www.aarp.org/work/careers/find-freelance-work-between-jobs/', {}],
  ['SUCCESS Magazine', 'Steps to take after a job loss', 'Article', 'https://www.success.com/steps-to-take-after-job-loss/', { desc: 'On branding yourself on LinkedIn after a job loss.' }],
  ['CAKE.com', 'What causes remote speaking anxiety?', 'Article', 'https://www.cake.com/empowered-team/overcoming-fear-public-speaking-remote-work/', {}],
  ['ASBN', 'Lorraine Lee Shares Career Acceleration Strategies from Her New Book, Unforgettable Presence', 'Interview', 'https://www.asbn.com/small-business-shows/atlanta-small-business-show/lorraine-lee-shares-career-acceleration-strategies-from-her-new-book-unforgettable-presence/', { desc: "Featured guest on America's Small Business Network." }],
  ['Inc.', 'Stop Saying These 2 Words to Sound More Confident and Accelerate Your Success', 'Article', 'https://www.inc.com/minda-zetlin/stop-saying-these-2-words-to-sound-more-confident-and-accelerate-your-success-according-to-a-stanford-expert/91163351', { logo: 'inc.svg' }],
  ['Forbes', 'How To Become The CEO Of Your Own Career', 'Article', 'https://www.forbes.com/sites/juliakorn/2025/06/17/how-to-become-the-ceo-of-your-own-career/', { logo: 'forbes.png' }],
  ['Bloomberg', 'Why Cringe-Worthy LinkedIn Posts Are on the Rise', 'Article', 'https://www.bloomberg.com/news/articles/2024-10-18/why-cringe-worthy-linkedin-posts-are-on-the-rise', { logo: 'bloomberg.svg', featured: true, desc: 'Quoted on the rise of personal content posting on LinkedIn.' }],
  ['The Muse', 'Why you might receive a LinkedIn message from a recruiter', 'Article', 'https://www.themuse.com/advice/how-to-respond-to-a-recruiter-on-linkedin', {}],
  ['Forbes', 'Asian Creators Redefine Success In The Creator Economy', 'Award', 'https://www.forbes.com/sites/cherieluo/2024/09/19/asian-creators-redefine-success-in-the-creator-economy/', { logo: 'forbes.png', featured: true, desc: 'Won the inaugural Best Business Creator Award at the Asian Creator Awards presented by Kajabi, sponsored by Adobe Express.' }],
  ['ASBN', '3 Work Models Entrepreneurs Can Use to Foster Successful Virtual Communities', 'Interview', 'https://www.asbn.com/small-business-shows/atlanta-small-business-show/3-work-models-entrepreneurs-can-use-to-foster-successful-virtual-communities-lorraine-k-lee/', { desc: "Featured guest on America's Small Business Network, streaming on Roku, Apple TV, and Fire TV." }],
  ['Doers and Dreamers', 'Featured in the Doers and Dreamers book', 'Book', 'https://doers23.com/', { desc: 'Insights from 150 leading entrepreneurs and marketers, including Matt Mullenweg, Brian Chesky, and Seth Godin.' }],
  ['The Latino Leadership Playbook', 'How to Become A Strong Communicator', 'Book', '', { desc: 'Selected expert contributor on becoming a strong communicator.', review: true, date: 'October 2023' }],
  ['Clockwise', 'Daily Checklists Brought To You By Best-In-Class Experts', 'Resource', 'https://www.getclockwise.com/calendar-cleanup-week#choose-your-own-cleanup-adventure', {}],
  ['Buffer', 'Empowering Employees to Build Their Personal Brands on LinkedIn', 'Article', 'https://buffer.com/resources/employee-personal-brand/', {}],
  ['ECCLPs', 'Featured video series', 'Video', '', { desc: 'Advancing PK-12 climate and environmental literacy through the UC-CSU partnership at UC Irvine.', review: true }],
  ['LinkedIn Get Hired', 'How to Build a Professional Presence', 'Podcast', 'https://www.linkedin.com/pulse/how-build-professional-presence-get-hired-by-linkedin-news/', { desc: 'Guest on the Get Hired podcast with Andrew Seaman.' }],
  ['Remote-First Institute', 'Top 40+ Remote-First Trends for 2023 (and beyond)', 'Article', 'https://remote-first.institute/blog/top-remote-first-trends-and-predictions-for-2023', {}],
  ['Elpha', 'Office Hours AMA', 'Interview', 'https://elpha.com/posts/nk869ku/office-hours-i-am-the-editorial-director-at-prezi-i-m-lorraine-lee-ama', { desc: 'Featured guest on Office Hours; past guests include Ellevest CEO Sallie Krawcheck.' }],
  ['Atlassian Team ’22', 'The importance of team trust', 'Video', 'https://community.atlassian.com/t5/Official-Atlassian-Events/Team-22-Countdown-Lorraine-Lee-Head-of-Editorial-at-Prezi-shares/ba-p/1985614', { featured: true, desc: "Lorraine's session was the #2 most-viewed pre-recorded session at Team '22." }],
  ['Prezi', 'Prezi Meeting Guidebook', 'Resource', 'https://20307117.fs1.hubspotusercontent-na1.net/hubfs/20307117/Resources/Meetings%20guidebook%202022/prezi-meeting-guidebook.pdf', { desc: 'Authored guidebook used as an internal and public-facing resource.' }],
  ['LinkedIn', '10 of the Best LinkedIn Learning Courses to Advance Your Career', 'Newsletter', 'https://www.linkedin.com/pulse/10-best-linkedin-learning-courses-advance-your-career-john-hall/', { desc: "Lorraine's course was listed first; newsletter has 300,000+ subscribers." }],
  ['GitLab', 'Communication Handbook: Video and presentation tips', 'Resource', 'https://about.gitlab.com/handbook/communication/#video-and-presentation-tips-with-lorraine-lee', {}],
  ['PR Daily', '2 simple tools for more efficient meetings', 'Article', 'https://www.prdaily.com/2-simple-tools-for-more-efficient-meetings/', {}],
  ['Ceridian', 'From the Trenches: Hearing from middle managers', 'Article', 'https://www.ceridian.com/blog/hearing-from-middle-managers', {}],
  ['LinkedIn News', 'Lessons from a first-time manager', 'Article', 'https://www.linkedin.com/news/story/lessons-from-a-first-time-manager-6080322/', { desc: "Lorraine's post anchored this LinkedIn News storyline." }],
  ['LinkedIn News', 'Coping with a remote micromanager', 'Article', 'https://www.linkedin.com/news/story/coping-with-a-remote-micromanager-4112457/', { desc: "Lorraine's article anchored this LinkedIn News storyline." }],
  ['Content Marketing Institute', 'Do LinkedIn Newsletters Actually Get Results for Brands?', 'Article', 'https://contentmarketinginstitute.com/articles/linkedin-newsletters-results-brands', {}],
  ['Coffee With Kim', 'Virtual Presentations 101 with Lorraine Lee', 'Podcast', 'https://coffee-with-kim.simplecast.com/episodes/virtual-presentations-101-with-lorraine-lee', {}],
  ['Entrepreneur', 'Welcome to the hybrid work era', 'Article', 'https://www.entrepreneur.com/article/385597', { logo: 'entrepreneur.png' }],
  ['WomenTech Network', 'Women in Tech Global Conference Voices 2022 Speaker', 'Event', 'https://www.womentech.net/blog/women-in-tech-global-conference-voices-2022-speaker-lorraine-lee', {}],
  ['Prezi', 'Reinventing meetings for hybrid work', 'Resource', 'https://prez.is/hybridebook', { desc: 'E-book alongside thought leaders at Slack and Zapier.' }],
  ['Shine Bootcamp', 'Setting up your presentation space (without any fancy equipment)', 'Video', 'https://www.instagram.com/p/CRUSDZuMxQG/', { desc: 'Collaboration with the women speaker accelerator.' }],
  ['Managing Editor', "Why It's Worth Rethinking Your LinkedIn Strategy", 'Article', 'https://managingeditor.com/why-its-worth-rethinking-your-linkedin-strategy/', {}],
  ['Remote-How', 'How to evaluate communication in your hybrid and remote company', 'Resource', 'https://remote-how.com/wp-content/uploads/How-to-evaluate-communication-in-your-hybrid-and-remote-company.pdf', {}],
  ['Managing Editor', 'How to Stand Out on Video and Boost LinkedIn Presence', 'Article', 'https://managingeditor.com/how-to-stand-out-on-video-and-boost-linkedin-presence/', {}],
  ['Personal Brand Brief', 'Find Your Voice: Masterful Storyteller Lorraine Lee', 'Newsletter', 'https://www.linkedin.com/pulse/find-your-voice-masterful-storyteller-lorraine-lee-joel-hansen/', { desc: 'Newsletter with 15,000+ subscribers.' }],
  ['Innovation Women', 'Featured speaker', 'Event', '', { desc: 'Selected as a featured speaker out of 2,000 members.', review: true }],
  ['RepCap', 'LinkedIn for Thought Leadership', 'Article', 'https://www.repcap.com/linkedin-for-thought-leadership/', {}],
  ['DailyRemote', 'How I Work Remotely: Lorraine K. Lee', 'Interview', 'https://dailyremote.com/remote-work-blog/how-i-work-remotely-lorraine-k-lee/', {}],
  ['Remote-How', 'The Remote Managers 2020 Report', 'Report', 'https://remote-how.com/special/remote-managers-report-2020/', { desc: 'Quoted on page 32 of the first global report focused on managers leading remote change.' }],
  ['Inc.', 'LinkedIn Is Subtly Experimenting With a New Feature That Could Impact What We Read', 'Article', 'https://www.inc.com/tom-popomaronis/linkedin-is-subtly-experimenting-with-a-new-feature-and-it-could-drastically-impact-what-we-read.html', { logo: 'inc.svg' }],
  ['Remote-How', '10 Mistakes to Avoid When Managing a Virtual Team', 'Article', 'https://remote-how.com/blog/10-mistakes-to-avoid-when-managing-a-virtual-team', {}],
  ['Balance the Grind', 'Lorraine Lee, Editorial Director at Prezi', 'Interview', 'https://balancethegrind.co/interviews/lorraine-lee-editorial-director-at-prezi/', {}],
  ['HRCap, Inc.', 'An influential speaker who inspires growth', 'Event', '', { desc: 'Highlighted as an influential speaker who inspires others to pursue personal and professional growth.', review: true }],
];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[‘’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

const esc = (s) => {
  if (s === '') return '""';
  // Quote and escape any string with characters that trip up plain YAML.
  return JSON.stringify(s);
};

const seen = new Set();
items.forEach((row, i) => {
  const [source, title, type, url, opts = {}] = row;
  let slug = slugify(`${source} ${title}`);
  while (seen.has(slug)) slug = `${slug}-2`;
  seen.add(slug);

  const lines = [
    `title: ${esc(title)}`,
    `source_name: ${esc(source)}`,
    `appearance_type: ${type}`,
    `date: ${esc(opts.date ?? '')}`,
    `description: ${esc(opts.desc ?? '')}`,
    `url: ${esc(url)}`,
    `logo: ${opts.logo ? esc(LOGO + opts.logo) : 'null'}`,
    `image: null`,
    `cta_label: ""`,
    `priority: ${(i + 1) * 10}`,
    `featured: ${opts.featured ? 'true' : 'false'}`,
    `needs_review: ${opts.review ? 'true' : 'false'}`,
  ];
  writeFileSync(join(outDir, `${slug}.yaml`), lines.join('\n') + '\n');
});

console.log(`Wrote ${items.length} appearance files to ${outDir}`);
