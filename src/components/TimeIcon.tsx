import React from "react";

export function TimeIcon() {
  // The SVG for this icon was having major aliasing problems, so we're inlining it as a PNG instead
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgBnVE7UsNADH1ru6PJFbiBcwNzA3aog+2B0OcEjo9AC3hM8KTecIPcAB/FBXT7QXJ2d0JBAZrRzEqrJ+k9AX80cR48D6qgREPPnHxBfhQOu7tb+RpqkvDo9u8NffYOaFONy/uV5GaP5E03qOYHoHtTlTO2Sg2W65U86gw5TyPQIaEcHCqOI8AlKGm5TV3LyTcqvINzVqD2qyKbvx242xV+sUxjNNnMK3KYeqUWocBpHIhP+bRXeZjiRfAAgVF/njqwPdRytAaSQAXHL4O6ZsVOpUFOgT69wLKWkcdsPNl+4QMWLcsrzm6wJVBJfDasDhfy1IQaWWN36/JmGyfEW7C8yQziVSZe1Tm0LDX+a987mHFCBKBqawAAAABJRU5ErkJggg=="
      alt="Time icon"
      style={{
        marginBottom: 2,
      }}
    />
  );
}
