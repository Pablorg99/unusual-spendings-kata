import { UnusualSpendingsService } from '../../src/UnusualSpendingsService';

describe('UnusualSpendingsService', () => {
    test('should call alert sender with the categories with unusual payment amount', () => {
        const unusualSpendingsDetector = {run: jest.fn(() => [{category: 'food', amount: 200}, {category: 'transport', amount: 100}])};
        const alertSender = {run: jest.fn()};
        const unusualSpendingsService = new UnusualSpendingsService(unusualSpendingsDetector, alertSender);
        const userId = '1234';

        unusualSpendingsService.run(userId);

        expect(alertSender.run).toHaveBeenCalledWith(userId, [{category: 'food', amount: 200}, {category: 'transport', amount: 100}]);
    });

    test('should not call alert sender when there are not any unusual spending', () => {
        const unusualSpendingsDetector = {run: jest.fn(() => [])};
        const alertSender = {run: jest.fn()};
        const unusualSpendingsService = new UnusualSpendingsService(unusualSpendingsDetector, alertSender);
        const userId = '1234';

        unusualSpendingsService.run(userId);

        expect(alertSender.run).not.toHaveBeenCalled();
    });
});
