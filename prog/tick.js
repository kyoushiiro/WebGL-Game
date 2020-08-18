/**
 * Responsible for animating the Scene.
 */
function tick() {
  resizeCanvas()
  gl.viewport(0, 0, canvas.width, canvas.height);
  scene.updateAnimation();
  scene.render();
  requestAnimationFrame(tick);
}
