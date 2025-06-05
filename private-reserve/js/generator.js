/* generator.js  – math & G-code builder (pseudo) */
import { in2mm } from './utils.js';

export function buildGcode(params) {
  const {
    stockX, stockY, depth, dia,
    rpm, feed, stepPct, passExt, direction,
    oneWay, metric
  } = params;

  // 1. math
  const step = dia * stepPct / 100;
  const passes = direction === 'x'
    ? Math.ceil(stockY / step)
    : Math.ceil(stockX / step);

  // 2. unit helpers
  const u = metric ? in2mm : x => x;     // convert on the fly
  const fmt = v => v.toFixed(3);

  // 3. header
  let g = [];
  g.push('(Face-mill generated code)');
  g.push(metric ? 'G21' : 'G20');       // units
  g.push('G90 G17');                    // abs, XY plane
  g.push(`S${rpm} M3`);
  g.push('G28');                        // home
  g.push('G0 Z25');                     // safe Z (mm) – tweak

  // 4. passes loop
  for (let i=0; i<passes; i++) {
    if (direction === 'x') {
      const y = Math.min(i * step, stockY);
      const xStart  = ((oneWay || i%2===0) ? -passExt : stockX + passExt);
      const xFinish = ((oneWay || i%2===0) ? stockX + passExt : -passExt);

      g.push(`(Pass ${i+1})`);
      g.push(`G0 X${fmt(u(xStart))} Y${fmt(u(y))} Z5`);
      g.push(`G1 Z-${fmt(u(depth))} F${feed}`);
      g.push(`G1 X${fmt(u(xFinish))} F${feed}`);

      g.push('G0 Z5');
      if (oneWay) {
        g.push(`G0 X${fmt(u(xStart))}`);
      }
    } else {
      const x = Math.min(i * step, stockX);
      const yStart  = ((oneWay || i%2===0) ? -passExt : stockY + passExt);
      const yFinish = ((oneWay || i%2===0) ? stockY + passExt : -passExt);

      g.push(`(Pass ${i+1})`);
      g.push(`G0 X${fmt(u(x))} Y${fmt(u(yStart))} Z5`);
      g.push(`G1 Z-${fmt(u(depth))} F${feed}`);
      g.push(`G1 Y${fmt(u(yFinish))} F${feed}`);

      g.push('G0 Z5');
      if (oneWay) {
        g.push(`G0 Y${fmt(u(yStart))}`);
      }
    }
  }

  // 5. footer
  g.push('G0 Z25');
  g.push('M5');
  g.push('M30');

  return g.join('\n');
}
