export interface Category {
  id: number;
  name: string;
  image: string;
  href: string;
}

export type CategoryImage = {
  url: string;
  type: "thumbnail" | "banner";
}
