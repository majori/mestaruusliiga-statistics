import { Request } from 'express';

interface ExtendedRequest extends Request {
    options: {
        category: PlayerCategory;
        gender: PlayerGender;
    }
}