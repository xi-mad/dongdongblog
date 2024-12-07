const Footer = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const yearString =
        currentYear === startYear
            ? startYear.toString()
            : `${startYear}-${currentYear}`;

    return (
        <footer className="py-6 text-center text-sm text-gray-400">
            <p>© {yearString} Dongdong's Blog. Powered by Rspress.</p>
        </footer>
    );
};

export default Footer;
