const express = require('express');
const app = express();
const port = 8000;

const motoGP = [
    {
        circuit: 'Losail',
        location: 'Qatar',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    },
    {
        circuit: 'Autodromo',
        location: 'Argentine',
        winner: {
            firstName: 'Cal',
            lastName: 'Crutchlow',
            country: 'Uk'
        }
    },
    {
        circuit: 'De Jerez',
        location: 'Spain',
        winner: {
            firstName: 'Valentino',
            lastName: 'Rossi',
            country: 'Italy'
        }
    },
    {
        circuit: 'Mugello',
        location: 'Italy',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    }
];

const groupedData = {};

motoGP.forEach((race) => {
    const winner = race.winner;
    const winnerKey = winner.country;

    if (!groupedData[winnerKey]) {
        groupedData[winnerKey] = {
            winningCircuits: [],
            totalWin: 0
        };
    }

    groupedData[winnerKey].winningCircuits.push({
        name: winner.firstName + ' ' + winner.lastName,
        winLocation: race.circuit + ', ' + race.location
    });

    groupedData[winnerKey].totalWin++;

});

app.get('/', (req, res) => {
    res.json([
        {
            route: '/winners/country',
            description: 'Tampilkan pemenang berdasarkan negara',
        },
        {
            route: '/winners/name',
            description: 'Tampilkan pemenang berdasarkan nama',
        },
        {
            route: '/winners/circuit',
            description: 'Tampilkan pemenang berdasarkan sirkuit',
        }
    ]);
});


app.get('/winners/country', (req, res) => {
    const winners = {};

    motoGP.forEach((race) => {
        const winner = race.winner;
        const country = winner.country;

        if (!winners[country]) {
            winners[country] = {
                winningCircuits: [],
                totalWin: 0
            };
        }

        winners[country].winningCircuits.push({
            name: winner.firstName + ' ' + winner.lastName,
            winLocation: race.circuit + ', ' + race.location
        });

        winners[country].totalWin++;
    });

    res.json(winners);
});


app.get('/winners/name', (req, res) => {
    const allWinners = [];
    let totalWin = 0;

    for (const country in groupedData) {
        groupedData[country].winningCircuits.forEach((winner) => {
            allWinners.push({ name: winner.name });
            totalWin++;
        });
    }

    if (allWinners.length > 0) {
        res.json({ winners: allWinners, totalWin });
    } else {
        res.status(404).json({ message: 'Nama pemenang tidak ditemukan' });
    }
});

app.get('/winners/circuit', (req, res) => {
    const allCircuits = [];
    for (const country in groupedData) {
        groupedData[country].winningCircuits.forEach((winner) => {
            const circuitName = winner.winLocation.split(', ')[0]; // Mengambil nama sirkuit
            allCircuits.push({ country, name: winner.name,circuit: circuitName });
        });
    }

    if (allCircuits.length > 0) {
        res.json(allCircuits);
    } else {
        res.status(404).json({ message: 'Sirkuit tidak ditemukan' });
    }
});


app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
