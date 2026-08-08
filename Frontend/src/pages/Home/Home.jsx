import "./Home.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../../components/Landing/Navbar/Navbar";
import Hero from "../../components/Landing/Hero/Hero";
import Trusted from "../../components/Landing/Trusted/Trusted";
import Showcase from "../../components/Landing/Showcase/Showcase";
import Features from "../../components/Landing/Features/Features";
import Pricing from "../../components/Landing/Pricing/Pricing";
import FAQ from "../../components/Landing/FAQ/FAQ";
import CTA from "../../components/Landing/CTA/CTA";
import WhyORBIQ from "../../components/Landing/BuiltFor/WhyORBIQ.jsx";
import Footer from "../../components/Landing/Footer/Footer";

function Home() {
    const location = useLocation();

    useEffect(() => {

        if (location.state?.scrollTo === "hero") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }, [location]);

    return (
        <div className="home">
            <Navbar />
            <Hero />
            <Trusted />
            <Features />
            <Showcase />
            <Pricing />
            <FAQ />
            <CTA />
            <WhyORBIQ />
            <Footer />
        </div>
    );
}

export default Home;