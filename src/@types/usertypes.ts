export interface IUserRequestBody {
    name: string;
    email: string;
    password: string;
    phoneNo: string;
    workStatus: string;
}

export interface IUserModel extends IUserRequestBody {
    password: string;
    role: string;
    approve: boolean;
}