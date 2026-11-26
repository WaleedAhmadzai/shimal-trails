import type { Template } from "@/types";

export const templates: Template[] = [
  {
    id: "naran-weekend",
    name: "Naran long weekend",
    tagline: "Kunhar River, Saif-ul-Malook at dawn, home by Sunday night.",
    days: 3,
    bestMonth: 7,
    stops: [
      { slug: "naran-kaghan", nights: 2 },
      { slug: "saif-ul-malook", nights: 0 },
    ],
  },
  {
    id: "hunza-classic",
    name: "Hunza classic",
    tagline: "Forts, Attabad's turquoise water, Passu Cones and the China border.",
    days: 7,
    bestMonth: 10,
    stops: [
      { slug: "hunza-valley", nights: 3 },
      { slug: "attabad-lake", nights: 0 },
      { slug: "passu-gulmit", nights: 1 },
      { slug: "khunjerab-pass", nights: 0 },
    ],
  },
  {
    id: "skardu-deosai",
    name: "Skardu and Deosai",
    tagline: "Lakes, a palace fort, a cold desert and the bears of Deosai.",
    days: 8,
    bestMonth: 7,
    stops: [
      { slug: "skardu", nights: 2 },
      { slug: "shigar-valley", nights: 1 },
      { slug: "deosai-plains", nights: 1 },
    ],
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id);
}
