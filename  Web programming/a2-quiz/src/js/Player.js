export default class Player {
  constructor() {
    this.nameForm = document.getElementById('username-form')
    this.nameDiv = document.getElementById('username-div')
    this.score = 0
    this.name = ''
  }

  enterName() {
    return new Promise((resolve, reject) => {
      this.nameDiv.style.display = 'block'
      this.nameForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const playerName = document.getElementById('username-input').value.trim()
        this.name = playerName

        if (playerName) {
          this.nameForm.style.display = 'none'
          localStorage.setItem('username-input', this.name)
          resolve(true)
        } else {
          alert('Enter your nickname first!')
          reject(new Error('No player name provided'))
        }
      })
    })
  }

  getScore() {
    return this.score
  }

  setScore(start, end) {
    this.score = (end - start) / 1000
  }

  getName() {
    return this.name
  }
}
