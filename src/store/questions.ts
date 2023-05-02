import { create } from 'zustand'
import { type Question } from '../types'
import confetti from 'canvas-confetti'

interface State {
  questions: Question[]
  currentQuestion: number
  fetchQuestions: (limit: number) => Promise<void>
  selectAnswer: (questionId: number, answerIndex: number) => void
  goNextQuestion: () => void
  goPreviousQuestion: () => void
}

export const useQuestionsStore = create<State>((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,

    fetchQuestions: async (limit: number) => {
      const res = await fetch('http://127.0.0.1:5173/data.json')
      const json = await res.json()

      const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)
      set({ questions })
    },

    // como cambia el estado de la pregunta cuando hacemos una seleccion de la respuesta
    selectAnswer: (questionId: number, answerIndex: number) => {
      const { questions } = get()
      // vamos a usar structuredClone para clonar el objeto
      const newQuestions = structuredClone(questions)
      // encontrar el indice de la pregunta
      const questionIndex = newQuestions.findIndex((q: Question) => q.id === questionId)
      // obtenemos la informacion de la pregunta
      const questionInfo = newQuestions[questionIndex]
      // averiguamos si el usuario ha seleccionado la respuesta correcta
      const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex

      if (isCorrectUserAnswer) confetti()
      // cambiar esta informacion en la copia de la pregunta
      newQuestions[questionIndex] = {
        ...questionInfo,
        isCorrectUserAnswer,
        userSelectedAnswer: answerIndex
      }

      // actualizamos el estado
      set({ questions: newQuestions })

      // set((state) => {
      //   const questions = state.questions.map((question) => {
      //     if (question.id === questionId) {
      //       return {
      //         ...question,
      //         userSelectedAnswer: answerIndex,
      //         isCorrectUserAnswer: question.correctAnswer === answerIndex
      //       }
      //     }
      //     return question
      //   })
      //   return { questions }
      // })
    },

    goNextQuestion: () => {
      const { currentQuestion, questions } = get()
      const nextQuestion = currentQuestion + 1

      if (nextQuestion < questions.length) {
        set({ currentQuestion: nextQuestion })
      }
    },

    goPreviousQuestion: () => {
      const { currentQuestion } = get()
      const previousQuestion = currentQuestion - 1

      if (previousQuestion >= 0) {
        set({ currentQuestion: previousQuestion })
      }
    }

  }
})
