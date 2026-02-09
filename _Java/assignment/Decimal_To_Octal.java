package _Java.assignment;

public class Decimal_To_Octal {
    public static void main(String[] args) {
        int num = 79;
        int octal = 0;
        int place = 1;

        while (num > 0) {
            int rem = num % 8;
            octal = octal + rem * place;
            num /= 8;
            place *= 10;
        }

        System.out.println(octal);
    }
}
