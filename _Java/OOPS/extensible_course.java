abstract class Course {
    String title;
    int duration;

    Course(String title, int duration) {
        this.title = title;
        this.duration = duration;
    }

    abstract void accessCourse();

    void display() {
        System.out.println("Course: " + title);
        System.out.println("Duration: " + duration + " hours");
    }
}

class RecordedCourse extends Course {

    RecordedCourse(String title, int duration) {
        super(title, duration);
    }

    void accessCourse() {
        System.out.println("Access: Pre-recorded videos available anytime.");
    }
}

class LiveCourse extends Course {

    LiveCourse(String title, int duration) {
        super(title, duration);
    }

    void accessCourse() {
        System.out.println("Access: Attend scheduled live sessions.");
    }
}

public class extensible_course{
    public static void main(String[] args) {

        Course c1 = new RecordedCourse("Java Programming", 40);
        Course c2 = new LiveCourse("Data Structures", 30);

        c1.display();
        c1.accessCourse();

        System.out.println();

        c2.display();
        c2.accessCourse();
    }
}