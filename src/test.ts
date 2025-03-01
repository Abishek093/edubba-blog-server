import "reflect-metadata"; 
import connectDB from "./config/db"; 
import { AuthRepository } from "./adapters/repositories/AuthRepository";

async function test() {
    try {
        await connectDB(); 

        const repos = new AuthRepository();
        const exists = await repos.getUserByUsername("hello");
        console.log("User exists:", exists);
    } 
    catch (error) {
        console.error("Test failed:", error);
    } 
    finally {
        process.exit(); 
    }
}

test();
