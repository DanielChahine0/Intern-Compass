// Debug script to test different chat prompts
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
const TEST_USER_ID = 1;

const testPrompts = [
  "What's our tech stack?",
  "Show me the first-week checklist?",
  "Can I bring the black book home?",
  "What's the company architecture?"
];

async function testPrompt(prompt) {
  console.log(`\n=== Testing: "${prompt}" ===`);
  
  try {
    // First, save the user message
    console.log('1. Saving user message...');
    const userResponse = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        role: 'user',
        content: prompt
      })
    });
    
    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error(`❌ Failed to save user message: ${userResponse.status} - ${error}`);
      return;
    }
    
    console.log('✅ User message saved');
    
    // Then call Gemini API
    console.log('2. Calling Gemini API...');
    const geminiResponse = await fetch(`${API_BASE}/gemini/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        history: [],
        model: 'flash',
        config: { temperature: 0.3, maxOutputTokens: 1024 }
      })
    });
    
    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error(`❌ Gemini API failed: ${geminiResponse.status} - ${error}`);
      return;
    }
    
    const result = await geminiResponse.json();
    console.log('✅ Gemini response received:', result.data?.response?.substring(0, 100) + '...');
    
  } catch (error) {
    console.error(`❌ Error testing prompt: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Starting chat prompt tests...');
  
  for (const prompt of testPrompts) {
    await testPrompt(prompt);
    // Wait a bit between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ All tests completed!');
}

runTests();