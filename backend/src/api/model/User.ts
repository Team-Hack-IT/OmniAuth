class User {
    public id?: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public password: string;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}

export default User;
