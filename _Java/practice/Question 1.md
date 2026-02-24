Question 1. Design a system to manage doctors and patients in a hospital. Implement the following:

Create a Patient class with fields for patient ID, name, and the ailment. Use a constructor that accepts these fields and initializes them using the this keyword. Include a method displayPatientDetails() to show patient information.

Create a Doctor class with fields for doctor ID, name, specialization, and a list of Patient objects (aggregation). Use a constructor to initialize doctor ID and name with the this keyword. Add a method addPatient(Patient patient) to associate patients with the doctor, and a static field to track the total number of doctors and update it whenever a new Doctor object is created. Implement a method displayDoctorDetails() to show doctor and patient information.

Write a Hospital class with a main method to demonstrate creating doctors, assigning patients to them, and displaying details.

Question 2. Design a system to manage books and their authors in a library. Implement the following:

Create an Author class with fields for author ID, name, and nationality. Use a constructor that initializes fields using the this keyword. Include a method displayAuthorDetails() to show author information.

Create a Book class with fields for book ID, title, genre, and an Author object (composition). Use a constructor to initialize the book details, including the Author object, and this keyword to differentiate between constructor arguments and class fields. Add a static field to track the total number of books in the library and a method displayBookDetails() to show book and author information.

Write a Library class with a main method to demonstrate creating books with authors, and displaying their details.

Question 3. Design a system to manage vehicles and their drivers in a logistics company. Implement the following:

Create a Driver class with fields for driver ID, name, and license type (e.g., LMV, HMV). Use a constructor to initialize fields, ensuring the use of the this keyword to distinguish between constructor parameters and instance variables. Include a method displayDriverDetails() to display driver information.

Create a Vehicle class with fields for vehicle ID, vehicle type (e.g., Truck, Van), registration number, and a Driver object (composition). Use a constructor to initialize vehicle details and associate the Driver object and add a static field to track the total number of vehicles. Implement a method displayVehicleDetails() to display vehicle and driver information.

Create a Fleet class with a list of Vehicle objects (aggregation). Implement methods in the Fleet class to add vehicles, remove vehicles by ID, and display all fleet details.

Write a FleetManagementSystem class with a main method to demonstrate the following:

Create multiple drivers.
Create vehicles and associate them with drivers.
Add vehicles to the fleet, remove one, and display all fleet details.