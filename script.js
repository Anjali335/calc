const currencySymbols = document.querySelectorAll('.currency-symbol');
const currencySelect = document.getElementById('currency');

// Inputs no longer trigger immediate rendering; results render on submit
// (button calls `calculateReport()` in the HTML)

function formatNumber(num){
    return new Intl.NumberFormat('en-IN').format(num);
}

function updateCurrencySymbols(){
    const currency = currencySelect.value;
    currencySymbols.forEach((span) => {
        span.textContent = currency;
    });
}

currencySelect.addEventListener('change', updateCurrencySymbols);

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    const normalizePhoneValue = () => {
        const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (phoneInput.value !== digits) {
            phoneInput.value = digits;
        }
    };

    phoneInput.addEventListener('input', normalizePhoneValue);

    phoneInput.addEventListener('beforeinput', (event) => {
        if (!event.data || !/^[0-9]$/.test(event.data)) {
            return;
        }

        const currentDigits = phoneInput.value.replace(/\D/g, '');
        const selectionLength = phoneInput.selectionEnd - phoneInput.selectionStart;

        if (currentDigits.length - selectionLength >= 10) {
            event.preventDefault();
        }
    });

    phoneInput.addEventListener('paste', (event) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const digits = paste.replace(/\D/g, '');
        const newValue = (phoneInput.value + digits).replace(/\D/g, '').slice(0, 10);
        phoneInput.value = newValue;
    });
}

updateCurrencySymbols();

function calculate(){

    const currency =
    document.getElementById("currency").value;

    const investment =
    Number(document.getElementById("investment").value) || 0;

    const profitAmount =
    Number(document.getElementById("profitAmount").value) || 0;

    const profitPercent =
    Number(document.getElementById("profitPercent").value) || 60;

    const outstandingAmount =
    Number(document.getElementById("outstandingAmount").value) || 0;

    const outstandingPercent =
    Number(document.getElementById("outstandingPercent").value) || 60;

    const maturityAmount = investment * 2;

    const profitValue =
    profitAmount * profitPercent / 100;

    const outstandingValue =
    outstandingAmount * outstandingPercent / 100;

    const totalValue =
    profitValue + outstandingValue;

    const leftoverValue =
    maturityAmount - totalValue;

    const transferValue =
    leftoverValue / 2;

    const monthlyProfit =
    transferValue * 0.02;

    const html = `

    <div class="result-box">
    Maturity Amount :
    ${currency}${formatNumber(maturityAmount)}
    </div>

    <div class="result-box">
    Profit Value :
    ${currency}${formatNumber(profitValue)}
    </div>

    <div class="result-box">
    Outstanding Value :
    ${currency}${formatNumber(outstandingValue)}
    </div>

    <div class="result-box">
    Total Value :
    ${currency}${formatNumber(totalValue)}
    </div>

    <div class="result-box">
    Leftover Value :
    ${currency}${formatNumber(leftoverValue)}
    </div>

    <div class="result-box">
    Transfer Value :
    ${currency}${formatNumber(transferValue)}
    </div>

    <div class="result-box">
    Monthly Profit :
    ${currency}${formatNumber(monthlyProfit)}
    </div>

    `;

    return html;
}

function calculateReport(){
    document.getElementById("results").innerHTML = calculate();
    document.getElementById('shareControls').classList.remove('hidden');
}

function buildReportText(){
    const company = document.getElementById('company').value || 'N/A';
    const phoneCountry = document.getElementById('phoneCountry').value;
    const phoneNumber = document.getElementById('phone').value;
    const phone = phoneNumber ? `${phoneCountry} ${phoneNumber}` : 'N/A';
    const email = document.getElementById('email').value || 'N/A';
    const generatedBy = document.getElementById('generatedBy').value || 'N/A';
    const client = document.getElementById('client').value || 'N/A';
    const currency = document.getElementById('currency').value;
    const investment = Number(document.getElementById('investment').value) || 0;
    const months = document.getElementById('months').value || 'N/A';
    const profitAmount = Number(document.getElementById('profitAmount').value) || 0;
    const profitPercent = Number(document.getElementById('profitPercent').value) || 0;
    const outstandingAmount = Number(document.getElementById('outstandingAmount').value) || 0;
    const outstandingPercent = Number(document.getElementById('outstandingPercent').value) || 0;

    const maturityAmount = investment * 2;
    const profitValue = profitAmount * profitPercent / 100;
    const outstandingValue = outstandingAmount * outstandingPercent / 100;
    const totalValue = profitValue + outstandingValue;
    const leftoverValue = maturityAmount - totalValue;
    const transferValue = leftoverValue / 2;
    const monthlyProfit = transferValue * 0.02;

    return `Financial Report\n\nCompany: ${company}\nPhone: ${phone}\nEmail: ${email}\nGenerated By: ${generatedBy}\nClient Name: ${client}\nCurrency: ${currency}\nInvestment Amount: ${currency}${formatNumber(investment)}\nMaturity Period: ${months}\nProfit Withdrawal: ${currency}${formatNumber(profitAmount)}\nProfit %: ${formatNumber(profitPercent)}%\nOutstanding Withdrawal: ${currency}${formatNumber(outstandingAmount)}\nOutstanding %: ${formatNumber(outstandingPercent)}%\n\nMaturity Amount: ${currency}${formatNumber(maturityAmount)}\nProfit Value: ${currency}${formatNumber(profitValue)}\nOutstanding Value: ${currency}${formatNumber(outstandingValue)}\nTotal Value: ${currency}${formatNumber(totalValue)}\nLeftover Value: ${currency}${formatNumber(leftoverValue)}\nTransfer Value: ${currency}${formatNumber(transferValue)}\nMonthly Profit: ${currency}${formatNumber(monthlyProfit)}\n`;
}



function shareByWhatsApp(){
    const message = encodeURIComponent(buildReportText());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
}

function copyReport(){
    const reportText = buildReportText();
    navigator.clipboard.writeText(reportText).then(() => {
        alert('Report copied to clipboard.');
    }).catch(() => {
        alert('Unable to copy report.');
    });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker Registered"));
}