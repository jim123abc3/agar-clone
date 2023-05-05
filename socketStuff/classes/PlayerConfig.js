// only player specific, no other player needs to know this player data

class PlayerConfig{
  constructor(settings){
    this.xVector = 0;
    this.yVector = 0;
    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
    
  }

  getRandomColor(){
    const r = Math.floor((Math.random() * 200) + 50)
    const g = Math.floor((Math.random() * 200) + 50)
    const b = Math.floor((Math.random() * 200) + 50)

    return `rgb(${r},${g},${b})`
  }
}

module.exports = PlayerConfig;