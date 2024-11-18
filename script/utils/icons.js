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

export function drawLoadIcon() {
  let clockSpeed = 1;
  const loadIconSize = 100;
  const loadStroke = 10;

  if (!sv.arcCont && !sv.animatedArc) {
    sv.arcCont = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sv.arcCont.style.position = "absolute";
    sv.arcCont.style.width = loadIconSize + "px";
    sv.arcCont.style.height = loadIconSize + "px";
    sv.arcCont.style.left = `${window.innerWidth / 2 - loadIconSize / 2}px`;
    sv.arcCont.style.top = `${window.innerHeight / 2 - loadIconSize / 2}px`;
    sv.arcCont.style.overflow = "visible";

    sv.animatedArc = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    sv.animatedArc.setAttribute("fill", "none");
    sv.animatedArc.setAttribute("stroke", "white");
    sv.animatedArc.setAttribute("stroke-width", loadStroke);
    sv.arcCont.appendChild(sv.animatedArc);
    document.body.appendChild(sv.arcCont);
  }

  const radius = loadIconSize / 2 - loadStroke * 2;
  const centerX = radius + loadStroke * 2;
  const centerY = radius + loadStroke * 2;

  // Calculate arc percentage and rotation
  const progress = (Math.sin(sv.constantClock) + 1) / 2; // Oscillates between 0 and 1
  if (progress > 0.5) {
    console.log("FAST");
    clockSpeed = 2; // Double speed after halfway
  } else {
    console.log("SLOW");
    clockSpeed = 0; // Normal speed before halfway
  }
  sv.constantClock = (sv.constantClock || 0) + 0.01 * clockSpeed; // Update clock
  const arcPercentage = 0.8 * progress + 0.1; // Variable percentage of circumference
  const startAngle = sv.constantClock * 0.1; // Rotate the whole arc

  // Calculate start and end points of the arc
  const angleToPoint = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  const start = angleToPoint(startAngle);
  const end = angleToPoint(startAngle + 360 * arcPercentage);
  const largeArcFlag = arcPercentage > 0.5 ? 1 : 0;

  const pathData = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;

  sv.animatedArc.setAttribute("d", pathData);
  sv.arcCont.style.transform = `translate(-50%, -50%) rotate(${
    sv.constantClock * 100
  }deg)`;
}
