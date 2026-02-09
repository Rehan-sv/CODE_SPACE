package _Java.assignment;

public class Armstrong_In_Range {

    static int power(int base, int exp) {
        int result = 1;
        for (int i = 0; i < exp; i++)
            result *= base;
        return result;
    }

    public static void main(String[] args) {

        for (int num = 1; num <= 1000; num++) {
            int temp = num, digits = 0, sum = 0;

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
                System.out.print(num + " ");
        }
    }
}
