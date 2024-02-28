import { Request, Response, NextFunction } from "express";
import rating from "../../model/rating";
import Joi from "joi";
import { IRatingReqBody } from "../../@types/ratingTypes";
import mongoose from "mongoose";

const ratingController = {
  async addRating(req: any, res: Response, next: NextFunction) {
    const user = req.user.id;

    const ratingSchema = Joi.object({
      companyId: Joi.string().required(),
      rates: Joi.number().min(1).max(5).required(),
      description: Joi.string().required()
    });

    const { error } = ratingSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { companyId, rates, description }: IRatingReqBody = req.body;



    try {
      const oldReview = await rating.findOne({ userId: user, companyId });
      if (oldReview) {
        return res.status(503).json({ message: "You have already reviewd for this company" })
      }
      const ratings = new rating({
        companyId,
        rating: rates,
        userId: user,
        description
      });
      const saveRating = await ratings.save();
      return res.status(200).json({ msg: "Rating sent Successfullly" });
    } catch (error) {
      return next(error);
    }

  },

  async viewRatings(req: any, res: Response, next: NextFunction) {
    const companyId = req.params.companyId;

    try {
      const ratings = await rating.find({ companyId }).select("-_id -__v").populate({
        path: "userId",
        select: "name"
      });
      return res.status(200).json(ratings);
    } catch (error) {
      return next(error);
    }
  },

  async editRating(req: any, res: Response, next: NextFunction) {
    const ratingId = req.params.ratingId;
    const { rates, companyId }: IRatingReqBody = req.body;

    const ratings = await rating.findOne({ companyId, _id: ratingId });

    if (!ratings) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    try {
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
  },

  async viewAvgRating(req: any, res: Response, next: NextFunction) {
    const companyId = req.params.companyId;
    try {
      const pipeline = [
        {
          $match: { companyId: new mongoose.Types.ObjectId(companyId) },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalRatings: { $sum: 1 },
          },
        },
      ];

      const result = await rating.aggregate(pipeline);
      return res.status(200).json({ rating: result[0]?.averageRating || null, total: result[0]?.totalRatings || null });
    } catch (error) {
      next(error);
    }


  }
}

export default ratingController;