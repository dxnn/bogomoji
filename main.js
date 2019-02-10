const el = document.getElementById.bind(document)
const ctx = el('canvas').getContext('2d')
const pic = el('picture').getContext('2d')
const wsp = el('workspace').getContext('2d')

const image_path = 'hb.png'
const all_the_emoji = get_me_all_the_emoji()

const cw = 1000
const ch = 1000
const alpha = 1
const ratchet_top = 255
const ratchet_bottom = 10
const ratchet_chance = 0.03
const ratchet_bounce = 40
const ratchet_step = 1
const margin = 0.3

let tries = 0
let ticks = 0
let wins = 0
let stop = true

const img = new Image()
img.src = 'hb.png'
img.onload = ev => pic.drawImage(img, 0, 0)

function go() {
  let ratchet = ratchet_top
  let size = ratchet
  stop = false

  requestAnimationFrame(draw)

  function draw() {
    let old_wins = wins
    since(1)
    ticks++

    while(since() < 16) { // 60fps ftw
      let x = rand(cw)
      let y = rand(ch)
      drawrand(size, x, y)
      tries++

      let m = size * margin // emoji are squirrely
      let mx = x - m/2
      let my = y + m/2
      let msize = size+m
      if(test(wsp, ctx, pic, mx, my, msize)) {
        copy(wsp, ctx, mx, my, msize)
        wins++
      } else {
        copy(ctx, wsp, mx, my, msize)
      }
    }

    if(wins === old_wins) {
      size += rand(ratchet - size) + rand(ratchet_bounce*2+1) - ratchet_bounce

      if(alpha < 1)
        setGlobalAlpha(alpha)

      if(ratchet > ratchet_bottom)
        if(Math.random() < ratchet_chance)
          ratchet -= ratchet_step
    }

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
  ctx.globalAlpha *= alpha
  wsp.globalAlpha *= alpha
}

function drawrand(size, x, y) {
  let e = all_the_emoji[rand(all_the_emoji.length)]
  drawstr(e, x, y, size)
}

function test(a, b, z, x, y, size) { // is a closer to z than b?
  return score(a, z, x, y, size) < score(b, z, x, y, size)
}

function score(a, z, x, y, size) {
  let ai = a.getImageData ? a.getImageData(x, y, size, -size) : a
  let zi = z.getImageData ? z.getImageData(x, y, size, -size) : z
  return diff(ai.data, zi.data)
}

function diff(a, b) {
  return a.reduce((acc, x, i) => acc += Math.abs(x - b[i]), 0)
}

function copy(a, b, x, y, size) {
  b.putImageData(a.getImageData(x, y, size, -size), x, y-size)
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
