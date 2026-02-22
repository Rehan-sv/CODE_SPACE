package _Java.OOPS;
class Temperature {

    double[] hourlyTemperatures;

    // Constructor
    Temperature(int size) {
        hourlyTemperatures = new double[size];
    }

        void inputTemperatures(Scanner s) {
            for (int i = 0; i < hourlyTemperatures.length; i++) {
                System.out.print("Enter temperature " + i + ": ");
                hourlyTemperatures[i] = s.nextDouble();
            }
        }

    void calculateAverage() {
        double sum = 0;
        for (double x : hourlyTemperatures) {
            sum += x;
        }
        double avg = sum / hourlyTemperatures.length;
        System.out.println("Average Temperature: " + avg);
    }

    void findMinMax() {
        double max = hourlyTemperatures[0];
        double min = hourlyTemperatures[0];

        for (double x : hourlyTemperatures) {
            if (x > max) {
                max = x;
            }
            if (x < min) {
                min = x;
            }
        }

        System.out.println("Max Temperature: " + max);
        System.out.println("Min Temperature: " + min);
    }

    void checkAlert() {
        for (double x : hourlyTemperatures) {
            if (x > 35) {
                System.out.println("⚠ ALERT: Open ventilation windows!");
                return;
            }
        }
        System.out.println("Temperature is under control.");
    }
}class Temperature {

    double[] hourlyTemperatures;

    // Constructor
    Temperature(int size) {
        hourlyTemperatures = new double[size];
    }

    void inputTemperatures(Scanner s) {
        for (int i = 0; i < hourlyTemperatures.length; i++) {
            System.out.print("Enter temperature " + i + ": ");
            hourlyTemperatures[i] = s.nextDouble();
        }
    }

    void calculateAverage() {
        double sum = 0;
        for (double x : hourlyTemperatures) {
            sum += x;
        }
        double avg = sum / hourlyTemperatures.length;
        System.out.println("Average Temperature: " + avg);
    }

    void findMinMax() {
        double max = hourlyTemperatures[0];
        double min = hourlyTemperatures[0];

        for (double x : hourlyTemperatures) {
            if (x > max) {
                max = x;
            }
            if (x < min) {
                min = x;
            }
        }

        System.out.println("Max Temperature: " + max);
        System.out.println("Min Temperature: " + min);
    }

    void checkAlert() {
        for (double x : hourlyTemperatures) {
            if (x > 35) {
                System.out.println("⚠ ALERT: Open ventilation windows!");
                return;
            }
        }
        System.out.println("Temperature is under control.");
    }
}