package _Java.assignment;

public class Employee {
    String name;
    double salesAmount;

    Employee(String name, double salesAmount) {
        this.name = name;
        this.salesAmount = salesAmount;
    }
}

public class TopSellerFinder {

    public static Employee findTopSeller(Employee[] staff) {
        if (staff == null || staff.length == 0) {
            return null;
        }

        Employee top = staff[0];

        for (int i = 1; i < staff.length; i++) {
            if (staff[i].salesAmount > top.salesAmount) {
                top = staff[i];
            }
        }
        return top;
    }

    public static void main(String[] args) {

        Employee[] staff = new Employee[4];

        staff[0] = new Employee("Alice", 5000.0);
        staff[1] = new Employee("Bob", 7500.0);
        staff[2] = new Employee("Charlie", 3000.0);
        staff[3] = new Employee("Diana", 9000.0);

        Employee topSeller = findTopSeller(staff);

        if (topSeller != null) {
            System.out.println("Top Seller: " + topSeller.name +
                    " with $" + topSeller.salesAmount);
        } else {
            System.out.println("No employees available.");
        }
    }
}
 employee {
    
}
