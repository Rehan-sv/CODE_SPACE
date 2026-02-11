import java.util.Scanner;

public class BankSystem {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // 1. Default account
        System.out.println("Default Account Details:");
        BankAccount defaultAccount = new BankAccount();
        defaultAccount.displayAccountDetails();

        // 2. User input for new account
        System.out.print("Enter account number: ");
        String accNo = sc.nextLine();

        System.out.print("Enter account holder name: ");
        String accHolder = sc.nextLine();

        System.out.print("Enter initial balance: ");
        double initialBalance = sc.nextDouble();

        BankAccount userAccount = new BankAccount(accNo, accHolder, initialBalance);

        // 3. Perform transactions
        System.out.println("\nPerforming transactions...");

        System.out.print("Deposit amount: ");
        double depositAmount = sc.nextDouble();
        userAccount.deposit(depositAmount);

        System.out.println();

        System.out.print("Withdraw amount: ");
        double withdrawAmount = sc.nextDouble();
        userAccount.withdraw(withdrawAmount);

        // 4. Final details
        System.out.println("\nFinal Account Details:");
        userAccount.displayAccountDetails();

        sc.close();
    }
}
