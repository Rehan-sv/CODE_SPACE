package _Java.assignment;

public class Binary_To_Decimal {
    public static void main(String[] args) {
        int bin = 1010101;
        int decimal = 0;
        int length = String.valueOf(bin).length();

        for (int i = 0; i < length; i++) {
            int digit = (bin / (int)Math.pow(10, i)) % 10;
            decimal += digit * Math.pow(2, i);
        }

        System.out.println(decimal);
    }
}
