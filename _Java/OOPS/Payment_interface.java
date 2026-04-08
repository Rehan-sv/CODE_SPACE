interface Payment {
    void processPayment();
}

class CreditCardPayment implements Payment {
    public void processPayment() {
        System.out.println("Processing Credit Card Payment...");
    }
}

class UPIPayment implements Payment {
    public void processPayment() {
        System.out.println("Processing UPI Payment...");
    }
}

public class Payment_interface {
    public static void main(String[] args) {

        Payment p;

        String type = "UPI";   // Example input

        if(type.equalsIgnoreCase("CreditCard"))
            p = new CreditCardPayment();
        else
            p = new UPIPayment();

        p.processPayment();
    }
}