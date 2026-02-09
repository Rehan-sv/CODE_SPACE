package _Java.assignment;

public class Prime {
    public static void main(String[] args) {

        int num = 13;
        boolean isPrime = true;

        if (num < 2)
            isPrime = false;

        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) {
                isPrime = false;
                break;
            }
        }

        if (isPrime)
            System.out.println(num + " is a prime number");
        else
            System.out.println(num + " is not a prime number");
    }
}
