import { Request, Response, NextFunction } from "express";
import rating from "../../model/rating";
import Joi from "joi";
import { IRatingReqBody } from "../../@types/ratingTypes";
import redisClient from "../../utils/redisClient";

const ratingController = {
  async addRating(req: any, res: Response, next: NextFunction) {
    const user = req.user.id;

    const ratingSchema = Joi.object({
      companyId: Joi.string().required(),
      rates: Joi.number().min(1).max(5).required(),
    });

    const { error } = ratingSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { companyId, rates }: IRatingReqBody = req.body;
    const cacheKey = `companyReview:${companyId}`;
    const ratings = new rating({
      companyId,
      rating: rates,
      userId: user
    });

    try {
      await redisClient.del(cacheKey);
      const saveRating = await ratings.save();
      return res.status(200).json({ msg: "Rating sent Successfullly" });
    } catch (error) {
      return next(error);
    }
  },

  async viewRatings(req: any, res: Response, next: NextFunction) {
    const companyId = req.params.companyId;
    const cacheKey = `companyReview:${companyId}`;
    try {
      const reviewCache = await redisClient.get(cacheKey);
      if (reviewCache) {
        return res.status(200).json(JSON.parse(reviewCache));
      }
      const ratings = await rating.find({ companyId });
      await redisClient.set(cacheKey, JSON.stringify(ratings));
      await redisClient.expire(cacheKey, 3600);
      return res.status(200).json(ratings);
    } catch (error) {
      return next(error);
    }
  },

  async editRating(req: any, res: Response, next: NextFunction) {
    const ratingId = req.params.ratingId;
    const { rates, companyId }: IRatingReqBody = req.body;
    const cacheKey = `companyReview:${companyId}`;

    const ratings = await rating.findOne({ companyId, _id: ratingId });

    if (!ratings) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    try {
      await redisClient.del(cacheKey);

      const updatedRating = await rating.findByIdAndUpdate(
        { _id: ratingId },
        { rating: rates, companyId },
        { new: true }
      );

      if (!updatedRating) {
        return res.status(404).json({ msg: "Rating not found" });
      }

      return res.status(200).json({ msg: "Rating updated successfully" });
    } catch (error) {
      return next(error);
    }
  }
}

export default ratingController;