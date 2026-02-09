package _Java.assignment;

public class Binary_To_Octal {
    public static void main(String[] args) {
        int bin = 1001;
        int decimal = 0;
        int power = 0;

        while (bin > 0) {
            int rem = bin % 10;
            decimal += rem * Math.pow(2, power);
            bin /= 10;
            power++;
        }

        int octal = 0;
        int place = 1;

        while (decimal > 0) {
            int rem = decimal % 8;
            octal = octal + rem * place;
            decimal /= 8;
            place *= 10;
        }

        System.out.println(octal);
    }
}
