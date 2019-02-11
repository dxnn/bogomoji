const el = document.getElementById.bind(document)
const ctx = el('canvas').getContext('2d')
const pic = el('picture').getContext('2d')
const wsp = el('workspace').getContext('2d')

const all_the_emoji = get_me_all_the_emoji()

const cw = 1000
const ch = 1000
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
let image_path = location.hash.slice(1)

if(image_path) set()                                // things start here. unless they don't.

function set() {
  const img = new Image()
  img.src = image_path
  img.crossOrigin = 'Anonymous'                     // CORS light
  img.onload = ev => pic.drawImage(img, 0, 0),go()  // abuse of notation
}

function go() {
  let ratchet = ratchet_top
  let size = ratchet
  stop = false

  requestAnimationFrame(draw)

  function draw() {
    let old_wins = wins
    since(1)
    ticks++

    while(since() < 16) {                           // 60fps ftw
      tries++

      let x = rand(cw)
      let y = rand(ch)
      let e = drawrand(wsp, x, y, size)

      let [mx, my, msize] = marginize(x, y, size, margin)
      let [c, w, p] = get_image_data([ctx, wsp, pic], mx, my, msize)

      if(test(w.data, c.data, p.data)) {
        drawstr(ctx, e, x, y, size)
        wins++
      } else {
        wsp.putImageData(c, mx, my)
      }
    }

    if(wins === old_wins) {
      size += rand(ratchet - size) + rand(ratchet_bounce*2+1) - ratchet_bounce

      if(ratchet > ratchet_bottom)
        if(Math.random() < ratchet_chance)
          ratchet -= ratchet_step
    }

    if(size < ratchet_bottom)
      size = ratchet_bottom + rand(ratchet_bounce*2+1)

    if(size > ratchet_top)
      size = ratchet_top - rand(ratchet_bounce*2+1)

    if(!stop)
      requestAnimationFrame(draw)
  }

  return draw
}

function marginize(x, y, size, margin) {
  let m = size * margin                             // emoji are squirrely
  let msize = size+m
  let mx = x - m/2
  let my = y - size - m/2
  return [mx, my, msize]
}

function get_image_data(ctxs, x, y, size) {
  return ctxs.map(ctx => ctx.getImageData(x, y, size, size))
}

function drawrand(ctx, x, y, size) {
  let e = all_the_emoji[rand(all_the_emoji.length)]
  drawstr(ctx, e, x, y, size)
  return e
}

function drawstr(ctx, s, x, y, size) {
  ctx.font = size + 'px serif'
  ctx.fillText(s, x, y)
}

function test(a, b, z) {                            // is a closer to z than b?
  return score(a, z) < score(b, z)
}

function score(a, b) {                              // taxicab metric
  return a.reduce((acc, x, i) => acc += Math.abs(x - b[i]), 0)
}

function rand(n) {
  return Math.floor(Math.random() * n)
}

function get_me_all_the_emoji() {
  let q = []
  for(let i=0; i<2000; i++) {                       // a vaguely magic number
    let e = String.fromCodePoint(127514 + i)        // SUPA MAGICK NUMBER
    if(ctx.measureText(e).width == 13)              // also kinda magick
      q.push(e)
  }
  return q
}

let since = (()=>{
  let last = performance.now()
  return (r) => {
    let now = performance.now()
    let delta = now-last
    if(r) last = now
    return delta}})()
