interface Business {
    id?: string;
    name: string;
    role: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
    website: string;
    industry: string;
    description: string;
    tier: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    picture?: string;
    usage?: string;
}

export default Business;
