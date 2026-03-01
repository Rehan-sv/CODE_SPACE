package _Java.assignment;

import java.util.Scanner;

public class HostelSystem {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter n: ");
        int n = sc.nextInt();

        Student[] students = new Student[n];

        for(int i = 0; i < n; i++) {
            System.out.print("Enter Rollno: ");
            int roll = sc.nextInt();
            students[i] = new Student(roll);
        }

        char option;

        do {
            System.out.println("\nMenu:");
            System.out.println("A. Exit and Entry");
            System.out.println("B. Consolidated Report");
            System.out.println("C. END");
            System.out.print("Option: ");
            option = sc.next().charAt(0);

            if(option == 'A') {

                System.out.println("Enter rollno exitDay exitMonth exitYear entryDay entryMonth entryYear:");
                int r = sc.nextInt();
                int ed = sc.nextInt();
                int em = sc.nextInt();
                int ey = sc.nextInt();
                int id = sc.nextInt();
                int im = sc.nextInt();
                int iy = sc.nextInt();

                for(int i = 0; i < n; i++) {
                    if(students[i].rollNo == r) {
                        students[i].setExitEntry(ed, em, ey, id, im, iy);
                    }
                }
            }
            else if(option == 'B') {

                System.out.println("RollNo  No_of_Days_wenthome");

                for(int i = 0; i < n; i++) {
                    System.out.println(students[i].rollNo + "     " +
                            students[i].calculateDays());
                }
            }

        } while(option != 'C');

        sc.close();
    }
}