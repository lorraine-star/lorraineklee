// =====================================================================
// App — composes the home page sections. Owns banner-dismiss state,
// wires the Tweaks panel, and switches the entire page between three
// distinct design directions: Editorial, Bold, and Minimal.
// =====================================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "designVariant": "Editorial",
  "headlineVariant": "Helping leaders",
  "ctaLabel": "Work With Me",
  "marqueeAnimated": true,
  "showBanner": true
}/*EDITMODE-END*/;

const HEADLINE_VARIANTS = {
  "Helping leaders":  'Helping leaders build an<br/><em>unforgettable</em> presence.',
  "Stop being unseen": 'Stop being the best-kept<br/>secret <em>at work.</em>',
  "From invisible":    'From invisible to<br/><em>influential.</em>',
};

const VARIANT_CLASS = {
  "Editorial": "variant-editorial",
  "Bold":     "variant-bold",
  "Minimal":  "variant-min",
};
const VARIANT_KEY = {
  "Editorial": "editorial",
  "Bold":     "bold",
  "Minimal":  "minimal",
};

// Small "About strip" used only in the Minimal variant — the hero is
// photo-less, so we surface the portrait below in a calm horizontal row.
function MinimalPortrait({ photoSrc }) {
  return (
    <section className="min-portrait-row">
      <div className="min-portrait-inner">
        <div className="min-portrait-photo">
          <img src={photoSrc} alt="Lorraine K. Lee"/>
        </div>
        <div className="min-portrait-text">
          <div className="eyebrow">About</div>
          <h2>I help quiet experts build the <em>presence</em> their work deserves.</h2>
          <p>For 20 years I've helped people at LinkedIn, Prezi, and beyond
          show up sharper in meetings, in writing, and on stage — without
          changing who they are.</p>
          <p>Today I work with leadership teams, conferences, and individuals
          to translate substance into influence.</p>
        </div>
      </div>
    </section>
  );
}

function HomeApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [bannerOpen, setBannerOpen] = React.useState(true);

  React.useEffect(() => {
    setBannerOpen(!!tweaks.showBanner);
  }, [tweaks.showBanner]);

  function dismissBanner() {
    setBannerOpen(false);
    setTweak('showBanner', false);
  }

  const headlineHtml = HEADLINE_VARIANTS[tweaks.headlineVariant] || HEADLINE_VARIANTS["Helping leaders"];
  const variantClass = VARIANT_CLASS[tweaks.designVariant] || VARIANT_CLASS["Editorial"];
  const variantKey = VARIANT_KEY[tweaks.designVariant] || "editorial";

  return (
    <div className={"shell " + variantClass} data-screen-label="00 Home page">
      <Banner visible={bannerOpen} onDismiss={dismissBanner}/>
      <Nav ctaLabel={tweaks.ctaLabel}/>
      <main>
        <Hero
          headline={headlineHtml}
          sub="Keynotes, workshops, and coaching that help your managers and high-potentials stop being the best-kept secret at work — and start driving the impact your organization needs."
          ctaLabel={tweaks.ctaLabel}
          photoSrc={window.__resources.heroPhoto}
          variant={variantKey}
        />
        {variantKey === 'minimal' && <MinimalPortrait photoSrc={window.__resources.heroPhoto}/>}
        <TrustStrip animated={!!tweaks.marqueeAnimated} variant={variantKey}/>
        <BookPromo/>
        <Testimonials/>
        <FreeCourseCTA/>
      </main>
      <Footer/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Design direction">
          <TweakRadio
            label="Page style"
            value={tweaks.designVariant}
            onChange={(v)=>setTweak('designVariant', v)}
            options={["Editorial","Bold","Minimal"]}
          />
          <div style={{fontSize:12, lineHeight:1.5, color:'rgba(0,0,0,0.55)', marginTop:6}}>
            <strong>Editorial</strong> — warm cream paper, serif headline.<br/>
            <strong>Bold</strong> — dark ink, oversized magazine type.<br/>
            <strong>Minimal</strong> — white, centered, conversion-first.
          </div>
        </TweakSection>
        <TweakSection title="Hero">
          <TweakRadio
            label="Headline variant"
            value={tweaks.headlineVariant}
            onChange={(v)=>setTweak('headlineVariant', v)}
            options={Object.keys(HEADLINE_VARIANTS)}
          />
          <TweakText
            label="Primary CTA label"
            value={tweaks.ctaLabel}
            onChange={(v)=>setTweak('ctaLabel', v)}
          />
        </TweakSection>
        <TweakSection title="Trust strip">
          <TweakToggle
            label="Animate logo marquee"
            value={!!tweaks.marqueeAnimated}
            onChange={(v)=>setTweak('marqueeAnimated', v)}
          />
        </TweakSection>
        <TweakSection title="Banner">
          <TweakToggle
            label="Show announcement banner"
            value={!!tweaks.showBanner}
            onChange={(v)=>setTweak('showBanner', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HomeApp/>);
