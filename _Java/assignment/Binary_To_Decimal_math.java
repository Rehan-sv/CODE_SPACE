package _Java.assignment;

public class Binary_To_Decimal_math {
    public static void main(String[] args) {
        int bin = 1010100;
        int decimal = 0;
        int i = 0;

        while (bin > 0) {
            int rem = bin % 10;
            decimal += rem * Math.pow(2, i);
            bin /= 10;
            i++;
        }

        System.out.println(decimal);
    }
}
