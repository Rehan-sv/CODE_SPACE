# How to Explain the Multi-Dashboard Version

## One-line idea
The Mega runs four subsystem functions and displays every subsystem on its own LCD, while a fifth LCD acts as the central command dashboard.

## Program flow

```text
Environment System ----> Environment LCD ----┐
Life Support System ----> Life Support LCD ---┤
Safety System ----------> Safety LCD ---------┼--> Central LCD
Infrastructure System --> Infrastructure LCD -┘
```

## Status rule
- 0 = NORMAL
- 1 = WARNING
- 2 = DANGER

The overall habitat status is simply the highest status of the four subsystems.

## Why five LCDs?
The previous version rotated one LCD between pages. This version keeps every reading visible at the same time, which is easier to demonstrate and easier for the evaluator to follow.

## What each dashboard shows
- **Central:** ENV, LIFE, SAFE, INFRA status + overall status
- **Environment:** temperature, humidity, pressure, gas, radiation
- **Life Support:** soil, greenhouse temperature, water, oxygen, solar
- **Safety:** fire, SOS, gas, current status
- **Infrastructure:** waste distance, parking, traffic, street light

## Simple explanation to say aloud
"All five LCDs are connected on the same I2C bus. Each LCD has a unique address, so the Mega can update them independently using only the same SDA and SCL lines."
