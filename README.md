sim
========

Yet another stab at building a game that plays itself with AI.

Bugs
----

* Toggles (e.g. turning AI on and off) don't get correctly saved/restored when
  saving/restoring state.
* HAHAHA should have written tests or something. Trajectory calculations are all
  over the place. It works in practice with manual control because it's all
  relative, but weird stuff happens when the snake starts chasing the ball.


License and Copyright
---------------------

Copyright Justin Force. Licensed under the ISC License.
