document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const calculationSteps = document.getElementById('calculation-steps');
    const loading = document.getElementById('loading');
    
    calculateBtn.addEventListener('click', function() {
        calculationSteps.innerHTML = '';
        resultContainer.style.display = 'none';
        loading.style.display = 'block';
        
        // Get matrix values with validation
        const matrix = [];
        for (let i = 1; i <= 4; i++) {
            const row = [];
            for (let j = 1; j <= 4; j++) {
                const value = document.getElementById(`m${i}${j}`).value;
                row.push(value === '' ? 0 : parseFloat(value));
            }
            matrix.push(row);
        }
        
        setTimeout(() => {
            calculateDeterminant(matrix);
            loading.style.display = 'none';
            resultContainer.style.display = 'block';
        }, 500);
    });
    
    function calculateDeterminant(matrix) {
        // Step 1: Show original matrix
        addStep(`
            <div class="calculation-step">
                <div class="step-title">Matriks Input</div>
                <div class="matrix-container">
                    <div class="matrix-bracket">[</div>
                    ${renderMatrix(matrix)}
                    <div class="matrix-bracket">]</div>
                </div>
            </div>
        `);
        
        // Step 2: Expansion along first row
        const expansionRow = 0;
        addStep(`
            <div class="calculation-step">
                <div class="step-title">Ekspansi Baris Pertama</div>
                <div class="matrix-container">
                    <div class="matrix-bracket">[</div>
                    ${renderMatrix(matrix, expansionRow)}
                    <div class="matrix-bracket">]</div>
                </div>
            </div>
        `);
        
        let totalDeterminant = 0;
        const elements = matrix[expansionRow];
        let cofactors = [];
        
        // Calculate each cofactor
        for (let col = 0; col < 4; col++) {
            const element = elements[col];
            if (element === 0) continue;
            
            const minor = getMinorMatrix(matrix, expansionRow, col);
            const sign = Math.pow(-1, expansionRow + col);
            const minorDet = calculate3x3DeterminantWithSarrus(minor);
            const cofactor = sign * element * minorDet.value;
            cofactors.push({
                element: element,
                sign: sign,
                minorDet: minorDet.value,
                cofactor: cofactor
            });
            
            addStep(`
                <div class="calculation-step">
                    <div class="step-title">Perhitungan untuk elemen baris 1 kolom ${col+1}</div>
                    <p>Minor matriks:</p>
                    <div class="matrix-container">
                        <div class="matrix-bracket">[</div>
                        ${renderMatrix(minor)}
                        <div class="matrix-bracket">]</div>
                    </div>
                    ${minorDet.sarrusHTML}
                    <div class="cofactor-calculation">
                        <p><strong>Menghitung kofaktor:</strong></p>
                        <p>Tanda kofaktor: (-1)<sup>${expansionRow+1 + col+1}</sup> = ${sign}</p>
                        <p>Kofaktor = ${sign} × ${element} × ${minorDet.value} = ${cofactor}</p>
                    </div>
                </div>
            `);
            
            totalDeterminant += cofactor;
        }
        
        // Final result with detailed calculation
        addStep(`
            <div class="calculation-step">
                <div class="step-title">Hasil Akhir</div>
                <div class="final-calculation">
                    <p>Total determinan dihitung dengan menjumlahkan semua kofaktor:</p>
                    <p>${cofactors.map(c => c.cofactor > 0 ? `+${c.cofactor}` : c.cofactor).join(' ')} = ${totalDeterminant}</p>
                    <p style="font-size: 20px; text-align: center; margin-top: 10px;">
                        <strong>Determinan matriks: ${totalDeterminant}</strong>
                    </p>
                </div>
            </div>
        `);
    }
    
    function getMinorMatrix(matrix, rowToRemove, colToRemove) {
        const minor = [];
        for (let i = 0; i < 4; i++) {
            if (i === rowToRemove) continue;
            const newRow = [];
            for (let j = 0; j < 4; j++) {
                if (j === colToRemove) continue;
                newRow.push(matrix[i][j]);
            }
            minor.push(newRow);
        }
        return minor;
    }
    
    function calculate3x3DeterminantWithSarrus(matrix) {
        const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
        const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
        const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
        
        // Perhitungan determinan
        const diag1 = a*e*i;  // Diagonal utama
        const diag2 = b*f*g;  // Diagonal utama 
        const diag3 = c*d*h;  // Diagonal utama
        const diag4 = a*f*h;  // Diagonal sekunder pola baru
        const diag5 = b*d*i;  // Diagonal sekunder
        const diag6 = c*e*g;  // Diagonal sekunder
        
        const result = diag1 + diag2 + diag3 - diag4 - diag5 - diag6;
        
        // Visualisasi Sarrus dengan kedua warna
        let sarrusHTML = `
            <p>Metode Sarrus:</p>
            <div class="matrix-container">
                <div class="matrix-bracket">[</div>
                <table class="sarrus-table">
                    <tr>
                        <td class="diagonal-main">${a}</td> <!-- Merah -->
                        <td>${b}</td>
                        <td>${c}</td>
                        <td class="diagonal-secondary">${a}</td> <!-- Biru -->
                        <td>${b}</td>
                    </tr>
                    <tr>
                        <td>${d}</td>
                        <td class="diagonal-main">${e}</td> <!-- Merah -->
                        <td class="diagonal-secondary">${f}</td> <!-- Biru -->
                        <td>${d}</td>
                        <td>${e}</td>
                    </tr>
                    <tr>
                        <td>${g}</td>
                        <td class="diagonal-secondary">${h}</td> <!-- Biru -->
                        <td class="diagonal-main">${i}</td> <!-- Merah -->
                        <td>${g}</td>
                        <td>${h}</td>
                    </tr>
                </table>
                <div class="matrix-bracket">]</div>
            </div>
            <div class="calculation-detail">
                <p><strong style="color:#ff0000">Diagonal utama (merah):</strong></p>
                <p>${a} × ${e} × ${i} = ${diag1}</p>
                <p>${b} × ${f} × ${g} = ${diag2}</p>
                <p>${c} × ${d} × ${h} = ${diag3}</p>
                
                <p><strong style="color:#0066cc">Diagonal sekunder (biru):</strong></p>
                <p>${a} × ${f} × ${h} = ${diag4}</p>
                <p>${b} × ${d} × ${i} = ${diag5}</p>
                <p>${c} × ${e} × ${g} = ${diag6}</p>
                
                <p><strong>Determinan minor:</strong> (${diag1} + ${diag2} + ${diag3}) - (${diag4} + ${diag5} + ${diag6}) = ${result}</p>
            </div>
        `;
        
        return {
            value: result,
            sarrusHTML: sarrusHTML
        };
    }
    
    function renderMatrix(matrix, highlightRow = null) {
        let html = '<table class="matrix-table">';
        for (let i = 0; i < matrix.length; i++) {
            html += '<tr>';
            for (let j = 0; j < matrix[i].length; j++) {
                const cellClass = (highlightRow !== null && i === highlightRow) ? 'highlight' : '';
                html += `<td class="${cellClass}">${matrix[i][j]}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }
    
    function addStep(content) {
        const step = document.createElement('div');
        step.innerHTML = content;
        calculationSteps.appendChild(step);
    }
});