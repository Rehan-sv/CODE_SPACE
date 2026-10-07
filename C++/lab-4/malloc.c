#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i;
    int *marks;

    printf("Enter number of students: ");
    scanf("%d", &n);


    marks = (int *)malloc(n * sizeof(int));

    printf("Enter %d marks:\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &marks[i]);
    }

    printf("\nMarks are:\n");
    for (i = 0; i < n; i++) {
        printf("%d ", marks[i]);
    }

    free(marks);

    return 0;
}