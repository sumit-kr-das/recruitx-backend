export interface IUserCertificateReqBody {
    title: string,
    source: string,
    description: string,
    startDate: Date,
    endDate: Date
}

export interface IUserCertificateModel extends IUserCertificateReqBody {
    userId: string
}