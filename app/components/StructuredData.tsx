export default function StructuredData() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Nguyễn Việt Thắng",
        "alternateName": "nhocratac",
        "jobTitle": "Web Developer",
        "description": "Backend & Fullstack Web Developer",
        "email": "nguyenvietthang010@gmail.com",
        "telephone": "+84397154698",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "TP. Hồ Chí Minh",
            "addressCountry": "VN"
        },
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Đại học Công nghệ Thông tin (UIT)",
            "url": "https://www.uit.edu.vn/"
        },
        "knowsAbout": [
            "Web Development",
            "Backend Development",
            "Fullstack Development",
            "Java",
            "Spring Boot",
            "Node.js",
            "Next.js",
            "React",
            "MongoDB",
            "Redis",
            "WebSocket"
        ],
        "url": "https://your-domain.com", // TODO: Replace with your actual domain
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Nguyễn Việt Thắng Portfolio",
        "alternateName": "nhocratac Portfolio",
        "url": "https://your-domain.com", // TODO: Replace with your actual domain
        "description": "Portfolio website của Nguyễn Việt Thắng - Web Developer chuyên về Backend & Fullstack",
        "inLanguage": "vi-VN",
        "author": {
            "@type": "Person",
            "name": "Nguyễn Việt Thắng"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </>
    );
}
