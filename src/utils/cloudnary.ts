import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from '../config';

cloudinary.config({
    cloud_name: config.CLOUDNARY_CLOUD_NAME,
    api_key: config.CLOUDNARY_API_KEY,
    api_secret: config.CLOUDNARY_API_SECRET,
});

export const uploadOnCloudnary = async (localFilePath: string) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        return res;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export const destroyOnCloudnary = async (cloudinaryFilePath: string) => {
    try {
        if (!cloudinaryFilePath) {
            return null;
        }
        const res = await cloudinary.uploader.destroy(cloudinaryFilePath);
        return res;
    } catch (err) {
        return null;
    }
};
