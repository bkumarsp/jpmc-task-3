import { ServerRespond } from './DataStreamer';

export interface Row {
  ABC_price: number, 
  DEF_price: number, 
  ratio: number, 
  upper_bound: number, 
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    //Compute the datapoints using ServerResponds.
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;

    const ratio = priceDEF? priceABC / priceDEF : 0; //to avoid zero division exception
    const upperBound = 1 + 0.045; // 4.5 percent limit
    const lowerBound = 1 - 0.045;

    return {
      ABC_price : priceABC,
      DEF_price : priceDEF,
      ratio : ratio,
      upper_bound: upperBound, 
      lower_bound : lowerBound,
      trigger_alert: (ratio && (ratio > upperBound) || (ratio < lowerBound)) ? ratio : undefined,
      timestamp: (serverResponds[0].timestamp > serverResponds[1].timestamp) ? serverResponds[0].timestamp : serverResponds[1].timestamp,
    };
    
  }
}
