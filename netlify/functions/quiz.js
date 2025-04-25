// netlify/functions/quiz.js

const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { prompt, age, subject } = JSON.parse(event.body);

    // Prepare the request body for AIML API
    const requestData = {
      model: "google/gemini-2.5-pro-preview", // You can change this if needed
      messages: [
        {
          role: "user",
          content: `Create a fun and simple quiz question for a ${age}-year-old student about ${subject}. Use this context: ${prompt}`
        }
      ]
    };

    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AIML_API_KEY}` // Use your AIML API key here
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    const quizQuestion = data.choices && data.choices[0] ? data.choices[0].message.content : "Error generating quiz question.";

    return {
      statusCode: 200,
      body: JSON.stringify({ question: quizQuestion })
    };
  } catch (err) {
    console.error("Error generating quiz question:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate quiz question." })
    };
  }
};
