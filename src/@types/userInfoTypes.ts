export interface IUserinfoReqBody {
    github?: string;
    linkedIn?: string;
    dateOfBirth: Date;
    age: number;
    address: string;
    bio: string;
    objective: string;
    language: [string];
    gender: string;
    skills: [string];
    maxQualification: string;
}

export interface IUserinfoModel extends IUserinfoReqBody {
    userId: string,
    photo?: string;

}