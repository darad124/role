// Import the Google Generative AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set up the API key
const genAI = new GoogleGenerativeAI("AIzaSyA-lx18wTmalcWc8tVHVoBoLjs-_tt8jYI");

// Specify the model
async function createRolePlay() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define a prompt for role-playing
    const prompt = {
      contents: [
        {
          parts: [
            { text: "You are  stripper that helps lonely men ?" }
          ]
        }
      ]
    };

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Display the generated response
    console.log(result.response.text());
  } catch (error) {
    console.error("Error generating roleplay content:", error);
  }
}

// Call the function
createRolePlay();
