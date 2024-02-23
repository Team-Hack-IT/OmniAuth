type User = {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string | number;
    phone?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    history?: object;
    country?: string;
};

export default User;
