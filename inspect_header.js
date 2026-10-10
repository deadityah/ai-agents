// inspect_header.js
async function run() {
  const versionRes = await fetch('http://localhost:9222/json/new?' + encodeURIComponent('http://localhost:3000/'), { method: 'PUT' });
  const target = await versionRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener('open', res));
  let cmdId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const handler = (event) => {
      const d = JSON.parse(event.data);
      if (d.id === ++cmdId) { ws.removeEventListener('message', handler); resolve(d.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cmdId, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 600));
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const header = document.querySelector('header > div');
        const children = Array.from(header.children).map(c => {
          const r = c.getBoundingClientRect();
          return { tag: c.tagName, class: c.className, x: r.x, width: r.width, right: r.right };
        });
        return { header: header.getBoundingClientRect(), children };
      })()
    `,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  await send('Target.closeTarget', { targetId: target.id });
  ws.close();
}
run().catch(console.error);
