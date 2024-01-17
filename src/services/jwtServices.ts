import {config} from "../config/index";
import jwt from 'jsonwebtoken';

class JwtService {
    static sign(payload:any, expiry="1d", secret=config.JWT_SECRET) {
        return jwt.sign(payload, secret, { expiresIn: expiry })
    }
    static verify(token:any, secret = config.JWT_SECRET) {
        return jwt.verify(token, secret);
    }
}

export default JwtService;