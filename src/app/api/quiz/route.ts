import { NextResponse } from 'next/server'

export async function GET() {
  // Here you would implement the logic to generate a quiz
  // For now, we'll just return some sample data
  
  const quiz = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1
    },
    // Add more questions...
  ]
  
  return NextResponse.json({ success: true, quiz })
}