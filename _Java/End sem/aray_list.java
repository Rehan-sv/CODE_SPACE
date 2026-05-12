import java.util.*;

class Student {

    int id;
    String name;

    Student(int id, String name) {

        this.id = id;
        this.name = name;
    }
}

public class aray_list {

    public static void main(String[] args) {
        // Student Student =new Student();

        ArrayList<Student> list =
                new ArrayList<>();

        list.add(new Student(1, "Rahul"));

        list.add(new Student(2, "Ananya"));

        for(Student s : list) {
            System.out.println(s.id + " " + s.name);
        }
    }
}