package _Java.assignment;

public class Strong_Number_Check {

    static int factorial(int n) {
        int f = 1;
        for (int i = 1; i <= n; i++)
            f *= i;
        return f;
    }

    public static void main(String[] args) {
        int num = 15;
        int temp = num, sum = 0;

        while (temp > 0) {
            sum += factorial(temp % 10);
            temp /= 10;
        }

        if (sum == num)
            System.out.println(num + " is a Strong number.");
        else
            System.out.println(num + " is not a Strong number.");
    }
}
