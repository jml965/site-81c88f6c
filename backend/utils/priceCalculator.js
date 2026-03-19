/**
 * Price calculation utilities for auction bidding system
 */

/**
 * Calculate the next minimum bid amount
 */
const calculateNextMinimumBid = ({ currentPrice, minimumIncrement, currentHighestBid = 0 }) => {
  const basePrice = Math.max(parseFloat(currentPrice), parseFloat(currentHighestBid));
  const increment = parseFloat(minimumIncrement);
  
  return parseFloat((basePrice + increment).toFixed(2));
};

/**
 * Calculate suggested bid increments
 */
const calculateBidIncrement = (currentPrice) => {
  const price = parseFloat(currentPrice);
  
  // Dynamic increment based on current price ranges
  if (price < 100) {
    return [5, 10, 25, 50];
  } else if (price < 500) {
    return [10, 25, 50, 100];
  } else if (price < 1000) {
    return [25, 50, 100, 250];
  } else if (price < 5000) {
    return [50, 100, 250, 500];
  } else if (price < 10000) {
    return [100, 250, 500, 1000];
  } else if (price < 50000) {
    return [250, 500, 1000, 2500];
  } else {
    return [500, 1000, 2500, 5000];
  }
};

/**
 * Calculate auction time remaining percentage
 */
const calculateTimeProgress = (startTime, endTime, currentTime = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date(currentTime);
  
  const totalDuration = end - start;
  const elapsed = now - start;
  
  if (elapsed < 0) return 0; // Hasn't started yet
  if (elapsed > totalDuration) return 100; // Has ended
  
  return Math.round((elapsed / totalDuration) * 100);
};

/**
 * Calculate time remaining in human readable format
 */
const calculateTimeRemaining = (endTime, currentTime = new Date()) => {
  const end = new Date(endTime);
  const now = new Date(currentTime);
  const diff = end - now;
  
  if (diff <= 0) {
    return { 
      isEnded: true, 
      display: 'انتهى المزاد',
      totalSeconds: 0
    };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  let display = '';
  
  if (days > 0) {
    display = `${days} يوم ${hours} ساعة`;
  } else if (hours > 0) {
    display = `${hours} ساعة ${minutes} دقيقة`;
  } else if (minutes > 0) {
    display = `${minutes} دقيقة ${seconds} ثانية`;
  } else {
    display = `${seconds} ثانية`;
  }
  
  return {
    isEnded: false,
    display,
    totalSeconds: Math.floor(diff / 1000),
    days,
    hours,
    minutes,
    seconds
  };
};

/**
 * Calculate bid statistics
 */
const calculateBidStatistics = (bids) => {
  if (!bids || bids.length === 0) {
    return {
      count: 0,
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      range: 0,
      standardDeviation: 0
    };
  }
  
  const amounts = bids.map(bid => parseFloat(bid.amount)).sort((a, b) => a - b);
  const count = amounts.length;
  const sum = amounts.reduce((a, b) => a + b, 0);
  const average = sum / count;
  
  // Median calculation
  const median = count % 2 === 0 
    ? (amounts[count / 2 - 1] + amounts[count / 2]) / 2
    : amounts[Math.floor(count / 2)];
  
  const min = amounts[0];
  const max = amounts[amounts.length - 1];
  const range = max - min;
  
  // Standard deviation
  const squaredDiffs = amounts.map(amount => Math.pow(amount - average, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / count;
  const standardDeviation = Math.sqrt(avgSquaredDiff);
  
  return {
    count,
    average: parseFloat(average.toFixed(2)),
    median: parseFloat(median.toFixed(2)),
    min,
    max,
    range: parseFloat(range.toFixed(2)),
    standardDeviation: parseFloat(standardDeviation.toFixed(2))
  };
};

/**
 * Calculate price increase percentage
 */
const calculatePriceIncrease = (startingPrice, currentPrice) => {
  const starting = parseFloat(startingPrice);
  const current = parseFloat(currentPrice);
  
  if (starting === 0) return 0;
  
  const increase = ((current - starting) / starting) * 100;
  return parseFloat(increase.toFixed(2));
};

/**
 * Calculate auction heat level based on activity
 */
const calculateAuctionHeat = ({ bidCount, uniqueBidders, timeProgress, priceIncrease }) => {
  let heatScore = 0;
  
  // Bid count factor (0-30 points)
  if (bidCount >= 50) heatScore += 30;
  else if (bidCount >= 20) heatScore += 20;
  else if (bidCount >= 10) heatScore += 15;
  else if (bidCount >= 5) heatScore += 10;
  else if (bidCount >= 1) heatScore += 5;
  
  // Unique bidders factor (0-25 points)
  if (uniqueBidders >= 20) heatScore += 25;
  else if (uniqueBidders >= 10) heatScore += 20;
  else if (uniqueBidders >= 5) heatScore += 15;
  else if (uniqueBidders >= 3) heatScore += 10;
  else if (uniqueBidders >= 2) heatScore += 5;
  
  // Time progress factor (0-20 points) - more heat as auction progresses
  if (timeProgress >= 90) heatScore += 20;
  else if (timeProgress >= 70) heatScore += 15;
  else if (timeProgress >= 50) heatScore += 10;
  else if (timeProgress >= 25) heatScore += 5;
  
  // Price increase factor (0-25 points)
  if (priceIncrease >= 500) heatScore += 25;
  else if (priceIncrease >= 200) heatScore += 20;
  else if (priceIncrease >= 100) heatScore += 15;
  else if (priceIncrease >= 50) heatScore += 10;
  else if (priceIncrease >= 20) heatScore += 5;
  
  // Determine heat level
  let heatLevel = 'cold'; // Default
  let heatText = 'بارد';
  let heatColor = '#64748b'; // gray
  
  if (heatScore >= 80) {
    heatLevel = 'blazing';
    heatText = 'متوهج';
    heatColor = '#dc2626'; // red-600
  } else if (heatScore >= 60) {
    heatLevel = 'hot';
    heatText = 'ساخن';
    heatColor = '#ea580c'; // orange-600
  } else if (heatScore >= 40) {
    heatLevel = 'warm';
    heatText = 'دافئ';
    heatColor = '#d97706'; // amber-600
  } else if (heatScore >= 20) {
    heatLevel = 'cool';
    heatText = 'معتدل';
    heatColor = '#0891b2'; // cyan-600
  }
  
  return {
    score: heatScore,
    level: heatLevel,
    text: heatText,
    color: heatColor
  };
};

/**
 * Calculate estimated final price based on current trends
 */
const calculateEstimatedFinalPrice = ({ startingPrice, currentPrice, bidCount, timeProgress, uniqueBidders }) => {
  const starting = parseFloat(startingPrice);
  const current = parseFloat(currentPrice);
  
  if (timeProgress >= 100) {
    return current; // Auction ended
  }
  
  // Base growth rate
  let growthMultiplier = 1;
  
  // Factor in bid activity
  if (bidCount >= 20) growthMultiplier += 0.3;
  else if (bidCount >= 10) growthMultiplier += 0.2;
  else if (bidCount >= 5) growthMultiplier += 0.1;
  
  // Factor in unique bidders (competition)
  if (uniqueBidders >= 10) growthMultiplier += 0.4;
  else if (uniqueBidders >= 5) growthMultiplier += 0.2;
  else if (uniqueBidders >= 3) growthMultiplier += 0.1;
  
  // Factor in time remaining (last-minute rush)
  if (timeProgress >= 90) growthMultiplier += 0.5; // Final 10%
  else if (timeProgress >= 80) growthMultiplier += 0.3; // Final 20%
  else if (timeProgress >= 70) growthMultiplier += 0.1; // Final 30%
  
  const currentIncrease = current - starting;
  const estimatedAdditionalIncrease = currentIncrease * (growthMultiplier - 1);
  const estimatedFinal = current + estimatedAdditionalIncrease;
  
  return Math.max(current, parseFloat(estimatedFinal.toFixed(2)));
};

/**
 * Format currency for display
 */
const formatCurrency = (amount, currency = 'SAR', locale = 'ar-SA') => {
  const number = parseFloat(amount);
  
  if (isNaN(number)) return '0 ريال';
  
  if (locale === 'ar-SA') {
    // Arabic formatting
    const formatted = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number);
    
    return formatted.replace('ر.س.', 'ريال');
  } else {
    // English formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number);
  }
};

/**
 * Calculate bid confidence score (likelihood of winning)
 */
const calculateBidConfidence = ({ userBidAmount, currentHighestBid, timeRemaining, bidCount }) => {
  let confidence = 0;
  
  if (!userBidAmount || !currentHighestBid) {
    return { score: 0, level: 'none', text: 'غير محدد' };
  }
  
  const userAmount = parseFloat(userBidAmount);
  const highestAmount = parseFloat(currentHighestBid);
  
  // Base confidence from bid amount difference
  if (userAmount >= highestAmount) {
    confidence = 60; // Leading
    
    const advantage = userAmount - highestAmount;
    const percentageAdvantage = (advantage / highestAmount) * 100;
    
    if (percentageAdvantage >= 20) confidence += 30;
    else if (percentageAdvantage >= 10) confidence += 20;
    else if (percentageAdvantage >= 5) confidence += 10;
    else confidence += 5;
  } else {
    const deficit = highestAmount - userAmount;
    const percentageDeficit = (deficit / highestAmount) * 100;
    
    if (percentageDeficit <= 5) confidence = 40;
    else if (percentageDeficit <= 10) confidence = 25;
    else if (percentageDeficit <= 20) confidence = 15;
    else confidence = 5;
  }
  
  // Time factor
  if (timeRemaining < 300) { // Last 5 minutes
    confidence -= 15; // Higher chance of being outbid
  } else if (timeRemaining < 1800) { // Last 30 minutes
    confidence -= 10;
  }
  
  // Competition factor
  if (bidCount >= 30) confidence -= 20;
  else if (bidCount >= 15) confidence -= 15;
  else if (bidCount >= 5) confidence -= 10;
  
  // Ensure confidence stays within bounds
  confidence = Math.max(0, Math.min(100, confidence));
  
  let level, text;
  if (confidence >= 80) {
    level = 'very-high';
    text = 'عالية جداً';
  } else if (confidence >= 60) {
    level = 'high';
    text = 'عالية';
  } else if (confidence >= 40) {
    level = 'medium';
    text = 'متوسطة';
  } else if (confidence >= 20) {
    level = 'low';
    text = 'منخفضة';
  } else {
    level = 'very-low';
    text = 'منخفضة جداً';
  }
  
  return {
    score: Math.round(confidence),
    level,
    text
  };
};

module.exports = {
  calculateNextMinimumBid,
  calculateBidIncrement,
  calculateTimeProgress,
  calculateTimeRemaining,
  calculateBidStatistics,
  calculatePriceIncrease,
  calculateAuctionHeat,
  calculateEstimatedFinalPrice,
  formatCurrency,
  calculateBidConfidence
};