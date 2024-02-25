export interface IRatingReqBody {
    companyId: string,
    rates: string,
    description: string
}

export interface IRatingModel extends IRatingReqBody {
    userId: string,
}