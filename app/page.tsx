'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Image from 'next/image'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    testAPI();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const analyzeLawn = async () => {
    console.log("Analyze button clicked");
    if (!file) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      console.log("Starting analysis");
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      console.log("API Key (first 5 chars):", process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 5));

      // Use gemini-pro model instead of gemini-pro-vision for testing
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      console.log("Sending request to Gemini API");
      const result = await model.generateContent("Analyze a hypothetical lawn and provide information about: 1. Grass type, 2. Overall health, 3. Potential issues, 4. Recommendations for improvement");

      console.log("Received response from Gemini API");
      const response = await result.response;
      const text = response.text();
      setAnalysis(text);
      console.log("Analysis result:", text);
    } catch (error) {
      console.error('Error analyzing lawn:', error);
      setAnalysis(`Error analyzing lawn: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    try {
      console.log("Testing API");
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      console.log("API Key (first 5 chars):", process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 5));
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent("Hello, how are you?");
      const response = await result.response;
      const text = response.text();
      console.log("API Test Response:", text);
    } catch (error) {
      console.error("API Test Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-8">Lawn Analyzer</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test API</h2>
          <input
            type="text"
            placeholder="Enter a question"
            className="border p-2 mr-2"
            id="testInput"
          />
          <button
            onClick={async () => {
              const input = document.getElementById('testInput') as HTMLInputElement;
              const question = input.value;
              try {
                const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
                const result = await model.generateContent(question);
                const response = await result.response;
                const text = response.text();
                console.log("Test API Response:", text);
                alert("API Test Response: " + text);
              } catch (error) {
                console.error("API Test Error:", error);
                alert("API Test Error: " + error);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Test API
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Your Lawn Photo</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {file && (
            <div className="mb-4">
              <Image
                src={URL.createObjectURL(file)}
                alt="Uploaded lawn"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
          <button
            onClick={() => {
              console.log("Button clicked");
              alert("Button clicked"); // This will show a popup
              analyzeLawn();
            }}
            disabled={!file || loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze Lawn'}
          </button>
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Lawn Analysis</h2>
            <pre className="whitespace-pre-wrap text-black">{analysis}</pre>
          </div>
        )}
        {!analysis && loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <p className="text-black">Analyzing...</p>
          </div>
        )}
      </div>
    </main>
  )
}