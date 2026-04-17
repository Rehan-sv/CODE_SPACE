// <!-- Q1. A university maintains records of all individuals associated with it. Each individual has a name and age, but only students have a unique student ID. The system should allow retrieving and displaying information about any person, but the details should be properly controlled so that only necessary attributes are accessible where required.

// The system should also ensure that a student's ID remains private and cannot be accessed directly from outside. However, when retrieving student details, their ID must be included in the output.

// Sample Input:
// John 20 S12345
// Sample Output:
// Name: John  
// Age: 20  
// Student ID: S12345   -->
class Person {

    protected String name;
    protected int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }
}

class Student extends Person {

    private String studentId;

    Student(String name, int age, String studentId) {
        super(name, age);
        this.studentId = studentId;
    }

    public void displayStudentInfo() {
        displayInfo();
        System.out.println("Student ID: " + studentId);
    }
}

public class uni {
    public static void main(String[] args) {

        Student s = new Student("John", 20, "S12345");
        s.displayStudentInfo();
    }
}