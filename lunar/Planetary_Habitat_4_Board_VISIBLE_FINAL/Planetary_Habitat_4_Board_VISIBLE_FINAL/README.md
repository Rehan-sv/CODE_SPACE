# PLANETARY HABITAT - VISIBLE FINAL

Rendering-safe revision.

1. Extract the ZIP completely.
2. Open ONE board folder at a time in VS Code.
3. Open diagram.json. If it opens as text, right-click the tab -> Reopen Editor With... -> Wokwi Diagram Editor (if available).
4. Press F to fit the circuit.
5. Press Ctrl+S.
6. Start that board's simulator.

This revision removes text annotation components and unsupported visual attributes from the previous diagrams. It also makes relay modules active-high (npn), matching the Arduino code. All functional sensors, actuators, displays, alarms, and connections are preserved.

Each MCU is intentionally a separate Wokwi simulation.
