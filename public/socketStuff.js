const socket = io.connect('http://localhost:9000');

const init = async () => {
  const initOrbs = await socket.emitWithAck('init', {
    playerName: player.name,
  });
  console.log(initOrbs);
  orbs = initOrbs;
  draw();
}

socket.on('initReturn', (initData) => {
})