import { Response, NextFunction } from "express";
import Joi from "joi";
import userProjects from "../../model/userProjects";
import { IUserProjectReqBody } from "../../@types/userProjectTypes";

const userProjectController = {
    async createProject(req: any, res: Response, next: NextFunction) {
        const addProjectSchema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            skills: Joi.array().required(),
            startDate: Joi.string().required(),
            endDate: Joi.string(),
            associate: Joi.string().required()
        });

        const { error } = addProjectSchema.validate(req.body);

        if (error) {
            console.log(error)
            return next(error);
        }

        const { name, description, skills, startDate, endDate, associate }: IUserProjectReqBody = req.body;

        const projectCreate = new userProjects({
            userId: req.user.id,
            name,
            description,
            skills,
            startDate,
            endDate,
            associate,
        });

        try {
            const saveProjectDeatils = await projectCreate.save();
            if (saveProjectDeatils) {
                return res.status(200).json({ msg: "New Project has been added successfully" });
            }
        } catch (error) {
            return next(error);
        }

    },




    async viewProject(req: any, res: Response, next: NextFunction) {
        try {
            const userProject = await userProjects.find({ userId: req.user.id }).select('-userId -__v  -createdAt -updatedAt');
            return res.status(200).json(userProject);
        } catch (error) {
            return next(error)
        }
    },





    async updateProject(req: any, res: Response, next: NextFunction) {
        const updateProject = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            skills: Joi.array().required(),
            startDate: Joi.string().required(),
            endDate: Joi.string(),
            associate: Joi.string().required()
        });

        const { error } = updateProject.validate(req.body);

        if (error) {
            return next(error)
        }

        const { name, description, skills, startDate, endDate, associate }: IUserProjectReqBody = req.body;
        const p_id = req.params.id;

        try {
            const updateUserProject = await userProjects.findByIdAndUpdate(
                {
                    _id: p_id,
                },
                {
                    name,
                    description,
                    skills,
                    startDate,
                    endDate,
                    associate
                },
                { new: true }
            );

            if (!updateUserProject) {
                return res.status(404).json({ msg: "Project datails not updated" })
            }

            return res.status(200).json({ msg: "User project datails updated successfully" })
        } catch (error) {
            return next(error);
        }
    },

    async deleteProject(req: any, res: Response, next: NextFunction) {
        const p_id = req.params.id;

        try {
            const deleteProject = await userProjects.findByIdAndDelete({
                _id: p_id
            });

            if (!deleteProject) {
                return res.status(404).json({ msg: "Project deletion not completed" })
            }

            return res.status(200).json({ msg: "Project Deleted Successfully" })

        } catch (error) {
            return next(error);
        }
    }
}

export default userProjectController;