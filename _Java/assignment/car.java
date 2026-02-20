package _Java.assignment;

public class Car {
    String brand;

    Car(String brand) {
        this.brand = brand;
    }

    public String toString() {
        return brand;
    }
}

public class ParkingLot {

    public static void parkCar(Car[] lot, Car newCar) {
        for (int i = 0; i < lot.length; i++) {
            if (lot[i] == null) {
                lot[i] = newCar;
                System.out.println("Car " + newCar.brand +
                                   " parked successfully at slot " + i + ".");
                return;
            }
        }
        System.out.println("Parking Lot Full");
    }

    public static void displayLot(Car[] lot) {
        System.out.print("Current Lot Status: [");
        for (int i = 0; i < lot.length; i++) {
            if (lot[i] != null)
                System.out.print(lot[i]);
            else
                System.out.print("null");

            if (i < lot.length - 1)
                System.out.print(", ");
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        Car[] lot = new Car[4];
        lot[0] = new Car("Toyota");
        lot[1] = new Car("Honda");
        lot[2] = null;
        lot[3] = null;

        Car newCar = new Car("Ford");

        parkCar(lot, newCar);
        displayLot(lot);
    }
}
 car {
    
}
