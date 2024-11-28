import { GoogleTrendUpdate } from '../interfaces/google-trend-update';

export class MapperService {
    public static mapToGoogleTrendUpdate(data: any): GoogleTrendUpdate {
        return {
            trendText: data.Trends,
            stared: data.Started,
            ended: data.Ended,
            traffic: data['Search volume']
        };
    }
}