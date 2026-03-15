import java.util.Scanner;

class grading {
    String name;
    int[] marks;

    grading(String n, int[] m) {
        name = n;
        marks = m;
    }
}

public class system {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);

        System.out.println("Enter the size of array you want:");
        int size = s.nextInt();
        s.nextLine(); // clear buffer

        grading[] student = new grading[size];

        for (int i = 0; i < size; i++) {

            System.out.println("Enter the name " + (i + 1));
            String name = s.nextLine();

            int[] marks = new int[3];

            for (int j = 0; j < 3; j++) {
                System.out.println("Enter mark " + (j + 1));
                marks[j] = s.nextInt();
            }

            s.nextLine(); // clear buffer

            student[i] = new grading(name, marks);
        }

        double totalavg = 0;

        for (int i = 0; i < size; i++) {

            int sum = 0;

            for (int j = 0; j < 3; j++) {
                sum += student[i].marks[j];
            }

            double avg = sum / 3.0;

            System.out.println(student[i].name + " average = " + avg);

            totalavg += avg;
        }

        System.out.println("Total class average = " + (totalavg / size));
    }
}