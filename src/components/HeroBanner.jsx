import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    Navigation,
    Pagination,
    A11y,
    Keyboard
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const bannerImages = import.meta.glob(
    "../assets/banners/*.webp",
    {
        eager: true,
        import: "default"
    }
);

const banners = [
    {
        id: 1,
        badge: "DISCOVER APPLE",
        title: "Experience the Extraordinary",
        subtitle: "Explore the iPhone Collection",
        description:
            "Iconic design. Incredible performance. Discover your next iPhone.",
        button: "Shop iPhone",
        image: "iphone.webp",
        link: "/products?search=iPhone",
        background: "#211510"
    },
    {
        id: 2,
        badge: "FLAGSHIP COLLECTION",
        title: "Beyond Expectations",
        subtitle: "Samsung Galaxy",
        description:
            "Discover powerful performance and remarkable innovation.",
        button: "Explore Samsung",
        image: "samsung.webp",
        link: "/products?search=Samsung",
        background: "#101c35"
    },
    {
        id: 3,
        badge: "PERFORMANCE COLLECTION",
        title: "Never Settle",
        subtitle: "OnePlus Smartphones",
        description:
            "Experience smooth performance and exceptional technology.",
        button: "Shop OnePlus",
        image: "oneplus.webp",
        link: "/products?search=OnePlus",
        background: "#291018"
    },
    {
        id: 4,
        badge: "UPGRADE YOUR TECH",
        title: "Complete Your Experience",
        subtitle: "Premium Accessories",
        description:
            "Discover smartwatches, earbuds and everyday tech essentials.",
        button: "Explore Accessories",
        image: "accessories.webp",
        link: "/products",
        background: "#0b2938"
    }
];

export default function HeroBanner() {

    const [swiper, setSwiper] = useState(null);
    const [paused, setPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(
        () => window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    );

    useEffect(() => {
        const media = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const update = (event) => {
            setReducedMotion(event.matches);
        };

        media.addEventListener("change", update);

        return () => {
            media.removeEventListener("change", update);
        };
    }, []);

    useEffect(() => {
    if (!swiper || swiper.destroyed || !swiper.autoplay) return;

    if (paused || reducedMotion) {
        swiper.autoplay.stop();
    } else {
        swiper.autoplay.stop();
        swiper.autoplay.start();
    }
}, [swiper, paused, reducedMotion]);

    return (
        <section
            aria-label="Featured collections"
            className="w-full relative overflow-hidden"
        >
            <Swiper
                modules={[
                    Autoplay,
                    Navigation,
                    Pagination,
                    A11y,
                    Keyboard
                ]}
                onSwiper={setSwiper}
                slidesPerView={1}
                loop={true}
                speed={reducedMotion ? 0 : 800}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    waitForTransition: true
                }}
                navigation={true}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                className="nova-hero w-full"
                style={{
                    "--swiper-navigation-color": "#ffffff",
                    "--swiper-navigation-size": "24px",
                    "--swiper-pagination-color": "#38bdf8",
                    "--swiper-pagination-bullet-inactive-color": "#ffffff",
                    "--swiper-pagination-bullet-inactive-opacity": "0.5",
                    "--swiper-pagination-bottom": "20px"
                }}
            >
                {banners.map((banner, index) => {
                    const image =
                        bannerImages[
                            `../assets/banners/${banner.image}`
                        ];

                    return (
                        <SwiperSlide key={banner.id}>
                            <div
                                className="relative w-full min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-center overflow-hidden"
                                style={{
                                    backgroundColor: banner.background
                                }}
                            >
                                {image && (
                                    <img
                                        src={image}
                                        alt=""
                                        loading={
                                            index === 0
                                                ? "eager"
                                                : "lazy"
                                        }
                                        className="absolute inset-0 w-full h-full object-cover object-right"
                                    />
                                )}

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/10" />

                                {/* Banner content */}
                                <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-20 py-16">
                                    <div className="max-w-xl flex flex-col items-start gap-4">

                                        <span className="text-sky-300 text-xs md:text-sm font-bold tracking-[0.2em] border border-sky-400/40 bg-sky-400/10 px-4 py-2 rounded-full">
                                            {banner.badge}
                                        </span>

                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                            {banner.title}
                                        </h2>

                                        <h3 className="text-xl md:text-2xl font-semibold text-sky-300">
                                            {banner.subtitle}
                                        </h3>

                                        <p className="text-gray-200 text-sm md:text-lg leading-relaxed max-w-md">
                                            {banner.description}
                                        </p>

                                        <Link
                                            to={banner.link}
                                            className="mt-4 inline-flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white font-bold px-7 py-3.5 rounded-full transition-colors"
                                        >
                                            {banner.button}
                                            <span aria-hidden="true">→</span>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {!reducedMotion && (
                <button
                    type="button"
                    onClick={() => setPaused(!paused)}
                    aria-label={
                        paused
                            ? "Play banner slideshow"
                            : "Pause banner slideshow"
                    }
                    className="absolute bottom-4 right-5 z-20 bg-black/60 text-white rounded-full px-4 py-2 text-xs"
                >
                    {paused ? "▶ Play" : "Ⅱ Pause"}
                </button>
            )}
        </section>
    );
}
