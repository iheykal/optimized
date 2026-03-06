export type PropertyType = 'Apartment' | 'Villa' | 'Office' | 'Shop';
export type ListingType = 'rent' | 'sale';

export interface Agent {
    id: string;
    name: string;
    phone: string;
    location: string;
    verified: boolean;
}

export interface Property {
    id: number;
    title: string;
    type: PropertyType;
    district: string;
    landmark: string;
    price: number;
    priceUnit: string;
    listingType: ListingType;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    agent: Agent;
    description: string;
    listedAt: string;
}
