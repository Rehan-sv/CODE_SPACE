# Planetary Habitat - Multi Dashboard Edition

This version keeps the project simple but shows all important values at the same time.

## Main improvement
There are now **5 separate 20x4 LCD dashboards**:

1. Central Command - overall status of all four subsystems
2. Environment - temperature, humidity, pressure, gas, radiation
3. Life Support - soil, greenhouse temperature, water, oxygen, solar
4. Safety - fire, SOS, gas and safety status
5. Infrastructure - waste, parking, traffic and street-light status

There is **no page switching**. All LCDs update together every cycle.

## I2C addresses
- Central: 0x27
- Environment: 0x26
- Life Support: 0x25
- Safety: 0x24
- Infrastructure: 0x23

All LCDs share the same Arduino Mega I2C pins:
- SDA -> pin 20
- SCL -> pin 21

The BMP180 also shares this I2C bus.

## Easy evaluator explanation
"Each subsystem continuously reads its sensors and decides whether it is Normal, Warning or Danger. Its own LCD shows the live readings. The central LCD receives the four status values and shows the overall habitat condition."

## Wokwi files
- sketch.ino
- diagram.json
- libraries.txt
- PIN_MAP.md
- EXPLAIN_TO_EVALUATOR.md


## Layout fix
Water, Oxygen, and Solar sliders were moved to a second row so they are not blocked by vertical wires.

## Evaluator-friendly layout (reorganized)
The circuit is now arranged as four visual zones so you do not need to scroll between a sensor and its readings:

- **Top-left:** Environment controls + Environment LCD
- **Top-right:** Life Support controls + Life Support LCD
- **Bottom-left:** Safety controls + Safety LCD
- **Bottom-right:** Infrastructure controls + Infrastructure LCD
- **Center:** Arduino Mega + Central Command LCD + master habitat indicators

This is only a visual layout improvement. The sensor pin mapping, LCD addresses, and program logic are unchanged.


## Left-side gap optimized layout
Section 3 (Safety & Emergency) has been moved upward into the empty space below Section 1. The rest of the circuit remains at the evaluator-friendly scale and position.


## All LCDs Visible Layout
This version keeps the overall project layout but moves the infrastructure LCD upward so all LCD dashboards fit within one main viewing area more easily.


## Bottom-right Infrastructure LCD Layout
The Infrastructure Dashboard LCD has been moved to the bottom-right of the main visible Wokwi viewport, aligned vertically with the Safety Dashboard LCD on the bottom-left.
