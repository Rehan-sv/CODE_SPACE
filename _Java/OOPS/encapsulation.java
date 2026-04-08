class Person {
    protected String name;
    protected int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void display() {
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

    void displayStudent() {
        super.display();
        System.out.println("Student ID: " + studentId);
    }
}

class Main {
    public static void main(String[] args) {
        Student s = new Student("John", 20, "S12345");
        s.displayStudent();
    }
}