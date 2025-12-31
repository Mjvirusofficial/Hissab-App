import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams use karein
import axios from 'axios';

// 🌐 Config: Base URL mein '/api' check karein, agar aapne server.js mein nahi lagaya toh hata dein
const BACKEND_BASE_URL = 'https://hissab-4ggc.onrender.com/auth'; 

const EmailVerification = () => {
    const [status, setStatus] = useState('ईमेल वेरीफाई किया जा रहा है... कृपया प्रतीक्षा करें।');
    const [isLoading, setIsLoading] = useState(true);
    
    const { token } = useParams(); // ✅ FIX: URL params se token nikalne ke liye
    const navigate = useNavigate(); 

    const verifyAccount = async (verificationToken) => {
        setIsLoading(true);
        try {
            // ✅ FIX: Backend route match kiya gaya hai (/auth/verify/:token)
            const response = await axios.get(`${BACKEND_BASE_URL}/verify/${verificationToken}`);
            
            if (response.data.success) {
                setStatus('✅ सफलतापूर्वक वेरीफाई हुआ! अब आप लॉगिन कर सकते हैं।');
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'वेरिफिकेशन विफल रहा। लिंक अमान्य हो सकता है।';
            setStatus(`❌ त्रुटि: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            verifyAccount(token);
        } else {
            setStatus('❌ वेरिफिकेशन विफल: URL में टोकन नहीं मिला।');
            setIsLoading(false);
        }
    }, [token]); 

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

            {status.includes('✅') && (
                <button 
                    onClick={() => navigate('/login')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    तुरंत लॉगिन करें
                </button>
            )}
            
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