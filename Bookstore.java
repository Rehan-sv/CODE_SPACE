public class Bookstore {
    public static void main(String[] args) {
    	
    	Books book1=new Books();
    	System.out.print("THe book with no atri");
    	book1.displayDetails();
    	
    	Books book2 =new Books("Harry poter","Jk Rowlling",1000.0);
    	book2.displayDetails();
    	
    	book1.setDetails("Lord of rings","Idk who tf is this written by",140.0);
    	book1.displayDetails();
    	
    	book2.setDetails("Aribam","Rajeev",18);
    }
}
