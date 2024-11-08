import { sv } from "./variables";

export function drawIcon() {
  // console.log("• running drawIcon •");
  const p = sv.p;
  const x = p.windowWidth * 0.5;
  const y = p.windowHeight * 0.5;
  const baseRadius = 30;
  const pulseRadius = baseRadius + 5 * Math.sin(p.millis() / 300);

  // Background flashing effect
  p.noStroke();
  p.fill(255, 0, 0, 50 + 50 * Math.sin(p.millis() / 200));
  p.circle(x, y, pulseRadius + 20);

  // Central solid red circle
  p.fill("#ff0000");
  p.circle(x, y, baseRadius);

  // Animated white outer ring
  p.noFill();
  p.stroke(255);
  p.strokeWeight(3);
  p.ellipse(x, y, pulseRadius * 2, pulseRadius * 2);
}
