package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func caesar(r rune, shift int) rune {
	s := int(r) + shift
	if s > 'z' {
		return rune(s - 26)
	} else if s < 'a' {
		return rune(s + 26)
	}
	return rune(s)
}

func main() {
	if len(os.Args) < 2 {
		panic("not enough arguments.")
	}
	offsetString := os.Args[1]
	offset, err := strconv.ParseInt(offsetString, 10, 64)
	if err != nil {
		panic(err)
	}
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		_, _ = fmt.Fprintln(os.Stdout, strings.Map(func(r rune) rune {
			return caesar(r, int(offset))
		}, scanner.Text()))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading standard input:", err)
	}
}
