package _Java.assignment;

public class AlphabetPyramid {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            for (int space = 2; space > i; space--)
                System.out.print(" ");

            char ch = 'A';

            for (int j = 0; j <= i; j++)
                System.out.print(ch++);

            ch -= 2;

            for (int j = 0; j < i; j++)
                System.out.print(ch--);

            System.out.println();
        }
    }
}
