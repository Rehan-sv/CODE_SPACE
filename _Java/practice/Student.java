package _Java.practice;

    class Student {
    int rollNo;
    int exitDay, exitMonth, exitYear;
    int entryDay, entryMonth, entryYear;

    // Constructor
    Student(int rollNo) {
        this.rollNo = rollNo;
    }

    void setExitEntry(int ed, int em, int ey, int id, int im, int iy) {
        exitDay = ed;
        exitMonth = em;
        exitYear = ey;
        entryDay = id;
        entryMonth = im;
        entryYear = iy;
    }

    int calculateDays() {
        int days = (entryYear - exitYear) * 365 +
                   (entryMonth - exitMonth) * 30 +
                   (entryDay - exitDay);
        return days;
    }
}
    

