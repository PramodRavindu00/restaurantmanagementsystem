package com.project.backend.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.project.backend.model.CustomerOrder;
import com.project.backend.model.OrderItem;
import com.project.backend.model.Payment;
import com.project.backend.repository.BranchRepository;
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
    @Autowired
    private BranchRepository branchRepository;

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
        PdfWriter writer =   PdfWriter.getInstance(document,output);
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
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
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

        Font goldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new BaseColor(166, 144, 3));
        Paragraph orderListTitle = new Paragraph("Receipt", goldFont);
        orderListTitle.setAlignment(Paragraph.ALIGN_CENTER);
        orderListTitle.setSpacingBefore(10);
        orderListTitle.setSpacingAfter(10);
        document.add(orderListTitle);

        Font paymentReceivedFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
        Paragraph paymentReceived = new Paragraph("Payment Received", paymentReceivedFont);
        paymentReceived.setSpacingAfter(10);
        document.add(paymentReceived);

        Font detailFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
        Font itemFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);

        PdfPTable infoTable = new PdfPTable(6);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingBefore(10f);
        infoTable.setSpacingAfter(20f);

        float[] infoColumnWidths = {0.24f,0.02f,0.2f,0.2f,0.02f,0.32f};
        infoTable.setWidths(infoColumnWidths);

        PdfPCell infoCell = new PdfPCell(new Phrase("Bill No", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
       infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(payment.getPaymentNo(), detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase("Date & Time", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(payment.getDateTime().format(formatter), detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);

       //get customer Name
        String customer = userService.findUserNameByID(payment.getCustomerId());

        infoCell = new PdfPCell(new Phrase("Reference No / Order No", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(payment.getReferenceNo(), detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase("Customer Name", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(customer, detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);

        //get branch name and email
        String branchName = branchRepository.findBranchNameById(order.getBranch());
        String email = userRepository.getUserEmailByID(payment.getCustomerId());

        infoCell = new PdfPCell(new Phrase("Branch", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(branchName, detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase("Email", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(email, detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);

        //formatting amount
        String amount = decimalFormat.format(payment.getAmount());

        infoCell = new PdfPCell(new Phrase("Amount", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase("Rs "+amount, detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase("Contact No", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(":", detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        infoCell = new PdfPCell(new Phrase(order.getPhone(), detailFont));
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(infoCell);
        document.add(infoTable);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20f);
        table.setSpacingAfter(20f);

        float[] orderColumnWidths = {0.4f,0.15f,0.2f,0.25f};
        table.setWidths(orderColumnWidths);

        PdfPCell cell = new PdfPCell(new Phrase("Product Name", itemFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setPadding(5f);
        table.addCell(cell);


        cell = new PdfPCell(new Phrase("Qty", itemFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setPadding(5f);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Unit Price", itemFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setPadding(5f);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase("Sub Total", itemFont));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setPadding(5f);
        table.addCell(cell);

        for (OrderItem items : order.getOrderItems()) {

            cell = new PdfPCell(new Phrase(items.getProductName(), detailFont));
            cell.setPadding(5f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase(String.valueOf(items.getQuantity()), detailFont));
            cell.setPadding(5f);
            table.addCell(cell);

            //formatting into 2 digits
            String formattedUnitPrice = decimalFormat.format(items.getPrice());
            String formattedSubTotal = decimalFormat.format(items.getQuantity() * items.getPrice());

            PdfPCell unitPriceCell = new PdfPCell(new Phrase(formattedUnitPrice, detailFont));
            unitPriceCell.setPadding(5f);
            unitPriceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(unitPriceCell);

            PdfPCell subTotCell = new PdfPCell(new Phrase(formattedSubTotal, detailFont));
            subTotCell.setPadding(5f);
            subTotCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(subTotCell);
        }

        PdfPCell grandTotalCell = new PdfPCell(new Phrase("Grand Total: Rs " +
                decimalFormat.format(order.getOrderValue()), itemFont));
        grandTotalCell.setColspan(4);
        grandTotalCell.setPadding(5f);
        grandTotalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(grandTotalCell);
        document.add(table);

        float pageHeight = document.getPageSize().getHeight();
        float marginBottom = document.bottomMargin();

        Font thankYouFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        PdfContentByte canvas = writer.getDirectContent();
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase("Thank you for choosing ABC Restaurant", thankYouFont),
                (document.right() + document.left()) / 2, marginBottom + 20, 0);

        document.close();
        return output.toByteArray();
    }

}
