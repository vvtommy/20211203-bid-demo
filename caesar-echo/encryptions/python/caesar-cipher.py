#!/bin/env python3
import sys


def caesar(message, shift):
    message = message.strip()
    result = ''
    for i in range(len(message)):
        char = message[i]

        if char.isupper():
            result += chr((ord(char) + shift - 65) % 26 + 65)
        else:
            result += chr((ord(char) + shift - 97) % 26 + 97)
    return result


def main():
    if len(sys.argv) < 2:
        print("need more arguments", file=sys.stderr)
        sys.exit(1)
        return

    shift = int(sys.argv[1])
    message = sys.stdin.readline()

    print(caesar(message, shift), file=sys.stdout, end='')


if __name__ == "__main__":
    main()
