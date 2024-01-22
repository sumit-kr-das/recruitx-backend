import redisClient from "../utils/redisClient";

const recomandedJobCacheService = async () => {
    const recomendedJobskeys = await redisClient.keys('recomendedJobs:*');
    await redisClient.del(recomendedJobskeys);
    const recomendedJobsHasInfokeys = await redisClient.keys('recomendedJobsHasInfo:*');
    await redisClient.del(recomendedJobsHasInfokeys);
}

export default recomandedJobCacheService;