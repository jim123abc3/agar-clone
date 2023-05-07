const io = require('../servers').io;
const app = require('../servers').app;

const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Orb = require('./classes/Orb');

const orbs = [];
const settings = {
  defaultNumberOfOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
  defaultGenericOrbSize: 5
}
const players = [];
const playersForUsers = [];
let tickTockInterval;

initGame();

io.on('connect', (socket) => {
  let player = {};
  socket.on('init', (playerObj, ackCallback) => {
    if(players.length === 0){
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', playersForUsers);
      }, 33);
    }

    socket.join('game');

    const playerName = playerObj.playerName;
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    players.push(player);
    playersForUsers.push({playerData})

    ackCallback({orbs, indexInPlayers: playersForUsers.length - 1});
  });

  socket.on('tock',(data)=>{

    if(!player.playerConfig){
      return;
    }

    speed = player.playerConfig.speed;
    const xV = player.playerConfig.xVector = data.xVector;
    const yV = player.playerConfig.yVector = data.yVector;

    if ((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX < settings.worldWidth) && (xV > 0)) {
      player.playerData.locX += speed * xV;
    }
    if ((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < settings.worldHeight) && (yV < 0)) {
      player.playerData.locY -= speed * yV;
    }

    const capturedOrbI = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);

    if(capturedOrbI !== null){
      orbs.splice(capturedOrbI,1,new Orb(settings));

      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      }
      io.to('game').emit('orbSwitch', orbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }

    const absorbedData = checkForPlayerCollisions(player.playerData, player.playerConfig, players, playersForUsers, socket.id);
    if(absorbedData){
      io.to('game').emit('playerAbsorbed', absorbedData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }

  });

  socket.on('disconnect',(reason) => {
    
    for(let i = 0; i < players.length; i++){
      if(players[i].socketId === player.socketId){
        players.splice(i, 1, {});
        playersForUsers.splice(i, 1, {});
        break;
      }
    }

    if(players.length === 0){
      clearInterval(tickTockInterval);
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

function getLeaderBoard() {
  const leaderBoardArray = players.map(curPlayer => {
    if(curPlayer.playerData){
      return{
        name: curPlayer.playerData.name,
        score: curPlayer.playerData.score,
      }
    } else{
      return {}
    }
  });

  return leaderBoardArray;
}