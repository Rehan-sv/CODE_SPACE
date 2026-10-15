#include <stdio.h>
#include <stdlib.h>

struct Student
{
    char name[50];
    int roll;
    int marks;
};

int main()
{
    int n;

    printf("Enter number of students: ");
    scanf("%d", &n);

    if (n <= 0)
        return 0;

    struct Student *p = malloc(n * sizeof(struct Student));

    if (p == NULL)
        return 1;

    for (int i = 0; i < n; i++)
    {
        printf("Enter name, roll and marks: ");
        scanf("%49s %d %d",
              (p + i)->name,
              &(p + i)->roll,
              &(p + i)->marks);
    }

    printf("\nStudent Details:\n");

    for (int i = 0; i < n; i++)
    {
        printf("%s %d %d\n",
               (p + i)->name,
               (p + i)->roll,
               (p + i)->marks);
    }

    free(p);

    return 0;
}