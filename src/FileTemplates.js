const THEME_HTML_FILE = `<!-- HTML window that loads correct theme -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
    <div style="width: 500px; height: 500px; border-radius: 5px">My window content</div>
  </head>
  <body>
    
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
  </body>
</html>`


module.exports = {
    THEME_HTML_FILE
}