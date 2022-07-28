import { UnusualSpendingsDetector } from '../../src/UnusualSpendingsDetector';

describe('UnusualSpendingsDetector', () => {
  xtest('should not return any payment when there are not any', () => {
    const paymentsRepository = { find: jest.fn(() => []) };
    const calendar = {
      getCurrentMonth: () => '2020-02',
      getPreviousMonth: () => '2020-01',
    };
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );
    const userId = '1234';

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-02');
    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-01');
    expect(unusualSpendings).toEqual([]);
  });

  test('should not return any payments when there are not previous payments', () => {
    const paymentsMonth = [
      paymentWith('food', 200, '2020-02'),
      paymentWith('transport', 100, '2020-02'),
    ];
    const paymentsPrevious = [];
    const paymentsRepository = {
      find: jest.fn().mockImplementation((userId, month) => {
        if (userId === '1234' && month === '2020-02') {
          return paymentsMonth;
        } else if (userId === '1234' && month === '2020-01') {
          return paymentsPrevious;
        }
      }),
    };
    const calendar = {
      getCurrentMonth: () => '2020-02',
      getPreviousMonth: () => '2020-01',
    };
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );
    const userId = '1234';

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-02');
    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-01');
    const expectedUnusualSpendings = []
    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  test('should not return any payments when there are not previous payments', () => {
    const paymentsMonth = [ paymentWith('food', 200, '2020-02') ];
    const paymentsPrevious = [ paymentWith('food', 100, '2020-01') ];
    const paymentsRepository = {
      find: jest.fn().mockImplementation((userId, month) => {
        if (userId === '1234' && month === '2020-02') {
          return paymentsMonth;
        } else if (userId === '1234' && month === '2020-01') {
          return paymentsPrevious;
        }
      }),
    };
    const calendar = {
      getCurrentMonth: () => '2020-02',
      getPreviousMonth: () => '2020-01',
    };
    const unusualSpendingsDetector = new UnusualSpendingsDetector(
      paymentsRepository,
      calendar
    );
    const userId = '1234';

    const unusualSpendings = unusualSpendingsDetector.run(userId);

    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-02');
    expect(paymentsRepository.find).toHaveBeenCalledWith(userId, '2020-01');
    const expectedUnusualSpendings = [unusualSpendingWith('food', 200)]
    expect(unusualSpendings).toEqual(expectedUnusualSpendings);
  });

  function paymentWith(category, amount, month) {
    return { category, amount, month };
  }


function unusualSpendingWith(category , amount) {
  return { category, amount };
}
});
