import Groq from 'groq-sdk'; 
import SkinAnalysis from '../models/Skinanalysis.js';
import dotenv from "dotenv";
dotenv.config();


const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY ,
    
});

const buildGroqPrompt = (userData) => {
  return `
You are an expert dermatologist and nutritionist specialized in skin care. 
Given the user's input below, provide the following in a detailed and structured JSON:
- Skin Type with detailed reasoning.
- Personalized diet suggestions (what to eat and avoid).
- Skincare routine schedule (when and how to use products).
- Recommended products matching user's budget.
- Do’s and Don’ts (in detail).
- Any additional remarks.

User Data:
Age: ${userData.age}
Gender: ${userData.gender}
Skin Type Description: ${userData.skinType}
Post Cleanse Feeling: ${userData.postCleanseFeel}
Sensitivity Level: ${userData.sensitivityLevel}
Primary Concerns: ${userData.concerns.join(', ')}
Acne Type: ${userData.acneType.join(', ')}
Active Ingredients Currently Used: ${userData.currentActives.join(', ')}
Past Product Irritations: ${userData.pastProductsHated}
Climate: ${userData.climate}
Sleep Hours: ${userData.sleep}
Budget Range: ${userData.budget}

The output must be pure JSON only, strictly following this format:

{
  "skinType": "<string>",
  "skinTypeReasoning": "<string>",
  "dietSuggestions": {
    "eat": ["<string>", "<string>", "..."],
    "avoid": ["<string>", "<string>", "..."]
  },
  "routineSchedule": {
    "morning": ["<string>", "<string>", "..."],
    "night": ["<string>", "<string>", "..."],
    "weekly": ["<string>", "<string>", "..."]
  },
  "recommendedProducts": [
    {"name": "<string>", "reason": "<string>", "priceRange": "<string>"}
  ],
  "dosAndDonts": {
    "dos": ["<string>", "<string>", "..."],
    "donts": ["<string>", "<string>", "..."]
  },
  "additionalRemarks": "<string>"
}
`;
};







export const skinanalysis =  async (req, res) => {
  const userData = req.body;
  console.log(userData);

  const prompt = buildGroqPrompt(userData);

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" }, 
    });

    const rawResponse = result.choices[0]?.message?.content.trim();
   

    // Extract pure JSON (safely)
    const jsonMatch = rawResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error('No valid JSON found in Groq response');

    const jsonData = JSON.parse(jsonMatch[0]);
     console.log("jsondataresponse",jsonData);
const existing = await SkinAnalysis.findOne({ user: req.user.id });

if (existing) {
  await SkinAnalysis.deleteOne({ user: req.user.id });
}
    const newAnalysis = new SkinAnalysis({
      user: req.user.id,
      ...jsonData, // spread operator, pura JSON data save karega
    });

    await newAnalysis.save();
    

    

    res.status(201).json({
      success: true,
      message: "Skin analysis saved successfully",
      data: newAnalysis,
    });

    // res.status(200).json({ data: jsonData });
  } catch (error) {
    console.error('bhai idhar se aya error Groq API error:', error);
    res.status(500).json({ error: 'groq failed Failed to generate skin analysis.' });
  }
}


export const getAnalysisForUser = async (req, res) => {
  console.log("getAnalysisForUser called");
  try {
    const userId = req.user?.id || req.user?._id;
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      console.log("userId not found");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const analysis = await SkinAnalysis.findOne({ user: userId });
    if (!analysis) {
      console.log("No 000000000000000000000000000000000000000000000000000000000000analysis found");
      return res.status(404).json({ success: false, message: "No analysis found" });
    }

    // console.log("Analysis found. Sending response...");
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    console.error("getAnalysisForUser  main catch main error error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch analysis" });
  }
};

export const checkresultuser = async(req,res)=>{
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "phle verify hokar a Unauthorized" });

    const analysis = await SkinAnalysis.findOne({ user: userId });
    if (!analysis){
        console.log("Nnnnnnnnnnnnnnnnnnno analysis found");
    return res.status(404).json({ success: false, message: "mila hi nhi bc analysisNo analysis found" });
     }
      //  console.log("analysis in checkresultuser",analysis);
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    console.error("getAnalysisForUser error:", err);
    res.status(500).json({ success: false, message: "tech he nhi kar paya Failed to fetch analysis" });
  }
}


// No more global chatHistory variable!
// let chatHistory = []; // DELETE THIS LINE

export const askChat = async (req, res) => {
  // Get both the new prompt AND the previous chat history from the frontend
  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  try {
    // Build messages for Groq from the history sent by the client
    const messages = history.flatMap(msg => [
      { role: "user", content: msg.prompt },
      // Make sure to only include responses that actually exist
      msg.response ? { role: "assistant", content: msg.response } : null
    ]).filter(Boolean); // filter(Boolean) removes any null entries

    // Add the user's NEW prompt to the messages
    messages.push({ role: "user", content: prompt });

    // System instruction for expert dermatology & nutrition answers
    messages.unshift({
      role: "system",
      content: `
You are an expert dermatologist and nutritionist specialized in skin care. 
Answer only about dermatology, skin health, and diet. 

Guidelines for responses:
- Be precise and concise; avoid fluff.
- Provide actionable advice that can be applied immediately.
- Use simple language, easy to follow.
- If the question involves causes, remedies, or routines, organize answers in bullet points or numbered lists.
- Keep answers focused on the user's question; do not provide unrelated information.
- Maintain professional tone, but make it readable for general users.
- Limit answer length: prioritize quality over quantity.
- Always include practical tips when relevant.
`
    });

    // Call Groq chat completions
    const result = await groq.chat.completions.create({
       model: "openai/gpt-oss-20b", // Using a recommended model, change if needed
      messages,
      response_format: { type: "text" }
    });

    const botReply = result.choices[0]?.message?.content?.trim() || "Sorry, I could not answer that.";

    // IMPORTANT: Send back ONLY the new response, not the whole chat.
    res.status(200).json({ success: true, response: botReply });

  } catch (error) {
    console.error("hogya chat grok fail Groq API error:", error);
    res.status(500).json({ success: false, message: " grok fail t o aakFailed to get response from Groq", error: error.message });
  }
};

// The resetChat function is now controlled by the frontend, but you can keep this endpoint if you want a server-side way to log resets.
export const resetChat = (req, res) => {
  // This endpoint doesn't need to do anything with a database or memory anymore.
  res.status(200).json({ success: true, message: "Chat reset signal received" });
};