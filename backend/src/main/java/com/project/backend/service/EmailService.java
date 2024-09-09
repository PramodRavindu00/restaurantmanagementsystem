package com.project.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendSimpleMail(String to, String subject, String content) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true);

        mimeMessageHelper.setTo(to);

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(content, true);

        ClassPathResource logoResource = new ClassPathResource("ABC.png");
        mimeMessageHelper.addInline("logo", logoResource);

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendSimpleMailWithAttachment(String to, String subject,
                                             String content,String attachmentName,byte[] attachment) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true);

        mimeMessageHelper.setTo(to);

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(content, true);

        ByteArrayDataSource dataSource = new ByteArrayDataSource(attachment, "application/pdf");
        mimeMessageHelper.addAttachment(attachmentName, dataSource);

        ClassPathResource logoResource = new ClassPathResource("ABC.png");
        mimeMessageHelper.addInline("logo", logoResource);

        mailSender.send(mimeMessage);
    }

}
