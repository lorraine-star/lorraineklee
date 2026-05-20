import { config, fields, collection, singleton } from '@keystatic/core';

// Storage: Keystatic Cloud. The admin UI at /keystatic authenticates against
// the Keystatic Cloud project and commits content changes straight to the
// GitHub repo, so Lorraine can edit without her own GitHub account.
//
// To run the admin against local files instead (e.g. offline dev), swap to:
//   storage: { kind: 'local' },

const testimonialFields = {
  quote: fields.text({ label: 'Quote', multiline: true }),
  author: fields.text({ label: 'Author' }),
  title: fields.text({ label: 'Author title' }),
};

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'lorraineklee/lorraineklee',
  },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/home/',
      schema: {
        hero_headline: fields.text({ label: 'Hero headline' }),
        hero_subheadline: fields.text({
          label: 'Hero subheadline',
          multiline: true,
        }),
        hero_image: fields.image({
          label: 'Hero image',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
        primary_cta_text: fields.text({ label: 'Primary CTA text' }),
        primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
        social_proof_logos: fields.array(
          fields.image({
            label: 'Logo',
            directory: 'public/images/logos',
            publicPath: '/images/logos/',
          }),
          { label: 'Social proof logos' }
        ),
        featured_testimonial: fields.object(testimonialFields, {
          label: 'Featured testimonial',
        }),
        testimonials: fields.array(fields.object(testimonialFields), {
          label: 'Testimonials',
          itemLabel: (props) => props.fields.author.value || 'Testimonial',
        }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about/',
      format: { contentField: 'body' },
      schema: {
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
        career_logos: fields.array(
          fields.object({
            name: fields.text({ label: 'Company name' }),
            style: fields.text({
              label: 'Logo style (CSS classes: bold, caps, serif, italic)',
            }),
          }),
          {
            label: 'Career logos',
            itemLabel: (props) => props.fields.name.value || 'Company',
          }
        ),
        media_eyebrow: fields.text({ label: '"As seen in" eyebrow' }),
        media_logos: fields.array(
          fields.object({
            name: fields.text({ label: 'Outlet name' }),
            style: fields.text({ label: 'Logo style (CSS classes)' }),
          }),
          {
            label: 'Media logos',
            itemLabel: (props) => props.fields.name.value || 'Outlet',
          }
        ),
        now_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            intro: fields.text({ label: 'Intro', multiline: true }),
          },
          { label: 'Now section heading' }
        ),
        now_items: fields.array(
          fields.object({
            number: fields.text({ label: 'Number' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: 'Now items',
            itemLabel: (props) => props.fields.title.value || 'Item',
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
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role / organization' }),
          }),
          {
            label: 'Endorsements',
            itemLabel: (props) => props.fields.name.value || 'Endorsement',
          }
        ),
        awards: fields.array(
          fields.object({
            eyebrow: fields.text({ label: 'Eyebrow' }),
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' }),
          }),
          {
            label: 'Awards',
            itemLabel: (props) => props.fields.value.value || 'Award',
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
            title: fields.text({ label: 'Title' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            format: fields.text({ label: 'Format' }),
          }),
          {
            label: 'Speaking topics',
            itemLabel: (props) => props.fields.title.value || 'Topic',
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
            style: fields.text({
              label: 'Logo style (CSS classes: bold, caps, serif, italic)',
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
          },
          { label: 'Testimonials section heading' }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role / organization' }),
            initials: fields.text({ label: 'Initials' }),
            featured: fields.checkbox({
              label: 'Featured (dark card)',
              defaultValue: false,
            }),
          }),
          {
            label: 'Organizer testimonials',
            itemLabel: (props) => props.fields.name.value || 'Testimonial',
          }
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
        as_seen_in_eyebrow: fields.text({ label: '"As seen in" eyebrow' }),
        as_seen_in: fields.array(
          fields.object({
            name: fields.text({ label: 'Outlet name' }),
            style: fields.text({ label: 'Logo style (CSS classes)' }),
          }),
          {
            label: 'As seen in',
            itemLabel: (props) => props.fields.name.value || 'Outlet',
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
    learn: singleton({
      label: 'Learn',
      path: 'src/content/learn/',
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            headline: fields.text({ label: 'Headline' }),
            headline_accent: fields.text({
              label: 'Headline accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
          },
          { label: 'Hero' }
        ),
        courses: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            platform: fields.select({
              label: 'Platform',
              options: [
                { label: 'LinkedIn Learning', value: 'LinkedIn Learning' },
                { label: 'Stanford', value: 'Stanford' },
                { label: 'Free', value: 'Free' },
              ],
              defaultValue: 'LinkedIn Learning',
            }),
            glyph: fields.text({
              label: 'Thumbnail letter (decorative)',
            }),
            duration: fields.text({ label: 'Duration (optional)' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            url: fields.text({
              label: 'Course URL (external links open in a new tab)',
            }),
          }),
          {
            label: 'Courses',
            itemLabel: (props) => props.fields.title.value || 'Course',
          }
        ),
        mid_cta: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Mid-page CTA' }
        ),
        stanford: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Body', multiline: true }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({ label: 'CTA URL' }),
          },
          { label: 'Stanford callout' }
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
              label: 'Brand color (hex, optional — used on hover)',
              description:
                'e.g. #FF9900 for Amazon. White text is used over this color on hover.',
            }),
          }),
          {
            label: 'Retailer links — individual buys',
            itemLabel: (props) => props.fields.name.value || 'Retailer',
          }
        ),
        retailer_links_bulk: fields.array(
          fields.object({
            name: fields.text({ label: 'Retailer name' }),
            url: fields.url({ label: 'URL' }),
            brand_color: fields.text({
              label: 'Brand color (hex, optional — used on hover)',
              description:
                'e.g. #FF9900 for Amazon. White text is used over this color on hover.',
            }),
          }),
          {
            label: 'Retailer links — bulk buys',
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
              label: 'Heading accent (italic — the book title)',
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
              description: 'Used in the 3D carousel image stack.',
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
            label: 'Endorsements (3D carousel)',
            itemLabel: (props) => props.fields.name.value || 'Endorsement',
          }
        ),
        learn_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: "What you'll learn section heading" }
        ),
        learn_items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }),
          {
            label: "What you'll learn items",
            itemLabel: (props) => props.fields.title.value || 'Item',
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
    contact: singleton({
      label: 'Contact',
      path: 'src/content/contact/',
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Contact' }),
        headline: fields.text({ label: 'Headline' }),
        headline_accent: fields.text({
          label: 'Headline accent (italic)',
          description: 'The italicised end of the headline, e.g. "touch."',
        }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        contact_email: fields.text({ label: 'Contact email' }),
        press_email: fields.text({ label: 'Press email' }),
        typeform_id: fields.text({
          label: 'Typeform form ID',
          description:
            'The 8-character ID from the form\'s share URL — e.g. "PJJPZ9iJ" from https://<account>.typeform.com/to/PJJPZ9iJ.',
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
  },
  collections: {
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
  },
});
