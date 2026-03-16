package _Java.exam;

import java.util.Scanner;

class result {

    String name;
    int[] mark = new int[5];
    int total;
    double per;

    result(String n, int[] m) {

        name = n;
        mark = m;
        total = 0;

        for (int i = 0; i < 5; i++) {
            total += mark[i];
        }

        per = total / 5.0;
    }
}

public class University {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);
        result[] students = new result[10];

        int choice;

        do {

            System.out.println("\n--- UNIVERSITY RESULT SYSTEM ---");
            System.out.println("1. Enter Student Details");
            System.out.println("2. Rank Students");
            System.out.println("3. Display Top 3 Rank Holders");
            System.out.println("4. Exit");
            System.out.print("Enter choice: ");

            choice = s.nextInt();
            s.nextLine();

            switch (choice) {

                case 1:

                    for (int i = 0; i < 10; i++) {

                        System.out.print("Enter name " + (i + 1) + ": ");
                        String name = s.nextLine();

                        int[] mark = new int[5];

                        for (int j = 0; j < 5; j++) {

                            System.out.print("Enter mark " + (j + 1) + ": ");
                            mark[j] = s.nextInt();

                        }

                        s.nextLine();

                        students[i] = new result(name, mark);
                    }

                    break;

                case 2:

                    for (int i = 0; i < 9; i++) {

                        for (int j = i + 1; j < 10; j++) {

                            if (students[i].per < students[j].per) {

                                result temp = students[i];
                                students[i] = students[j];
                                students[j] = temp;

                            }

                        }

                    }

                    System.out.println("Students Ranked Successfully");

                    break;

                case 3:

                    System.out.println("\nTop 3 Rank Holders:");

                    for (int i = 0; i < 3; i++) {

                        System.out.println("Rank " + (i + 1));
                        System.out.println("Name: " + students[i].name);
                        System.out.println("Total: " + students[i].total);
                        System.out.println("Percentage: " + students[i].per);
                        System.out.println();

                    }

                    break;

            }

        } while (choice != 4);

    }
}