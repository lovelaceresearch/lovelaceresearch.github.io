"use client";

import { useState } from 'react';

interface EmailCopyProps {
    idSuffix?: string;
}

export default function EmailCopy({ idSuffix = '' }: EmailCopyProps) {
    const [copied, setCopied] = useState(false);
    const email = "office@lovelace-research.com";

    const handleCopy = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <span className="email-container">
            <a href="#" onClick={handleCopy} id={`email-link${idSuffix}`}>
                {email}
            </a>
            <span id={`hover-tooltip${idSuffix}`} className="hover-tooltip">
                Copy email
            </span>
            <span id={`copied-message${idSuffix}`} className={`copied-message ${copied ? 'show' : ''}`}>
                Copied!
            </span>
        </span>
    );
}
