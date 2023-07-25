import {z} from 'zod';

export const UserSchema = z.object({
    firstName:z.string().min(3),
    lastName :z.string().min(1),
    age:z.number().gt(0)
}); 



