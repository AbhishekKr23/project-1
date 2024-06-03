const form = document.querySelector('#searchForm');
const res = document.querySelector('#resTable');
const cont = document.getElementById("allContaint");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ctype = form.elements.coinType.value;
    cont.classList.add('mainClick');
    cont.classList.remove('main');
    fetchAndDisplayPrice(ctype);
    clearInterval(window.priceInterval);
    window.priceInterval = setInterval(() => fetchAndDisplayPrice(ctype), 30000); // Auto update every 30 seconds
});

const fetchAndDisplayPrice = async (ctype) => {
    try {
        const response = await axios.get(`https://api.coincap.io/v2/assets/${ctype}`);
        showPrice(ctype, response.data.data);
    } catch (error) {
        console.error('Error fetching data from CoinCap API:', error);
        res.innerHTML = '<tr><td colspan="2">Error fetching data. Please try again later.</td></tr>';
    }
};

const showPrice = (coinName, coinData) => {
    if (!coinData) {
        res.innerHTML = '<tr><td colspan="2">No data available. Please try again later.</td></tr>';
        return;
    }

    const price = parseFloat(coinData.priceUsd);
    const vol = parseFloat(coinData.volumeUsd24Hr);
    const change = parseFloat(coinData.changePercent24Hr);
    const curr = 'USD';
    let col = change < 0 ? "red" : "green";

    // Get the current date
    const currentDate = new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    const currentTime = new Date().toLocaleTimeString();

    res.innerHTML = `<tr class="bg-primary" style="color: white;">
        <td>Property</td>
        <td>Value</td>
    </tr>
    <tr>
        <td>${coinName}</td>
        <td style="color:${col};"><span style="font-size: 1.3em;">${price.toFixed(2)}</span> ${curr}</td>
    </tr>
    <tr>
        <td>Volume (24h)</td>
        <td>${vol.toFixed(2)}</td>
    </tr>
    <tr>
        <td>Change (24h)</td>
        <td style="color:${col};">${change.toFixed(2)} %</td>
    </tr>
    <tr>
        <td>Last Update</td>
        <td>${currentDate} ${currentTime}</td>
    </tr>`;
};

