import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/interfaces-carousel';

type TestimonialLogo = {
  image: string;
  alt: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  initials: string;
  /** Optional company / book-cover logos shown in a row at the foot of the card. */
  logos?: TestimonialLogo[];
};

type HomeTestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

const carouselOptions = {
  align: 'center',
  loop: true,
} as const;

export default function HomeTestimonialsCarousel({
  testimonials,
}: HomeTestimonialsCarouselProps) {
  return (
    <Carousel
      opts={carouselOptions}
      orientation="horizontal"
      className="testimonials-carousel"
      aria-label="Client testimonials"
    >
      <div className="testimonials-controls">
        <CarouselPrevious className="testimonial-control" />
        <CarouselNext className="testimonial-control" />
      </div>
      <CarouselContent className="testimonials-track">
        {testimonials.map((testimonial) => (
          <CarouselItem
            className="testimonials-carousel-slide"
            key={`${testimonial.name}-${testimonial.role}`}
          >
            <figure className="t-card">
              <span className="t-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="t-quote">{testimonial.quote}</blockquote>
              <div className="t-divider" />
              <figcaption className="t-attrib">
                {testimonial.photo ? (
                  <img
                    className="t-headshot"
                    src={testimonial.photo}
                    alt={testimonial.photoAlt || `Headshot of ${testimonial.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="t-avatar" aria-hidden="true">
                    {testimonial.initials}
                  </div>
                )}
                <div>
                  <div className="t-name">{testimonial.name}</div>
                  <div className="t-role">{testimonial.role}</div>
                </div>
              </figcaption>
              {testimonial.logos && testimonial.logos.length > 0 && (
                <div className="t-logos">
                  {testimonial.logos.map((logo) => (
                    <img
                      key={logo.image}
                      className="t-logo"
                      src={logo.image}
                      alt={logo.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              )}
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
