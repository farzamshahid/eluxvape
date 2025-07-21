import { React, useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
                        <span className="bg-black text-white">{char}</span>
                    ) : (
                        <span>{char}</span>
                    )}
                </span>
            ))}
        </>
    );
};

const DesktopView = () => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(false)
    const [showImage, setShowImage] = useState(true);
    const [activeProduct, setActiveProduct] = useState('new-arrival');
    const oldVerifyRef = useRef(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    // const [showImage1, setShowImage1] = useState(true);
    const [isProductHovered, setIsProductHovered] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
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
        if (!inputValue.trim()) return;

        // Scroll first
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setVerificationStatus('loading');
        setResultData(null);

        setTimeout(() => {
            const verificationData = JSON.parse(localStorage.getItem('verificationData')) || {};
            const codeExists = genuineCodes.has(inputValue.trim());

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
                    queryCount: codeData.queryTimes,
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

        }, 1500);
    };


    useEffect(() => {
        const handleScroll = () => {
            if (!oldVerifyRef.current) return;

            const rect = oldVerifyRef.current.getBoundingClientRect();
            const imageCenterY = rect.top + rect.height / 2;

            const viewportHeight = window.innerHeight;

            const centerInView = imageCenterY >= 0 && imageCenterY <= viewportHeight;

            const reachedBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;

            setShowArrow(centerInView || reachedBottom);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const closeSearch = () => {
        setIsSearchVisible(false);
    };



    const productImages = {
        'new-arrival': [
            { src: 'images/menu/legend_1500_2in1.webp', name: 'LEGEND 1500 2 IN 1' },
            { src: 'images/menu/cyberover_p1.webp', name: 'CYBEROVER P1' },
            { src: 'images/menu/cyberover_6k_new.webp', name: 'CYBEROVER 6K' },
            { src: 'images/menu/cyberover_new.webp', name: 'CYBEROVER' }
        ],
        'disposable': [
            { src: 'images/menu/whirlwind.webp', name: 'WHIRLWIND' },
            { src: 'images/menu/cyberover_6k.webp', name: 'CYBEROVER 6K' },
            { src: 'images/menu/legend3500_hri.webp', name: 'LEGEND 3500 HRI' },
        ],
        'pod-system': [
            { src: 'images/menu/legend_1500_2in1.webp', name: 'LEGEND 1500 2 IN 1' },
            { src: 'images/menu/cyberover_p1.webp', name: 'CYBEROVER P1' },
            { src: 'images/menu/legend_plus.webp', name: 'LEGEND PLUS' },
            { src: 'images/menu/legend_prime.webp', name: 'LEGEND PRIME' },
        ],
        'e-liquid': [
            { src: 'images/menu/legend.webp', name: 'LEGEND E-LIQUID' },
        ],
        'nicotine-pouch': [
            { src: 'images/menu/pouches.webp', name: 'NICOTINE POUCHES' },
        ],
        'odm-oem': [
            { src: 'images/menu/in7500.webp', name: 'IN7500' },
            { src: 'images/menu/ex4500_special.webp', name: 'ex4500_special' },
        ],
    };

    const handleRemoveImage = () => {
        setShowImage(false);
    };


    useEffect(() => {
        const handleScroll = () => {
            const verifySection = document.getElementById('result-section');
            const isDesktopOrLaptop = window.innerWidth > 1023;

            if (!verifySection || !isDesktopOrLaptop) return;

            const sectionTop = verifySection.offsetTop;
            const sectionBottom = sectionTop + verifySection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight;

            if (window.scrollY >= sectionTop && scrollPosition <= document.body.scrollHeight) {
                setIsHeaderVisible(true);
            } else if (window.scrollY < sectionTop || scrollPosition > sectionBottom + 100) {
                setIsHeaderVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const handleBlurClick = () => {
        closeSearch();
    };

    return (
        <>
            <div className="w-full h-[4.16667vw] font-manrope font-medium flex items-center justify-center text-center bg-black text-white text-[0.88542vw] relative z-[90] transition-all duration-300 ease-in-out ">
                WARNING: This product contains nicotine.<br />Nicotine is an addictive chemical.</div >
            <header>
                <div
                    className={`px-[2.60417vw] flex items-center justify-between h-[4.16667vw] w-full bg-white fixed left-0 top-0 z-[99] transition-all duration-500 shadow-[0_2px_4px_rgba(41,41,41,0.06)] transform ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>

                    {isSearchVisible && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
                            onClick={closeSearch}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div
                                    className="relative w-1/3 my-4 mr-4 ml-42"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-[330px] p-1 pl-5 text-md rounded-full border-2 border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-500"
                                    />
                                    <img
                                        className="absolute right-32 top-1/2 font-bolf transform -translate-y-1/2 mr-2 w-4 h-4 cursor-pointer"
                                        src="images/search_black.svg"
                                        alt="Search"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-[10.9375vw] ml-[7.8125vw] relative">
                        <Link to="https://www.eluxtech.com/" className='no-underline text-[#333]'>
                            <img className="border-none align-middle select-none max-w-full w-full transition-all duration-200"
                                src="images/logo_black.svg" alt="ELUX logo" />
                            <img className="border-none align-middle select-none max-w-full absolute left-0 top-0 opacity-0 w-full transition-all duration-200"
                                src="images/logo_white.svg" alt="ELUX logo" />
                        </Link>
                    </div>

                    <nav className="uppercase flex h-full items-center">
                        <div className="group px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center relative"
                            onMouseEnter={() => setIsProductHovered(true)}
                            onMouseLeave={() => setIsProductHovered(false)}
                        >
                            <div className="overflow-hidden">
                                <a
                                    className='relative inline-block transition-transform duration-[250ms] font-manrope font-bold text-black hover:-translate-y-full' href='https://www.eluxtech.com/products/' >
                                    Products
                                    <span className="absolute top-full w-full left-0">Products</span>
                                </a>
                            </div>

                            <div
                                className="text-[0.83333vw] fixed left-0 w-full bg-white backdrop-blur-md shadow-xl text-center transition-all duration-300 hidden group-hover:flex justify-center items-start gap-[5vw] top-full py-[2vw]">
                                <div className="text-left ml-[140px]">
                                    <ul className='list-none'>
                                        {[
                                            { label: 'NEW ARRIVAL', key: 'new-arrival', url: 'https://www.eluxtech.com/products/' },
                                            { label: 'DISPOSABLE', key: 'disposable', url: 'https://www.eluxtech.com/products/?type=disposable' },
                                            { label: 'POD SYSTEM', key: 'pod-system', url: 'https://www.eluxtech.com/products?type=pod-system' },
                                            { label: 'E-LIQUID', key: 'e-liquid', url: 'https://www.eluxtech.com/products?type=nic-salts' },
                                            { label: 'NICOTINE POUCH', key: 'nicotine-pouch', url: 'https://www.eluxtech.com/products?type=nicotine-pouch' },
                                            { label: 'ODM/OEM', key: 'odm-oem', url: 'https://www.eluxtech.com/oem-odm/' },
                                        ].map(({ label, key, url }) => (
                                            <li
                                                key={key}
                                                className="py-[0.3125vw] font-manrope font-bold w-[8.33333vw] relative"
                                                onMouseEnter={() => setActiveProduct(key)}
                                            >
                                                <Link
                                                    className={`text-[0.72917vw] inline-block transition-all duration-[50ms] ease-in py-[0.10417vw] text-black border-b ${activeProduct === key ? 'border-black' : 'border-transparent'
                                                        } after:absolute after:right-0 after:top-1/2 after:transform after:-translate-y-1/2 after:rotate-[-90deg] after:bg-[url('images/nav_arrow.svg')] after:bg-no-repeat after:bg-center after:bg-[length:100%] after:h-[0.57292vw] after:w-[0.46875vw]`}
                                                    to={url}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-[35%] flex flex-col">
                                    <div className="flex flex-wrap gap-[1vw] justify-center items-center mb-[1.5vw]">
                                        {productImages[activeProduct]?.map((product, index) => (
                                            <div key={index} className="text-center flex flex-col items-center justify-center">
                                                <img
                                                    src={product.src}
                                                    alt={`preview-${activeProduct}-${index}`}
                                                    className="w-[6vw] h-[6vw] object-contain transition-all duration-300 mb-[0.5vw]"
                                                />
                                                <p className="text-[0.6vw] font-manrope font-semibold text-black uppercase tracking-wide">
                                                    {product.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center">
                                        {activeProduct !== 'new-arrival' && (
                                            <div className="flex justify-center">
                                                <Link
                                                    to={`https://www.eluxtech.com/products?type=${activeProduct}`}
                                                    className=" text-black px-[1.5vw] py-[0.5vw] text-[0.7vw] font-manrope font-bold uppercase  transition-colors duration-200 no-underline flex items-center gap-[0.3vw] border-none"
                                                >
                                                    Learn More <span className="text-[0.8vw] font-bold">{'>'}</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <Link to="https://www.eluxtech.com/oem-odm/"
                                    className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    ODM/OEM
                                    <span className="absolute top-full w-full left-0">
                                        ODM/OEM
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <Link to="https://www.eluxtech.com/contact/"
                                    className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    CONTACT
                                    <span className="absolute top-full w-full left-0">CONTACT</span>
                                </Link>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center group relative">
                            <div className="overflow-hidden">
                                <Link
                                    className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    SPOTLIGHTS
                                    <span className="absolute top-full w-full left-0">SPOTLIGHTS</span>
                                </Link>
                            </div>
                            <div
                                className="text-[0.83333vw] fixed left-0 w-full bg-black text-center transition-all duration-300 hidden group-hover:flex group-hover:justify-center items-center top-full">
                                <Link to="https://www.eluxtech.com/news/"
                                    className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 transition-colors font-manrope font-bold duration-200">NEWS</Link>
                                <Link to="https://www.eluxtech.com/events/"
                                    className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">EVENTS</Link>
                                <Link to="https://www.eluxtech.com/recycle-program/"
                                    className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">SUSTAINABILITY</Link>
                            </div>
                        </div>

                        <div className="px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center">
                            <div className="overflow-hidden">
                                <Link to="https://www.eluxtech.com/about-elux/"
                                    className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    ABOUT US
                                    <span className="absolute top-full w-full left-0">ABOUT US</span>
                                </Link>
                            </div>
                        </div>

                        <div className="group mr-0 px-[1.5625vw] text-[0.9375vw] cursor-pointer h-full flex items-center relative">
                            <div className="overflow-hidden">
                                <Link
                                    className="relative inline-block transition-transform duration-[250ms] font-manrope font-bold hover:-translate-y-full">
                                    SUPPORT
                                    <span className="absolute top-full w-full left-0">SUPPORT</span>
                                </Link>
                            </div>
                            <div
                                className="text-[0.83333vw] fixed left-0 w-full bg-black text-center transition-all duration-300 hidden group-hover:flex group-hover:justify-center items-center top-full">
                                <Link to="https://www.eluxtech.com/verify/"
                                    className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">VERIFY
                                    PRODUCT</Link>
                                <Link to="https://www.eluxtech.com/download/"
                                    className="inline-block px-[1.04167vw] py-[0.78125vw] text-white hover:bg-black/60 font-manrope font-bold transition-colors duration-200">DOWNLOAD</Link>
                            </div>
                        </div>
                    </nav>

                    <div className="flex relative left-[-4.16667vw]">
                        <div className="mr-[0.78125vw]">
                            <div className="cursor-pointer w-[1.30208vw] relative" onClick={toggleSearch}>
                                <img className="w-full  transition-all duration-[200ms]" src="images/search_black.svg"
                                    data-src="images/search_black.svg" alt="ELUX Vape" />
                                <img className="w-full transition-all duration-[200ms] absolute left-0 top-0 opacity-0"
                                    src="images/search_white.svg" data-src="images/search_white.svg" alt="ELUX Vape" />
                            </div>
                        </div>
                        <div className="h-full relative flex items-center justify-center group">
                            {/* Globe Icon (black only) */}
                            <div className="flex items-center cursor-pointer text-[0.83333vw] font-manrope font-bold">
                                <div className="w-[1.30208vw] relative">
                                    <img
                                        className="w-full -translate-y-[2px] transition-all duration-200 border-none align-middle max-w-full"
                                        src="/images/lag.svg"
                                        alt="language translation"
                                    />
                                </div>
                            </div>

                            <div className="text-center absolute top-full w-[150px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-500 px-3 py-3 bg-white rounded-sm left-1/2 -translate-x-1/2 shadow-md z-50">
                                <div className="font-sans text-[11px] text-gray-600 whitespace-nowrap" dir="ltr">
                                    <div
                                        id=":0.targetLanguage"
                                        className="flex items-center gap-1 bg-white border border-[#D5D5D5] border-t-[#9B9B9B] border-b-[#E8E8E8] text-[10pt] pt-[1px] pb-[2px] px-2 cursor-pointer"
                                    >
                                        <img
                                            src="https://www.google.com/images/cleardot.gif"
                                            className="w-[19px] h-[19px] border-none"
                                            alt=""
                                            style={{
                                                backgroundImage: 'url("https://translate.googleapis.com/translate_static/img/te_ctrl3.gif")',
                                                backgroundPosition: '-65px 0px',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                        <a
                                            aria-haspopup="true"
                                            href="#"
                                            className="flex items-center gap-1 no-underline text-black"
                                        >
                                            <span>English</span>
                                            <span className="text-[rgb(118,118,118)]">▼</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="navbar">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </header>
            <div onClick={handleBlurClick} className={`transition-all duration-300 ${isProductHovered ? 'blur-sm' : ''} ${isSearchVisible ? 'blur-sm' : ''}`}>
                <section id='result-section' className="w-full max-w-[41.66667vw] mx-auto">
                    {verificationStatus === 'loading' && (
                        <div className="fixed  w-full h-full top-0 left-0 bg-black/50">
                            <div className="flex flex-col items-center relative left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto">
                                <div className="relative w-[3.125vw] h-[3.125vw]">
                                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-60"></div>
                                    <div style={{ animationDelay: '-1s' }} className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-60"></div>
                                </div>
                                <span className="text-[1.04167vw] text-white">Loading...</span>
                            </div>
                        </div>)}

                    {verificationStatus === 'genuine' && resultData && (
                        <div>
                            <div className="relative mx-auto w-[17.96875vw] h-[11.25vw]">
                                <img className="w-full h-full object-cover absolute top-0 left-0" src="verify/genuine.jpg" alt="Genuine Product" />
                            </div>
                            <div className="px-[3.64583vw] py-[1.30208vw] rounded-t-[1.30208vw] bg-[#468fb2]">
                                <ul className='list-none'>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>COMPANY</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{resultData.company}</p>
                                    </li>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>ANTI-CODE</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{renderAntiCode(resultData.code, verificationStatus)}</p>
                                    </li>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>Query Times</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>
                                            {resultData.queryTimestamp.toLocaleTimeString('en-GB')} {resultData.queryTimestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <br />
                                            First check
                                        </p>
                                    </li>
                                    <li className="border-b text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>TIMES OF QUERY</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{resultData.queryCount}</p>
                                    </li>
                                    <li className="border-b text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>CHECK CODE</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{renderCheckCode(resultData.code, verificationStatus)}</p>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    )}

                    {verificationStatus === 'fake' && resultData && (
                        <div>
                            <div className="relative mx-auto w-[17.96875vw] h-[11.25vw]">
                                <img className="w-full h-full object-cover absolute top-0 left-0" src="verify/fake.jpg" alt="Fake Product" />
                            </div>
                            <div className="px-[3.64583vw] py-[1.30208vw] rounded-t-[1.30208vw] bg-[#b40105]">
                                <ul className='list-none'>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>COMPANY</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{resultData.company}</p>
                                    </li>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>ANTI-CODE</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{renderAntiCode(resultData.code, verificationStatus)}</p>
                                    </li>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>Query Times</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{resultData.message}</p>
                                    </li>
                                    <li className="border-b border-white text-white flex justify-between items-center py-[0.26042vw]">
                                        <div className='text-[1.25vw] w-[40%] font-manrope font-bold'>Check Code</div>
                                        <p className='text-[0.9375vw] text-right font-manrope font-light'>{renderCheckCode(resultData.code, verificationStatus)}</p>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    )}
                </section >
                <section className="bg-[#383838] px-[10.41667vw] py-[3.125vw] flex items-center justify-around">
                    <div className="w-[31.35417vw]">
                        <p className='text-white text-center  text-[1.25vw] mb-[1.04167vw] font-manrope font-light'>ELUX new anti-counterfeit instructions</p>
                        <video
                            preload="auto"
                            autoPlay
                            loop
                            playsInline
                            webkit-playsinline="true"
                            id="verify_video"
                            className='w-full h-full object-cover rounded-[0.52083vw]'
                            src="videos/eluxtechvideo.mp4"
                            muted
                        ></video>
                    </div>

                    <div className="text-center text-white">
                        <h1 className='text-[1.82292vw] mb-[1.04167vw] font-manrope font-bold'>Verify Product</h1>
                        <p className='font-manrope font-light leading-[1.2] text-[0.9375vw]'>
                            Locate the authentication label and scratch off its coating to <br />
                            obtain the anti-counterfeiting code. Then scan or enter your security code below.
                        </p>

                        <div className="mt-[1.30208vw] relative">
                            <input value={inputValue}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        handleVerify();
                                    }
                                }}

                                onChange={(e) => setInputValue(e.target.value.trim())}
                                id="input_code" type="text" className='w-full font-manrope font-medium text-black outline-none bg-white h-[2.34375vw] leading-[2.34375vw] text-[0.9375vw] px-[0.52083vw] pl-[0.78125vw] rounded-[1.5625vw]' />
                            <button onClick={handleVerify}
                                disabled={verificationStatus === 'loading'}
                                className="cursor-pointer absolute right-[0.20833vw] top-1/2 -translate-y-1/2 
                        w-[5.20833vw] h-[1.97917vw] leading-[1.97917vw] text-white 
                        font-manrope font-bold text-[1.04167vw] text-center 
                        bg-black rounded-[1.5625vw]">Verify</button>
                            <label id="code_error" className="hidden absolute top-full left-0 w-full text-center text-[#D50000] text-[0.72917vw] pt-[0.26042vw]" htmlFor="code">
                                This field is required.
                            </label>
                        </div>
                    </div>
                </section>
                <section className="py-[2.08333vw] text-center">
                    <h2 className="font-manrope font-bold text-[1.25vw] mb-[0.78125vw]">WHY WE UPDATE ?</h2>
                    <p className="font-manrope font-extralight text-[0.9375vw]">
                        We use advanced anti-counterfeiting technology, significantly reducing the possibility of any counterfeiting product,
                        <br />
                        the adoption of this technology can prevent the phenomenon of fake and shoddy products to the greatest extent,
                        <br />
                        which provides a strong guarantee for everyone's health, safety and interests. Thank you for purchasing ELUX products,
                        <br />
                        please insist on purchasing genuine products from regular channels, and you are welcome to buy again!
                    </p>
                </section>
                <section className="text-center pb-[1.5625vw]">
                    <h2 className="font-manrope font-bold  text-[1.25vw] mb-[0.52083vw]">OLD CODE VERIFICATION</h2>
                    <img className="w-[20.83333vw] mt-[0.52083vw] border-none  max-w-full mx-auto" src="images/old_code.png" />
                    <div className="w-[20.83333vw] my-[1.5625vw] mx-auto relative">
                        <input ref={oldVerifyRef} id="old_input_code" className='outline-none w-full h-[2.34375vw] leading-[2.34375vw] text-[0.9375vw] px-[0.52083vw] rounded-[1.5625vw] border border-black' type="text" />
                        <button className="absolute right-[0.20833vw] top-1/2 -translate-y-1/2
                    w-[4.16667vw] h-[1.92708vw] leading-[1.92708vw]
                    text-white text-[0.9375vw] text-center
                    bg-black rounded-[1.5625vw]
                    font-manrope font-bold cursor-pointer">Verify</button>
                    </div>
                </section>
                <footer className="w-full relative z-[2] px-[10.41667vw] bg-black">
                    <div className="flex justify-between py-[3.125vw] relative z-[3]">
                        <div className="flex flex-col mt-[3.20833vw] mr-[3.64583vw]">
                            <Link to="https://www.eluxtech.com/verify/" className='no-underline'>
                                <img
                                    className="w-[18.02083vw] mb-[0.12vw] duration-300"
                                    src="images/logo_white.svg"
                                    alt="ELUX Vape"
                                />
                            </Link>
                            <h4 className='text-white text-[1.5625vw] font-manrope font-bold text-center mt-[0.52083vw]'>BEYOND TOMORROW</h4>
                        </div>

                        <div className="flex">
                            <div className="text-white">
                                <h5 className='mb-[.60208vw] font-manrope font-bold text-[1.04167vw]'>NAVIGATE</h5>
                                <ul className="list-none">
                                    <li className=''><Link className='mb-0 font-manrope font-extralight text-[0.83333vw] text-white  transition-colors duration-200' to="https://www.eluxtech.com/products/">PRODUCTS</Link></li>
                                    <li className=''><Link className='mb-0 font-manrope font-extralight text-[0.83333vw] text-white  transition-colors duration-200' to="https://www.eluxtech.com/recycle-program/">SUSTAINABILITY</Link></li>
                                    <li className=''><Link className='mb-0 font-manrope font-extralight text-[0.83333vw] text-white  transition-colors duration-200' to="https://www.eluxtech.com/contact/">CONTACT</Link></li>
                                    <li className=''><Link className='mb-0 font-manrope font-extralight text-[0.83333vw] text-white  transition-colors duration-200' to="https://www.eluxtech.com/about-elux/">ABOUT US</Link></li>
                                    <li className=''><Link className='mb-0 font-manrope font-extralight text-[0.83333vw] text-white  transition-colors duration-200' to="https://www.eluxtech.com/verify/">VERIFY PRODUCT</Link></li>
                                </ul>
                            </div>

                            <div className="mx-[5.72917vw] text-white">
                                <h5 className='mb-[0.50208vw] font-manrope font-bold text-[1.04167vw]'>LET'S COLLABORATE</h5>
                                <p className='flex items-center relative' ><Link className='font-manrope font-extralight text-[0.83333vw] text-white transition-colors duration-200' to="mailto:info@eluxtech.com">info@eluxtech.com</Link></p>
                                <p className='flex items-center relative'><Link className='font-manrope font-extralight text-[0.83333vw] text-white transition-colors duration-200' to="mailto:sales@eluxtech.com">sales@eluxtech.com</Link></p>
                                <p className='flex items-center relative'><Link className='font-manrope font-extralight text-[0.83333vw] text-white transition-colors duration-200' to="mailto:marketing@eluxtech.com">marketing@eluxtech.com</Link></p>
                                <p className='flex items-center relative'><Link className='font-manrope font-extralight text-[0.83333vw] text-white transition-colors duration-200' to="mailto:support@eluxtech.com">support@eluxtech.com</Link></p>
                                <p className='flex items-center relative'><Link className='font-manrope font-extralight text-[0.83333vw] text-white transition-colors duration-200' to="tel:+8618824307008">+86 - 18824307008</Link></p>
                            </div>
                        </div>
                        <div>
                            <div className="text-white">
                                <h5 className='mb-[1.30208vw] font-manrope font-bold text-[1.04167vw]'>SUBSCRIBE TO OUR NEWSLETTER</h5>
                            </div>
                            <div className="mb-[1.5625vw]">
                                <form className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email here"
                                        className="w-full h-[2.34375vw] pl-[1.04167vw] pr-[8.4vw]  text-[0.83333vw] bg-white rounded-[1.5625vw] focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-[0.15625vw] top-1/2 transform -translate-y-1/2 bg-black text-white text-[0.83333vw] px-[1.04167vw] py-[0.41667vw] rounded-[1.5625vw]  transition-colors duration-200"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>

                            <div className="text-white ">
                                <h5 className='mb-[1.04167vw] font-manrope font-bold text-[1.04167vw]'>FOLLOW US</h5>
                                <ul className="flex items-center">
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://www.facebook.com/eluxtechofficial/" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/round-black-facebook-fb-logo-icon-sign-701751695134781upkxjlqwck.png" alt="Facebook" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="http:www.linkedin.com/in/eluxtech" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/in.png" alt="LinkedIn" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://www.youtube.com/@eluxtechofficial/featured" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/youtube-glyph-icon-for-personal-and-commercial-use-free-vector.jpg" alt="YouTube" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://twitter.com/eluxtech" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/x.png" alt="X (Twitter)" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://vk.com/eluxtech" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/vk.png" alt="VK" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://www.pinterest.com/eluxtech_official/" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/pin.png" alt="Pinterest" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                    <li className='mr-[0.52083vw]'>
                                        <Link to="https://www.instagram.com/eluxtechofficial/" target="_blank" rel="noreferrer" className="block w-[1.5625vw] h-[1.5625vw]">
                                            <img src="images/insta.jpg" alt="Instagram" className="w-full h-full object-contain" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div >

                    < div className="text-center pb-[1.04167vw] font-manrope text-[#8a8a8a] text-[0.72917vw] font-extralight relative z-[3]" >
                        Copyright © 2025 ELUX | All Rights Reserved
                    </div >
                </footer >

                {
                    showImage && (
                        <div className="fixed bottom-[15%] right-[.52083vw] z-[99] w-[6.875vw]">
                            <Link
                                className="inline-block relative cursor-pointer no-underline text-black"
                                to="https://forms.gle/d8iPKEBnCwxvdm47A"
                                target="_blank"
                                rel="nofollow"
                            >
                                <img
                                    loading="lazy"
                                    className="w-full animate-pulse"
                                    src="images/pop_form.png"
                                    alt="ELUX Vape"
                                />
                                <AiOutlineClose className="cursor-pointer absolute bottom-[75px] right-2 translate-x-[50%] -translate-y-[50%] bg-black/30 text-white w-[20px] h-[20px] text-xs flex items-center justify-center rounded-sm"
                                    onClick={handleRemoveImage}
                                />
                            </Link>
                        </div>
                    )
                }
            </div >
            <div
                onClick={scrollToTop}
                className={`fixed bottom-[6em] right-[1.42857em] w-[3.1em] h-[3.1em] z-[98] bg-[#414141] rounded-full transition duration-300 flex items-center justify-center cursor-pointer ${showArrow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1/2"
                    }`}
            >
                <img src="/images/to_top.svg" alt="to top" className="w-full" />
            </div>
            <div className="fixed right-6 bottom-6 z-110">
                <button
                    onClick={() => window.chaport.open()}
                    className="w-14 h-14 rounded-full bg-[#414141] flex items-center justify-center shadow-lg  transition-colors"
                >
                    <img
                        src="images/chaport-launcher-chat-icon-new@2x.png"

                        className="w-9 h-9 object-contain"
                    />
                </button>
            </div>

        </>
    )
}

export default DesktopView
