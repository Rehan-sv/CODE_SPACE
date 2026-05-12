import java.io.*;

// Interface
interface MedicalService {
    void scheduleAppointment(String date);
    void cancelAppointment(String date);
}

// Abstract Class
abstract class HospitalPatient {
    String patientId;
    String patientName;
    String disease;

    // Constructor
    HospitalPatient(String patientId, String patientName, String disease) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.disease = disease;
    }

    // Abstract method
    abstract double calculateBill(int days);

    // Final method
    final void generateBillSummary(int days) {
        System.out.println("Generating Bill Summary...");
        double bill = calculateBill(days);

        System.out.println("Patient ID: " + patientId);
        System.out.println("Name: " + patientName);
        System.out.println("Disease: " + disease);
        System.out.println("Total Bill: " + bill);
    }
}

// Derived Class
class ICUPatient extends HospitalPatient implements MedicalService {

    String assignedDoctor;
    double dailyCareCharge;

    // final variable
    final int MIN_STAY_DAYS = 1;

    // Constructor using super
    ICUPatient(String patientId, String patientName, String disease,
               String assignedDoctor, double dailyCareCharge) {

        super(patientId, patientName, disease);

        this.assignedDoctor = assignedDoctor;
        this.dailyCareCharge = dailyCareCharge;
    }

    // Overriding abstract method
    @Override
    double calculateBill(int days) {

        if (days < MIN_STAY_DAYS) {
            throw new IllegalArgumentException("Invalid stay duration.");
        }

        return days * dailyCareCharge;
    }

    // Interface methods
    @Override
    public void scheduleAppointment(String date) {

        if (assignedDoctor == null || assignedDoctor.isEmpty()) {
            throw new IllegalArgumentException(
                    "No doctor assigned for this patient.");
        }

        System.out.println("Appointment scheduled for: " + date);
    }

    @Override
    public void cancelAppointment(String date) {
        System.out.println("Appointment cancelled for: " + date);
    }

    // File Handling - Write to file
    void saveToFile() {

        try {
            FileWriter fw = new FileWriter("patients.txt", true);

            fw.write("Patient ID: " + patientId +
                    " | Name: " + patientName +
                    " | Disease: " + disease +
                    " | Bill: " + dailyCareCharge * 5 + "\n");

            fw.close();

            System.out.println("Patient details stored in file.");

        } catch (IOException e) {
            System.out.println("File Error: " + e.getMessage());
        }
    }

    // File Handling - Read from file
    static void readFromFile() {

        try {
            BufferedReader br = new BufferedReader(
                    new FileReader("patients.txt"));

            String line;

            System.out.println("Reading patient records from file...");

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            br.close();

        } catch (IOException e) {
            System.out.println("File Error: " + e.getMessage());
        }
    }
}

// Main Class
public class Hospital_q2 {

    public static void main(String[] args) {

        try {

            // Creating object
            ICUPatient patient1 = new ICUPatient(
                    "P002",
                    "Meera",
                    "Cardiac Arrest",
                    "Dr. Sharma",
                    5000
            );

            System.out.println("Patient record created successfully.");

            // Appointment operations
            patient1.scheduleAppointment("2025-06-10");

            patient1.cancelAppointment("2025-06-10");

            // Bill Summary
            patient1.generateBillSummary(5);

            // Exception Handling - Invalid stay duration
            try {
                patient1.generateBillSummary(0);

            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }

            // Exception Handling - No doctor assigned
            try {

                ICUPatient patient2 = new ICUPatient(
                        "P003",
                        "Rahul",
                        "Accident",
                        "",
                        4000
                );

                patient2.scheduleAppointment("2025-06-15");

            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }

            // File Handling
            patient1.saveToFile();

            ICUPatient.readFromFile();

        } catch (Exception e) {

            System.out.println("Unexpected Error: " + e.getMessage());
        }
    }
}