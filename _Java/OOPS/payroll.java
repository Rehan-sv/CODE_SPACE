class Employee {
    String name;

    Employee(String name) {
        this.name = name;
    }

    double calculateSalary() {
        return 0;
    }
}

class FullTimeEmployee extends Employee {
    double salary;

    FullTimeEmployee(String name, double salary) {
        super(name);
        this.salary = salary;
    }

    double calculateSalary() {
        return salary;
    }
}

class ContractEmployee extends Employee {
    int hours;
    double rate;

    ContractEmployee(String name, int hours, double rate) {
        super(name);
        this.hours = hours;
        this.rate = rate;
    }

    double calculateSalary() {
        return hours * rate;
    }
}

public class payroll {
    public static void main(String[] args) {

        Employee e1 = new FullTimeEmployee("Alice", 50000);
        Employee e2 = new ContractEmployee("Bob", 120, 200);

        System.out.println(e1.name + " Salary: " + e1.calculateSalary());
        System.out.println(e2.name + " Salary: " + e2.calculateSalary());
    }
}