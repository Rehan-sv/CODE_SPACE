#include <stdio.h>

struct student
{
    char name[100];
    int roll;
    int marks[5];
};

float avg(int marks[])
{
    int total = 0;

    for (int i = 0; i < 5; i++)
    {
        total += marks[i];
    }

    return total / 5.0;
}

int main()
{
    struct student s;

    printf("Enter the student name: ");
    scanf("%99s", s.name);

    printf("Enter the roll number: ");
    scanf("%d", &s.roll);

    printf("Enter marks in 5 subjects: ");

    for (int i = 0; i < 5; i++)
    {
        scanf("%d", &s.marks[i]);
    }

    printf("\nStudent Name: %s\n", s.name);
    printf("Roll Number: %d\n", s.roll);

    printf("Average = %.2f\n", avg(s.marks));

    return 0;
}