
// Şimdilik boş, burada ileride menü işlemleri (onclick vs.) bağlarız
  document.getElementById('tableViewBtn').addEventListener('click', () => {
    document.getElementById('tableView').style.display = 'block';
    document.getElementById('cubeView').style.display = 'none';
  });

  document.getElementById('cubeViewBtn').addEventListener('click', () => {
    document.getElementById('tableView').style.display = 'none';
    document.getElementById('cubeView').style.display = 'block';
    draw3DCube();
  });

  function draw3DCube() {
    const trace = {
      x: [0, 1, 0, 1, 0, 1, 0, 1],
      y: [0, 0, 1, 1, 0, 0, 1, 1],
      z: [0, 0, 0, 0, 1, 1, 1, 1],
      mode: 'markers',
      marker: {
        size: 5,
        color: 'orange'
      },
      type: 'scatter3d'
    };

    const layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 },
      scene: {
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        zaxis: { title: 'Katman' }
      }
    };

    Plotly.newPlot('cubeContainer', [trace], layout);
  }
   function generateFakeData() {
    const tbody = document.getElementById('dataTableBody');
    const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    for (let i = 1; i <= 1000; i++) {
      const tr = document.createElement('tr');

      const idTd = document.createElement('td');
      idTd.textContent = i;

      const nameTd = document.createElement('td');
      nameTd.textContent = names[Math.floor(Math.random() * names.length)];

      const valueTd = document.createElement('td');
      valueTd.textContent = (Math.random() * 100).toFixed(2);

      const layerTd = document.createElement('td');
      layerTd.textContent = Math.floor(Math.random() * 10); // Katman 0-9 arası

      tr.appendChild(idTd);
      tr.appendChild(nameTd);
      tr.appendChild(valueTd);
      tr.appendChild(layerTd);

      tbody.appendChild(tr);
    }
  }

  // Sayfa yüklendiğinde otomatik çalıştır
  window.addEventListener('DOMContentLoaded', generateFakeData);