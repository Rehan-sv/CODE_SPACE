
public class Bank {
	private  String accountNumber;
	private  String accountHolder;
	private double balance;
	 
	Bank(){
		this.accountNumber="nahh";
		this.accountHolder="nahh";
		this.balance=0.0;
	 }
	public Bank(String accountNumber, String accountHolder, double balance) {
		this.accountNumber=accountNumber;
		this.accountHolder=accountHolder;
		this.balance=0.0;
	}
	public void deposit(double amount) {
		balance=balance+amount;
		System.out.print("The balance is : "+balance);
	}
	public void withdraw(double amount) {
		if (amount<balance) {
		balance=balance-amount;
		System.out.print("The balance after withdrawal is  : "+balance);
		}
		else {
			System.out.print("insuffisent balance  : "+balance);
			
		}
		
	}
	public void displayAccountDetails() {
		System.out.print("The account name  : "+accountHolder);
		System.out.print("The account number :"+accountNumber);
		System.out.print("The Balance is :"+balance);
	}
	
	
}



