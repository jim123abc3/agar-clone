// where ALL data is stored about a player

class Player{
  constructor(socketId, playerConfig, playerData){
    this.socketId = socketId;
    this.playerConfig = playerConfig;
    this.playerData = playerData;
  }

}

module.exports = Player;