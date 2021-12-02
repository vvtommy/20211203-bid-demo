#include <stdio.h>
#include <errno.h>  // for errno
#include <limits.h> // for INT_MAX, INT_MIN
#include <stdlib.h> // for strtol

int main(int argc, char *argv[])
{
    char *p;
    int shift, i;
    char *line = NULL;
    size_t size;

    if (argc < 2)
    {
        printf("need more arguments");
        return 1;
    }

    long conv = strtol(argv[1], &p, 10);

    if (errno != 0 || *p != '\0' || conv > INT_MAX || conv < INT_MIN)
    {
        printf("invalid shift");
        return 1;
    }
    else
    {
        // No error
        shift = conv;
    }

    if (getline(&line, &size, stdin) == -1)
    {
        printf("No line\n");
        return 1;
    }

    char message[100], ch;
    for (i = 0; line[i] != '\0'; ++i)
    {
        ch = line[i];
        if (ch >= 'a' && ch <= 'z')
        {
            ch = ch + shift;
            if (ch > 'z')
            {
                ch = ch - 'z' + 'a' - 1;
            }
            line[i] = ch;
        }
        else if (ch >= 'A' && ch <= 'Z')
        {
            ch = ch + shift;
            if (ch > 'Z')
            {
                ch = ch - 'Z' + 'A' - 1;
            }
            line[i] = ch;
        }
    }
    printf("%s", line);

    return 0;
}
