const el = document.getElementById.bind(document)
const ctx = el('canvas').getContext('2d')
const wsp = el('workspace').getContext('2d')

let all_the_emoji = collect_all_the_emoji()
let cw = 1000, ch = 1000


let img = new Image()
img.src = 'hb.png'
// img.onload = ev => {

function go() {
  wsp.drawImage(img, 0, 0)
  let data = wsp.getImageData(0, 0, cw, ch)
  wsp.clearRect(0, 0, cw, ch)
  // ctx.clearRect(0, 0, cw, ch)

  let size=250, limit=5, step=1, tbase=50
  requestAnimationFrame(draw)

  function draw() {
    // for(let size = 250; size > 200; size -= 10) {
      // let tolerance = 10
    let tolerance = tbase + (250-size)

      while(tolerance > 1) {
        drawrand(size)
        if(test(wsp, ctx, data)) {
          copy(wsp, ctx)
        } else {
          copy(ctx, wsp)
          tolerance--
        }
      }

    size -= step

    if(size > limit)
      requestAnimationFrame(draw)

    // }
  }

}



function drawrand(size) {
  let e = all_the_emoji[rand(all_the_emoji.length)]
  drawstr(e, rand(cw), rand(ch), size)
}

function test(a, b, z) { // is a closer to z than b?
  return score(a, z) < score(b, z)
}

function score(a, z) {
  let ai = a.getImageData ? a.getImageData(0, 0, cw, ch) : a
  let zi = z.getImageData ? z.getImageData(0, 0, cw, ch) : z
  let acc = 0

  for(let i=ai.data.length-1; i >= 0; i--) {
    acc += Math.abs(ai.data[i] - zi.data[i])||0
  }

  return acc
}

function copy(a, b) {
  b.putImageData(a.getImageData(0, 0, cw, ch), 0, 0)
}

function collect_all_the_emoji() {
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
