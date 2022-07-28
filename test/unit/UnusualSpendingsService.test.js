import { UnusualSpendingsService } from '../../src/UnusualSpendingsService';

describe('UnusualSpendingsService', () => {
    let alertSender;
    let unusualSpendingsDetector;
    let unusualSpendingsService;
    const userId = '1234';

    beforeEach(() => {
        alertSender = {run: jest.fn()};
        unusualSpendingsDetector = {run: jest.fn()};
        unusualSpendingsService = new UnusualSpendingsService(unusualSpendingsDetector, alertSender);
    })

    test('should call alert sender with the categories with unusual payment amount', () => {
        const unusualSpendings = [unusualSpendingWith('food', 200), unusualSpendingWith('transport', 100)]
        unusualSpendingsDetector.run.mockReturnValueOnce(unusualSpendings);

        unusualSpendingsService.run(userId);

        expect(unusualSpendingsDetector.run).toHaveBeenCalledWith(userId);
        expect(alertSender.run).toHaveBeenCalledWith(userId, unusualSpendings);
    });

    test('should not call alert sender when there are not any unusual spending', () => {
        unusualSpendingsDetector.run.mockReturnValueOnce([]);

        unusualSpendingsService.run(userId);

        expect(unusualSpendingsDetector.run).toHaveBeenCalledWith(userId);
        expect(alertSender.run).not.toHaveBeenCalled();
    });
});

function unusualSpendingWith(category , amount) {
    return { category, amount };
}
