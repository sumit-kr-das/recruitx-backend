interface ICompany {
    name: string;
    description: string;
    email: string;
    password: string;
    industry: string;
    designation: string;
    pin: string;
    address: string;
    companyName: string;
    phone: string;
}

export interface ICompanyRequestBody extends ICompany {
    repeatPassword: string;
}

export interface ICompanyModel extends ICompany {
    role: string;
    status: string;
}
