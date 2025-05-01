export type PictureForm = {
  url: string;
  isPrimary: boolean;
  caption?: string;
  altText?: string;
  id?: number;
};

export type Accommodation = {
  id: number;
  name: string;
  description: string;
  price: number;
  guests: number;
  pictures: PictureForm[];
};
