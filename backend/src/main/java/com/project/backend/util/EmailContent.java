package com.project.backend.util;

public class EmailContent {

    public String emailHtml(String name,String message){
        return "<html>" +
                "<body>" +
                "<h1>Hello " + name + ",</h1>" +
                "<p>" + message + "</p>" +
                "<p style='text-align:center;'><img src='cid:logo' alt='Logo' height='100px' width='100px'></p>" +
                "<p style='text-align:center;'>Thank you for choosing ABC Restaurant!</p>" +
                "</body>" +
                "</html>";
    }
}
