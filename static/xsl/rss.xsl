<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <title><xsl:value-of select="rss/channel/title"/></title>
        <style>
          :root {
            --primary: rgba(96, 156, 250, 1);
            --secondary: rgb(29 78 216 / 64%);
            --text: #2D3748;
            --bg: #f8f9fa;
            --card-bg: #ffffff;
            --border: rgba(0, 0, 0, 0.1);
            --blockquote: #3474d7;
          }

          [data-theme="dark"] {
            --primary: #6B8CFF;
            --secondary: #B07CFF;
            --text: #E2E8F0;
            --bg: #1A202C;
            --card-bg: #2D3748;
            --border: rgba(255, 255, 255, 0.1);
            --blockquote: #7cafff;
          }

          body {
              margin: 0;
              padding-left: 17%;
              padding-right: 17%;
              padding-top: 2rem;
              padding-bottom: 2rem;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              line-height: 1.6;
              background: var(--bg);
              color: var(--text);
              transition: background 0.3s ease;
          }

          .big-header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .theme-toggle {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.2s;
          }

          .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .theme-icon {
            width: 24px;
            height: 24px;
            fill: white;
          }

          .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(154, 75, 255, 0.1);
            transition: transform 0.2s;
            margin-bottom: 1rem;
            overflow: hidden;
          }

          .card:hover {
            transform: translateY(-4px);
          }

          .card-title {
            color: var(--primary);
            margin: 0 0 1rem;
            font-size: 1.3rem;
          }

          .card-date {
            color: #718096;
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
          }

          .card-content {
            color: var(--text);
            font-size: 1rem;
            line-height: 1.5;
          }

          .card-link {
            display: inline-block;
            margin-top: 1rem;
            color: var(--secondary);
            text-decoration: none;
            font-weight: 500;
          }

          .card-link:hover {
            text-decoration: underline;
          }

          .meta-info {
            text-align: center;
            color: #718096;
            margin-top: 2rem;
            padding: 1rem;
            font-size: 0.9rem;
          }

          .icon {
            display: none;
          }

          img {
            max-width: 50%;
          }

          blockquote {
            margin: 1em 0;
            padding: 0.2em 0.8em;
            border-left: 0.2em solid var(--blockquote);
          }

          /* 暗色模式图标切换 */
          [data-theme="dark"] .light-icon {
            display: none;
          }
          [data-theme="dark"] .dark-icon {
            display: block;
          }

          .light-icon {
            display: block;
          }
          .dark-icon {
            display: none;
          }

          /* 暗色模式文本微调 */
          [data-theme="dark"] .card-date {
            color: #CBD5E0;
          }

          /* 暗色模式阴影调整 */
          [data-theme="dark"] .card {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="big-header">
        <div class="header">
          <h1><xsl:value-of select="rss/channel/title"/></h1>

          <button class="theme-toggle" id="themeToggle">
            <svg class="theme-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <!-- Moon icon (dark mode) -->
              <path class="dark-icon" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
              <!-- Sun icon (light mode) -->
              <path class="light-icon" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
            </svg>
          </button>
        </div>
        <blockquote>本页面是 Atom 订阅源，可直接被订阅。</blockquote>

        </div>

        <div class="card-container">
          <xsl:for-each select="rss/channel/item">
            <div class="card">
              <h2 class="card-title"><xsl:value-of select="title"/></h2>
              <div class="card-date">
                <xsl:value-of select="pubDate"/>
                <xsl:if test="author"> · <xsl:value-of select="author"/></xsl:if>
              </div>
              <div class="card-content">
                <xsl:value-of select="description" disable-output-escaping="yes"/>
              </div>
              <a href="{link}" class="card-link">阅读全文 →</a>
            </div>
          </xsl:for-each>
        </div>

        <div class="meta-info">
          <div>由 FloatBlog 生成</div>
          <xsl:if test="rss/channel/lastBuildDate">
            <div>最后更新: <xsl:value-of select="rss/channel/lastBuildDate"/></div>
          </xsl:if>
        </div>

        <script>
        <![CDATA[
          (function() {
            const themeToggle = document.getElementById('themeToggle');
            const body = document.documentElement;

            // 初始化主题
            const savedTheme = localStorage.getItem('theme') || 'light';
            body.setAttribute('data-theme', savedTheme);

            themeToggle.addEventListener('click', function() {
              const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
              body.setAttribute('data-theme', currentTheme);
              localStorage.setItem('theme', currentTheme);
            });

            // 系统主题检测
            if (!localStorage.getItem('theme')) {
              const mql = window.matchMedia('(prefers-color-scheme: dark)');
              const handleSystemThemeChange = function(e) {
                body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
              };
              mql.addListener(handleSystemThemeChange);
            }
          })();
        ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>