export default class GameInterface {
  constructor() {
    this.startButton = document.getElementById('startButton')
    this.nameDiv = document.getElementById('username-div')
    this.nameForm = document.getElementById('username-form')
    this.scoreParagraph = document.getElementById('scores-contain')
    this.restartButton = document.getElementById('restartButton')
    this.congratsMessage = document.getElementById('win')
    this.loserMessage = document.getElementById('lose')
    this.timerParagraph = document.getElementById('timer')
  }

  createInputElement(type, id, name, value, clickHandler) {
    const element = document.createElement('input')
    element.type = type
    element.id = id
    element.name = name
    element.value = value
    if (type !== 'text') {
      element.addEventListener('click', clickHandler)
    }
    element.classList.add('input-style')

    return element
  }

  createLabelElement(text) {
    const element = document.createElement('label')
    element.textContent = text
    element.classList.add('label-style')
    return element
  }

  createBtnElement(text, clickHandler) {
    const button = document.createElement('button')
    button.textContent = text
    button.addEventListener('click', clickHandler)
    button.classList.add('btn')
    return button
  }

  createTextElement(tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    element.classList.add('q-style')
    return element
  }

  appendElements(container, ...elements) {
    elements.forEach(element => container.appendChild(element))
  }

  storeScore(playerName, score) {
    const highScores = this.getHighScores()
    highScores.push({ playerName, score })
    highScores.sort((a, b) => a.score - b.score)
    const topScores = highScores.slice(0, 5)
    localStorage.setItem('highScores', JSON.stringify(topScores))
    console.log('Top 5 Scores:', topScores)
  }

  getHighScores() {
    const storedScores = localStorage.getItem('highScores')
    return storedScores ? JSON.parse(storedScores) : []
  }

  createScoreContent(scores) {
    const tableContent = document.getElementById('score-table-body')
    tableContent.innerHTML = ''

    scores.forEach((level, index) => {
      const row = document.createElement('tr')
      row.innerHTML = `<td>${index + 1}</td>
                            <td>${level.playerName}</td>
                            <td>${level.score.toFixed(2)}</td>`
      tableContent.appendChild(row)
    })
  }

  showScores() {
    const m = this.getHighScores()
    this.createScoreContent(m)
    this.scoreParagraph.style.display = 'block'
    console.log('Show Score !')
    const scoreButton = document.getElementById('scoreButton')
    scoreButton.textContent = 'CLOSE'
  }

  hideScores() {
    const scoreButton = document.getElementById('scoreButton')
    this.scoreParagraph.style.display = 'none'
    scoreButton.style.display = 'block'
    scoreButton.textContent = 'TOP SCORE'
  }

  toggleScores() {
    if (this.scoreParagraph.style.display === 'none') {
      this.showScores()
    } else {
      this.hideScores()
    }
  }

  startDisplay() {
    this.nameDiv.style.display = 'block'
    this.startButton.classList.add('hide')
    this.nameDiv.style.display = 'block'
  }

  restartDisplay() {
    this.congratsMessage.style.display = 'none'
    this.loserMessage.style.display = 'none'
    this.restartButton.style.display = 'none'
    this.nameForm.style.display = 'block'
    this.paragraphDisplay('none', this.timerParagraph)
  }

  paragraphDisplay(display, paragraphName) {
    paragraphName.style.display = display
  }
}
