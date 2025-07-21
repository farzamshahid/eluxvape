import React, { useEffect, useState } from "react";
import DesktopView from "../components/desktopView";
import MobileView from "../components/mobileView";
const VerifyAge = () => {

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 1023);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>

            {isMobile ? <MobileView /> : <DesktopView />}
        </>
    );
};

export default VerifyAge;
