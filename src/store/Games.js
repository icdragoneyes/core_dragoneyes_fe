const gameList = {
  games: {
    roshambo: {
      sol: {
        name: "sol",
        decimal: 1e9,
        minWithdrawal: 0.05,
        bets: [0.01, 0.1, 0.5],
        transferFee: 10000,
      },
      icp: {
        name: "icp",
        decimal: 1e8,
        minWithdrawal: 0.5,
        bets: [0.1, 1, 5],
        transferFee: 10000,
      },
      btc: {
        name: "btc",
        decimal: 1e8,
        minWithdrawal: 0.005,
        bets: [0.00001, 0.0001, 0.0005],
        transferFee: 10,
      },
    },
  },
};
