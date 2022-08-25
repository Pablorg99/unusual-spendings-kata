import { UnusualSpendingsDetector } from '../../src/UnusualSpendingsDetector';

describe('UnusualSpendingsDetector', () => {
  const currentMonth = '2020-02';
  const previousMonth = '2020-01';
  const calendar = {
    getCurrentMonth: () => currentMonth,
    getPreviousMonth: () => previousMonth,
  };
  const userId = '1234';

  test('should not return any unusual spending when there are not any payments', () => {
    const paymentsRepository = getPaymentsRepositoryReturning([], []);
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual([]);
  });

  test('should return an unusual spending when there has been an increase between month payments', () => {
    const paymentsMonth = [paymentWith('food', 200, currentMonth)];
    const paymentsPrevious = [paymentWith('food', 100, previousMonth)];
    const expectedUnusualSpendings = [unusualSpendingWith('food', 200)];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should not return any unusual spending when there are not payments in current month', () => {
    const paymentsMonth = [];
    const paymentsPrevious = [
      paymentWith('food', 200, currentMonth),
    ];
    const expectedUnusualSpendings = [];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should not return any unusual spending when there is not any previous payment for a category', () => {
    const paymentsMonth = [paymentWith('transport', 200, currentMonth)];
    const paymentsPrevious = [paymentWith('food', 200, currentMonth)];
    const expectedUnusualSpendings = [];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test.each([[100, 100], [149.99, 100]])('should not return any unusual spending when there is not an increase greater or equal than 50% between month payments', (currentMonthPaymentAmount, previousMonthPaymentAmount) => {
    const paymentsMonth = [paymentWith('food', currentMonthPaymentAmount, currentMonth)];
    const paymentsPrevious = [paymentWith('food', previousMonthPaymentAmount, previousMonth)];
    const expectedUnusualSpendings = [];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should return an unusual spending when there has been an increase between month payments with multiple payments in current month', () => {
    const paymentsMonth = [paymentWith('food', 100, currentMonth), paymentWith('food', 100, currentMonth)];
    const paymentsPrevious = [paymentWith('food', 100, previousMonth)];
    const expectedUnusualSpendings = [unusualSpendingWith('food', 200)];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should not return any unusual spending when there aren\'t increases between months with multiple payments in previous month', () => {
    const paymentsMonth = [paymentWith('food', 150, previousMonth)];
    const paymentsPrevious = [paymentWith('food', 100, currentMonth), paymentWith('food', 100, currentMonth)];
    const expectedUnusualSpendings = [];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should compute unusual spendings for multiple categories', () => {
    const paymentsMonth = [paymentWith('food', 100, previousMonth), paymentWith('transport', 200, previousMonth)];
    const paymentsPrevious = [paymentWith('food', 100, currentMonth), paymentWith('transport', 100, currentMonth)];
    const expectedUnusualSpendings = [unusualSpendingWith('transport', 200)];
    const paymentsRepository = getPaymentsRepositoryReturning(
      paymentsMonth,
      paymentsPrevious
    );
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  function paymentWith(category, amount, month) {
    return { category, amount, month };
  }

  function unusualSpendingWith(category, amount) {
    return { category, amount };
  }

  function getPaymentsRepositoryReturning(
    currentMonthPayments,
    previousMonthPayments
  ) {
    return {
      find: jest.fn().mockImplementation((userId, month) => {
        if (month === currentMonth) {
          return currentMonthPayments;
        } else if (month === previousMonth) {
          return previousMonthPayments;
        }
      }),
    };
  }
});
