import java.util.*;

// Parent class (for multilevel inheritance)
class Vehicle {

    protected String registrationNumber;

    Vehicle() {
    }

    Vehicle(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
}

// Car class (inherits Vehicle)
class Car extends Vehicle {

    protected String model;
    protected double rentalPricePerDay;
    protected boolean availabilityStatus;

    // Default constructor
    Car() {
        availabilityStatus = true;
    }

    // Parameterized constructor
    Car(String registrationNumber, String model, double rentalPricePerDay) {
        super(registrationNumber);
        this.model = model;
        this.rentalPricePerDay = rentalPricePerDay;
        this.availabilityStatus = true;
    }

    public void displayCarDetails() {
        System.out.println("Reg No: " + registrationNumber +
                " Model: " + model +
                " Price/Day: " + rentalPricePerDay +
                " Available: " + availabilityStatus);
    }
}

// Hierarchical inheritance
class LuxuryCar extends Car {

    LuxuryCar() {
        super();
    }

    LuxuryCar(String registrationNumber, String model, double rentalPricePerDay) {
        super(registrationNumber, model, rentalPricePerDay);
    }
}

class EconomyCar extends Car {

    EconomyCar() {
        super();
    }

    EconomyCar(String registrationNumber, String model, double rentalPricePerDay) {
        super(registrationNumber, model, rentalPricePerDay);
    }
}

// Customer class
class Customer {

    private int customerId;
    private String name;
    private String phoneNumber;

    // Default constructor
    Customer() {
    }

    // Parameterized constructor
    Customer(int customerId, String name, String phoneNumber) {
        this.customerId = customerId;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }
}

// RentalService class
class RentalService {

    // Static collection of cars
    static List<Car> cars = new ArrayList<>();

    // Add car
    public static void addCar(Car car) {
        cars.add(car);
    }

    // Display available cars
    public static void displayAvailableCars() {

        System.out.println("\nAvailable Cars:");

        for (Car car : cars) {
            if (car.availabilityStatus) {
                car.displayCarDetails();
            }
        }
    }

    // Book car
    public static void bookCar(String regNumber, Customer customer) {

        for (Car car : cars) {

            if (car.registrationNumber.equals(regNumber)) {

                if (car.availabilityStatus) {
                    car.availabilityStatus = false;
                    System.out.println("Car booked successfully by " + customer.getName());
                } else {
                    System.out.println("Car is already rented.");
                }
                return;
            }
        }

        System.out.println("Car not found.");
    }

    // Return car
    public static void returnCar(String regNumber) {

        for (Car car : cars) {

            if (car.registrationNumber.equals(regNumber)) {
                car.availabilityStatus = true;
                System.out.println("Car returned successfully.");
                return;
            }
        }
    }
}

// Main class
public class Main {

    public static void main(String[] args) {

        // Create cars
        LuxuryCar car1 = new LuxuryCar("L101", "BMW", 5000);
        EconomyCar car2 = new EconomyCar("E101", "Swift", 1200);

        // Add cars to rental service
        RentalService.addCar(car1);
        RentalService.addCar(car2);

        // Create customer
        Customer customer1 = new Customer(1, "Rehan", "9876543210");

        // Display cars
        RentalService.displayAvailableCars();

        // Book car
        RentalService.bookCar("L101", customer1);

        // Display again
        RentalService.displayAvailableCars();

        // Return car
        RentalService.returnCar("L101");

        // Display again
        RentalService.displayAvailableCars();
    }
}