type User = {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    address: string;
    state: string;
    role: string;
    country: string;
    postalCode: string;
    createdAt: Date;
    birthDate: Date;
    picture?: string;
    password?: string;
    phone?: string;
    updatedAt?: Date;
    history?: object;
    isVerified?: boolean;
    document?: object;
};

export default User;
