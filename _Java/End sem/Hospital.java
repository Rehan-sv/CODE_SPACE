class Patient {
    String patientId;
    String patientName;
    String disease;

    // Constructor
    Patient(String patientId, String patientName, String disease) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.disease = disease;
    }

    // Method to display patient details
    void displayPatientDetails() {
        System.out.println("Patient ID: " + patientId);
        System.out.println("Patient Name: " + patientName);
        System.out.println("Disease: " + disease);
    }
}

// Derived class
class ICUPatient extends Patient {
    String assignedDoctor;
    double dailyCareCharge;

    // Constructor
    ICUPatient(String patientId, String patientName, String disease,
               String assignedDoctor, double dailyCareCharge) {

        super(patientId, patientName, disease);

        this.assignedDoctor = assignedDoctor;
        this.dailyCareCharge = dailyCareCharge;
    }

    // Overriding method
    @Override
    void displayPatientDetails() {
        super.displayPatientDetails();

        System.out.println("Assigned Doctor: " + assignedDoctor);
        System.out.println("Daily Care Charge: " + dailyCareCharge);
    }
}

// Main class
public class Hospital {
    public static void main(String[] args) {

        // Creating Patient object
        Patient p1 = new Patient("P001", "Arjun", "Fever");

        // Creating ICUPatient object
        ICUPatient p2 = new ICUPatient(
                "P002",
                "Meera",
                "Cardiac Arrest",
                "Dr. Sharma",
                5000
        );

        // Display details
        p1.displayPatientDetails();

        System.out.println();

        p2.displayPatientDetails();
    }
}