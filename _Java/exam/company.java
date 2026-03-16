package _Java.exam;
import java.util.Scanner;
class Employee {

    String name;
    int[] score = new int[4];
    double avg;
    char grade;

    Employee(String n, int[] s) {

        name = n;
        score = s;

        int total = 0;

        for(int i = 0; i < 4; i++) {
            total += score[i];
        }

        avg = total / 4.0;

        if(avg >= 85)
            grade = 'A';
        else if(avg >= 70)
            grade = 'B';
        else
            grade = 'C';
    }

    void display() {

        System.out.println("Name: " + name);

        System.out.print("Scores: ");
        for(int i = 0; i < 4; i++) {
            System.out.print(score[i] + " ");
        }

        System.out.println("\nAverage: " + avg);
        System.out.println("Grade: " + grade);
        System.out.println();
    }
}

public class company {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);

        Employee[] emp = new Employee[5];

        for(int i = 0; i < 5; i++) {

            System.out.print("Enter name: ");
            String name = s.nextLine();

            int[] score = new int[4];

            for(int j = 0; j < 4; j++) {

                System.out.print("Enter quarter " + (j+1) + " score: ");
                score[j] = s.nextInt();

            }

            s.nextLine();

            emp[i] = new Employee(name, score);
        }

        int top = 0;

        for(int i = 1; i < 5; i++) {

            if(emp[i].avg > emp[top].avg) {
                top = i;
            }

        }

        System.out.println("\n--- PERFORMANCE SUMMARY ---");

        for(int i = 0; i < 5; i++) {
            emp[i].display();
        }

        System.out.println("--- TOP PERFORMER ---");
        emp[top].display();

    }
}