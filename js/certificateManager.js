// certificateManager.js
// Handles certificate template loading, placeholder replacement, and authority config

const CertificateManager = {
    templates: [],
    loadTemplates: function (templatePaths, onLoaded) {
        let loaded = 0;
        this.templates = [];
        templatePaths.forEach((path, idx) => {
            $.get(path, function (data) {
                CertificateManager.templates[idx] = data;
                loaded++;
                if (loaded === templatePaths.length) {
                    onLoaded(CertificateManager.templates);
                }
            }).fail(function () {
                CertificateManager.templates[idx] = '<div class="text-danger">Failed to load template</div>';
                loaded++;
                if (loaded === templatePaths.length) {
                    onLoaded(CertificateManager.templates);
                }
            });
        });
    },
    renderTemplate: function (templateHtml, data, authority) {
        let html = templateHtml;
        // Replace placeholders
        html = html.replace(/\{\{cert_title\}\}/g, authority.certTitle || 'Certificate of Appreciation');
        html = html.replace(/\{\{cert_subtitle\}\}/g, authority.certSubtitle || 'This is proudly presented to');
        html = html.replace(/\{\{cert_midline\}\}/g, authority.certMidline || 'for outstanding achievement in');
        html = html.replace(/\{\{company_name\}\}/g, authority.companyName || 'Xyzon Innovations Private Limited');
        html = html.replace(/\{\{participant_name\}\}/g, data.name || 'John Doe');
        html = html.replace(/\{\{event_name\}\}/g, data.event_name || 'Sample Training Program');
        html = html.replace(/\{\{event_date\}\}/g, data.date_of_event || 'March 15, 2024');
        html = html.replace(/\{\{event_type\}\}/g, data.event_type || 'Workshop');
        html = html.replace(/\{\{authority_name\}\}/g, authority.name || 'Dr. Sarah Wilson');
        html = html.replace(/\{\{authority_role\}\}/g, authority.role || 'Program Director');
        html = html.replace(/\{\{company_logo\}\}/g, authority.logoDataUrl || 'assets/images/default-logo.png');
        html = html.replace(/\{\{partner_logo\}\}/g, authority.partnerLogoDataUrl || authority.partnerLogoDataUrl || 'assets/images/default-partner.png');
        html = html.replace(/\{\{authority_signature\}\}/g, authority.signatureDataUrl || 'assets/images/default-signature.png');
        return html;
    }
};
