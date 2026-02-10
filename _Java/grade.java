package _Java;
import java.util.Scanner;
public class grade {
    public static char calculateGrade(int m1, int m2, int m3) {
        double average = (m1 + m2 + m3) / 3.0;

        if (average >= 90) {
            return 'A';
        } else if (average >= 80) {
            return 'B';
        } else if (average >= 70) {
            return 'C';
        } else {
            return 'D';
        }
    }public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter marks of 3 subjects: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();

        char grade = calculateGrade(a, b, c);
        System.out.println("Grade: " + grade);
    }
}

