const socket = io.connect('http://localhost:9000');

const init = async () => {
  const initData = await socket.emitWithAck('init', {
    playerName: player.name,
  });

  setInterval(async ()=>{
    socket.emit('tock', {
      xVector: player.xVector || .1,
      yVector: player.yVector || .1,
    })
  },33)

  console.log(initData.orbs);
  orbs = initData.orbs;
  player.indexInPlayers = initData.indexInPlayers
  draw();
}

socket.on('tick', (playersArray) => {
  console.log(players);
  players = playersArray;
  player.locX = players[player.indexInPlayers].playerData.locX
  player.locY = players[player.indexInPlayers].playerData.locY
})

socket.on('orbSwitch', (orbData) => {
  orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
})

socket.on('playerAbsorbed', absorbedData => {
  console.log(`=======================`)
  console.log(`Player who was absorbed ${absorbedData.absorbed}`)
  console.log(`Player who absorbeded another player ${absorbedData.absorbedBy}`)
})