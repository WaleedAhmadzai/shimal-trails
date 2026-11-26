import type { Photo } from "@/types";
import fairyMeadows from "@/assets/photos/fairy-meadows.jpg";
import hunza from "@/assets/photos/hunza-khunjerab.jpg";
import kumrat from "@/assets/photos/kumrat-valley-camp.jpg";
import margalla from "@/assets/photos/margalla-sunrise-hike.jpg";
import saifulMalook from "@/assets/photos/naran-saiful-malook.jpg";
import nathiagali from "@/assets/photos/nathiagali-weekend.jpg";
import arangKel from "@/assets/photos/neelum-arang-kel.jpg";
import rattiGali from "@/assets/photos/ratti-gali-lake-trek.jpg";
import deosai from "@/assets/photos/skardu-shangrila-deosai.jpg";
import kalam from "@/assets/photos/swat-kalam.jpg";
import attabad from "@/assets/photos/attabad-lake.jpg";
import kalash from "@/assets/photos/chitral-kalash.jpg";
import khunjerab from "@/assets/photos/khunjerab-pass.jpg";
import naltar from "@/assets/photos/naltar-valley.jpg";
import naran from "@/assets/photos/naran-kaghan.jpg";
import passu from "@/assets/photos/passu-gulmit.jpg";
import shigar from "@/assets/photos/shigar-valley.jpg";
import siriPaye from "@/assets/photos/shogran-siri-paye.jpg";
import skardu from "@/assets/photos/skardu.jpg";

// All photos are from Wikimedia Commons under free licences, cropped to 16:9.
const BY_SA_4 = "CC BY-SA 4.0";

export const photos = {
  fairyMeadows: {
    src: fairyMeadows,
    alt: "Nanga Parbat's snow face rising above the pine forest at Fairy Meadows",
    author: "Zaki Khan89",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nanga_Parbat_(Fairy_Meadows).jpg",
  },
  hunza: {
    src: hunza,
    alt: "Hunza Valley terraces and peaks seen from Eagle's Nest above Karimabad",
    author: "Alllexxxis",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hunza_Valley,_view_from_Eagle%27s_Nest.jpg",
  },
  kumrat: {
    src: kumrat,
    alt: "Pine forest and meadow beside the Panjkora River in Kumrat Valley",
    author: "Salman Shah",
    licence: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kumrat_Valley.jpg",
  },
  margalla: {
    src: margalla,
    alt: "Green Margalla Hills sloping down towards Islamabad",
    author: "Zain.3nov",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Islamabad_from_Margalla_Hills.jpg",
  },
  saifulMalook: {
    src: saifulMalook,
    alt: "Lake Saif-ul-Malook in June with snow-streaked mountains around it",
    author: "Almazi at English Wikipedia",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Saiful_muluk_during_June.JPG",
  },
  nathiagali: {
    src: nathiagali,
    alt: "Pine-covered hills around a summer retreat in Nathiagali",
    author: "Ymblanter",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nathiagali_Hotel_Summer_Retreat_07.jpg",
  },
  arangKel: {
    src: arangKel,
    alt: "Morning light on the wooden houses and meadows of Arang Kel",
    author: "Kashifrehan1805",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Arang_Kel_Morning.jpg",
  },
  rattiGali: {
    src: rattiGali,
    alt: "Blue water of Ratti Gali Lake below rocky, snow-patched slopes",
    author: "Shahzeb Baig",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ratti_Gali_Lake_.jpg",
  },
  deosai: {
    src: deosai,
    alt: "Rolling green plateau of Deosai under a wide sky",
    author: "Qammer Wazir",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Land_of_Giants,_Deosai.jpg",
  },
  kalam: {
    src: kalam,
    alt: "Swat River running through Kalam town between forested hills",
    author: "Shahzaib Damn Cruze",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Swat_River_in_Kalam_town,_Swat.jpg",
  },
  attabad: {
    src: attabad,
    alt: "Turquoise Attabad Lake with two boats below bare grey mountains",
    author: "Peracha1",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Attabad.jpg",
  },
  passu: {
    src: passu,
    alt: "The jagged Passu Cones above the Hunza River bed in upper Hunza",
    author: "Mehrunisa Reimoo",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pasu_cones.jpg",
  },
  khunjerab: {
    src: khunjerab,
    alt: "The Karakoram Highway near Khunjerab Pass under a road sign to Kashgar and Tashkurgan",
    author: "Muneeb Qazi",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Khunjerab_Pass_Road.jpg",
  },
  naltar: {
    src: naltar,
    alt: "Bright blue lake among rocky slopes and pines in Naltar Valley",
    author: "Thealimir",
    licence: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Blue_Lake_2,_Naltar,_Gilgit_Baltistan.jpg",
  },
  skardu: {
    src: skardu,
    alt: "Skardu town and the braided Indus River in autumn below snowy peaks",
    author: "Vasiq Eqbal",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:An_autumnal_view_of_Skardu%27s_skyline.jpg",
  },
  shigar: {
    src: shigar,
    alt: "Wooden balconies of Shigar Fort lit up at night",
    author: "Sanaullah Khan",
    licence: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shigar_Fort_LHR_0991.jpg",
  },
  naran: {
    src: naran,
    alt: "Lulusar Lake at the head of a green valley with snow on the ridges above Naran",
    author: "irfan muhammad",
    licence: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lulusar_Lake,_Naran,_KPK,_Pakistan.JPG",
  },
  siriPaye: {
    src: siriPaye,
    alt: "Green meadows and a small pond at Siri Paye above Shogran, with snowy peaks behind",
    author: "Adeel ur Rehman Mughal",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Siri_Paye,_Shogran,_Kaghan_Valley.jpg",
  },
  kalash: {
    src: kalash,
    alt: "A wooden house and forested slopes in the Kalash valleys",
    author: "Akhtar Hassan",
    licence: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kalasha_Valleys_Pakistan.jpg",
  },
} satisfies Record<string, Photo>;
