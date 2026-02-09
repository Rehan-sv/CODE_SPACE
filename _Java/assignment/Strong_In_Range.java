package _Java.assignment;

public class Strong_In_Range {

    static int factorial(int n) {
        int f = 1;
        for (int i = 1; i <= n; i++)
            f *= i;
        return f;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 200; i++) {
            int temp = i, sum = 0;

            while (temp > 0) {
                sum += factorial(temp % 10);
                temp /= 10;
            }

            if (sum == i)
                System.out.print(i + " ");
        }
    }
}
