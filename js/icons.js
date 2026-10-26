/**
 * Lucide Icons SVG Provider
 * Clean, lightweight, self-contained SVG icons styled for the game UI.
 */

const LUCIDE_SVGS = {
  "music": "<path d=\"M9 18V5l12-2v13\"></path><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><circle cx=\"18\" cy=\"16\" r=\"3\"></circle>",
  "eye": "<path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"></rect><circle cx=\"9\" cy=\"9\" r=\"2\"></circle><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"></path>",
  "quote": "<path d=\"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z\"></path><path d=\"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z\"></path>",
  "sparkles": "<path d=\"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z\"></path><path d=\"M5 3v4\"></path><path d=\"M19 17v4\"></path><path d=\"M3 5h4\"></path><path d=\"M17 19h4\"></path>",
  "zap": "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon>",
  "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"></path>",
  "heart-off": "<line x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\"></line><path d=\"M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35\"></path><path d=\"M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17\"></path>",
  "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"></path>",
  "star": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon>",
  "check-circle-2": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path>",
  "x-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m15 9-6 6\"></path><path d=\"m9 9 6 6\"></path>",
  "trophy": "<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\"></path><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\"></path><path d=\"M4 22h16\"></path><path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\"></path><path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\"></path><path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\"></path>",
  "crown": "<path d=\"m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14\"></path>",
  "award": "<circle cx=\"12\" cy=\"8\" r=\"6\"></circle><path d=\"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11\"></path>",
  "compass": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"></polygon>",
  "volume-2": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"></path><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14\"></path>",
  "volume-x": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><line x1=\"22\" y1=\"9\" x2=\"16\" y2=\"15\"></line><line x1=\"16\" y1=\"9\" x2=\"22\" y2=\"15\"></line>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path>",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>",
  "home": "<path d=\"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline>",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>",
  "arrow-right": "<path d=\"M5 12h14\"></path><path d=\"m12 5 7 7-7 7\"></path>",
  "arrow-up": "<path d=\"m5 12 7-7 7 7\"></path><path d=\"M12 19V5\"></path>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>",
  "x": "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>",
  "lightbulb": "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"></path><path d=\"M9 18h6\"></path><path d=\"M10 22h4\"></path>",
  "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>",
  "play": "<polygon points=\"5 3 19 12 5 21 5 3\"></polygon>",
  "pause": "<rect width=\"4\" height=\"16\" x=\"6\" y=\"4\"></rect><rect width=\"4\" height=\"16\" x=\"14\" y=\"4\"></rect>",
  "play-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"10 8 16 12 10 16 10 8\"></polygon>",
  "rotate-ccw": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"></path><path d=\"M3 3v5h5\"></path>",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>",
  "alert-circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>",
  "sliders": "<line x1=\"4\" x2=\"4\" y1=\"21\" y2=\"14\"></line><line x1=\"4\" x2=\"4\" y1=\"10\" y2=\"3\"></line><line x1=\"12\" x2=\"12\" y1=\"21\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"3\"></line><line x1=\"20\" x2=\"20\" y1=\"21\" y2=\"16\"></line><line x1=\"20\" x2=\"20\" y1=\"12\" y2=\"3\"></line><line x1=\"1\" x2=\"7\" y1=\"14\" y2=\"14\"></line><line x1=\"9\" x2=\"15\" y1=\"8\" y2=\"8\"></line><line x1=\"17\" x2=\"23\" y1=\"16\" y2=\"16\"></line>"
};

export function getIconSvg(name, {
  size = 24,
  className = "",
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 2
} = {}) {
  const inner = LUCIDE_SVGS[name] || LUCIDE_SVGS["sparkles"];
  const classes = ["lucide", `lucide-${name}`, className].filter(Boolean).join(" ");
  return `<svg class="${classes}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
