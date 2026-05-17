// =====================================================================
// AboutApp, Template C: Profile / Press page
// =====================================================================

const ABOUT_TWEAKS = /*EDITMODE-BEGIN*/{
  "designVariant": "Editorial",
  "headlineVariant": "20 years of presence"
}/*EDITMODE-END*/;

const ABOUT_HEADLINES = {
  "Hi, I'm Lorraine":        "Hi, I'm <em>Lorraine.</em>",
  "Helping leaders be seen": 'I help leaders <em>get seen.</em>',
  "20 years of presence":    'Two decades helping <em>quiet experts</em> get loud.',
};

const CAREER_LOGOS = [
  { t: "Zoom",          logo: "assets/company-logos/zoom.svg",     mark: "zoom" },
  { t: "Google",        logo: "assets/company-logos/google.svg",   mark: "google" },
  { t: "Cisco",         logo: "assets/company-logos/cisco.svg",    mark: "cisco" },
  { t: "McKinsey & Co", cls: "caps" },
  { t: "LinkedIn",      logo: "assets/company-logos/linkedin.svg", mark: "linkedin" },
  { t: "Prezi",         cls: "bold" },
  { t: "JLL",           cls: "caps" },
];
const ENDORSEMENTS = [
  { quote: "One of the most generous teachers I've encountered in 20 years of corporate L&D.", name: "Priya Anand", role: "Head of L&D, Salesforce", initials: "PA" },
  { quote: "She earned a Wall Street Journal bestseller because the work is real. The frameworks are doing the heavy lifting.", name: "Daniel Pink", role: "#1 NYT bestselling author", initials: "DP", featured: true },
  { quote: "Lorraine took our managers from cautious to confident in a single afternoon. Six months later they're still using her language.", name: "Anita Chen", role: "VP People, Affirm", initials: "AC" },
];

function AboutApp() {
  const [tweaks, setTweak] = useTweaks(ABOUT_TWEAKS);
  const headlineHtml = ABOUT_HEADLINES[tweaks.headlineVariant] || ABOUT_HEADLINES["Hi, I'm Lorraine"];

  return (
    <PageShell activeId="about">
      <div data-screen-label="00 About page">
        {/* HERO */}
        <section className="page-hero" data-screen-label="03 Hero">
          <div className="grid12 page-hero-grid">
            <div className="page-hero-copy fade-up">
              <div className="page-hero-eyebrow">
                <span className="dot" />
                <span className="eyebrow" style={{color:'var(--ink-500)'}}>About · Bio · Headshot</span>
              </div>
              <h1 dangerouslySetInnerHTML={{__html: headlineHtml}} />
              <p className="lead-large">
                I'm the Wall Street Journal bestselling author of <em>Unforgettable Presence®</em>, a corporate keynote speaker, LinkedIn Learning instructor, and Stanford Continuing Studies instructor, helping leaders become impossible to overlook.
              </p>
              <div className="hero-cta-row">
                <a className="btn primary large" href="Contact.html">Work with me <span aria-hidden="true">→</span></a>
                <a className="btn outline" href="Book.html">Read the book</a>
              </div>
            </div>
            <div className="page-hero-aside fade-up" style={{animationDelay:'120ms'}}>
              <div className="about-hero-photo">
                <div className="photo-mask">
                  <img src="assets/lorraine-headshot.png" alt="Lorraine K. Lee portrait" />
                </div>
                <div className="floating-card">
                  <div className="num">250k+</div>
                  <div className="lbl">students taught on LinkedIn Learning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="section section--cream" data-screen-label="04 Story">
          <div className="grid12">
            <div className="section-head section-head--center" style={{marginBottom: 48}}>
              <span className="eyebrow">The story</span>
              <h2>The long version, <em>in my words.</em></h2>
            </div>
            <div className="bio-body">
              <p>I spent the first decade of my career watching brilliant people get passed over. Not because they weren't good at the work, they were extraordinary at the work. They just hadn't figured out how to be <em>seen</em> doing it.</p>
              <p>I was one of them. I joined LinkedIn as one of its first hundred editorial hires and built audiences for some of the most senior leaders in tech. Then I went to Prezi as a Founding Editor, where I had to learn, quickly, and on stage, how to translate substance into influence.</p>
              <p>The frameworks I developed there became the spine of my keynotes, my LinkedIn Learning courses (now 15+, with 250,000+ students enrolled), my Stanford Continuing Studies seminars, and ultimately the book, <em>Unforgettable Presence®</em>, which became a Wall Street Journal bestseller and a #1 Amazon New Release.</p>
              <p>Today I work with leadership teams at Zoom, Google, Cisco, McKinsey, LinkedIn, and dozens more, helping their managers and high-potentials build the executive presence the next role requires. I live in the Bay Area. I write in cafes. I'm an introvert.</p>
            </div>
            <div className="bio-aside">
              <div className="aside-item">
                <div className="aside-k">Born</div>
                <div className="aside-v">San Jose, CA</div>
              </div>
              <div className="aside-item">
                <div className="aside-k">Based</div>
                <div className="aside-v">San Francisco</div>
              </div>
              <div className="aside-item">
                <div className="aside-k">Education</div>
                <div className="aside-v">Northwestern University (Medill)</div>
              </div>
              <div className="aside-item">
                <div className="aside-k">Teaches at</div>
                <div className="aside-v">Stanford Continuing Studies</div>
              </div>
              <div className="aside-item">
                <div className="aside-k">Pronouns</div>
                <div className="aside-v">she / her</div>
              </div>
            </div>
          </div>
        </section>

        {/* CAREER LOGOS */}
        <section className="section section--tight" data-screen-label="05 Career highlights">
          <div className="grid12">
            <div className="section-head section-head--center" style={{marginBottom: 32}}>
              <span className="eyebrow">Career highlights</span>
              <h2>Companies I've <em>built inside of.</em></h2>
            </div>
            <div className="logo-grid">
              {CAREER_LOGOS.map((l,i)=>(
                <div key={i} className="logo-cell">
                  {l.logo
                    ? <img className={'logo-img logo-img--'+l.mark} src={l.logo} alt={l.t} loading="lazy" decoding="async"/>
                    : <span className={'logo-word '+l.cls}>{l.t}</span>}
                </div>
              ))}
              <div className="logo-cell"><span className="logo-word serif italic" style={{color:'var(--ink-500)'}}>& earlier</span></div>
            </div>
          </div>
        </section>

        {/* AS SEEN IN */}
        <TrustStrip animated={true}/>

        {/* NOW WORKING ON */}
        <section className="section" data-screen-label="07 Now">
          <div className="grid12">
            <div className="now-working">
              <div>
                <span className="eyebrow">/ now</span>
                <h2>What I'm <em>working on now.</em></h2>
                <p style={{marginTop: 20, fontFamily:'var(--font-serif)', fontSize: 19, lineHeight: 1.55, color:'rgba(251,248,242,0.78)'}}>
                  Updated quarterly. Borrowed from Derek Sivers, a /now page is the most honest version of an About page.
                </p>
              </div>
              <div>
                <ul>
                  <li><span className="lk">01</span><span className="lv"><strong>Second book.</strong> Working title: <em>The Hybrid Manager</em>. Drafting through Q3.</span></li>
                  <li><span className="lk">02</span><span className="lv"><strong>Speaking 2026.</strong> Booking Q3 and Q4, 12 keynotes confirmed, ~10 slots remain.</span></li>
                  <li><span className="lk">03</span><span className="lv"><strong>Stanford seminar.</strong> Co-teaching <em>Storytelling for Leaders</em> this fall.</span></li>
                  <li><span className="lk">04</span><span className="lv"><strong>Cohort coaching.</strong> Running one 12-person director cohort per quarter.</span></li>
                  <li><span className="lk">05</span><span className="lv"><strong>Free 5-day course.</strong> Quietly rewriting it. Day 3 is twice as good now.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ENDORSEMENTS */}
        <section className="section section--cream" data-screen-label="08 Endorsements">
          <div className="grid12">
            <div className="section-head section-head--center">
              <span className="eyebrow">Endorsements & awards</span>
              <h2>People who'd vouch for <em>my work.</em></h2>
            </div>
            <div className="testimonials-scroller" role="region" aria-label="Endorsements">
              <div className="testimonials-track">
                {ENDORSEMENTS.map((e,i)=>(
                  <figure key={i} className={"t-card" + (e.featured ? " featured" : "")}>
                    <span className="t-mark" aria-hidden="true">"</span>
                    <blockquote className="t-quote">{e.quote}</blockquote>
                    <div className="t-divider"/>
                    <figcaption className="t-attrib">
                      <div className="t-avatar" aria-hidden="true">{e.initials}</div>
                      <div>
                        <div className="t-name">{e.name}</div>
                        <div className="t-role">{e.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="endorsement-row" style={{marginTop: 20}}>
              <div className="repeat-card" style={{background:'#fff'}}>
                <div className="eyebrow">Award</div>
                <div className="repeat-mult" style={{fontSize:48, marginTop: 14}}>WSJ</div>
                <div className="repeat-lbl">Bestseller, 2024</div>
              </div>
              <div className="repeat-card" style={{background:'#fff'}}>
                <div className="eyebrow">Award</div>
                <div className="repeat-mult" style={{fontSize:48, marginTop: 14}}>#1</div>
                <div className="repeat-lbl">Amazon new release</div>
              </div>
              <div className="repeat-card" style={{background:'#fff'}}>
                <div className="eyebrow">Pick</div>
                <div className="repeat-mult" style={{fontSize:32, marginTop: 18, lineHeight: 1.1, fontStyle:'italic'}}>Next Big<br/>Idea Club</div>
                <div className="repeat-lbl">Must-read</div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="section" data-screen-label="09 Final CTA">
          <div className="grid12">
            <div className="about-final">
              <a className="about-final-card dark" href="Speaking.html">
                <span className="eyebrow">For organizations</span>
                <h3>Work with <em>me.</em></h3>
                <p className="label-line">Keynotes, workshops, and custom programs for managers and high-potentials.</p>
                <span className="arrow">Explore speaking →</span>
              </a>
              <a className="about-final-card" href="Book.html">
                <span className="eyebrow">For readers</span>
                <h3>Read the <em>book.</em></h3>
                <p className="label-line">Unforgettable Presence®, the WSJ bestseller, in your hands by Tuesday.</p>
                <span className="arrow">See the book →</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero">
          <TweakRadio
            label="Headline variant"
            value={tweaks.headlineVariant}
            onChange={(v)=>setTweak('headlineVariant', v)}
            options={Object.keys(ABOUT_HEADLINES)}
          />
        </TweakSection>
      </TweaksPanel>
    </PageShell>
  );
}

const aboutRoot = ReactDOM.createRoot(document.getElementById('root'));
aboutRoot.render(<AboutApp />);
