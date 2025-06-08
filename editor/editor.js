
function parseVector(id) {
  const input = document.getElementById(id).value;
  return input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
}

function softmax(vector) {
  const max = Math.max(...vector);
  const exps = vector.map(x => Math.exp(x - max));
  const sum = exps.reduce((acc, val) => acc + val, 0);
  return exps.map(val => val / sum);
}

function normalizeVector(vector) {
  const min = Math.min(...vector);
  const max = Math.max(...vector);
  return vector.map(val => (val - min) / (max - min));
}

function zScoreNormalize(vector) {
  const mean = vector.reduce((acc, val) => acc + val, 0) / vector.length;
  const variance = vector.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / vector.length;
  const stdDev = Math.sqrt(variance);
  return vector.map(val => (val - mean) / stdDev);
}

function plotVector() {
  const x = parseVector('vectorX');
  const y = parseVector('vectorY');
  const z = parseVector('vectorZ');

  if (x.length !== y.length || y.length !== z.length) {
    alert('X, Y, Z vektörlerinin uzunlukları aynı olmalıdır.');
    return;
  }

  const trace = {
    x: x,
    y: y,
    z: z,
    mode: 'markers',
    type: 'scatter3d',
    marker: {
      size: 8,
      color: z,
      colorscale: 'Viridis',
      opacity: 0.8
    }
  };

  Plotly.newPlot('plot3d', [trace], {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' }
    }
  });
}

function applyTransform(transform) {
  let x = parseVector('vectorX');
  let y = parseVector('vectorY');
  let z = parseVector('vectorZ');

  switch (transform) {
    case 'normalize':
      x = normalizeVector(x);
      y = normalizeVector(y);
      z = normalizeVector(z);
      break;
    case 'zscore':
      x = zScoreNormalize(x);
      y = zScoreNormalize(y);
      z = zScoreNormalize(z);
      break;
    case 'softmax':
      x = softmax(x);
      y = softmax(y);
      z = softmax(z);
      break;
    default:
      break;
  }

  // Update inputs
  document.getElementById('vectorX').value = x.join(',');
  document.getElementById('vectorY').value = y.join(',');
  document.getElementById('vectorZ').value = z.join(',');

  // Re-plot
  plotVector();
}
