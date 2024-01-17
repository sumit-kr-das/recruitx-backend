class CustomErrorHandler extends Error {
    status: number;
    constructor(status: number, msg: string) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message: string) {
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message:string="Your email & password is wrong") {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message: string="Unauthorised User") {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message: string="404 Not Found") {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message: string="Internal Server Error") {
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;
