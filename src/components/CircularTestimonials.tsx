import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './circular-testimonials.css';

interface TestimonialLogo {
	image: string;
	alt: string;
}

interface Testimonial {
	quote: string;
	name: string;
	designation: string;
	src: string;
	logos?: TestimonialLogo[];
}

interface Colors {
	name?: string;
	designation?: string;
	testimony?: string;
	arrowBackground?: string;
	arrowForeground?: string;
	arrowHoverBackground?: string;
}

interface FontSizes {
	name?: string;
	designation?: string;
	quote?: string;
}

interface CircularTestimonialsProps {
	testimonials: Testimonial[];
	autoplay?: boolean;
	colors?: Colors;
	fontSizes?: FontSizes;
}

function calculateGap(width: number) {
	const minWidth = 1024;
	const maxWidth = 1456;
	const minGap = 60;
	const maxGap = 86;
	if (width <= minWidth) return minGap;
	if (width >= maxWidth)
		return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
	return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CircularTestimonials({
	testimonials,
	autoplay = true,
	colors = {},
	fontSizes = {},
}: CircularTestimonialsProps) {
	const colorName = colors.name ?? '#000';
	const colorDesignation = colors.designation ?? '#6b7280';
	const colorTestimony = colors.testimony ?? '#4b5563';
	const colorArrowBg = colors.arrowBackground ?? '#141414';
	const colorArrowFg = colors.arrowForeground ?? '#f1f1f7';
	const colorArrowHoverBg = colors.arrowHoverBackground ?? '#00a6fb';
	const fontSizeName = fontSizes.name ?? '1.5rem';
	const fontSizeDesignation = fontSizes.designation ?? '0.925rem';
	const fontSizeQuote = fontSizes.quote ?? '1.125rem';

	const [activeIndex, setActiveIndex] = useState(0);
	const [hoverPrev, setHoverPrev] = useState(false);
	const [hoverNext, setHoverNext] = useState(false);
	const [containerWidth, setContainerWidth] = useState(1200);

	const imageContainerRef = useRef<HTMLDivElement>(null);
	const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
	const activeTestimonial = useMemo(
		() => testimonials[activeIndex],
		[activeIndex, testimonials]
	);

	useEffect(() => {
		function handleResize() {
			if (imageContainerRef.current) {
				setContainerWidth(imageContainerRef.current.offsetWidth);
			}
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleNext = useCallback(() => {
		setActiveIndex((prev) => (prev + 1) % testimonialsLength);
		if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
	}, [testimonialsLength]);

	const handlePrev = useCallback(() => {
		setActiveIndex(
			(prev) => (prev - 1 + testimonialsLength) % testimonialsLength
		);
		if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
	}, [testimonialsLength]);

	useEffect(() => {
		if (autoplay) {
			autoplayIntervalRef.current = setInterval(() => {
				setActiveIndex((prev) => (prev + 1) % testimonialsLength);
			}, 5000);
		}
		return () => {
			if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
		};
	}, [autoplay, testimonialsLength]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') handlePrev();
			if (e.key === 'ArrowRight') handleNext();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [handleNext, handlePrev]);

	function getImageStyle(index: number): React.CSSProperties {
		const gap = calculateGap(containerWidth);
		const maxStickUp = gap * 0.8;
		const isActive = index === activeIndex;
		const isLeft =
			(activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
		const isRight = (activeIndex + 1) % testimonialsLength === index;
		if (isActive) {
			return {
				zIndex: 3,
				opacity: 1,
				pointerEvents: 'auto',
				transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
				transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
			};
		}
		if (isLeft) {
			return {
				zIndex: 2,
				opacity: 1,
				pointerEvents: 'auto',
				transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
				transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
			};
		}
		if (isRight) {
			return {
				zIndex: 2,
				opacity: 1,
				pointerEvents: 'auto',
				transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
				transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
			};
		}
		return {
			zIndex: 1,
			opacity: 0,
			pointerEvents: 'none',
			transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
		};
	}

	const quoteVariants = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	return (
		<div className="ct-container">
			<div className="ct-grid">
				<div className="ct-image-container" ref={imageContainerRef}>
					{testimonials.map((testimonial, index) => (
						<img
							key={testimonial.src}
							src={testimonial.src}
							alt={testimonial.name}
							className="ct-image"
							data-index={index}
							style={getImageStyle(index)}
							draggable={false}
						/>
					))}
				</div>

				<div className="ct-content">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							variants={quoteVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.3, ease: 'easeInOut' }}
						>
							<h3
								className="ct-name"
								style={{ color: colorName, fontSize: fontSizeName }}
							>
								{activeTestimonial.name}
							</h3>
							<p
								className="ct-designation"
								style={{
									color: colorDesignation,
									fontSize: fontSizeDesignation,
								}}
							>
								{activeTestimonial.designation}
							</p>
							<motion.p
								className="ct-quote"
								style={{ color: colorTestimony, fontSize: fontSizeQuote }}
							>
								{activeTestimonial.quote.split(' ').map((word, i) => (
									<motion.span
										key={i}
										initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
										animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
										transition={{
											duration: 0.22,
											ease: 'easeInOut',
											delay: 0.025 * i,
										}}
										style={{ display: 'inline-block' }}
									>
										{word}&nbsp;
									</motion.span>
								))}
							</motion.p>
							{activeTestimonial.logos && activeTestimonial.logos.length > 0 && (
								<div className="ct-logos" aria-hidden="false">
									{activeTestimonial.logos.map((logo) => (
										<img
											key={logo.image}
											src={logo.image}
											alt={logo.alt}
											className="ct-logo"
										/>
									))}
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					<div className="ct-arrows">
						<button
							type="button"
							className="ct-arrow ct-arrow--prev"
							onClick={handlePrev}
							style={{
								backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
							}}
							onMouseEnter={() => setHoverPrev(true)}
							onMouseLeave={() => setHoverPrev(false)}
							aria-label="Previous testimonial"
						>
							<ChevronLeft size={24} color={colorArrowFg} />
						</button>
						<button
							type="button"
							className="ct-arrow ct-arrow--next"
							onClick={handleNext}
							style={{
								backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
							}}
							onMouseEnter={() => setHoverNext(true)}
							onMouseLeave={() => setHoverNext(false)}
							aria-label="Next testimonial"
						>
							<ChevronRight size={24} color={colorArrowFg} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
