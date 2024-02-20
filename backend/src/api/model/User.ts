interface User {
    userId: string;
    email: string;
    password?: string | number;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default User;
