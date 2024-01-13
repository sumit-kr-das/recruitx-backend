export interface IJobReqBody {
    title: string;
    category: string;
    description: string;
    tags: [string];
    active?: boolean;
    info: {
        vacancies: number;
        jobType: string;
        workplaceType: string;
        startDate: Date;
        endDate: Date;
        roles: string;
        skills: [string];
        minExprience: number;
        maxExprience: number;
        minSalary: number;
        maxSalary: number;
        location: string;
        maxQualification: string;
        degree: string;
    };
}

export interface IJobModel extends IJobReqBody {
    companyId: string
}

export interface ISearchJob {
    title: string,
    location: string,
    exprience: number
}