const fs = require('fs');
const spaPath = 'E:\\\\Codeforces\\\\Insurance Claim\\\\1be8401bb15303107f44639b25435ab1\\\\update\\\\sp_widget_widget000000000000000000000admin99.xml';
let spaContent = fs.readFileSync(spaPath, 'utf8');

// Update routing
spaContent = spaContent.replace(
    /c\.view = \\.search\(\)\.id \|\| 'admin_dashboard';/,
    "c.view = \.search().view || \.search().id || 'admin_dashboard';"
);

// Update navigate
spaContent = spaContent.replace(
    /c\.navigate = function\(id, sys_id\) \{[\s\S]*?\};/,
    \c.navigate = function(view_id, sys_id) { var params = { id: \.search().id || "admin_dashboard", view: view_id }; if (sys_id) params.sys_id = sys_id; \.search(params); };\
);

// Add Reports view
const reportsHtml = \
        <div ng-if="c.view == 'admin_reports'">
            <div class="card">
                <h3>Reports &amp; Analytics</h3>
                <p>Welcome to the analytics portal. Future dashboard charts will render here.</p>
                <div style="display:flex; gap: 20px; margin-top:20px;">
                    <div style="flex:1; background:#f8fbff; border:1px solid #eef2f6; border-radius:8px; padding:20px; text-align:center;">
                        <h4>Claims by Status</h4>
                        <div style="height:150px; display:flex; align-items:flex-end; justify-content:center; gap:20px; margin-top:20px;">
                            <div style="width:40px; background:#f59e0b; height: {{ (c.data.stats.pending / c.data.stats.total) * 100 }}%;"></div>
                            <div style="width:40px; background:#10b981; height: {{ (c.data.stats.approved / c.data.stats.total) * 100 }}%;"></div>
                            <div style="width:40px; background:#ef4444; height: {{ (c.data.stats.rejected / c.data.stats.total) * 100 }}%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
</div>
]]></template>\;

// Safely append before the final closing tags
spaContent = spaContent.replace(/\s*<\/div>\s*<\/div>\s*<\/div>\s*\]\]><\/template>/, reportsHtml);

fs.writeFileSync(spaPath, spaContent);
console.log('SPA Admin updated.');
