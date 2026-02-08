/* script.js */
let selectedBets = {}; 
const bookmakerMargin = 0.92; // Margine di errore statistico (8%)

// Navigazione Menu
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.tab-bar button').forEach(btn => {
        btn.classList.replace('text-blue-500', 'text-gray-500');
    });
    const activeBtn = document.querySelector(`button[onclick="showSection('${id}')"]`);
    activeBtn.classList.replace('text-gray-500', 'text-blue-500');
}

// Aggiunta Scommessa
function addBet(btn, matchName, betType, odd) {
    const betKey = `${matchName}-${betType}`;

    if (selectedBets[betKey]) {
        delete selectedBets[betKey];
        btn.classList.remove('active');
    } else {
        selectedBets[betKey] = { odd };
        btn.classList.add('active');
    }
    updateSlip();
}

// Calcolo Probabilità e Aggiornamento UI
function updateSlip() {
    const slip = document.getElementById('slip');
    const bets = Object.values(selectedBets);
    
    if (bets.length === 0) {
        slip.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => slip.classList.add('hidden'), 300);
        return;
    }

    let totalOdds = 1.0;
    let probBase = 1.0;

    bets.forEach(bet => {
        totalOdds *= bet.odd;
        probBase *= (1 / bet.odd);
    });

    // Algoritmo probabilità reale
    let finalProb = (probBase * 100 * Math.pow(bookmakerMargin, bets.length));

    slip.classList.remove('hidden');
    setTimeout(() => slip.classList.remove('translate-y-full', 'opacity-0'), 10);

    document.getElementById('odds-display').innerText = `Quota: ${totalOdds.toFixed(2)}`;
    document.getElementById('prob-display').innerText = `${finalProb.toFixed(1)}%`;
    
    // Suggerimenti AI
    let advice = "";
    if (finalProb < 15) advice = "⚠️ Molto rischioso. Prova una 'Doppia Chance'.";
    else if (bets.length > 4) advice = "💡 Troppi eventi. La probabilità cala vertiginosamente.";
    else advice = "✅ Schedina equilibrata.";
    
    document.getElementById('advice-display').innerText = advice;
}
