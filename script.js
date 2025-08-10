// script.js
// Main application logic for Certificate Generator

$(document).ready(function () {
    // Application state
    const CertificateApp = {
        participantData: [],
        selectedTemplate: 0,
        authorityConfig: {
            name: 'Head',
            role: 'InspireX Innovation Unit',
            companyName: 'Xyzon Innovations Private Limited',
            logoDataUrl: 'assets/images/default-logo.jpeg',
            partnerLogoDataUrl: 'assets/images/default-partner.png',
            signatureDataUrl: 'assets/images/default-signature.png',
            certTitle: 'Certificate of Appreciation',
            certSubtitle: 'This is proudly presented to',
            certMidline: 'has successfully participated in the webinar on'
        },
        currentStep: 1,
        templates: []
    };

    // Step rendering
    function showStep(step) {
        CertificateApp.currentStep = step;
        // Stepper with active highlight
        const stepLabels = [
            { icon: 'bi-upload', label: 'Upload' },
            { icon: 'bi-table', label: 'Review' },
            { icon: 'bi-person-badge', label: 'Authority' },
            { icon: 'bi-award', label: 'Template' },
            { icon: 'bi-download', label: 'Download' }
        ];
        let stepper = '<div class="mb-4">';
        stepper += '<div class="progress" style="height: 8px;">';
        stepper += `<div class="progress-bar bg-primary" role="progressbar" style="width: ${(step / 5) * 100}%"></div>`;
        stepper += '</div>';
        stepper += '<div class="d-flex justify-content-between mt-2 mb-3">';
        stepLabels.forEach((s, i) => {
            stepper += `<span class="${step === i + 1 ? 'fw-bold text-primary' : 'text-muted'}" style="transition:color .3s"><i class="bi ${s.icon}"></i> ${s.label}</span>`;
        });
        stepper += '</div></div>';
        // Animate card transitions
        $('#app-steps').fadeOut(120, function () {
            $(this).html(stepper + renderStep(step)).fadeIn(220);
            bindStepEvents(step);
        });
    }

    // Step 1: File Upload
    function renderStep1() {
        return `
                <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
                    <div class="card-body bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h4 class="mb-0"><i class="bi bi-upload me-2 text-primary"></i>Step 1: Upload CSV File</h4>
                            <button class="btn btn-primary btn-animated" id="toStep2" disabled data-bs-toggle="tooltip" data-bs-placement="left" title="Upload a CSV to continue">Next: Review Data <i class="bi bi-arrow-right"></i></button>
                        </div>
                        <div class="mb-3">
                            <label for="csvFileInput" class="form-label">Upload CSV with participant data</label>
                            <input class="form-control" type="file" id="csvFileInput" accept=".csv" data-bs-toggle="tooltip" data-bs-placement="top" title="CSV must include: name, date_of_event, event_name, event_type">
                            <div class="form-text">Columns required: <b>name, date_of_event, event_name, event_type</b></div>
                        </div>
                        <div id="csvError" class="text-danger mb-2"></div>
                    </div>
                </div>`;
    }

    // Step 2: Data Review
    function renderStep2() {
        let tableRows = CertificateApp.participantData.map((row, i) =>
            `<tr><td>${i + 1}</td><td>${row.name}</td><td>${row.date_of_event}</td><td>${row.event_name}</td><td>${row.event_type}</td></tr>`
        ).join('');
        return `
                <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
                    <div class="card-body bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button class="btn btn-secondary me-2 btn-animated" id="backToStep1"><i class="bi bi-arrow-left"></i> Back</button>
                            <h4 class="mb-0"><i class="bi bi-table me-2 text-primary"></i>Step 2: Review Participant Data</h4>
                            <button class="btn btn-primary btn-animated" id="toStep3" data-bs-toggle="tooltip" data-bs-placement="left" title="Continue to authority details">Next: Authority Details <i class="bi bi-arrow-right"></i></button>
                        </div>
                        <div class="table-responsive mb-3">
                            <table class="table table-bordered table-striped">
                                <thead class="table-primary"><tr><th>#</th><th>Name</th><th>Date</th><th>Event</th><th>Type</th></tr></thead>
                                <tbody>${tableRows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
    }

    // Step 3: Template Selection
    function renderStep3() {
        return `
                <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
                    <div class="card-body bg-light">
                        <form id="authorityForm">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <button class="btn btn-secondary me-2 btn-animated" id="backToStep2" type="button"><i class="bi bi-arrow-left"></i> Back</button>
                                <h4 class="mb-0"><i class="bi bi-person-badge me-2 text-primary"></i>Step 3: Configure Authority Details</h4>
                                <button class="btn btn-primary btn-animated" id="toStep4" type="submit" data-bs-toggle="tooltip" data-bs-placement="left" title="Continue to template selection">Next: Select Template <i class="bi bi-arrow-right"></i></button>
                            </div>
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label">Certificate Title</label>
                                    <input type="text" class="form-control" id="certTitle" value="${CertificateApp.authorityConfig.certTitle}" data-bs-toggle="tooltip" title="Main heading for the certificate">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Certificate Subtitle</label>
                                    <input type="text" class="form-control" id="certSubtitle" value="${CertificateApp.authorityConfig.certSubtitle}" data-bs-toggle="tooltip" title="Subtitle below the main title">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Certificate Midline</label>
                                    <input type="text" class="form-control" id="certMidline" value="${CertificateApp.authorityConfig.certMidline}" data-bs-toggle="tooltip" title="Line between name and event">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Authority Name</label>
                                    <input type="text" class="form-control" id="authorityName" value="${CertificateApp.authorityConfig.name}" data-bs-toggle="tooltip" title="Name of the signing authority">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Authority Role</label>
                                    <input type="text" class="form-control" id="authorityRole" value="${CertificateApp.authorityConfig.role}" data-bs-toggle="tooltip" title="Role of the signing authority">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Company Logo</label>
                                    <input type="file" class="form-control" id="companyLogoInput" accept="image/*" data-bs-toggle="tooltip" title="Upload your organization logo">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Partner Logo</label>
                                    <input type="file" class="form-control" id="partnerLogoInput" accept="image/*" data-bs-toggle="tooltip" title="Upload registration partner logo">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Authority Signature</label>
                                    <input type="file" class="form-control" id="signatureInput" accept="image/*" data-bs-toggle="tooltip" title="Upload signature image">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>`;
    }

    // Step 4: Authority Config
    function renderStep4() {
        let cards = CertificateApp.templates.map((tpl, i) =>
            `<div class="col-12 mb-4">
                                <div class="card template-card${CertificateApp.selectedTemplate === i ? ' border-primary shadow-lg' : ''}" data-tpl="${i}" style="cursor:pointer;transition:box-shadow .2s;">
                                        <div class="card-body p-2 d-flex justify-content-center align-items-center bg-white animate__animated animate__fadeIn" style="min-height:220px;">
                                                <div class="certificate-preview">${CertificateManager.renderTemplate(tpl, CertificateApp.participantData[0] || {}, CertificateApp.authorityConfig)}</div>
                                        </div>
                                        <div class="card-footer text-center fw-bold">Template ${i + 1} ${CertificateApp.selectedTemplate === i ? '<i class=\'bi bi-check-circle-fill text-success\'></i>' : ''}</div>
                                </div>
                        </div>`
        ).join('');
        return `
                <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
                    <div class="card-body bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button class="btn btn-secondary me-2 btn-animated" id="backToStep3"><i class="bi bi-arrow-left"></i> Back</button>
                            <h4 class="mb-0"><i class="bi bi-award me-2 text-primary"></i>Step 4: Select Certificate Template</h4>
                            <button class="btn btn-primary btn-animated" id="toStep5">Next: Preview & Download <i class="bi bi-arrow-right"></i></button>
                        </div>
                        <div class="row">${cards}</div>
                    </div>
                </div>`;
    }

    // Step 5: Preview
    function renderStep5() {
        let participant = CertificateApp.participantData[0] || {};
        let tpl = CertificateApp.templates[CertificateApp.selectedTemplate];
        let certHtml = CertificateManager.renderTemplate(tpl, participant, CertificateApp.authorityConfig);
        return `
                <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeIn">
                    <div class="card-body bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button class="btn btn-secondary me-2 btn-animated" id="backToStep4"><i class="bi bi-arrow-left"></i> Back</button>
                            <h4 class="mb-0"><i class="bi bi-download me-2 text-primary"></i>Step 5: Preview & Download</h4>
                            <div>
                                <button class="btn btn-success me-2 btn-animated" id="downloadSingle"><i class="bi bi-file-earmark-pdf"></i> Download Current Certificate (PDF)</button>
                                <button class="btn btn-primary btn-animated" id="downloadBulk"><i class="bi bi-archive"></i> Download All as ZIP</button>
                            </div>
                        </div>
                        <div class="certificate-preview" id="previewCert">${certHtml}</div>
                        <div class="mb-3">
                            <label>Preview/Download for participant:</label>
                            <select class="form-select w-auto d-inline-block" id="previewParticipant">
                                ${CertificateApp.participantData.map((p, i) => `<option value="${i}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="progress mb-3" style="display:none;">
                            <div class="progress-bar" role="progressbar" style="width: 0%">0%</div>
                        </div>
                    </div>
                </div>`;
        // Enable Bootstrap tooltips and button hover animation
        $(document).on('mouseenter', '.btn-animated', function () {
            $(this).addClass('animate__animated animate__pulse');
        }).on('mouseleave', '.btn-animated', function () {
            $(this).removeClass('animate__animated animate__pulse');
        });
        $(function () {
            if (window.bootstrap && bootstrap.Tooltip) {
                $('[data-bs-toggle="tooltip"]').tooltip({ trigger: 'hover' });
            }
        });
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
                const partnerLogoFile = $('#partnerLogoInput')[0].files[0];
                const sigFile = $('#signatureInput')[0].files[0];
                const handleNext = () => showStep(4);

                let pendingUploads = 0;
                let completedUploads = 0;

                const checkComplete = () => {
                    completedUploads++;
                    if (completedUploads === pendingUploads) {
                        handleNext();
                    }
                };

                if (logoFile) pendingUploads++;
                if (partnerLogoFile) pendingUploads++;
                if (sigFile) pendingUploads++;

                if (pendingUploads === 0) {
                    handleNext();
                    return;
                }

                if (logoFile) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        CertificateApp.authorityConfig.logoDataUrl = ev.target.result;
                        checkComplete();
                    };
                    reader.readAsDataURL(logoFile);
                }

                if (partnerLogoFile) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        CertificateApp.authorityConfig.partnerLogoDataUrl = ev.target.result;
                        checkComplete();
                    };
                    reader.readAsDataURL(partnerLogoFile);
                }

                if (sigFile) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        CertificateApp.authorityConfig.signatureDataUrl = ev.target.result;
                        checkComplete();
                    };
                    reader.readAsDataURL(sigFile);
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
        'templates/template6.html',
    ], function (templates) {
        CertificateApp.templates = templates;
        showStep(1);
    });
});
