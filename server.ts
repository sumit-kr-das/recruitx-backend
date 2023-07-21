import express,{Application} from "express";
import connect from "./src/utils/connection";
import router from "./src/routes";
import bodyParser from "body-parser";
import cors from "cors";
import errorHandler from "./src/middleware/errorHandeler";
const app:Application = express();


app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use("/api",router);
app.use(errorHandler);


app.listen(8000, async ()=>{
    await connect();
    console.log("app listening");
})