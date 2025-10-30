
import dotenv from 'dotenv';
console.log("🟢 server.js started");
import { app } from "./app.js";
console.log("🟢 app imported");

const PORT = process.env.PORT ;
dotenv.config();

app.listen(PORT, () => {

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:  yha", process.env.EMAIL_PASS ? "Loaded ✅" : "Not loaded ❌");

    console.log(`Server is running on port ${PORT}`);
});