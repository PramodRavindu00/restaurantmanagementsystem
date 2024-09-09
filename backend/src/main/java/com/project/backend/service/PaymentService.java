package com.project.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.project.backend.model.CustomerOrder;
import com.project.backend.model.Payment;
import com.project.backend.repository.OrderRepository;
import com.project.backend.repository.PaymentRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.util.EmailContent;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    @Autowired
    private final PaymentRepository paymentRepository;

    @Autowired final OrderRepository orderRepository;

    @Autowired
    private final UserService userService;

    @Autowired
    private final EmailService emailService;

    DecimalFormat decimalFormat = new DecimalFormat("#.00");
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a");

    @Autowired
    private UserRepository userRepository;

    public synchronized String generateNextPaymentNo(){
        String lastPaymentNo = paymentRepository.findLastPaymentNo();
        int nextNumber =1;

        if(lastPaymentNo != null){
            String subString = lastPaymentNo.substring(4);
            nextNumber = Integer.parseInt(subString)+1;
        }
        return String.format("BILL%03d", nextNumber);
    }

    public void submitPayment(Payment payment){
        try {
            String paymentNo = generateNextPaymentNo();
            payment.setPaymentNo(paymentNo);
           paymentRepository.save(payment);
        }
        catch (Exception e){
            System.err.println("Error while processing payment"+e.getMessage());
        }
    }

    @Async
    protected void sendPaymentReceivedEmail(Payment payment) throws MessagingException {

        try {
            Long customerID = payment.getCustomerId();
            String name = userService.findUserNameByID(customerID);
            String amount = decimalFormat.format(payment.getAmount());
            String dateTime = "Date & Time: " + payment.getDateTime().format(formatter) + "<br>";
            String message = "Payment Received.<br>" +
                    "Payment details<br>" +
                    "Payment No: " + payment.getPaymentNo() + "<br>" +
                    "Reference No: " + payment.getReferenceNo() + "<br>" +
                    "Date & Time: " + dateTime + "<br>" +
                    "Amount: Rs " + amount + "<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Payment Received", htmlContent);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send Payment received email", e);
        }
    }

    public byte[] generateOrderReceipt(Payment payment) throws DocumentException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document,output);
        document.open();

        CustomerOrder order = orderRepository.findOrderByBillReference(payment.getReferenceNo());
        PdfPTable headerTable = new PdfPTable(2); // Two columns
        headerTable.setWidthPercentage(100);
        headerTable.setSpacingAfter(10f);

        PdfPCell logoCell = new PdfPCell();
        try {
            ClassPathResource logoResource = new ClassPathResource("ABC.png");
            Image logo = Image.getInstance(logoResource.getURL());
            logo.scaleToFit(100, 100);
            logo.setAlignment(Image.ALIGN_LEFT);
            logoCell.addElement(logo);
            logoCell.setBorder(Rectangle.NO_BORDER);
        } catch (Exception e) {
            System.err.println("Error while generating receipt header"+e.getMessage());
        }
        headerTable.addCell(logoCell);

        PdfPCell nameCell = new PdfPCell();
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Paragraph restaurantName = new Paragraph("ABC Restaurant", titleFont);
        restaurantName.setAlignment(Paragraph.ALIGN_RIGHT);
        restaurantName.setSpacingBefore(10);
        restaurantName.setSpacingAfter(5);
        nameCell.addElement(restaurantName);
        Paragraph underline = new Paragraph(" ");
        underline.setSpacingBefore(5);
        nameCell.addElement(underline);

        nameCell.setBorder(Rectangle.NO_BORDER);
        headerTable.addCell(nameCell);

        document.add(headerTable);

        Font goldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 25, new BaseColor(166, 144, 3));
        Paragraph orderListTitle = new Paragraph("Receipt", goldFont);
        orderListTitle.setAlignment(Paragraph.ALIGN_CENTER);
        orderListTitle.setSpacingBefore(10);
        orderListTitle.setSpacingAfter(30);
        document.add(orderListTitle);

        Font detailFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
        Font itemFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);

        document.add(new Paragraph("Bill No: " + payment.getPaymentNo(), detailFont));
        document.add(new Paragraph("Date & Time: " + payment.getDateTime().format(formatter), detailFont));
        document.add(new Paragraph("Reference No / Order No: " + payment.getReferenceNo(), detailFont));

        //get customer name
        String customer = userService.findUserNameByID(payment.getCustomerId());
        document.add(new Paragraph("Customer: " + customer, detailFont));

        //get customer email
        String email = userRepository.getUserEmailByID(payment.getCustomerId());
        document.add(new Paragraph("Email: " + email, detailFont));

        document.add(new Paragraph("Contact No: " + order.getPhone(), detailFont));

        //formatting amount
        String amount = decimalFormat.format(payment.getAmount());
        document.add(new Paragraph("Amount: Rs " + amount, detailFont));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(50f);
        table.setSpacingAfter(50f);
        document.close();
        return output.toByteArray();
    }

}
