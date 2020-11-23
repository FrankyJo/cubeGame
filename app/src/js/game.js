import $ from "jquery";
import 'bootstrap/js/dist/modal';

export default class cubeGame {
  constructor(lengthCube = '10', widthCube = '30', heightCube = '30', colorCube = '#ff5722', timeGame = '60') {
    this.start = document.querySelector('.btn-start')
    this.newGame = document.querySelector('.btn-new-game')

    this.pointsInput = document.getElementById('points')
    this.points = 0
    this.timerInput = document.getElementById('timer')
    this.time = timeGame
    this.modalWindow = $('#modal-result')
    this.scoreInModal = document.querySelector('.score-modal')
    this.gamerNameInModal = document.querySelector('#gamer-name')
    this.buttonSaveResult = document.querySelector('.save-result')

    this.resultTable = document.querySelector('.result-table')
    this.playingField = document.querySelector('.game__playing-field')
    this.playingFieldWidth = this.playingField.offsetWidth
    this.playingFieldHeight = this.playingField.offsetHeight

    this.CubesOnField = lengthCube
    this.widthCube = widthCube
    this.heightCube = heightCube
    this.color = colorCube
  }

  createElement(tag, className, style = '') {
    const element = document.createElement(tag)
    element.className = className
    element.style.cssText = style
    return element
  }

  createCube() {
    let style = `
        position: absolute;
        top: ${this.randomizer(0, this.playingFieldHeight - this.widthCube)}px;
        left: ${this.randomizer(0, this.playingFieldWidth - this.heightCube)}px;
        width: ${this.widthCube}px;
        height: ${this.heightCube}px;
        background-color: ${this.color}
      `
    return this.createElement('div', 'cube', style)
  }

  createNewCubes() {
    const countCube = this.randomizer(0, 2)

    for (let i = 1; i <= countCube; i++) {
      let cube = this.createCube()
      this.playingField.appendChild(cube)
    }
  }

  startCubesOnField(length) {
    for (let i = 0; i < length; i++) {
      let cube = this.createCube()
      this.playingField.appendChild(cube)
    }
  }

  cleanField() {
    this.playingField.innerHTML = ''
  }

  listener() {
    this.start.addEventListener('click', () => {
      this.startCubesOnField(this.CubesOnField)
      this.start.setAttribute('disabled', '')
      this.timer()
    })

    this.newGame.addEventListener('click', () => {
      this.cleanField()
      this.cleanTimer()
      this.pointsInput.value = 0
      this.points = 0
      this.start.removeAttribute('disabled')
    })

    this.playingField.addEventListener('click', (el) => {
      let target = el.target
      if (target.classList.contains('cube')) {
        this.points++
        this.pointsInput.value = this.points
        target.remove()
        this.createNewCubes()
      }
    })

    this.buttonSaveResult.addEventListener('click', () => {
      this.modalWindow.modal('hide')
      this.saveResult()
      this.showResult()
    })
    this.modalWindow.on('show.bs.modal', () => {
      this.scoreInModal.innerHTML = this.pointsInput.value
    })
  }

  timer() {
    let time = this.time
    let timerId = setInterval(() => {
      time--
      this.timerInput.value = time;
      if (time === 0) {
        this.cleanTimer()
        this.modalWindow.modal('show')
      }
    }, 1000)


    sessionStorage.setItem('timerID', timerId);
  }

  cleanTimer() {
    const timerId = sessionStorage.getItem('timerID')
    clearInterval(timerId)
    this.timerInput.value = this.time
  }

  createResult() {
    let result = {
      'name':this.gamerNameInModal.value,
      'points':this.pointsInput.value
    }

    return result
  }

  saveResult() {
    let result = sessionStorage.getItem('result') ? JSON.parse(sessionStorage.getItem('result')) : []
    result.push(this.createResult())
    sessionStorage.setItem('result', JSON.stringify(result))
  }

  showResult() {
    let result = JSON.parse(sessionStorage.getItem('result'))
    this.resultTable.innerHTML = ''
    if(result){
      for (let i = 1; i < result.length; i++){
        let li = this.createElement('li', 'list-group-item')
        li.innerHTML = `${result[i].name} - ${result[i].points} points`
        this.resultTable.appendChild(li)
      }
    }
  }

  randomizer(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  init() {
    this.listener()
    this.saveResult()
  }
}
