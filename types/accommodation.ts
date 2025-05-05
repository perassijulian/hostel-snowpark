export type PictureForm = {
  id?: number;
  accommodationId?: number | null;
  url: string;
  isPrimary: boolean;
  caption?: string | null;
  altText?: string | null;
};

export type Accommodation = {
  id: number;
  name: string;
  description: string;
  price: number;
  guests: number;
  pictures: PictureForm[];
};
