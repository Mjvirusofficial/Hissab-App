import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url }) => {
    const siteTitle = "D-Hisaab - Smart Expense Tracker";
    const defaultDescription = "Track your expenses effortlessly with D-Hisaab. Simple, secure, and smart accounting for personal finance management.";
    const defaultKeywords = "expense tracker, budget app, finance manager, money tracking, personal finance";
    const defaultUrl = "https://dhisaab.netlify.app/";

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || defaultUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || defaultUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />

            {/* Canonical Link */}
            <link rel="canonical" href={url || defaultUrl} />
        </Helmet>
    );
};

export default SEO;
