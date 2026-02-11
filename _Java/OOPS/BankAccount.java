public class BankAccount {
    private String accountNumber;
    private String accountHolder;
    private double balance;

    public BankAccount() {
        this.accountNumber = "N/A";
        this.accountHolder = "N/A";
        this.balance = 0.0;
    }
    public BankAccount(String accountNumber, String accountHolder, double balance) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Updated Balance: " + balance);
        } else {
            System.out.println("Deposit amount must be positive!");
        }
    }
    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            System.out.println("Updated Balance: " + balance);
        } else {
            System.out.println("Insufficient balance!");
            System.out.println("Balance remains: " + balance);
        }
    }
    public void displayAccountDetails() {
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Account Holder: " + accountHolder);
        System.out.println("Balance: " + balance);
        System.out.println();
    }
}
