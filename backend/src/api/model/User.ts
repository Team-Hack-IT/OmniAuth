interface User {
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    password: string | number;
    createdAt: Date;
}

export default User;
