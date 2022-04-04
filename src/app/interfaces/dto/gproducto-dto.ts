export interface GproductoDto {
    _id: string;
    name: string;
    subtitle: string;
    description: string;
    category: string;
    tags: string[];
    price: price;
    ratings: rating;
    features: string[];
    photo: string;
    gallery: string[];
    badge: badge;
}

interface price {
    sale: number,
    previous: number
}

interface rating {
    rating: number,
    ratingCount: number
}

interface badge {
    text: string,
    color: string
}
