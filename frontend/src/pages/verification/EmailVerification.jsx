import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🌐 Config: Aapka Backend URL
const BACKEND_BASE_URL = 'https://hissab-4ggc.onrender.com/api/auth';

const EmailVerification = () => {
    // 1. States
    const [status, setStatus] = useState('ईमेल वेरीफाई किया जा रहा है... कृपया प्रतीक्षा करें।');
    const [isLoading, setIsLoading] = useState(true);
    
    // 2. Hooks
    const location = useLocation(); 
    const navigate = useNavigate(); 

    /* =============================================================
       🚀 VERIFICATION LOGIC BLOCK (START)
       ============================================================= */
    const verifyAccount = async (token) => {
        setIsLoading(true);
        try {
            // Backend call: Isme 'token' query parameter ke roop mein bhej rahe hain
            const response = await axios.get(`${BACKEND_BASE_URL}/verify-email?token=${token}`);
            
            if (response.data.success) {
                setStatus('✅ सफलतापूर्वक वेरीफाई हुआ! अब आप लॉगिन कर सकते हैं।');
                
                // 5 सेकंड बाद automatic redirect
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        } catch (error) {
            // Error handling
            const errorMessage = error.response?.data?.message || 'वेरिफिकेशन विफल रहा। लिंक अमान्य हो सकता है।';
            setStatus(`❌ त्रुटि: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // URL se ?token=... nikalna
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            verifyAccount(token);
        } else {
            setStatus('❌ वेरिफिकेशन विफल: URL में टोकन नहीं मिला।');
            setIsLoading(false);
        }
    }, [location.search]); // location.search par depend hona behtar hai
    /* =============================================================
       🚀 VERIFICATION LOGIC BLOCK (END)
       ============================================================= */

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            padding: '20px', 
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>ईमेल वेरिफिकेशन</h1>
            <hr />
            
            {isLoading && (
                <div style={{ margin: '20px' }}>
                    <p>⏳ लोड हो रहा है...</p>
                </div>
            )}
            
            <p style={{ 
                marginTop: '20px', 
                fontSize: '1.2em', 
                fontWeight: 'bold',
                color: status.includes('✅') ? '#28a745' : status.includes('❌') ? '#dc3545' : '#333'
            }}>
                {status}
            </p>

            {/* Success hone par button dikhayen */}
            {status.includes('सफलतापूर्वक') && (
                <button 
                    onClick={() => navigate('/login')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    तुरंत लॉगिन करें
                </button>
            )}
            
            {/* Error hone par button dikhayen */}
            {status.includes('❌') && (
                <button 
                    onClick={() => navigate('/register')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    रजिस्टर पेज पर वापस जाएँ
                </button>
            )}
        </div>
    );
};

export default EmailVerification;