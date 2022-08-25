export class UnusualSpendingsDetector {
  constructor(paymentsRepository, calendar) {
    this.paymentsRepository = paymentsRepository;
    this.calendar = calendar;
  }

  run(userId) {
    const month = this.calendar.getCurrentMonth();
    const previousMonth = this.calendar.getPreviousMonth();

    const paymentsMonth = this.paymentsRepository.find(userId, month);
    const previousMonthPayments = this.paymentsRepository.find(userId, previousMonth);

    if (previousMonthPayments.length === 0 || paymentsMonth.length === 0) {
      return [];
    }

    return computeUnusualSpendings(paymentsMonth, previousMonthPayments);
  }
}

function computeUnusualSpendings(paymentsMonth, previousMonthPayments) {
  const categories = new Set(paymentsMonth.map(payment => payment.category));
  const unusualSpendings = [];
  for (const category of categories) {
    const currentMonthCategorySpending = computeTotalSpendingByCategory(paymentsMonth, category);
    const previousMonthCategorySpending = computeTotalSpendingByCategory(previousMonthPayments, category);
    if (isThereUnusualSpending(previousMonthCategorySpending, currentMonthCategorySpending)) {
      unusualSpendings.push({ category, amount: currentMonthCategorySpending });
    }
  }
  return unusualSpendings;
}

function isThereUnusualSpending(previousSpending, currentSpending) {
  return previousSpending > 0 && previousSpending * 1.5 <= currentSpending;
}

function computeTotalSpendingByCategory(payments, category) {
  const paymentsForCategory = payments.filter(payment => payment.category === category);
  return computeTotalSpending(paymentsForCategory);
}

function computeTotalSpending(payments) {
  return payments.reduce((spending, payment) => spending + payment.amount, 0);
}
