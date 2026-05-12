/* global React, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2E5BFF",
  "density": "regular",
  "portrait": "asset",
  "showCursor": true,
  "showSectionIndex": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks
  useEffect(() => {
    document.body.dataset.density = t.density;
    document.documentElement.style.setProperty("--blue-500", t.accent);
    document.documentElement.style.setProperty("--action", t.accent);
    document.documentElement.style.setProperty("--bg-brand", t.accent);
  }, [t.density, t.accent]);

  // Scroll-spy for the section index rail
  const sections = [
    { id: "hero",          n: "03", label: "Hero" },
    { id: "trusted",       n: "04", label: "Trusted by" },
    { id: "help",          n: "05", label: "How I help" },
    { id: "follow",        n: "06", label: "LinkedIn" },
    { id: "speaking",      n: "07", label: "Speaking" },
    { id: "press",         n: "08", label: "Press" },
    { id: "rebook",        n: "09", label: "Rebooking" },
    { id: "stats",         n: "10", label: "Stats" },
    { id: "book",          n: "11", label: "Book" },
    { id: "learn",         n: "12", label: "Learn" },
    { id: "testimonials",  n: "13", label: "Praise" },
    { id: "course",        n: "14", label: "Course" },
    { id: "contact",       n: "15", label: "Contact" },
  ];
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);

  return (
    <>
      {t.showCursor && <Cursor />}
      <TopBar tweaks={t} />
      {t.showSectionIndex && <SectionIndex sections={sections} active={active} />}

      <main>
        <Hero tweaks={t} />
        <TrustedBy />
        <HowICanHelp />
        <FollowLinkedIn />
        <SpeakingLongForm />
        <AsSeenIn />
        <RepeatBooking />
        <SpeakerStats />
        <BookShowcase />
        <LearnFromLorraine />
        <Testimonials />
        <FinalCTA />
        <Footer />
      </main>

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent}
                    options={["#2E5BFF", "#1638B8", "#D97757", "#1F8A5B", "#000000"]}
                    onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
                    options={["compact", "regular", "comfy"]}
                    onChange={(v) => setTweak("density", v)} />

        <TweakSection label="Hero" />
        <TweakRadio label="Portrait" value={t.portrait}
                    options={["asset", "slot"]}
                    onChange={(v) => setTweak("portrait", v)} />

        <TweakSection label="Motion" />
        <TweakToggle label="Custom cursor" value={t.showCursor}
                     onChange={(v) => setTweak("showCursor", v)} />
        <TweakToggle label="Section index" value={t.showSectionIndex}
                     onChange={(v) => setTweak("showSectionIndex", v)} />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
