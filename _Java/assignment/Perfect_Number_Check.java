package _Java.assignment;

public class Perfect_Number_Check {
    public static void main(String[] args) {
        int num = 56;
        int sum = 0;

        for (int i = 1; i <= num / 2; i++) {
            if (num % i == 0)
                sum = sum + i;
        }

        if (sum == num)
            System.out.println(num + " is perfect.");
        else
            System.out.println("Not perfect.");
    }
}
