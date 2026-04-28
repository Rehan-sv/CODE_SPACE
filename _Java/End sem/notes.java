import java.util.Scanner;
import java.io.*;
import java.time.LocalDateTime;

// Custom Exception
class EmptyNoteException extends Exception {
    EmptyNoteException(String message) {
        super(message);
    }
}

// Abstract class
abstract class Logger {

    abstract String format(String note);

}

// Logger implementation
class FileLogger extends Logger {

    String format(String note) {
        return "[" + LocalDateTime.now() + "] " + note;
    }

}

// Main class
public class notes {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        Logger logger = new FileLogger();

        try {

            String note = sc.nextLine();

            if (note.trim().isEmpty()) {
                throw new EmptyNoteException("Note cannot be empty");
            }

            String formattedNote = logger.format(note);

            FileWriter fw = new FileWriter("logs.txt", true);
            fw.write(formattedNote + "\n");
            fw.close();

            System.out.println("Note saved to logs.txt: " + formattedNote);

        }

        catch (EmptyNoteException e) {
            System.out.println("Error: " + e.getMessage());
        }

        catch (IOException e) {
            System.out.println("File error occurred.");
        }

        sc.close();
    }
}