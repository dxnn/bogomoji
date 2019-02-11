# Bogomoji

_Emoji rendering in 10^12 easy steps_

Tired of your old, boring photos that show realistic scenes in perfect clarity? Yeah, who isn't? Nobody wants to see those.

Spice things up with new emojigraphs! They're like regular photos, but made entirely of emoji!

Kick your insta feed up a notch with emojigraphs -- try it today! Bam! Catchphrase!

## Examples

https://dxnn.github.io/bogomoji/#https://images.pexels.com/photos/705314/pexels-photo-705314.jpeg?h=950

https://dxnn.github.io/bogomoji/#https://images.pexels.com/photos/1882802/pexels-photo-1882802.jpeg?h=950

https://dxnn.github.io/bogomoji/#https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?h=1050

https://dxnn.github.io/bogomoji/#https://images.pexels.com/photos/160509/ducklings-chicks-mama-duck-160509.jpeg?h=850

## Build instructions

1. Download the repo
2. Open index.html#url_of_image

And let the emojification begin!

Notes: You'll need the image to be hosted on a server with permissive CORS settings. Also, this emoji set has limited colors, so yellows and greens are good but greys and browns are harder. To stop it type `stop = true`. To restart it type `go()`. 

## Todos

- Massage the ratchet system -- maybe a leaky integrator over hits adjusts the mean of a normal distribution for drawing size? Probably need to adjust variance over time as well.
- Parallelize by using offscreen canvas and workers
- Fix the weird flicker for tall emoji when they first appear
- Modularize the code so it can be imported into other programs
- Expand the emoji set, e.g. with colour combinations
- Maybe add some more UI controls or something
- Make these issues instead of todos
- Make some video captures of the process
- Add more examples (maybe a page of good examples, with thumbnails)

PRs welcome. Please keep it simple, and don't reformat (however much your devices may want you to). Also, if you'd like to adopt this repo, it's looking for a good home. It's housebroken and has all its shots.

### Observations

In the beginning, when the emoji are large and rapidly churning it just looks like random noise. The first transition occurs fairly quickly, when the additions slow down and large scale colour patches start to stabilize. The second transition can take awhile to arrive, but when the perceptual shift occurs it's quite sudden -- almost jarring. One moment you're looking at individual pictures of hands and faces and eggplants, and the next all those emoji come together to make a picture of something else entirely. This tends to happen around the time the size ratchet gets down to smaller emoji, where they quickly fill in the fine grained detail.

Part of that filling in process also takes the form of filling in off-colour pieces of larger emoji: the eyes of the sun, the seeds of the kiwi, the holes in a wedge of cheese. My favorite is when a large tennis ball lands in a patch of green, and smaller tennis balls show up to fill in the white lines. This can go down a few levels, giving a nice fractal touch to the proceedings. 

### Idea

The number of emoji that make it into a "finished" image is relatively small (around 50k, roughly 0.3% of the attempted emoji). Maybe 80% of those are entirely covered by more recently placed emoji. Putting these 10k into an array with x, y, and size would take maybe 100k, packing down to maybe 30k if one were clever.

The emoji character set is clearly not designed for this work, the code in this project is designed to be the simplest, dumbest thing that works, and the output is supposed to look interesting, not be photo realistic. But what if those three aspects were different? 

If the goal was photo realistic rendering, the character set was designed to support that goal, and the code was designed to efficiently find the minimal in-order positioning of the sprites to result in an image with minimal perceptual lossiness, could this actual be a decent compression method? 

The compression phase would definitely take longer than current methods, but given a shared set of sprites the final image might be extremely compact, and the rendering could be relatively quick (though current formats are baked deep into the stack, so they'll have a serious advantage in the near term). Progressive rendering as data streams over would be a given. 

What would the proper set of sprites look like? They would probably make significant use of alpha sections -- this emoji renderer certainly likes shapes with strange boundaries. Fractal shapes would likely prove ideal, along with a few solids for building large colour sections quickly. For a few extra bytes colour, rotation, and alpha could be provided, optionally, cutting down the number of sprites needed.

This technique could be combined with other styles, like wavelet compression for very busy scenes or reverse facial detection for rendering faces. (These ideas may be well explored in the literature, if so pointers would be appreciated.)
