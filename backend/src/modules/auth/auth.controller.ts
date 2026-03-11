import type {Request, Response} from "express";
import { generateToken } from "./auth.service.js";
import bcrypt from "bcrypt";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    //exemplo de mock
    const user = {
        id: "1",
        email: "test@email.com",
        password: await bcrypt.hash("123456", 10)
    };

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if(!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = generateToken(user.id);

    return res.json({ token });
}