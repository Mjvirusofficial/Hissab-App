// src/pages/EmailVerification.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// सुनिश्चित करें कि आपका बैकएंड URL सही है (जैसे: जहां आपका Node/Express सर्वर चल रहा है)

const BACKEND_BASE_URL = 'http://localhost:5000/api/auth'; 
//For all devices:-
// const BACKEND_BASE_URL = 'http://10.52.63.205:5000/api/auth';

const EmailVerification = () => {
    // 1. स्टेट्स (States)
    const [status, setStatus] = useState('ईमेल वेरीफाई किया जा रहा है... कृपया प्रतीक्षा करें।');
    const [isLoading, setIsLoading] = useState(true);
    
    // 2. हुक्स (Hooks)
    const location = useLocation(); // URL की जानकारी के लिए
    const navigate = useNavigate(); // रीडायरेक्ट करने के लिए

    // 3. वेरिफिकेशन फ़ंक्शन
    const verifyAccount = async (token) => {
        setIsLoading(true);
        try {
            // बैकएंड के वेरिफिकेशन रूट को GET रिक्वेस्ट भेजना
            // URL: http://localhost:5000/api/auth/verify-email/<token>
            const response = await axios.get(`${BACKEND_BASE_URL}/verify-email/${token}`);

            if (response.data.success) {
                setStatus('✅ सफलतापूर्वक वेरीफाई हुआ! अब आप लॉगिन कर सकते हैं।');
                
                // 5 सेकंड बाद लॉगिन पेज पर रीडायरेक्ट करें
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }

        } catch (error) {
            // बैकएंड से आने वाले एरर को हैंडल करना
            const errorMessage = error.response?.data?.message || 'वेरिफिकेशन विफल रहा। लिंक अमान्य हो सकता है।';
            setStatus(`❌ त्रुटि: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 4. useEffect: कंपोनेंट लोड होने पर टोकन को पढ़ना और वेरीफाई करना
    useEffect(() => {
        // URL से Query Parameter (token) को निकालना
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            // अगर टोकन मिल जाता है, तो वेरिफिकेशन प्रोसेस शुरू करें
            verifyAccount(token);
        } else {
            // अगर URL में टोकन ही नहीं है
            setStatus('❌ वेरिफिकेशन विफल: URL में टोकन नहीं मिला।');
            setIsLoading(false);
        }
        
        // useEffect को केवल पहली बार लोड होने पर ही चलाना
    }, [location]); 


    // 5. रेंडरिंग (Rendering)
    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            padding: '20px', 
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px'
        }}>
            <h1>ईमेल वेरिफिकेशन</h1>
            {isLoading && <p>लोड हो रहा है...</p>}
            
            <p style={{ 
                marginTop: '20px', 
                fontSize: '1.2em', 
                fontWeight: 'bold' 
            }}>
                {status}
            </p>

            {status.includes('सफलतापूर्वक') && (
                <button 
                    onClick={() => navigate('/login')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    अब लॉगिन करें
                </button>
            )}
            
            {status.includes('त्रुटि') && (
                 <button 
                    onClick={() => navigate('/register')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    रजिस्टर पेज पर वापस जाएँ
                </button>
            )}

        </div>
    );
};

export default EmailVerification;