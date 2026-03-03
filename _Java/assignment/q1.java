package _Java.assignment;

public class q1 {
int rank;
String Title;
String dec;
String  world;  
int rating;

q1(int rank,String Title ,String dec,String world){
        this.rank = rank;
        this.Title = Title;
        this.dec = dec;
        this.world = world;
        
    }
    void assignRating() {
        if (world> 1000000000)
            rating = 3;
        else if (world > 900000000)
            rating = 2;
        else if (world > 600000000)
            rating = 1;
        else
            rating = 0;
    }

}
