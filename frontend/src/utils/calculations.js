/**
 * Perform all financial calculations based on user inputs.
 * @param {Object} params
 * @param {number} params.investment - Investment amount
 * @param {number} params.profitAmount - Profit withdrawal amount
 * @param {number} params.profitPercent - Profit percentage
 * @param {number} params.outstandingAmount - Outstanding withdrawal amount
 * @param {number} params.outstandingPercent - Outstanding percentage
 * @returns {Object} Calculated financial values
 */
export function calculateFinancials({
  investment = 0,
  profitAmount = 0,
  profitPercent = 60,
  outstandingAmount = 0,
  outstandingPercent = 60,
}) {
  const maturityAmount = investment * 2;
  const profitValue = (profitAmount * profitPercent) / 100;
  const outstandingValue = (outstandingAmount * outstandingPercent) / 100;
  const totalValue = profitValue + outstandingValue;
  const leftoverValue = maturityAmount - totalValue;
  const transferValue = leftoverValue / 2;
  const monthlyProfit = transferValue * 0.02;

  return {
    maturityAmount,
    profitValue,
    outstandingValue,
    totalValue,
    leftoverValue,
    transferValue,
    monthlyProfit,
  };
}
