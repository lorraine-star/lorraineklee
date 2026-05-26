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
  photo: fields.image({
    label: 'Headshot',
    directory: 'public/images/v1/testimonials',
    publicPath: '/images/v1/testimonials/',
  }),
  photo_alt: fields.text({ label: 'Headshot alt text' }),
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
                'YouTube or Vimeo embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID).',
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
            tag: fields.text({
              label: 'Tag / badge (optional)',
              description:
                'Small chip on the card, e.g. "Most Popular" or "#2 Most Popular". Leave blank for none.',
            }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            format: fields.text({ label: 'Format' }),
            clip_url: fields.text({
              label: 'Talk clip embed URL (optional, unused)',
              description: 'Legacy field — kept for back-compat, not rendered.',
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
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            url: fields.text({ label: 'URL (optional)' }),
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
            logo_src: fields.text({
              label: 'Logo image URL (e.g. Brandfetch CDN URL)',
              description:
                'Optional. If set, the logo image renders in place of the wordmark.',
            }),
            style: fields.text({
              label: 'Logo style (CSS classes: bold, caps, serif, italic). Used only when logo_src is empty.',
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
            photo: fields.text({
              label: 'Headshot image path (optional)',
              description:
                'E.g. /images/speaking/testimonials/raechel-h.webp. Falls back to initials when blank.',
            }),
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
        attendee_testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role / organization' }),
            initials: fields.text({ label: 'Initials' }),
            photo: fields.text({
              label: 'Headshot image path (optional)',
              description: 'Falls back to initials when blank.',
            }),
          }),
          {
            label: 'Attendee testimonials',
            itemLabel: (props) => props.fields.name.value || 'Testimonial',
          }
        ),
        moderation_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Moderation section heading' }
        ),
        moderation_clips: fields.array(
          fields.object({
            title: fields.text({ label: 'Clip title' }),
            embed_url: fields.text({
              label: 'Embed URL',
              description: 'YouTube/Vimeo embed URL.',
            }),
            caption: fields.text({ label: 'Caption', multiline: true }),
          }),
          {
            label: 'Moderation clips',
            itemLabel: (props) => props.fields.title.value || 'Clip',
          }
        ),
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
        as_seen_in_eyebrow: fields.text({ label: '"As seen in" eyebrow' }),
        as_seen_in: fields.array(
          fields.object({
            id: fields.text({ label: 'Slug (for CSS hooks, e.g. "cnn")' }),
            name: fields.text({ label: 'Outlet name' }),
            src: fields.text({
              label: 'Logo image path (e.g. /images/v1/press/cnn.svg)',
            }),
            width: fields.integer({ label: 'Width (px)', defaultValue: 160 }),
            height: fields.integer({ label: 'Height (px)', defaultValue: 32 }),
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
    speakerBio: singleton({
      label: 'Speaker Bio',
      path: 'src/content/speaker-bio/',
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
            headshot: fields.image({
              label: 'Headshot',
              directory: 'public/images/speaker-bio',
              publicPath: '/images/speaker-bio/',
            }),
            headshot_alt: fields.text({ label: 'Headshot alt text' }),
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
    privacyPolicy: singleton({
      label: 'Privacy Policy',
      path: 'src/content/privacy-policy/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({
          label: 'Page title',
          defaultValue: 'Privacy Policy',
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
          },
          { label: 'LinkedIn Learning courses section heading' }
        ),
        courses: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            platform: fields.select({
              label: 'Platform',
              options: [
                { label: 'LinkedIn Learning', value: 'LinkedIn Learning' },
              ],
              defaultValue: 'LinkedIn Learning',
            }),
            glyph: fields.text({
              label: 'Thumbnail letter (decorative, used only when no image is set)',
            }),
            thumbnail: fields.image({
              label: 'Course thumbnail (optional)',
              description:
                'Course art shown on the card. Falls back to the decorative letter when empty.',
              directory: 'public/images/v1/learn/courses',
              publicPath: '/images/v1/learn/courses/',
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
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: 'LinkedIn Learning',
            }),
            headline: fields.text({ label: 'Headline (plain)' }),
            headline_accent: fields.text({
              label: 'Headline accent (italic)',
            }),
            lead: fields.text({ label: 'Lead paragraph', multiline: true }),
            primary_cta_label: fields.text({ label: 'Primary CTA label' }),
            primary_cta_url: fields.text({ label: 'Primary CTA URL' }),
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
        testimonials_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
          },
          { label: 'Student testimonials heading' }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            initials: fields.text({ label: 'Initials' }),
            photo: fields.image({
              label: 'Student photo (optional)',
              description:
                'Square headshot shown as the avatar. Falls back to the initials when empty.',
              directory: 'public/images/v1/courses/testimonials',
              publicPath: '/images/v1/courses/testimonials/',
            }),
            photo_alt: fields.text({ label: 'Photo alt text (optional)' }),
          }),
          {
            label: 'Student testimonials',
            itemLabel: (props) => props.fields.name.value || 'Testimonial',
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
          { label: 'Final CTA (free course)' }
        ),
      },
    }),
    interviewsPage: singleton({
      label: 'Interviews Page',
      path: 'src/content/interviews-page/',
      schema: {
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
        featured_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading (plain)' }),
            heading_accent: fields.text({
              label: 'Heading accent (italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          {
            label: 'Featured interviews section heading',
            description:
              'Heading for the block that renders the "Interviews" CMS collection — the leaders Lorraine has interviewed.',
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
          },
          { label: 'Guest appearances section heading' }
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
        eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Contact' }),
        headline: fields.text({ label: 'Headline' }),
        headline_accent: fields.text({
          label: 'Headline accent (italic)',
          description: 'The italicised end of the headline, e.g. "touch."',
        }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
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
    consulting: singleton({
      label: 'Consulting',
      path: 'src/content/consulting/',
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
    coaching: singleton({
      label: 'Coaching',
      path: 'src/content/coaching/',
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
            secondary_cta_url: fields.text({
              label: 'Secondary CTA URL',
              description: 'Internal route, anchor (e.g. #tiers), or external URL.',
            }),
          },
          { label: 'Hero' }
        ),
        intro_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
          },
          { label: 'Intro / story section heading' }
        ),
        intro_paragraphs: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          {
            label: 'Intro paragraphs',
            itemLabel: (props) => props.value || 'Paragraph',
          }
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
          { label: 'Common topics section heading' }
        ),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Common topics covered',
          itemLabel: (props) => props.value || 'Topic',
        }),
        tiers_section: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            lead: fields.text({ label: 'Lead', multiline: true }),
          },
          { label: 'Coaching tiers section heading' }
        ),
        tiers: fields.array(
          fields.object({
            name: fields.text({ label: 'Tier name' }),
            duration: fields.text({
              label: 'Duration (e.g. "One month")',
            }),
            price: fields.text({ label: 'Price (e.g. "$1,750")' }),
            per_session_note: fields.text({
              label: 'Per-session note (e.g. "$875 per session")',
            }),
            summary: fields.text({
              label: 'Summary line',
              multiline: true,
            }),
            features: fields.array(fields.text({ label: 'Feature' }), {
              label: 'Features',
              itemLabel: (props) => props.value || 'Feature',
            }),
            footnote: fields.text({
              label: 'Footnote (scheduling note)',
              multiline: true,
            }),
            featured: fields.checkbox({
              label: 'Featured (highlighted card)',
              defaultValue: false,
            }),
          }),
          {
            label: 'Coaching tiers',
            itemLabel: (props) => props.fields.name.value || 'Tier',
          }
        ),
        oneoff: fields.object(
          {
            label: fields.text({ label: 'Label' }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            price: fields.text({ label: 'Price (e.g. "$1,000/hour")' }),
          },
          { label: 'One-off session callout' }
        ),
        audit: fields.object(
          {
            show: fields.checkbox({
              label: 'Show the async LinkedIn audit offer',
              defaultValue: true,
            }),
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading' }),
            heading_accent: fields.text({
              label: 'Heading accent (shown italic)',
            }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            price: fields.text({ label: 'Price (e.g. "$499")' }),
            price_note: fields.text({
              label: 'Price note (e.g. "one-time, async")',
            }),
            features: fields.array(fields.text({ label: 'Feature' }), {
              label: "What's included",
              itemLabel: (props) => props.value || 'Feature',
            }),
            cta_label: fields.text({ label: 'CTA label' }),
            cta_url: fields.text({
              label: 'CTA URL',
              description:
                'Where the audit CTA points. Defaults to /contact; update to a dedicated audit form or payment link when one exists.',
            }),
          },
          {
            label: 'Async LinkedIn profile audit offer',
            description:
              'Standalone async LinkedIn profile audit. The WordPress /async-linkedin-profile-audit-assessment/ page 301s to this section (#linkedin-audit).',
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
    featuredIn: singleton({
      label: 'Featured In',
      path: 'src/content/featured-in/',
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
      },
    }),
  },
  collections: {
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
          options: [
            { label: 'Communication', value: 'Communication' },
            { label: 'Leadership', value: 'Leadership' },
            { label: 'Management', value: 'Management' },
            { label: 'Career', value: 'Career' },
          ],
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
    interviews: collection({
      label: 'Interviews',
      slugField: 'title',
      path: 'src/content/interviews/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL slug',
            description:
              'Anchor id on the /interviews page, e.g. "chelsea-clinton". The old WordPress /youtube-video/* URLs 301 to /interviews in vercel.json.',
          },
        }),
        guest: fields.text({
          label: 'Guest',
          description: 'The person Lorraine interviews, e.g. "Chelsea Clinton".',
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first.',
          defaultValue: 0,
        }),
        youtube_id: fields.text({
          label: 'YouTube video ID (optional)',
          description:
            'The 11-character ID from the watch URL, e.g. "W0_QWjYWPuE". Leave empty if the interview lives elsewhere (set the external link below instead).',
        }),
        video_url: fields.text({
          label: 'External video / article URL (optional)',
          description:
            'Used when the interview is not on YouTube (e.g. a LinkedIn post). Ignored when a YouTube video ID is set.',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        date: fields.text({
          label: 'Date label (optional)',
          description: 'Free text, e.g. "2019".',
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
            'Short summary shown on the catalog card and used as the page meta description.',
          multiline: true,
        }),
        clip_url: fields.text({
          label: 'Talk clip embed URL (optional)',
          description:
            'YouTube or Vimeo embed URL shown on the keynote detail page.',
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
          options: [
            { label: 'Article', value: 'Article' },
            { label: 'Podcast', value: 'Podcast' },
            { label: 'Video', value: 'Video' },
            { label: 'Interview', value: 'Interview' },
            { label: 'Book', value: 'Book' },
            { label: 'Report', value: 'Report' },
            { label: 'Resource', value: 'Resource' },
            { label: 'Award', value: 'Award' },
            { label: 'Event', value: 'Event' },
            { label: 'Newsletter', value: 'Newsletter' },
          ],
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
  },
});
