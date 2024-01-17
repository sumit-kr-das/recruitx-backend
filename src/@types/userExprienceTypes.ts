export interface IUserExprienceReqBody {
    skills: string,
    companyName: string,
    designation: string,
    experience: string,
    anualSalary?: string,
    type: string,
    startDate: Date,
    endDate?: Date,
    jobProfile: string
}

export interface IUserExprienceModel extends IUserExprienceReqBody {
    userId: string;
}

export interface IUserExprienceUpdate {
    skills?: string,
    companyName?: string,
    designation?: string,
    experience?: string,
    anualSalary?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    jobProfile?: string
}