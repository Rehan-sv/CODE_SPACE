import java.util.Scanner;

// Abstract class
abstract class Animal {

    String name;
    String type;

    Animal(String name, String type) {
        this.name = name;
        this.type = type;
    }

    abstract double getDiet();
}

// Predator class
class Predator extends Animal {

    double weight;

    Predator(String name, double weight) {
        super(name, "Predator");
        this.weight = weight;
    }

    double getDiet() {
        return weight * 1.5;
    }
}

// Prey class
class Prey extends Animal {

    Prey(String name) {
        super(name, "Prey");
    }

    double getDiet() {
        return 2000;
    }
}

// Main class
public class  center {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Predator input
        String type1 = sc.next();
        String name1 = sc.next();
        double weight = sc.nextDouble();

        Animal a1 = new Predator(name1, weight);

        // Prey input
        String type2 = sc.next();
        String name2 = sc.next();

        Animal a2 = new Prey(name2);

        System.out.println(a1.name + " (" + a1.type + ") requires " + a1.getDiet() + " calories.");
        System.out.println(a2.name + " (" + a2.type + ") requires " + a2.getDiet() + " calories.");

        sc.close();
    }
}