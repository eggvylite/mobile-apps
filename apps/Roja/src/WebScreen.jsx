import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebScreen() {

    const htmlcontent = {
        html: `<p>Members can save 10% to 50% on dental care expenses at any of the participating dental providers nationwide.</p>\r\n<p><strong>Dental Services:</strong></p>\r\n<div>\r\n<ul>\r\n<li>Routine Cleanings</li>\r\n<li>Exams</li>\r\n<li>X-Rays</li>\r\n<li>Root Canals</li>\r\n<li>Orthodontics (braces)</li>\r\n<li>Dentures</li>\r\n<li>Cosmetic Dentistry</li>\r\n<li>Crowns</li>\r\n<li>Extractions</li>\r\n<li>Fillings</li>\r\n<li>Oral Surgery</li>\r\n<li>Periodontics (gums)</li>\r\n</ul>\r\n<p><strong>Sample Savings</strong></p>\r\n<table style=\"height: 213px;\" width=\"643\">\r\n<thead>\r\n<tr>\r\n<th style=\"width: 228.663px; text-align: left;\">Service</th>\r\n<th style=\"width: 123.475px; text-align: left;\" align=\"right\">Avg. Price</th>\r\n<th style=\"width: 71.375px; text-align: left;\" align=\"right\">You Pay</th>\r\n<th style=\"width: 80.8875px; text-align: left;\" align=\"right\">Savings</th>\r\n<th style=\"width: 69.8px; text-align: left;\" align=\"right\">% Saved</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td style=\"width: 228.663px;\">Periodic Oral Evaluation</td>\r\n<td style=\"width: 123.475px; text-align: left;\" align=\"right\">$69</td>\r\n<td style=\"width: 71.375px; text-align: left;\" align=\"right\">$39</td>\r\n<td style=\"width: 80.8875px; text-align: left;\" align=\"right\">$30</td>\r\n<td style=\"width: 69.8px; text-align: left;\" align=\"right\">43%</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 228.663px;\">Cleaning &ndash; Adult</td>\r\n<td style=\"width: 123.475px; text-align: left;\" align=\"right\">$130</td>\r\n<td style=\"width: 71.375px; text-align: left;\" align=\"right\">$76</td>\r\n<td style=\"width: 80.8875px; text-align: left;\" align=\"right\">$54</td>\r\n<td style=\"width: 69.8px; text-align: left;\" align=\"right\">42%</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 228.663px;\">Complete X-rays</td>\r\n<td style=\"width: 123.475px; text-align: left;\" align=\"right\">$186</td>\r\n<td style=\"width: 71.375px; text-align: left;\" align=\"right\">$93</td>\r\n<td style=\"width: 80.8875px; text-align: left;\" align=\"right\">$93</td>\r\n<td style=\"width: 69.8px; text-align: left;\" align=\"right\">50%</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 228.663px;\">Root Canal (Anterior Tooth)</td>\r\n<td style=\"width: 123.475px; text-align: left;\" align=\"right\">$1,008</td>\r\n<td style=\"width: 71.375px; text-align: left;\" align=\"right\">$887</td>\r\n<td style=\"width: 80.8875px; text-align: left;\" align=\"right\">$121</td>\r\n<td style=\"width: 69.8px; text-align: left;\" align=\"right\">15%</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 228.663px;\">Complete Upper Denture</td>\r\n<td style=\"width: 123.475px; text-align: left;\" align=\"right\">$2,366</td>\r\n<td style=\"width: 71.375px; text-align: left;\" align=\"right\">$2,082</td>\r\n<td style=\"width: 80.8875px; text-align: left;\" align=\"right\">$284</td>\r\n<td style=\"width: 69.8px; text-align: left;\" align=\"right\">15%</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>\r\n</div>`
    }

    const html = `
  <html>
  <head>
   <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <style>

  body{
      font-family:Arial;
      padding:16px;
      font-size:16px;
      line-height:1.6;
      color:#333;
  }

  table{
      width:100%;
      border-collapse:collapse;
      margin-top:15px;
      overflow-x:auto;
  }

  th{
      background:#1976d2;
      color:white;
      padding:10px;
      border:1px solid #ddd;
  }

  td{
      padding:10px;
      border:1px solid #ddd;
  }

  tr:nth-child(even){
      background:#f8f8f8;
  }

  </style>
  </head>

  <body>

  ${htmlcontent.html}

  </body>
  </html>
  `;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                originWhitelist={['*']}
                source={{ html }}
                scalesPageToFit={false}      // Android
                setBuiltInZoomControls={false}
                setDisplayZoomControls={false}
                javaScriptEnabled

            />
        </SafeAreaView>
    );
}