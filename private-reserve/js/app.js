/* app.js  – UI glue */
import { $, in2mm } from './utils.js';
import { buildGcode } from './generator.js';
import { initViewer, drawToolpath } from './viewer.js';

const viewCtx = initViewer();

$('#cookBtn').addEventListener('click', () => {
  // gather inputs
  const params = {
    stockX   : +$('#stockX').value,
    stockY   : +$('#stockY').value,
    depth    : +$('#depth').value,
    dia      : +$('#dia').value,
    rpm      : +$('#rpm').value,
    feed     : +$('#feed').value,
    stepPct  : +$('#step').value,
    passExt  : +$('#ext').value,
    direction: $('#direction').value,
    oneWay   : $('#oneway').checked,
    metric   : $('#metric').checked
  };

  // 1. build G-code text
  const code = buildGcode(params);
  $('#gcodeBox').value = code;

  // 2. (optional) build segments for preview
  const segs = mockSegmentsFromParams(params);  // stub – write later
  drawToolpath(viewCtx, segs);
});
