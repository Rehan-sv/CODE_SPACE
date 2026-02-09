package _Java.assignment;

public class Octal_To_Binary {
    public static void main(String[] args) {
        int oct = 57;
        int decimal = 0;
        int power = 0;

        while (oct > 0) {
            int rem = oct % 10;
            decimal += rem * Math.pow(8, power);
            oct /= 10;
            power++;
        }

        int binary = 0;
        int place = 1;

        while (decimal > 0) {
            int rem = decimal % 2;
            binary = binary + rem * place;
            decimal /= 2;
            place *= 10;
        }

        System.out.println(binary);
    }
}
