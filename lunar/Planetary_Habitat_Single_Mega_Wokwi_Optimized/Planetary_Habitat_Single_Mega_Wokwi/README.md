# Planetary Habitat - Single Mega Wokwi Demonstrator

A presentation-focused Wokwi simulation of the full planetary habitat. One Arduino Mega emulates the four subsystem controllers so the complete system can be demonstrated in one simulation.

## Visual architecture
- 01 Environment Monitoring
- 02 Life Support & Utilities
- 03 Safety & Emergency
- 04 Smart Infrastructure
- Central Command: Arduino Mega + 20x4 I2C LCD

Power and ground connections are electrically present but visually hidden in the diagram to keep the engineering schematic clean; functional signal wiring remains visible. Wokwi supports hidden wire colors in diagram.json.

## Run
1. Open this folder in VS Code with the Wokwi extension.
2. Compile the sketch for Arduino Mega: `arduino-cli compile --fqbn arduino:avr:mega --output-dir build/arduino.avr.mega .`
3. Start Wokwi from `diagram.json`.
