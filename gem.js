const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAe_3ksSR8ILs3tGqxJeqOFJIsepES3qAs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Give me a tree-sitter query that selects variables with a name shorter than three characters.";

const result = await model.generateContent(prompt);
console.log(result.response.text());

