import express,{Application} from "express";
import connect from "./src/utils/connection";
import router from "./src/routes";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "./src/middleware/errorHandeler";
import path from "path";
const app:Application = express();


// declare const global: Global; 
// global.appRoot = path.resolve(__dirname);


app.use(express.json());
app.use(express.urlencoded({ extended: false})); // used for understand img
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use("/api",router);
app.use(errorHandler);
app.use(express.static(__dirname));


app.listen(8000, async ()=>{
    await connect();
    console.log("app listening");
})