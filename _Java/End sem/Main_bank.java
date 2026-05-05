import java.io.*;

// Interface
interface TransactionService {
    void deposit(double amount) throws Exception;
    void withdraw(double amount) throws Exception;
}

// Abstract class
abstract class Account {

    protected int accNo;
    protected String name;
    protected double balance;

    final double MIN_BALANCE = 1000; // constant

    public Account(int accNo, String name, double balance) {
        this.accNo = accNo;
        this.name = name;
        this.balance = balance;
    }

    // abstract method
    public abstract void calculateInterest();

    // final method
    public final void generateStatement() {
        System.out.println("Account No: " + accNo);
        System.out.println("Name: " + name);
        System.out.println("Balance: " + balance);
    }
}

// Derived class
class PremiumAccount extends Account implements TransactionService {

    public PremiumAccount(int accNo, String name, double balance) {
        super(accNo, name, balance); // super keyword
    }

    @Override
    public void calculateInterest() {
        double interest = balance * 0.05;
        System.out.println("Interest: " + interest);
    }

    @Override
    public void deposit(double amount) throws Exception {
        if (amount <= 0) {
            throw new Exception("Invalid deposit amount");
        }
        balance += amount;
        System.out.println("Deposited: " + amount);
    }

    @Override
    public void withdraw(double amount) throws Exception {
        if (amount <= 0) {
            throw new Exception("Invalid withdrawal amount");
        }

        if ((balance - amount) < MIN_BALANCE) {
            throw new Exception("Insufficient balance");
        }

        balance -= amount;
        System.out.println("Withdrawn: " + amount);
    }

    // File Handling - Save
    void saveToFile() {
        try {
            FileWriter fw = new FileWriter("accounts.txt", true);
            fw.write(accNo + " " + name + " " + balance + "\n");
            fw.close();
            System.out.println("Saved to file");
        } catch (Exception e) {
            System.out.println("File error");
        }
    }

    // File Handling - Read
    static void readFromFile() {
        try {
            BufferedReader br = new BufferedReader(new FileReader("accounts.txt"));
            String line;

            System.out.println("\n--- File Data ---");

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            br.close();
        } catch (Exception e) {
            System.out.println("File read error");
        }
    }
}

// Main class
public class Main_bank {
    public static void main(String[] args) {

        try {
            PremiumAccount p = new PremiumAccount(101, "Rehan", 5000);

            p.generateStatement();

            p.deposit(2000);
            p.withdraw(3000);

            p.calculateInterest();

            p.saveToFile();

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }


        PremiumAccount.readFromFile();
    }
}