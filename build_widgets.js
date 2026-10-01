const fs = require('fs');
const path = require('path');
const dir = 'E:\\\\Codeforces\\\\Insurance Claim\\\\1be8401bb15303107f44639b25435ab1\\\\update';

const profileWidget = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_widget">
<sp_widget action="INSERT_OR_UPDATE">
    <category>custom</category>
    <client_script><![CDATA[api.controller=function() { var c = this; };]]></client_script>
    <controller_as>c</controller_as>
    <css><![CDATA[
        .profile-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;}
        .profile-header { display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
        .profile-avatar { width: 60px; height: 60px; background: #0b63ce; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-right: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item label { color: #687386; font-size: 12px; display: block; margin-bottom: 5px; }
        .info-item div { font-weight: 600; color: #172033; }
    ]]></css>
    <data_table>sp_instance</data_table>
    <id>claim_profile_widget</id>
    <name>Claim Profile Widget</name>
    <script><![CDATA[(function() {
        data.user = { name: gs.getUserDisplayName(), email: gs.getUser().getEmail() };
        var ph = new GlideRecordSecure('x_snc_insurance_0_policyholder');
        ph.addQuery('email', data.user.email);
        ph.query();
        if (ph.next()) {
            data.ph = {
                phone: ph.getValue('mobile_number') || 'N/A',
                address: ph.getValue('address') || 'N/A',
                status: ph.getValue('status') || 'Active'
            };
            var pol = new GlideRecordSecure('x_snc_insurance_0_policy');
            pol.addQuery('policyholder', ph.getUniqueValue());
            pol.query();
            data.policies = [];
            while(pol.next()){
                data.policies.push({
                    number: pol.getValue('policy_number'),
                    type: pol.getDisplayValue('policy_type'),
                    coverage: pol.getDisplayValue('coverage_amount'),
                    start: pol.getValue('start_date'),
                    end: pol.getValue('end_date')
                });
            }
        }
    })();]]></script>
    <sys_class_name>sp_widget</sys_class_name>
    <sys_id>widget_profile_12345</sys_id>
    <template><![CDATA[
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar"><i class="fa fa-user"></i></div>
                <div><h2>{{c.data.user.name}}</h2><p>{{c.data.user.email}}</p></div>
            </div>
            <div class="info-grid" ng-if="c.data.ph">
                <div class="info-item"><label>Phone</label><div>{{c.data.ph.phone}}</div></div>
                <div class="info-item"><label>Address</label><div>{{c.data.ph.address}}</div></div>
                <div class="info-item"><label>Account Status</label><div>{{c.data.ph.status}}</div></div>
            </div>
        </div>
        <div class="profile-card" ng-repeat="pol in c.data.policies">
            <h3>Policy Information</h3>
            <div class="info-grid">
                <div class="info-item"><label>Policy Number</label><div>{{pol.number}}</div></div>
                <div class="info-item"><label>Insurance Type</label><div>{{pol.type}}</div></div>
                <div class="info-item"><label>Coverage Amount</label><div>{{pol.coverage}}</div></div>
                <div class="info-item"><label>Start Date</label><div>{{pol.start}}</div></div>
                <div class="info-item"><label>End Date</label><div>{{pol.end}}</div></div>
            </div>
        </div>
    ]]></template>
</sp_widget>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_widget_widget_profile_12345.xml'), profileWidget);

const notifWidget = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_widget">
<sp_widget action="INSERT_OR_UPDATE">
    <category>custom</category>
    <client_script><![CDATA[api.controller=function() { var c = this; };]]></client_script>
    <controller_as>c</controller_as>
    <css><![CDATA[
        .notif-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .notif-item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
        .notif-item:last-child { border-bottom: none; }
        .notif-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #fff; }
        .icon-success { background: #22c55e; }
        .icon-info { background: #3b82f6; }
        .notif-content { flex: 1; }
        .notif-time { color: #9ca3af; font-size: 12px; }
    ]]></css>
    <data_table>sp_instance</data_table>
    <id>claim_notif_widget</id>
    <name>Claim Notifications Widget</name>
    <script><![CDATA[(function() {
        data.notifications = [];
        var userEmail = gs.getUser().getEmail();
        var ph = new GlideRecordSecure('x_snc_insurance_0_policyholder');
        ph.addQuery('email', userEmail);
        ph.query();
        if(ph.next()) {
            var claims = new GlideRecordSecure('x_snc_insurance_0_claim');
            claims.addQuery('policyholder', ph.getUniqueValue());
            claims.orderByDesc('sys_updated_on');
            claims.query();
            while(claims.next()) {
                var num = claims.getValue('claim_number');
                var status = claims.getValue('status');
                data.notifications.push({ msg: 'Claim ' + num + ' submitted successfully.', time: claims.getValue('sys_created_on'), icon: 'icon-success', type: 'fa-check' });
                if(status == 'Approved') {
                    data.notifications.push({ msg: 'Claim ' + num + ' approved.', time: claims.getValue('sys_updated_on'), icon: 'icon-success', type: 'fa-check' });
                }
                if(claims.getValue('payment_status') == 'Paid') {
                    data.notifications.push({ msg: 'Payment processed successfully for ' + num + '.', time: claims.getValue('sys_updated_on'), icon: 'icon-success', type: 'fa-check' });
                }
            }
        }
    })();]]></script>
    <sys_class_name>sp_widget</sys_class_name>
    <sys_id>widget_notif_12345</sys_id>
    <template><![CDATA[
        <div class="notif-card">
            <h2>Notifications</h2>
            <div class="notif-item" ng-repeat="n in c.data.notifications | orderBy:'-time'">
                <div class="notif-icon" ng-class="n.icon"><i class="fa {{n.type}}"></i></div>
                <div class="notif-content">
                    <div>{{n.msg}}</div>
                    <div class="notif-time">{{n.time}}</div>
                </div>
            </div>
            <div ng-if="c.data.notifications.length == 0">No new notifications.</div>
        </div>
    ]]></template>
</sp_widget>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_widget_widget_notif_12345.xml'), notifWidget);

const summaryWidget = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_widget">
<sp_widget action="INSERT_OR_UPDATE">
    <category>custom</category>
    <client_script><![CDATA[function(\, \){ var c = this; c.print = function(){ \.print(); }; };]]></client_script>
    <controller_as>c</controller_as>
    <css><![CDATA[
        .summary-card { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .summary-section { margin-bottom: 25px; }
        .summary-section h3 { border-bottom: 2px solid #0b63ce; padding-bottom: 5px; color: #0b63ce; }
        .row-data { display: flex; margin-bottom: 10px; }
        .row-data strong { width: 200px; color: #172033; }
        @media print { body * { visibility: hidden; } .summary-card, .summary-card * { visibility: visible; } .summary-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; } .btn-print { display: none; } }
    ]]></css>
    <data_table>sp_instance</data_table>
    <id>claim_summary_widget</id>
    <name>Claim Summary Widget</name>
    <script><![CDATA[(function() {
        var claimId = \.getParameter('sys_id');
        if(!claimId) { data.error = "No claim selected."; return; }
        var claim = new GlideRecordSecure('x_snc_insurance_0_claim');
        if(claim.get(claimId)) {
            var userEmail = gs.getUser().getEmail();
            var ph = new GlideRecordSecure('x_snc_insurance_0_policyholder');
            ph.addQuery('email', userEmail);
            ph.query();
            var phSysId = ph.next() ? ph.getUniqueValue() : 'invalid';
            if(claim.getValue('policyholder') != phSysId) { data.error = "Access denied."; return; }
            
            data.claim = {
                number: claim.getValue('claim_number'),
                status: claim.getValue('status'),
                type: claim.getValue('claim_type'),
                amount: claim.getDisplayValue('claim_amount'),
                desc: claim.getValue('incident_description'),
                fraud_risk: claim.getValue('fraud_risk'),
                settlement: claim.getDisplayValue('final_payout') || claim.getDisplayValue('recommended_payout'),
                payment: claim.getValue('payment_status')
            };
        } else { data.error = "Claim not found."; }
    })();]]></script>
    <sys_class_name>sp_widget</sys_class_name>
    <sys_id>widget_summary_12345</sys_id>
    <template><![CDATA[
        <div class="summary-card" ng-if="!c.data.error">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Claim Summary: {{c.data.claim.number}}</h2>
                <button class="btn btn-primary btn-print" ng-click="c.print()"><i class="fa fa-download"></i> Download PDF</button>
            </div>
            
            <div class="summary-section">
                <h3>Claim Details</h3>
                <div class="row-data"><strong>Type:</strong> <span>{{c.data.claim.type}}</span></div>
                <div class="row-data"><strong>Status:</strong> <span>{{c.data.claim.status}}</span></div>
                <div class="row-data"><strong>Requested Amount:</strong> <span>{{c.data.claim.amount}}</span></div>
                <div class="row-data"><strong>Description:</strong> <span>{{c.data.claim.desc}}</span></div>
            </div>
            <div class="summary-section">
                <h3>Assessment & Settlement</h3>
                <div class="row-data"><strong>Fraud Risk:</strong> <span>{{c.data.claim.fraud_risk || 'Low'}}</span></div>
                <div class="row-data"><strong>Approved Payout:</strong> <span>{{c.data.claim.settlement || 'Pending'}}</span></div>
                <div class="row-data"><strong>Payment Status:</strong> <span>{{c.data.claim.payment || 'Pending'}}</span></div>
            </div>
        </div>
        <div ng-if="c.data.error" class="alert alert-danger">{{c.data.error}}</div>
    ]]></template>
</sp_widget>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_widget_widget_summary_12345.xml'), summaryWidget);

const instProfile = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_instance">
<sp_instance action="INSERT_OR_UPDATE">
    <sp_page display_value="claim_profile">cec61a4b16ac4a6e9cc4736a0ce0f5aa</sp_page>
    <sp_widget display_value="claim_profile_widget">widget_profile_12345</sp_widget>
    <sys_class_name>sp_instance</sys_class_name>
    <sys_id>instance_profile_12345</sys_id>
</sp_instance>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_instance_instance_profile_12345.xml'), instProfile);

const instNotif = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_instance">
<sp_instance action="INSERT_OR_UPDATE">
    <sp_page display_value="claim_notifications">8c85aec02cdf42e8b8265e925c1a5a61</sp_page>
    <sp_widget display_value="claim_notif_widget">widget_notif_12345</sp_widget>
    <sys_class_name>sp_instance</sys_class_name>
    <sys_id>instance_notif_12345</sys_id>
</sp_instance>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_instance_instance_notif_12345.xml'), instNotif);

const instSummary = \<?xml version="1.0" encoding="UTF-8"?><record_update table="sp_instance">
<sp_instance action="INSERT_OR_UPDATE">
    <sp_page display_value="claim_summary">97d932b107324587982bbf30141a435b</sp_page>
    <sp_widget display_value="claim_summary_widget">widget_summary_12345</sp_widget>
    <sys_class_name>sp_instance</sys_class_name>
    <sys_id>instance_summary_12345</sys_id>
</sp_instance>
</record_update>\;

fs.writeFileSync(path.join(dir, 'sp_instance_instance_summary_12345.xml'), instSummary);

