import { useQuestionData } from './hooks/useQuestionData'

export const Footer = () => {
  const { correct, incorrect, unanswered } = useQuestionData()

  return (
    <footer style={{ marginTop: '16px' }}>
      <strong>{`✅ ${correct} correctas - ❌ ${incorrect} incorrectas - ❓ ${unanswered} sin responder`}</strong>
    </footer>
  )
}
