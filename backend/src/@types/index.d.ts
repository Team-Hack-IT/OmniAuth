declare namespace Express {
    export type Request = {
        subject: string;
        token: string;
        user?: any;
    };
}
