export interface IUserEducationReqBody {
    degree: string,
    college: string,
    course: string,
    admissionYear: string,
    passYear: number,
    marks: number,
    courseType: string
}

export interface IUserEducationModel extends IUserEducationReqBody {
    userId: string;
}

