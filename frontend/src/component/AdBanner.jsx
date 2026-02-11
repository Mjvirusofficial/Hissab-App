import React, { useEffect, useRef } from 'react';

const AdBanner = ({ id, width, height, adKey }) => {
    const adRef = useRef(null);

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
        }
    }, [adKey, width, height]);

    return (
        <div className="flex justify-center my-6 overflow-hidden">
            <div
                ref={adRef}
                style={{ width: `${width}px`, height: `${height}px` }}
                id={id}
                className="bg-gray-100/50 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-gray-100"
            >
                {/* Ad will load here */}
            </div>
        </div>
    );
};

export default AdBanner;
