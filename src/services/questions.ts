
export const getAllQuestions = async () => {
  const res = await fetch('http://127.0.0.1:5173/data.json')
  const json = await res.json()
  return json
}
