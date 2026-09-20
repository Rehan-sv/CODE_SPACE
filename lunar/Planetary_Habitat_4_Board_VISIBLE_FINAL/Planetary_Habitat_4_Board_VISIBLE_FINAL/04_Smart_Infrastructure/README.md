# Board 04 - Smart Infrastructure

## Full simulated functions
- Traffic monitoring using two independent traffic inputs.
- Traffic signal logic: GO when a lane is active, STOP when both are active.
- Smart parking using HC-SR04 distance + automatic servo gate.
- Parking availability LED.
- Smart waste bin using HC-SR04; full-bin LED and buzzer.
- Smart street lighting using LDR analog level.
- 20x4 I2C command display.
- Serial `INFRA_PACKET` for central integration.
- All A4/A5 I2C lines are reserved for the final Mega integration.

Traffic buttons use `INPUT_PULLUP`, so pressing a button gives a clean LOW signal rather than a floating input.
