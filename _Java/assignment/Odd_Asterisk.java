package _Java.assignment;

public class Odd_Asterisk {
    public static void main(String[] args) {
        for (int i = 1; i <= 4; i++) {
            for (int space = 4; space > i; space--) {
                System.out.print(" ");
            }
            for (int j = 1; j <= 2 * i - 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
