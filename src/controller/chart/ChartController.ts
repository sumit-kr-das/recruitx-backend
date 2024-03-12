import { Response, NextFunction } from "express";
import job from "../../model/job";
import converDate from "../../services/convertDate";
interface JobCount {
    [date: string]: number;
}
const chartController = {
    async getJobChart(req: any, res: Response, next: NextFunction) {
        const role = req.params.role;
        const userId = req.user.id;

        try {
            let jobData;
            if (role === "company") {
                jobData = await job.find({ companyId: userId }).sort({ createdAt: -1 });
            } else {
                jobData = await job.find().sort({ createdAt: 1 });
            }

            const dates = jobData.map(job => converDate(job.info.startDate));
            const jobCountByDate: JobCount = dates.reduce((count: JobCount, date: string) => {
                count[date] = (count[date] || 0) + 1;
                return count;
            }, {});
            const series = {
                name: 'job postings',
                data: Object.values(jobCountByDate),
            };

            const xaxis = {
                categories: Object.keys(jobCountByDate).map(date => date),
            };

            const option = {
                series: [series],
                options: {
                    chart: {
                        id: "bar"
                    },
                    xaxis: xaxis,
                },
            }

            return res.status(200).json(option);
        } catch (error) {
            next(error);
        }

    },
};

export default chartController;