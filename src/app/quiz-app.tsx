"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronRight, Search, Upload, Users, Scan, Mail } from "lucide-react"
import Confetti from 'react-confetti'

const quizData = [
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
  {
    question: "What is the largest planet in our solar system?",
    options: ["Mars", "Jupiter", "Saturn", "Neptune"],
    correctAnswer: 1
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Silver", "Oxygen", "Iron"],
    correctAnswer: 2
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2
  }
]

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [showConfetti, setShowConfetti] = useState(false)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSent, setInviteSent] = useState(false)
  const [showQuizWithFriend, setShowQuizWithFriend] = useState(false)

  useEffect(() => {
    if (isQuizActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isQuizActive])

  const handleStartQuiz = () => {
    setIsQuizActive(true)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(300)
    setSelectedAnswer(null)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
    setSelectedAnswer(null)
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowConfetti(true)
      setIsQuizActive(false)
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // Simulate processing the file and starting the quiz
      await new Promise(resolve => setTimeout(resolve, 2000))
      handleStartQuiz()
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending an invite
    await new Promise(resolve => setTimeout(resolve, 1000))
    setInviteSent(true)
  }

  const progress = (currentQuestionIndex / quizData.length) * 100
  const timerProgress = (timeLeft / 300) * 100

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {showConfetti && <Confetti />}
      {isQuizActive && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, #3b82f6 0%, #3b82f6 ${timerProgress}%, transparent ${timerProgress}%, transparent 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 10px 10px, 10px calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 10px, 10px 10px)',
          }}
        />
      )}

      <div className="flex-1 flex p-4 md:p-6 lg:p-8">
        {isQuizActive ? (
          <div className="flex w-full">
            <div className="w-4 bg-gray-200 rounded-full mr-8 relative">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-full transition-all duration-300 ease-out"
                style={{ height: `${progress}%` }}
              />
            </div>

            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Question {currentQuestionIndex + 1} of {quizData.length}</span>
                  <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <h2 className="text-2xl font-bold mb-4">{quizData[currentQuestionIndex].question}</h2>
                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                  {quizData[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={selectedAnswer === null}
                  className="ml-auto"
                >
                  {currentQuestionIndex === quizData.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-semibold">Hi, David 👋</h1>
                <p className="text-sm text-muted-foreground">Ready to challenge yourself?</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="David" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="relative mb-4">
              <Input type="search" placeholder="Search Community Quizzes" className="pl-10 pr-4 py-2" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold">500 Tokens</div>
              <Button variant="outline" size="sm">Buy Tokens</Button>
            </div>
            
            <ScrollArea className="h-40 mb-4">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start" onClick={() => setShowQuizWithFriend(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Quiz with friend
                </Button>
                <Button variant="outline" className="justify-start">
                  <Scan className="mr-2 h-4 w-4" />
                  Scan and Quiz
                </Button>
              </div>
            </ScrollArea>
            
            {showQuizWithFriend ? (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Quiz with a Friend</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvite}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="friendEmail">Friend's Email</Label>
                        <Input 
                          id="friendEmail" 
                          placeholder="friend@example.com" 
                          type="email" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={inviteSent}>
                      {inviteSent ? "Invite Sent" : "Send Invite"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary/80">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF or Word (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                  {file && <p className="mt-2 text-sm text-muted-foreground">File uploaded: {file.name}</p>}
                </CardContent>
              </Card>
            )}

            {showConfetti && (
              <Card>
                <CardContent className="text-center py-6">
                  <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                  <p className="text-xl">Your score: {score} out of {quizData.length}</p>
                </CardContent>
              </Card>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  <Users className="mr-2 h-4 w-4" />
                  View Participants
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Quiz Participants</DialogTitle>
                  <DialogDescription>
                    These are the friends you're taking the quiz with.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Your avatar" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">You</p>
                      <p className="text-sm text-muted-foreground">your.email@example.com</p>
                    </div>
                  </div>
                  {inviteSent && (
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-avatar-2.jpg" alt="Friend's avatar" />
                        <AvatarFallback>
                          <Mail className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Invited Friend</p>
                        <p className="text-sm text-muted-foreground">{inviteEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => {}}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}