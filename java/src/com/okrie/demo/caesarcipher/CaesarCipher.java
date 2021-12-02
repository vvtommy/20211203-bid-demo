package com.okrie.demo.caesarcipher;

import java.util.Scanner;

public class CaesarCipher {

    public static String cipher(String msg, int shift){
        String s = "";
        int len = msg.length();
        for(int x = 0; x < len; x++){
            char c = (char)(msg.charAt(x) + shift);
            if (c > 'z')
                s += (char)(msg.charAt(x) - (26-shift));
            else
                s += (char)(msg.charAt(x) + shift);
        }
        return s;
    }

    public static void main(String[] args) {
        if(args.length<1){
            System.err.println("not enough arguments");
            return;
        }

        int shift = Integer.parseInt(args[0]);


        Scanner scan = new Scanner(System.in);
        String s = scan.nextLine();

        System.out.print(CaesarCipher.cipher(s,shift));
    }

}