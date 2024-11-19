import { sv } from "./variables";
import { gsap } from "gsap";

// Initialize constants and DOM elements
const loadIconSize = 100;
const loadStroke = 10;
const radius = loadIconSize / 2 - loadStroke * 2;
const centerX = radius + loadStroke * 2;
const centerY = radius + loadStroke * 2;
const showTimeline = gsap.timeline({ paused: true });
const hideTimeline = gsap.timeline({ paused: true });

export function initializeLoadIcon() {
  if (!sv.arcCont && !sv.animatedArc) {
    sv.loadIconDiv = document.createElement("div");
    sv.loadIconDiv.id = "loadIconDiv";
    sv.loadIconDiv.style.width = window.innerWidth + "px";
    sv.loadIconDiv.style.height = window.innerHeight + "px";
    sv.loadIconDiv.style.position = "fixed";
    sv.loadIconDiv.style.top = "0";
    sv.loadIconDiv.style.left = "0";
    // sv.loadIconDiv.style.display = "none"; // Hide initially
    document.body.appendChild(sv.loadIconDiv);

    sv.arcCont = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sv.arcCont.id = "arcCont";
    sv.arcCont.setAttribute("viewBox", `0 0 ${loadIconSize} ${loadIconSize}`);
    sv.arcCont.style.width = loadIconSize + "px";
    sv.arcCont.style.height = loadIconSize + "px";
    sv.arcCont.style.position = "absolute";
    sv.arcCont.style.left = "50%";
    sv.arcCont.style.top = "50%";
    sv.arcCont.style.transform = "translate(-50%, -50%)";

    sv.animatedArc = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    sv.animatedArc.setAttribute("stroke-width", loadStroke);
    sv.animatedArc.setAttribute("fill", "none");
    sv.animatedArc.setAttribute("stroke", "#000"); // Set stroke color
    sv.animatedArc.style.strokeLinecap = "round";

    sv.arcCont.appendChild(sv.animatedArc);
    sv.loadIconDiv.appendChild(sv.arcCont);

    sv.constantClock = 0; // Initialize constantClock
  }

  const element = document.querySelector("#loadIconDiv");
  showTimeline
    .to(element, { backgroundColor: "rgba(255, 255, 255, 0.8)", duration: 1 })
    .to(element, { backdropFilter: "blur(15px", duration: 1 });
  hideTimeline
    .to(element, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      duration: 1,
    })
    .to(element, { backdropFilter: "blur(0px", duration: 1 });
}

export function showLoadIcon() {
  sv.loadIconDiv.style.display = "block";
  showTimeline.restart();
  startLoadIconAnimation();
}

export function hideLoadIcon() {
  sv.loadIconDiv.style.display = "none";
  hideTimeline.restart();
  cancelAnimationFrame(sv.animationFrameId);
}

export function startLoadIconAnimation() {
  // Update sv.constantClock
  sv.constantClock += 0.05;

  // Calculate progress oscillating between 0 and 1
  const progress = (Math.sin(sv.constantClock) + 1) / 2;

  // Adjust clock speed based on progress
  let clockSpeed = progress > 0.5 ? 2 : 1;

  // Modify sv.constantClock to adjust speed
  sv.constantClock += 0.05 * (clockSpeed - 1);

  // Calculate arc percentage and start angle
  const arcPercentage = 0.8 * progress + 0.1; // Ranges between 0.1 and 0.9
  const startAngle = sv.constantClock * 10; // Rotate the arc

  // Function to convert angle to point coordinates
  const angleToPoint = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  // Calculate start and end points of the arc
  const start = angleToPoint(startAngle);
  const end = angleToPoint(startAngle + 360 * arcPercentage);
  const largeArcFlag = arcPercentage > 0.5 ? 1 : 0;

  // Define the arc path using SVG path data
  const pathData = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;

  // Update the 'd' attribute of the path to redraw the arc
  sv.animatedArc.setAttribute("d", pathData);

  // Rotate the entire arc container
  sv.arcCont.style.transform = `translate(-50%, -50%) rotate(${
    sv.constantClock * 10
  }deg)`;

  // Continue the animation if the loading icon is visible
  if (sv.loadIconDiv.style.display !== "none") {
    sv.animationFrameId = requestAnimationFrame(startLoadIconAnimation);
  }
}
