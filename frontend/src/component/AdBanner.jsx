import React, { useEffect, useRef, useState } from 'react';

const AdBanner = ({ id, width, height, adKey }) => {
    const adRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (adRef.current && !adRef.current.firstChild) {
            const script = document.createElement('script');
            const conf = document.createElement('script');

            conf.innerHTML = `
                atOptions = {
                    'key' : '${adKey}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                };
            `;

            script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
            script.async = true;

            adRef.current.appendChild(conf);
            adRef.current.appendChild(script);

            // Observe when the ad script actually injects the ad content
            const observer = new MutationObserver(() => {
                if (adRef.current && adRef.current.children.length > 2) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            });

            observer.observe(adRef.current, { childList: true });

            return () => {
                observer.disconnect();
            };
        }
    }, [adKey, width, height]);

    return (
        <div className={`flex justify-center transition-all duration-300 ${isVisible ? 'my-6' : 'h-0 overflow-hidden'}`}>
            <div
                ref={adRef}
                style={{ width: isVisible ? `${width}px` : '0px', height: isVisible ? `${height}px` : '0px' }}
                id={id}
                className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            >
                {/* Ad will load here */}
            </div>
        </div>
    );
};

export default AdBanner;
