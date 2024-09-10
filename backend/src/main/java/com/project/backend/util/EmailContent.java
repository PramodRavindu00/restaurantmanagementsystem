package com.project.backend.util;

public class EmailContent {

    public String emailHtml(String name,String message){
        return "<html>" +
                "<body>" +
                "<h1>Hello " + name + ",</h1>" +
                "<p>" + message + "</p>" +
                "<p style='text-align:center;'>Thank you for choosing ABC Restaurant!</p>" +
                "</body>" +
                "</html>";
    }
}
