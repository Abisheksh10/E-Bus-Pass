package com.ebuspass.server.service;

import com.ebuspass.server.model.BusPass;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PassPdfService {

    public byte[] buildPassPdf(BusPass pass) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float y = 770;

                cs.beginText();
                cs.setFont(org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA_BOLD, 18);
                cs.newLineAtOffset(50, y);
                cs.showText("E-Bus Pass");
                cs.endText();

                y -= 40;
                y = writeLine(cs, "Name: " + safe(pass.getFname()) + " " + safe(pass.getLname()), y);
                y = writeLine(cs, "Roll No: " + safe(pass.getRollno()), y);
                y = writeLine(cs, "Year: " + safe(pass.getYear()) + " | Branch: " + safe(pass.getBranch()), y);
                y = writeLine(cs, "Phone: " + safe(pass.getPhno()), y);
                y = writeLine(cs, "Address: " + safe(pass.getAddress()), y);
                y = writeLine(cs, "Source: " + safe(pass.getSource()) + " | Destination: " + safe(pass.getDestination()), y);
                y = writeLine(cs, "Pass Type: " + safe(pass.getPassType()), y);
                y = writeLine(cs, "Valid Till: " + safe(pass.getDatevalid()), y);
                y = writeLine(cs, "Status: " + (Boolean.TRUE.equals(pass.getIsAvailable()) ? "APPROVED" : "PENDING"), y);

                // QR at bottom-right
                String qrPayload = "id=" + safe(pass.getId()) + "&rollno=" + safe(pass.getRollno());
                PDImageXObject qr = qrImage(doc, qrPayload, 180, 180);

                cs.drawImage(qr, 370, 80, 160, 160);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    private float writeLine(PDPageContentStream cs, String text, float y) throws IOException {
        cs.beginText();
        cs.setFont(org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(text);
        cs.endText();
        return y - 18;
    }

    private PDImageXObject qrImage(PDDocument doc, String text, int w, int h) throws IOException {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, w, h);
            BufferedImage img = MatrixToImageWriter.toBufferedImage(matrix);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(img, "png", baos);
            return PDImageXObject.createFromByteArray(doc, baos.toByteArray(), "qr.png");
        } catch (WriterException e) {
            throw new IOException(e);
        }
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
