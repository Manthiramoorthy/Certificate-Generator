# Certificate Generator

This project allows you to generate beautiful, customizable certificates using HTML templates and CSV data. You can preview, customize, and export certificates as PDF files.

## Features

- Multiple modern certificate templates
- Customizable fields (name, event, date, etc.)
- Supports logo, signature, and partner images
- Bulk certificate generation from CSV
- PDF export

---

## How to Generate Certificates

### 1. **Clone or Download the Project**

- Download the ZIP or clone the repository to your computer.

### 2. **Open the Project**

- Open the folder in VS Code or your preferred editor.

### 3. **Prepare Your Data**

- Edit the sample CSV file in `assets/samples/file.csv`.
- Each row should contain the participant's details (name, event, date, etc.).

### 4. **Choose a Template**

- Templates are located in the `templates/` folder (template1.html, template2.html, ...).
- Preview templates by running the project and selecting from the UI.

### 5. **Add Your Logos and Signatures**

- Place your logo, partner logo, and signature images in the `assets/images/` folder.
- Update the image paths in the UI or CSV as needed.

### 6. **Run the Certificate Generator**

- Open `index.html` in your web browser (Chrome recommended).
- Use the UI to:

  1. **Upload your CSV file:**

  - Click the "Upload CSV" or similar button in the web interface.
  - Select your CSV file (e.g., `file.csv` from `assets/samples/`).
  - The app will read the file and display a list of participants.

  2. **Select a template:**

  - Use the template dropdown or selection area to choose your preferred certificate design.
  - You can preview each template instantly as you switch.

  3. **Preview certificates:**

  - After uploading the CSV and selecting a template, the certificate preview will update automatically.
  - You can scroll through each participant’s certificate using navigation buttons or arrows (if available).

  4. **Edit details if needed:**

  - If you spot any errors or want to personalize a certificate, use the provided fields or inline editors to update names, event titles, or other details.
  - Changes will reflect in the preview before exporting.

### 7. **Export as PDF**

- After previewing, click the `Export as PDF` button to download the certificate(s).
- For bulk export, the app will generate a PDF for each row in your CSV.

---

## Troubleshooting

- If borders or designs are missing in the PDF, use Chrome for best compatibility.
- Make sure your images are in supported formats (PNG, JPEG).
- For custom templates, use only PDF-friendly CSS (avoid animations, clip-path, etc.).

---

## Folder Structure

```
index.html
script.js
style.css
assets/
  images/
  samples/
js/
  certificateManager.js
  csvParser.js
  pdfGenerator.js
templates/
  template1.html ...
```

---

## Credits

- Developed by Manthiramoorthy
- Open source, MIT License
