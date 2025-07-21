import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";

const renderCheckCode = (code, status) => {
    if (status === 'fake') return 'XXXXXXXXXXXXXXXXXX';

    if (!code || code.length < 5) return code;

    const chars = code.split('');
    const revealIndex = chars.length - 5;

    return (
        <>
            {chars.map((char, i) => (
                <span key={i} className="inline-block">
                    {i === revealIndex ? (
                        <span className="bg-black">{char}</span>
                    ) : (
                        'X'
                    )}
                </span>
            ))}
        </>
    );
};
const renderAntiCode = (code, status) => {
    if (!code || code.length < 5) return code;

    const revealIndex = code.length - 5;

    return (
        <>
            {code.split('').map((char, i) => (
                <span key={i} className="inline-block">
                    {status === 'genuine' && i === revealIndex ? (
                        <span className="bg-black text-white px-[0.15vw] rounded-[0.1vw]">{char}</span>
                    ) : (
                        <span>{char}</span>
                    )}
                </span>
            ))}
        </>
    );
}
const MobileView = () => {
    const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({
        products: false,
        spotlights: false,
        support: false,
    });
    const [showImage, setShowImage] = useState(true);
    const [showImage1, setShowImage1] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(null); // 'loading', 'genuine', 'fake'
    const [resultData, setResultData] = useState(null);
    const genuineCodes = new Set([
        '143526569934334',
        '783702379089899',
        '824943947310990',
        '123879289049043',
        '236237898823231'
    ]);

    const handleVerify = () => {
        if (!inputValue) return;

        setVerificationStatus('loading');
        setResultData(null);

        setTimeout(() => {
            const verificationData = JSON.parse(localStorage.getItem('verificationData')) || {};
            const codeExists = genuineCodes.has(inputValue);

            if (codeExists) {
                let codeData = verificationData[inputValue];
                const now = new Date();

                if (codeData) {
                    codeData.queryTimes += 1;
                } else {
                    codeData = {
                        firstVerified: now.toISOString(),
                        queryTimes: 0,
                    };
                }

                verificationData[inputValue] = codeData;
                localStorage.setItem('verificationData', JSON.stringify(verificationData));

                setResultData({
                    company: 'Shenzhen ELUX Technology Co.,Ltd.',
                    code: inputValue,
                    queryTimestamp: new Date(codeData.firstVerified),
                    queryCount: Number(codeData.queryTimes),
                });
                setVerificationStatus('genuine');
            } else {
                setResultData({
                    company: "Can't find it",
                    code: inputValue,
                    message: "The anti-counterfeit code you queried is not exist",
                });
                setVerificationStatus('fake');
            }

            const resultSection = document.getElementById('result-section');
            if (resultSection) {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        }, 1500);
    };


    const handleRemoveImage = () => {
        setShowImage(false);
    };

    // const handleRemoveImage1 = () => {
    //     setShowImage1(false);
    // };
    const toggleExpandedMenu = (menu) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    // Add this function to toggle the menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    useEffect(() => {
        const handleScroll = () => {
            const verifySection = document.getElementById('result-section');
            const isMobileOrTablet = window.innerWidth <= 1023;

            if (!verifySection || !isMobileOrTablet) return;

            const sectionTop = verifySection.offsetTop;
            const sectionBottom = sectionTop + verifySection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight;

            if (window.scrollY >= sectionTop && scrollPosition <= document.body.scrollHeight) {
                setIsMobileHeaderVisible(true);
            } else if (window.scrollY < sectionTop || scrollPosition > sectionBottom + 100) {
                setIsMobileHeaderVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll); // for responsiveness
        handleScroll(); // initial call

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="w-full font-manrope font-medium flex items-center justify-center text-center bg-black text-white text-[3.2vw] relative z-[90] h-[13.333vw]">
                WARNING: This product contains nicotine.<br />Nicotine is an addictive chemical.</div>
            <header>
                <div className={`h-[18.26667vw] px-[2.60417vw] flex items-center justify-between w-full bg-white fixed left-0 top-0 z-[99] transition-all duration-500 shadow-[0_2px_4px_rgba(41,41,41,0.06)] transform ${isMobileHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>

                    {/* Left spacer to balance the hamburger on the right */}
                    <div className="w-8 h-8"></div>

                    {/* Centered Logo */}
                    <div className="w-[46.66667vw] flex justify-center">
                        <a href="https://www.eluxtech.com/verify/" className='no-underline text-[#333]'>
                            <img className="border-none align-middle select-none max-w-full w-full transition-all duration-200" src="images/logo_black.svg" alt="ELUX logo" />
                        </a>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden lg:flex">
                        <div className="group px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center relative">
                            <div className="overflow-hidden">
                                <a className='relative inline-block transition-transform duration-[250ms] font-manrope font-bold text-black hover:-translate-y-full'>
                                    Products
                                    <span className="absolute top-full w-full left-0">Products</span>
                                </a>
                            </div>

                            <div className="text-[0.83333vw] fixed left-0 w-full bg-[rgba(65,65,65,0.6)] text-center transition-all duration-300 hidden group-hover:flex justify-between top-full">
                                <div className="text-left ml-[31%] w-[18%]">
                                    <ul className='list-none'>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className="text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-white py-[0.10417vw] text-white hover:bg-black/60 after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]" href="https://www.eluxtech.com/products/">
                                                NEW ARRIVAL
                                            </a>
                                        </li>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className="text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-transparent py-[0.10417vw] text-white hover:bg-black/60 after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]" href="https://www.eluxtech.com/verify/products?type=disposable">
                                                DISPOSABLE
                                            </a>
                                        </li>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className="text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-transparent py-[0.10417vw] text-white hover:bg-black/60 after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]" href="https://www.eluxtech.com/products?type=pod-system">
                                                POD SYSTEM
                                            </a>
                                        </li>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className="text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-transparent py-[0.10417vw] text-white hover:bg-black/60 after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]" href="https://www.eluxtech.com/products?type=nic-salts">
                                                E-LIQUID
                                            </a>
                                        </li>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className="text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-transparent py-[0.10417vw] text-white hover:bg-black/60 after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]" href="https://www.eluxtech.com/products?type=nicotine-pouch">
                                                NICOTINE POUCH
                                            </a>
                                        </li>
                                        <li className='py-[0.3125vw] w-[8.33333vw] relative'>
                                            <a className='text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in border-b border-transparent py-[0.10417vw] text-white hover:bg-black/60' href="https://www.eluxtech.com/oem-odm/">ODM/OEM</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="h-full w-[63%] overflow-hidden relative">
                                    <div className="h-full absolute left-0 top-0 visible translate-y-0 opacity-100 transition-all duration-[500ms]">
                                        <ul className='flex items-center h-full translate-y-[-4%] list-none'>
                                            <li className='text-center px-[0.78125vw]'>
                                                <a href="https://www.eluxtech.com/products/legend-1500-2-in-1/" className='cursor-pointer relative inline-block transition-transform duration-[250ms] font-manrope font-bold'>
                                                    <img className="w-[5.20833vw] h-[5.20833vw] transition-all duration-[500ms] opacity-100" src="images/legend.jpg" alt="LEGEND 1500 2 in 1 Vape" />
                                                    <p className="text-[0.67708vw] text-center mt-[0.52083vw] text-white">LEGEND 1500 2 in 1</p>
                                                </a>
                                            </li>
                                            <li className='text-center px-[0.78125vw]'>
                                                <a href="https://www.eluxtech.com/products/cyberover-p1/" className='cursor-pointer relative inline-block transition-transform duration-[250ms] font-manrope font-bold'>
                                                    <img className="w-[5.20833vw] h-[5.20833vw] transition-all duration-[500ms] opacity-100" src="images/cyberover.jpg" alt="CYBEROVER P1 Vape" />
                                                    <p className="text-[0.67708vw] text-center mt-[0.52083vw] text-white">CYBEROVER P1</p>
                                                </a>
                                            </li>
                                            <li className='text-center px-[0.78125vw]'>
                                                <a href="https://www.eluxtech.com/products/cyberover-6k/" className='cursor-pointer relative inline-block transition-transform duration-[250ms] font-manrope font-bold'>
                                                    <img className="w-[5.20833vw] h-[5.20833vw] transition-all duration-[500ms] opacity-100" src="images/cyber6k.jpg" alt="CYBEROVER 6K Vape" />
                                                    <p className="text-[0.67708vw] text-center mt-[0.52083vw] text-white">CYBEROVER 6K</p>
                                                </a>
                                            </li>
                                            <li className='text-center px-[0.78125vw]'>
                                                <a href="https://www.eluxtech.com/products/cyberover/" className='cursor-pointer relative inline-block transition-transform duration-[250ms] font-manrope font-bold'>
                                                    <img className="w-[5.20833vw] h-[5.20833vw] transition-all duration-[500ms] opacity-100" src="images/whirlwinf.jpg" alt="CYBEROVER Vape" />
                                                    <p className="text-[0.67708vw] text-center mt-[0.52083vw] text-white">CYBEROVER</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <a href="https://www.eluxtech.com/oem-odm/" className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    ODM/OEM
                                    <span className="absolute top-full w-full left-0">ODM/OEM</span>
                                </a>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <a href="https://www.eluxtech.com/contact/" className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    CONTACT
                                    <span className="absolute top-full w-full left-0">CONTACT</span>
                                </a>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center group relative">
                            <div className="overflow-hidden">
                                <a className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    SPOTLIGHTS
                                    <span className="absolute top-full w-full left-0">SPOTLIGHTS</span>
                                </a>
                            </div>
                            <div className="text-[0.83333vw] fixed left-0 w-full bg-[rgba(65,65,65,0.6)] text-center transition-all duration-300 hidden group-hover:flex group-hover:justify-center items-center top-full">
                                <a href="https://www.eluxtech.com/news/" className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 transition-colors font-manrope font-bold duration-200">NEWS</a>
                                <a href="https://www.eluxtech.com/events/" className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">EVENTS</a>
                                <a href="https://www.eluxtech.com/recycle-program/" className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">SUSTAINABILITY</a>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <a href="https://www.eluxtech.com/about-elux/" className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    ABOUT US
                                    <span className="absolute top-full w-full left-0">ABOUT US</span>
                                </a>
                            </div>
                        </div>

                        <div className="group mr-0 px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center relative">
                            <div className="overflow-hidden">
                                <a className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    SUPPORT
                                    <span className="absolute top-full w-full left-0">SUPPORT</span>
                                </a>
                            </div>
                            <div className="text-[0.83333vw] fixed left-0 w-full bg-[rgba(65,65,65,0.6)] text-center transition-all duration-300 hidden group-hover:flex group-hover:justify-center items-center top-full">
                                <a href="https://www.eluxtech.com/verify/" className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">VERIFY PRODUCT</a>
                                <a href="https://www.eluxtech.com/download/" className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">DOWNLOAD</a>
                            </div>
                        </div>
                    </nav>
                    {/* Mobile Menu Button */}
                    <button
                        className="flex flex-col justify-center items-center w-8 h-8"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1"}`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "mb-1"}`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                        ></span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-[#141414] z-[100] flex flex-col">
                    {/* Mobile Menu Header */}
                    <div className="flex flex-col">
                        <div className="h-10 flex items-center justify-center">
                            <button
                                onClick={closeMobileMenu}
                                className="text-white text-2xl h-6 w-6 flex items-center justify-center"
                                aria-label="Close mobile menu"
                            >
                                ×
                            </button>
                        </div>
                        <div className="h-12 flex items-center justify-center">
                            <div className="text-white text-[3.7vw] font-bold tracking-wider">
                                BEYOND TOMORROW
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex-1 px-4 overflow-y-auto">
                        <nav className="space-y-0">
                            {/* Products Menu */}
                            <div className="border-b border-gray-700">
                                <button
                                    onClick={() => toggleExpandedMenu("products")}
                                    className="w-full text-white text-[3.6vw]  font-manrope font-bold uppercase tracking-wide flex items-center justify-between py-.5 px-4"
                                >
                                    <span>PRODUCTS</span>
                                    <span className="text-white text-3xl">›</span>
                                </button>
                                {expandedMenus.products && (
                                    <div className="pb-2 ml-4 space-y-2 animate-fadeIn">
                                        <a href="https://www.eluxtech.com/products?type=disposable" className="block text-white text-xs  font-manrope font-medium uppercase py-1">DISPOSABLE</a>
                                        <a href="https://www.eluxtech.com/products?type=pod-system" className="block text-white text-xs  font-manrope font-medium uppercase py-1">POD SYSTEM</a>
                                        <a href="https://www.eluxtech.com/products?type=nic-salts" className="block text-white text-xs font-manrope font-medium uppercase py-1">E-LIQUID</a>
                                        <a href="https://www.eluxtech.com/products?type=nicotine-pouch" className="block text-white  font-manrope font-medium text-xs uppercase py-1">NICOTINE POUCH</a>
                                    </div>
                                )}
                            </div>

                            {/* OEM/ODM Menu */}
                            <div className="border-b border-gray-700">
                                <a href="https://www.eluxtech.com/oem-odm/" className="block text-[3.6vw] text-white text-sm font-manrope font-bold uppercase tracking-wide py-2.5 px-4">
                                    OEM / ODM
                                </a>
                            </div>

                            {/* Spotlights Menu */}
                            <div className="border-b border-gray-700">
                                <button
                                    onClick={() => toggleExpandedMenu("spotlights")}
                                    className="w-full text-white  font-manrope font-bold uppercase tracking-wide flex items-center justify-between py-.5 text-[3.6vw] px-4"
                                >
                                    <span>SPOTLIGHTS</span>
                                    <span className="text-white text-3xl">›</span>
                                </button>
                                {expandedMenus.spotlights && (
                                    <div className="pb-2 ml-4 space-y-2 animate-fadeIn">
                                        <a href="https://www.eluxtech.com/news/" className="block  font-manrope font-medium text-white text-xs uppercase py-1">NEWS</a>
                                        <a href="https://www.eluxtech.com/events/" className="block  font-manrope font-medium text-white text-xs uppercase py-1">EVENTS</a>
                                        <a href="https://www.eluxtech.com/recycle-program/" className="block  font-manrope font-medium text-white text-xs uppercase py-1">SUSTAINABILITY</a>
                                    </div>
                                )}
                            </div>

                            {/* Contact Menu */}
                            <div className="border-b border-gray-700">
                                <a href="https://www.eluxtech.com/contact/" className="block text-white text-[3.6vw]  font-manrope font-bold uppercase tracking-wide py-2.5 px-4">
                                    CONTACT
                                </a>
                            </div>

                            {/* About Us Menu */}
                            <div className="border-b border-gray-700">
                                <a href="https://www.eluxtech.com/about-elux/" className="block text-white text-[3.6vw]  font-manrope font-bold uppercase tracking-wide py-2.5 px-4">
                                    ABOUT US
                                </a>
                            </div>

                            {/* Support Menu */}
                            <div className="border-b border-gray-700">
                                <button
                                    onClick={() => toggleExpandedMenu("support")}
                                    className="w-full text-white text-[3.6vw]  font-manrope font-bold uppercase tracking-wide flex items-center justify-between py-.5 px-4"
                                >
                                    <span>SUPPORT</span>
                                    <span className="text-white text-3xl">›</span>
                                </button>
                                {expandedMenus.support && (
                                    <div className="pb-2 ml-4 space-y-2 animate-fadeIn">
                                        <a href="https://www.eluxtech.com/verify/" className="block  font-manrope font-medium text-white text-xs uppercase py-1">VERIFY PRODUCT</a>
                                        <a href="https://www.eluxtech.com/download/" className="block  font-manrope font-medium text-white text-xs uppercase py-1">DOWNLOAD</a>
                                    </div>
                                )}
                            </div>

                            {/* Search Bar */}
                            <div className="mt-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-[#BFBFBF] text-black py-[7px] pl-4 pr-10  font-manrope font-medium rounded"
                                    />
                                    <button className="absolute right-3 top-1/2  font-manrope font-medium transform -translate-y-1/2">
                                        <FiSearch className="text-black" />
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
            {verificationStatus === 'genuine' && resultData && (
                <section id='result-section' className="max-w-full px-[6.66667vw]   w-full  mx-auto">
                    <div className="w-[65.73333vw] h-[41.06667vw] mt-[5.33333vw] px-[6.66667vw] py-[2.66667vw] relative mx-auto">
                        <img className=" w-full h-full object-cover absolute top-0 left-0" src="verify/genuine.jpg" alt="Genuine Product" />
                    </div>
                    <div className="mt-[5.33333vw] bg-[#468fb2] pt-[2.66667vw] pr-[6.66667vw] pb-[5.33333vw] pl-[5.33333vw]  rounded-t-[1.30208vw]">
                        <ul className='list-none'>
                            <li id="company" className=" flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>COMPANY</div>
                                <p className='text-[3.73333vw] text-right font-manrope font-light'>{resultData.company}</p>
                            </li>
                            <li id="code" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>ANTI-CODE</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center  font-manrope font-light'>{renderAntiCode(resultData.code, verificationStatus)}</p>
                            </li>
                            <li id="query_time" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>Query Times</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center  font-manrope font-light'>{resultData.queryTimestamp.toLocaleTimeString('en-GB')} {resultData.queryTimestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    <br />First check</p>  </li>
                            <li id="time_querise" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>TIMES OF QUERY</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center  font-manrope font-light'>{resultData.queryCount}</p>
                            </li>
                            <li id="check_code" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto font-manrope font-bold'>Check Code</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center font-manrope font-light'>
                                    {renderCheckCode(resultData.code, verificationStatus)}
                                </p> </li>
                        </ul>
                    </div>
                </section>
            )}
            {verificationStatus === 'fake' && resultData && (
                <section className="max-w-full px-[6.66667vw]   w-full  mx-auto">
                    <div className="w-[65.73333vw] h-[41.06667vw] mt-[5.33333vw] px-[6.66667vw] py-[2.66667vw] relative mx-auto">
                        <img className=" w-full h-full object-cover absolute top-0 left-0" src="verify/fake.jpg" alt="Fake Product" />
                    </div>
                    <div className="mt-[5.33333vw] bg-[#b40105] pt-[2.66667vw] pr-[6.66667vw] pb-[5.33333vw] pl-[5.33333vw]  rounded-t-[1.30208vw]">
                        <ul className='list-none'>
                            <li id="company" className=" flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>COMPANY</div>
                                <p className='text-[3.73333vw] text-right font-manrope font-light'>{resultData.company}</p>
                            </li>
                            <li id="code" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>ANTI-CODE</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center  font-manrope font-light'>{renderAntiCode(resultData.code, verificationStatus)}</p>
                            </li>
                            <li id="query_time" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto  font-manrope font-bold'>Query Times</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center  font-manrope font-light'>{resultData.message}</p>
                            </li>
                            <li id="check_code" className="flex-col py-[2.66667vw] border-b border-white text-white flex justify-between items-center">
                                <div className='text-[4.26667vw] text-center w-auto font-manrope font-bold'>Check Code</div>
                                <p className='text-[3.73333vw] mt-[1.33333vw] text-center font-manrope font-light'>{renderCheckCode(resultData.code, verificationStatus)}</p>
                            </li>
                        </ul>
                    </div>
                </section>
            )}
            <section className="flex flex-col px-[6.66667vw] py-[5.33333vw] bg-[#383838]  items-center justify-around">
                <div className="w-full mb-[9.33333vw]">
                    <p className='text-[4.26667vw] mb-[4vw] text-white text-center   font-manrope font-light'>ELUX new anti-counterfeit instructions</p>
                    <video
                        preload="auto"
                        autoPlay
                        loop
                        playsInline
                        webkit-playsinline="true"
                        id="verify_video"
                        className='w-full h-full object-cover rounded-[1.33333vw]'
                        src="videos/eluxtechvideo.mp4"
                        muted
                    ></video>
                </div>

                <div className="text-center text-white">
                    <h1 className='text-[5.33333vw] mb-[1.04167vw] font-manrope font-bold'>Verify Product</h1>
                    <p className='font-manrope font-light text-[3.46667vw]'>
                        Locate the authentication label and scratch off its coating to
                        obtain the anti-counterfeiting code. Then scan or enter your security code below.
                    </p>

                    <div className="my-[4vw] relative">
                        <input onChange={(e) => setInputValue(e.target.value.trim())}
                            value={inputValue} onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    handleVerify();
                                }
                            }}
                            id="input_code" type="text" className='h-[9.33333vw] outline-none text-black font-manrope font-medium leading-[9.33333vw] text-[3.46667vw] px-[4vw] rounded-[8vw] w-full bg-white' />
                        <button onClick={handleVerify}
                            disabled={verificationStatus === 'loading'}
                            className="w-[18.66667vw] h-[8vw] leading-[8vw] rounded-[8vw] right-[0.8vw] text-[3.73333vw] cursor-pointer absolute  top-1/2 -translate-y-1/2 
                 text-white font-manrope font-bold   text-center   bg-black">Verify</button>
                        <label id="code_error" className="hidden absolute top-full left-0 w-full text-center text-[#D50000] text-[0.72917vw] pt-[0.26042vw]" htmlFor="code">
                            This field is required.
                        </label>
                    </div>
                </div>
            </section>
            <section className="py-[6.66667vw]  text-center">
                <h2 className="text-[4.8vw] font-manrope font-bold  mb-[0.78125vw]">WHY WE UPDATE ?</h2>
                <p className="mt-[4vw] text-[3.46667vw] px-[6.66667vw] font-manrope font-extralight">
                    We use advanced anti-counterfeiting technology, significantly reducing the possibility of any counterfeiting product,
                    the adoption of this technology can prevent the phenomenon of fake and shoddy products to the greatest extent,
                    which provides a strong guarantee for everyone's health, safety and interests. Thank you for purchasing ELUX products,
                    please insist on purchasing genuine products from regular channels, and you are welcome to buy again!
                </p>
            </section>
            <section className="text-center pb-[1.5625vw]">
                <h2 className="text-[4.8vw] font-manrope font-bold  mb-[0.52083vw]">OLD CODE VERIFICATION</h2>
                <img className="w-[45.33333vw] mt-[1.33333vw] border-none  max-w-full mx-auto" src="images/old_code.png" />
                <div className="w-[80%] my-[5.33333vw] mx-auto  relative">
                    <input id="old_input_code" className='w-full h-[10.66667vw] leading-[10.66667vw] text-[4vw] px-[5.33333vw] rounded-[8vw] outline-none  border border-black' type="text" />
                    <button className="text-[3.73333vw] rounded-[8vw] w-[21.33333vw] h-[8.8vw] leading-[8.8vw] right-[0.8vw] absolute  top-1/2 -translate-y-1/2
                text-white  text-center bg-black  font manrope font-bold cursor-pointer">Verify</button>
                </div>
            </section>
            {verificationStatus === 'loading' && (
                <div className="fixed  w-full h-full top-0 left-0 bg-black/50">
                    <div className="flex flex-col items-center relative left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto">
                        <div className="w-[13.33333vw] h-[13.33333vw]  relative">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-60"></div>
                            <div style={{ animationDelay: '-1s' }} className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-60"></div>
                        </div>
                        <span className="text-[4.26667vw] text-white">  Loading...</span>
                    </div>
                </div>)}
            <footer className="pt-[5.33333vw] pb-0 w-full relative z-[2] px-[6.66667vw] bg-black">
                <div className="flex  flex-col justify-between pb-[4vw] relative z-[3]">
                    {/* Logo & Slogan */}
                    <div className="flex flex-col items-baseline  mt-[5.33333vw] mb-[5.33333vw]">
                        <Link to="/" className='no-underline'>
                            <img
                                className="w-[46.13333vw] duration-300"
                                src="images/logo_white.svg"
                                alt="ELUX Vape"
                            />
                        </Link>
                        <h4 className='text-white text-[4vw] font-manrope font-bold text-center mt-[2vw]'>BEYOND TOMORROW</h4>
                    </div>

                    {/* Navigation & Contact */}
                    <div className="flex space-between">
                        {/* Navigation Links */}
                        <div className="text-white hidden">
                            <h5 className='mb-[.60208vw] font-manrope font-bold text-[1.04167vw]'>NAVIGATE</h5>
                            <ul className="list-none">
                                <li className=''><Link className='font-manrope font-extralight text-[0.83333vw] text-white hover:text-gray-300 transition-colors duration-200' to="https://www.eluxtech.com/products/">PRODUCTS</Link></li>
                                <li className=''><Link className='font-manrope font-extralight text-[0.83333vw] text-white hover:text-gray-300 transition-colors duration-200' to="https://www.eluxtech.com/recycle-program/">SUSTAINABILITY</Link></li>
                                <li className=''><Link className='font-manrope font-extralight text-[0.83333vw] text-white hover:text-gray-300 transition-colors duration-200' to="https://www.eluxtech.com/contact/">CONTACT</Link></li>
                                <li className=''><Link className='font-manrope font-extralight text-[0.83333vw] text-white hover:text-gray-300 transition-colors duration-200' to="https://www.eluxtech.com/about-elux/">ABOUT US</Link></li>
                                <li className=''><Link className='font-manrope font-extralight text-[0.83333vw] text-white hover:text-gray-300 transition-colors duration-200' to="https://www.eluxtech.com/verify/">VERIFY PRODUCT</Link></li>
                            </ul>
                        </div>

                        {/* Contact Information */}
                        <div className="m-0 text-white">
                            <h5 className='text-[3.73333vw] mb-[2.66667vw]  font-manrope font-bold '>LET'S COLLABORATE</h5>
                            <p className='flex items-center relative mb-[2vw]'><Link className='no-underline font-manrope font-extralight text-[3.46667vw] text-white hover:text-gray-300 transition-colors duration-200' to="mailto:info@eluxtech.com">info@eluxtech.com</Link></p>
                            <p className='flex items-center relative mb-[2vw]'><Link className='no-underline font-manrope font-extralight mb-0 text-[3.46667vw] text-white hover:text-gray-300 transition-colors duration-200' to="mailto:sales@eluxtech.com">sales@eluxtech.com</Link></p>
                            <p className='flex items-center relative mb-[2vw]'><Link className='no-underline font-manrope font-extralight text-[3.46667vw] text-white hover:text-gray-300 transition-colors duration-200' to="mailto:marketing@eluxtech.com">marketing@eluxtech.com</Link></p>
                            <p className='flex items-center relative mb-[2vw]'><Link className='no-underline font-manrope font-extralight text-[3.46667vw] text-white hover:text-gray-300 transition-colors duration-200' to="mailto:support@eluxtech.com">support@eluxtech.com</Link></p>
                            <p className='flex items-center relative mb-[2vw]'><Link className='no-underline font-manrope font-extralight text-[3.46667vw] text-white hover:text-gray-300 transition-colors duration-200' to="tel:+8618824307008">+86 - 18824307008</Link></p>
                        </div>
                    </div>

                    {/* Newsletter & Social */}
                    <div className='flex flex-col'>
                        <div className="text-white order-3 mt-[1.73333vw]">
                            <h5 className='mb-[1.9208vw] font-manrope font-bold text-[4.04167vw]'>SUBSCRIBE TO OUR NEWSLETTER</h5>
                        </div>
                        <div className="mt-0 mb-[1.5625vw] order-4">
                            <form className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email here"
                                    className="h-[11.46667vw] pl-[4vw] text-[3.73333vw] rounded-[8vw] w-full   bg-white  focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="text-[3.73333vw] rounded-full py-[2.66667vw] px-[5.33333vw] absolute right-[0.15625vw] top-1/2 transform -translate-y-1/2 bg-black text-white"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>

                        <div className="text-white order-1 mt-[1.73333vw]">
                            <h5 className='text-[3.73333vw] mb-[2.66667vw] font-manrope font-bold'>FOLLOW US</h5>
                            <ul className="mb-[4vw] flex items-center">
                                <li className='mr-[1.33333vw]'>
                                    <Link to="https://www.facebook.com/eluxtechofficial/" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/round-black-facebook-fb-logo-icon-sign-701751695134781upkxjlqwck.png" alt="Facebook" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw]'>
                                    <Link to="http://www.linkedin.com/in/eluxtech" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/in.png" alt="LinkedIn" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw]'>
                                    <Link to="https://www.youtube.com/@eluxtechofficial/featured" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/youtube-glyph-icon-for-personal-and-commercial-use-free-vector.jpg" alt="YouTube" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw]'>
                                    <Link to="https://twitter.com/eluxtech" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/x.png" alt="X (Twitter)" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw]'>
                                    <Link to="https://vk.com/eluxtech" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/vk.png" alt="VK" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw]'>
                                    <Link to="https://www.pinterest.com/eluxtech_official/" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/pin.png" alt="Pinterest" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                                <li className='mr-[1.33333vw] '>
                                    <Link to="https://www.instagram.com/eluxtechofficial/" target="_blank" rel="noreferrer" className="block w-[8vw] h-[8vw]">
                                        <img src="images/insta.jpg" alt="Instagram" className="w-full h-full object-contain" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >

                {/* Copyright */}
                < div className="text-center text-[3.46667vw] pb-[6.66667vw]  font-manrope text-[#8a8a8a]  font-extralight relative z-[3]" >
                    Copyright © 2025 ELUX | All Rights Reserved
                </div >
            </footer >
            {showImage && (
                <div className="fixed bottom-[14vw] right-[.22083vw] z-[99]  w-[17.875vw]">
                    <Link className='inline-block relative cursor-pointer no-underline text-black' to="https:forms.gle/d8iPKEBnCwxvdm47A" target="_blank" rel="nofollow">
                        <img lazyload="" className="w-full animate-pulse" src="images/pop_form.png" alt="ELUX Vape" />
                    </Link>
                    <AiOutlineClose className="cursor-pointer absolute bottom-[55px] right-[9px] translate-x-[50%] -translate-y-[50%] bg-[#414141] text-white w-[20px] h-[20px] text-xs flex items-center justify-center rounded-sm"
                        onClick={handleRemoveImage}
                    />
                </div>)}
            {/* {showImage1 && (
                <div className="fixed bottom-[53.1875vw] right-[0.52083vw] z-[99] w-[17.875vw]">
                    <Link to="https:www.eluxtech.com/find-my-flavour/" className='relative no-underline text-black inline-block' target="_blank" rel="nofollow">
                        <img src="/images/giveaways_flavour.webp" className='w-full animate-pulse' alt="ELUX Vape" />
                    </Link>
                    <button onClick={handleRemoveImage1} className='fixed right-[3px] top-[277px] bg-[#141414] text-white w-[20px]'>x</button>
                </div>
            )} */}
            <div className="fixed right-[10px] bottom-4 z-110">
                <button
                    onClick={() => window.chaport.open()}
                    className="w-12 h-12 rounded-full bg-[#383838] flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
                >
                    <img
                        src="images/chaport-launcher-chat-icon-new@2x.png"

                        className="w-7 h-7 object-contain"
                    />
                </button>
            </div>

        </>
    )
}
export default MobileView