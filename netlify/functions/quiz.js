const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { prompt, age, subject, userAnswer, question } = body;

    // If userAnswer and question are provided, check the answer
    if (userAnswer && question) {
      // Ask Gemini to check the answer
      const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro-preview",
          messages: [
            { role: 'system', content: 'You are a helpful quiz grader. Respond with only "correct" or "incorrect".' },
            { role: 'user', content: `Question: ${question}\nUser's answer: ${userAnswer}\nIs the answer correct?` }
          ]
        })
      });
      const data = await response.json();
      const feedback = data?.choices?.[0]?.message?.content?.toLowerCase().includes('correct') ? data.choices[0].message.content : 'No feedback';
      return {
        statusCode: 200,
        body: JSON.stringify({ feedback })
      };
    }

    // Otherwise, generate a new question
    if (!prompt || !age || !subject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt, age, or subject' })
      };
    }

    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-preview",
        messages: [
          { role: 'user', content: `Generate a fun ${subject} quiz question for a ${age} year old. Prompt: ${prompt}. Only provide the question, not the answer.` }
        ]
      })
    });
    const data = await response.json();
    const quizQuestion = data?.choices?.[0]?.message?.content ?? 'No question generated.';
    return {
      statusCode: 200,
      body: JSON.stringify({ question: quizQuestion })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
