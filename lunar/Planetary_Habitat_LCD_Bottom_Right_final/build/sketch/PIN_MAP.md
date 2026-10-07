#line 1 "C:\\Users\\ABHIJAL C A\\Downloads\\Planetary_Habitat_LCD_Bottom_Right\\Planetary_Habitat_LCD_Bottom_Right\\PIN_MAP.md"
# Pin Map - Precise Edition

## Environment
D2 DHT22 | A0 gas | A1 radiation | D22-D27 indicators/actuators

## Life Support
D3 greenhouse DHT22 | A2 soil | A3 light | A4 water | A5 oxygen | A6 solar | D28-D34 actuators

## Safety
D4 fire button | D5 SOS | A7 gas | D35-D41 alarm/actuators

## Infrastructure
D6-D7 traffic | D8-D9 waste ultrasonic | D10-D11 parking ultrasonic | D12 servo | A8 street LDR | D42-D46 outputs

## Central Command
D47 master buzzer | D48-D50 master status LEDs | LCD/BMP180 on I2C pins 20/21


## Multi Dashboard I2C
- Central LCD: 0x27
- Environment LCD: 0x26
- Life Support LCD: 0x25
- Safety LCD: 0x24
- Infrastructure LCD: 0x23
- All LCD SDA -> Mega 20
- All LCD SCL -> Mega 21
