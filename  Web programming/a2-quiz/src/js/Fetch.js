export default class Fetch {
  async fetchQuestion() {
    try {
      const response = await fetch('https://courselab.lnu.se/quiz/question/1')

      if (!response.ok) {
        throw new Error('Error: Failed to fetch data')
      }

      const data = await response.json()

      if (!data || Object.keys(data).length === 0) {
        throw new Error('Error: Not received !')
      }

      return data
    } catch (error) {
      throw new Error('Error: Not fetching !, : ' + error.message)
    }
  }

  async post(url, data) {
    return await fetch(url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  }
}
