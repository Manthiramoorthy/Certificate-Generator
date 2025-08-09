// pdfGenerator.js
// Handles HTML to PDF conversion and ZIP packaging using jsPDF, html2canvas, JSZip, and FileSaver.js

const PDFGenerator = {
    generatePDF: async function (certificateHtml, fileName, callback) {
        // Convert HTML to canvas, then to PDF
        const element = $(certificateHtml)[0];
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save(fileName);
        if (callback) callback();
    },
    generateBulkPDFs: async function (certificates, onProgress, onComplete) {
        const zip = new JSZip();
        let count = 0;
        for (const cert of certificates) {
            const element = $(cert.html)[0];
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
            const pdfBlob = pdf.output('blob');
            zip.file(cert.fileName, pdfBlob);
            count++;
            if (onProgress) onProgress(count, certificates.length);
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, 'certificates.zip');
            if (onComplete) onComplete();
        });
    }
};
