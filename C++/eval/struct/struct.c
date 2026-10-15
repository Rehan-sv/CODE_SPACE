#include <stdio.h>

struct Student
{
    int roll;
    char name[50];
    int marks[4];
};

void readStudent(struct Student *p)
{
    printf("Enter name: ");
    scanf("%49s", p->name);

    printf("Enter roll number: ");
    scanf("%d", &p->roll);

    printf("Enter 4 subject marks:\n");
    for (int i = 0; i < 4; i++)
    {
        scanf("%d", &p->marks[i]);
    }
}

float average(int marks[])
{
    int sum = 0;

    for (int i = 0; i < 4; i++)
    {
        sum += marks[i];
    }

    return sum / 4.0;
}

int maximum(int marks[])
{
    int max = marks[0];

    for (int i = 1; i < 4; i++)
    {
        if (marks[i] > max)
        {
            max = marks[i];
        }
    }

    return max;
}

void checkResult(float avg)
{
    if (avg >= 50)
        printf("Result: Pass\n");
    else
        printf("Result: Fail\n");
}

void checkPerformance(int max)
{
    if (max > 90)
        printf("Performance: Excellent\n");
    else
        printf("Performance: Good\n");
}

int main()
{
    struct Student s;
    float avg;
    int max;

    readStudent(&s);

    avg = average(s.marks);
    max = maximum(s.marks);

    printf("\nName: %s\n", s.name);
    printf("Roll Number: %d\n", s.roll);
    printf("Average Marks: %.2f\n", avg);
    printf("Maximum Marks: %d\n", max);

    checkResult(avg);
    checkPerformance(max);

    return 0;
}
