class Product {
    String productName;
    int quantity;

    Product(String productName, int quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }
}

public class InventoryFilter {
    public static void main(String[] args) {

        Product[] products = new Product[5];

        products[0] = new Product("Laptop", 15);
        products[1] = new Product("Mouse", 5);
        products[2] = new Product("Monitor", 12);
        products[3] = new Product("Keyboard", 8);
        products[4] = new Product("Webcam", 20);

        for (Product p : products) {
            if (p.quantity < 10) {
                System.out.println(p.productName +
                        ": Restock Recommended (Current: " + p.quantity + ")");
            }
        }
    }
}
