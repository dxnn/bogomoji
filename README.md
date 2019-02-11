# Bogomoji

Emoji rendering in 10^12 easy steps

Tired of your old, boring photos that show realistic scenes in perfect clarity? Yeah, who isn't? Nobody wants to see those.

Spice things up with new emojigraphs! They're like regular photos, but made entirely of emoji!

Kick your insta feed up a notch with emojigraphs -- try it today! Bam! Catchphrase!

## Instructions

1. Download the repo
2. Find an image*
3. Open index.html#url_of_image_from_step_2

And let the emojification begin!

* You'll need the image to be hosted on a server with permissive CORS settings. Also, this emoji set has limited colors, so yellows and greens are good but greys and browns are harder.

## Todos

- Massage the ratchet system -- maybe a leaky integrator over hits adjusts the mean of a normal distribution for drawing size? Probably need to adjust variance over time as well.
- Parallelize by using offscreen canvas and workers
- Fix the weird flicker for tall emoji when they first appear
- Expand the emoji set, e.g. with colour combinations
- Maybe add some more UI controls or something
- Make these issues instead of todos
- Add some examples!
- Make some video captures of the process
- Add a github page thing so folks can run it without downloading it

PRs welcome. Please keep it simple, and don't reformat (however much you devices want you to). Also, if you'd like to adopt this repo, it's looking for a good home. It's housebroken and has all its shots.
