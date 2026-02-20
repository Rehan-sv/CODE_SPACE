class Student {
    String name;
    int[] marks;

    Student(String name, int[] marks) {
        this.name = name;
        this.marks = marks;
    }

    double getAverage() {
        int sum = 0;
        for (int m : marks) {
            sum += m;
        }
        return (double) sum / marks.length;
    }
}

public class GradingSystem {
    public static void main(String[] args) {

        Student[] students = new Student[3];

        students[0] = new Student("Student 1", new int[]{80, 90, 100});
        students[1] = new Student("Student 2", new int[]{70, 70, 70});
        students[2] = new Student("Student 3", new int[]{60, 80, 70});

        double total = 0;

        for (Student s : students) {
            double avg = s.getAverage();
            System.out.println(s.name + " Average: " + avg);
            total += avg;
        }

        double classAvg = total / students.length;
        System.out.printf("Total Class Average: %.2f%n", classAvg);
    }
}
