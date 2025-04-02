import jwt from "jsonwebtoken"; 

export const generateToken = (id,role) =>{
    try {
        const token = jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
        return token

    } catch (error) {
        console.log("Token generation error:", error)
        return null;
    }
}