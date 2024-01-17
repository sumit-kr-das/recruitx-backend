import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'src/upload/');
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

export const MulterService = multer({
    storage,
    limits:{fileSize:100000000000000*2}
}).single('photo');