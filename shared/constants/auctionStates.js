/**
 * Auction state constants and transitions
 * This module defines all possible auction states and their valid transitions
 */

/**
 * Core auction states
 */
export const AUCTION_STATES = {
  // Draft states
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  REJECTED: 'rejected',
  
  // Active states
  SCHEDULED: 'scheduled',
  STARTING: 'starting',
  LIVE: 'live',
  EXTENDED: 'extended',
  
  // Ending states
  ENDING: 'ending',
  ENDED: 'ended',
  COMPLETED: 'completed',
  
  // Cancelled/Problem states
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  FAILED: 'failed'
};

/**
 * Auction state categories
 */
export const AUCTION_STATE_CATEGORIES = {
  DRAFT: [
    AUCTION_STATES.DRAFT,
    AUCTION_STATES.PENDING_REVIEW,
    AUCTION_STATES.REJECTED
  ],
  ACTIVE: [
    AUCTION_STATES.SCHEDULED,
    AUCTION_STATES.STARTING,
    AUCTION_STATES.LIVE,
    AUCTION_STATES.EXTENDED
  ],
  ENDED: [
    AUCTION_STATES.ENDING,
    AUCTION_STATES.ENDED,
    AUCTION_STATES.COMPLETED
  ],
  CANCELLED: [
    AUCTION_STATES.CANCELLED,
    AUCTION_STATES.SUSPENDED,
    AUCTION_STATES.EXPIRED,
    AUCTION_STATES.FAILED
  ]
};

/**
 * Valid state transitions
 * Each state maps to an array of valid next states
 */
export const AUCTION_STATE_TRANSITIONS = {
  [AUCTION_STATES.DRAFT]: [
    AUCTION_STATES.PENDING_REVIEW,
    AUCTION_STATES.SCHEDULED,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.PENDING_REVIEW]: [
    AUCTION_STATES.SCHEDULED,
    AUCTION_STATES.REJECTED,
    AUCTION_STATES.DRAFT
  ],
  [AUCTION_STATES.REJECTED]: [
    AUCTION_STATES.DRAFT,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.SCHEDULED]: [
    AUCTION_STATES.STARTING,
    AUCTION_STATES.LIVE,
    AUCTION_STATES.CANCELLED,
    AUCTION_STATES.SUSPENDED
  ],
  [AUCTION_STATES.STARTING]: [
    AUCTION_STATES.LIVE,
    AUCTION_STATES.FAILED,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.LIVE]: [
    AUCTION_STATES.EXTENDED,
    AUCTION_STATES.ENDING,
    AUCTION_STATES.ENDED,
    AUCTION_STATES.SUSPENDED,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.EXTENDED]: [
    AUCTION_STATES.ENDING,
    AUCTION_STATES.ENDED,
    AUCTION_STATES.SUSPENDED,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.ENDING]: [
    AUCTION_STATES.ENDED,
    AUCTION_STATES.EXTENDED,
    AUCTION_STATES.FAILED
  ],
  [AUCTION_STATES.ENDED]: [
    AUCTION_STATES.COMPLETED,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.COMPLETED]: [],
  [AUCTION_STATES.CANCELLED]: [],
  [AUCTION_STATES.SUSPENDED]: [
    AUCTION_STATES.SCHEDULED,
    AUCTION_STATES.LIVE,
    AUCTION_STATES.CANCELLED
  ],
  [AUCTION_STATES.EXPIRED]: [],
  [AUCTION_STATES.FAILED]: [
    AUCTION_STATES.SCHEDULED,
    AUCTION_STATES.CANCELLED
  ]
};

/**
 * State display names in Arabic
 */
export const AUCTION_STATE_NAMES = {
  [AUCTION_STATES.DRAFT]: 'مسودة',
  [AUCTION_STATES.PENDING_REVIEW]: 'في انتظار المراجعة',
  [AUCTION_STATES.REJECTED]: 'مرفوض',
  [AUCTION_STATES.SCHEDULED]: 'مجدول',
  [AUCTION_STATES.STARTING]: 'يبدأ قريباً',
  [AUCTION_STATES.LIVE]: 'نشط الآن',
  [AUCTION_STATES.EXTENDED]: 'تم التمديد',
  [AUCTION_STATES.ENDING]: 'ينتهي قريباً',
  [AUCTION_STATES.ENDED]: 'انتهى',
  [AUCTION_STATES.COMPLETED]: 'مكتمل',
  [AUCTION_STATES.CANCELLED]: 'ملغي',
  [AUCTION_STATES.SUSPENDED]: 'معلق',
  [AUCTION_STATES.EXPIRED]: 'منتهي الصلاحية',
  [AUCTION_STATES.FAILED]: 'فشل'
};

/**
 * State descriptions in Arabic
 */
export const AUCTION_STATE_DESCRIPTIONS = {
  [AUCTION_STATES.DRAFT]: 'المزاد في مرحلة الإعداد',
  [AUCTION_STATES.PENDING_REVIEW]: 'في انتظار مراجعة الإدارة',
  [AUCTION_STATES.REJECTED]: 'تم رفض المزاد من قبل الإدارة',
  [AUCTION_STATES.SCHEDULED]: 'المزاد مجدول للبدء في الوقت المحدد',
  [AUCTION_STATES.STARTING]: 'المزاد سيبدأ خلال دقائق',
  [AUCTION_STATES.LIVE]: 'المزاد نشط ويمكن المشاركة فيه',
  [AUCTION_STATES.EXTENDED]: 'تم تمديد وقت المزاد',
  [AUCTION_STATES.ENDING]: 'المزاد ينتهي خلال دقائق',
  [AUCTION_STATES.ENDED]: 'انتهى المزاد وتم تحديد الفائز',
  [AUCTION_STATES.COMPLETED]: 'تم إكمال جميع إجراءات المزاد',
  [AUCTION_STATES.CANCELLED]: 'تم إلغاء المزاد',
  [AUCTION_STATES.SUSPENDED]: 'تم تعليق المزاد مؤقتاً',
  [AUCTION_STATES.EXPIRED]: 'انتهت صلاحية المزاد',
  [AUCTION_STATES.FAILED]: 'فشل في تشغيل المزاد'
};

/**
 * State colors for UI display
 */
export const AUCTION_STATE_COLORS = {
  [AUCTION_STATES.DRAFT]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    badge: 'bg-gray-500'
  },
  [AUCTION_STATES.PENDING_REVIEW]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    badge: 'bg-yellow-500'
  },
  [AUCTION_STATES.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-500'
  },
  [AUCTION_STATES.SCHEDULED]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    badge: 'bg-blue-500'
  },
  [AUCTION_STATES.STARTING]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    badge: 'bg-orange-500'
  },
  [AUCTION_STATES.LIVE]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    badge: 'bg-green-500'
  },
  [AUCTION_STATES.EXTENDED]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    badge: 'bg-purple-500'
  },
  [AUCTION_STATES.ENDING]: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    badge: 'bg-amber-500'
  },
  [AUCTION_STATES.ENDED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    badge: 'bg-gray-500'
  },
  [AUCTION_STATES.COMPLETED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    badge: 'bg-green-600'
  },
  [AUCTION_STATES.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-500'
  },
  [AUCTION_STATES.SUSPENDED]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    badge: 'bg-orange-600'
  },
  [AUCTION_STATES.EXPIRED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    badge: 'bg-gray-400'
  },
  [AUCTION_STATES.FAILED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-600'
  }
};

/**
 * State-specific actions that can be performed
 */
export const AUCTION_STATE_ACTIONS = {
  [AUCTION_STATES.DRAFT]: [
    'edit',
    'submit_for_review',
    'schedule',
    'delete',
    'duplicate'
  ],
  [AUCTION_STATES.PENDING_REVIEW]: [
    'approve',
    'reject',
    'request_changes',
    'cancel'
  ],
  [AUCTION_STATES.REJECTED]: [
    'edit',
    'resubmit',
    'delete'
  ],
  [AUCTION_STATES.SCHEDULED]: [
    'edit_details',
    'start_early',
    'postpone',
    'cancel',
    'promote'
  ],
  [AUCTION_STATES.STARTING]: [
    'monitor',
    'force_start',
    'cancel'
  ],
  [AUCTION_STATES.LIVE]: [
    'monitor',
    'extend',
    'end_early',
    'suspend',
    'moderate'
  ],
  [AUCTION_STATES.EXTENDED]: [
    'monitor',
    'extend_again',
    'end_now',
    'suspend'
  ],
  [AUCTION_STATES.ENDING]: [
    'monitor',
    'extend_last_chance',
    'force_end'
  ],
  [AUCTION_STATES.ENDED]: [
    'view_results',
    'contact_winner',
    'process_payment',
    'mark_completed',
    'dispute'
  ],
  [AUCTION_STATES.COMPLETED]: [
    'view_results',
    'generate_report',
    'rate_experience',
    'archive'
  ],
  [AUCTION_STATES.CANCELLED]: [
    'view_details',
    'export_data',
    'archive'
  ],
  [AUCTION_STATES.SUSPENDED]: [
    'resume',
    'cancel',
    'investigate'
  ],
  [AUCTION_STATES.EXPIRED]: [
    'archive',
    'delete'
  ],
  [AUCTION_STATES.FAILED]: [
    'retry',
    'reschedule',
    'cancel',
    'investigate'
  ]
};

/**
 * State utility functions
 */
export const AuctionStateUtils = {
  /**
   * Check if state transition is valid
   * @param {string} fromState Current state
   * @param {string} toState Target state
   * @returns {boolean}
   */
  isValidTransition(fromState, toState) {
    const validTransitions = AUCTION_STATE_TRANSITIONS[fromState] || [];
    return validTransitions.includes(toState);
  },

  /**
   * Get all possible next states
   * @param {string} currentState Current auction state
   * @returns {Array<string>}
   */
  getValidNextStates(currentState) {
    return AUCTION_STATE_TRANSITIONS[currentState] || [];
  },

  /**
   * Check if auction is in draft phase
   * @param {string} state Auction state
   * @returns {boolean}
   */
  isDraft(state) {
    return AUCTION_STATE_CATEGORIES.DRAFT.includes(state);
  },

  /**
   * Check if auction is active
   * @param {string} state Auction state
   * @returns {boolean}
   */
  isActive(state) {
    return AUCTION_STATE_CATEGORIES.ACTIVE.includes(state);
  },

  /**
   * Check if auction has ended
   * @param {string} state Auction state
   * @returns {boolean}
   */
  hasEnded(state) {
    return AUCTION_STATE_CATEGORIES.ENDED.includes(state);
  },

  /**
   * Check if auction is cancelled
   * @param {string} state Auction state
   * @returns {boolean}
   */
  isCancelled(state) {
    return AUCTION_STATE_CATEGORIES.CANCELLED.includes(state);
  },

  /**
   * Check if auction accepts bids
   * @param {string} state Auction state
   * @returns {boolean}
   */
  acceptsBids(state) {
    return [AUCTION_STATES.LIVE, AUCTION_STATES.EXTENDED].includes(state);
  },

  /**
   * Check if auction can be edited
   * @param {string} state Auction state
   * @returns {boolean}
   */
  isEditable(state) {
    return [
      AUCTION_STATES.DRAFT,
      AUCTION_STATES.REJECTED,
      AUCTION_STATES.SCHEDULED
    ].includes(state);
  },

  /**
   * Get state display name
   * @param {string} state Auction state
   * @returns {string}
   */
  getStateName(state) {
    return AUCTION_STATE_NAMES[state] || 'غير معروف';
  },

  /**
   * Get state description
   * @param {string} state Auction state
   * @returns {string}
   */
  getStateDescription(state) {
    return AUCTION_STATE_DESCRIPTIONS[state] || '';
  },

  /**
   * Get state colors for UI
   * @param {string} state Auction state
   * @returns {Object}
   */
  getStateColors(state) {
    return AUCTION_STATE_COLORS[state] || AUCTION_STATE_COLORS[AUCTION_STATES.DRAFT];
  },

  /**
   * Get available actions for state
   * @param {string} state Auction state
   * @returns {Array<string>}
   */
  getAvailableActions(state) {
    return AUCTION_STATE_ACTIONS[state] || [];
  },

  /**
   * Get state category
   * @param {string} state Auction state
   * @returns {string}
   */
  getStateCategory(state) {
    for (const [category, states] of Object.entries(AUCTION_STATE_CATEGORIES)) {
      if (states.includes(state)) return category;
    }
    return 'UNKNOWN';
  },

  /**
   * Check if state requires immediate attention
   * @param {string} state Auction state
   * @returns {boolean}
   */
  requiresAttention(state) {
    return [
      AUCTION_STATES.PENDING_REVIEW,
      AUCTION_STATES.STARTING,
      AUCTION_STATES.ENDING,
      AUCTION_STATES.SUSPENDED,
      AUCTION_STATES.FAILED
    ].includes(state);
  },

  /**
   * Get timeline position (0-100)
   * @param {string} state Auction state
   * @returns {number}
   */
  getTimelinePosition(state) {
    const positions = {
      [AUCTION_STATES.DRAFT]: 5,
      [AUCTION_STATES.PENDING_REVIEW]: 15,
      [AUCTION_STATES.REJECTED]: 10,
      [AUCTION_STATES.SCHEDULED]: 25,
      [AUCTION_STATES.STARTING]: 35,
      [AUCTION_STATES.LIVE]: 60,
      [AUCTION_STATES.EXTENDED]: 70,
      [AUCTION_STATES.ENDING]: 85,
      [AUCTION_STATES.ENDED]: 95,
      [AUCTION_STATES.COMPLETED]: 100,
      [AUCTION_STATES.CANCELLED]: 0,
      [AUCTION_STATES.SUSPENDED]: 50,
      [AUCTION_STATES.EXPIRED]: 0,
      [AUCTION_STATES.FAILED]: 0
    };
    return positions[state] || 0;
  }
};

export default {
  AUCTION_STATES,
  AUCTION_STATE_CATEGORIES,
  AUCTION_STATE_TRANSITIONS,
  AUCTION_STATE_NAMES,
  AUCTION_STATE_DESCRIPTIONS,
  AUCTION_STATE_COLORS,
  AUCTION_STATE_ACTIONS,
  AuctionStateUtils
};