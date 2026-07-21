#include <stdio.h>
#include <string.h>

int main()
{
    int T;
    scanf("%d", &T);

    while(T--)
    {
        int N;
        char S[105];

        scanf("%d", &N);
        scanf("%s", S);

        int count = 0;
        int hard = 0;

        for(int i = 0; i < N; i++)
        {
            if(S[i]=='a' || S[i]=='e' || S[i]=='i' || S[i]=='o' || S[i]=='u')
            {
                count = 0;
            }
            else
            {
                count++;

                if(count >= 4)
                {
                    hard = 1;
                    break;
                }
            }
        }

        if(hard)
            printf("NO\n");
        else
            printf("YES\n");
    }

    return 0;
}