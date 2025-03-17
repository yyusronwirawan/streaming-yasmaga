import {useEffect, useState} from "react";
import axios from "axios";

const Footer = () => {
    const [footer, setFooter] = useState('footer');

    useEffect(() => {
        if (footer === 'footer') {
            updateLogo()
        }
    }, [footer]);

    const fetchContents = async (name: string): Promise<string> => {
        try {
            const response = await axios.get('/api/contents', {
                params: {
                    name: name,
                },
            });
            if (response.data && response.data.contents) {
                const contentsWithParsedMetadata = response.data.contents.map((content: any) => ({
                    ...content,
                    metadata: JSON.parse(content.metadata) as {
                        image?: string | null;
                        type: string;
                        value: string;
                    },
                }));
                if (contentsWithParsedMetadata[0].metadata.type === 'image') {
                    return contentsWithParsedMetadata[0].metadata.image
                } else {
                    return contentsWithParsedMetadata[0].metadata.value
                }
            } else {
                return ''
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
            return ''
        }
    };

    const updateLogo = async () => {
        const newFooter = await fetchContents(footer)
        setFooter(newFooter)
    };

    // return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 mt-auto">© {new Date().getFullYear()}. Radio Yasmaga 96.90 FM Mhz v1.1.0</div>;
    return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 mt-auto">{footer === 'footer' ? '© ' : '© ' + footer}</div>;
};

export default Footer;
