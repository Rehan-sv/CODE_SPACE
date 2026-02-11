public class Book {
    class book{
    private String title;
    private String author;
    private double price;
    }
    public book() {
        this.title="No arguments";
        this.author="No arguments";
        this.price=0.0;
    }
    public book(String title, String author, double price){
        this.title=title;
        this.author=author;
        this.price=price;

    }
    public void setDetails(String title, String author, double price){
        this.title=title;
        this.author=author;
        this.price=price;
    }
    


    
}
