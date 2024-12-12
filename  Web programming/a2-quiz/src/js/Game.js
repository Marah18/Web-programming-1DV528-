import Fetch from '/js/Fetch.js'
import Player from '/js/Player.js'
import GameInterface from '/js/GameInterface.js'

export default class Game {
  constructor () {
    this.nameForm = document.getElementById('username-form')
    this.nameDiv = document.getElementById('username-div')
    this.startButton = document.getElementById('startButton')
    this.restartButton = document.getElementById('restartButton')
    this.questionContainer = document.getElementById('quastion-contain')
    this.questionElement = document.getElementById('question')
    this.answerButtonsElement = document.getElementById('choices')
    this.scoreButton = document.getElementById('scoreButton')
    this.congratsMessage = document.getElementById('win')
    this.loserMessage = document.getElementById('lose')

    this.timerParagraph = document.getElementById('timer')
    this.timer = null
    this.startTime = null
    this.endTime = null

    this.answerButtonsElement = document.getElementById('choices')
    this.scoreParagraph = document.getElementById('scores-contain')

    this.startButton.addEventListener('click', () => this.startQuiz())
    this.restartButton.addEventListener('click', () => this.restartQuiz())
    this.scoreButton.addEventListener('click', () => this.gameInterface.toggleScores())

    this.fetcher = new Fetch()
    this.player = new Player()
    this.gameInterface = new GameInterface()
  }

  restartQuiz () {
    this.gameInterface.restartDisplay()
    this.startQuiz()
  }

  async startQuiz () {
    this.gameInterface.startDisplay()
    clearInterval(this.timer)
    try {
      const playerNameEntered = await this.player.enterName()
      if (playerNameEntered) {
        this.startTime = Date.now()
        await this.handleFetchQuestion()
      }
    } catch (error) {
      console.error('Error :', error.message)
    }
  }

  async handleFetchQuestion () {
    try {
      const question = await this.fetcher.fetchQuestion()
      this.showQuestion(question)
    } catch (error) {
      console.error('Error fetching question:', error.message)
    }
  }

  showQuestion (data) {
    this.gameInterface.paragraphDisplay('block', this.timerParagraph)
    this.gameInterface.paragraphDisplay('block', this.questionContainer)
    this.timeDown()
    const { question, nextURL, alternatives } = data
    this.questionContainer.textContent = `Question: ${question}`
    this.showQuestionAndChoices(question, alternatives, nextURL)
  }

  congrats () {
    this.endTime = Date.now()
    this.player.setScore(this.startTime, this.endTime)
    const playerName = this.player.getName()
    const score = this.player.getScore()
    this.gameInterface.storeScore(playerName, score)
    this.cleanQuestionContainer()
    this.timerParagraph.textContent = `Congratulations  ${this.player.getName()}`
    this.gameInterface.paragraphDisplay('block', this.restartButton)
    this.gameInterface.paragraphDisplay('block', this.congratsMessage)
  }

  losing () {
    this.cleanQuestionContainer()
    this.gameInterface.paragraphDisplay('block', this.loserMessage)
    this.gameInterface.paragraphDisplay('block', this.restartButton)
    this.gameInterface.paragraphDisplay('none', this.timerParagraph)
  }

  timeUp () {
    this.cleanQuestionContainer()
    this.gameInterface.paragraphDisplay('block', this.restartButton)    
    this.gameInterface.paragraphDisplay('block', this.timerParagraph)
    this.timerParagraph.textContent = 'Time is up !'
  }

  async checkAnswer (answer, nextURL) {
    clearInterval(this.timer)
    try {
      const response = await this.fetcher.post(nextURL, { answer })
      if (response.ok) {
        const responseData = await response.json()
        if (responseData.nextURL) {
          const nextQuestionData = await fetch(responseData.nextURL)
          const nextQuestion = await nextQuestionData.json()
          this.showQuestion(nextQuestion)
        } else {
          this.congrats()
        }
      } else {
        throw new Error('fail')
      }
    } catch {
      this.losing()
    }
  }

  showQuestionAndChoices (q, alts, nexturl) {
    this.cleanQuestionContainer()
    const questionParagraph = this.gameInterface.createTextElement('p', q)
    this.gameInterface.appendElements(this.questionContainer, questionParagraph)
    if (alts) {
      Object.keys(alts).forEach(key => {
        const choiceInput = this.gameInterface.createInputElement('radio', null, 'choices', key, null)
        const choiceLabel = this.gameInterface.createLabelElement(alts[key])
        this.gameInterface.appendElements(this.questionContainer, choiceInput, choiceLabel, this.gameInterface.createTextElement('br', ''))
      })
    } else {
      const choiceInput = this.gameInterface.createInputElement('text', 'answer-input', null, null, null)
      this.gameInterface.appendElements(this.questionContainer, choiceInput)
    }

    const submitBtn = this.gameInterface.createBtnElement('Answer', () => this.submitChoice(nexturl))
    this.gameInterface.appendElements(this.questionContainer, submitBtn)
  }

  submitChoice (nexturl) {
    const selectedChoice = document.querySelector('input[name="choices"]:checked')
    const choice = selectedChoice ? selectedChoice.value : document.getElementById('answer-input').value.trim()

    if (choice) {
      this.checkAnswer(choice, nexturl)
    } else {
      console.error('You must select an answer! ')
    }
  }

  cleanQuestionContainer () {
    this.questionContainer.innerHTML = ''
  }

  async timeDown () {
    clearInterval(this.timer)
    const updateTimer = () => {
      count--
      this.timerParagraph.textContent = `Timer: ${count}`
      if (count <= 0) {
        console.log('Time is up !')
        clearInterval(this.timer)
        this.timeUp()
      }
    }
    let count = 10
    updateTimer()
    this.timer = setInterval(updateTimer, 1000)
  }
}
