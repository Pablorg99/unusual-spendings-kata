export class UnusualSpendingsDetector {
  constructor(paymentsRepository, calendar) {
    this.paymentsRepository = paymentsRepository;
    this.calendar = calendar;
  }

  run(userId) {
    let month = this.calendar.getCurrentMonth();
    let previousMonth = this.calendar.getPreviousMonth();

    let paymentsMonth = this.paymentsRepository.find(userId, month);
    let previousMonthPayments = this.paymentsRepository.find(
      userId,
      previousMonth
    );

    if (previousMonthPayments.length === 0) {
      return [];
    }

    return [{ amount: 200, category: 'food'}];
  }
}
