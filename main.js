const el = document.getElementById.bind(document)
const ctx = el('canvas').getContext('2d')
const wsp = el('workspace').getContext('2d')
const pic = el('picture').getContext('2d')

let all_the_emoji = get_me_all_the_emoji()
let cw = 1000
let ch = 1000
let alpha = 1
let ratchet_top = 255
let ratchet_bottom = 10
let ratchet_chance = 0.03
let ratchet_bounce = 40
let ratchet_step = 1
let margin = 0.3
let stop = true

let punch = []
let judy = 0

let img = new Image()
img.src = 'hb.png'
img.onload = ev => pic.drawImage(img, 0, 0)

function go() {
  let ratchet = ratchet_top
  let size = ratchet
  stop = false

  requestAnimationFrame(draw)

  function draw() {
    let successes = 0
    since(1)
    judy++

    while(since() < 16) { // 60fps ftw
      let x = rand(cw)
      let y = rand(ch)
      drawrand(size, x, y)
      if(test(wsp, ctx, pic, x, y, size)) {
        copy(wsp, ctx)
        successes++
        punch.push([1, judy, x, y, size])
      } else {
        copy(ctx, wsp)
        punch.push([0, judy, x, y, size])
      }
    }

    if(!successes && ratchet > ratchet_bottom)
      if(Math.random() < ratchet_chance)
        ratchet -= ratchet_step

    if(!successes)
      size += rand(ratchet - size) + rand(ratchet_bounce*2+1) - ratchet_bounce

    if(size < ratchet_bottom)
      size = ratchet_bottom

    if(size > ratchet_top)
      size = ratchet_top

    if(!stop)
      requestAnimationFrame(draw)
  }

  return draw
}

function setGlobalAlpha(alpha) {
  ctx.globalAlpha = alpha
  wsp.globalAlpha = alpha
}

function drawrand(size, x, y) {
  let e = all_the_emoji[rand(all_the_emoji.length)]
  drawstr(e, x, y, size)
}

function test(a, b, z, x, y, size) { // is a closer to z than b?
  return score(a, z, x, y, size) < score(b, z, x, y, size)
}

function score(a, z, x, y, size) {
  let m = size * margin // emoji are squirrely
  let ai = a.getImageData ? a.getImageData(x-m/2, y+m/2, size+m, -size-m) : a
  let zi = z.getImageData ? z.getImageData(x-m/2, y+m/2, size+m, -size-m) : z
  return diff(ai.data, zi.data)
}

function diff(a, b) {
  return a.reduce((acc, x, i) => acc += Math.abs(x - b[i]), 0)
}

function copy(a, b) {
  b.putImageData(a.getImageData(0, 0, cw, ch), 0, 0)
}

function get_me_all_the_emoji() {
  let q = []
  for(let i=0; i<2000; i++) { // a magic number
    let e = String.fromCodePoint(127514 + i) // even more magick!
    if(ctx.measureText(e).width == 13) // also kind of magick
      q.push(e)
  }
  return q
}

function drawstr(s, x, y, size) {
  wsp.font = size + 'px serif'
  wsp.fillText(s, x, y)
}

function rand(n) {
  return Math.floor(Math.random() * n)
}

function emojiplop(width=1000, height=1000, fontsize=100) { // extremely quotidian, not magick at all
  for(let s of all_the_emoji)
    drawstr(s, rand(width), rand(height), fontsize)
}

let since = (()=>{
  let last = performance.now()
  return (r) => {
    let now = performance.now()
    let delta = now-last
    if(r) last = now
    return delta}})()
