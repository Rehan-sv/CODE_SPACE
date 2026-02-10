import java.util.Scanner;

class PerfectNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int num, sum = 0;

        System.out.print("Input the number: ");
        num = sc.nextInt();

        System.out.print("The positive divisor : ");

        for (int i = 1; i < num; i++) {
            if (num % i == 0) {
                System.out.print(i + " ");
                sum += i;
            }
        }

        System.out.println("\nThe sum of the divisor is : " + sum);

        if (sum == num) {
            System.out.println("So, the number is perfect.");
        } else {
            System.out.println("So, the number is not perfect.");
        }
    }
}
