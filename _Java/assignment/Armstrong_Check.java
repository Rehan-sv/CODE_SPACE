package _Java.assignment;

public class Armstrong_Check {

    static int power(int base, int exp) {
        int result = 1;
        for (int i = 0; i < exp; i++)
            result *= base;
        return result;
    }

    public static void main(String[] args) {
        int num = 1634;
        int temp = num, sum = 0, digits = 0;

        while (temp > 0) {
            digits++;
            temp /= 10;
        }

        temp = num;
        while (temp > 0) {
            sum += power(temp % 10, digits);
            temp /= 10;
        }

        if (sum == num)
            System.out.println(num + " is an Armstrong number.");
        else
            System.out.println(num + " is not an Armstrong number.");
    }
}
