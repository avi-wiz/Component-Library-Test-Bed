import streamlit as st
import streamlit.components.v1 as components
import os

st.set_page_config(
    page_title="WizCommerce · Component Lab",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# st.markdown("""
# <style>
#   #MainMenu, header, footer { visibility: hidden; }
#   .block-container { padding: 0 !important; max-width: 100% !important; }
#   iframe { border: none; }
# </style>
# """, unsafe_allow_html=True)

BASE = os.path.dirname(os.path.abspath(__file__))

def _read(*names):
    return "\n".join(open(os.path.join(BASE, n)).read() for n in names)

WIZARD_JS = _read("js1.js", "js_schemas.js", "js2.js", "js3.js", "js4.js")

CSS = open(os.path.join(BASE, "wizard.css")).read()

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js" crossorigin="anonymous" onload="console.log('React OK')" onerror="window.scriptErr='React'"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous" onload="console.log('ReactDOM OK')" onerror="window.scriptErr='ReactDOM'"></script>
<script src="https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.12.7/Recharts.min.js" crossorigin="anonymous" onload="console.log('Recharts OK')" onerror="window.scriptErr='Recharts'"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js" crossorigin="anonymous" onload="console.log('Papa OK')" onerror="window.scriptErr='Papa'"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js" crossorigin="anonymous" onload="console.log('D3 OK')" onerror="window.scriptErr='D3'"></script>
<script src="https://cdn.jsdelivr.net/npm/topojson@3.0.2/dist/topojson.min.js" crossorigin="anonymous" onload="console.log('Topo OK')" onerror="window.scriptErr='Topojson'"></script>
<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.2/babel.min.js" crossorigin="anonymous" onload="console.log('Babel OK')" onerror="window.scriptErr='Babel'"></script>
<style>
{CSS}
</style>
<script>
window.onerror = function(msg, url, lineNo, columnNo, error) {
  var err = document.createElement('div');
  err.style.cssText = 'color:#ef4444;background:#181b23;padding:20px;margin:20px;border:1px solid #ef4444;border-radius:10px;font-family:monospace;white-space:pre-wrap;z-index:99999;position:relative;';
  err.innerHTML = '<h3>❌ JavaScript Error</h3>' + 
    '<b>Message:</b> ' + msg + '<br>' +
    '<b>Source:</b> ' + (url || 'inline') + '<br>' +
    '<b>Line:</b> ' + lineNo + ':' + columnNo + '<br>' +
    '<b>Stack:</b><br>' + (error ? (error.stack || error) : 'N/A');
  document.body.prepend(err);
  return false;
};
window.addEventListener('load', function() {
  setTimeout(function() {
    var R = window.Recharts || window.recharts;
    var deps = { 'React': window.React, 'ReactDOM': window.ReactDOM, 'Recharts': R, 'Babel': window.Babel };
    var missing = Object.keys(deps).filter(function(k) { return !deps[k]; });
    if (missing.length || window.scriptErr) {
      var div = document.createElement('div');
      div.style.cssText = 'color:white;background:#b91c1c;padding:20px;margin:20px;border-radius:10px;z-index:99999;position:relative;';
      div.innerHTML = '<h3>❌ Dependency Loading Issue</h3>' + 
        '<b>Missing:</b> ' + (missing.join(', ') || 'None') + '<br>' +
        '<b>Network Failure:</b> ' + (window.scriptErr || 'None detected by onerror') + '<br>' +
        '<p style="font-size:11px">If Recharts is missing, we are testing both window.Recharts and window.recharts.</p>';
      document.body.prepend(div);
    }
  }, 3000);
});
</script>
</head>
<body>
<div id="root">
  <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#5a6075;font-family:sans-serif;font-size:14px;">
    ⚡ Loading Component Lab... (Waiting for Babel/React)
  </div>
</div>
<script type="text/babel">
(function() {
  try {
    console.log('🏁 Initializing Wizard Bundle...');
    if (typeof React === 'undefined') throw new Error('React is not defined on window.');
    
    // Explicitly map hooks to be safe
    const { useState, useEffect, useMemo, useCallback, useRef } = React;
    window.useState = useState; window.useEffect = useEffect;

    const R = window.Recharts || window.recharts;
    const {
      LineChart, Line, BarChart, Bar, AreaChart, Area,
      PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
      Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList,
      ComposedChart
    } = R || {};

    // ── Main Bundle ────────────────────────────────────────────────────────
    {WIZARD_JS}
    // ───────────────────────────────────────────────────────────────────────
    
  } catch (e) {
    console.error('💥 FATAL INITIALIZATION ERROR:', e);
    var err = document.createElement('div');
    err.style.cssText = 'color:#fff;background:#b91c1c;padding:30px;margin:20px;border-radius:12px;font-family:monospace;white-space:pre-wrap;';
    err.innerHTML = '<h2>💥 Fatal Initialization Error</h2>' +
      '<b>Message:</b> ' + e.message + '<br>' +
      '<b>Stack:</b><br>' + (e.stack || 'No stack trace');
    document.body.prepend(err);
  }
})();
</script>
</body>
</html>""".replace("{CSS}", CSS).replace("{WIZARD_JS}", WIZARD_JS)

components.html(HTML, height=960, scrolling=False)
