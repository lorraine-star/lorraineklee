(function initFreeCourseOffer() {
  const COURSE_PATH = "/from-invisible-to-influential/";
  const PRODUCTION_ORIGIN = "https://lorraineklee.com";
  const UTM_PARAMS = Object.freeze({
    utm_source: "lorraineklee_site",
    utm_medium: "popup",
    utm_campaign: "from_invisible_to_influential",
    utm_content: "scroll_modal_v1",
  });

  const FREE_COURSE_OFFER = Object.freeze({
    eyebrowPill: "Free",
    eyebrowLabel: "5-Day Email Course",
    footerHeadlinePrefix: "Great at your job but can't ",
    footerHeadlineEmphasis: "talk about it?",
    footerSubhead:
      "You're not alone. Get my free 5-day course. The same frameworks I teach leaders at Amazon, Cisco, and Fortune 500 companies. Articulate your value. Make promotions inevitable.",
    footerDays: Object.freeze([
      "Day 1 · Articulate your value so people actually listen",
      "Day 2 · Show up on LinkedIn so opportunities come to you",
      "Day 3 · Get known by the people who decide promotions",
      "Day 4 · Position yourself as the obvious choice",
      "Day 5 · Stay consistent without burning out",
    ]),
    formEyebrow: "Start tomorrow",
    formTitleLead: "Join",
    formTitleEmphasis: "12,000+",
    formTitleTail: "leaders.",
    primaryButtonLabel: "Send me Day 1",
    successTitle: "You're in.",
    successTemplate: "Day 1 is on its way to {email}.",
    fineprint: "No spam. Unsubscribe in one click.",
    popupEyebrow: "Free 5-Day Course",
    popupHeadline: "From invisible to influential.",
    popupSubhead:
      "The 5-day system to communicate your value, get visible to decision-makers, and position yourself for the next level.",
    popupSupportPoints: Object.freeze([
      "Articulate your value.",
      "Show up on LinkedIn.",
      "Get known by decision-makers.",
    ]),
    popupMeta: "Five short emails. Free.",
    popupPrimaryCta: "Start the free course",
    popupSecondaryCta: "Not now",
  });

  function buildFreeCourseHref() {
    const url = new URL(COURSE_PATH, PRODUCTION_ORIGIN);
    Object.entries(UTM_PARAMS).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }

  window.FREE_COURSE_OFFER = FREE_COURSE_OFFER;
  window.getFreeCourseHref = buildFreeCourseHref;
})();
