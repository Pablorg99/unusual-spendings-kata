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
        unusualSpendingsDetector.run.mockReturnValueOnce([{category: 'food', amount: 200}, {category: 'transport', amount: 100}]);

        unusualSpendingsService.run(userId);

        expect(unusualSpendingsDetector.run).toHaveBeenCalledWith(userId);
        expect(alertSender.run).toHaveBeenCalledWith(userId, [{category: 'food', amount: 200}, {category: 'transport', amount: 100}]);
    });

    test('should not call alert sender when there are not any unusual spending', () => {
        unusualSpendingsDetector.run.mockReturnValueOnce([]);

        unusualSpendingsService.run(userId);

        expect(unusualSpendingsDetector.run).toHaveBeenCalledWith(userId);
        expect(alertSender.run).not.toHaveBeenCalled();
    });
});
