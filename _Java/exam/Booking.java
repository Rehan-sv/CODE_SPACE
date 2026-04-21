package _Java.exam;
class Person {
    String name;
    int age;
    String id;

    Person(String name, int age, String id) {
        this.name = name;
        this.age = age;
        this.id = id;
    }
}

class Passenger extends Person {
    String tier;
    String reservationMode;

    Passenger(String name, int age, String id, String tier, String reservationMode) {
        super(name, age, id);
        this.tier = tier;
        this.reservationMode = reservationMode;
    }
}

interface TariffRate {

    int ADULT_TIER1 = 120;
    int ADULT_TIER2 = 100;
    int ADULT_TIER3 = 80;
    int ADULT_GENERAL = 50;

    int SENIOR_TIER1 = 90;
    int SENIOR_TIER2 = 75;
    int SENIOR_TIER3 = 60;
    int SENIOR_GENERAL = 35;

    int KID_TIER1 = 60;
    int KID_TIER2 = 50;
    int KID_TIER3 = 40;
    int KID_GENERAL = 20;

    int calculateTicketPrice();
}

class BookingApp implements TariffRate {

    Passenger passenger;

    BookingApp(Passenger passenger) {
        this.passenger = passenger;
    }

    public int calculateTicketPrice() {

        int age = passenger.age;
        String tier = passenger.tier;

        if (age >= 60) { 
            if (tier.equalsIgnoreCase("Tier1")) return SENIOR_TIER1;
            else if (tier.equalsIgnoreCase("Tier2")) return SENIOR_TIER2;
            else if (tier.equalsIgnoreCase("Tier3")) return SENIOR_TIER3;
            else return SENIOR_GENERAL;
        }

        else if (age <= 12) { 
            if (tier.equalsIgnoreCase("Tier1")) return KID_TIER1;
            else if (tier.equalsIgnoreCase("Tier2")) return KID_TIER2;
            else if (tier.equalsIgnoreCase("Tier3")) return KID_TIER3;
            else return KID_GENERAL;
        }

        else { 
            if (tier.equalsIgnoreCase("Tier1")) return ADULT_TIER1;
            else if (tier.equalsIgnoreCase("Tier2")) return ADULT_TIER2;
            else if (tier.equalsIgnoreCase("Tier3")) return ADULT_TIER3;
            else return ADULT_GENERAL;
        }
    }

    void Ticketdetails() {

        int fare = calculateTicketPrice();

        System.out.println("Ticket Booked:");
        System.out.println("Passenger: " + passenger.name);
        System.out.println("Age: " + passenger.age);
        System.out.println("Tier: " + passenger.tier);
        System.out.println("Reservation Mode: " + passenger.reservationMode);
        System.out.println("Ticket Fare: " + fare);
    }
}

public class Booking {
    public static void main(String[] args) {

        Passenger p = new Passenger("Emma", 70, "P101", "General", "Counter");

        BookingApp booking = new BookingApp(p);

        booking.Ticketdetails();
    }
}