/* generator.js  – math & G-code builder (pseudo) */
import { in2mm } from './utils.js';

export function buildGcode(params) {
  const {
    stockX, stockY, depth, dia,
    rpm, feed, stepPct, oneWay, metric
  } = params;

  // 1. math
  const step = dia * stepPct / 100;
  const passes = Math.ceil(stockY / step);

  // 2. unit helpers
  const u = metric ? in2mm : x => x;     // convert on the fly
  const fmt = v => v.toFixed(3);
  const safeZHome = 25;
  const safeZRetract = 5;

  // 3. header
  let g = [];
  g.push('(Face-mill generated code)');
  g.push(metric ? 'G21' : 'G20');       // units
  g.push('G90 G17');                    // abs, XY plane
  g.push(`S${rpm} M3`);
  g.push('G28');                        // home
  g.push(`G0 Z${fmt(u(safeZHome))}`);   // safe Z – tweak

  // 4. passes loop
  for (let i=0; i<passes; i++) {
    const y = Math.min(i * step, stockY);
    const xStart  = ((oneWay || i%2===0) ? 0         : stockX);
    const xFinish = ((oneWay || i%2===0) ? stockX    : 0);

    g.push(`(Pass ${i+1})`);
    g.push(`G0 X${fmt(u(xStart))} Y${fmt(u(y))} Z${fmt(u(safeZRetract))}`);
    g.push(`G1 Z-${fmt(u(depth))} F${fmt(u(feed))}`);
    g.push(`G1 X${fmt(u(xFinish))} F${fmt(u(feed))}`);

    // retract
    g.push(`G0 Z${fmt(u(safeZRetract))}`);

    if (oneWay) {      // rapid back
      g.push(`G0 X${fmt(u(xStart))}`);
    }
  }

  // 5. footer
  g.push(`G0 Z${fmt(u(safeZHome))}`);
  g.push('M5');
  g.push('M30');

  return g.join('\n');
}
