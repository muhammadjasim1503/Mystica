const fetch = require('node-fetch');  // Ensure that fetch is available

exports.handler = async function(event, context) {
  try {
    // Extract data from the request body
    const { prompt, age, subject } = JSON.parse(event.body);

    // Make sure all necessary fields are provided
    if (!prompt || !age || !subject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt, age, or subject' })
      };
    }

    // Send a POST request to the AIML API
    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIML_API_KEY}`,  // Using your AIML API key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-preview",  // Gemini model
        messages: [{
          role: 'user',
          content: `Generate a fun ${subject} quiz question for a ${age} year old. Prompt: ${prompt}`
        }]
      })
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from AIML API');
    }

    // Parse the response from the AIML API
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content ?? 'No response from Gemini';

    // Return the quiz question as a response
    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
