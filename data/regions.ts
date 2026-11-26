import type { Region } from "@/types";

export const regions: Region[] = [
  {
    id: "gilgit-baltistan",
    name: "Gilgit-Baltistan",
    blurb: "The high Karakoram: Hunza, Skardu, glaciers and the world's greatest peaks.",
  },
  {
    id: "khyber-pakhtunkhwa",
    name: "Khyber Pakhtunkhwa",
    blurb: "Green valleys within a day of Islamabad: Naran, Swat, Kumrat and Chitral.",
  },
  {
    id: "azad-kashmir",
    name: "Azad Kashmir",
    blurb: "The Neelum River, wooden villages and alpine lakes along the Line of Control.",
  },
  {
    id: "galiyat",
    name: "Galiyat",
    blurb: "Cool pine hills two hours from the capital, open all year.",
  },
];

export function getRegion(id: string) {
  return regions.find((r) => r.id === id);
}
