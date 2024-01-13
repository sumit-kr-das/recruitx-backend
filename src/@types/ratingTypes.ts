export interface IRatingReqBody {
    companyId: string,
    rates: string
}

export interface IRatingModel extends IRatingReqBody {
    userId: string,
}