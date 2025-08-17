# QuizGen AI Setup Guide

## Fixing the "Failed to generate quiz" Error

The error you're seeing is likely due to a missing or invalid Gemini API key. Follow these steps to fix it:

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Create Environment File

Create a file named `.env.local` in the root directory of your project with the following content:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### 3. Restart the Development Server

After creating the `.env.local` file:

1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again

### 4. Test the Application

1. Upload a PDF file
2. Select the number of questions
3. The quiz should now generate successfully

## Troubleshooting

### If you still get errors:

1. **Check the browser console** (F12) for detailed error messages
2. **Verify your API key** is correct and not expired
3. **Ensure the PDF file** is not corrupted and contains readable text
4. **Check your internet connection** as the app needs to connect to Google's AI services

### Common Issues:

- **"API_KEY environment variable not set"**: Make sure you created the `.env.local` file correctly
- **"Invalid API Key"**: Double-check that you copied the entire API key correctly
- **"Invalid format"**: The AI model might have returned malformed data - try with a different PDF or fewer questions

## File Structure

Your `.env.local` file should be in the same directory as `package.json`:

```
copy-of-copy-of-quizgen-ai (1)/
├── .env.local          ← Create this file
├── package.json
├── App.tsx
└── ...
```

## Security Note

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly
