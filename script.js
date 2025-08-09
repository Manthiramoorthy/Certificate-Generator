// script.js
// Main application logic for Certificate Generator

$(document).ready(function () {
    // Application state
    const CertificateApp = {
        participantData: [],
        selectedTemplate: 0,
        authorityConfig: {
            name: 'Dr. Sarah Wilson',
            role: 'Program Director',
            logoDataUrl: 'assets/images/default-logo.jpeg',
            signatureDataUrl: 'assets/images/default-signature.png',
            certTitle: 'Certificate of Appreciation',
            certSubtitle: 'This is proudly presented to',
            certMidline: 'for outstanding achievement in'
        },
        currentStep: 1,
        templates: []
    };

    // Step rendering
    function showStep(step) {
        CertificateApp.currentStep = step;
        $('#app-steps').html(renderStep(step));
        bindStepEvents(step);
    }

    // Step 1: File Upload
    function renderStep1() {
        return `
        <div class="step-indicator">
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary" id="toStep2" disabled>Next: Review Data</button>
            </div>
            <h4>Step 1: Upload CSV File</h4>
            <div class="mb-3">
                <label for="csvFileInput" class="form-label">Upload CSV with participant data</label>
                <input class="form-control" type="file" id="csvFileInput" accept=".csv">
                <div class="form-text">Columns required: name, date_of_event, event_name, event_type</div>
            </div>
            <div id="csvError" class="text-danger mb-2"></div>
        </div>`;
    }

    // Step 2: Data Review
    function renderStep2() {
        let tableRows = CertificateApp.participantData.map((row, i) =>
            `<tr><td>${i + 1}</td><td>${row.name}</td><td>${row.date_of_event}</td><td>${row.event_name}</td><td>${row.event_type}</td></tr>`
        ).join('');
        return `
        <div class="step-indicator">
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary me-2" id="backToStep1">Back</button>
                <button class="btn btn-primary" id="toStep3">Next: Authority Details</button>
            </div>
            <h4>Step 2: Review Participant Data</h4>
            <div class="table-responsive mb-3">
                <table class="table table-bordered table-striped">
                    <thead><tr><th>#</th><th>Name</th><th>Date</th><th>Event</th><th>Type</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        </div>`;
    }

    // Step 3: Template Selection
    function renderStep3() {
        return `
        <div class="step-indicator">
            <h4>Step 3: Configure Authority Details</h4>
            <form id="authorityForm">
                <div class="d-flex justify-content-between mb-3">
                    <button class="btn btn-secondary me-2" id="backToStep2" type="button">Back</button>
                    <button class="btn btn-primary" id="toStep4" type="submit">Next: Select Template</button>
                </div>
                <div class="mb-3">
                    <label class="form-label">Certificate Title</label>
                    <input type="text" class="form-control" id="certTitle" value="${CertificateApp.authorityConfig.certTitle}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Certificate Subtitle</label>
                    <input type="text" class="form-control" id="certSubtitle" value="${CertificateApp.authorityConfig.certSubtitle}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Certificate Midline</label>
                    <input type="text" class="form-control" id="certMidline" value="${CertificateApp.authorityConfig.certMidline}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Authority Name</label>
                    <input type="text" class="form-control" id="authorityName" value="${CertificateApp.authorityConfig.name}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Authority Role</label>
                    <input type="text" class="form-control" id="authorityRole" value="${CertificateApp.authorityConfig.role}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Company Logo</label>
                    <input type="file" class="form-control" id="companyLogoInput" accept="image/*">
                </div>
                <div class="mb-3">
                    <label class="form-label">Authority Signature</label>
                    <input type="file" class="form-control" id="signatureInput" accept="image/*">
                </div>
            </form>
        </div>`;
    }

    // Step 4: Authority Config
    function renderStep4() {
        let cards = CertificateApp.templates.map((tpl, i) =>
            `<div class="col-12 mb-4">
                <div class="card template-card${CertificateApp.selectedTemplate === i ? ' selected' : ''}" data-tpl="${i}">
                    <div class="card-body p-2 d-flex justify-content-center align-items-center" style="background: #f8f9fa;">
                        <div class="certificate-preview">${CertificateManager.renderTemplate(tpl, CertificateApp.participantData[0] || {}, CertificateApp.authorityConfig)}</div>
                    </div>
                    <div class="card-footer text-center">Template ${i + 1}</div>
                </div>
            </div>`
        ).join('');
        return `
        <div class="step-indicator">
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary me-2" id="backToStep3">Back</button>
                <button class="btn btn-primary" id="toStep5">Next: Preview & Download</button>
            </div>
            <h4>Step 4: Select Certificate Template</h4>
            <div class="row">${cards}</div>
        </div>`;
    }

    // Step 5: Preview
    function renderStep5() {
        let participant = CertificateApp.participantData[0] || {};
        let tpl = CertificateApp.templates[CertificateApp.selectedTemplate];
        let certHtml = CertificateManager.renderTemplate(tpl, participant, CertificateApp.authorityConfig);
        return `
        <div class="step-indicator">
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary me-2" id="backToStep4">Back</button>
                <div>
                    <button class="btn btn-success me-2" id="downloadSingle">Download Current Certificate (PDF)</button>
                    <button class="btn btn-primary" id="downloadBulk">Download All as ZIP</button>
                </div>
            </div>
            <h4>Step 5: Preview & Download</h4>
            <div class="certificate-preview mb-3" id="previewCert">${certHtml}</div>
            <div class="mb-3">
                <label>Preview/Download for participant:</label>
                <select class="form-select w-auto d-inline-block" id="previewParticipant">
                    ${CertificateApp.participantData.map((p, i) => `<option value="${i}">${p.name}</option>`).join('')}
                </select>
            </div>
            <div class="progress mb-3" style="display:none;">
                <div class="progress-bar" role="progressbar" style="width: 0%">0%</div>
            </div>
        </div>`;
    }

    // Step renderer
    function renderStep(step) {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            default: return '<div>Unknown step</div>';
        }
    }

    // Bind events for each step
    function bindStepEvents(step) {
        if (step === 1) {
            $('#csvFileInput').on('change', function (e) {
                const file = e.target.files[0];
                if (!file) return;
                CSVParser.parseCSVFile(file, function (data) {
                    CertificateApp.participantData = data;
                    $('#csvError').text('');
                    $('#toStep2').prop('disabled', false);
                }, function (err) {
                    $('#csvError').text(err);
                    $('#toStep2').prop('disabled', true);
                });
            });
            $('#toStep2').on('click', function () {
                if (CertificateApp.participantData.length > 0) showStep(2);
            });
        }
        if (step === 2) {
            $('#backToStep1').on('click', function () { showStep(1); });
            $('#toStep3').on('click', function () { showStep(3); });
        }
        if (step === 3) {
            $('#backToStep2').on('click', function () { showStep(2); });
            $('#authorityForm').on('submit', function (e) {
                e.preventDefault();
                CertificateApp.authorityConfig.certTitle = $('#certTitle').val();
                CertificateApp.authorityConfig.certSubtitle = $('#certSubtitle').val();
                CertificateApp.authorityConfig.certMidline = $('#certMidline').val();
                CertificateApp.authorityConfig.name = $('#authorityName').val();
                CertificateApp.authorityConfig.role = $('#authorityRole').val();
                // Handle logo upload
                const logoFile = $('#companyLogoInput')[0].files[0];
                const sigFile = $('#signatureInput')[0].files[0];
                const handleNext = () => showStep(4);
                if (logoFile) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        CertificateApp.authorityConfig.logoDataUrl = ev.target.result;
                        if (sigFile) {
                            const sigReader = new FileReader();
                            sigReader.onload = function (ev2) {
                                CertificateApp.authorityConfig.signatureDataUrl = ev2.target.result;
                                handleNext();
                            };
                            sigReader.readAsDataURL(sigFile);
                        } else {
                            handleNext();
                        }
                    };
                    reader.readAsDataURL(logoFile);
                } else if (sigFile) {
                    const sigReader = new FileReader();
                    sigReader.onload = function (ev2) {
                        CertificateApp.authorityConfig.signatureDataUrl = ev2.target.result;
                        handleNext();
                    };
                    sigReader.readAsDataURL(sigFile);
                } else {
                    handleNext();
                }
            });
        }
        if (step === 4) {
            $('.template-card').on('click', function () {
                CertificateApp.selectedTemplate = parseInt($(this).data('tpl'));
                showStep(4);
            });
            $('#backToStep3').on('click', function () { showStep(3); });
            $('#toStep5').on('click', function () { showStep(5); });
        }
        if (step === 5) {
            $('#backToStep4').on('click', function () { showStep(4); });
            $('#previewParticipant').on('change', function () {
                const idx = parseInt($(this).val());
                let tpl = CertificateApp.templates[CertificateApp.selectedTemplate];
                let certHtml = CertificateManager.renderTemplate(tpl, CertificateApp.participantData[idx], CertificateApp.authorityConfig);
                $('#previewCert').html(certHtml);
            });
            $('#downloadSingle').on('click', function () {
                const idx = parseInt($('#previewParticipant').val());
                let tpl = CertificateApp.templates[CertificateApp.selectedTemplate];
                let certHtml = CertificateManager.renderTemplate(tpl, CertificateApp.participantData[idx], CertificateApp.authorityConfig);
                // Create a hidden div for rendering
                let $div = $('<div>').css({ position: 'absolute', left: '-9999px', top: '-9999px' }).html(certHtml).appendTo('body');
                PDFGenerator.generatePDF($div, `${CertificateApp.participantData[idx].name}_certificate.pdf`, function () {
                    $div.remove();
                });
            });
            $('#downloadBulk').on('click', async function () {
                const $progress = $('.progress');
                const $bar = $('.progress-bar');
                $progress.show();
                $bar.css('width', '0%').text('0%');
                let certificates = CertificateApp.participantData.map((p, i) => {
                    let tpl = CertificateApp.templates[CertificateApp.selectedTemplate];
                    let certHtml = CertificateManager.renderTemplate(tpl, p, CertificateApp.authorityConfig);
                    // Create a hidden div for rendering
                    let $div = $('<div>').css({ position: 'absolute', left: '-9999px', top: '-9999px' }).html(certHtml).appendTo('body');
                    return { html: $div, fileName: `${p.name}_certificate.pdf`, $div };
                });
                await PDFGenerator.generateBulkPDFs(certificates, function (done, total) {
                    let percent = Math.round((done / total) * 100);
                    $bar.css('width', percent + '%').text(percent + '%');
                }, function () {
                    certificates.forEach(c => c.$div.remove());
                    $progress.hide();
                });
            });
        }
    }

    // Load templates and start app
    CertificateManager.loadTemplates([
        'templates/template1.html',
        'templates/template2.html',
        'templates/template3.html',
        'templates/template4.html',
        'templates/template5.html',
        'templates/template6.html'
    ], function (templates) {
        CertificateApp.templates = templates;
        showStep(1);
    });
});
