export interface ICompanyProfileReqBody {
    description: string,
    teamSize: number,
    type: string,
    tags: [string],
    founded: string
}

export interface ICompanyProfileUpdate {
    description?: string,
    teamSize?: number,
    type?: string,
    tags?: [string],
    founded?: string
}

export interface ICompanyProfileModel extends ICompanyProfileReqBody {
    companyId: string,
    logo?: string
}