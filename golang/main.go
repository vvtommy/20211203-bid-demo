package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz"
const upperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// Encrypts a plaintext string by shifting each character with the provided key.
func EncryptPlaintext(plaintext string, key int) string {
	return rotateText(plaintext, key)
}

// Decrypts a ciphertext string by reverse shifting each character with the provided key.
func DecryptCiphertext(ciphertext string, key int) string {
	return rotateText(ciphertext, -key)
}

// Takes a string and rotates each character by the provided amount.
func rotateText(inputText string, rot int) string {
	rot %= 26
	rotatedText := []byte(inputText)

	for index, byteValue := range rotatedText {
		if byteValue >= 'a' && byteValue <= 'z' {
			rotatedText[index] = lowerCaseAlphabet[(int((26+(byteValue-'a')))+rot)%26]
		} else if byteValue >= 'A' && byteValue <= 'Z' {
			rotatedText[index] = upperCaseAlphabet[(int((26+(byteValue-'A')))+rot)%26]
		}
	}
	return string(rotatedText)
}
func main() {
	if len(os.Args) < 2 {
		panic("not enough arguments.")
	}
	offsetString := os.Args[1]
	shift, err := strconv.ParseInt(offsetString, 10, 64)
	if err != nil {
		panic(err)
	}
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		_, _ = fmt.Fprint(os.Stdout, EncryptPlaintext(scanner.Text(), int(shift)))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading standard input:", err)
	}
}
