let wHeight = window.innerHeight;
let wWidth = window.innerWidth;

const canvas = document.querySelector('#the-canvas');
const context = canvas.getContext('2d');
canvas.height = wHeight;
canvas.width = wWidth;
const player = {};
let orbs = [];
let players = [];


const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', () => {
  loginModal.show();
})

document.querySelector('.name-form').addEventListener('submit', e => {
  e.preventDefault();
  player.name = document.querySelector('#name-input').value;
  document.querySelector('.player-name').innerHTML = player.name;
  loginModal.hide();
  spawnModal.show();
  console.log(player, 555)
})

document.querySelector('.start-game').addEventListener('click', e => {
  spawnModal.hide();

  const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'));
  elArray.forEach(el => el.removeAttribute('hidden'));
  init();
});