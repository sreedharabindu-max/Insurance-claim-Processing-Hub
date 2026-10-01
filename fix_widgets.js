const fs = require('fs');
const path = require('path');
const submitPath = 'E:\\\\Codeforces\\\\Insurance Claim\\\\1be8401bb15303107f44639b25435ab1\\\\update\\\\sp_widget_e026313c802b03107f44e29321b0a2c6.xml';
let submitContent = fs.readFileSync(submitPath, 'utf8');

// 1. Update HTML Template: Replace input with select
submitContent = submitContent.replace(
    /<input type="text" ng-model="c.form.policy_number" class="form-control" placeholder="Enter Policy Number">/,
    \<select class="form-control" ng-model="c.form.policy_number" ng-options="pol.number as pol.number for pol in c.data.policies">
        <option value="" disabled selected>Select a Policy</option>
    </select>\
);

// 2. Update Server Script: Add initial load logic for policies
submitContent = submitContent.replace(
    /if \(!input \|\| input.action != "submit_claim"\) \{\s*return;\s*\}/,
    \if (!input || input.action != "submit_claim") {
        data.policies = [];
        var userEmail = gs.getUser().getEmail();
        var ph = new GlideRecordSecure('x_snc_insurance_0_policyholder');
        ph.addQuery('email', userEmail);
        ph.query();
        if (ph.next()) {
            var pol = new GlideRecordSecure('x_snc_insurance_0_policy');
            pol.addQuery('policyholder', ph.getUniqueValue());
            pol.query();
            while(pol.next()){
                data.policies.push({
                    sys_id: pol.getUniqueValue(),
                    number: pol.getValue('policy_number')
                });
            }
        }
        return;
    }\
);

fs.writeFileSync(submitPath, submitContent);

// 3. Update Login Widget CSS and HTML to fix broken styles
const loginPath = 'E:\\\\Codeforces\\\\Insurance Claim\\\\1be8401bb15303107f44639b25435ab1\\\\update\\\\sp_widget_a45026e851ef03107f444ed624f3c9f3.xml';
let loginContent = fs.readFileSync(loginPath, 'utf8');

// The login CSS is likely failing because of weird characters or missing bootstrap overrides.
// We'll replace the CSS block entirely.
const newCss = \
.ich-login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #edf6ff 0%, #f8fbff 50%, #edf3ff 100%); font-family: 'Segoe UI', Tahoma, sans-serif; }
.ich-login-card { width: 100%; max-width: 440px; padding: 40px; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative; z-index: 10; border: 1px solid #eef2f6; }
.ich-brand { text-align: center; margin-bottom: 30px; }
.ich-logo { width: 60px; height: 60px; background: #1769d1; color: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(23,105,209,0.3); }
.ich-brand h1 { color: #12305b; font-size: 24px; font-weight: 700; margin: 0 0 5px; }
.ich-brand p { color: #687386; font-size: 14px; margin: 0; }
.mode-btn { width: 100%; display: flex; align-items: center; padding: 15px 20px; margin-bottom: 15px; border: 2px solid #e5ebf3 !important; border-radius: 10px !important; background: #fff !important; cursor: pointer; text-align: left; transition: all 0.2s; outline: none; box-shadow: none !important; }
.mode-btn:hover { border-color: #1769d1 !important; background: #f8fbff !important; }
.mode-icon { font-size: 24px; color: #1769d1; margin-right: 15px; width: 30px; text-align: center; }
.mode-text strong { display: block; color: #12305b; font-size: 15px; margin-bottom: 3px; }
.mode-text span { color: #687386; font-size: 12px; }
.login-field { margin-bottom: 20px; text-align: left; }
.login-field label { display: block; color: #12305b; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.login-field input { width: 100%; padding: 12px 15px !important; border: 1px solid #d1d9e6 !important; border-radius: 8px !important; font-size: 14px !important; background: #fbfdff !important; box-sizing: border-box !important; height: auto !important; }
.login-field input:focus { border-color: #1769d1 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(23,105,209,0.1) !important; }
.login-submit { width: 100%; padding: 14px; background: #1769d1 !important; color: #fff !important; border: none !important; border-radius: 8px !important; font-size: 15px !important; font-weight: 600 !important; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
.login-submit:hover { background: #1254a8 !important; }
\;
loginContent = loginContent.replace(/<css>.*?<\/css>/s, '<css><![CDATA[' + newCss + ']]></css>');

// Also update the icons in HTML which seem to have weird characters (dY>?)
loginContent = loginContent.replace(/<div class="ich-logo">.*?<\/div>/, '<div class="ich-logo"><i class="fa fa-shield"></i></div>');
loginContent = loginContent.replace(/<div class="mode-icon">.*?<\/div>/g, '<div class="mode-icon"><i class="fa fa-user"></i></div>');
// Fix the second icon to be user-secret for admin
loginContent = loginContent.replace(/(<button class="mode-btn admin-btn".*?)<i class="fa fa-user"><\/i>/s, '<i class="fa fa-lock"></i>');

fs.writeFileSync(loginPath, loginContent);
console.log('Fixed submit claim and login widgets.');
