package _Java.exam;

import java.util.Scanner;

class bank_oops {

    String accountnumber;
    String accountholder;
    double balance;

    bank_oops(String accno, String holder, double bal) {  
        accountnumber = accno;
        accountholder = holder;
        balance = bal;
    }

    void deposit(double amount) {
        balance += amount;
        System.out.println("The balance is " + balance);
    }

    void withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Insufficient balance!");
            System.out.println("Balance remains: " + balance);
        } else {
            balance -= amount;
            System.out.println("Updated Balance: " + balance);
        }
    }

    void display() {
        System.out.println("Account Number: " + accountnumber);
        System.out.println("Name: " + accountholder);
        System.out.println("Balance: " + balance);
    }
}

public class BankSystem {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);

        System.out.println("Account number:");
        String accno = s.nextLine();

        System.out.println("Name:");
        String holder = s.nextLine();

        System.out.println("Initial balance:");
        double bal = s.nextDouble();

        bank_oops acc1 = new bank_oops(accno, holder, bal);

        System.out.println("Transactions are happening...");

        System.out.println("Deposit amount:");
        double dep = s.nextDouble();
        acc1.deposit(dep);

        System.out.println("Withdraw amount:");
        double wit = s.nextDouble();
        acc1.withdraw(wit);

        System.out.println("Final Account Details:");
        acc1.display();
    }
}