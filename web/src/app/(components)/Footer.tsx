import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <Image 
                        src="/logo.svg" 
                        alt="Lovelace Research Logo" 
                        width={64} 
                        height={64}
                        priority
                    />
                </div>
                <p className="footer-text">Lovelace Research 2025</p>
            </div>
        </footer>
    );
}
