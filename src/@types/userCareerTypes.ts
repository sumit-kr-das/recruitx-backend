export interface IUserCareerReqBody {
    industry: string,
    role: string,
    jobRole: string,
    jobType: string,
    employmentType: string,
    skills: [string],
    expectedSalary: number
}

export interface IUserCareerModel extends IUserCareerReqBody {
    userId: string
}