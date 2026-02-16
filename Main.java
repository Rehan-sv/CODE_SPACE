import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        Bank acc1 = new Bank();
        System.out.println("Default Account Details:");
        acc1.displayAccountDetails();

        System.out.println("Enter account number:");
        String accNo = sc.nextLine();

        System.out.println("Enter account holder name:");
        String name = sc.nextLine();

        System.out.println("Enter initial balance:");
        double bal = sc.nextDouble();

        Bank acc2 = new Bank(accNo, name, bal);

        System.out.println("\nPerforming transactions...");

        System.out.println("Deposit amount:");
        double dep = sc.nextDouble();
        acc2.deposit(dep);

        System.out.println("Withdraw amount:");
        double wd = sc.nextDouble();
        acc2.withdraw(wd);

        System.out.println("Final Account Details:");
        acc2.displayAccountDetails();

        sc.close();
    }
}
