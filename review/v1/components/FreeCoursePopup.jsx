const FREE_COURSE_POPUP_DISMISSED_KEY = "ll:v1:free-course-popup:dismissedAt";
const FREE_COURSE_POPUP_ENGAGED_KEY = "ll:v1:free-course-popup:engagedAt";
const FREE_COURSE_POPUP_DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
const FREE_COURSE_POPUP_ENGAGED_MS = 30 * 24 * 60 * 60 * 1000;
const FREE_COURSE_POPUP_DELAY_MS = 18 * 1000;
const FREE_COURSE_POPUP_SCROLL_DEPTH = 0.35;

function readPopupTimestamp(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    return 0;
  }
}

function writePopupTimestamp(key) {
  try {
    window.localStorage.setItem(key, String(Date.now()));
  } catch (error) {
    // Ignore storage failures and allow the popup to behave ephemerally.
  }
}

function hasActivePopupSuppression() {
  const now = Date.now();
  const dismissedAt = readPopupTimestamp(FREE_COURSE_POPUP_DISMISSED_KEY);
  if (dismissedAt && now - dismissedAt < FREE_COURSE_POPUP_DISMISS_MS) return true;

  const engagedAt = readPopupTimestamp(FREE_COURSE_POPUP_ENGAGED_KEY);
  if (engagedAt && now - engagedAt < FREE_COURSE_POPUP_ENGAGED_MS) return true;

  return false;
}

function getPopupScrollDepth() {
  const scrollRoot = document.documentElement;
  const scrollable = scrollRoot.scrollHeight - window.innerHeight;

  if (scrollable <= 0) return 0;

  return scrollRoot.scrollTop / scrollable;
}

function FreeCoursePopup() {
  const offer = window.FREE_COURSE_OFFER || {};
  const dialogRef = React.useRef(null);
  const primaryActionRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);
  const bodyOverflowRef = React.useRef("");
  const bodyPaddingRightRef = React.useRef("");
  const [timeReady, setTimeReady] = React.useState(false);
  const [scrollReady, setScrollReady] = React.useState(false);
  const [courseSeen, setCourseSeen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(() => hasActivePopupSuppression());

  const popupHref =
    typeof window.getFreeCourseHref === "function"
      ? window.getFreeCourseHref()
      : "https://lorraineklee.com/from-invisible-to-influential/";

  React.useEffect(() => {
    if (isBlocked) return undefined;

    const timerId = window.setTimeout(() => {
      setTimeReady(true);
    }, FREE_COURSE_POPUP_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [isBlocked]);

  React.useEffect(() => {
    if (isBlocked || scrollReady) return undefined;

    function syncScrollDepth() {
      if (getPopupScrollDepth() >= FREE_COURSE_POPUP_SCROLL_DEPTH) {
        setScrollReady(true);
      }
    }

    syncScrollDepth();
    window.addEventListener("scroll", syncScrollDepth, { passive: true });
    window.addEventListener("resize", syncScrollDepth);

    return () => {
      window.removeEventListener("scroll", syncScrollDepth);
      window.removeEventListener("resize", syncScrollDepth);
    };
  }, [isBlocked, scrollReady]);

  React.useEffect(() => {
    if (isBlocked || courseSeen) return undefined;

    const courseSection = document.getElementById("course");
    if (!courseSection) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setCourseSeen(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(courseSection);
    return () => observer.disconnect();
  }, [courseSeen, isBlocked]);

  React.useEffect(() => {
    if (isBlocked || courseSeen || isOpen) return;
    if (!timeReady || !scrollReady) return;

    setIsOpen(true);
  }, [courseSeen, isBlocked, isOpen, scrollReady, timeReady]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    function handleCancel(event) {
      event.preventDefault();
      dismissPopup();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  });

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (isOpen) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      bodyOverflowRef.current = document.body.style.overflow;
      bodyPaddingRightRef.current = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      if (!dialog.open) {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "open");
      }

      window.requestAnimationFrame(() => {
        primaryActionRef.current?.focus();
      });
    } else {
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.paddingRight = bodyPaddingRightRef.current;

      const previousFocus = previousFocusRef.current;
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      }
    }

    return () => {
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.paddingRight = bodyPaddingRightRef.current;
    };
  }, [isOpen]);

  function dismissPopup() {
    writePopupTimestamp(FREE_COURSE_POPUP_DISMISSED_KEY);
    setIsBlocked(true);
    setIsOpen(false);
  }

  function handleDialogClick(event) {
    if (event.target === dialogRef.current) {
      dismissPopup();
    }
  }

  function handlePrimaryAction() {
    writePopupTimestamp(FREE_COURSE_POPUP_ENGAGED_KEY);
    setIsBlocked(true);
    setIsOpen(false);
    window.location.assign(popupHref);
  }

  if (isBlocked) return null;

  return ReactDOM.createPortal(
    <dialog
      ref={dialogRef}
      className="free-course-popup"
      aria-labelledby="free-course-popup-title"
      onClick={handleDialogClick}
    >
      <div className="free-course-popup__card">
        <button
          type="button"
          className="free-course-popup__close"
          aria-label="Dismiss free course popup"
          onClick={dismissPopup}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="free-course-popup__eyebrow">{offer.popupEyebrow || "Free 5-Day Course"}</div>
        <h2 id="free-course-popup-title" className="free-course-popup__title">
          {offer.popupHeadline || "From invisible to influential."}
        </h2>
        <p className="free-course-popup__subhead">
          {offer.popupSubhead ||
            "The 5-day system to communicate your value, get visible to decision-makers, and position yourself for the next level."}
        </p>

        <ul className="free-course-popup__points">
          {(offer.popupSupportPoints || []).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="free-course-popup__actions">
          <button
            ref={primaryActionRef}
            type="button"
            className="btn primary large"
            autoFocus
            onClick={handlePrimaryAction}
          >
            {offer.popupPrimaryCta || "Start the free course"} <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="free-course-popup__dismiss" onClick={dismissPopup}>
            {offer.popupSecondaryCta || "Not now"}
          </button>
        </div>

        <p className="free-course-popup__meta">{offer.popupMeta || "Five short emails. Free."}</p>
      </div>
    </dialog>,
    document.body
  );
}

window.FreeCoursePopup = FreeCoursePopup;
