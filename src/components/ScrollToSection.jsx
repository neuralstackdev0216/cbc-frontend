
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToSection() {

    const { pathname, hash, key } = useLocation();

    useEffect(() => {

        const behavior = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth";

        if (!hash) {

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

            return;

        }

        const timer = setTimeout(() => {

            const element = document.getElementById(
                hash.substring(1)
            );

            if (element) {

                element.scrollIntoView({
                    behavior,
                    block: "start"
                });

            }

        }, 150);

        return () => clearTimeout(timer);

    }, [pathname, hash, key]);

    return null;

}
