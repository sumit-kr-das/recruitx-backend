export interface IAdminRequestBody {
    name: string;
    email: string;
    password: string;
    status: string,
}

export interface IAdminModel extends IAdminRequestBody {
    role: string
}