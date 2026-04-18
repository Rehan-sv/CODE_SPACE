import java.util.ArrayList;
import java.util.List;

interface ServiceMode {
    double calculateFare(double distance);
    boolean isAvailable();
    String getServiceType();
    int getCapacity();
}


class EconomyMode implements ServiceMode {
    public double calculateFare(double distance) {
         return distance * 1.0; }
    public boolean isAvailable() {
         return true; } 
    public String getServiceType() {
         return "Economy"; }
    public int getCapacity() { 
        return 4; }
}

class LuxuryMode implements ServiceMode {
    public double calculateFare(double distance) {
         return distance * 2.5; }
    public boolean isAvailable() {
         return true; }
    public String getServiceType() { 
        return "Luxury"; }
    public int getCapacity() {
         return 2; }
}

class SharedMode implements ServiceMode {
    public double calculateFare(double distance) {
         return distance * 0.5; }
    public boolean isAvailable() {
         return true; }
    public String getServiceType() { 
        return "Shared"; }
    public int getCapacity() {
         return 6; }
}
