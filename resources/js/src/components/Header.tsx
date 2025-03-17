// @ts-ignore
import yasmagaLogo from "../assets/yasmaga_1.png";
import { Phone } from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";

const Header = () => {
    const [logo, setLogo] = useState('logo');

    useEffect(() => {
        if (logo === 'logo') {
            updateLogo()
        }
    }, [logo]);

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
        const newLogo = await fetchContents(logo)
        setLogo(newLogo)
    };
  return (
    <div className="bg-[#141414] shadow-sm h-[70px] flex items-center justify-between px-5">
      {/* Kontainer untuk logo dan teks */}
      <div className="flex items-center">
        {/* Logo Yasmaga yang responsif (untuk logo vertikal) */}
        {/*  <img src={logo !== 'logo' ? `/storage/${logo}` : yasmagaLogo}*/}
        {/*       alt="Logo Yasmaga"*/}
        {/*       className="w-16 h-auto sm:w-16 lg:w-20 mr-3"*/}
        {/*  />*/}
          <img src={logo !== 'logo' ? `/storage/${logo}` : yasmagaLogo}
               alt="Logo Yasmaga"
               className="h-14 mr-3 rounded-lg"
          />
      </div>
      {/* Penyesuaian tampilan teks dan ikon di sebelah kanan */}
      <div className="flex items-center text-sm font-normal">
        <Phone size={13} className="mr-2 text-white" />
        <span className="text-white">08113375559</span> {/* Mengubah warna teks menjadi kuning */}
      </div>
    </div>
  );
};

export default Header;
