export interface IUserProjectReqBody {
    name: string,
    description: string,
    skills: [string],
    startDate: Date,
    endDate?: Date,
    associate: string
}

export interface IUserProjectModel extends IUserProjectReqBody {
    userId: string,

}