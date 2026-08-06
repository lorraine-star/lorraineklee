import { config, fields, collection, singleton } from '@keystatic/core';

// Storage: Keystatic Cloud. The admin UI at /keystatic authenticates against
// the Keystatic Cloud project and commits content changes straight to the
// GitHub repo. Lorraine owns the Keystatic Cloud project (the `rise-learning`
// account) and connected it to her own GitHub account during handoff.
//
// To run the admin against local files instead (e.g. offline dev), swap to:
//   storage: { kind: 'local' },

// Shared option lists kept as single sources of truth so the editable schema
// and the pages that render the data can't drift (CLI-162).
const COURSE_CATEGORIES = ['Communication', 'Leadership', 'Management', 'Career'] as const;
const COURSE_CATEGORY_OPTIONS = COURSE_CATEGORIES.map((value) => ({ label: value, value }));

const APPEARANCE_TYPES = [
  'Article', 'Podcast', 'Video', 'Interview', 'Book',
  'Report', 'Resource', 'Award', 'Event', 'Newsletter',
] as const;
const APPEARANCE_TYPE_OPTIONS = APPEARANCE_TYPES.map((value) => ({ label: value, value }));

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'rise-learning/lorraineklee',
  },
  singletons: {
    bookPromo: singleton({
      label: 'Book Promo (global section)',
      path: 'src/content/book-promo/',
      // Canonical content for the shared "The Book" promo (BookPromo.astro,
      // data-global-section="book-promo"). Fields fall back to the previous
      // hardcoded copy so the section renders identically until edited.
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'The Book' }),
        title: fields.text({
          label: 'Title (shown italic)',
          defaultValue: 'Unforgettable Presence®',
        }),
        tagline: fields.text({ label: 'Tagline' }),
        body: fields.text({ label: 'Body', multiline: true }),
        quote: fields.text({
          label: 'Endorsement quote (quotation marks added automatically)',
          multiline: true,
        }),
        quote_attribution: fields.text({ label: 'Endorsement attribution' }),
        cta_label: fields.text({ label: 'CTA label', defaultValue: 'Get your copy' }),
        cta_url: fields.text({ label: 'CTA URL', defaultValue: '/book' }),
        cover_image: fields.image({
          label: 'Book cover image',
          directory: 'public/images/v1',
          publicPath: '/images/v1/',
        }),
        cover_alt: fields.text({ label: 'Book cover alt text' }),
      },
    }),
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site-settings/',
      // Sitewide chrome that used to be hardcoded. The footer is driven from
      // here (CLI-159); the nav and announcement banner can join this singleton
      // later. Social icon SVG artwork stays in code (src/lib/social.ts); only
      // the platform key and URL are editable here.
      schema: {
        footer: fields.object(
          {
            tagline_before: fields.text({
              label: 'Tagline (text before the italic word)',
            }),
            tagline_emphasis: fields.text({
              label: 'Tagline italic word',
            }),
            tagline_after: fields.text({
              label: 'Tagline (text after the italic word)',
            }),
            socials: fields.array(
              fields.object({
                platform: fields.text({
                  label: 'Platform',
                  description:
                    'One of: linkedin, instagram, youtube, x (or twitter). Controls which icon renders.',
                }),
                label: fields.text({
                  label: 'Accessible label',
                  description: 'Screen-reader label, e.g. "X (Twitter)".',
                }),
                url: fields.url({ label: 'URL' }),
              }),
              {
                label: 'Social links',
                itemLabel: (props) => props.fields.platform.value || 'Link',
              }
            ),
            contact_heading: fields.text({
              label: 'Get-in-touch heading',
              defaultValue: 'Get in touch',
            }),
            contact_blurb: fields.text({
              label: 'Get-in-touch blurb',
              multiline: true,
            }),
            contact_links: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({
                  label: 'Link (route, mailto:, or URL)',
                }),
              }),
              {
                label: 'Get-in-touch links',
                itemLabel: (props) => props.fields.label.value || 'Link',
              }
            ),
            explore_heading: fields.text({
              label: 'Explore column heading',
              defaultValue: 'Explore',
            }),
            explore_links: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'Link' }),
              }),
              {
                label: 'Explore links',
                itemLabel: (props) => props.fields.label.value || 'Link',
              }
            ),
            legal_entity: fields.text({
              label: 'Copyright entity (after the auto year)',
              description:
                'Rendered as the copyright line after the year, which updates automatically.',
            }),
            legal_links: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'Link' }),
              }),
              {
                label: 'Legal / base links',
                itemLabel: (props) => props.fields.label.value || 'Link',
              }
            ),
          },
          { label: 'Footer' }
        ),
        nav: fields.object(
          {
            items: fields.array(
              fields.object({
                id: fields.text({
                  label: 'ID (stable key for active highlighting)',
                  description:
                    'Internal key used to highlight the current page in the nav, e.g. "speaking". Keep existing ids unchanged; new top-level items can use any unique slug.',
                }),
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'Link' }),
                children: fields.array(
                  fields.object({
                    label: fields.text({ label: 'Label' }),
                    href: fields.text({ label: 'Link' }),
                  }),
                  {
                    label: 'Dropdown items',
                    itemLabel: (props) => props.fields.label.value || 'Item',
                  }
                ),
              }),
              {
                label: 'Nav items',
                itemLabel: (props) => props.fields.label.value || 'Item',
              }
            ),
            cta_label: fields.text({
              label: 'CTA button label',
              defaultValue: 'Contact',
            }),
            cta_href: fields.text({
              label: 'CTA button link',
              defaultValue: '/contact',
            }),
          },
          { label: 'Navigation' }
        ),
        banner: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Show announcement banner',
              defaultValue: true,
            }),
            text_strong: fields.text({
              label: 'Bold lead-in',
              description: 'The bold part, e.g. "Free 5-day course:".',
            }),
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'Link' }),
          },
          { label: 'Announcement banner' }
        ),
        press: fields.object(
          {
            eyebrow: fields.text({
              label: '"As seen in" eyebrow',
              defaultValue: 'As Seen In',
            }),
            logos: fields.array(
              fields.object({
                id: fields.text({
                  label: 'Slug (CSS hook, e.g. "cnn")',
                  description:
                    'Stable id used for per-logo CSS tuning (.press-mark--<id>). Changing it drops any custom tuning for that logo.',
                }),
                name: fields.text({ label: 'Outlet name' }),
                src: fields.image({
                  label: 'Logo image',
                  description:
                    'Upload the logo at whatever size you have. The strip resizes it for you, so there is no need to shrink or crop it first. A transparent PNG or an SVG reads best.',
                  directory: 'public/images/v1/press',
                  publicPath: '/images/v1/press/',
                }),
                scale: fields.number({
                  label: 'Size nudge (optional)',
                  description:
                    'Leave this at 1 for almost every logo. Raise it if a compact square logo looks small next to the wide ones (1.3 to 1.5 is typical), lower it if one looks too heavy.',
                  defaultValue: 1,
                  step: 0.05,
                  // Bounded so a typo can't break the layout: above ~1.87 the
                  // logo outgrows its row and collides with the eyebrow above.
                  // The component clamps to the same range defensively.
                  validation: { min: 0.5, max: 1.8 },
                }),
              }),
              {
                label: 'Press logos',
                description:
                  'The sitewide "As Seen In" marquee (home, about, featured-in and speaking). Leave empty to fall back to the built-in lineup.',
                itemLabel: (props) => props.fields.name.value || 'Logo',
              }
            ),
          },
          {
            label: 'Press / "As Seen In" strip',
            description:
              'Global trust strip shared across the home, about, featured-in and speaking pages. Editing it here updates all four.',
          }
        ),
      },
    }),
    home: singleton({
      label: 'Home',
      path: 'src/content/home/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({
          label: 'SEO description',
          multiline: true,
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline (plain start)' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            headline_tail: fields.text({
              label: 'Headline tail (plain, after the accent)',
              description:
                'Plain text rendered after the italic accent so the emphasis can sit mid-sentence, e.g. "presence."',
            }),
            subheadline: fields.text({
              label: 'Subheadline',
              multiline: true,
            }),
            image: fields.image({
              label: 'Hero image',
              description:
                'Leave empty to keep the current default hero photo.',
              directory: 'public/images/home',
              publicPath: '/images/home/',
            }),
            image_alt: fields.text({ label: 'Hero image alt text' }),
            meta: fields.array(
              fields.object({
                value: fields.text({ label: 'Value (e.g. 250k+)' }),
                label: fields.text({
                  label: 'Label',
                  description: 'Put each line on its own line for a manual break.',
                  multiline: true,
                }),
              }),
              {
                label: 'Hero proof stats',
                itemLabel: (props) => props.fields.value.value || 'Stat',
              }
            ),
            photo_stat: fields.object(
              {
                value: fields.text({ label: 'Value (e.g. 4.9)' }),
                suffix: fields.text({ label: 'Suffix (e.g. /5)' }),
                label: fields.text({
                  label: 'Label',
                  description: 'Put each line on its own line for a manual break.',
                  multiline: true,
                }),
              },
              { label: 'Hero photo stat badge' }
            ),
          },
          { label: 'Hero' }
        ),
        primary_cta: fields.object(
          {
            label: fields.text({ label: 'Label' }),
            url: fields.text({ label: 'URL' }),
          },
          { label: 'Primary CTA (filled button)' }
        ),
        secondary_cta: fields.object(
          {
            label: fields.text({ label: 'Label' }),
            url: fields.text({ label: 'URL' }),
          },
          { label: 'Secondary CTA (outline button)' }
        ),
        tertiary_cta: fields.object(
          {
            label: fields.text({ label: 'Label' }),
            url: fields.text({ label: 'URL' }),
          },
          { label: 'Tertiary CTA (text link)' }
        ),
        // "Four ways into the work" cards below the hero. Only the heading and
        // blurb of each card are editable; the four columns, their order,
        // numbering (01–04), links, and styling are fixed in code
        // (src/pages/index.astro). Modelled as four named objects rather than an
        // array so an editor cannot add, remove, or reorder columns (CLI-153).
        four_ways: fields.object(
          {
            eyebrow: fields.text({
              label: 'Section eyebrow',
              defaultValue: 'How I can help',
            }),
            heading: fields.text({
              label: 'Section heading (plain start)',
              defaultValue: 'Four ways into the',
            }),
            heading_accent: fields.text({
              label: 'Section heading accent (shown italic)',
              defaultValue: 'work.',
            }),
            column_1: fields.object(
              {
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'Speaking',
                }),
                blurb: fields.text({
                  label: 'Blurb',
                  multiline: true,
                  defaultValue:
                    'Keynotes built around what your team actually needs to hear.',
                }),
              },
              { label: 'Column 1' }
            ),
            column_2: fields.object(
              {
                heading: fields.text({
                  label: 'Heading',
                  description:
                    'Keep the ® symbol. "Unforgettable Presence®" is a registered trademark and the ® must be preserved.',
                  defaultValue: 'Unforgettable Presence®',
                }),
                blurb: fields.text({
                  label: 'Blurb',
                  multiline: true,
                  defaultValue: 'The book leadership programs already assign.',
                }),
              },
              { label: 'Column 2' }
            ),
            column_3: fields.object(
              {
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'Courses',
                }),
                blurb: fields.text({
                  label: 'Blurb',
                  multiline: true,
                  defaultValue:
                    'On-demand training. 250,000+ students on LinkedIn Learning.',
                }),
              },
              { label: 'Column 3' }
            ),
            column_4: fields.object(
              {
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'Custom programs',
                }),
                blurb: fields.text({
                  label: 'Blurb',
                  multiline: true,
                  defaultValue:
                    'Cohort intensives for managers and high-potentials.',
                }),
              },
              { label: 'Column 4' }
            ),
          },
          {
            label: 'Four ways into the work',
            description:
              'The four cards below the hero. Headings and blurbs are editable; the number of columns, their order, numbering, links, and styling stay fixed in code.',
          }
        ),
        // The "as seen in" logos render from <TrustAsSeenIn /> and the
        // testimonials carousel from the shared `testimonials` collection
        // (CLI-118); only the testimonials heading copy lives here.
        banner: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Show announcement banner',
              defaultValue: true,
            }),
            prefix: fields.text({
              label: 'Prefix (hidden on mobile, e.g. "From")',
            }),
            strong: fields.text({ label: 'Bold text' }),
            text: fields.text({ label: 'Text' }),
            href: fields.text({
              label: 'Link',
              description: 'Use #course to jump to the on-page free-course section.',
            }),
          },
          { label: 'Announcement banner' }
        ),
        free_course: fields.object(
          {
            eyebrow_pill: fields.text({
              label: 'Eyebrow pill',
              defaultValue: 'Free',
            }),
            eyebrow_label: fields.text({
              label: 'Eyebrow label',
              defaultValue: '5-Day Email Course',
            }),
            headline: fields.text({ label: 'Headline (plain start)' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            bullets: fields.array(fields.text({ label: 'Bullet' }), {
              label: 'Course-day bullets',
              itemLabel: (props) => props.value || 'Bullet',
            }),
            form_eyebrow: fields.text({
              label: 'Form eyebrow',
              defaultValue: 'Start tomorrow',
            }),
            form_title: fields.text({ label: 'Form title (plain)' }),
            form_title_accent: fields.text({
              label: 'Form title accent (shown italic)',
            }),
            form_title_tail: fields.text({
              label: 'Form title tail (plain, after the accent)',
            }),
            form_email_label: fields.text({
              label: 'Form email label',
              defaultValue: 'Email address',
            }),
            form_email_placeholder: fields.text({
              label: 'Form email placeholder',
              defaultValue: 'you@company.com',
            }),
            form_button_label: fields.text({
              label: 'Form button label',
              defaultValue: 'Send me Day 1',
            }),
            form_fineprint: fields.text({
              label: 'Form fineprint',
              defaultValue: 'No spam. Unsubscribe in one click.',
            }),
          },
          {
            label: 'Free course section',
            description:
              'The Kit form action URL is hard-wired in code so copy edits cannot break email capture.',
          }
        ),
        course_popup: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'Free 5-Day Course',
            }),
            title: fields.text({ label: 'Title' }),
            subhead: fields.text({ label: 'Subhead', multiline: true }),
            points: fields.array(fields.text({ label: 'Point' }), {
              label: 'Points',
              itemLabel: (props) => props.value || 'Point',
            }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Start the free course',
            }),
            cta_url: fields.text({
              label: 'CTA URL',
              description:
                'Where the popup button points. Keep the UTM parameters if you want the click tracked.',
            }),
            dismiss_label: fields.text({
              label: 'Dismiss label',
              defaultValue: 'Not now',
            }),
            meta: fields.text({
              label: 'Meta line',
              defaultValue: 'Five short emails. Free.',
            }),
          },
          {
            label: 'Free course popup',
            description:
              'The scroll/time triggers that decide when the popup appears stay in code.',
          }
        ),
        testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Testimonials section heading' }
        ),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about/',
      format: { contentField: 'body' },
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
            }),
            secondary_cta_url: fields.text({ label: 'Secondary CTA URL' }),
            headshot: fields.image({
              label: 'Headshot',
              directory: 'public/images/about',
              publicPath: '/images/about/',
            }),
            headshot_alt: fields.text({ label: 'Headshot alt text' }),
            stat_value: fields.text({ label: 'Floating stat value' }),
            stat_label: fields.text({
              label: 'Floating stat label',
              multiline: true,
            }),
          },
          { label: 'Hero' }
        ),
        story_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Story section heading' }
        ),
        story_facts: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value' }),
          }),
          {
            label: 'Story aside facts',
            itemLabel: (props) => props.fields.label.value || 'Fact',
          }
        ),
        career_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Career highlights section heading' }
        ),
        career_highlights: fields.array(
          fields.object({
            logo: fields.image({
              label: 'Logo',
              directory: 'public/images/about/highlights',
              publicPath: '/images/about/highlights/',
              description:
                'Brand mark shown at the top of the card. Leave empty to fall back to the text value.',
            }),
            logo_alt: fields.text({ label: 'Logo alt text' }),
            eyebrow: fields.text({ label: 'Eyebrow' }),
            value: fields.text({ label: 'Value (large display text)' }),
            label: fields.text({ label: 'Label (caption under value)' }),
            attribution: fields.text({
              label: 'Attribution tag',
              description:
                'Short tag shown at the bottom of the card — what this award/honor recognizes. E.g. "For her newsletter". Leave empty to hide.',
            }),
          }),
          {
            label: 'Career highlights',
            itemLabel: (props) => props.fields.value.value || 'Highlight',
          }
        ),
        credibility_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Credibility section heading' }
        ),
        credibility: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
            logos: fields.array(
              fields.object({
                src: fields.image({
                  label: 'Logo',
                  directory: 'public/images/about/credibility',
                  publicPath: '/images/about/credibility/',
                }),
                alt: fields.text({ label: 'Alt text' }),
              }),
              {
                label: 'Logos',
                itemLabel: (props) => props.fields.alt.value || 'Logo',
              }
            ),
          }),
          {
            label: 'Credibility items',
            itemLabel: (props) => props.fields.title.value || 'Item',
          }
        ),
        final_ctas: fields.array(
          fields.object({
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
            dark: fields.checkbox({
              label: 'Dark card',
              defaultValue: false,
            }),
          }),
          {
            label: 'Final CTA cards',
            itemLabel: (props) => props.fields.heading.value || 'CTA',
          }
        ),
        body: fields.markdoc({ label: 'Story body' }),
      },
    }),
    speaking: singleton({
      label: 'Speaking',
      path: 'src/content/speaking/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        card_cta_label: fields.text({
          label: 'Talk card CTA label',
          description:
            'Shared "book this talk" button label used on the keynote/talk cards and on individual keynote pages',
          defaultValue: 'Book this talk',
        }),
        card_cta_url: fields.text({
          label: 'Talk card CTA URL',
          description: 'Where the talk card / keynote-page CTA links (default /contact)',
          defaultValue: '/contact',
        }),
        takeaways_label: fields.text({
          label: 'Takeaways panel label',
          description:
            'Heading above the takeaways list in talk cards and keynote pages',
          defaultValue: 'What the audience walks away with',
        }),
        talk_track_label: fields.text({
          label: 'Talk track heading',
          description: 'Heading above the talk-track agenda on keynote pages',
          defaultValue: 'Talk track',
        }),
        talk_track_link_label: fields.text({
          label: 'Talk track link label',
          description:
            'Shared wording for the link on a talk card that points to that talk\'s track. Only shows on talks that have a link set.',
          defaultValue: 'See the talk track',
        }),
        detail_back_label: fields.text({
          label: 'Keynote detail: back-link label',
          description: 'Top "all keynotes" link on an individual keynote page.',
          defaultValue: 'All keynotes',
        }),
        detail_back_url: fields.text({
          label: 'Keynote detail: back-link URL',
          description:
            'Route the "all keynotes" links point to (default /keynotes).',
          defaultValue: '/keynotes',
        }),
        detail_more_label: fields.text({
          label: 'Keynote detail: "see other keynotes" link',
          defaultValue: 'See other keynotes',
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            cta_label: fields.text({ label: 'Primary CTA label' }),
            cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
              description: 'E.g. "View speaker one-pager"',
            }),
            secondary_cta_url: fields.text({
              label: 'Secondary CTA URL',
              description: 'PDF link, internal route, or external URL',
            }),
            testimonials_anchor_label: fields.text({
              label: 'Testimonials anchor label',
              description: 'Small link that jumps to the testimonials section',
              defaultValue: 'Read testimonials',
            }),
            image: fields.image({
              label: 'Hero image',
              directory: 'public/images/speaking',
              publicPath: '/images/speaking/',
            }),
            image_alt: fields.text({ label: 'Hero image alt text' }),
            photo_stat_value: fields.text({ label: 'Photo stat value' }),
            photo_stat_label: fields.text({
              label: 'Photo stat label',
              multiline: true,
            }),
            meta: fields.array(
              fields.object({
                value: fields.text({ label: 'Value' }),
                label: fields.text({ label: 'Label', multiline: true }),
              }),
              {
                label: 'Hero meta stats',
                itemLabel: (props) => props.fields.value.value || 'Stat',
              }
            ),
          },
          { label: 'Hero' }
        ),
        reel_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            embed_url: fields.text({
              label: 'Reel embed URL',
              description:
                'Paste the YouTube or Vimeo link straight from the Share button. Watch links, youtu.be links, and embed links all work.',
            }),
            caption: fields.text({ label: 'Caption under reel' }),
          },
          { label: 'Speaker reel section' }
        ),
        topics_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Topics section heading' }
        ),
        topics: fields.array(
          fields.object({
            number: fields.text({ label: 'Number' }),
            slug: fields.text({
              label: 'URL slug',
              description:
                'Kebab-case slug for the deep-link page, e.g. "executive-presence".',
            }),
            title: fields.text({ label: 'Title' }),
            subtitle: fields.text({
              label: 'Subtitle (optional)',
              description:
                'The descriptive line after the title, e.g. "A Leader\'s Guide to Managing Your Brand At Work".',
            }),
            note: fields.text({
              label: 'Context note (optional)',
              description:
                'Small note shown under the title, e.g. "For General Audiences and AAPI Groups".',
            }),
            tag: fields.text({
              label: 'Tag / badge (optional)',
              description:
                'Small chip on the card, e.g. "Most Popular" or "#2 Most Popular". Leave blank for none.',
            }),
            gif: fields.text({
              label: 'Animated clip (optional)',
              description:
                'Path to the animated WebP clip shown on the card, e.g. "/images/speaking/keynotes/exec-presence.webp".',
            }),
            gif_alt: fields.text({ label: 'Animated clip alt text' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
              description:
                'Full talk description. Separate paragraphs with a blank line.',
            }),
            format: fields.text({ label: 'Format' }),
            clip_url: fields.text({
              label: 'Talk clip embed URL (optional, unused)',
              description: 'Legacy field, kept for back-compat, not rendered.',
            }),
            talk_track: fields.array(
              fields.object({
                time: fields.text({ label: 'Time / chapter (optional)' }),
                label: fields.text({ label: 'Track label' }),
              }),
              {
                label: 'Talk track (chapters)',
                itemLabel: (props) =>
                  props.fields.label.value || 'Track item',
              }
            ),
            talk_track_url: fields.text({
              label: 'Talk track link (optional)',
              description:
                'Where this talk links to so people can find its talk track, for example "/keynotes/how-to-lead-with-impact" or a full video URL. Leave blank to show no link.',
              defaultValue: '',
            }),
            takeaways: fields.array(fields.text({ label: 'Takeaway' }), {
              label: 'Audience takeaways',
              itemLabel: (props) => props.value || 'Takeaway',
            }),
          }),
          {
            label: 'Speaking topics',
            itemLabel: (props) => props.fields.title.value || 'Topic',
          }
        ),
        custom_programs_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            bullets: fields.array(fields.text({ label: 'Bullet' }), {
              label: 'Custom program bullets',
              itemLabel: (props) => props.value || 'Bullet',
            }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Custom programs section' }
        ),
        other_talks_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            summary_label: fields.text({
              label: 'Expand toggle label',
              defaultValue: 'See all other talks',
            }),
          },
          { label: 'All other talks section' }
        ),
        other_talks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            subtitle: fields.text({ label: 'Subtitle (optional)' }),
            note: fields.text({ label: 'Context note (optional)' }),
            format: fields.text({ label: 'Format (optional)' }),
            gif: fields.text({
              label: 'Animated clip (optional)',
              description:
                'Path to the animated WebP clip, e.g. "/images/speaking/keynotes/tea-method.webp".',
            }),
            gif_alt: fields.text({ label: 'Animated clip alt text' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
              description: 'Separate paragraphs with a blank line.',
            }),
            talk_track_url: fields.text({
              label: 'Talk track link (optional)',
              description:
                'Where this talk links to so people can find its talk track, for example "/keynotes/how-to-present-like-a-pro" or a full video URL. Leave blank to show no link.',
              defaultValue: '',
            }),
            takeaways: fields.array(fields.text({ label: 'Takeaway' }), {
              label: 'Audience takeaways',
              itemLabel: (props) => props.value || 'Takeaway',
            }),
          }),
          {
            label: 'All other talks',
            itemLabel: (props) => props.fields.title.value || 'Talk',
          }
        ),
        clients_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Past clients section heading' }
        ),
        past_clients: fields.array(
          fields.object({
            name: fields.text({ label: 'Client name' }),
            logo_image: fields.image({
              label: 'Logo image (upload)',
              description:
                'Upload the logo here. Easiest option, and it works for any brand whether or not the logo is on a CDN. Used in place of the URL below when both are set. Leave empty to paste a URL instead.',
              directory: 'public/images/clients',
              publicPath: '/images/clients/',
            }),
            logo_src: fields.text({
              label: 'Logo image URL',
              description:
                'Optional alternative to uploading: paste a logo URL, such as a Brandfetch CDN link. Ignored when an image is uploaded above. Leave both empty to show the client name as styled text.',
            }),
            style: fields.text({
              label: 'Logo style (CSS classes: bold, caps, serif, italic). Used only when no logo image or URL is set.',
            }),
          }),
          {
            label: 'Past clients',
            itemLabel: (props) => props.fields.name.value || 'Client',
          }
        ),
        show_stats: fields.checkbox({
          label: 'Show stats block',
          defaultValue: true,
        }),
        stats_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Stats section heading' }
        ),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Value (number)' }),
            decimals: fields.integer({
              label: 'Decimal places',
              defaultValue: 0,
            }),
            denominator: fields.text({
              label: 'Denominator / suffix (e.g. /5 or %)',
            }),
            label: fields.text({ label: 'Label', multiline: true }),
          }),
          {
            label: 'Stats',
            itemLabel: (props) => props.fields.value.value || 'Stat',
          }
        ),
        testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            linkedin_cta_label: fields.text({
              label: 'LinkedIn testimonials CTA label',
              description:
                'Button under the organizer testimonials, e.g. "View 250+ glowing testimonials on LinkedIn".',
              defaultValue: 'View 250+ glowing testimonials on LinkedIn',
            }),
            linkedin_cta_url: fields.text({
              label: 'LinkedIn testimonials CTA URL',
              description:
                'Where the LinkedIn testimonials button points (the LinkedIn recommendations page).',
              defaultValue:
                'https://www.linkedin.com/in/lorraineklee/details/recommendations/',
            }),
          },
          { label: 'Testimonials section heading' }
        ),
        // Organizer testimonials now come from the shared `testimonials`
        // collection (CLI-118) via getTestimonials({ placement: 'speaking',
        // type: 'client-organizer-speaking' }). Only the section heading copy
        // above lives here.
        attendee_testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Attendee testimonials section heading' }
        ),
        // Attendee testimonials likewise come from the shared collection via
        // getTestimonials({ placement: 'speaking', type: 'event-attendee' }).
        bio_callout: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({
              label: 'CTA URL',
              defaultValue: '/speaker-bio',
            }),
          },
          { label: 'Speaker bio callout' }
        ),
        repeats_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Repeat bookings section heading' }
        ),
        repeats: fields.array(
          fields.object({
            name: fields.text({ label: 'Client name' }),
            multiplier: fields.text({ label: 'Multiplier (e.g. 6x)' }),
            label: fields.text({ label: 'Label' }),
          }),
          {
            label: 'Repeat bookings',
            itemLabel: (props) => props.fields.name.value || 'Client',
          }
        ),
        // The "as seen in" strip on this page renders from <TrustAsSeenIn />
        // and reads the shared siteSettings.press lineup. It used to have a
        // duplicate as_seen_in list here, which meant editing the press logos
        // in Site Settings silently left this page behind (CLI-176).
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
      },
    }),
    speakerBio: singleton({
      label: 'Speaker Bio',
      path: 'src/content/speaker-bio/',
      format: { contentField: 'body' },
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({
              label: 'Primary CTA label',
              defaultValue: 'Book Lorraine',
            }),
            primary_cta_url: fields.text({
              label: 'Primary CTA URL',
              defaultValue: '/contact',
            }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
              defaultValue: 'Back to speaking',
            }),
            secondary_cta_url: fields.text({
              label: 'Secondary CTA URL',
              defaultValue: '/speaking',
            }),
            headshot: fields.image({
              label: 'Headshot',
              directory: 'public/images/speaker-bio',
              publicPath: '/images/speaker-bio/',
            }),
            headshot_alt: fields.text({ label: 'Headshot alt text' }),
          },
          { label: 'Hero' }
        ),
        downloads_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Downloads section heading' }
        ),
        downloads: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            description: fields.text({
              label: 'Description (optional)',
              multiline: true,
            }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Speaker resources',
            itemLabel: (props) => props.fields.label.value || 'Resource',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
        body: fields.markdoc({ label: 'Bio body' }),
      },
    }),
    mediaKit: singleton({
      label: 'Media Kit',
      path: 'src/content/media-kit/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        og_image: fields.image({
          label: 'Social share image (Open Graph)',
          description:
            'Link/social preview image for this page. Leave empty to use the sitewide default.',
          directory: 'public/images/media-kit',
          publicPath: '/images/media-kit/',
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
            }),
            secondary_cta_url: fields.text({ label: 'Secondary CTA URL' }),
            contact_note: fields.text({
              label: 'Press-contact note (shown under the CTAs, optional)',
            }),
            headshot: fields.image({
              label: 'Headshot',
              directory: 'public/images/media-kit',
              publicPath: '/images/media-kit/',
            }),
            headshot_alt: fields.text({ label: 'Headshot alt text' }),
            stat_value: fields.text({
              label: 'Floating stat value (optional)',
            }),
            stat_label: fields.text({
              label: 'Floating stat label (optional)',
              multiline: true,
            }),
          },
          { label: 'Hero' }
        ),
        quick_facts: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value', multiline: true }),
          }),
          {
            label: 'Quick facts',
            itemLabel: (props) => props.fields.label.value || 'Fact',
          }
        ),
        bios_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            note: fields.text({
              label: 'Note (optional)',
              multiline: true,
            }),
          },
          { label: 'Bios section heading' }
        ),
        bios: fields.array(
          fields.object({
            length_label: fields.text({
              label: 'Length label (e.g. "Short — 50 words")',
            }),
            text: fields.text({ label: 'Bio text', multiline: true }),
          }),
          {
            label: 'Bio versions',
            itemLabel: (props) => props.fields.length_label.value || 'Bio',
          }
        ),
        headshots_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Headshots section heading' }
        ),
        headshots: fields.array(
          fields.object({
            image: fields.image({
              label: 'Headshot',
              directory: 'public/images/media-kit',
              publicPath: '/images/media-kit/',
            }),
            alt: fields.text({ label: 'Alt text' }),
            label: fields.text({ label: 'Caption / label' }),
            download_url: fields.text({
              label: 'Download / high-res URL (optional)',
              description:
                'Falls back to the image itself when left empty.',
            }),
          }),
          {
            label: 'Approved headshots',
            itemLabel: (props) => props.fields.label.value || 'Headshot',
          }
        ),
        assets_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Brand assets section heading' }
        ),
        assets: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            description: fields.text({
              label: 'Description (optional)',
              multiline: true,
            }),
            format: fields.text({
              label: 'Format chip (e.g. PDF, ZIP, JPG — optional)',
            }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Brand & press assets',
            itemLabel: (props) => props.fields.label.value || 'Asset',
          }
        ),
        topics_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Topics section heading' }
        ),
        topics: fields.array(
          fields.object({
            title: fields.text({ label: 'Topic' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: 'Speaking & media topics',
            itemLabel: (props) => props.fields.title.value || 'Topic',
          }
        ),
        press_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Featured-in section heading' }
        ),
        featured_links: fields.array(
          fields.object({
            outlet: fields.text({ label: 'Outlet / publication' }),
            title: fields.text({ label: 'Headline / segment title' }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Selected featured-in links',
            itemLabel: (props) => props.fields.outlet.value || 'Feature',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
      },
    }),
    paymentPolicy: singleton({
      label: 'Payment Policy',
      path: 'src/content/payment-policy/',
      // Restored 2026-07-31 at Lorraine's request. The page existed on
      // WordPress at this same path, was folded into a redirect during the
      // migration (CLI-204), and is her own previously published wording
      // brought back verbatim -- not newly drafted legal copy.
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Page title', defaultValue: 'Payment Policy' }),
        eyebrow: fields.text({ label: 'Hero eyebrow', defaultValue: 'Legal' }),
        effective_date_label: fields.text({
          label: 'Effective date label',
          defaultValue: 'Effective Date:',
        }),
        effective_date: fields.text({
          label: 'Effective date',
          defaultValue: 'November 6, 2023',
        }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
        }),
        body: fields.markdoc({ label: 'Policy body' }),
      },
    }),
    privacyPolicy: singleton({
      label: 'Privacy Policy',
      path: 'src/content/privacy-policy/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({
          label: 'Page title',
          defaultValue: 'Privacy Policy',
        }),
        eyebrow: fields.text({
          label: 'Hero eyebrow',
          defaultValue: 'Legal',
        }),
        effective_date_label: fields.text({
          label: 'Effective date label',
          defaultValue: 'Effective Date:',
        }),
        effective_date: fields.text({
          label: 'Effective date',
          defaultValue: 'January 1, 2026',
        }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          defaultValue:
            'Privacy Policy for lorraineklee.com, including how personal information is collected, used, and shared.',
        }),
        body: fields.markdoc({ label: 'Policy body' }),
      },
    }),
    termsPrivacyLegal: singleton({
      label: 'Terms and Conditions',
      path: 'src/content/terms-privacy-legal/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({
          label: 'Page title',
          defaultValue: 'Terms and Conditions',
        }),
        eyebrow: fields.text({
          label: 'Hero eyebrow',
          defaultValue: 'Legal',
        }),
        effective_date: fields.text({
          label: 'Effective date',
          defaultValue: 'January 1, 2026',
        }),
        description: fields.text({
          label: 'Meta description',
          multiline: true,
          defaultValue:
            'Terms and Conditions for lorraineklee.com, including permitted use, intellectual property, disclaimers, liability, and contact details.',
        }),
        body: fields.markdoc({ label: 'Terms body' }),
      },
    }),
    learn: singleton({
      label: 'Learn',
      path: 'src/content/learn/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            trust_count: fields.text({
              label: 'Hero trust-line count',
              description:
                'The bolded count in "Join 12,000+ leaders learning with Lorraine."',
              defaultValue: '12,000+',
            }),
            cta_primary_label: fields.text({
              label: 'Hero primary CTA label',
              description: 'Primary hero button (links to the #course anchor).',
              defaultValue: 'Start the free course',
            }),
            cta_secondary_label: fields.text({
              label: 'Hero secondary CTA label',
              description: 'Secondary hero button (links to the #courses anchor).',
              defaultValue: 'Browse courses',
            }),
            trust_prefix: fields.text({
              label: 'Hero trust-line prefix',
              description: 'Text before the bolded count, e.g. "Join".',
              defaultValue: 'Join',
            }),
            trust_suffix: fields.text({
              label: 'Hero trust-line suffix',
              description: 'Text after the bolded count, e.g. "leaders learning with Lorraine.".',
              defaultValue: 'leaders learning with Lorraine.',
            }),
          },
          { label: 'Hero' }
        ),
        newsletter: fields.object(
          {
            eyebrow_pill: fields.text({
              label: 'Eyebrow pill (e.g. "Free")',
              defaultValue: 'Free',
            }),
            eyebrow_label: fields.text({
              label: 'Eyebrow label',
              defaultValue: '5-Day Email Course',
            }),
            headline: fields.text({ label: 'Headline (plain)' }),
            headline_accent: fields.text({
              label: 'Headline accent (italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            bullets: fields.array(fields.text({ label: 'Bullet' }), {
              label: 'Course-day bullets',
              itemLabel: (props) => props.value || 'Bullet',
            }),
            form_eyebrow: fields.text({
              label: 'Form eyebrow',
              defaultValue: 'Start tomorrow',
            }),
            form_title: fields.text({ label: 'Form title (plain)' }),
            form_title_accent: fields.text({
              label: 'Form title accent (italic)',
            }),
            form_button_label: fields.text({
              label: 'Form button label',
              defaultValue: 'Send me Day 1',
            }),
            form_fineprint: fields.text({
              label: 'Form fineprint',
              defaultValue: 'No spam. Unsubscribe in one click.',
            }),
            success_title: fields.text({
              label: 'Success state title',
              defaultValue: "You're in.",
            }),
            success_subtitle_template: fields.text({
              label: 'Success state subtitle (use {email} placeholder)',
              defaultValue: 'Day 1 is on its way to {email}.',
            }),
            hero_card_image: fields.image({
              label: 'Hero bento card image',
              description: 'Photo shown on the newsletter card in the hero bento grid.',
              directory: 'public/images/v1/learn',
              publicPath: '/images/v1/learn/',
            }),
          },
          { label: 'Newsletter (lead block)' }
        ),
        courses_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            hero_card_image: fields.image({
              label: 'Hero bento card image',
              description: 'Photo shown on the LinkedIn Learning card in the hero bento grid.',
              directory: 'public/images/v1/learn',
              publicPath: '/images/v1/learn/',
            }),
            cta_label: fields.text({
              label: 'All-courses CTA label',
              description: 'Button under the course grid, e.g. "See all courses".',
              defaultValue: 'See all courses',
            }),
            cta_url: fields.text({
              label: 'All-courses CTA URL',
              description:
                'Where the all-courses button points. Update to the dedicated LinkedIn courses page (CLI-87) once it ships.',
            }),
            count_caption_suffix: fields.text({
              label: 'Course count caption suffix',
              description: 'Text after the course count, e.g. "on-demand courses and counting.".',
              defaultValue: 'on-demand courses and counting.',
            }),
          },
          { label: 'LinkedIn Learning courses section heading' }
        ),
        hero_bento: fields.object(
          {
            feature_pill: fields.text({
              label: 'Feature card pill',
              defaultValue: 'Free · 5-day course',
            }),
            feature_title: fields.text({
              label: 'Feature card title (plain)',
              defaultValue: 'From',
            }),
            feature_title_accent: fields.text({
              label: 'Feature card title accent (italic)',
              defaultValue: 'Invisible',
            }),
            feature_title_suffix: fields.text({
              label: 'Feature card title suffix (after the italic word)',
              description: 'Trailing plain text after the italic accent, e.g. " to Influential". Keep the leading space.',
              defaultValue: ' to Influential',
            }),
            feature_desc: fields.text({
              label: 'Feature card description',
              multiline: true,
              defaultValue:
                'A free 5-day email course that helps you articulate your value and get visible to decision-makers.',
            }),
            feature_cta_label: fields.text({
              label: 'Feature card CTA label',
              defaultValue: 'Start the course',
            }),
            feature_image_alt: fields.text({
              label: 'Feature card image alt text',
              defaultValue: 'Lorraine K. Lee working at her laptop',
            }),
            stat_num: fields.text({
              label: 'Stat card number',
              defaultValue: '250K',
            }),
            stat_suffix: fields.text({
              label: 'Stat card number suffix',
              defaultValue: '+',
            }),
            stat_label: fields.text({
              label: 'Stat card label',
              defaultValue: 'Students taught on LinkedIn Learning',
            }),
            browse_card_cta_label: fields.text({
              label: 'Browse-all card CTA label',
              defaultValue: 'Browse all',
            }),
            resource_eyebrow: fields.text({
              label: 'Resource card eyebrow',
              description: 'Eyebrow shown on each LinkedIn resource bento card.',
              defaultValue: 'Free resource',
            }),
          },
          { label: 'Hero bento cards' }
        ),
        // The course grid renders from the shared `courses` collection
        // (reader.collections.courses) so the Learn grid and the /courses hub
        // stay in sync — there is no per-page course list on this singleton.
        linkedin_resources_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'LinkedIn resources section heading' }
        ),
        linkedin_resources: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            eyebrow: fields.text({
              label: 'Card eyebrow (optional)',
              description:
                'Overrides the shared "Resource card eyebrow" for this card only. Use it when a card is not a free resource, e.g. the paid LinkedIn guide.',
            }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Get the pack',
            }),
            url: fields.text({
              label: 'URL (external links open in a new tab)',
            }),
            anchor_id: fields.text({
              label: 'Anchor ID (optional)',
              description:
                'Stable in-page anchor for nav deep-links, e.g. "linkedin-guide" so /learn#linkedin-guide scrolls to this card.',
            }),
            image: fields.image({
              label: 'Card image',
              description: 'Cover/preview shown on the hero bento card and resource card.',
              directory: 'public/images/v1/learn',
              publicPath: '/images/v1/learn/',
            }),
          }),
          {
            label: 'LinkedIn resources / lead magnets',
            itemLabel: (props) => props.fields.label.value || 'Resource',
          }
        ),
      },
    }),
    ultimateLinkedinGuide: singleton({
      label: 'Ultimate LinkedIn Guide',
      path: 'src/content/ultimate-linkedin-guide/',
      // CLI-214: the guide page was dropped from the nav in May and ended up in
      // the redirect map, so /ultimate-linkedin-guide 301'd to /learn and the
      // product had no on-site description or buy path. Copy here is carried
      // over from the original WordPress page (trimmed, not rewritten). The buy
      // CTA points at the external Topmate listing, so it lives in a field
      // rather than the template -- if Lorraine moves the product, that is a
      // content edit, not a code change.
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({
          label: 'SEO description',
          multiline: true,
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline (plain)' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            price: fields.text({
              label: 'Price',
              description:
                'Shown next to the buy button. Keep this in step with the Topmate listing.',
              defaultValue: '$29',
            }),
            price_note: fields.text({
              label: 'Price note',
              defaultValue: 'One-time payment · Instant download',
            }),
            cta_label: fields.text({
              label: 'Buy CTA label',
              defaultValue: 'Get the guide',
            }),
            cta_url: fields.text({
              label: 'Buy CTA URL',
              description:
                'Where the buy button sends people. Currently the Topmate listing.',
              defaultValue: 'https://topmate.io/lorraineklee/150949',
            }),
            preview_label: fields.text({
              label: 'Free-preview link label',
              description: 'Optional. Leave empty to hide the free-preview link.',
              defaultValue: 'Not ready to buy? Grab the first part free',
            }),
            preview_url: fields.text({
              label: 'Free-preview link URL',
              defaultValue: 'https://lorraineklee.kit.com/ultimate-guide-preview',
            }),
            cover_image: fields.image({
              label: 'Guide cover image',
              directory: 'public/images/v1/ultimate-linkedin-guide',
              publicPath: '/images/v1/ultimate-linkedin-guide/',
            }),
            cover_alt: fields.text({ label: 'Guide cover alt text' }),
          },
          { label: 'Hero' }
        ),
        audience_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
          },
          { label: '"This guide is for you if" heading' }
        ),
        audience_points: fields.array(fields.text({ label: 'Point' }), {
          label: '"This guide is for you if" points',
          itemLabel: (props) => props.value || 'Point',
        }),
        about: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
            body: fields.text({
              label: 'Body (one paragraph per blank line)',
              multiline: true,
            }),
          },
          { label: 'About the guide' }
        ),
        included_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
          },
          { label: '"What you get" heading' }
        ),
        included_points: fields.array(fields.text({ label: 'Point' }), {
          label: '"What you get" points',
          itemLabel: (props) => props.value || 'Point',
        }),
        sections_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
          },
          { label: '"What you\'ll learn" heading' }
        ),
        sections: fields.array(
          fields.object({
            title: fields.text({ label: 'Section title' }),
            description: fields.text({
              label: 'Section description',
              multiline: true,
            }),
          }),
          {
            label: "What you'll learn (guide sections)",
            itemLabel: (props) => props.fields.title.value || 'Section',
          }
        ),
        testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
          },
          { label: 'Testimonials heading' }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({
              label: 'Quote (quotation marks added automatically)',
              multiline: true,
            }),
            author: fields.text({ label: 'Author' }),
            title: fields.text({ label: 'Author title / company' }),
          }),
          {
            label: 'Testimonials',
            itemLabel: (props) => props.fields.author.value || 'Testimonial',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({ label: 'Heading accent (italic)' }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Get the guide',
            }),
            cta_url: fields.text({
              label: 'CTA URL',
              defaultValue: 'https://topmate.io/lorraineklee/150949',
            }),
          },
          { label: 'Closing CTA' }
        ),
      },
    }),
    book: singleton({
      label: 'Book',
      path: 'src/content/book/',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ label: 'Book title' }),
        subtitle: fields.text({ label: 'Subtitle' }),
        og_image: fields.image({
          label: 'Social share image (Open Graph)',
          description:
            'Link/social preview image for this page. Leave empty to use the sitewide default.',
          directory: 'public/images/book',
          publicPath: '/images/book/',
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            tagline: fields.text({
              label: 'Tagline paragraph',
              multiline: true,
            }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
            }),
            secondary_cta_url: fields.text({ label: 'Secondary CTA URL' }),
          },
          { label: 'Hero' }
        ),
        book_cover: fields.image({
          label: 'Book cover',
          directory: 'public/images/book',
          publicPath: '/images/book/',
        }),
        cover_badge_top: fields.text({ label: 'Cover badge (top)' }),
        cover_badge_bottom: fields.text({ label: 'Cover badge (bottom)' }),
        accolades: fields.array(
          fields.object({
            text: fields.text({ label: 'Text' }),
            emphasized: fields.checkbox({
              label: 'Emphasized (accent colour)',
              defaultValue: false,
            }),
          }),
          {
            label: 'Hero accolades line',
            itemLabel: (props) => props.fields.text.value || 'Accolade',
          }
        ),
        description_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Description section heading' }
        ),
        retailers_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            format_note: fields.text({
              label: 'Format note (below retailers)',
            }),
          },
          { label: 'Retailers section' }
        ),
        retailer_links_individual: fields.array(
          fields.object({
            name: fields.text({ label: 'Retailer name' }),
            url: fields.url({ label: 'URL' }),
            brand_color: fields.text({
              label: 'Brand color (hex, optional, used on hover)',
              description:
                'e.g. #FF9900 for Amazon. White text is used over this color on hover.',
            }),
          }),
          {
            label: 'Retailer links - individual buys',
            itemLabel: (props) => props.fields.name.value || 'Retailer',
          }
        ),
        retailer_links_bulk: fields.array(
          fields.object({
            name: fields.text({ label: 'Retailer name' }),
            url: fields.url({ label: 'URL' }),
            brand_color: fields.text({
              label: 'Brand color (hex, optional, used on hover)',
              description:
                'e.g. #FF9900 for Amazon. White text is used over this color on hover.',
            }),
          }),
          {
            label: 'Retailer links - bulk buys',
            itemLabel: (props) => props.fields.name.value || 'Retailer',
          }
        ),
        retailers_individual_label: fields.text({
          label: 'Individual-buys sub-heading',
          defaultValue: 'For yourself',
        }),
        retailers_bulk_label: fields.text({
          label: 'Bulk-buys sub-heading',
          defaultValue: 'Buying for your team or org?',
        }),
        community_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain text)' }),
            heading_accent: fields.text({
              label: 'Heading accent (yellow brush-stroke)',
            }),
            collage_image: fields.image({
              label: 'Reader collage image',
              directory: 'public/images/book',
              publicPath: '/images/book/',
            }),
            alt_text: fields.text({ label: 'Image alt text' }),
          },
          { label: 'Community / readers collage' }
        ),
        featured_in_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
          },
          { label: 'Featured In section heading' }
        ),
        featured_in_logos: fields.array(
          fields.object({
            name: fields.text({ label: 'Outlet name' }),
            image: fields.image({
              label: 'Logo image (SVG preferred)',
              directory: 'public/images/book/logos',
              publicPath: '/images/book/logos/',
            }),
            url: fields.url({ label: 'Article URL (optional)' }),
          }),
          {
            label: 'Featured In logos',
            itemLabel: (props) => props.fields.name.value || 'Logo',
          }
        ),
        reviews_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic, the book title)',
            }),
          },
          { label: 'Reader reviews section heading' }
        ),
        amazon_rating: fields.object(
          {
            stars: fields.text({
              label: 'Star value (e.g. 4.8)',
            }),
            count_label: fields.text({
              label: 'Count label (e.g. "161 global ratings")',
            }),
            url: fields.url({ label: 'Amazon product URL' }),
            link_label: fields.text({
              label: 'Amazon link label (e.g. "See all on Amazon"; arrow added automatically)',
            }),
          },
          { label: 'Amazon rating snapshot' }
        ),
        reader_reviews: fields.array(
          fields.object({
            stars: fields.integer({
              label: 'Star count',
              defaultValue: 5,
            }),
            quote: fields.text({ label: 'Quote', multiline: true }),
            highlighted_phrases: fields.array(
              fields.text({ label: 'Phrase' }),
              {
                label: 'Highlighted phrases (rendered in blue inside quote)',
                itemLabel: (props) => props.value || 'Phrase',
              }
            ),
          }),
          {
            label: 'Reader reviews (3-col grid)',
            itemLabel: (props) =>
              (props.fields.quote.value || 'Review').slice(0, 60),
          }
        ),
        awards_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
          },
          { label: 'Awards section heading' }
        ),
        awards: fields.array(
          fields.object({
            name: fields.text({ label: 'Award name (e.g. The BookFest® Awards)' }),
            result: fields.text({ label: 'Result (e.g. 2nd Place, Winner)' }),
            category: fields.text({
              label: 'Category',
              multiline: true,
            }),
            badge_image: fields.image({
              label: 'Badge image',
              directory: 'public/images/book/awards',
              publicPath: '/images/book/awards/',
            }),
            badge_alt: fields.text({ label: 'Badge alt text' }),
            url: fields.url({ label: 'Award URL (optional)' }),
          }),
          {
            label: 'Awards',
            itemLabel: (props) => props.fields.name.value || 'Award',
          }
        ),
        endorsements_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Endorsements section heading' }
        ),
        endorsements: fields.array(
          fields.object({
            headshot: fields.image({
              label: 'Headshot (square works best)',
              description: 'Shown as the circular headshot on the endorsement card.',
              directory: 'public/images/book/endorsements/headshots',
              publicPath: '/images/book/endorsements/headshots/',
            }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role / organization' }),
            quote_alt: fields.text({
              label: 'Quote',
              multiline: true,
            }),
            logos: fields.array(
              fields.object({
                image: fields.image({
                  label: 'Logo / book cover',
                  directory: 'public/images/book/endorsements/logos',
                  publicPath: '/images/book/endorsements/logos/',
                }),
                alt: fields.text({ label: 'Alt text' }),
              }),
              {
                label: 'Company logos / book covers',
                itemLabel: (props) => props.fields.alt.value || 'Logo',
              }
            ),
          }),
          {
            label: 'Endorsements (carousel)',
            itemLabel: (props) => props.fields.name.value || 'Endorsement',
          }
        ),
        preview: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Sample chapter callout' }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
        description: fields.markdoc({ label: 'Description' }),
      },
    }),
    coursesPage: singleton({
      label: 'Courses Page',
      path: 'src/content/courses-page/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'LinkedIn Learning',
            }),
            headline: fields.text({ label: 'Headline (plain start)' }),
            headline_accent: fields.text({
              label: 'Headline accent (italic)',
            }),
            headline_tail: fields.text({
              label: 'Headline tail (plain, after the accent)',
              description:
                'Optional plain text rendered after the italic accent, so the emphasis can sit mid-sentence. Leave empty to end the headline on the accent.',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'LinkedIn CTA label' }),
            primary_cta_url: fields.text({ label: 'LinkedIn CTA URL' }),
            image: fields.image({
              label: 'Hero photo (optional)',
              description:
                'Portrait/cutout shown in the hero frame. Leave empty to render the hero text full-width.',
              directory: 'public/images/v1/courses',
              publicPath: '/images/v1/courses/',
            }),
            image_alt: fields.text({ label: 'Hero photo alt text' }),
            credential_pill: fields.text({
              label: 'Credential pill',
              description:
                'Small pill over the hero photo, e.g. "Top-rated LinkedIn Learning instructor".',
              defaultValue: 'Top-rated LinkedIn Learning instructor',
            }),
          },
          { label: 'Hero' }
        ),
        rating: fields.object(
          {
            value: fields.text({ label: 'Rating value (e.g. 4.7)' }),
            scale: fields.text({
              label: 'Rating scale suffix (e.g. /5)',
              defaultValue: '/5',
            }),
            value_label: fields.text({
              label: 'Rating caption (e.g. Average course rating)',
              defaultValue: 'Average course rating',
            }),
            students_value: fields.text({
              label: 'Students value (e.g. 250,000+)',
            }),
            students_label: fields.text({
              label: 'Students caption (e.g. Students taught)',
              defaultValue: 'Students taught',
            }),
            note: fields.text({
              label: 'Note (e.g. More courses coming soon)',
            }),
            subscribe_label: fields.text({
              label: 'Subscribe button label',
              defaultValue: 'Subscribe to my newsletter to get the latest',
            }),
            subscribe_url: fields.text({
              label: 'Subscribe button URL',
              defaultValue: '/learn',
            }),
          },
          { label: 'Rating / social proof' }
        ),
        filter_bar: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'Find the right course',
            }),
            heading: fields.text({
              label: 'Heading',
              defaultValue: 'Which course is right for you?',
            }),
          },
          { label: 'Category filter bar labels' }
        ),
        category_order: fields.array(
          fields.select({
            label: 'Category',
            options: COURSE_CATEGORY_OPTIONS,
            defaultValue: 'Communication',
          }),
          {
            label: 'Category order',
            description:
              'Order of the category filter pills and grouped grid. List each course category once, in display order. Values must match the categories on the LinkedIn Courses entries; any category left off is appended in the default order rather than hidden. Leave empty to use the default order.',
            itemLabel: (props) => props.value || 'Category',
          }
        ),
        why_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            points: fields.array(
              fields.object({
                title: fields.text({ label: 'Outcome title' }),
                description: fields.text({
                  label: 'Description',
                  multiline: true,
                }),
              }),
              {
                label: 'Outcome points',
                itemLabel: (props) => props.fields.title.value || 'Outcome',
              }
            ),
          },
          { label: 'Why these courses (mid-page conversion band)' }
        ),
        // Student reviews come from the shared `testimonials` collection
        // (CLI-118) via getTestimonials({ placement: 'courses' }) and render in
        // a compact proof strip; this page has no separate testimonials heading.
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA (free course)' }
        ),

        labels: fields.object(
          {
            explore_courses: fields.text({
              label: 'Hero "explore courses" button',
              defaultValue: 'Explore courses',
            }),
            featured_badge: fields.text({
              label: 'Featured course badge',
              defaultValue: "Lorraine's pick · Start here",
            }),
            free_with_linkedin: fields.text({
              label: 'Featured "free with LinkedIn Learning" tag',
              defaultValue: 'Free with LinkedIn Learning',
            }),
            start_this_course: fields.text({
              label: 'Featured "start this course" button',
              defaultValue: 'Start this course',
            }),
            see_whats_inside: fields.text({
              label: 'Featured "see what\'s inside" button',
              defaultValue: "See what's inside",
            }),
            all_courses_filter: fields.text({
              label: '"All courses" filter pill',
              defaultValue: 'All courses',
            }),
            view_on_linkedin: fields.text({
              label: 'Grid "view on LinkedIn Learning" link',
              defaultValue: 'View on LinkedIn Learning',
            }),
            view_course: fields.text({
              label: 'Course card "view course" link',
              defaultValue: 'View course',
            }),
            empty_state: fields.text({
              label: 'Empty category message',
              defaultValue:
                'No courses in this category yet. New ones are added regularly.',
              multiline: true,
            }),
            see_all_courses: fields.text({
              label: 'Final CTA "see all courses" button',
              defaultValue: 'See all courses on LinkedIn Learning',
            }),
            detail_format_prefix: fields.text({
              label: 'Course detail: format prefix',
              description:
                'Shown before the category on an individual course page, e.g. "LinkedIn Learning · Communication".',
              defaultValue: 'LinkedIn Learning',
            }),
            detail_watch_cta: fields.text({
              label: 'Course detail: watch CTA',
              defaultValue: 'Watch on LinkedIn Learning',
            }),
            detail_trust_line: fields.text({
              label: 'Course detail: trust line',
              defaultValue:
                'Free to watch with a LinkedIn Learning subscription.',
            }),
            detail_back_label: fields.text({
              label: 'Course detail: back-link label',
              description: 'Top "all courses" link on an individual course page.',
              defaultValue: 'All courses',
            }),
            detail_back_url: fields.text({
              label: 'Course detail: back-link URL',
              description:
                'Route the "all courses" links point to (default /courses).',
              defaultValue: '/courses',
            }),
            detail_more_label: fields.text({
              label: 'Course detail: "see other courses" link',
              defaultValue: 'See other courses',
            }),
            grid_count_all: fields.text({
              label: 'Grid count caption: all categories',
              description:
                'Caption after the live course count when no filter is active.',
              defaultValue: 'courses · all categories',
            }),
            grid_count_filtered_prefix: fields.text({
              label: 'Grid count caption: filtered (prefix)',
              description:
                'Caption after the live count when a category is selected. The category name is appended in italics.',
              defaultValue: 'courses in ',
            }),
          },
          {
            label: 'Button & meta labels',
            description:
              'Reusable button, tag, and meta strings across the courses hub and individual course pages.',
          }
        ),
      },
    }),
    interviewsPage: singleton({
      label: 'Interviews Page',
      path: 'src/content/interviews-page/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'Guest Interviews',
            }),
            headline: fields.text({ label: 'Headline (plain)' }),
            headline_accent: fields.text({
              label: 'Headline accent (italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            cta_label: fields.text({ label: 'Primary CTA label' }),
            cta_url: fields.text({ label: 'Primary CTA URL' }),
          },
          { label: 'Hero' }
        ),
        labels: fields.object(
          {
            watch_here: fields.text({
              label: 'Guest card "watch it here" link label',
              defaultValue: 'Watch it here',
            }),
          },
          {
            label: 'UI labels',
            description:
              'Small reusable button / link microcopy used across the interviews page.',
          }
        ),
        guest_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            youtube_cta_label: fields.text({
              label: 'YouTube button label',
              description:
                'Button shown under the guest appearances grid, linking to the YouTube channel. Leave empty to hide the button.',
              defaultValue: 'More on YouTube',
            }),
            youtube_cta_url: fields.text({
              label: 'YouTube button URL',
              defaultValue: 'https://www.youtube.com/c/lorraineklee',
            }),
          },
          { label: 'Guest appearances section heading' }
        ),
        podcast_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            spotify_playlist_id: fields.text({
              label: 'Spotify playlist ID',
              description:
                'The playlist ID from the Spotify share URL, e.g. "3ttrdXR9hP0Nx1tncWtx6T" from open.spotify.com/playlist/3ttrdXR9hP0Nx1tncWtx6T. Leave empty to hide the embed.',
            }),
          },
          {
            label: 'Podcast (Spotify) section',
            description:
              'Embeds the "Guest Podcast Interviews" Spotify playlist below the guest appearances. Leave the playlist ID empty to hide this section.',
          }
        ),
        guest_appearances: fields.array(
          fields.object({
            show: fields.text({
              label: 'Show / host',
              description: 'E.g. "Think Fast Talk Smart" or "LinkedIn News".',
            }),
            title: fields.text({ label: 'Episode / segment title' }),
            youtube_id: fields.text({
              label: 'YouTube video ID (optional)',
              description:
                'The 11-character ID from the watch URL, e.g. "MbsUmSfdcrQ" from youtu.be/MbsUmSfdcrQ. Used for the thumbnail and watch link.',
            }),
            url: fields.text({
              label: 'Watch URL (optional)',
              description:
                'External link used when the appearance is not on YouTube (e.g. a LinkedIn event or post). Falls back to the YouTube link when a video ID is set.',
            }),
            description: fields.text({
              label: 'Description (optional)',
              description: 'Optional one-liner shown under the title on the card.',
              multiline: true,
            }),
          }),
          {
            label: 'Guest appearances (Lorraine as guest)',
            itemLabel: (props) =>
              props.fields.show.value || props.fields.title.value || 'Appearance',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
      },
    }),
    contact: singleton({
      label: 'Contact',
      path: 'src/content/contact/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Contact' }),
        headline: fields.text({ label: 'Headline' }),
        headline_accent: fields.text({
          label: 'Headline accent (italic)',
          description: 'The italicised end of the headline, e.g. "touch."',
        }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        brand_deals_label: fields.text({
          label: 'Brand deals row label',
          defaultValue: 'Brand deals and partnerships',
        }),
        press_label: fields.text({
          label: 'Press row label',
          defaultValue: 'Press',
        }),
        follow_label: fields.text({
          label: 'Social links heading',
          defaultValue: 'Follow along',
        }),
        press_email: fields.text({ label: 'Press email' }),
        brand_deals_email: fields.text({
          label: 'Brand deals and partnerships email',
        }),
        typeform_id: fields.text({
          label: 'Typeform form ID',
          description:
            'The 8-character ID from the form\'s share URL, e.g. "PJJPZ9iJ" from https://<account>.typeform.com/to/PJJPZ9iJ.',
        }),
        social_links: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform' }),
            url: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Social links',
            itemLabel: (props) => props.fields.platform.value || 'Link',
          }
        ),
      },
    }),
    subscribe: singleton({
      label: 'Subscribe (Newsletter)',
      path: 'src/content/subscribe/',
      // Slim newsletter signup landing page at /subscribe/ (CLI-122). The
      // Kit/ConvertKit form ID lives in `kit_form_id` so copy edits cannot
      // break email capture. Leave it empty to render a clearly-labeled
      // placeholder until the production form ID is supplied.
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        eyebrow: fields.text({
          label: 'Eyebrow',
          defaultValue: 'Weekly Newsletter',
        }),
        headline: fields.text({ label: 'Headline' }),
        headline_accent: fields.text({
          label: 'Headline accent (italic)',
          description: 'The italicised end of the headline, e.g. "Career Bites".',
        }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        benefits: fields.array(fields.text({ label: 'Benefit' }), {
          label: 'What subscribers get',
          itemLabel: (props) => props.value || 'Benefit',
        }),
        kit_form_id: fields.text({
          label: 'Kit / ConvertKit form ID',
          description:
            'Numeric Kit form ID for the newsletter signup (e.g. "8913437"). Leave empty to show a placeholder until the production form is confirmed.',
        }),
        form_button_label: fields.text({
          label: 'Form button label',
          defaultValue: 'Subscribe',
        }),
        name_placeholder: fields.text({
          label: 'Form first-name placeholder',
          defaultValue: 'First Name',
        }),
        email_placeholder: fields.text({
          label: 'Form email placeholder',
          defaultValue: 'Enter your best email',
        }),
        fineprint: fields.text({
          label: 'Form fineprint',
          defaultValue: 'No spam. Unsubscribe in one click.',
        }),
      },
    }),
    consulting: singleton({
      label: 'Consulting',
      path: 'src/content/consulting/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
            }),
            secondary_cta_url: fields.text({
              label: 'Secondary CTA URL',
              description: 'Internal route, anchor (e.g. #services), or external URL.',
            }),
          },
          { label: 'Hero' }
        ),
        services_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Services section heading' }
        ),
        services: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: 'Services',
            itemLabel: (props) => props.fields.title.value || 'Service',
          }
        ),
        testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Testimonials section heading' }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            author: fields.text({ label: 'Author' }),
            title: fields.text({ label: 'Author title' }),
          }),
          {
            label: 'Testimonials',
            itemLabel: (props) => props.fields.author.value || 'Testimonial',
          }
        ),
        audience_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Audience section heading' }
        ),
        audience_points: fields.array(fields.text({ label: 'Point' }), {
          label: 'Audience points',
          itemLabel: (props) => props.value || 'Point',
        }),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
      },
    }),
    bookResources: singleton({
      label: 'Book Resources (Kit)',
      path: 'src/content/book-resources/',
      // The landing page unforgettablepresencekit.com forwards to. It lived at
      // /book-resources on WordPress and was folded into /book during the
      // migration, which left that domain pointing at the book page instead of
      // the kit. Rebuilt here at the original path so the existing GoDaddy
      // forward keeps working untouched.
      //
      // NOTE: the resources themselves are delivered by the Kit (ConvertKit)
      // form, not from this site. `kit_form_uid` is the form's id -- changing it
      // changes which list subscribers land on and which resources they are
      // sent, so only change it to another live Kit form.
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            badge_image: fields.image({
              label: 'Award badge image',
              directory: 'public/images/book-resources',
              publicPath: '/images/book-resources/',
            }),
            badge_alt: fields.text({ label: 'Award badge alt text' }),
          },
          { label: 'Hero' }
        ),
        video_section: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            youtube_url: fields.text({
              label: 'YouTube URL',
              description: 'Any share form (youtu.be/…, watch?v=…) — converted to an embed automatically.',
            }),
            overlay_image: fields.image({
              label: 'Video thumbnail',
              directory: 'public/images/book-resources',
              publicPath: '/images/book-resources/',
            }),
          },
          { label: 'Message from Lorraine' }
        ),
        resources_section: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            preview_image: fields.image({
              label: 'Resources preview image',
              directory: 'public/images/book-resources',
              publicPath: '/images/book-resources/',
            }),
            kit_form_id: fields.text({
              label: 'Kit form ID',
              description:
                'The numeric id of the Kit form that delivers the resources, e.g. 7948678. Find it in Kit under the form, or in its embed code as data-sv-form. Changing this changes which list people join and which resources Kit sends them.',
            }),
          },
          { label: 'Resources + signup' }
        ),
        resources: fields.array(fields.text({ label: 'Resource' }), {
          label: "What's in the kit",
          itemLabel: (props) => props.value || 'Resource',
        }),
        author_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            book_title: fields.text({ label: 'Book title' }),
            book_subtitle: fields.text({ label: 'Book subtitle' }),
            bio: fields.text({ label: 'Bio', multiline: true }),
            photo: fields.image({
              label: 'Author photo',
              directory: 'public/images/book-resources',
              publicPath: '/images/book-resources/',
            }),
          },
          { label: 'About the author' }
        ),
        work_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
          },
          { label: 'Work with me heading' }
        ),
        work_cards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            cta_label: fields.text({ label: 'Button label' }),
            cta_url: fields.text({ label: 'Button URL' }),
            image: fields.image({
              label: 'Card image',
              directory: 'public/images/book-resources',
              publicPath: '/images/book-resources/',
            }),
          }),
          {
            label: 'Work with me cards',
            itemLabel: (props) => props.fields.title.value || 'Card',
          }
        ),
      },
    }),
    freeCourse: singleton({
      label: 'Free Course (Funnel)',
      path: 'src/content/free-course/',
      // NOTE: The funnel form mechanics (Kit/ConvertKit form IDs, POST action,
      // and the thank-you redirect) are intentionally hard-wired in
      // src/pages/from-invisible-to-influential.astro and are NOT exposed here,
      // so editing copy can never break the email-capture funnel.
      // Bullet/support fields accept inline **bold** markers (see
      // src/lib/emphasis.ts) so verbatim emphasis survives CMS edits.
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({
          label: 'SEO description',
          multiline: true,
        }),

        thankyou_seo_title: fields.text({
          label: 'Thank-you page SEO title',
          description:
            'Title for the funnel confirmation page (/from-invisible-to-influential-thank-you). Separate from the landing-page SEO title above so the two do not collide.',
        }),
        thankyou_seo_description: fields.text({
          label: 'Thank-you page SEO description',
          description:
            'Meta description for the funnel confirmation page, separate from the landing-page SEO description above.',
          multiline: true,
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline', multiline: true }),
            headline_suffix: fields.text({
              label: 'Headline suffix (e.g. "In Just 20 Minutes a Day")',
            }),
            support: fields.text({
              label: 'Supporting line (supports **bold**)',
              multiline: true,
            }),
            image_desktop: fields.image({
              label: 'Hero image (desktop)',
              directory: 'public/images/free-course',
              publicPath: '/images/free-course/',
            }),
            image_mobile: fields.image({
              label: 'Hero image (mobile)',
              directory: 'public/images/free-course',
              publicPath: '/images/free-course/',
            }),
            image_alt: fields.text({ label: 'Hero image alt text' }),
            name_placeholder: fields.text({
              label: 'Form first-name placeholder',
              defaultValue: 'First Name',
            }),
            email_placeholder: fields.text({
              label: 'Form email placeholder',
              defaultValue: 'Enter your best email',
            }),
            form_button_label: fields.text({
              label: 'Top form button label',
              defaultValue: 'Send Me the Course',
            }),
            stat_value: fields.text({
              label: 'Hero stat value (e.g. "250k+")',
              defaultValue: '250k+',
            }),
            stat_label: fields.text({
              label: 'Hero stat label (one line per row)',
              multiline: true,
            }),
            opt_in_eyebrow: fields.text({
              label: 'Opt-in band eyebrow',
              defaultValue: 'Free 5-day email course',
            }),
            opt_in_title: fields.text({
              label: 'Opt-in band title (plain part)',
              defaultValue: 'Send me Day 1,',
            }),
            opt_in_title_accent: fields.text({
              label: 'Opt-in band title accent (shown highlighted/italic)',
              defaultValue: 'free.',
            }),
            fineprint: fields.text({
              label: 'Opt-in fineprint',
              defaultValue: 'No spam. Unsubscribe anytime.',
            }),
          },
          { label: 'Hero' }
        ),
        problem: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            bullets: fields.array(
              fields.text({ label: 'Bullet (supports **bold**)' }),
              {
                label: 'Problem bullets',
                itemLabel: (props) => props.value || 'Bullet',
              }
            ),
          },
          { label: 'Does this sound like you?' }
        ),
        roadmap: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading_lead: fields.text({
              label: 'Heading (plain lead-in)',
            }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            learn_label: fields.text({
              label: 'Day-card "You\'ll learn" label',
              defaultValue: "You'll learn :",
            }),
            image: fields.image({
              label: 'Roadmap cut-out photo',
              directory: 'public/images/free-course',
              publicPath: '/images/free-course/',
            }),
            image_alt: fields.text({ label: 'Roadmap photo alt text' }),
          },
          { label: '5-day roadmap heading' }
        ),
        days: fields.array(
          fields.object({
            day_label: fields.text({ label: 'Day label (e.g. "Day 1")' }),
            title: fields.text({ label: 'Title' }),
            intro: fields.text({ label: 'Intro line', multiline: true }),
            bullets: fields.array(
              fields.text({ label: 'Bullet (supports **bold**)' }),
              {
                label: '"You\'ll learn" bullets',
                itemLabel: (props) => props.value || 'Bullet',
              }
            ),
          }),
          {
            label: 'Roadmap days',
            itemLabel: (props) =>
              `${props.fields.day_label.value || 'Day'} — ${
                props.fields.title.value || ''
              }`,
          }
        ),
        trust: fields.object(
          {
            heading: fields.text({
              label: 'Heading (==text== renders highlighted)',
            }),
            items: fields.array(
              fields.object({
                icon: fields.image({
                  label: 'Icon',
                  directory: 'public/images/free-course/trust',
                  publicPath: '/images/free-course/trust/',
                }),
                text: fields.text({
                  label: 'Text (bold lead-in **...** becomes the card heading)',
                  multiline: true,
                }),
              }),
              {
                label: 'Credibility cards',
                itemLabel: (props) => props.fields.text.value || 'Card',
              }
            ),
          },
          { label: 'Why trust me?' }
        ),
        different: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            not_items: fields.array(
              fields.text({ label: 'Item (supports **bold**)' }),
              {
                label: '"This is NOT" items',
                itemLabel: (props) => props.value || 'Item',
              }
            ),
            is_items: fields.array(
              fields.text({ label: 'Item (supports **bold**)' }),
              {
                label: '"This IS" items',
                itemLabel: (props) => props.value || 'Item',
              }
            ),
          },
          { label: "Why this isn't like every other course" }
        ),
        final: fields.object(
          {
            heading: fields.text({
              label: 'Heading (==text== shown as accent)',
            }),
            lede: fields.text({
              label: 'Supporting lede paragraph',
              multiline: true,
            }),
            opt_in_eyebrow: fields.text({
              label: 'Opt-in eyebrow',
              defaultValue: 'Start day 1 today',
            }),
            opt_in_title: fields.text({
              label: 'Opt-in title',
              defaultValue: 'Where should I send the course?',
            }),
            fineprint: fields.text({
              label: 'Opt-in fineprint',
              defaultValue: 'No spam. Unsubscribe anytime.',
            }),
            form_button_label: fields.text({
              label: 'Bottom form button label',
              defaultValue: "Let's Do This",
            }),
          },
          { label: 'Final CTA' }
        ),
        thank_you: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            intro: fields.text({ label: 'Intro line' }),
            headline: fields.text({ label: 'Headline', multiline: true }),
            closing: fields.text({ label: 'Closing line' }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/free-course',
              publicPath: '/images/free-course/',
            }),
            image_alt: fields.text({ label: 'Image alt text' }),
          },
          { label: 'Thank-you page' }
        ),
      },
    }),
    testimonialsPage: singleton({
      label: 'Testimonials Page',
      path: 'src/content/testimonials-page/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),
        seo_description: fields.text({
          label: 'SEO description',
          multiline: true,
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'Testimonials',
            }),
            headline: fields.text({
              label: 'Headline',
              defaultValue: "Don't just take her word for it.",
            }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
              defaultValue: 'Hear it from them.',
            }),
            lead: fields.text({
              label: 'Lead paragraph',
              multiline: true,
              description:
                'Write {count} where the live testimonial count should appear.',
              defaultValue:
                '{count} testimonials from the clients who book her, the audiences who show up, and the students who keep coming back to her LinkedIn Learning courses.',
            }),
          },
          { label: 'Hero' }
        ),
        section_headings: fields.object(
          {
            clients: fields.object(
              {
                eyebrow: fields.text({
                  label: 'Eyebrow',
                  defaultValue: 'Clients & organizers',
                }),
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'What event hosts say',
                }),
              },
              { label: 'Clients & organizers group' }
            ),
            attendees: fields.object(
              {
                eyebrow: fields.text({
                  label: 'Eyebrow',
                  defaultValue: 'Attendees',
                }),
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'What audiences say',
                }),
              },
              { label: 'Event attendees group' }
            ),
            students: fields.object(
              {
                eyebrow: fields.text({
                  label: 'Eyebrow',
                  defaultValue: 'LinkedIn Learning',
                }),
                heading: fields.text({
                  label: 'Heading',
                  defaultValue: 'What students say',
                }),
              },
              { label: 'Course students group' }
            ),
          },
          {
            label: 'Section headings',
            description:
              'Eyebrow + heading for each testimonial group on the Testimonials page.',
          }
        ),
      },
    }),

    featuredIn: singleton({
      label: 'Featured In',
      path: 'src/content/featured-in/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({ label: 'SEO description', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
            secondary_cta_label: fields.text({
              label: 'Secondary CTA label',
            }),
            secondary_cta_url: fields.text({
              label: 'Secondary CTA URL',
              description: 'Internal route, anchor (e.g. #appearances), or external URL.',
            }),
          },
          { label: 'Hero' }
        ),
        highlights_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            cta_label: fields.text({
              label: 'Jump-to-full-list CTA label',
              description:
                'Button below the highlight cards that scrolls down to the "Everywhere else" section. Leave blank to hide it.',
            }),
          },
          {
            label: 'Highlights section heading',
            description:
              'Heading above the larger cards for appearances flagged "Feature at the top".',
          }
        ),
        appearances_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            empty_state: fields.text({
              label: 'Empty state',
              description:
                'Shown in place of the grid when there are no non-highlighted appearances to list.',
            }),
          },
          {
            label: 'All appearances section heading',
            description:
              'Heading above the full grid that renders the "Featured Appearances" collection.',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
        cta_label_defaults: fields.array(
          fields.object({
            type: fields.select({
              label: 'Appearance type',
              options: APPEARANCE_TYPE_OPTIONS,
              defaultValue: 'Article',
            }),
            label: fields.text({ label: 'Default CTA label' }),
          }),
          {
            label: 'Default CTA labels by type',
            description:
              'Default "read / listen / watch" CTA label per appearance type. Overrides the built-in defaults; an individual appearance can still override its own via its "CTA label" field. Types without an entry keep the built-in default.',
            itemLabel: (props) =>
              `${props.fields.type.value || 'Type'} → ${props.fields.label.value || ''}`,
          }
        ),
      },
    }),
    thoughtLeadership: singleton({
      label: 'Thought Leadership',
      path: 'src/content/thought-leadership/',
      schema: {
        seo_title: fields.text({ label: 'SEO title' }),

        seo_description: fields.text({
          label: 'SEO description (Thought Leadership page)',
          multiline: true,
        }),
        articles_seo_title: fields.text({
          label: 'SEO title (Authored Articles page)',
        }),
        articles_seo_description: fields.text({
          label: 'SEO description (Authored Articles page)',
          multiline: true,
        }),
        articles_hero_image: fields.image({
          label: 'Hero image (Authored Articles page)',
          directory: 'public/images/thought-leadership',
          publicPath: '/images/thought-leadership/',
        }),
        articles_hero_image_alt: fields.text({
          label: 'Hero image alt text (Authored Articles page)',
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
          },
          { label: 'Hero' }
        ),
        appearances_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            view_more_label: fields.text({
              label: 'View-more link label',
              defaultValue: 'View all interviews',
            }),
            view_more_url: fields.text({
              label: 'View-more link URL',
              defaultValue: '/interviews',
            }),
          },
          { label: 'Guest appearances section heading' }
        ),
        appearances: fields.array(
          fields.object({
            date: fields.text({ label: 'Date label (e.g. "May 2025")' }),
            show: fields.text({ label: 'Show / host' }),
            title: fields.text({ label: 'Segment / episode title' }),
            description: fields.text({
              label: 'Description (optional)',
              multiline: true,
            }),
            thumbnail: fields.image({
              label: 'Thumbnail image (optional)',
              description:
                'Cover image for the card. Use this for non-YouTube appearances (e.g. LinkedIn events). Falls back to the YouTube thumbnail, then a gradient placeholder.',
              directory: 'public/images/thought-leadership',
              publicPath: '/images/thought-leadership/',
            }),
            thumbnail_fit: fields.select({
              label: 'Thumbnail fit',
              description:
                'How the thumbnail image sits in the card. "Cover" crops a photo to fill the frame; "Logo" centers a transparent logo on a light background.',
              options: [
                { label: 'Cover (photo)', value: 'cover' },
                { label: 'Logo (contain)', value: 'logo' },
              ],
              defaultValue: 'cover',
            }),
            youtube_id: fields.text({
              label: 'YouTube video ID (optional)',
              description:
                'The 11-character ID from the watch URL, e.g. "MbsUmSfdcrQ". When set, its thumbnail is used unless a thumbnail image is uploaded above.',
            }),
            url: fields.text({
              label: 'Watch URL (optional)',
              description:
                'External link used when the appearance is not on YouTube. Ignored when a YouTube video ID is set.',
            }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Watch now',
            }),
          }),
          {
            label: 'Guest appearances (Lorraine as guest)',
            itemLabel: (props) =>
              props.fields.title.value || props.fields.show.value || 'Appearance',
          }
        ),
        press_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            view_more_label: fields.text({
              label: 'View-more link label',
              defaultValue: 'See all featured press',
            }),
            view_more_url: fields.text({
              label: 'View-more link URL',
              description: 'Links out to the dedicated Featured In page.',
              defaultValue: '/featured-in',
            }),
          },
          {
            label: 'Featured In (press teaser) section heading',
            description:
              'A short press-proof teaser. The full press inventory lives on the dedicated Featured In page — link out via the view-more link rather than duplicating it here.',
          }
        ),
        press_features: fields.array(
          fields.object({
            outlet: fields.text({ label: 'Outlet / publication' }),
            title: fields.text({ label: 'Headline / segment title' }),
            url: fields.text({ label: 'URL' }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Read more',
            }),
          }),
          {
            label: 'Featured press (teaser)',
            itemLabel: (props) =>
              props.fields.outlet.value || props.fields.title.value || 'Feature',
          }
        ),
        articles_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            view_more_label: fields.text({
              label: 'View-more link label',
              defaultValue: 'Read all articles',
            }),
            view_more_url: fields.text({
              label: 'View-more link URL',
              defaultValue: '/articles',
            }),
          },
          { label: 'Authored articles section heading' }
        ),
        authored_articles: fields.array(
          fields.object({
            date: fields.text({ label: 'Date label (e.g. "April 2026")' }),
            outlet: fields.text({ label: 'Outlet / publication' }),
            outlet_logo: fields.image({
              label: 'Outlet logo (optional)',
              description:
                'Logo shown on the article card. Falls back to the outlet name as text when empty.',
              directory: 'public/images/featured-in/logos',
              publicPath: '/images/featured-in/logos/',
            }),
            title: fields.text({ label: 'Article title' }),
            url: fields.text({ label: 'URL' }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Read more',
            }),
          }),
          {
            label: 'Authored articles',
            itemLabel: (props) =>
              props.fields.title.value || props.fields.outlet.value || 'Article',
          }
        ),
        interviews_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
            view_more_label: fields.text({
              label: 'View-more link label',
              defaultValue: 'Watch on YouTube',
            }),
            view_more_url: fields.text({
              label: 'View-more link URL',
              defaultValue: 'https://www.youtube.com/c/LorraineKLee',
            }),
          },
          {
            label: 'Interviews-conducted section heading',
            description:
              'Interviews Lorraine has hosted with other leaders ("the other side of the camera").',
          }
        ),
        interviews: fields.array(
          fields.object({
            name: fields.text({ label: 'Guest name' }),
            role: fields.text({ label: 'Guest role / organization' }),
            description: fields.text({
              label: 'Description (optional)',
              multiline: true,
            }),
            thumbnail: fields.image({
              label: 'Thumbnail image (optional)',
              description:
                'Cover image for the card. Falls back to the YouTube thumbnail, then a gradient placeholder.',
              directory: 'public/images/thought-leadership',
              publicPath: '/images/thought-leadership/',
            }),
            thumbnail_fit: fields.select({
              label: 'Thumbnail fit',
              description:
                'How the thumbnail image sits in the card. "Cover" crops a photo to fill the frame; "Logo" centers a transparent logo on a light background.',
              options: [
                { label: 'Cover (photo)', value: 'cover' },
                { label: 'Logo (contain)', value: 'logo' },
              ],
              defaultValue: 'cover',
            }),
            youtube_id: fields.text({
              label: 'YouTube video ID (optional)',
              description:
                'The 11-character ID from the watch URL. When set, its thumbnail is used unless a thumbnail image is uploaded above.',
            }),
            url: fields.text({
              label: 'Watch URL (optional)',
              description: 'Ignored when a YouTube video ID is set.',
            }),
            cta_label: fields.text({
              label: 'CTA label',
              defaultValue: 'Watch now',
            }),
          }),
          {
            label: 'Interviews Lorraine has conducted',
            itemLabel: (props) => props.fields.name.value || 'Interview',
          }
        ),
        final_cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Final CTA' }
        ),
      },
    }),
  },
  collections: {
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      format: { data: 'yaml' },
      // Shared testimonials source of truth (CLI-118). The /testimonials page
      // (CLI-82) reads this collection via getTestimonials() in
      // src/lib/testimonials.ts. Homepage, speaking, and courses pages still
      // use their own hardcoded sets for now; migrate them to this collection
      // as part of CLI-118 once each surface renders equivalent content.
      schema: {
        author: fields.slug({
          name: { label: 'Author' },
          slug: {
            label: 'Anchor slug',
            description:
              'Stable in-page anchor for /testimonials#[slug]. Old WordPress /testimonial/* CPT URLs 301 to these anchors in vercel.json — do not change an existing slug without updating the redirect.',
          },
        }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        roleOrCompany: fields.text({
          label: 'Role / company',
          description: 'Shown under the author name, e.g. "Chief of Staff to HubSpot\'s CFO" or "Figma".',
        }),
        type: fields.select({
          label: 'Type',
          description: 'Controls which section the testimonial appears in on /testimonials.',
          options: [
            { label: 'Client / organizer speaking', value: 'client-organizer-speaking' },
            { label: 'Event attendee', value: 'event-attendee' },
            { label: 'Course / student review', value: 'course-student-review' },
          ],
          defaultValue: 'client-organizer-speaking',
        }),
        order: fields.integer({
          label: 'Sort order (within section)',
          description: 'Lower numbers appear first within the testimonial type.',
          defaultValue: 0,
        }),
        image: fields.text({
          label: 'Headshot image path (optional)',
          description:
            'Full public path, e.g. /images/speaking/testimonials/raechel-h.webp. Falls back to author initials when empty.',
        }),
        imageAlt: fields.text({ label: 'Headshot alt text (optional)' }),
        priority: fields.select({
          label: 'Priority',
          description: 'Editorial signal strength; used to pick homepage proof picks.',
          options: [
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
          ],
          defaultValue: 'Medium',
        }),
        topicTags: fields.array(fields.text({ label: 'Topic tag' }), {
          label: 'Topic tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        sourceUrl: fields.text({ label: 'Source URL (optional)' }),
        matchedCptUrl: fields.text({
          label: 'Matched WordPress CPT URL (optional)',
          description: 'The old /testimonial/* URL this record was migrated from, if any.',
        }),
        showOnHomepage: fields.checkbox({
          label: 'Show on homepage carousel',
          defaultValue: false,
        }),
        showOnTestimonials: fields.checkbox({
          label: 'Show on the /testimonials page',
          defaultValue: true,
        }),
        showOnSpeaking: fields.checkbox({
          label: 'Show on the /speaking page',
          defaultValue: false,
        }),
        showOnCourses: fields.checkbox({
          label: 'Show on the /courses page',
          defaultValue: false,
        }),
      },
    }),
    courses: collection({
      label: 'LinkedIn Courses',
      slugField: 'title',
      path: 'src/content/courses/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL slug',
            description:
              'Short canonical slug for /courses/[slug], e.g. "better-business-writing". The old WordPress /linkedin-courses/* URLs 301 to this in vercel.json.',
          },
        }),
        category: fields.select({
          label: 'Category',
          description:
            'Section the course is grouped under on the /courses page (mirrors the old WordPress hub).',
          options: COURSE_CATEGORY_OPTIONS,
          defaultValue: 'Communication',
        }),
        order: fields.integer({
          label: 'Sort order (within category)',
          description: 'Lower numbers appear first within the course category.',
          defaultValue: 0,
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        url: fields.url({
          label: 'LinkedIn Learning course URL',
          description: 'Full external link, e.g. https://www.linkedin.com/learning/…',
        }),
        glyph: fields.text({
          label: 'Thumbnail letter (decorative — used only when no image is set)',
        }),
        thumbnail: fields.image({
          label: 'Course thumbnail (optional)',
          description:
            'Course art shown on the card. Falls back to the decorative letter when empty.',
          directory: 'public/images/v1/courses',
          publicPath: '/images/v1/courses/',
        }),
        duration: fields.text({ label: 'Duration (optional)' }),
        show_on_hub: fields.checkbox({
          label: 'Show on the /courses hub',
          description:
            'Uncheck to keep the course page (and its 301 redirect) live but hide the card from the /courses grid. Used to mirror the curated WordPress hub.',
          defaultValue: true,
        }),
        featured: fields.checkbox({
          label: 'Feature at the top of the hub',
          description:
            'Show this course as the large highlighted block above the category grids.',
          defaultValue: false,
        }),
      },
    }),
    keynotes: collection({
      label: 'Keynotes',
      slugField: 'title',
      path: 'src/content/keynotes/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL slug',
            description:
              'Short canonical slug for /keynotes/[slug]. The old WordPress /keynote/* and /keynotes_v2/* URLs 301 to this in vercel.json.',
          },
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first in the keynote catalog.',
          defaultValue: 0,
        }),
        format: fields.text({
          label: 'Format',
          description:
            'E.g. "Keynote", "Keynote / Workshop", "Keynote / 60 min".',
          defaultValue: 'Keynote',
        }),
        description: fields.text({
          label: 'Description',
          description:
            'Full talk description, same copy as the Speaking page card. Separate paragraphs with a blank line. The first paragraph doubles as the page meta description.',
          multiline: true,
        }),
        clip_url: fields.text({
          label: 'Talk video (optional)',
          description:
            'The recording shown on this keynote page. Paste the YouTube or Vimeo link straight from the Share button. Watch links, youtu.be links, and embed links all work.',
        }),
        takeaways: fields.array(fields.text({ label: 'Takeaway' }), {
          label: 'Audience takeaways',
          itemLabel: (props) => props.value || 'Takeaway',
        }),
        talk_track: fields.array(
          fields.object({
            time: fields.text({ label: 'Time / chapter (optional)' }),
            label: fields.text({ label: 'Track label' }),
          }),
          {
            label: 'Talk track (chapters)',
            itemLabel: (props) => props.fields.label.value || 'Track item',
          }
        ),
      },
    }),
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/articles',
          publicPath: '/images/articles/',
        }),
        external_url: fields.url({ label: 'External URL' }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    featuredAppearances: collection({
      label: 'Featured Appearances',
      slugField: 'title',
      path: 'src/content/featured-appearances/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Title / headline' },
          slug: {
            label: 'URL slug',
            description:
              'Anchor id for the card on /featured-in, e.g. "forbes-epic-career-brand".',
          },
        }),
        source_name: fields.text({
          label: 'Source / outlet',
          description: 'E.g. "Forbes", "CNBC Make It", "AARP".',
        }),
        appearance_type: fields.select({
          label: 'Appearance type',
          description: 'Drives the card chip and the default CTA label.',
          options: APPEARANCE_TYPE_OPTIONS,
          defaultValue: 'Article',
        }),
        date: fields.text({
          label: 'Date label (optional)',
          description: 'Free text, e.g. "November 2025".',
        }),
        description: fields.text({
          label: 'Description (optional)',
          multiline: true,
        }),
        url: fields.text({
          label: 'External URL',
          description:
            'Link the card CTA opens. Leave blank for recognition-only items with no public link, then tick "Needs content review" below.',
        }),
        logo: fields.image({
          label: 'Outlet logo (optional)',
          description:
            'Shown as the card mark. Falls back to the source name in text when empty.',
          directory: 'public/images/featured-in/logos',
          publicPath: '/images/featured-in/logos/',
        }),
        image: fields.image({
          label: 'Card image (optional)',
          description: 'Optional thumbnail/screenshot shown on the card.',
          directory: 'public/images/featured-in',
          publicPath: '/images/featured-in/',
        }),
        cta_label: fields.text({
          label: 'CTA label (optional)',
          description:
            'Overrides the default label derived from the appearance type (e.g. "Read more", "Listen", "Watch").',
        }),
        priority: fields.integer({
          label: 'Priority / sort order',
          description: 'Lower numbers appear first.',
          defaultValue: 100,
        }),
        featured: fields.checkbox({
          label: 'Feature at the top',
          description: 'Show as a larger highlight card above the main grid.',
          defaultValue: false,
        }),
        needs_review: fields.checkbox({
          label: 'Needs content review',
          description:
            'Internal flag: missing or unverified link/copy. The card still renders, just without a broken CTA.',
          defaultValue: false,
        }),
      },
    }),
    links: collection({
      label: 'Shortlinks',
      slugField: 'slug',
      path: 'src/content/links/*',
      format: { data: 'yaml' },
      // Show the destination and on/off state alongside each slug in the
      // collection list, so the Shortlinks landing page reads as a tracking
      // table (slug | destination | active).
      columns: ['destination', 'active'],
      // CLI-151: branded short redirects, e.g. lorraineklee.com/book -> a long
      // destination URL. getShortlinkRedirects() in src/lib/shortlinks.ts turns
      // each active entry into a 301 in the Astro `redirects` config at build
      // time, so a new or edited shortlink goes live after the normal commit +
      // rebuild. A slug that matches a real page or an existing redirect is
      // skipped at build (the real route wins) and logged as a warning.
      schema: {
        slug: fields.slug({
          name: { label: 'Short path' },
          slug: {
            label: 'URL slug',
            description:
              'What comes after the slash, e.g. "buy-the-book" for lorraineklee.com/buy-the-book. Lowercase, no spaces, no leading slash. Must NOT match an existing page (about, book, speaking, learn, contact, articles, etc.) or it will be ignored in favor of that page.',
          },
        }),
        destination: fields.url({
          label: 'Destination URL',
          description:
            'The full URL this shortlink sends visitors to, e.g. https://www.amazon.com/dp/XXXX. Must start with http(s)://.',
        }),
        active: fields.checkbox({
          label: 'Active',
          description: 'Uncheck to turn the shortlink off without deleting it.',
          defaultValue: true,
        }),
        note: fields.text({
          label: 'Note (optional)',
          description:
            'A label for your own reference, e.g. "Amazon book listing". Not shown to visitors.',
        }),
      },
    }),
  },
});
