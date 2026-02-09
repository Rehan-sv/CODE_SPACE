package _Java.assignment;

public class binary {
    public static void main(String[] args) {
        int n = 25;
        int bin = 0, place = 1;
        while (n > 0) {
            int r = n % 2;
            bin = bin + r * place;
            place = place * 10 ;
            n = n / 2;
        }
        System.out.println("Binary: " + bin);
    }
}

        