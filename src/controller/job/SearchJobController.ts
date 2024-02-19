import { Response, Request, NextFunction } from 'express';
import job from '../../model/job';
import Joi, { object } from 'joi';
import { ISearchJob } from '../../@types/jobTypes';

const searchJobController = {
    async searchJob(req: Request, res: Response, next: NextFunction) {
        const { limit, ...others }: { limit?: number;[key: string]: any } =
            req.query;
        const searchSchema = Joi.object({
            title: Joi.string().allow(null, ''),
            location: Joi.string().allow(null, ''),
            exprience: Joi.number().allow(null, ''),
        });

        const { error } = searchSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { title, location, exprience }: ISearchJob = req.body;

        if (title || location || exprience) {
            let query = {};
            if (title && location && exprience) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.location': { $regex: location, $options: 'i' },
                    'info.minExprience': { $lte: exprience },
                };
            } else if (title && location) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.location': { $regex: location, $options: 'i' },
                };
            } else if (title && exprience) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.minExprience': { $lte: exprience },
                };
            } else if (title) {
                query = {
                    title: { $regex: title, $options: 'i' },
                };
            }
            try {
                const jobs = await job.find({ ...query, ...others });
                return res.status(200).json(jobs);
            } catch (error) {
                return next(error);
            }
        } else {
            const jobs = await job.find({ ...others }).sort({ createdAt: -1 });
            return res.status(200).json(jobs);
        }
    },

    async searchByTags(req: Request, res: Response, next: NextFunction) {
        const tag = req.query.tag;
        try {
            const jobs = await job.find({ tags: tag });
            return res.status(200).json({ jobs });
        } catch (error) {
            return next(error);
        }
    },

    async searchBySkill(req: Request, res: Response, next: NextFunction) {
        const skill = req.query.skill;

        try {
            const jobs = await job.find({ 'info.skills': skill });
            return res.status(200).json({ jobs });
        } catch (error) {
            return next(error);
        }
    },

    async jobSearch(req: any, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const location = req.query.location;
            const minSalary = parseInt(req.query.minSalary) || 0;
            const jobTypes = req.query.jobTypes;
            const minExprience = parseInt(req.query.minExprience) || 0;
            const workplaceType = req.query.workplaceType || null;
            const page = parseInt(req.query.page) - 1 || 0;
            let skill = req.query.skill || 'All';
            const skills = [
                'html',
                'css',
                'javascript',
                'react',
                'angular',
                'vue.js',
                'bootstrap',
                'jQuery',
                'web design',
                'web development',
                'node.js',
                'express.js',
                'mongodb',
                'RESTful API',
                'AJAX',
                'PHP',
                'laravel',
                'symfony',
                'codeigniter',
                'python',
                'django',
                'flask',
                'ruby',
                'ruby on rails',
                'java',
                'spring',
                'kotlin',
                'android development',
                'iOS development',
                'swift',
                'objective-c',
                'xamarin',
                'flutter',
                'dart',
                'git',
                'github',
                'bitbucket',
                'version control',
                'continuous integration',
                'jenkins',
                'docker',
                'kubernetes',
                'aws',
                'azure',
                'google cloud platform',
                'devops',
                'agile',
                'scrum',
                'kanban',
                'software engineering',
                'programming',
                'algorithms',
                'data structures',
                'cybersecurity',
                'network security',
                'penetration testing',
                'ethical hacking',
                'machine learning',
                'artificial intelligence',
                'data science',
                'big data',
                'hadoop',
                'spark',
                'natural language processing',
                'computer vision',
                'blockchain',
                'solidity',
                'cryptocurrency',
                'fintech',
                'e-commerce',
                'CMS (content management system)',
                'wordpress',
                'joomla',
                'drupal',
                'e-learning',
                'LMS (learning management system)',
                'SEO',
                'SEM',
                'digital marketing',
                'social media',
                'content writing',
                'blogging',
                'graphic design',
                'UI/UX design',
                'user research',
                'usability testing',
                'product management',
                'customer support',
                'technical support',
                'helpdesk',
                'IT consulting',
                'system administration',
                'network administration',
                'cloud architecture',
                'UI/UX prototyping',
                'wireframing',
                'user personas',
                'customer success',
                'sales',
                'business development',
            ];

            skill === 'All'
                ? (skill = [...skills])
                : (skill = req.query.skill.split(','));

            const query: any = {
                title: { $regex: search, $options: 'i' },
                'info.minExprience': { $gte: minExprience },
                'info.minSalary': { $gte: minSalary },
                'info.skills': { $in: skill }
            };

            if (location) {
                query['info.location'] = location;
            }

            if (jobTypes) {
                query['info.jobType'] = jobTypes;
            }


            if (workplaceType && workplaceType.length !== "") {
                query['info.workplaceType'] = workplaceType;

            }
            const jobs = await job.find(query).skip(page * limit).limit(limit);


            const response = {
                page: page + 1,
                limit,
                jobs,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async searchJobTitles(req: any, res: Response, next: NextFunction) {
        const search = req.query.search || '';

        try {
            const jobTitles = await job.find({ title: { $regex: search, $options: 'i' } }).select("title -_id")
            return res.status(200).json(jobTitles);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
};

export default searchJobController;
